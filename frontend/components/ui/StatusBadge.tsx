import { BondStatus } from "@/types/bond";

interface StatusBadgeProps {
  status: BondStatus;
  size?: "sm" | "md";
}

type StatusKey = "pending" | "active" | "signing" | "complete" | "disputed";

const STATUS_MAP: Record<BondStatus, { key: StatusKey; label: string; icon?: "check" | "warn" }> = {
  [BondStatus.Pending]:      { key: "pending",  label: "Pending" },
  [BondStatus.Active]:       { key: "active",   label: "Active" },
  [BondStatus.MentorSigned]: { key: "signing",  label: "Mentor Signed" },
  [BondStatus.LearnerSigned]:{ key: "signing",  label: "Learner Signed" },
  [BondStatus.Completed]:    { key: "complete", label: "Completed", icon: "check" },
  [BondStatus.Disputed]:     { key: "disputed", label: "Disputed",  icon: "warn" },
};

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M6 1L11 10H1L6 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6 5v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="6" cy="9" r="0.6" fill="currentColor"/>
    </svg>
  );
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP[BondStatus.Pending];
  const k   = cfg.key;
  const fontSize = size === "md" ? 11 : 10;
  const padding  = size === "md" ? "4px 10px" : "3px 10px";

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: "var(--font-mono)",
      fontSize,
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color:           `var(--status-${k}-text)`,
      backgroundColor: `var(--status-${k}-bg)`,
      border:          `1px solid var(--status-${k}-border)`,
      borderRadius:    "var(--radius-full)",
      padding,
      whiteSpace: "nowrap",
    }}>
      {cfg.icon === "check" && <CheckIcon />}
      {cfg.icon === "warn"  && <WarnIcon />}
      {cfg.label}
    </span>
  );
}
