import { BondStatus } from "@/types/bond";

interface StatusBadgeProps {
  status: BondStatus;
  size?: "sm" | "md";
}

const CONFIG: Record<BondStatus, { label: string; color: string; bg: string; border: string; icon?: string }> = {
  [BondStatus.Pending]: {
    label: "Pending", color: "#E8FF47",
    bg: "rgba(232,255,71,0.1)", border: "rgba(232,255,71,0.3)",
  },
  [BondStatus.Active]: {
    label: "Active", color: "#4DFFD2",
    bg: "rgba(77,255,210,0.1)", border: "rgba(77,255,210,0.3)",
  },
  [BondStatus.MentorSigned]: {
    label: "Mentor Signed", color: "#FF9F47",
    bg: "rgba(255,159,71,0.1)", border: "rgba(255,159,71,0.3)",
  },
  [BondStatus.LearnerSigned]: {
    label: "Learner Signed", color: "#FF9F47",
    bg: "rgba(255,159,71,0.1)", border: "rgba(255,159,71,0.3)",
  },
  [BondStatus.Completed]: {
    label: "Completed", color: "#4DFFD2",
    bg: "rgba(77,255,210,0.15)", border: "#4DFFD2",
    icon: "check",
  },
  [BondStatus.Disputed]: {
    label: "Disputed", color: "#FF4D6D",
    bg: "rgba(255,77,109,0.1)", border: "rgba(255,77,109,0.3)",
    icon: "warn",
  },
};

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2 6l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WarnIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M6 1L11 10H1L6 1z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6 5v2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="6" cy="9" r="0.6" fill={color}/>
    </svg>
  );
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG[BondStatus.Pending];
  const fontSize = size === "md" ? 11 : 10;
  const padding  = size === "md" ? "4px 10px" : "3px 10px";

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: "var(--font-dm-mono, monospace)",
      fontSize,
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: cfg.color,
      backgroundColor: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 999,
      padding,
      whiteSpace: "nowrap",
    }}>
      {cfg.icon === "check" && <CheckIcon color={cfg.color} />}
      {cfg.icon === "warn"  && <WarnIcon  color={cfg.color} />}
      {cfg.label}
    </span>
  );
}
