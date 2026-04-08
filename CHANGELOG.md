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

<!-- Day 4+ entries will be added here -->
