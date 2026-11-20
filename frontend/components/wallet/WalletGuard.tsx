"use client";

import type { ReactNode } from "react";
import { useAccount } from "wagmi";
import type { Address } from "viem";
import { Lock } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/primitives";
import { ConnectButton } from "@/components/wallet/ConnectButton";

/** Renders children only once a wallet is connected; otherwise prompts to connect. */
export function WalletGuard({
  children,
  title = "Connect your wallet",
  body = "Connect a wallet to continue.",
}: {
  children: (address: Address) => ReactNode;
  title?: string;
  body?: string;
}) {
  const { address, status } = useAccount();

  if (status === "connecting" || status === "reconnecting") {
    return (
      <div className="container py-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-8 h-40" />
      </div>
    );
  }

  if (!address) {
    return (
      <div className="container grid min-h-[60vh] place-items-center py-16">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-6 grid size-14 place-items-center rounded-full bg-accent/10 text-accent-ink ring-1 ring-accent/25">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mb-8 mt-2 text-fg-muted">{body}</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return <>{children(address)}</>;
}
