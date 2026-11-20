"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Address";
import { buttonClass } from "@/components/ui/Button";
import { Alert } from "@/components/ui/icons";

export function ConnectButton({ block = false, label = "Connect wallet" }: { block?: boolean; label?: string }) {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        return (
          <div
            aria-hidden={!mounted}
            className={cn(block && "w-full", !mounted && "pointer-events-none select-none opacity-0")}
          >
            {!connected ? (
              <button type="button" onClick={openConnectModal} className={buttonClass("primary", "sm", block ? "w-full h-11" : "")}>
                {label}
              </button>
            ) : chain.unsupported ? (
              <button type="button" onClick={openChainModal} className={buttonClass("danger", "sm", block ? "w-full" : "")}>
                <Alert size={14} /> Wrong network
              </button>
            ) : (
              <button
                type="button"
                onClick={openAccountModal}
                className={buttonClass("secondary", "sm", cn("gap-2 pl-1.5 font-mono", block && "w-full"))}
                aria-label="Account options"
              >
                <Avatar address={account.address} size={22} />
                {account.displayName}
              </button>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
