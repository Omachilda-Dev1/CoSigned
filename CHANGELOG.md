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

---

<!-- Day 3+ entries will be added here -->
