# CoSigned — Smart Contract Deep Design
## Day 2: Full Pseudocode, State Machine, Edge Cases, Security Analysis

---

## 1. State Machine (Complete)

Every Bond is a state machine. These are ALL valid transitions:

```
                    createBond()
                        │
                        ▼
                   ┌─────────┐
                   │ PENDING │
                   └─────────┘
                        │
              acceptBond() [learner, payable]
                        │
                        ▼
                   ┌────────┐
                   │ ACTIVE │ ◄─────────────────────────────────────┐
                   └────────┘                                        │
                   │        │                                        │
     signCompletion()      signCompletion()              (during dispute window,
      [mentor calls]        [learner calls]               other party can still
           │                      │                       sign to complete)
           ▼                      ▼                                  │
   ┌──────────────┐      ┌───────────────┐                          │
   │ MENTORSIGNED │      │ LEARNERSIGNED │                          │
   └──────────────┘      └───────────────┘                          │
           │                      │                                  │
  signCompletion()      signCompletion()                             │
   [learner calls]       [mentor calls]                              │
           │                      │                                  │
           └──────────┬───────────┘                                  │
                      ▼                                              │
                ┌───────────┐                                        │
                │ COMPLETED │                                        │
                └───────────┘                                        │
                      │                                              │
           ┌──────────┴──────────┐                                   │
           ▼                     ▼                                   │
    Refund stake           Mint 2x NFTs                              │
    to learner          (MENTOR_PROOF +                              │
                         LEARNER_PROOF)                              │
                                                                     │
   ── DISPUTE PATH ──────────────────────────────────────────────────┘
                                                                     
   From ACTIVE only, after deadline:                                 
                                                                     
   disputeBond() [mentor OR learner]                                 
           │                                                         
           ▼                                                         
      ┌──────────┐                                                   
      │ DISPUTED │  ← stores disputeOpenedAt                        
      └──────────┘                                                   
           │                                                         
           │  [7 days pass, no signCompletion]                       
           ▼                                                         
   resolveDispute()                                                  
           │                                                         
           ▼                                                         
   Refund stake to learner                                           
   Bond stays DISPUTED (terminal state — no NFTs minted)            
```

**Terminal states:** `COMPLETED` and `DISPUTED` (after resolveDispute). No transitions out.

---

## 2. CoSigned.sol — Full Pseudocode

### State Variables

```solidity
// Core storage
mapping(uint256 => Bond) public bonds
mapping(address => uint256[]) public mentorBonds
mapping(address => uint256[]) public learnerBonds
uint256 public bondCounter                          // starts at 0, first bond is ID 1

// Reference to NFT contract
ICoSignedNFT public nftContract

// Reentrancy guard
bool private _locked
```

### Bond Struct (Final)

```solidity
struct Bond {
    uint256 id;
    address mentor;
    address learner;
    string skillTitle;          // max ~100 chars enforced off-chain
    string successCriteria;     // max ~500 chars enforced off-chain
    uint256 stakeAmount;        // in wei — set when learner accepts
    BondStatus status;
    uint256 deadline;           // unix timestamp
    string ipfsHash;            // IPFS CID — e.g. "QmXyz..."
    bool mentorSigned;
    bool learnerSigned;
    uint256 disputeOpenedAt;    // 0 until dispute is raised
}
```

### Gas Packing Note
Solidity packs storage slots in 32-byte chunks. Ordering matters:
- `uint256` fields each take a full slot — no packing benefit
- `address` (20 bytes) + `bool` (1 byte) + `bool` (1 byte) = 22 bytes → fits in one slot
- Current struct ordering is acceptable for clarity; gas optimization is post-MVP

### Events

```solidity
event BondCreated(
    uint256 indexed bondId,
    address indexed mentor,
    address indexed learner,
    string skillTitle,
    uint256 deadline
);

event BondAccepted(
    uint256 indexed bondId,
    address indexed learner,
    uint256 stakeAmount
);

event BondSigned(
    uint256 indexed bondId,
    address indexed signer,
    bool mentorSigned,
    bool learnerSigned
);

event BondCompleted(
    uint256 indexed bondId,
    address indexed mentor,
    address indexed learner
);

event BondDisputed(
    uint256 indexed bondId,
    address indexed raisedBy,
    uint256 disputeOpenedAt
);

event DisputeResolved(
    uint256 indexed bondId,
    address indexed resolvedBy,
    uint256 refundedAmount
);
```

---

### `createBond()`

```
FUNCTION createBond(
    address learner,
    string skillTitle,
    string successCriteria,
    uint256 deadline,
    string ipfsHash
) external returns (uint256 bondId)

REQUIRES:
  learner != address(0)                         → "CoSigned: invalid learner address"
  learner != msg.sender                         → "CoSigned: mentor cannot be learner"
  deadline > block.timestamp                    → "CoSigned: deadline must be in future"
  bytes(skillTitle).length > 0                  → "CoSigned: skill title required"
  bytes(successCriteria).length > 0             → "CoSigned: success criteria required"

EXECUTE:
  bondCounter++
  bondId = bondCounter

  bonds[bondId] = Bond({
    id:               bondId,
    mentor:           msg.sender,
    learner:          learner,
    skillTitle:       skillTitle,
    successCriteria:  successCriteria,
    stakeAmount:      0,              // set on acceptBond
    status:           BondStatus.Pending,
    deadline:         deadline,
    ipfsHash:         ipfsHash,
    mentorSigned:     false,
    learnerSigned:    false,
    disputeOpenedAt:  0
  })

  mentorBonds[msg.sender].push(bondId)
  learnerBonds[learner].push(bondId)

EMIT: BondCreated(bondId, msg.sender, learner, skillTitle, deadline)
RETURN: bondId
```

---

### `acceptBond()`

```
FUNCTION acceptBond(uint256 bondId) external payable

REQUIRES:
  bonds[bondId].learner == msg.sender           → "CoSigned: not the designated learner"
  bonds[bondId].status == BondStatus.Pending    → "CoSigned: bond not in pending state"
  msg.value > 0                                 → "CoSigned: stake amount must be > 0"
  block.timestamp < bonds[bondId].deadline      → "CoSigned: bond deadline has passed"

EXECUTE:
  bonds[bondId].stakeAmount = msg.value
  bonds[bondId].status = BondStatus.Active

EMIT: BondAccepted(bondId, msg.sender, msg.value)

NOTE: ETH is now held in the contract. No transfer happens here.
      The contract balance increases by msg.value.
      Refund only happens on completion or dispute resolution.
```

---

### `signCompletion()`

```
FUNCTION signCompletion(uint256 bondId) external nonReentrant

REQUIRES:
  msg.sender == bonds[bondId].mentor
  OR msg.sender == bonds[bondId].learner        → "CoSigned: not a party to this bond"

  bonds[bondId].status == BondStatus.Active
  OR bonds[bondId].status == BondStatus.MentorSigned
  OR bonds[bondId].status == BondStatus.LearnerSigned
                                                → "CoSigned: bond not in signable state"

EXECUTE:
  IF msg.sender == bonds[bondId].mentor:
    REQUIRES: bonds[bondId].mentorSigned == false → "CoSigned: mentor already signed"
    bonds[bondId].mentorSigned = true

  IF msg.sender == bonds[bondId].learner:
    REQUIRES: bonds[bondId].learnerSigned == false → "CoSigned: learner already signed"
    bonds[bondId].learnerSigned = true

  // Update status to reflect who has signed
  IF bonds[bondId].mentorSigned AND NOT bonds[bondId].learnerSigned:
    bonds[bondId].status = BondStatus.MentorSigned

  IF bonds[bondId].learnerSigned AND NOT bonds[bondId].mentorSigned:
    bonds[bondId].status = BondStatus.LearnerSigned

  EMIT: BondSigned(bondId, msg.sender, bonds[bondId].mentorSigned, bonds[bondId].learnerSigned)

  // Check if both have signed → complete the bond
  IF bonds[bondId].mentorSigned AND bonds[bondId].learnerSigned:
    bonds[bondId].status = BondStatus.Completed

    // Refund stake BEFORE external calls (checks-effects-interactions)
    uint256 refund = bonds[bondId].stakeAmount
    bonds[bondId].stakeAmount = 0              // zero out before transfer
    (bool success, ) = bonds[bondId].learner.call{value: refund}("")
    REQUIRES: success → "CoSigned: stake refund failed"

    // Mint NFTs (external call — after state is finalized)
    _mintSoulboundNFTs(bondId)

    EMIT: BondCompleted(bondId, bonds[bondId].mentor, bonds[bondId].learner)
```

**Reentrancy analysis:**
- `stakeAmount` is zeroed BEFORE the `.call{value}` transfer
- State is set to `Completed` BEFORE external calls
- `nonReentrant` modifier provides a second layer of protection
- Even if learner's address is a malicious contract, re-entering `signCompletion` will fail because status is already `Completed`

---

### `_mintSoulboundNFTs()` (internal)

```
FUNCTION _mintSoulboundNFTs(uint256 bondId) internal

  Bond memory bond = bonds[bondId]

  // Build metadata URI — passed in from signCompletion caller
  // OR: use a pre-stored ipfsHash from the bond
  // Decision: use bond.ipfsHash as base, NFT contract appends tokenId
  // Full metadata JSON was uploaded to IPFS during bond creation (Day 20)

  nftContract.mint(bond.learner, TokenType.LEARNER_PROOF, bond.ipfsHash)
  nftContract.mint(bond.mentor,  TokenType.MENTOR_PROOF,  bond.ipfsHash)

NOTE: Two separate tokens are minted — one to each party.
      Same ipfsHash can be used for both (metadata JSON contains both addresses).
      TokenType differentiates LEARNER_PROOF vs MENTOR_PROOF in the metadata.
```

---

### `disputeBond()`

```
FUNCTION disputeBond(uint256 bondId) external

REQUIRES:
  msg.sender == bonds[bondId].mentor
  OR msg.sender == bonds[bondId].learner        → "CoSigned: not a party to this bond"

  bonds[bondId].status == BondStatus.Active     → "CoSigned: bond must be active to dispute"

  block.timestamp > bonds[bondId].deadline      → "CoSigned: deadline has not passed yet"

EXECUTE:
  bonds[bondId].status = BondStatus.Disputed
  bonds[bondId].disputeOpenedAt = block.timestamp

EMIT: BondDisputed(bondId, msg.sender, block.timestamp)

EDGE CASE — simultaneous dispute:
  If mentor and learner both call disputeBond() in the same block:
  - First transaction executes: status → Disputed, disputeOpenedAt set
  - Second transaction: REQUIRES status == Active → REVERTS
  - Only one call succeeds. Outcome is identical either way.
  - No special handling needed.

EDGE CASE — dispute after partial signing:
  If mentor has signed (status = MentorSigned) but deadline passes:
  - disputeBond() REQUIRES status == Active → REVERTS
  - This is intentional: if one party has already signed, the bond is
    in a "partially complete" state. The other party should still sign.
  - TODO: Consider adding a separate "abandonBond" path for MentorSigned/
    LearnerSigned states where deadline has passed. Post-MVP.
```

---

### `resolveDispute()`

```
FUNCTION resolveDispute(uint256 bondId) external nonReentrant

REQUIRES:
  bonds[bondId].status == BondStatus.Disputed   → "CoSigned: bond not in disputed state"

  block.timestamp >= bonds[bondId].disputeOpenedAt + 7 days
                                                → "CoSigned: dispute window still open"

EXECUTE:
  // Zero out stake before transfer (checks-effects-interactions)
  uint256 refund = bonds[bondId].stakeAmount
  bonds[bondId].stakeAmount = 0

  // Refund to learner — mentor gets nothing (no completion = no credential)
  (bool success, ) = bonds[bondId].learner.call{value: refund}("")
  REQUIRES: success → "CoSigned: refund failed"

EMIT: DisputeResolved(bondId, msg.sender, refund)

NOTE: Bond status remains DISPUTED (terminal). No NFTs are minted.
      Anyone can call resolveDispute() after the window — not just the parties.
      This prevents a bond from being permanently stuck if both parties disappear.
```

---

### `getBond()` and `getBondsByAddress()`

```
FUNCTION getBond(uint256 bondId) external view returns (Bond memory)
  RETURN: bonds[bondId]
  NOTE: Returns zero-value Bond if bondId doesn't exist. Frontend must check bond.id != 0.

FUNCTION getBondsByAddress(address user) external view returns (uint256[] memory)
  RETURN: array of bondIds where user is mentor OR learner
  NOTE: Returns combined array. Frontend filters by role using bond.mentor/bond.learner.

  IMPLEMENTATION:
    mentorIds = mentorBonds[user]    // already stored
    learnerIds = learnerBonds[user]  // already stored
    combined = concat(mentorIds, learnerIds)
    RETURN combined

  GAS NOTE: This is O(n) and will get expensive for users with many bonds.
            Acceptable for MVP. Post-MVP: use The Graph subgraph for queries.
```

---

## 3. CoSignedNFT.sol — Full Pseudocode

### ERC-5192 Standard Requirements

ERC-5192 is a minimal soulbound token standard. Requirements:
1. Implement `locked(uint256 tokenId) returns (bool)` — must return `true` for all tokens
2. Emit `Locked(uint256 tokenId)` event on mint
3. Emit `Unlocked(uint256 tokenId)` event if ever unlocked (we never unlock)
4. Interface ID: `0xb45a3c0e`

```solidity
interface IERC5192 {
    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);
    function locked(uint256 tokenId) external view returns (bool);
}
```

### State Variables

```solidity
address public cosignedContract              // only this address can call mint()
uint256 private _tokenIdCounter              // auto-increments
mapping(uint256 => string) private _tokenURIs
mapping(uint256 => TokenType) public tokenTypes

enum TokenType { LEARNER_PROOF, MENTOR_PROOF }
```

### Constructor

```
CONSTRUCTOR(address _cosignedContract)
  cosignedContract = _cosignedContract
  // ERC721 name + symbol
  ERC721("CoSigned Credential", "COSIGN")
```

### `mint()`

```
FUNCTION mint(
    address to,
    TokenType tokenType,
    string memory metadataURI
) external returns (uint256 tokenId)

REQUIRES:
  msg.sender == cosignedContract              → "CoSigned: only CoSigned contract can mint"
  to != address(0)                            → "CoSigned: mint to zero address"

EXECUTE:
  _tokenIdCounter++
  tokenId = _tokenIdCounter

  _safeMint(to, tokenId)                      // OpenZeppelin ERC721
  _tokenURIs[tokenId] = metadataURI
  tokenTypes[tokenId] = tokenType

EMIT: Locked(tokenId)                         // ERC-5192 REQUIRED

RETURN: tokenId
```

### `locked()`

```
FUNCTION locked(uint256 tokenId) external view returns (bool)
  REQUIRES: _exists(tokenId)                  → "CoSigned: token does not exist"
  RETURN: true                                // always — all tokens are permanently locked
```

### Transfer Overrides (Soulbound Enforcement)

```
FUNCTION transferFrom(address, address, uint256) public override
  REVERT: "CoSigned: soulbound — non-transferable"

FUNCTION safeTransferFrom(address, address, uint256) public override
  REVERT: "CoSigned: soulbound — non-transferable"

FUNCTION safeTransferFrom(address, address, uint256, bytes memory) public override
  REVERT: "CoSigned: soulbound — non-transferable"

FUNCTION approve(address, uint256) public override
  REVERT: "CoSigned: soulbound — non-transferable"

FUNCTION setApprovalForAll(address, bool) public override
  REVERT: "CoSigned: soulbound — non-transferable"

NOTE: _safeMint() internally calls _beforeTokenTransfer() which we do NOT override.
      The mint itself (from address(0)) must be allowed.
      Only transfers FROM a real address are blocked.
      Check: from == address(0) is a mint → allow. from != address(0) → revert.
```

### `tokenURI()`

```
FUNCTION tokenURI(uint256 tokenId) public view override returns (string memory)
  REQUIRES: _exists(tokenId)                  → "ERC721Metadata: URI query for nonexistent token"
  RETURN: _tokenURIs[tokenId]                 // full IPFS URI e.g. "ipfs://QmXyz..."
```

### `supportsInterface()`

```
FUNCTION supportsInterface(bytes4 interfaceId) public view override returns (bool)
  RETURN:
    interfaceId == 0xb45a3c0e                 // IERC5192
    OR super.supportsInterface(interfaceId)   // ERC721, ERC165
```

---

## 4. NFT Metadata JSON Structure

Stored on IPFS. One JSON per bond (both tokens share the same CID, tokenType differentiates).

```json
{
  "name": "CoSigned: React State Management",
  "description": "Dual-signature proof of mentorship. This credential was co-signed by both mentor and learner on CoSigned — a trustless on-chain mentorship protocol.",
  "image": "ipfs://QmCoSignedBadgeImage...",
  "external_url": "https://cosigned.app/bond/42",
  "attributes": [
    { "trait_type": "Mentor",        "value": "0xMentorAddress" },
    { "trait_type": "Learner",       "value": "0xLearnerAddress" },
    { "trait_type": "Skill",         "value": "React State Management" },
    { "trait_type": "Completed",     "value": "2026-04-20" },
    { "trait_type": "Token Type",    "value": "LEARNER_PROOF" },
    { "trait_type": "Bond ID",       "value": "42" },
    { "trait_type": "Chain",         "value": "Base Sepolia" },
    { "trait_type": "Soulbound",     "value": "true" }
  ]
}
```

---

## 5. Dispute Resolution — Full Logic in Plain English

### Scenario A: Normal completion (no dispute)
Both parties sign within the deadline. Bond completes. Stake refunded. NFTs minted. Done.

### Scenario B: Mentor ghosts
- Learner accepted, staked ETH. Mentor never signs.
- Deadline passes. Learner calls `disputeBond()`.
- 7-day window opens. Mentor can still sign during this window.
- If mentor signs within 7 days → bond completes normally (dispute window closes).
- If 7 days pass with no mentor signature → `resolveDispute()` refunds learner's stake.
- Mentor gets nothing. No NFT. No credential.

### Scenario C: Learner ghosts
- Mentor created bond. Learner accepted and staked. Learner never signs.
- Deadline passes. Mentor calls `disputeBond()`.
- Same 7-day window. Learner can still sign.
- If learner doesn't sign → `resolveDispute()` refunds learner's stake.
- Learner gets their ETH back but no credential. Mentor gets nothing either.
- Rationale: the stake is a commitment device, not a penalty. If the mentorship
  didn't complete, neither party deserves a credential.

### Scenario D: Both parties dispute simultaneously
- Both call `disputeBond()` in the same block.
- First transaction: succeeds, status → Disputed.
- Second transaction: reverts (status is no longer Active).
- No issue. Outcome is the same.

### Scenario E: Dispute raised, then other party signs
- Dispute is open (status = Disputed).
- Other party calls `signCompletion()`.
- `signCompletion()` REQUIRES status is Active/MentorSigned/LearnerSigned.
- Status is Disputed → REVERTS.
- Once disputed, the bond CANNOT be completed. This is intentional.
- Rationale: if a dispute was raised, trust has broken down. The bond is over.

### Scenario F: Deadline passes but no dispute raised
- Bond stays Active indefinitely until someone acts.
- Either party can call `disputeBond()` at any time after deadline.
- No automatic resolution — requires explicit on-chain action.
- Rationale: gas costs money. Don't force transactions nobody wants.

### Scenario G: What if both parties disappear after dispute?
- `resolveDispute()` can be called by ANYONE after 7 days.
- This prevents ETH being permanently locked in the contract.
- The refund always goes to the learner regardless of who calls resolve.

---

## 6. Reentrancy Risk Analysis

| Function | ETH Transfer? | Risk | Mitigation |
|---|---|---|---|
| `createBond()` | No | None | — |
| `acceptBond()` | No (receives ETH) | Low | ETH held in contract, no outgoing transfer |
| `signCompletion()` | Yes (refund) | HIGH | CEI pattern + nonReentrant modifier |
| `disputeBond()` | No | None | — |
| `resolveDispute()` | Yes (refund) | HIGH | CEI pattern + nonReentrant modifier |

**Checks-Effects-Interactions (CEI) pattern applied to both refund functions:**
1. CHECK: all require statements
2. EFFECT: zero out stakeAmount, update status
3. INTERACT: `.call{value}()` transfer

---

## 7. Contract Interaction Diagram

```
  User (Mentor)          CoSigned.sol              CoSignedNFT.sol
       │                      │                          │
       │── createBond() ──────►│                          │
       │◄─ bondId ─────────────│                          │
       │                      │                          │
  User (Learner)              │                          │
       │── acceptBond() ──────►│                          │
       │   + ETH stake         │                          │
       │                      │                          │
  User (Mentor)               │                          │
       │── signCompletion() ──►│                          │
       │                      │                          │
  User (Learner)              │                          │
       │── signCompletion() ──►│                          │
       │                      │── mint(learner, ...) ───►│
       │                      │── mint(mentor, ...) ────►│
       │◄─ ETH refund ─────────│                          │
       │                      │◄─ tokenId ───────────────│
       │                      │◄─ tokenId ───────────────│
```

---

## 8. Open Questions (Resolved)

| Question | Decision |
|---|---|
| Who deploys CoSignedNFT? | CoSigned.sol deploys it in its own constructor |
| How does CoSigned.sol call CoSignedNFT.sol? | Constructor injection — CoSigned deploys NFT and stores its address |
| Can metadataURI be updated after mint? | No — soulbound and immutable. IPFS CID is permanent. |
| What if IPFS goes down? | CID is stored on-chain. Content is on IPFS. Pinata pinning keeps it alive. Post-MVP: Arweave backup. |
| Minimum stake amount? | No minimum enforced on-chain. Frontend enforces a UX minimum (e.g. 0.001 ETH). |
| Can a bond be cancelled before acceptance? | Not in MVP. Mentor can't cancel a Pending bond. Post-MVP feature. |
| What if learner sends wrong stake amount? | Any amount > 0 is accepted. The amount is whatever they send. Frontend shows a suggested amount. |
