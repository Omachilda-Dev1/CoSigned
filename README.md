# CoSigned 🔏
### Your skills. Witnessed on-chain.

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
| Smart Contracts | Solidity, Hardhat, ERC-5192 |
| Blockchain | Base Sepolia Testnet |
| Frontend | Next.js 14 (App Router), Tailwind CSS, Framer Motion |
| Web3 | Wagmi v2, RainbowKit, ethers.js v6 |
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

## 30-Day Roadmap

| Phase | Days | Goal |
|---|---|---|
| Idea & Scope | 1–3 | Architecture, design, environment setup |
| Repo Setup | 4 | Public repo, production README |
| Core Build | 5–15 | Smart contracts, tests, testnet deploy |
| Advanced Features | 16–24 | Full frontend, all pages |
| Checkpoint 2 | 25 | End-to-end testnet walkthrough |
| Testing | 26–28 | Real user testing, polish, mobile |
| Deploy | 29 | Vercel deploy, final docs |
| Demo Day | 30 | Demo video, final post, submission |

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
├── deployments.json
└── frontend/
    ├── app/
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

## Smart Contract Functions (Planned)

### CoSigned.sol
| Function | Caller | Description |
|---|---|---|
| `createBond(learner, skillTitle, successCriteria, deadline, ipfsHash)` | Mentor | Creates a new Bond |
| `acceptBond(bondId)` | Learner (payable) | Accepts bond, stakes ETH |
| `signCompletion(bondId)` | Mentor or Learner | Signs off on completion |
| `disputeBond(bondId)` | Mentor or Learner | Raises dispute after deadline |
| `resolveDispute(bondId)` | Either party | Resolves after 7-day window |
| `getBond(bondId)` | Anyone | Returns Bond struct |
| `getBondsByAddress(address)` | Anyone | Returns all bond IDs for a wallet |

### CoSignedNFT.sol
| Function | Description |
|---|---|
| `mint(to, tokenType, metadataURI)` | Mints soulbound NFT — only callable by CoSigned.sol |
| `locked(tokenId)` | ERC-5192: always returns true |
| `transferFrom(...)` | Reverts — soulbound |

---

## Frontend Pages (Planned)

| Page | Path | Purpose |
|---|---|---|
| Landing | `/` | Hero, how it works, live stats |
| Dashboard | `/dashboard` | All bonds for connected wallet |
| Create Bond | `/bond/create` | Mentor creates a new bond |
| Bond Detail | `/bond/[id]` | View bond, take action (sign/accept/dispute) |
| Public Profile | `/profile/[address]` | Shareable reputation page |
| Explore | `/explore` | Discover open bonds |

---

## Setup (Coming Day 3+)

```bash
# Clone
git clone https://github.com/[your-handle]/cosigned
cd cosigned

# Contracts
npm install
npx hardhat compile

# Frontend
cd frontend
npm install
npm run dev
```

---

## Contract Addresses

> Deploying to Base Sepolia on Day 14. Addresses will be listed here.

---

## Screenshots

> Coming Day 18+

---

## Built By

Chioma — #ENg30DayChallenge | #ENgShipIt | #CoSigned

> CoSigned — Your skills. Witnessed on-chain. 🔏
