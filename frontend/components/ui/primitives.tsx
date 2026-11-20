import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Alert as AlertIcon, Check, Info } from "@/components/ui/icons";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-line bg-surface shadow-card", className)} {...props} />;
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
      <h2 className="eyebrow">{title}</h2>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-raised", className)} aria-hidden="true">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-fg/[0.04] to-transparent" />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-1 grid size-11 place-items-center rounded-full bg-raised text-fg-subtle">{icon}</div>
      )}
      <p className="font-display text-base font-semibold">{title}</p>
      {body && <p className="max-w-xs text-sm text-fg-muted">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

type Tone = "info" | "success" | "warning" | "danger";

const toneClass: Record<Tone, string> = {
  info: "border-line bg-raised text-fg-muted",
  success: "border-accent/30 bg-accent/[0.07] text-accent-ink",
  warning: "border-signing/30 bg-signing/[0.07] text-signing",
  danger: "border-danger/30 bg-danger/[0.07] text-danger",
};

const toneIcon: Record<Tone, ReactNode> = {
  info: <Info size={16} />,
  success: <Check size={16} />,
  warning: <AlertIcon size={16} />,
  danger: <AlertIcon size={16} />,
};

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-xl border px-4 py-3 text-sm", toneClass[tone], className)}
    >
      <span className="mt-0.5 shrink-0">{toneIcon[tone]}</span>
      <div className="min-w-0 space-y-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={title ? "text-fg-muted" : undefined}>{children}</div>}
      </div>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="eyebrow">{label}</span>
      <span className="font-display text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">{value}</span>
      {hint && <span className="text-xs text-fg-subtle">{hint}</span>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-2">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
