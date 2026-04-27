"use client";

/**
 * SoulboundBadge — compact credential card for profile grids and bond detail.
 * Shows token type, skill title, locked indicator, and bond ID.
 */

interface SoulboundBadgeProps {
  skillTitle: string;
  tokenType: "LEARNER_PROOF" | "MENTOR_PROOF";
  bondId?: string;
  completedDate?: string;
  size?: "sm" | "md";
}

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

export default function SoulboundBadge({
  skillTitle,
  tokenType,
  bondId,
  completedDate,
  size = "md",
}: SoulboundBadgeProps) {
  const isLearner = tokenType === "LEARNER_PROOF";
  const accentVar = isLearner ? "var(--accent-teal)" : "var(--accent-yellow)";
  const dimVar    = isLearner ? "var(--accent-teal-dim)" : "var(--accent-yellow-dim)";
  const borderVar = isLearner ? "var(--accent-teal-border)" : "var(--accent-yellow-border)";

  const isSm = size === "sm";
  const cardW = isSm ? 160 : 220;
  const cardH = isSm ? 96  : 130;

  return (
    <div
      style={{
        width: cardW,
        height: cardH,
        borderRadius: "var(--radius-md)",
        border: `1px solid ${borderVar}`,
        backgroundColor: "var(--bg-surface)",
        boxShadow: `0 0 20px ${dimVar}, var(--shadow-sm)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: isSm ? "10px 12px" : "14px 16px",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow var(--transition-base), transform var(--transition-base)",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 0 32px ${dimVar}, var(--shadow-md)`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = `0 0 20px ${dimVar}, var(--shadow-sm)`;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Subtle gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at top right, ${dimVar} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Top row: token type label + lock */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: isSm ? 8 : 9,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: accentVar,
        }}>
          {isLearner ? "Learner Proof" : "Mentor Proof"}
        </span>
        <span style={{ color: accentVar, display: "flex", alignItems: "center" }}>
          <LockIcon size={isSm ? 11 : 13} />
        </span>
      </div>

      {/* Skill title */}
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: isSm ? 12 : 14,
          color: "var(--text-primary)",
          lineHeight: 1.3,
          margin: 0,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {skillTitle || "Skill Title"}
        </p>
      </div>

      {/* Bottom row: soulbound label + bond ID / date */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: isSm ? 8 : 9,
          color: "var(--text-muted)",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <LockIcon size={8} />
          Soulbound
        </span>
        {(bondId || completedDate) && (
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: isSm ? 8 : 9,
            color: "var(--text-muted)",
          }}>
            {bondId ? `#${bondId}` : completedDate}
          </span>
        )}
      </div>
    </div>
  );
}
