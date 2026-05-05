# CoSigned 🔏
### Your skills. Witnessed on-chain.

**Live:** [co-signed.vercel.app](https://co-signed.vercel.app) | **Contracts:** [BaseScan ✅](https://sepolia.basescan.org/address/0xd1D2a913eb75B43125AA860bea1BabC27F2d550A#code) | **Built in 30 days** for the #ENg30DayChallenge

CoSigned is a Web3 DApp where mentors and learners co-sign skill Bonds on-chain. When both parties sign, a soulbound (non-transferable) NFT is minted to each — permanent, verifiable proof that a real mentorship happened. Neither party can fake it alone.

---

## The Problem

- LinkedIn endorsements are one-sided and unverifiable
- Certificates can be faked or bought
- There's no trustless, on-chain record that a real mentorship actually happened

## The Solution

CoSigned creates a **dual-signature Bond** between a mentor and a learner. Both must independently confirm the mentorship is complete. On the second signature, soulbound NFTs are minted to both wallets — proof that can never be transferred, faked, or revoked.

---

## How It Works

```
1. MENTOR CREATES   → Defines skill, success criteria, deadline, uploads evidence to IPFS
2. LEARNER ACCEPTS  → Stakes ETH to signal commitment (refunded on completion)
3. MENTORSHIP RUNS  → Off-chain work happens (calls, reviews, projects)
4. BOTH CO-SIGN     → Mentor signs first (or learner — order doesn't matter)
5. BOND COMPLETES   → Second signature triggers: stake refund + soulbound NFT minted to both
```

If either party ghosts after the deadline, the other can raise a dispute. After a 7-day window, the stake is resolved.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Solidity 0.8.20, Hardhat 2.x, ERC-5192 |
| Blockchain | Base Sepolia Testnet (chainId: 84532) |
| Frontend | Next.js 14 (App Router), Tailwind CSS, Framer Motion |
| Web3 | Wagmi v2, RainbowKit, viem v2 |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Storage | IPFS via Pinata SDK |
| Deploy | Vercel (frontend) + Hardhat (contracts) |

---

## Bond Lifecycle

```
[PENDING] ──acceptBond()──► [ACTIVE] ──signCompletion() x2──► [COMPLETED]
                                │                                    │
                                │ (deadline passed)                  ▼
                                └──disputeBond()──► [DISPUTED]   NFTs Minted
                                                        │
                                                   resolveDispute()
```

**BondStatus Enum:**
- `Pending` — Created by mentor, awaiting learner acceptance
- `Active` — Learner accepted and staked ETH
- `MentorSigned` — Mentor has signed, waiting on learner
- `LearnerSigned` — Learner has signed, waiting on mentor
- `Completed` — Both signed, NFTs minted, stake refunded
- `Disputed` — Deadline passed, dispute raised, 7-day resolution window

---

## Scope Lock (30-Day Challenge)

### In scope — ships by Day 30
- Full Bond lifecycle on-chain (create → accept → sign → complete → mint)
- Dispute mechanism with 7-day resolution window
- Soulbound NFT minting (ERC-5192) to both parties
- IPFS metadata upload via Pinata
- Full frontend — 6 pages (Landing, Dashboard, Create Bond, Bond Detail, Profile, Explore)
- Wallet connection via RainbowKit (MetaMask, Coinbase Wallet, WalletConnect)
- Testnet deployment on Base Sepolia
- Contract verification on BaseScan
- Real user testing (Day 26–27)
- Vercel production deployment

###  Post-roadmap (not in 30 days)
- Mainnet deployment
- The Graph subgraph for efficient bond querying
- DAO governance for dispute resolution
- Multi-skill bonds
- Mentor staking
- Mobile app

---

## 30-Day Roadmap

| Phase | Days | Status | Goal |
|---|---|---|---|
| Idea & Scope | 1–3 | ✅ Done | Architecture, design, environment setup |
| Repo Setup | 4 | ✅ Done | Public repo, production README |
| Core Build | 5–15 | ✅ Done | Smart contracts (13 tests), testnet deploy + verified |
| Advanced Features | 16–24 | ✅ Done | Full frontend (7 pages), wallet, IPFS, NFT reveal |
| Checkpoint 2 | 25 | ✅ Done | End-to-end testnet walkthrough |
| Testing | 26–28 | ✅ Done | Real user testing, polish, mobile responsive |
| Deploy | 29 | ✅ Done | Vercel deploy, final docs, ARCHITECTURE.md |
| Demo Day | 30 | ✅ Done | Demo video, final post, submission |

---

## Project Structure

```
cosigned/
├── contracts/
│   ├── CoSigned.sol
│   ├── CoSignedNFT.sol
│   └── test/
├── scripts/
│   └── deploy.js
├── hardhat.config.js
├── package.json
├── deployments.json
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx              # Landing
    │   ├── dashboard/page.tsx    # User dashboard
    │   ├── bond/
    │   │   ├── create/page.tsx   # Create bond form
    │   │   └── [id]/page.tsx     # Bond detail
    │   ├── profile/
    │   │   └── [address]/page.tsx # Public profile
    │   └── explore/page.tsx      # Discover open bonds
    ├── components/
    │   ├── wallet/
    │   ├── bond/
    │   ├── nft/
    │   └── ui/
    ├── hooks/
    ├── lib/
    ├── store/
    └── types/
```

---

## Setup & Run Locally

```bash
# 1. Clone
git clone https://github.com/Omachilda-Dev1/CoSigned.git
cd CoSigned

# 2. Install contract dependencies
npm install

# 3. Copy env and fill in your values
cp .env.example .env

# 4. Compile contracts
npx hardhat compile

# 5. Run tests
npx hardhat test

# 6. Install frontend dependencies
cd frontend
npm install

# 7. Copy frontend env
cp .env.local.example .env.local

# 8. Run frontend dev server
npm run dev
# → http://localhost:3000
```

---

## Contract Addresses

| Contract | Network | Address |
|---|---|---|
| CoSigned.sol | Base Sepolia | [0xd1D2a913eb75B43125AA860bea1BabC27F2d550A](https://sepolia.basescan.org/address/0xd1D2a913eb75B43125AA860bea1BabC27F2d550A#code) ✅ |
| CoSignedNFT.sol | Base Sepolia | [0xC6Fce62038C0FD7f50c447a51C05492096554df5](https://sepolia.basescan.org/address/0xC6Fce62038C0FD7f50c447a51C05492096554df5#code) ✅ |

---

## Screenshots

> Coming Day 18+

---

## Built By

Chioma Ogbonna— | #Omachilda | #ENg30DayChallenge | #ENgShipIt | #CoSigned 

> CoSigned — Your skills. Witnessed on-chain. 🔏
