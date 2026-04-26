"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Logo from "@/components/ui/Logo";
import ConnectButton from "@/components/wallet/ConnectButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import StatusBadge from "@/components/ui/StatusBadge";
import BondTimeline from "@/components/bond/BondTimeline";
import SignButton from "@/components/bond/SignButton";
import { useBond, usePartyRole } from "@/hooks/useCoSigned";
import { BondStatus } from "@/types/bond";
import { formatEther } from "viem";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncate(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

function formatDeadline(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function InfoRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: "#5A5A7A", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "var(--font-dm-mono, monospace)" : "var(--font-syne, sans-serif)",
        fontSize: mono ? 13 : 15,
        color: "#F0F0F5",
        wordBreak: "break-all",
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BondDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { address } = useAccount();
  const bondId = BigInt(params.id);

  const { bond, isLoading, error } = useBond(bondId);
  const { isMentor, isLearner, isParty } = usePartyRole(bond);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageShell router={router}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 800, margin: "0 auto" }}>
          {[200, 120, 80].map(h => (
            <div key={h} style={{
              height: h, borderRadius: 12,
              background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }} />
          ))}
        </div>
      </PageShell>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (error || !bond || bond.id === 0n) {
    return (
      <PageShell router={router}>
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <p style={{ fontFamily: "var(--font-syne, sans-serif)", fontSize: 20, fontWeight: 700, color: "#F0F0F5", marginBottom: 8 }}>
            Bond not found
          </p>
          <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 13, color: "#5A5A7A", marginBottom: 24 }}>
            Bond #{params.id} doesn&apos;t exist or hasn&apos;t been indexed yet.
          </p>
          <button onClick={() => router.push("/dashboard")} style={ghostBtn}>
            Back to Dashboard
          </button>
        </div>
      </PageShell>
    );
  }

  const isCompleted = bond.status === BondStatus.Completed;
  const isDisputed  = bond.status === BondStatus.Disputed;

  return (
    <PageShell router={router}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── Back + breadcrumb ── */}
        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 32, display: "flex", alignItems: "center", gap: 8, minHeight: 44 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A5A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "#5A5A7A" }}>
            Dashboard
          </span>
        </button>

        {/* ── Header ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#5A5A7A", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Bond #{bond.id.toString()}
              </p>
              <h1 style={{
                fontFamily: "var(--font-syne, sans-serif)",
                fontWeight: 800, fontSize: 28,
                color: "#F0F0F5", letterSpacing: "-0.02em",
                margin: 0,
              }}>
                {bond.skillTitle}
              </h1>
            </div>
            <StatusBadge status={bond.status} size="md" />
          </div>

          {/* Role indicator */}
          {isParty && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 12px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.03)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: isMentor ? "#4DFFD2" : "#E8FF47", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: isMentor ? "#4DFFD2" : "#E8FF47" }}>
                You are the {isMentor ? "Mentor" : "Learner"}
              </span>
            </div>
          )}
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 40, alignItems: "start" }}>

          {/* ── LEFT: Bond details ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Timeline */}
            <section style={{
              padding: "28px 28px 24px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}>
              <h2 style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: "#5A5A7A", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 28 }}>
                Progress
              </h2>
              <BondTimeline
                status={bond.status}
                mentorSigned={bond.mentorSigned}
                learnerSigned={bond.learnerSigned}
              />
            </section>

            {/* Bond info */}
            <section style={{
              padding: "28px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              backgroundColor: "rgba(255,255,255,0.02)",
              display: "flex", flexDirection: "column", gap: 24,
            }}>
              <h2 style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: "#5A5A7A", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                Bond Details
              </h2>

              <InfoRow label="Success Criteria" value={bond.successCriteria} mono={false} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <InfoRow label="Mentor" value={truncate(bond.mentor)} />
                <InfoRow label="Learner" value={truncate(bond.learner)} />
                <InfoRow label="Stake" value={`${formatEther(bond.stakeAmount)} ETH`} />
                <InfoRow label="Deadline" value={formatDeadline(bond.deadline)} />
              </div>

              {bond.ipfsHash && (
                <div>
                  <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: "#5A5A7A", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 4 }}>
                    IPFS Metadata
                  </span>
                  <a
                    href={`https://ipfs.io/ipfs/${bond.ipfsHash.replace("ipfs://", "")}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "#4DFFD2", wordBreak: "break-all" }}
                  >
                    {bond.ipfsHash.slice(0, 40)}… ↗
                  </a>
                </div>
              )}

              {/* BaseScan link */}
              <a
                href={`https://sepolia.basescan.org/address/0xd1D2a913eb75B43125AA860bea1BabC27F2d550A`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#5A5A7A", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#4DFFD2")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5A5A7A")}
              >
                View contract on BaseScan ↗
              </a>
            </section>
          </div>

          {/* ── RIGHT: Action panel ── */}
          <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Disputed banner */}
            {isDisputed && (
              <div style={{
                padding: "14px 16px", borderRadius: 10,
                border: "1px solid rgba(255,77,109,0.3)",
                backgroundColor: "rgba(255,77,109,0.06)",
              }}>
                <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "#FF4D6D", margin: 0, fontWeight: 600 }}>
                  Dispute raised
                </p>
                <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "rgba(255,77,109,0.7)", margin: "4px 0 0" }}>
                  7-day resolution window is open. After it closes, the learner&apos;s stake is refunded.
                </p>
              </div>
            )}

            {/* Completed banner */}
            {isCompleted && (
              <div style={{
                padding: "14px 16px", borderRadius: 10,
                border: "1px solid rgba(77,255,210,0.3)",
                backgroundColor: "rgba(77,255,210,0.06)",
              }}>
                <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "#4DFFD2", margin: 0, fontWeight: 600 }}>
                  Bond completed
                </p>
                <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "rgba(77,255,210,0.7)", margin: "4px 0 0" }}>
                  Soulbound NFTs minted. Stake refunded to learner.
                </p>
              </div>
            )}

            {/* Action card */}
            <div style={{
              padding: "24px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}>
              <h2 style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: "#5A5A7A", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>
                {!address ? "Connect Wallet" : !isParty ? "Read Only" : "Your Action"}
              </h2>

              {!address ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "#5A5A7A" }}>
                    Connect your wallet to interact with this bond.
                  </p>
                  <ConnectButton />
                </div>
              ) : !isParty ? (
                <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "#5A5A7A" }}>
                  You are not a party to this bond. Read-only view.
                </p>
              ) : (
                <SignButton bond={bond} />
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PageShell>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

const ghostBtn: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono, monospace)", fontSize: 13, fontWeight: 700,
  padding: "10px 24px", borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)", color: "#F0F0F5",
  backgroundColor: "transparent", cursor: "pointer",
};

function PageShell({ children, router }: { children: React.ReactNode; router: ReturnType<typeof useRouter> }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0F", color: "#F0F0F5" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "rgba(10,10,15,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 40px", maxWidth: 1280, margin: "0 auto",
        }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}>
            <Logo width={156} height={40} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px 80px" }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#0A0A0F" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "20px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo variant="icon" width={22} height={22} />
            <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#5A5A7A" }}>
              CoSigned — Your skills. Witnessed on-chain.
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#5A5A7A" }}>
            Base Sepolia · Chain 84532
          </span>
        </div>
      </footer>
    </div>
  );
}
