import Link from "next/link";
import { BondStatus, type Bond, type BondRole } from "@/types/bond";
import { cn } from "@/lib/cn";
import { formatEth, formatRelative, nowSeconds, shortAddress } from "@/lib/format";
import { Avatar } from "@/components/ui/Address";
import { ArrowRight, Clock } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/bond/StatusBadge";

function deadlineLabel(bond: Bond): { text: string; urgent: boolean } {
  const now = nowSeconds();
  const left = Number(bond.deadline) - now;
  if (bond.status === BondStatus.Completed) return { text: "Completed", urgent: false };
  if (bond.status === BondStatus.Disputed) return { text: "In dispute", urgent: false };
  if (left <= 0) return { text: `Deadline passed ${formatRelative(bond.deadline, now)}`, urgent: true };
  return { text: `Due ${formatRelative(bond.deadline, now)}`, urgent: left < 3 * 86_400 };
}

/**
 * Compact bond summary for lists. `perspective` decides which counterparty to
 * show; without it the mentor is shown (public listings).
 */
export function BondCard({ bond, perspective }: { bond: Bond; perspective?: BondRole }) {
  const showLearner = perspective === "mentor";
  const counterparty = showLearner ? bond.learner : bond.mentor;
  const { text, urgent } = deadlineLabel(bond);

  return (
    <Link
      href={`/bond/${bond.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-fg-subtle">Bond #{bond.id.toString()}</p>
          <h3 className="mt-1 line-clamp-2 font-display text-[17px] font-semibold leading-snug">
            {bond.skillTitle || "Untitled bond"}
          </h3>
        </div>
        <StatusBadge bond={bond} />
      </div>

      <div className="flex items-center gap-2 text-sm text-fg-muted">
        <Avatar address={counterparty} size={18} />
        <span className="text-fg-subtle">{showLearner ? "Learner" : "Mentor"}</span>
        <span className="font-mono text-[13px] text-fg">{shortAddress(counterparty)}</span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-xs">
        <span className={cn("inline-flex items-center gap-1.5", urgent ? "text-signing" : "text-fg-subtle")}>
          <Clock size={13} />
          {text}
        </span>
        <span className="inline-flex items-center gap-3 text-fg-subtle">
          {bond.stakeAmount > 0n && <span className="font-mono">{formatEth(bond.stakeAmount)} ETH</span>}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:text-accent-ink" />
        </span>
      </div>
    </Link>
  );
}

export function BondCardSkeleton() {
  return <Skeleton className="h-[172px] rounded-2xl" />;
}
