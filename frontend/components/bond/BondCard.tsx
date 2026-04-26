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

function deadlineInfo(deadline: bigint, status: BondStatus): { label: string; color: string } {
  if (status === BondStatus.Completed) return { label: "Completed", color: "#4DFFD2" };
  if (status === BondStatus.Disputed)  return { label: "Disputed",  color: "#FF4D6D" };

  const now  = Math.floor(Date.now() / 1000);
  const diff = Number(deadline) - now;
  if (diff <= 0) return { label: "Expired", color: "#FF4D6D" };

  const days  = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const label = days > 0 ? `${days}d remaining` : `${hours}h remaining`;
  const color = days < 3 ? "#FF4D6D" : days < 7 ? "#E8FF47" : "#5A5A7A";
  return { label, color };
}

const STATUS_ACCENT: Record<BondStatus, string> = {
  [BondStatus.Pending]:      "#E8FF47",
  [BondStatus.Active]:       "#E8FF47",
  [BondStatus.MentorSigned]: "#FF9F47",
  [BondStatus.LearnerSigned]:"#FF9F47",
  [BondStatus.Completed]:    "#4DFFD2",
  [BondStatus.Disputed]:     "#FF4D6D",
};

export default function BondCard({ bond, role }: BondCardProps) {
  const router = useRouter();
  const counterparty = role === "mentor" ? bond.learner : bond.mentor;
  const counterLabel = role === "mentor" ? "Learner" : "Mentor";
  const { label: deadlineLabel, color: deadlineColor } = deadlineInfo(bond.deadline, bond.status);
  const accentColor = STATUS_ACCENT[bond.status];

  return (
    <button
      onClick={() => router.push(`/bond/${bond.id.toString()}`)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "18px 18px 18px 20px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `3px solid ${accentColor}`,
        backgroundColor: "rgba(255,255,255,0.03)",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        minHeight: 44,
        transition: "all 200ms ease",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `rgba(77,255,210,0.2)`;
        e.currentTarget.style.borderLeftColor = accentColor;
        e.currentTarget.style.backgroundColor = "rgba(77,255,210,0.03)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.borderLeftColor = accentColor;
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
      }}
      aria-label={`Bond: ${bond.skillTitle}`}
    >
      {/* Top: skill title + badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <p style={{
          fontFamily: "var(--font-syne, sans-serif)",
          fontWeight: 600, fontSize: 15,
          color: "#F0F0F5",
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
        {/* Wallet icon */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5A5A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
          <circle cx="17" cy="14" r="1" fill="#5A5A7A"/>
        </svg>
        <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5A5A7A" }}>
          {counterLabel}
        </span>
        <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "rgba(240,240,245,0.6)" }}>
          {truncateAddress(counterparty)}
        </span>
      </div>

      {/* Bottom: deadline + arrow */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Clock icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={deadlineColor} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: deadlineColor }}>
            {deadlineLabel}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: "#5A5A7A" }}>
            #{bond.id.toString()}
          </span>
          {/* Arrow */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,245,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </button>
  );
}
