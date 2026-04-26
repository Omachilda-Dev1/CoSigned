"use client";

import { useRouter } from "next/navigation";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Bond } from "@/types/bond";
import { BondStatus } from "@/types/bond";

interface BondCardProps {
  bond: Bond;
  role: "mentor" | "learner";
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function deadlineInfo(deadline: bigint, status: BondStatus): { label: string; colorVar: string } {
  if (status === BondStatus.Completed) return { label: "Completed",  colorVar: "var(--status-complete-text)" };
  if (status === BondStatus.Disputed)  return { label: "Disputed",   colorVar: "var(--accent-red)" };

  const now  = Math.floor(Date.now() / 1000);
  const diff = Number(deadline) - now;
  if (diff <= 0) return { label: "Expired", colorVar: "var(--accent-red)" };

  const days  = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const label = days > 0 ? `${days}d remaining` : `${hours}h remaining`;
  const colorVar = days < 3 ? "var(--accent-red)" : days < 7 ? "var(--accent-yellow)" : "var(--text-muted)";
  return { label, colorVar };
}

// Left border accent colour by status — uses CSS variable names
const STATUS_BORDER_VAR: Record<BondStatus, string> = {
  [BondStatus.Pending]:      "var(--accent-yellow)",
  [BondStatus.Active]:       "var(--accent-yellow)",
  [BondStatus.MentorSigned]: "var(--accent-orange)",
  [BondStatus.LearnerSigned]:"var(--accent-orange)",
  [BondStatus.Completed]:    "var(--accent-teal)",
  [BondStatus.Disputed]:     "var(--accent-red)",
};

export default function BondCard({ bond, role }: BondCardProps) {
  const router = useRouter();
  const counterparty = role === "mentor" ? bond.learner : bond.mentor;
  const counterLabel = role === "mentor" ? "Learner" : "Mentor";
  const { label: deadlineLabel, colorVar: deadlineColor } = deadlineInfo(bond.deadline, bond.status);
  const accentBorderVar = STATUS_BORDER_VAR[bond.status];

  return (
    <button
      onClick={() => router.push(`/bond/${bond.id.toString()}`)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "18px 18px 18px 20px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-default)",
        borderLeft: `3px solid ${accentBorderVar}`,
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        minHeight: 44,
        transition: "all var(--transition-base)",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--accent-teal-border)";
        e.currentTarget.style.borderLeftColor = accentBorderVar;
        e.currentTarget.style.boxShadow = "var(--shadow-teal)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border-default)";
        e.currentTarget.style.borderLeftColor = accentBorderVar;
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      aria-label={`Bond: ${bond.skillTitle}`}
    >
      {/* Top: skill title + badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600, fontSize: 15,
          color: "var(--text-primary)",
          lineHeight: 1.3, flex: 1,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          margin: 0,
        }}>
          {bond.skillTitle || "Untitled Bond"}
        </p>
        <StatusBadge status={bond.status} />
      </div>

      {/* Middle: counterparty */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
          <circle cx="17" cy="14" r="1" fill="var(--text-muted)"/>
        </svg>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
          {counterLabel}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
          {truncateAddress(counterparty)}
        </span>
      </div>

      {/* Bottom: deadline + arrow */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 12, borderTop: "1px solid var(--border-subtle)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={deadlineColor} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: deadlineColor }}>
            {deadlineLabel}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>
            #{bond.id.toString()}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </button>
  );
}
