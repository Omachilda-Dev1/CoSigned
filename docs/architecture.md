# CoSigned — Architecture Design

## System Overview

CoSigned is a dual-signature mentorship protocol. Two parties (mentor + learner) must independently confirm a mentorship is complete before any credential is issued. This makes the credential trustless — neither party can fake it alone.

---

## Bond Lifecycle Diagram

```
                        ┌─────────────────────────────────────────────────────┐
                        │                  BOND LIFECYCLE                      │
                        └─────────────────────────────────────────────────────┘

  MENTOR                                                              LEARNER
    │                                                                    │
    │  createBond(learner, skill, criteria, deadline, ipfsHash)          │
    ▼                                                                    │
┌──────────┐                                                            │
│ PENDING  │ ◄── Bond exists on-chain. Learner notified off-chain.      │
└──────────┘                                                            │
    │                                                          acceptBond(bondId)
    │                                                          + stake ETH
    │                                                                    ▼
    │                                                          ┌──────────────┐
    │                                                          │    ACTIVE    │
    │                                                          └──────────────┘
    │                                                                    │
    │◄──────────────── Mentorship happens off-chain ────────────────────►│
    │                                                                    │
    │  signCompletion(bondId)                                            │
    ▼                                                                    │
┌──────────────┐                                                        │
│ MENTORSIGNED │                                                        │
└──────────────┘                                                        │
    │                                                  signCompletion(bondId)
    │                                                                    ▼
    │                                                          ┌──────────────┐
    │                                                          │  COMPLETED   │
    │                                                          └──────────────┘
    │                                                                    │
    │                                              ┌─────────────────────┤
    │                                              │                     │
    │                                    Refund ETH stake        Mint 2x Soulbound NFTs
    │                                              │              (MENTOR_PROOF + LEARNER_PROOF)
    │                                              ▼                     ▼
    │                                         Learner wallet       Both wallets
    │
    │
    │  ── DISPUTE PATH ──────────────────────────────────────────────────
    │
    │  If deadline passes and bond is still ACTIVE:
    │
    │  disputeBond(bondId)  ← either party can call
    ▼
┌──────────┐
│ DISPUTED │  ← disputeOpenedAt timestamp stored
└──────────┘
    │
    │  After 7 days with no resolution:
    ▼
resolveDispute(bondId)
    │
    ▼
Stake refunded to learner
(Mentor receives no credential — dispute = no completion)
```

---

## Smart Contract Data Structures (Pseudocode)

### Bond Struct

```
struct Bond {
  uint256 id                  // Auto-incremented bond ID
  address mentor              // Wallet that created the bond
  address learner             // Wallet that accepted the bond
  string skillTitle           // e.g. "React State Management"
  string successCriteria      // e.g. "Build a working Zustand store"
  uint256 stakeAmount         // ETH staked by learner (in wei)
  BondStatus status           // Current lifecycle state
  uint256 deadline            // Unix timestamp — bond must complete by this date
  string ipfsHash             // IPFS CID of evidence/metadata JSON
  bool mentorSigned           // Has mentor called signCompletion?
  bool learnerSigned          // Has learner called signCompletion?
  uint256 disputeOpenedAt     // Timestamp when dispute was raised (0 if no dispute)
}
```

### BondStatus Enum

```
enum BondStatus {
  Pending,        // Created, not yet accepted
  Active,         // Accepted + staked, mentorship in progress
  MentorSigned,   // Mentor signed, waiting on learner
  LearnerSigned,  // Learner signed, waiting on mentor
  Completed,      // Both signed — NFTs minted, stake refunded
  Disputed        // Deadline passed, dispute raised
}
```

---

## Smart Contract Functions (Pseudocode)

### CoSigned.sol

```
createBond(address learner, string skillTitle, string successCriteria, uint256 deadline, string ipfsHash)
  REQUIRES: learner != msg.sender
  REQUIRES: deadline > block.timestamp
  CREATES: new Bond with status=Pending
  INCREMENTS: bondCounter
  ADDS: bondId to mentorBonds[msg.sender] and learnerBonds[learner]
  EMITS: BondCreated(bondId, mentor, learner, skillTitle, deadline)

acceptBond(uint256 bondId) payable
  REQUIRES: msg.sender == bond.learner
  REQUIRES: bond.status == Pending
  REQUIRES: msg.value > 0
  UPDATES: bond.status = Active, bond.stakeAmount = msg.value
  EMITS: BondAccepted(bondId, learner, stakeAmount)

signCompletion(uint256 bondId)
  REQUIRES: msg.sender == bond.mentor OR msg.sender == bond.learner
  REQUIRES: bond.status == Active OR MentorSigned OR LearnerSigned
  IF msg.sender == mentor: SET bond.mentorSigned = true
  IF msg.sender == learner: SET bond.learnerSigned = true
  UPDATE status to MentorSigned or LearnerSigned accordingly
  IF both signed:
    SET status = Completed
    REFUND bond.stakeAmount to bond.learner
    CALL _mintSoulboundNFTs(bondId)
  EMITS: BondSigned(bondId, signer)
  IF completed: EMITS BondCompleted(bondId)

disputeBond(uint256 bondId)
  REQUIRES: msg.sender == bond.mentor OR bond.learner
  REQUIRES: bond.status == Active
  REQUIRES: block.timestamp > bond.deadline
  SETS: bond.status = Disputed
  SETS: bond.disputeOpenedAt = block.timestamp
  EMITS: BondDisputed(bondId, raisedBy)

resolveDispute(uint256 bondId)
  REQUIRES: bond.status == Disputed
  REQUIRES: block.timestamp >= bond.disputeOpenedAt + 7 days
  REFUNDS: bond.stakeAmount to bond.learner
  EMITS: DisputeResolved(bondId)

getBond(uint256 bondId) view → Bond
getBondsByAddress(address user) view → uint256[]
```

### CoSignedNFT.sol

```
Extends: ERC721, ERC-5192

locked(uint256 tokenId) → always returns true

transferFrom(...) → REVERTS with "CoSigned: soulbound"
safeTransferFrom(...) → REVERTS with "CoSigned: soulbound"
approve(...) → REVERTS with "CoSigned: soulbound"
setApprovalForAll(...) → REVERTS with "CoSigned: soulbound"

enum TokenType { LEARNER_PROOF, MENTOR_PROOF }

mint(address to, TokenType tokenType, string metadataURI)
  REQUIRES: msg.sender == CoSigned contract address
  MINTS: new token to `to`
  STORES: metadataURI for tokenId
  EMITS: Locked(tokenId)  ← ERC-5192 requirement
```

---

## Dispute Resolution Logic

**When can a dispute be raised?**
- Bond status must be `Active` (accepted but not completed)
- Current time must be past the bond's deadline
- Either the mentor OR learner can raise it

**What happens during the 7-day window?**
- The other party can still call `signCompletion()` — if they do, the bond completes normally
- If 7 days pass with no completion, `resolveDispute()` can be called

**Edge case: Both parties try to dispute simultaneously**
- Only one `disputeBond()` call can succeed — the second will fail because status is already `Disputed`
- The `disputeOpenedAt` timestamp is set by whoever calls first
- This is acceptable: the outcome (stake refund to learner) is the same regardless of who raised it

**What "no response" means in code:**
- After `disputeOpenedAt + 7 days`, if `bond.status` is still `Disputed` (not `Completed`), the dispute resolves in the learner's favor

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Learner stakes ETH | Signals commitment; refunded on success, returned on dispute |
| Both must sign independently | Prevents either party from faking completion |
| Soulbound NFTs | Credentials can't be sold or transferred — they mean something |
| IPFS for metadata | Decentralized storage; contract stores only the CID |
| Base Sepolia | Low fees, EVM-compatible, good tooling for testnet |
| 7-day dispute window | Gives the other party time to respond before stake is released |

---

## What's In Scope (30 Days)

- Full Bond lifecycle (create → accept → sign → complete → mint)
- Dispute mechanism
- Soulbound NFT minting
- Full frontend (6 pages)
- Testnet deployment
- Real user testing

## What's Post-Roadmap

- Mainnet deployment
- Subgraph (The Graph) for efficient bond querying
- DAO governance for dispute resolution
- Multi-skill bonds
- Mentor staking (skin in the game for mentors too)
- Mobile app
