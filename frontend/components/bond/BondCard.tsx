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

function deadlineLabel(deadline: bigint): string {
  const now  = Math.floor(Date.now() / 1000);
  const diff = Number(deadline) - now;
  if (diff <= 0) return "Expired";
  const days  = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  if (days > 0) return `${days}d remaining`;
  return `${hours}h remaining`;
}

export default function BondCard({ bond, role }: BondCardProps) {
  const router = useRouter();
  const counterparty = role === "mentor" ? bond.learner : bond.mentor;
  const counterLabel = role === "mentor" ? "Learner" : "Mentor";
  const isExpired    = Number(bond.deadline) < Math.floor(Date.now() / 1000);

  return (
    <button
      onClick={() => router.push(`/bond/${bond.id.toString()}`)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 18px",
        borderRadius: 10,
        border: "1px solid var(--border)",
        backgroundColor: "var(--bg-card)",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
      aria-label={`Bond: ${bond.skillTitle}`}
    >
      {/* Top row: skill title + status badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <p
          style={{
            fontFamily: "var(--font-syne, sans-serif)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--text)",
            lineHeight: 1.3,
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {bond.skillTitle || "Untitled Bond"}
        </p>
        <StatusBadge status={bond.status} />
      </div>

      {/* Counterparty */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontFamily: "var(--font-dm-mono, monospace)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
          }}
        >
          {counterLabel}
        </span>
        <span
          style={{
            fontFamily: "var(--font-dm-mono, monospace)",
            fontSize: 11,
            color: "var(--text-sub)",
          }}
        >
          {truncateAddress(counterparty)}
        </span>
      </div>

      {/* Bottom row: deadline + bond ID */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 10,
          borderTop: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono, monospace)",
            fontSize: 10,
            color: isExpired ? "#EF4444" : "var(--text-muted)",
          }}
        >
          {bond.status === BondStatus.Completed
            ? "Completed"
            : bond.status === BondStatus.Disputed
            ? "Disputed"
            : deadlineLabel(bond.deadline)}
        </span>
        <span
          style={{
            fontFamily: "var(--font-dm-mono, monospace)",
            fontSize: 9,
            color: "var(--text-muted)",
          }}
        >
          #{bond.id.toString()}
        </span>
      </div>
    </button>
  );
}
