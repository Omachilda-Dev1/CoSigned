"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { shortAddress } from "@/lib/format";
import { Check, Copy } from "@/components/ui/icons";

/** Deterministic gradient avatar derived from an address. */
export function Avatar({ address, size = 32, className }: { address: string; size?: number; className?: string }) {
  const seed = parseInt(address.slice(2, 10), 16) || 0;
  const h1 = seed % 360;
  const h2 = (h1 + 70 + (seed % 90)) % 360;
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 rounded-full ring-1 ring-line", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 25%, hsl(${h1} 85% 70%), hsl(${h2} 70% 42%))`,
      }}
    />
  );
}

export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className={cn(
        "inline-grid size-7 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-raised hover:text-fg",
        className,
      )}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
    >
      {copied ? <Check size={14} className="text-accent-ink" /> : <Copy size={14} />}
    </button>
  );
}

/** An address that links to its CoSigned profile, with avatar and copy. */
export function AddressChip({
  address,
  name,
  you,
  className,
}: {
  address: string;
  name?: string;
  you?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <Avatar address={address} size={22} />
      <Link
        href={`/profile/${address}`}
        className="min-w-0 truncate font-mono text-[13px] text-fg hover:text-accent-ink hover:underline hover:underline-offset-4"
        title={address}
      >
        {name || shortAddress(address)}
      </Link>
      {you && (
        <span className="rounded-full bg-accent/10 px-1.5 py-px text-[10px] font-medium uppercase tracking-wider text-accent-ink">
          You
        </span>
      )}
      <CopyButton value={address} label="Copy address" />
    </span>
  );
}
