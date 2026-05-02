"use client";

import { useRouter } from "next/navigation";
import { useEnsName } from "wagmi";
import { useAccount } from "wagmi";
import Logo from "@/components/ui/Logo";
import ConnectButton from "@/components/wallet/ConnectButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SoulboundBadge from "@/components/nft/SoulboundBadge";
import { useUserBonds, useBond } from "@/hooks/useCoSigned";
import { BondStatus } from "@/types/bond";
import type { Bond } from "@/types/bond";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function isValidAddress(addr: string): addr is `0x${string}` {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

// ─── Deterministic avatar from address ───────────────────────────────────────
// Generates a simple SVG avatar using the address as a seed.
// No external dependency needed.

function AddressAvatar({ address, size = 64 }: { address: string; size?: number }) {
  // Use address bytes to generate hue values for a gradient
  const h1 = parseInt(address.slice(2, 6), 16) % 360;
  const h2 = (h1 + 120) % 360;
  const id = `grad-${address.slice(2, 8)}`;

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 64 64"
      style={{ borderRadius: "50%", flexShrink: 0 }}
      aria-label={`Avatar for ${truncate(address)}`}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${h1},70%,55%)`} />
          <stop offset="100%" stopColor={`hsl(${h2},70%,45%)`} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill={`url(#${id})`} />
      {/* Person silhouette */}
      <circle cx="32" cy="24" r="10" fill="rgba(255,255,255,0.4)" />
      <path d="M12 56 Q12 40 32 40 Q52 40 52 56" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

// ─── Bond loader for profile ──────────────────────────────────────────────────

function ProfileBondLoader({
  bondId,
  profileAddress,
  onLoad,
}: {
  bondId: bigint;
  profileAddress: string;
  onLoad?: (bond: Bond) => void;
}) {
  const { bond } = useBond(bondId);

  if (!bond || bond.id === BigInt(0)) return null;

  // Notify parent when bond loads (for stats calculation)
  if (onLoad && bond.id > BigInt(0)) onLoad(bond);

  const isLearner = bond.learner.toLowerCase() === profileAddress.toLowerCase();
  const isMentor  = bond.mentor.toLowerCase()  === profileAddress.toLowerCase();

  if (bond.status !== BondStatus.Completed) return null;

  return (
    <SoulboundBadge
      skillTitle={bond.skillTitle}
      tokenType={isLearner ? "LEARNER_PROOF" : "MENTOR_PROOF"}
      bondId={bond.id.toString()}
      size="md"
    />
  );
}

// ─── Stat box ─────────────────────────────────────────────────────────────────

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6,
      padding: "20px 28px",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-default)",
      backgroundColor: "var(--bg-elevated)",
      minWidth: 120,
    }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--accent-teal)", lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", margin: 0 }}>
        {title}
      </h2>
      {count !== undefined && (
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--accent-teal)",
          backgroundColor: "var(--accent-teal-dim)",
          border: "1px solid var(--accent-teal-border)",
          borderRadius: "var(--radius-full)", padding: "4px 12px",
        }}>
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Page inner ───────────────────────────────────────────────────────────────

function ProfileInner({ address }: { address: `0x${string}` }) {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const isOwnProfile = connectedAddress?.toLowerCase() === address.toLowerCase();

  const { data: ensName } = useEnsName({ address, chainId: 1 }); // ENS on mainnet
  const { bondIds, isLoading } = useUserBonds(address);

  const displayName = ensName ?? truncate(address);

  // We'll compute stats from loaded bonds
  // For now show total bond count as reputation proxy
  const totalBonds = bondIds.length;

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
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* ── Back button ── */}
        <button
          onClick={() => router.back()}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "none", border: "none", cursor: "pointer", padding: 0,
            marginBottom: 32, minHeight: 44,
            color: "var(--text-muted)",
            transition: "color var(--transition-fast)",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>Back</span>
        </button>

        {/* ── Profile header ── */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 28,
          marginBottom: 48, flexWrap: "wrap",
        }}>
          {/* Avatar */}
          <AddressAvatar address={address} size={80} />

          {/* Identity */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
              <h1 style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32,
                color: "var(--text-primary)", letterSpacing: "-0.02em", margin: 0,
              }}>
                {ensName ?? truncate(address)}
              </h1>
              {isOwnProfile && (
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  color: "var(--accent-teal)",
                  backgroundColor: "var(--accent-teal-dim)",
                  border: "1px solid var(--accent-teal-border)",
                  borderRadius: "var(--radius-full)", padding: "4px 12px",
                }}>
                  You
                </span>
              )}
            </div>

            {/* Full address */}
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", marginBottom: 14, wordBreak: "break-all" }}>
              {address}
            </p>

            {/* Share profile link */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                cosigned.xyz/profile/{truncate(address)}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://cosigned.xyz/profile/${address}`).catch(() => {});
                }}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 4,
                  color: "var(--text-muted)", display: "flex", alignItems: "center",
                  transition: "color var(--transition-fast)",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-teal)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                aria-label="Copy profile link"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
              <a
                href={`https://sepolia.basescan.org/address/${address}`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-teal)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                BaseScan ↗
              </a>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatBox value={isLoading ? "—" : totalBonds} label="Total Bonds" />
            <StatBox value="—" label="Reputation" />
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, backgroundColor: "var(--border-subtle)", marginBottom: 48 }} />

        {/* ── Credentials grid ── */}
        <section style={{ marginBottom: 56 }}>
          <SectionHeader title="Earned Credentials" count={isLoading ? undefined : totalBonds} />

          {isLoading ? (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 220, height: 130, borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  backgroundImage: "linear-gradient(90deg, transparent 0%, var(--bg-overlay) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.6s infinite",
                }} />
              ))}
            </div>
          ) : bondIds.length === 0 ? (
            <div style={{
              padding: "40px 24px", borderRadius: "var(--radius-lg)",
              border: "1px dashed var(--border-default)",
              backgroundColor: "var(--bg-surface)",
              textAlign: "center",
            }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>
                No completed bonds yet.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {bondIds.map(id => (
                <ProfileBondLoader
                  key={id.toString()}
                  bondId={id}
                  profileAddress={address}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── All bonds list ── */}
        <section>
          <SectionHeader title="Bond History" count={isLoading ? undefined : totalBonds} />

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2].map(i => (
                <div key={i} style={{
                  height: 64, borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  backgroundImage: "linear-gradient(90deg, transparent 0%, var(--bg-overlay) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.6s infinite",
                }} />
              ))}
            </div>
          ) : bondIds.length === 0 ? (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>
              No bonds found for this address.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bondIds.map(id => (
                <BondHistoryRow key={id.toString()} bondId={id} profileAddress={address} router={router} />
              ))}
            </div>
          )}
        </section>
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

// ─── Bond history row ─────────────────────────────────────────────────────────

function BondHistoryRow({
  bondId,
  profileAddress,
  router,
}: {
  bondId: bigint;
  profileAddress: string;
  router: ReturnType<typeof useRouter>;
}) {
  const { bond, isLoading } = useBond(bondId);
  if (isLoading || !bond || bond.id === BigInt(0)) return null;

  const isLearner = bond.learner.toLowerCase() === profileAddress.toLowerCase();
  const role      = isLearner ? "Learner" : "Mentor";
  const other     = isLearner ? bond.mentor : bond.learner;

  const statusColor =
    bond.status === BondStatus.Completed ? "var(--status-complete-text)" :
    bond.status === BondStatus.Disputed  ? "var(--status-disputed-text)" :
    "var(--text-muted)";

  const statusLabel =
    bond.status === BondStatus.Completed ? "Completed" :
    bond.status === BondStatus.Disputed  ? "Disputed"  :
    bond.status === BondStatus.Active    ? "Active"    :
    "Pending";

  return (
    <button
      onClick={() => router.push(`/bond/${bond.id.toString()}`)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
        cursor: "pointer", textAlign: "left", width: "100%",
        transition: "border-color var(--transition-fast)",
        minHeight: 44,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent-teal-border)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
          {bond.skillTitle || "Untitled Bond"}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          {role} · with {truncate(other)}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: statusColor }}>
          {statusLabel}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
          #{bond.id.toString()}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ProfilePage({ params }: { params: { address: string } }) {
  const router = useRouter();

  if (!isValidAddress(params.address)) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
            Invalid address
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
            {params.address} is not a valid Ethereum address.
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700,
              padding: "10px 24px", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-default)", color: "var(--text-primary)",
              backgroundColor: "transparent", cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <ProfileInner address={params.address as `0x${string}`} />;
}
