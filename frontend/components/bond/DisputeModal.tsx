"use client";

import { useEffect, useRef } from "react";
import { useDisputeBond } from "@/hooks/useCoSigned";

interface DisputeModalProps {
  bondId: bigint;
  skillTitle: string;
  onClose: () => void;
}

export default function DisputeModal({ bondId, skillTitle, onClose }: DisputeModalProps) {
  const { write, isPending, isConfirming, isSuccess, error } = useDisputeBond();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Auto-close on success after 2s
  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(onClose, 2000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, onClose]);

  const isBusy = isPending || isConfirming;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dispute-title"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        width: "100%", maxWidth: 440,
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--accent-red-dim)",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <h2 id="dispute-title" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--accent-red)", margin: "0 0 4px" }}>
              Raise a Dispute
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              Bond: {skillTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-muted)", lineHeight: 0, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {/* Warning box */}
          <div style={{
            padding: "14px 16px", borderRadius: "var(--radius-md)",
            border: "1px solid var(--accent-red-dim)",
            backgroundColor: "rgba(196,0,43,0.04)",
            marginBottom: 20,
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-red)", margin: "0 0 8px", fontWeight: 600 }}>
              Before you raise a dispute:
            </p>
            <ul style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
              <li>The bond deadline must have passed</li>
              <li>A 7-day resolution window will open</li>
              <li>If unresolved, the learner&apos;s stake is refunded</li>
              <li>No NFTs will be minted for a disputed bond</li>
            </ul>
          </div>

          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Are you sure you want to raise a dispute for <strong style={{ color: "var(--text-primary)" }}>{skillTitle}</strong>?
            This action cannot be undone.
          </p>

          {/* Status */}
          {(isPending || isConfirming || isSuccess || error) && (
            <div style={{
              padding: "10px 14px", borderRadius: "var(--radius-sm)",
              border: `1px solid ${error ? "var(--accent-red-dim)" : isSuccess ? "var(--accent-teal-border)" : "var(--border-default)"}`,
              backgroundColor: error ? "rgba(196,0,43,0.04)" : isSuccess ? "var(--accent-teal-dim)" : "var(--bg-elevated)",
              marginBottom: 16,
            }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: error ? "var(--accent-red)" : isSuccess ? "var(--accent-teal)" : "var(--text-muted)", margin: 0 }}>
                {isPending    ? "Waiting for wallet signature…"
                 : isConfirming ? "Confirming on-chain…"
                 : isSuccess    ? "Dispute raised successfully."
                 : error        ? `Error: ${error.message.slice(0, 80)}`
                 : ""}
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              disabled={isBusy}
              style={{
                flex: 1, padding: "12px 20px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-default)",
                backgroundColor: "transparent", color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600,
                cursor: isBusy ? "not-allowed" : "pointer",
                opacity: isBusy ? 0.5 : 1, minHeight: 44,
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => write?.(bondId)}
              disabled={isBusy || isSuccess}
              style={{
                flex: 1, padding: "12px 20px", borderRadius: "var(--radius-sm)",
                border: "none",
                backgroundColor: isBusy || isSuccess ? "var(--bg-elevated)" : "var(--accent-red)",
                color: isBusy || isSuccess ? "var(--text-muted)" : "#FFFFFF",
                fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700,
                cursor: isBusy || isSuccess ? "not-allowed" : "pointer",
                minHeight: 44, transition: "opacity var(--transition-fast)",
              }}
              onMouseEnter={e => { if (!isBusy && !isSuccess) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              {isPending ? "Signing…" : isConfirming ? "Confirming…" : isSuccess ? "Disputed" : "Raise Dispute"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
