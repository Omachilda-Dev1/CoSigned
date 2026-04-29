"use client";

import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import ConnectButton from "@/components/wallet/ConnectButton";
import ThemeToggle from "@/components/ui/ThemeToggle";

// ─── Step Data ────────────────────────────────────────────────────────────────

const steps = [
  {
    num: "01",
    title: "Connect Your Wallet",
    desc: "Connect your MetaMask wallet to Base Sepolia testnet. Make sure you have some test ETH for gas fees and staking.",
    action: "Connect Wallet",
    actionRoute: null,
  },
  {
    num: "02",
    title: "Create a Bond (Mentor)",
    desc: "As a mentor, create a new Bond by defining the skill to be learned, success criteria, deadline, and stake amount. Upload evidence to IPFS.",
    action: "Try it",
    actionRoute: "/bond/create",
  },
  {
    num: "03",
    title: "Accept a Bond (Learner)",
    desc: "As a learner, browse open Bonds and accept one by staking the required ETH. Your stake shows commitment and is refunded on completion.",
    action: "Try it",
    actionRoute: "/explore",
  },
  {
    num: "04",
    title: "Both Co-Sign",
    desc: "When the work is complete, both mentor and learner must sign the Bond. Either can sign first, but both signatures are required to complete it.",
    action: "Try it",
    actionRoute: "/dashboard",
  },
  {
    num: "05",
    title: "NFTs Minted",
    desc: "Once both parties co-sign, soulbound NFT credentials are automatically minted to both wallets. These are permanent, non-transferable proof of the mentorship.",
    action: null,
    actionRoute: null,
  },
  {
    num: "06",
    title: "Share Your Credential",
    desc: "Share your soulbound credential on LinkedIn, Twitter, or your portfolio. Anyone can verify it on-chain via BaseScan.",
    action: null,
    actionRoute: null,
  },
];

// ─── Illustrations ────────────────────────────────────────────────────────────

function WalletIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      {/* Browser window */}
      <rect x="20" y="30" width="260" height="150" rx="8" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="2"/>
      <rect x="20" y="30" width="260" height="30" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="2"/>
      <circle cx="35" cy="45" r="4" fill="var(--accent-red)"/>
      <circle cx="50" cy="45" r="4" fill="var(--accent-yellow)"/>
      <circle cx="65" cy="45" r="4" fill="var(--accent-teal)"/>
      
      {/* MetaMask fox icon (simplified) */}
      <circle cx="150" cy="110" r="35" fill="var(--accent-orange-dim)" stroke="var(--accent-orange)" strokeWidth="2"/>
      <path d="M150 95 L135 110 L150 120 L165 110 Z" fill="var(--accent-orange)" opacity="0.8"/>
      <circle cx="142" cy="108" r="3" fill="var(--text-primary)"/>
      <circle cx="158" cy="108" r="3" fill="var(--text-primary)"/>
      
      {/* Connection arrow */}
      <path d="M150 145 L150 165" stroke="var(--accent-teal)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowhead)"/>
      <text x="150" y="180" fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">Base Sepolia</text>
      
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <polygon points="0 0, 10 5, 0 10" fill="var(--accent-teal)"/>
        </marker>
      </defs>
    </svg>
  );
}

function CreateBondIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      {/* Form card */}
      <rect x="50" y="20" width="200" height="160" rx="12" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="2"/>
      
      {/* Form fields */}
      <rect x="70" y="40" width="160" height="20" rx="6" fill="var(--input-bg)" stroke="var(--input-border)" strokeWidth="1"/>
      <text x="80" y="54" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Skill: React Development</text>
      
      <rect x="70" y="70" width="160" height="20" rx="6" fill="var(--input-bg)" stroke="var(--input-border)" strokeWidth="1"/>
      <text x="80" y="84" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Criteria: Build 3 apps</text>
      
      <rect x="70" y="100" width="160" height="20" rx="6" fill="var(--input-bg)" stroke="var(--input-border)" strokeWidth="1"/>
      <text x="80" y="114" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Deadline: 30 days</text>
      
      <rect x="70" y="130" width="160" height="20" rx="6" fill="var(--input-bg)" stroke="var(--input-border)" strokeWidth="1"/>
      <text x="80" y="144" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Stake: 0.01 ETH</text>
      
      {/* Create button */}
      <rect x="70" y="160" width="160" height="15" rx="6" fill="var(--accent-teal)"/>
      <text x="150" y="171" fill="var(--text-inverse)" fontSize="10" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle">Create Bond</text>
    </svg>
  );
}

function AcceptBondIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      {/* ETH coins */}
      <circle cx="80" cy="60" r="25" fill="var(--accent-teal-dim)" stroke="var(--accent-teal)" strokeWidth="2"/>
      <text x="80" y="67" fill="var(--accent-teal)" fontSize="20" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle">Ξ</text>
      
      <circle cx="130" cy="60" r="25" fill="var(--accent-teal-dim)" stroke="var(--accent-teal)" strokeWidth="2"/>
      <text x="130" y="67" fill="var(--accent-teal)" fontSize="20" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle">Ξ</text>
      
      <circle cx="180" cy="60" r="25" fill="var(--accent-teal-dim)" stroke="var(--accent-teal)" strokeWidth="2"/>
      <text x="180" y="67" fill="var(--accent-teal)" fontSize="20" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle">Ξ</text>
      
      {/* Arrow down */}
      <path d="M130 95 L130 125" stroke="var(--accent-teal)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowhead2)"/>
      
      {/* Lock/vault */}
      <rect x="90" y="135" width="80" height="50" rx="8" fill="var(--bg-elevated)" stroke="var(--accent-yellow)" strokeWidth="2"/>
      <circle cx="130" cy="160" r="12" fill="var(--accent-yellow-dim)" stroke="var(--accent-yellow)" strokeWidth="2"/>
      <rect x="127" y="165" width="6" height="10" fill="var(--accent-yellow)"/>
      
      <defs>
        <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <polygon points="0 0, 10 5, 0 10" fill="var(--accent-teal)"/>
        </marker>
      </defs>
    </svg>
  );
}

function CoSignIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      {/* Left signature (Mentor) */}
      <circle cx="70" cy="100" r="30" fill="var(--accent-teal-dim)" stroke="var(--accent-teal)" strokeWidth="2"/>
      <path d="M55 100 L65 110 L85 85" stroke="var(--accent-teal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="70" y="145" fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">Mentor</text>
      
      {/* Right signature (Learner) */}
      <circle cx="230" cy="100" r="30" fill="var(--accent-yellow-dim)" stroke="var(--accent-yellow)" strokeWidth="2"/>
      <path d="M215 100 L225 110 L245 85" stroke="var(--accent-yellow)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="230" y="145" fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">Learner</text>
      
      {/* Connection line */}
      <path d="M100 100 L200 100" stroke="var(--border-default)" strokeWidth="2" strokeDasharray="5,5"/>
      
      {/* Center lock */}
      <circle cx="150" cy="100" r="20" fill="var(--bg-surface)" stroke="var(--accent-teal)" strokeWidth="2"/>
      <rect x="143" y="95" width="14" height="10" rx="2" fill="var(--bg-surface)" stroke="var(--accent-teal)" strokeWidth="1.5"/>
      <path d="M146 95 Q146 90 150 90 Q154 90 154 95" stroke="var(--accent-teal)" strokeWidth="1.5" fill="none"/>
      <circle cx="150" cy="100" r="2" fill="var(--accent-teal)"/>
    </svg>
  );
}

function NFTMintIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      {/* Left NFT card (Mentor) */}
      <rect x="30" y="50" width="100" height="120" rx="8" fill="var(--bg-elevated)" stroke="var(--accent-teal)" strokeWidth="2"/>
      <rect x="40" y="60" width="80" height="60" rx="4" fill="var(--accent-teal-dim)"/>
      <circle cx="80" cy="90" r="15" fill="var(--accent-teal)" opacity="0.5"/>
      <text x="80" y="140" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle">Mentor</text>
      <text x="80" y="155" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">NFT #001</text>
      
      {/* Right NFT card (Learner) */}
      <rect x="170" y="50" width="100" height="120" rx="8" fill="var(--bg-elevated)" stroke="var(--accent-yellow)" strokeWidth="2"/>
      <rect x="180" y="60" width="80" height="60" rx="4" fill="var(--accent-yellow-dim)"/>
      <circle cx="220" cy="90" r="15" fill="var(--accent-yellow)" opacity="0.5"/>
      <text x="220" y="140" fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle">Learner</text>
      <text x="220" y="155" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">NFT #002</text>
      
      {/* Lock icon in center */}
      <circle cx="150" cy="30" r="18" fill="var(--bg-surface)" stroke="var(--accent-teal)" strokeWidth="2"/>
      <rect x="144" y="26" width="12" height="8" rx="2" fill="var(--bg-surface)" stroke="var(--accent-teal)" strokeWidth="1.5"/>
      <path d="M147 26 Q147 22 150 22 Q153 22 153 26" stroke="var(--accent-teal)" strokeWidth="1.5" fill="none"/>
      <circle cx="150" cy="30" r="1.5" fill="var(--accent-teal)"/>
      <text x="150" y="190" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">Soulbound · Non-transferable</text>
    </svg>
  );
}

function ShareIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      {/* Credential card */}
      <rect x="75" y="40" width="150" height="100" rx="12" fill="var(--bg-elevated)" stroke="var(--accent-teal)" strokeWidth="2"/>
      <rect x="90" y="55" width="120" height="50" rx="6" fill="var(--accent-teal-dim)"/>
      <circle cx="150" cy="80" r="12" fill="var(--accent-teal)" opacity="0.6"/>
      <text x="150" y="115" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-display)" fontWeight="700" textAnchor="middle">React Dev</text>
      <text x="150" y="128" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">Verified on Base</text>
      
      {/* Social icons */}
      <circle cx="100" cy="170" r="18" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="2"/>
      <text x="100" y="177" fill="var(--text-secondary)" fontSize="16" textAnchor="middle">𝕏</text>
      
      <circle cx="150" cy="170" r="18" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="2"/>
      <text x="150" y="177" fill="var(--text-secondary)" fontSize="16" textAnchor="middle">in</text>
      
      <circle cx="200" cy="170" r="18" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="2"/>
      <path d="M195 165 L205 165 L205 175 L195 175 Z" stroke="var(--text-secondary)" strokeWidth="2" fill="none"/>
      <path d="M198 168 L202 172" stroke="var(--text-secondary)" strokeWidth="2"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HowToUsePage() {
  const router = useRouter();

  const illustrations = [
    WalletIllustration,
    CreateBondIllustration,
    AcceptBondIllustration,
    CoSignIllustration,
    NFTMintIllustration,
    ShareIllustration,
  ];

  return (
    <div
      className="min-h-screen font-[family-name:var(--font-syne)]"
      style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50"
        style={{
          borderBottom: "1px solid var(--nav-border)",
          backgroundColor: "var(--nav-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              style={{
                background: "transparent",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 12px",
                cursor: "pointer",
                color: "var(--text-muted)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                transition: "color 0.15s, border-color 0.15s",
                minHeight: 44,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "var(--border-strong)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "var(--border-default)";
              }}
              aria-label="Back to home"
            >
              ← Back
            </button>
            <Logo width={180} height={46} />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-8 pt-20 pb-16 max-w-6xl mx-auto text-center">
        <h1
          className="font-black leading-tight tracking-tight mb-4"
          style={{ fontSize: "clamp(36px, 4vw, 52px)", color: "var(--text-primary)" }}
        >
          How to Use <span style={{ color: "var(--accent-teal)" }}>CoSigned</span>
        </h1>
        <p
          className="text-base leading-relaxed mx-auto"
          style={{ color: "var(--text-secondary)", maxWidth: 600 }}
        >
          A step-by-step guide to creating, accepting, and completing mentorship Bonds on-chain.
        </p>
      </section>

      {/* ── Steps ── */}
      <section className="px-8 pb-24 max-w-6xl mx-auto">
        <div className="flex flex-col gap-20">
          {steps.map((step, idx) => {
            const Illustration = illustrations[idx];
            const isEven = idx % 2 === 1;

            return (
              <div
                key={step.num}
                className="how-step-grid"
                style={{ alignItems: "center" }}
              >
                {/* Content */}
                <div
                  className={isEven ? "lg:order-2" : "lg:order-1"}
                  style={{ order: isEven ? 2 : 1 }}
                >
                  <div
                    className="inline-block px-3 py-1 rounded-full mb-4"
                    style={{
                      backgroundColor: "var(--accent-teal-dim)",
                      border: "1px solid var(--accent-teal-border)",
                    }}
                  >
                    <span
                      className="text-xs font-[family-name:var(--font-dm-mono)] font-bold"
                      style={{ color: "var(--accent-teal)" }}
                    >
                      STEP {step.num}
                    </span>
                  </div>

                  <h2
                    className="text-3xl font-black mb-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {step.title}
                  </h2>

                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {step.desc}
                  </p>

                  {step.action && (
                    <button
                      onClick={() => step.actionRoute && router.push(step.actionRoute)}
                      disabled={!step.actionRoute}
                      style={{
                        backgroundColor: step.actionRoute ? "var(--accent-teal)" : "var(--bg-elevated)",
                        color: step.actionRoute ? "var(--text-inverse)" : "var(--text-muted)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 14,
                        padding: "12px 28px",
                        borderRadius: "var(--radius-md)",
                        border: step.actionRoute ? "none" : "1px solid var(--border-default)",
                        cursor: step.actionRoute ? "pointer" : "not-allowed",
                        transition: "opacity 200ms ease",
                        minHeight: 44,
                      }}
                      onMouseEnter={e => step.actionRoute && (e.currentTarget.style.opacity = "0.85")}
                      onMouseLeave={e => step.actionRoute && (e.currentTarget.style.opacity = "1")}
                      aria-label={step.action}
                    >
                      {step.action}
                    </button>
                  )}
                </div>

                {/* Illustration */}
                <div
                  className={isEven ? "lg:order-1" : "lg:order-2"}
                  style={{
                    order: isEven ? 1 : 2,
                    padding: 24,
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-default)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  <Illustration />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-8 py-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <Logo variant="icon" width={32} height={32} />
        <p
          className="text-xs font-[family-name:var(--font-dm-mono)]"
          style={{ color: "var(--text-muted)" }}
        >
          Base Sepolia · Chain 84532
        </p>
      </footer>
    </div>
  );
}
