import { BondStatus } from "@/types/bond";

interface StatusBadgeProps {
  status: BondStatus;
  size?: "sm" | "md";
}

const CONFIG: Record<BondStatus, { label: string; color: string; bg: string }> = {
  [BondStatus.Pending]:      { label: "Pending",       color: "#C8FF4D", bg: "rgba(200,255,77,0.12)"  },
  [BondStatus.Active]:       { label: "Active",        color: "#4DFFD2", bg: "rgba(77,255,210,0.12)"  },
  [BondStatus.MentorSigned]: { label: "Mentor Signed", color: "#F97316", bg: "rgba(249,115,22,0.12)"  },
  [BondStatus.LearnerSigned]:{ label: "Learner Signed",color: "#F97316", bg: "rgba(249,115,22,0.12)"  },
  [BondStatus.Completed]:    { label: "Completed",     color: "#4DFFD2", bg: "rgba(77,255,210,0.12)"  },
  [BondStatus.Disputed]:     { label: "Disputed",      color: "#EF4444", bg: "rgba(239,68,68,0.12)"   },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const { label, color, bg } = CONFIG[status] ?? CONFIG[BondStatus.Pending];
  const fontSize = size === "md" ? 11 : 9;
  const padding  = size === "md" ? "4px 10px" : "3px 8px";

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-dm-mono, monospace)",
        fontSize,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
        backgroundColor: bg,
        border: `1px solid ${color}40`,
        borderRadius: 999,
        padding,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
