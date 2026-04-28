"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import WalletGuard from "@/components/wallet/WalletGuard";
import BondCard from "@/components/bond/BondCard";
import Logo from "@/components/ui/Logo";
import ConnectButton from "@/components/wallet/ConnectButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useUserBonds, useBond, useBondCounter } from "@/hooks/useCoSigned";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      height: 110, borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      backgroundColor: "var(--bg-elevated)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, transparent 0%, var(--bg-overlay) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
      }} />
    </div>
  );
}

// ─── Bond loader ──────────────────────────────────────────────────────────────

function BondCardLoader({ bondId, role }: { bondId: bigint; role: "mentor" | "learner" }) {
  const { bond, isLoading } = useBond(bondId);
  if (isLoading) return <SkeletonCard />;
  if (!bond || bond.id === 0n) return null;
  return <BondCard bond={bond} role={role} />;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ role, onAction }: { role: "mentor" | "learner"; onAction: () => void }) {
  const isMentor = role === "mentor";
  return (
    <div style={{
      padding: "52px 32px",
      borderRadius: "var(--radius-lg)",
      border: "1px dashed var(--border-default)",
      textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      backgroundColor: "var(--bg-surface)",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        backgroundColor: "var(--bg-elevated)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 4,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {isMentor
            ? <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>
            : <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>
          }
        </svg>
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
          {isMentor ? "No bonds yet" : "No learning bonds yet"}
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 220 }}>
          {isMentor
            ? "Create your first bond and start mentoring someone on-chain."
            : "Browse open bonds and accept one to start learning."}
        </p>
      </div>
      <button
        onClick={onAction}
        style={{
          marginTop: 4,
          fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
          padding: "10px 24px", borderRadius: "var(--radius-sm)",
          border: isMentor ? "none" : "1px solid var(--border-default)",
          color: isMentor ? "var(--text-inverse)" : "var(--text-secondary)",
          backgroundColor: isMentor ? "var(--accent-teal)" : "transparent",
          cursor: "pointer", transition: "opacity var(--transition-fast)",
          minHeight: 44,
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {isMentor ? "Create a Bond" : "Explore Bonds"}
      </button>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 4,
      padding: "16px 24px", borderRadius: "var(--radius-md)",
      border: `1px solid ${accent ? "var(--accent-teal-border)" : "var(--border-default)"}`,
      backgroundColor: accent ? "var(--accent-teal-dim)" : "var(--bg-elevated)",
      minWidth: 120,
    }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: accent ? "var(--accent-teal)" : "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </span>
    </div>
  );
}

// ─── Bond panel ───────────────────────────────────────────────────────────────

function BondPanel({ title, subtitle, bondIds, role, isLoading, onAction }: {
  title: string; subtitle: string; bondIds: bigint[];
  role: "mentor" | "learner"; isLoading: boolean; onAction: () => void;
}) {
  const isMentor   = role === "mentor";
  const dotVar     = isMentor ? "var(--accent-teal)"   : "var(--accent-yellow)";
  const badgeBgVar = isMentor ? "var(--accent-teal-dim)"    : "var(--accent-yellow-dim)";
  const badgeBdVar = isMentor ? "var(--accent-teal-border)" : "var(--accent-yellow-border)";
  const badgeTxVar = isMentor ? "var(--accent-teal)"        : "var(--accent-yellow)";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dotVar, flexShrink: 0, boxShadow: `0 0 6px ${dotVar}` }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", letterSpacing: "-0.01em", margin: 0 }}>
              {title}
            </h2>
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginLeft: 16 }}>
            {subtitle}
          </p>
        </div>
        {!isLoading && bondIds.length > 0 && (
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: badgeTxVar, backgroundColor: badgeBgVar,
            border: `1px solid ${badgeBdVar}`,
            borderRadius: "var(--radius-full)", padding: "3px 10px", whiteSpace: "nowrap",
          }}>
            {bondIds.length} active
          </span>
        )}
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SkeletonCard /><SkeletonCard />
        </div>
      ) : bondIds.length === 0 ? (
        <EmptyState role={role} onAction={onAction} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bondIds.map(id => <BondCardLoader key={id.toString()} bondId={id} role={role} />)}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard inner ──────────────────────────────────────────────────────────

function DashboardInner() {
  const router = useRouter();
  const { address } = useAccount();
  const { bondIds, isLoading } = useUserBonds(address);
  const { count } = useBondCounter();

  const halfLen    = Math.ceil(bondIds.length / 2);
  const mentorIds  = bondIds.slice(0, halfLen);
  const learnerIds = bondIds.slice(halfLen);
  const shortAddr  = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid var(--nav-border)",
        backgroundColor: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 40px", maxWidth: 1280, margin: "0 auto" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }} aria-label="Home">
            <Logo width={156} height={40} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => router.push("/bond/create")}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                padding: "8px 18px", borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--accent-teal)", color: "var(--text-inverse)",
                border: "none", cursor: "pointer", transition: "opacity var(--transition-fast)", minHeight: 44,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              + New Bond
            </button>
            <button
              onClick={() => router.push(`/profile/${address}`)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
                padding: "8px 16px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-secondary)",
                cursor: "pointer", transition: "all var(--transition-fast)", minHeight: 44,
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent-teal-border)";
                e.currentTarget.style.color = "var(--accent-teal)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
              aria-label="View my profile"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              My Profile
            </button>
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40, paddingLeft: 16, borderLeft: "3px solid var(--accent-yellow)" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
            Welcome back · <span style={{ color: "var(--accent-teal)" }}>{shortAddr}</span>
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--text-primary)", letterSpacing: "-0.025em", margin: "0 0 8px" }}>
            Your Bonds
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>
            Manage your active mentorships and learning engagements
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap" }}>
          <StatPill label="Total Bonds" value={count.toString()} accent />
          <StatPill label="Mentoring"   value={mentorIds.length.toString()} />
          <StatPill label="Learning"    value={learnerIds.length.toString()} />
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "var(--border-subtle)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
            Your Activity
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: "var(--border-subtle)" }} />
        </div>

        {/* Panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <BondPanel title="Bonds I'm Mentoring" subtitle="Skills you're teaching on-chain"   bondIds={mentorIds}  role="mentor"  isLoading={isLoading} onAction={() => router.push("/bond/create")} />
          <BondPanel title="Bonds I'm Learning"  subtitle="Skills you're acquiring on-chain"  bondIds={learnerIds} role="learner" isLoading={isLoading} onAction={() => router.push("/explore")} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-page)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo variant="icon" width={22} height={22} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
              CoSigned — Your skills. Witnessed on-chain.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="https://sepolia.basescan.org/address/0xd1D2a913eb75B43125AA860bea1BabC27F2d550A" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-teal)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >BaseScan ↗</a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>Base Sepolia · Chain 84532</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          main { padding: 32px 20px 60px !important; }
          nav > div { padding: 12px 20px !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return <WalletGuard><DashboardInner /></WalletGuard>;
}
