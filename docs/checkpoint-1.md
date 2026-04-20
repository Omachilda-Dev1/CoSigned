# CoSigned — Checkpoint 1
## Days 1–15 Summary | Phase 1: Contracts Complete

---

## What Was Built

### Smart Contracts (Days 5–10)

**CoSigned.sol** — Core protocol contract
- `BondStatus` enum: 6 states (Pending → Active → MentorSigned/LearnerSigned → Completed/Disputed)
- `Bond` struct: 12 fields covering all lifecycle data
- `createBond()` — mentor creates a bond with skill, criteria, deadline, IPFS hash
- `acceptBond()` — learner accepts and stakes ETH (held in contract)
- `signCompletion()` — dual-signature logic with CEI reentrancy protection
- `disputeBond()` — raises dispute after deadline passes
- `resolveDispute()` — 7-day window, callable by anyone, refunds learner
- `getBond()` / `getBondsByAddress()` — view functions
- 6 events with indexed parameters

**CoSignedNFT.sol** — ERC-5192 soulbound credential
- Extends ERC721URIStorage (OpenZeppelin v4)
- `mint()` — only callable by CoSigned contract
- `locked()` — always returns true (ERC-5192)
- `_beforeTokenTransfer()` — blocks all transfers except mints
- `approve()` / `setApprovalForAll()` — both revert
- `supportsInterface()` — declares ERC-5192 interface ID (0xb45a3c0e)

### Test Suite (Days 11–13)
13 tests, all passing:
1. Mentor creates bond — struct fields, mappings, event
2. Mentor cannot be learner — revert
3. Learner accepts with stake — ETH held, status Active
4. Wrong address cannot accept — revert
5. Bond completes when both sign — MentorSigned → Completed
6. Learner-first signing also works — LearnerSigned → Completed
7. NFTs minted to both parties — ownership, tokenTypes, locked(), tokenURI
8. Soulbound transfer reverts — transferFrom, approve, setApprovalForAll
9. Dispute allowed after deadline — evm_setNextBlockTimestamp
10. Dispute blocked before deadline — revert
11. Stake refunded on completion — ETH balance delta test
12. signCompletion blocked on disputed bond — revert
13. Same party cannot sign twice — revert

### Deployment (Day 14)
- **CoSigned:** `0xd1D2a913eb75B43125AA860bea1BabC27F2d550A`
- **CoSignedNFT:** `0xC6Fce62038C0FD7f50c447a51C05492096554df5`
- Network: Base Sepolia (chainId: 84532)
- Both contracts verified on BaseScan ✅
- Deploy TX: `0x093d969ed1f2a0fd39bd13441f41599350aa0fb3270ac4bd649d20ec73718f72`

### Infrastructure (Days 1–4)
- Full architecture design with state machine diagrams
- Contract pseudocode with security analysis
- Production README with badges, roadmap, setup guide
- CONTRIBUTING.md, MIT LICENSE, GitHub issue templates
- 26-issue Kanban board mapped to every build day
- Brand design system: CSS variables, Tailwind tokens, SVG logos (4 variants)
- Frontend scaffold: Next.js 14, Wagmi v2, RainbowKit, Tailwind v3
- Landing page live at localhost:3000 with dark/light mode toggle

---

## Key Technical Decisions Made

| Decision | Rationale |
|---|---|
| OZ v4 not v5 | OZ v5 requires Cancun EVM (mcopy opcode), Hardhat local network doesn't support it without extra config |
| Solidity ^0.8.20 | Compatible with OZ v4, stable, well-audited |
| CEI + nonReentrant on ETH transfers | Double protection on signCompletion and resolveDispute |
| resolveDispute callable by anyone | Prevents permanently locked ETH if both parties disappear |
| evm_setNextBlockTimestamp in tests | Absolute timestamp avoids accumulation across tests |
| Standard JSON-Input for verification | Most reliable method — includes all sources and compiler settings |

---

## What's Next (Days 16–30)

| Phase | Days | Goal |
|---|---|---|
| Frontend | 16–24 | Wagmi hooks, all 6 pages, wallet connection |
| Checkpoint 2 | 25 | End-to-end testnet walkthrough |
| User Testing | 26–28 | Real users, polish, mobile |
| Ship | 29–30 | Vercel deploy + demo day |
