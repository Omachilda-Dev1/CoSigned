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
                  fontFamily: "var(--font-dm-mono, monospace)",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "var(--accent, #4DFFD2)",
                  color: "#0D0D0D",
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                  whiteSpace: "nowrap",
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
                  fontFamily: "var(--font-dm-mono, monospace)",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: 6,
                  border: "1px solid #EF4444",
                  backgroundColor: "transparent",
                  color: "#EF4444",
                  cursor: "pointer",
                }}
                aria-label="Wrong network — switch to Base Sepolia"
              >
                Wrong Network
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Chain indicator */}
                <button
                  onClick={openChainModal}
                  style={{
                    fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: 11,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border, #2a2a2a)",
                    backgroundColor: "var(--bg-card, #141414)",
                    color: "var(--text-muted, #6B7280)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  aria-label="Switch network"
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <img src={chain.iconUrl} alt={chain.name} width={14} height={14} style={{ borderRadius: "50%" }} />
                  )}
                  {chain.name}
                </button>

                {/* Account button */}
                <button
                  onClick={openAccountModal}
                  style={{
                    fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "7px 14px",
                    borderRadius: 6,
                    border: "1px solid var(--accent, #4DFFD2)",
                    backgroundColor: "transparent",
                    color: "var(--accent, #4DFFD2)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(77,255,210,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
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
