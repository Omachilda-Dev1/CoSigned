"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

/**
 * CoSigned custom ConnectButton wrapper.
 * Uses RainbowKit's render prop to apply brand styling.
 */
export default function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            aria-hidden={!ready}
            style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none" }}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13, fontWeight: 700,
                  padding: "8px 18px", borderRadius: "var(--radius-sm)",
                  border: "none",
                  backgroundColor: "var(--accent-teal)",
                  color: "var(--text-inverse)",
                  cursor: "pointer",
                  transition: "opacity var(--transition-fast)",
                  whiteSpace: "nowrap", minHeight: 44,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                aria-label="Connect wallet"
              >
                Connect Wallet
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                  padding: "8px 18px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--accent-red)",
                  backgroundColor: "var(--accent-red-dim)",
                  color: "var(--accent-red)",
                  cursor: "pointer", minHeight: 44,
                }}
                aria-label="Wrong network — switch to Base Sepolia"
              >
                Wrong Network
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={openChainModal}
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    padding: "6px 12px", borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-default)",
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-muted)",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6, minHeight: 44,
                  }}
                  aria-label="Switch network"
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <img src={chain.iconUrl} alt={chain.name} width={14} height={14} style={{ borderRadius: "50%" }} />
                  )}
                  {chain.name}
                </button>
                <button
                  onClick={openAccountModal}
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                    padding: "7px 14px", borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--accent-teal-border)",
                    backgroundColor: "var(--accent-teal-dim)",
                    color: "var(--accent-teal)",
                    cursor: "pointer", transition: "opacity var(--transition-fast)", minHeight: 44,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  aria-label="Account options"
                >
                  {account.displayName}
                  {account.displayBalance ? ` · ${account.displayBalance}` : ""}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
