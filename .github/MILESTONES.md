# CoSigned — GitHub Issues / Kanban Board

Create these as GitHub Issues to track the 30-day build.
Label each with the appropriate milestone and label.

---

## Milestone 1: Smart Contracts (Days 5–15)

| Issue Title | Label | Day |
|---|---|---|
| `feat: Bond struct, BondStatus enum, storage mappings, events` | `contract` | Day 5 |
| `feat: createBond() and acceptBond() functions` | `contract` | Day 6 |
| `feat: signCompletion() dual-signature logic` | `contract` | Day 7 |
| `feat: disputeBond() and resolveDispute()` | `contract` | Day 8 |
| `feat: CoSignedNFT.sol — ERC-5192 soulbound NFT` | `contract` | Day 9 |
| `feat: Wire CoSigned.sol to CoSignedNFT.sol` | `contract` | Day 10 |
| `test: Bond creation and acceptance (4 tests)` | `testing` | Day 11 |
| `test: Dual-signature, NFT mint, soulbound revert (7 tests)` | `testing` | Day 12 |
| `test: Dispute, refund, edge cases (10 tests) + deploy script` | `testing` | Day 13 |
| `deploy: CoSigned + CoSignedNFT to Base Sepolia` | `deployment` | Day 14 |
| `docs: Checkpoint 1 — contracts complete, tests passing` | `documentation` | Day 15 |

## Milestone 2: Frontend (Days 16–24)

| Issue Title | Label | Day |
|---|---|---|
| `feat: Wagmi config, RainbowKit setup, ConnectButton, design tokens` | `frontend` | Day 16 |
| `feat: Contract hooks layer (useCoSigned, useBond, useUserBonds)` | `frontend` | Day 17 |
| `feat: Landing page with animated flow and live stats` | `frontend` | Day 18 |
| `feat: Dashboard with BondCard and StatusBadge` | `frontend` | Day 19 |
| `feat: Create Bond page with form validation and IPFS upload` | `frontend` | Day 20 |
| `feat: Bond Detail page with timeline and context-aware actions` | `frontend` | Day 21 |
| `feat: NFT reveal animation, SoulboundBadge, ShareCard` | `frontend` | Day 22 |
| `feat: Public profile page with reputation score` | `frontend` | Day 23 |
| `feat: Explore page and DisputeModal` | `frontend` | Day 24 |

## Milestone 3: Ship (Days 25–30)

| Issue Title | Label | Day |
|---|---|---|
| `feat: Checkpoint 2 — full end-to-end flow on testnet` | `milestone` | Day 25 |
| `test: Real user testing session 1 — friction points` | `testing` | Day 26 |
| `fix: UX improvements from user testing` | `bug` | Day 27 |
| `fix: Loading states, error handling, mobile polish` | `bug` | Day 28 |
| `deploy: v1.0.0 — Vercel frontend + verified contracts` | `deployment` | Day 29 |
| `docs: Day 30 demo — challenge complete` | `documentation` | Day 30 |
