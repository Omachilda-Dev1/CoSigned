"use client";

import { useBondCount } from "@/hooks/useBonds";

export function LiveBondCount() {
  const { count, isLoading, isError } = useBondCount();
  if (isError) return null;
  return (
    <p className="text-sm text-fg-subtle">
      <span className="font-mono text-fg">{isLoading ? "—" : count.toString()}</span> bonds created on-chain so far
    </p>
  );
}
