# CoSigned — Architecture

## Overview

CoSigned is a dual-signature mentorship protocol on Base. A mentor and learner co-sign a Bond on-chain. When both sign, soulbound NFT credentials are minted to both wallets — permanent, verifiable proof that a real mentorship happened.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│  Browser (MetaMask) ←→ RainbowKit ←→ Wagmi v2 ←→ viem         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (Vercel)                         │
│  Next.js 14 App Router                                          │
│  ├── / (Landing)          ├── /bond/create                     │
│  ├── /dashboard           ├── /bond/[id]                       │
│  ├── /explore             ├── /profile/[address]               │
│  └── /how-to-use                                               │
│                                                                 │
│  Components: BondCard, BondTimeline, SignButton,                │
│              CertificateCard, NFTReveal, SoulboundBadge         │
│  Hooks: useCreateBond, useAcceptBond, useSignCompletion,        │
│         useDisputeBond, useBond, useUserBonds                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    RPC (Base Sepolia)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SMART CONTRACTS (Base Sepolia)               │
│                                                                 │
│  CoSigned.sol                                                   │
│  0xd1D2a913eb75B43125AA860bea1BabC27F2d550A                    │
│  ├── createBond()     — mentor creates bond                     │
│  ├── acceptBond()     — learner accepts + stakes ETH            │
│  ├── signCompletion() — dual-signature completion               │
│  ├── disputeBond()    — raise dispute after deadline            │
│  └── resolveDispute() — refund after 7-day window              │
│                                                                 │
│  CoSignedNFT.sol (ERC-5192 Soulbound)                          │
│  0xC6Fce62038C0FD7f50c447a51C05492096554df5                    │
│  ├── mint()           — only callable by CoSigned.sol           │
│  ├── locked()         — always returns true                     │
│  └── transferFrom()   — always reverts                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STORAGE (IPFS via Pinata)                  │
│  Bond metadata JSON uploaded before createBond() call           │
│  CID stored on-chain in Bond.ipfsHash                           │
│  Metadata includes: skill, criteria, mentor, learner, dates     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Technical Decisions

| Decision | Rationale |
|---|---|
| Base Sepolia | Low fees, EVM-compatible, good tooling |
| ERC-5192 soulbound | Non-transferable credentials — they mean something |
| CEI pattern on ETH transfers | Prevents reentrancy on stake refund |
| resolveDispute() callable by anyone | Prevents permanently locked ETH |
| CoSigned deploys CoSignedNFT in constructor | Atomic binding — no wrong address risk |
| Wagmi v2 + RainbowKit | Best-in-class wallet UX for EVM |
| CSS variables for theming | Single source of truth, works in both modes |
| Next.js App Router | Server components + client hooks cleanly separated |

---

## Bond State Machine

```
createBond()
    │
    ▼
[PENDING] ──acceptBond()──► [ACTIVE]
                                │
                    ┌───────────┴───────────┐
              mentor signs            learner signs
                    │                       │
                    ▼                       ▼
            [MENTORSIGNED]          [LEARNERSIGNED]
                    │                       │
              learner signs           mentor signs
                    └───────────┬───────────┘
                                ▼
                          [COMPLETED]
                    stake refunded + NFTs minted

[ACTIVE] ──(deadline passed)──► disputeBond() ──► [DISPUTED]
                                                        │
                                              7 days pass
                                                        │
                                              resolveDispute()
                                                        │
                                              stake → learner
```

---

## Security Analysis

| Function | ETH Transfer | Risk | Mitigation |
|---|---|---|---|
| createBond() | No | None | — |
| acceptBond() | Receives ETH | Low | ETH held in contract |
| signCompletion() | Yes (refund) | HIGH | CEI + nonReentrant |
| disputeBond() | No | None | — |
| resolveDispute() | Yes (refund) | HIGH | CEI + nonReentrant |

---

## Frontend Architecture

```
app/
├── layout.tsx          — server component, CSS + fonts
├── providers.tsx       — client component, Wagmi + RainbowKit
├── page.tsx            — landing page
├── dashboard/          — wallet-gated bond management
├── bond/
│   ├── create/         — mentor creates bond + IPFS upload
│   └── [id]/           — bond detail + sign/accept/dispute
├── explore/            — browse open bonds
├── profile/[address]/  — public reputation page
└── how-to-use/         — illustrated guide

hooks/useCoSigned.ts    — all contract interactions
lib/contract.ts         — addresses + ABIs
lib/wagmi.ts            — chain config
lib/pinata.ts           — IPFS upload
```

---

## Deployment

| Component | URL |
|---|---|
| Frontend | https://co-signed.vercel.app |
| CoSigned contract | https://sepolia.basescan.org/address/0xd1D2a913eb75B43125AA860bea1BabC27F2d550A#code |
| CoSignedNFT contract | https://sepolia.basescan.org/address/0xC6Fce62038C0FD7f50c447a51C05492096554df5#code |
| GitHub | https://github.com/Omachilda-Dev1/CoSigned |
