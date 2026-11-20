import { BondStatus, type Bond } from "@/types/bond";
import { cn } from "@/lib/cn";
import { progressStep } from "@/lib/bond";
import { Alert, Check } from "@/components/ui/icons";

const STEPS = [
  { label: "Created", detail: "Mentor defined the bond" },
  { label: "Accepted", detail: "Learner staked ETH" },
  { label: "Co-signing", detail: "Both parties sign off" },
  { label: "Completed", detail: "Credentials minted" },
];

export function BondTimeline({ bond }: { bond: Bond }) {
  const current = progressStep(bond.status);
  const completed = bond.status === BondStatus.Completed;
  const disputed = bond.status === BondStatus.Disputed;

  return (
    <div className="space-y-6">
      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((step, i) => {
          const done = completed || i < current;
          const active = !completed && i === current;
          const failed = disputed && i === current;
          return (
            <li key={step.label} className="flex flex-col gap-3">
              <div
                className={cn(
                  "h-1 rounded-full transition-colors",
                  failed ? "bg-danger" : done ? "bg-accent" : active ? "bg-accent/40" : "bg-raised",
                )}
              />
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-px grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold",
                    failed
                      ? "bg-danger/15 text-danger"
                      : done
                        ? "bg-accent text-accent-fg"
                        : active
                          ? "bg-accent/15 text-accent-ink ring-1 ring-accent/40"
                          : "bg-raised text-fg-subtle",
                  )}
                  aria-hidden="true"
                >
                  {failed ? <Alert size={11} /> : done ? <Check size={11} strokeWidth={3} /> : i + 1}
                </span>
                <div className="min-w-0">
                  <p className={cn("text-sm font-medium", !done && !active && "text-fg-subtle", failed && "text-danger")}>
                    {failed ? "Disputed" : step.label}
                  </p>
                  <p className="hidden text-xs text-fg-subtle sm:block">{step.detail}</p>
                </div>
              </div>
              <span className="sr-only">{done ? "complete" : active ? "current step" : "upcoming"}</span>
            </li>
          );
        })}
      </ol>

      {current >= 1 && !disputed && (
        <div className="grid grid-cols-2 gap-3">
          <SignatureState label="Mentor signature" signed={bond.mentorSigned} />
          <SignatureState label="Learner signature" signed={bond.learnerSigned} />
        </div>
      )}
    </div>
  );
}

function SignatureState({ label, signed }: { label: string; signed: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-raised/50 px-4 py-3">
      <span
        className={cn(
          "grid size-6 place-items-center rounded-full",
          signed ? "bg-accent text-accent-fg" : "border border-dashed border-fg-subtle/50",
        )}
      >
        {signed && <Check size={13} strokeWidth={3} />}
      </span>
      <div>
        <p className="text-xs text-fg-subtle">{label}</p>
        <p className={cn("text-sm font-medium", signed ? "text-accent-ink" : "text-fg-muted")}>
          {signed ? "Signed" : "Not yet signed"}
        </p>
      </div>
    </div>
  );
}
