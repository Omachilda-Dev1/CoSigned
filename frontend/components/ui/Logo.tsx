import { useId } from "react";
import { cn } from "@/lib/cn";

/** The CoSigned mark: two pen nibs meeting over a lock. Theme-aware via CSS tokens. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  const id = useId();
  const gradient = `cosigned-mark-${id.replace(/:/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="CoSigned"
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "rgb(var(--accent))" }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--lime))" }} />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradient})`} strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M6 6 26 26l8-4L22 10Z" />
        <path d="m26 26 4 16 12-12Z" />
        <path d="M58 6 38 26l-8-4L42 10Z" />
        <path d="m38 26-4 16-12-12Z" />
        <path d="M6 6q26-12 52 0" />
        <path d="M22 30q10 16 20 0" />
      </g>
      <rect x="25.5" y="24" width="13" height="10" rx="2" style={{ fill: "rgb(var(--bg))" }} stroke="#E8C84D" strokeWidth="1.8" />
      <path d="M28.5 24q0-5 3.5-5t3.5 5" stroke="#E8C84D" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="32" cy="29" r="1.5" fill="#E8C84D" />
    </svg>
  );
}

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <span className="font-display text-lg font-bold tracking-tight">
        <span className="text-accent-ink">Co</span>
        <span>Signed</span>
      </span>
    </span>
  );
}
