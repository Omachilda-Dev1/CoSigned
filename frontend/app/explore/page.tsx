"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import ConnectButton from "@/components/wallet/ConnectButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import StatusBadge from "@/components/ui/StatusBadge";
import { useBond, useBondCounter } from "@/hooks/useCoSigned";
import { BondStatus } from "@/types/bond";
import type { Bond } from "@/types/bond";
import { formatEther } from "viem";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function daysRemaining(deadline: bigint): number {
  const diff = Number(deadline) - Math.floor(Date.now() / 1000);
  return Math.max(0, Math.floor(diff / 86400));
}

type SortKey = "recent" | "closing";

// ─── Open Bond Card ───────────────────────────────────────────────────────────

function OpenBondCard({ bond }: { bond: Bond }) {
  const router = useRouter();
  const days = daysRemaining(bond.deadline);
  const urgentColor = days < 3 ? "var(--accent-red)" : days < 7 ? "var(--accent-yellow)" : "var(--text-muted)";

  return (
    <button
      onClick={() => router.push(`/bond/${bond.id.toString()}`)}
      style={{
        display: "flex", flexDirection: "column", gap: 16,
        padding: "20px 22px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer", textAlign: "left", width: "100%",
        transition: "all var(--transition-base)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--accent-teal-border)";
        e.currentTarget.style.boxShadow = "var(--shadow-teal)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border-default)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      aria-label={`Open bond: ${bond.skillTitle}`}
    >
      {/* Top: title + badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", margin: 0, lineHeight: 1.3, flex: 1 }}>
          {bond.skillTitle}
        </h3>
        <StatusBadge status={bond.status} />
      </div>

      {/* Mentor */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Mentor</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{truncate(bond.mentor)}</span>
      </div>

      {/* Bottom: deadline + stake + arrow */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={urgentColor} strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: urgentColor }}>
            {days === 0 ? "Expires today" : `${days}d to accept`}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {bond.stakeAmount > 0n && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
              Stake: {formatEther(bond.stakeAmount)} ETH
            </span>
          )}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </button>
  );
}

// ─── Bond loader ──────────────────────────────────────────────────────────────

function BondLoader({ bondId, onLoad }: { bondId: bigint; onLoad: (bond: Bond) => void }) {
  const { bond } = useBond(bondId);
  if (bond && bond.id > 0n) onLoad(bond);
  return null;
}

// ─── Explore inner ────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const router = useRouter();
  const { count, isLoading: countLoading } = useBondCounter();
  const [sort, setSort] = useState<SortKey>("recent");
  const [loadedBonds, setLoadedBonds] = useState<Map<string, Bond>>(new Map());

  // Build array of all bond IDs to load
  const totalCount = Number(count);
  const allIds: bigint[] = Array.from({ length: totalCount }, (_, i) => BigInt(i + 1));

  const handleBondLoad = (bond: Bond) => {
    setLoadedBonds(prev => {
      if (prev.has(bond.id.toString())) return prev;
      const next = new Map(prev);
      next.set(bond.id.toString(), bond);
      return next;
    });
  };

  // Filter to Pending bonds only (open for acceptance)
  const openBonds = Array.from(loadedBonds.values()).filter(
    b => b.status === BondStatus.Pending && Number(b.deadline) > Math.floor(Date.now() / 1000)
  );

  // Sort
  const sorted = [...openBonds].sort((a, b) => {
    if (sort === "closing") return Number(a.deadline) - Number(b.deadline);
    return Number(b.id) - Number(a.id); // recent = highest ID first
  });

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
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}>
            <Logo width={156} height={40} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => router.push("/dashboard")}
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", backgroundColor: "transparent", color: "var(--text-muted)", cursor: "pointer", minHeight: 44 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              Dashboard
            </button>
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--text-primary)", letterSpacing: "-0.025em", margin: "0 0 8px" }}>
            Explore Bonds
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>
            Open bonds waiting for a learner to accept.
          </p>
        </div>

        {/* Controls row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          {/* Count */}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>
            {countLoading ? "Loading…" : `${sorted.length} open bond${sorted.length !== 1 ? "s" : ""}`}
          </span>

          {/* Sort filters */}
          <div style={{ display: "flex", gap: 8 }}>
            {(["recent", "closing"] as SortKey[]).map(key => (
              <button
                key={key}
                onClick={() => setSort(key)}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
                  padding: "7px 16px", borderRadius: "var(--radius-sm)",
                  border: `1px solid ${sort === key ? "var(--accent-teal-border)" : "var(--border-default)"}`,
                  backgroundColor: sort === key ? "var(--accent-teal-dim)" : "transparent",
                  color: sort === key ? "var(--accent-teal)" : "var(--text-muted)",
                  cursor: "pointer", transition: "all var(--transition-fast)", minHeight: 44,
                }}
              >
                {key === "recent" ? "Recently Created" : "Closing Soon"}
              </button>
            ))}
          </div>
        </div>

        {/* Hidden bond loaders — fetch all bonds silently */}
        {allIds.map(id => (
          <BondLoader key={id.toString()} bondId={id} onLoad={handleBondLoad} />
        ))}

        {/* Bond grid */}
        {countLoading || (totalCount > 0 && loadedBonds.size < totalCount && sorted.length === 0) ? (
          /* Skeleton */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 160, borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                backgroundImage: "linear-gradient(90deg, transparent 0%, var(--bg-overlay) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.6s infinite",
              }} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          /* Empty state */
          <div style={{
            padding: "64px 32px", textAlign: "center",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--border-default)",
            backgroundColor: "var(--bg-surface)",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              backgroundColor: "var(--bg-elevated)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              No open bonds right now
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 }}>
              Be the first to create a bond and start mentoring someone on-chain.
            </p>
            <button
              onClick={() => router.push("/bond/create")}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700,
                padding: "12px 28px", borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--accent-teal)", color: "var(--text-inverse)",
                border: "none", cursor: "pointer", minHeight: 44,
                transition: "opacity var(--transition-fast)",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Create a Bond
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {sorted.map(bond => <OpenBondCard key={bond.id.toString()} bond={bond} />)}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-page)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo variant="icon" width={22} height={22} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
              CoSigned — Your skills. Witnessed on-chain.
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            Base Sepolia · Chain 84532
          </span>
        </div>
      </footer>

      <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
    </div>
  );
}
