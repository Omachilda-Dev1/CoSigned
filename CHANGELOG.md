# CoSigned — Changelog

All notable changes to this project will be documented here.

---

## [Day 1] — 2026-04-06

### Added
- Project README with problem, solution, how it works, tech stack, and 30-day roadmap
- Architecture design doc (`docs/architecture.md`) with:
  - Full Bond lifecycle diagram
  - Bond struct and BondStatus enum in pseudocode
  - All smart contract functions documented in pseudocode
  - Dispute resolution logic in plain English
  - Key design decisions table
- Complete folder structure with placeholder files for all 30 days of work
- `.gitignore` covering node_modules, .env, Hardhat artifacts, Next.js build
- `.env.example` with all required environment variables documented
- `deployments.json` placeholder for contract addresses
- `frontend/types/bond.ts` — TypeScript Bond interface and BondStatus enum

---

## [Day 2] — 2026-04-07

### Added
- `docs/contract-design.md` — full smart contract deep design including:
  - Complete state machine diagram with ALL valid transitions
  - CoSigned.sol: detailed pseudocode for every function with exact require messages
  - Gas packing analysis for Bond struct
  - All events with indexed parameters documented
  - Reentrancy risk table — CEI pattern applied to signCompletion and resolveDispute
  - CoSignedNFT.sol: full ERC-5192 compliance pseudocode
  - Transfer override logic (mint from address(0) allowed, all other transfers blocked)
  - supportsInterface() with ERC-5192 interface ID (0xb45a3c0e)
  - NFT metadata JSON structure with all attributes
  - 7 dispute scenarios documented in plain English
  - Contract interaction diagram (Mentor → CoSigned → CoSignedNFT)
  - Open questions table — all resolved with rationale

### Updated
- `docs/architecture.md` — dispute resolution section expanded with all edge cases resolved

## [Day 3] — 2026-04-08

### Added
- Root Hardhat project initialized (`npm init`, `package.json` with scripts)
- Hardhat 2.28.6 + `@nomicfoundation/hardhat-toolbox@5` installed
- `@openzeppelin/contracts@5` installed
- `hardhat.config.js` fully configured:
  - Solidity 0.8.20 with optimizer (200 runs)
  - `hardhat` local network (chainId 31337)
  - `baseSepolia` network (chainId 84532, RPC from env)
  - BaseScan etherscan verification config with custom chain
  - Gas reporter (opt-in via `REPORT_GAS=true`)
  - Custom paths pointing to `contracts/` and `contracts/test/`
- `package.json` scripts: compile, test, deploy:local, deploy:testnet, verify, clean
- Frontend Next.js 14 scaffolded manually:
  - `next`, `react`, `react-dom` installed
  - `wagmi@2`, `@rainbow-me/rainbowkit`, `viem@2`, `@tanstack/react-query`
  - `zustand`, `framer-motion`, `react-hook-form`, `zod`, `pinata`
  - `typescript`, `@types/node`, `@types/react`, `@types/react-dom`
  - `tailwindcss`, `postcss`, `autoprefixer`
- `frontend/tsconfig.json` — strict TypeScript, path alias `@/*`
- `frontend/next.config.ts` — webpack fallback for Node.js modules (wagmi compat)
- `frontend/postcss.config.js` — Tailwind + autoprefixer
- `frontend/app/layout.tsx` — root layout with Syne + DM Mono fonts, dark mode default, metadata
- `frontend/.env.local.example` — frontend-specific env vars
- `.gitignore` updated — `frontend/.env.local` excluded

### Fixed
- Hardhat 3 / toolbox version mismatch — downgraded to Hardhat 2.28.6 (stable, full toolbox support)
- npm ENOTEMPTY error during TypeScript install — resolved with `--legacy-peer-deps`

### Verified
- `npx hardhat compile` → "Compiled 2 Solidity files successfully (evm target: paris)"

---

## [Day 4] — 2026-04-09

### Added
- `README.md` — full production-quality rewrite:
  - Centered hero with badges (MIT, Built on Base, Hardhat, Next.js, challenge tag)
  - Live demo / BaseScan / demo video links (placeholders until Day 14/29)
  - Problem, Solution, How It Works, Tech Stack table, Bond status flow
  - Full project structure tree with inline comments
  - 4-step setup guide with code blocks
  - 30-day roadmap table with live status column (✅/🔨/⏳)
  - Scope lock section (in/out of 30 days)
- `CONTRIBUTING.md` — contributor guide with conventional commits, code standards, issue labels
- `LICENSE` — MIT
- `.github/ISSUE_TEMPLATE/bug_report.md` — with TX hash field for Web3 bugs
- `.github/ISSUE_TEMPLATE/feature_request.md` — with in-scope checkbox
- `.github/ISSUE_TEMPLATE/security.md` — severity levels: Critical/High/Medium/Low
- `.github/MILESTONES.md` — 26 issues across 3 milestones, labeled by day
- `.github/PULL_REQUEST_TEMPLATE.md` — compile + test + no-any checklist
- `frontend/next.config.js` — replaced unsupported next.config.ts
- `frontend/app/globals.css` — full CSS variable system for dark/light theming
- `frontend/app/layout.tsx` — Syne + DM Mono fonts, dark class default, metadata
- `frontend/app/page.tsx` — full landing page:
  - Nav: logo, theme toggle, Base Sepolia badge, Connect Wallet button
  - Hero: two-column layout — copy left, SVG illustration right
  - How It Works: editorial table layout (number / title / description)
  - Why CoSigned: three joined panels with stat callouts
  - CTA section + footer
- `frontend/components/ui/ThemeToggle.tsx` — SVG sun/moon icons, rectangular button, CSS variable driven
- `frontend/components/ui/HeroIllustration.tsx` — inline SVG showing full Bond flow:
  Mentor wallet → Bond card (lock, skill, status, signatures) → Learner wallet
  → MENTOR PROOF + LEARNER PROOF NFT cards. Fully theme-aware via CSS variables.

### Fixed
- `next.config.ts` → `next.config.js` — Next.js 14 does not support .ts config files
- Tailwind v4 → v3 — v4 moved PostCSS plugin to separate package, broke globals.css
- Cleared `.next` cache after Tailwind version swap (stale v4 cache caused ENOENT errors)
- Hero padding reduced (pt-24 → pt-14) — buttons were below the fold
- ThemeToggle replaced emoji sun/moon with SVG Feather-style icons
- Light mode background darkened: `#F5F0E8` → `#E8E4DC` (less stark, more muted)

### Verified
- `npm run dev` → compiles clean, localhost:3000 live

---

## [Day 5] — 2026-04-10

### Added
- `contracts/CoSigned.sol` — first real Solidity, fully compiled:
  - `BondStatus` enum: Pending, Active, MentorSigned, LearnerSigned, Completed, Disputed
  - `Bond` struct: all 12 fields (id, mentor, learner, skillTitle, successCriteria,
    stakeAmount, status, deadline, ipfsHash, mentorSigned, learnerSigned, disputeOpenedAt)
  - State variables: `bondCounter`, `bonds` mapping, `mentorBonds` mapping, `learnerBonds` mapping
  - 6 events with indexed parameters: BondCreated, BondAccepted, BondSigned,
    BondCompleted, BondDisputed, DisputeResolved
  - `getBond(uint256)` view function
  - `getBondsByAddress(address)` view function — concatenates mentor + learner arrays
  - Inherits `ReentrancyGuard` from OpenZeppelin v5
  - Full NatSpec documentation on every struct, event, and function

### Fixed
- OZ v5 import path: `security/ReentrancyGuard.sol` → `utils/ReentrancyGuard.sol`
  (OpenZeppelin v5 reorganised the security module)

### Verified
- `npx hardhat clean && npx hardhat compile` → "Compiled 4 Solidity files successfully (evm target: paris)"

---

## [Day 6] — 2026-04-11

### Added
- `contracts/CoSigned.sol` — `createBond()` and `acceptBond()`:

  `createBond(address learner, string skillTitle, string successCriteria, uint256 deadline, string ipfsHash)`
  - 5 require checks: learner != zero, learner != mentor, deadline in future,
    skillTitle not empty, successCriteria not empty
  - Increments bondCounter, stores full Bond struct, pushes to both
    mentorBonds and learnerBonds mappings
  - Emits BondCreated
  - Returns bondId
  - Uses calldata for string params (gas efficient)

  `acceptBond(uint256 bondId) payable`
  - 4 require checks: caller is designated learner, status is Pending,
    msg.value > 0, deadline has not passed
  - Sets stakeAmount = msg.value, status = Active
  - ETH held in contract — no transfer on acceptance
  - Emits BondAccepted

### Fixed
- Hardhat cache stale after Day 5 edit — ran `npx hardhat clean` before recompile

### Verified
- `npx hardhat clean; npx hardhat compile` → "Compiled 4 Solidity files successfully (evm target: paris)"

---

## [Day 7] — 2026-04-12

### Added
- `contracts/CoSigned.sol` — `signCompletion()` and `_mintSoulboundNFTs()`:

  `signCompletion(uint256 bondId) nonReentrant`
  - Requires: caller is mentor or learner, bond is in signable state
    (Active, MentorSigned, or LearnerSigned)
  - Guards against double-signing: "mentor already signed" / "learner already signed"
  - Records signature on the correct party's bool flag
  - Updates status: Active → MentorSigned or LearnerSigned after first sig
  - Emits BondSigned after every call
  - On second signature (both true):
    - Sets status = Completed
    - Caches learner address and refund amount into local vars
    - Zeros out stakeAmount BEFORE transfer (CEI pattern)
    - Emits BondCompleted BEFORE external calls
    - Transfers ETH refund to learner via .call{value}()
    - Calls _mintSoulboundNFTs() (placeholder until Day 10)

  `_mintSoulboundNFTs(uint256 bondId) internal`
  - Placeholder with commented-out NFT contract calls
  - Will be replaced on Day 10 when CoSignedNFT.sol is wired in

### Verified
- `npx hardhat clean; npx hardhat compile` → "Compiled 4 Solidity files successfully (evm target: paris)"

---

## [Day 8] — 2026-04-13

### Added
- `contracts/CoSigned.sol` — `disputeBond()` and `resolveDispute()`:

  `disputeBond(uint256 bondId)`
  - Requires: caller is mentor or learner, status is Active, deadline has passed
  - Only Active bonds can be disputed — MentorSigned/LearnerSigned cannot
    (intentional: partially-signed bonds should still be completed)
  - Sets status = Disputed, stores disputeOpenedAt = block.timestamp
  - Emits BondDisputed(bondId, raisedBy, disputeOpenedAt)
  - Simultaneous dispute edge case handled: first call wins, second reverts

  `resolveDispute(uint256 bondId) nonReentrant`
  - Requires: status is Disputed, 7 days have elapsed since disputeOpenedAt
  - Callable by ANYONE — prevents ETH being permanently locked if both
    parties disappear after raising a dispute
  - CEI pattern: zeros stakeAmount → emits DisputeResolved → transfers ETH
  - Refunds full stake to learner; mentor receives nothing (no completion = no credential)
  - Bond stays in Disputed state (terminal) — no NFTs minted

### Verified
- `npx hardhat clean; npx hardhat compile` → "Compiled 4 Solidity files successfully (evm target: paris)"

---

## [Day 9] — 2026-04-14

### Added
- `contracts/CoSignedNFT.sol` — ERC-5192 soulbound NFT contract, fully compiled:

  ERC-5192 compliance:
  - `locked(uint256 tokenId)` — always returns true, reverts on non-existent token
  - Emits `Locked(tokenId)` on every mint (standard requirement)
  - `supportsInterface()` declares `0xb45a3c0e` (ERC-5192 interface ID)

  Soulbound enforcement via OZ v5 `_update()` override:
  - Mints (from == address(0)) are allowed
  - All transfers from real addresses revert: "CoSignedNFT: soulbound — non-transferable"
  - `approve()` reverts (pure override)
  - `setApprovalForAll()` reverts (pure override)

  `mint(address to, TokenType tokenType, string metadataURI)`:
  - Only callable by `cosignedContract` (set in constructor, immutable)
  - Auto-increments `_tokenIdCounter`, first token is ID 1
  - Calls `_safeMint`, `_setTokenURI`, stores `tokenTypes[tokenId]`
  - Emits `Locked(tokenId)`

  `TokenType` enum: `LEARNER_PROOF`, `MENTOR_PROOF`
  Extends `ERC721URIStorage` for per-token IPFS metadata URIs
  `cosignedContract` is immutable — set once in constructor, cannot change

### Fixed
- OZ v5 removed `_exists()` — replaced with `_ownerOf(tokenId) != address(0)`
- OZ v5 uses `_update()` as the single transfer hook instead of
  `_beforeTokenTransfer()` — soulbound enforcement updated accordingly

### Verified
- `npx hardhat clean; npx hardhat compile` → "Compiled 4 Solidity files successfully (evm target: paris)"

---

## [Day 10] — 2026-04-15

### Added
- `contracts/CoSigned.sol` — wired to CoSignedNFT:
  - `import "./CoSignedNFT.sol"` — direct import, no interface needed
  - `CoSignedNFT public nftContract` state variable
  - `constructor()` — deploys `new CoSignedNFT(address(this))` atomically.
    CoSigned and CoSignedNFT are bound at deploy time. No separate step,
    no risk of wrong address being passed to the NFT contract.
  - `_mintSoulboundNFTs()` — placeholder replaced with real calls:
    `nftContract.mint(bond.learner, CoSignedNFT.TokenType.LEARNER_PROOF, bond.ipfsHash)`
    `nftContract.mint(bond.mentor,  CoSignedNFT.TokenType.MENTOR_PROOF,  bond.ipfsHash)`

- `docs/nft-metadata-example.json` — reference metadata JSON structure
  with all 8 attributes (Mentor, Learner, Skill, Completed, Token Type,
  Bond ID, Chain, Soulbound)

### Verified
- `npx hardhat clean; npx hardhat compile` → "Compiled 4 Solidity files successfully (evm target: paris)"
- Both contracts compile together with zero errors

---

## [Day 11] — 2026-04-16

### Added
- `contracts/test/CoSigned.test.js` — 4 passing tests:
  - Test 1: mentor creates bond — verifies bondCounter, all Bond struct fields,
    mentorBonds/learnerBonds mappings, BondCreated event
  - Test 2: mentor cannot create bond with themselves as learner — revertedWith
  - Test 3: learner accepts bond with correct stake — verifies status Active,
    stakeAmount, contract ETH balance increase, BondAccepted event
  - Test 4: wrong address cannot accept bond — stranger reverts, mentor reverts,
    zero stake reverts

### Fixed
- OZ v5 -> v4.9.6 downgrade: OZ v5 uses `mcopy` opcode (Cancun EVM) which
  Hardhat's local network doesn't support without extra config
- Solidity pragma reverted to ^0.8.20 (compatible with OZ v4)
- Hardhat config evmVersion removed (paris is correct for OZ v4)
- CoSignedNFT.sol updated for OZ v4 API:
  - `_update()` -> `_beforeTokenTransfer()` for soulbound enforcement
  - `_ownerOf()` -> `_exists()` for token existence check
  - ReentrancyGuard import: `utils/` -> `security/`
- Cleared Hardhat global compiler cache (`~/.cache/hardhat-nodejs`) to
  force fresh compilation after OZ version switch

### Verified
- `npx hardhat test` -> 4 passing (6s)
- "Compiled 18 Solidity files successfully (evm target: paris)"

---

## [Day 12] — 2026-04-17

### Added
- `contracts/test/CoSigned.test.js` — 3 new tests (8 total, all passing):
  - Test 5: complete bond when both parties sign — verifies MentorSigned
    intermediate state, then Completed after second sig, stakeAmount zeroed,
    BondCompleted event emitted
  - Test 5b: also complete when learner signs first — verifies LearnerSigned
    intermediate state, confirms order doesn't matter
  - Test 6: mint soulbound NFTs to both parties on completion — verifies
    learner owns token 1 (LEARNER_PROOF), mentor owns token 2 (MENTOR_PROOF),
    tokenTypes mapping correct, locked() returns true, tokenURI matches ipfsHash
  - Test 7: revert transfer of soulbound NFT — verifies transferFrom reverts
    for both tokens, approve reverts, setApprovalForAll reverts, ownership
    unchanged after all attempts

- Helper function `createAndAcceptBond()` — reduces test boilerplate for
  Day 12+ tests that need an Active bond

### Verified
- `npx hardhat test` -> 8 passing (6s)

---

## [Day 13] — 2026-04-18

### Added
- `contracts/test/CoSigned.test.js` — 5 new tests (13 total, all passing):
  - Test 8: dispute allowed after deadline — uses `evm_setNextBlockTimestamp`
    to jump EVM to exact timestamp past deadline, verifies Disputed status
    and disputeOpenedAt recorded, BondDisputed event emitted
  - Test 8b: dispute NOT allowed before deadline — revertedWith
  - Test 9: stake refunded to learner on completion — tracks ETH balance
    before/after, accounts for gas cost, verifies contract balance = 0
  - Test 10: signCompletion reverts on disputed bond — both parties blocked
  - Test 10b: same party cannot sign twice — "mentor already signed" revert

- `scripts/deploy.js` — full deploy script:
  - Deploys CoSigned (which internally deploys CoSignedNFT)
  - Logs deployer address, balance, both contract addresses
  - Saves addresses + metadata to deployments.json
  - Prints BaseScan links and verify commands when on baseSepolia

### Fixed
- `evm_increaseTime` accumulates across tests in the same Hardhat process —
  switched to `evm_setNextBlockTimestamp` (absolute) for time-sensitive tests
- Fixture deadline changed from `Date.now()` to EVM `block.timestamp` to
  avoid clock drift between JS and the Hardhat EVM
- Background process was carrying stale EVM state — run `npx hardhat test`
  directly (not via background process) for clean test isolation

### Verified
- `npx hardhat test` → 13 passing (3s)
- `npx hardhat run scripts/deploy.js` → both contracts deployed, addresses saved

---

## [Day 14] — 2026-04-19

### Added
- `scripts/copy-abis.js` — copies compiled ABIs from artifacts/ to
  frontend/lib/abi/ (CoSigned.json + CoSignedNFT.json). Run after compile.
- `frontend/lib/abi/CoSigned.json` — ABI copied from artifacts
- `frontend/lib/abi/CoSignedNFT.json` — ABI copied from artifacts
- `frontend/lib/contract.ts` — imports real ABIs, exports addresses from
  env vars, exports BASE_SEPOLIA_CHAIN_ID
- `package.json` — added `copy-abis` script

### Deploy Steps (run these manually)

```bash
# 1. Get Base Sepolia ETH
# → https://faucet.base.org (connect wallet, request ETH)

# 2. Set up .env
cp .env.example .env
# Fill in: PRIVATE_KEY, BASE_SEPOLIA_RPC_URL, BASESCAN_API_KEY

# 3. Deploy to Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia

# 4. Copy ABIs to frontend
node scripts/copy-abis.js

# 5. Verify contracts on BaseScan
npx hardhat verify --network baseSepolia <COSIGNED_ADDRESS>
npx hardhat verify --network baseSepolia <COSIGNED_NFT_ADDRESS> "<COSIGNED_ADDRESS>"

# 6. Update .env with deployed addresses
NEXT_PUBLIC_COSIGNED_ADDRESS=<COSIGNED_ADDRESS>
NEXT_PUBLIC_COSIGNED_NFT_ADDRESS=<COSIGNED_NFT_ADDRESS>
```

### Pending
- Testnet deploy (requires PRIVATE_KEY + Base Sepolia ETH in .env)
- Contract verification on BaseScan
- deployments.json baseSepolia addresses to be populated after deploy

---

<!-- Day 15+ entries will be added here -->
