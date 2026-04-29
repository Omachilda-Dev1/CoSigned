"use client";

import { useAccount } from "wagmi";
import ConnectButton from "@/components/wallet/ConnectButton";
import Navbar from "@/components/ui/Navbar";

interface WalletGuardProps {
  children: React.ReactNode;
}

export default function WalletGuard({ children }: WalletGuardProps) {
  const { address, isConnecting } = useAccount();

  if (isConnecting) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 68px)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
            Connecting…
          </span>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 68px)", padding: "24px" }}>
          <div style={{
            textAlign: "center",
            padding: "48px 32px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-default)",
            backgroundColor: "var(--bg-surface)",
            maxWidth: 380, width: "100%",
          }}>
            {/* Lock icon */}
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              backgroundColor: "var(--accent-teal-dim)",
              border: "1px solid var(--accent-teal-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)", marginBottom: 10 }}>
              Connect your wallet
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6 }}>
              Connect your wallet to view your bonds and manage your mentorships.
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
