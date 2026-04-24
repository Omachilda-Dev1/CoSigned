"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

interface WalletGuardProps {
  children: React.ReactNode;
}

/**
 * Redirects to the landing page if no wallet is connected.
 * Shows a loading state while wagmi hydrates.
 */
export default function WalletGuard({ children }: WalletGuardProps) {
  const { address, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnecting && !address) {
      router.replace("/");
    }
  }, [address, isConnecting, router]);

  // Still hydrating — show nothing to avoid flash
  if (isConnecting) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono, monospace)",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Connecting…
        </span>
      </div>
    );
  }

  // Not connected — redirect is in flight, render nothing
  if (!address) return null;

  return <>{children}</>;
}
