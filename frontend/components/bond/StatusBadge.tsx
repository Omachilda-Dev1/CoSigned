import { cn } from "@/lib/cn";
import { statusMeta, type StatusTone } from "@/lib/bond";
import type { Bond } from "@/types/bond";

const toneClass: Record<StatusTone, string> = {
  pending: "bg-lime/10 text-lime ring-lime/25",
  active: "bg-accent/10 text-accent-ink ring-accent/25",
  signing: "bg-signing/10 text-signing ring-signing/25",
  complete: "bg-accent/15 text-accent-ink ring-accent/40",
  disputed: "bg-danger/10 text-danger ring-danger/25",
  muted: "bg-raised text-fg-subtle ring-line",
};

export function StatusBadge({ bond, className }: { bond: Bond; className?: string }) {
  const { label, tone } = statusMeta(bond);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset",
        toneClass[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
