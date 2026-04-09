# Contributing to CoSigned 🔏

Thanks for your interest in contributing. CoSigned is being built in public as part of the **#ENg30DayChallenge** — every contribution is visible and appreciated.

---

## Ways to Contribute

### During the Build (Days 1–28)
- **Bug reports** — open an issue with the `bug` label
- **Design feedback** — open an issue with the `design` label
- **Security review** — if you spot a reentrancy risk or logic error in the contracts, open an issue immediately with the `security` label
- **Documentation** — typos, unclear explanations, missing context

### After Day 29 (Repo is stable)
- Feature PRs aligned with the post-roadmap items
- Test coverage improvements
- Frontend accessibility improvements
- Gas optimization suggestions

---

## Getting Started

```bash
# Fork the repo, then:
git clone https://github.com/YOUR_USERNAME/CoSigned.git
cd CoSigned
npm install

# Create a branch
git checkout -b feat/your-feature-name

# Make your changes, then:
npx hardhat compile   # contracts must compile
npx hardhat test      # all tests must pass

# Commit with conventional commits
git commit -m "feat(contract): add xyz"
git push origin feat/your-feature-name
# Open a PR
```

---

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|---|---|
| `feat(contract):` | New contract functionality |
| `feat(frontend):` | New UI feature |
| `fix:` | Bug fix |
| `test:` | Adding or updating tests |
| `docs:` | Documentation only |
| `chore:` | Config, deps, tooling |
| `deploy:` | Deployment-related |

---

## Code Standards

### Solidity
- Solidity 0.8.20
- All functions must have NatSpec comments
- No external calls before state updates (CEI pattern)
- `nonReentrant` on all functions that transfer ETH
- `require()` messages must be descriptive: `"CoSigned: reason"`

### TypeScript / React
- Strict TypeScript — no `any`
- Components in `PascalCase`, hooks in `camelCase` with `use` prefix
- All contract interactions go through hooks in `frontend/hooks/`
- No direct `wagmi` calls in page components

### Testing
- Every new contract function needs at least one happy-path and one revert test
- Use `ethers.getSigners()` for multi-wallet test scenarios

---

## Issue Labels

| Label | Meaning |
|---|---|
| `bug` | Something is broken |
| `enhancement` | New feature request |
| `design` | UI/UX feedback |
| `security` | Contract security concern — high priority |
| `good first issue` | Good for first-time contributors |
| `help wanted` | Actively looking for help |
| `documentation` | Docs improvement |
| `wontfix` | Out of scope for 30-day build |

---

## Questions?

Open a [GitHub Discussion](https://github.com/Omachilda-Dev1/CoSigned/discussions) or reach out on Twitter/LinkedIn with `#CoSigned`.
