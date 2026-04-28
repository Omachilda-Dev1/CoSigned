"use client";

import { useAccount } from "wagmi";
import ConnectButton from "@/components/wallet/ConnectButton";

interface WalletGuardProps {
  children: React.ReactNode;
}

/**
 * Shows a connect prompt if wallet is not connected.
 * Does NOT redirect — lets the user connect inline.
 */
export default function WalletGuard({ children }: WalletGuardProps) {
  const { address, isConnecting } = useAccount();

  // Still hydrating
  if (isConnecting) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "var(--bg-page)",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          Connecting…
        </span>
      </div>
    );
  }

  // Not connected — show inline prompt instead of redirecting
  if (!address) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "var(--bg-page)",
      }}>
        <div style={{
          textAlign: "center",
          padding: "48px 32px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-default)",
          backgroundColor: "var(--bg-surface)",
          maxWidth: 360,
        }}>
          {/* Lock icon */}
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            backgroundColor: "var(--accent-teal-dim)",
            border: "1px solid var(--accent-teal-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", marginBottom: 8 }}>
            Connect your wallet
          </h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 }}>
            Connect your wallet to view your bonds and manage your mentorships.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
