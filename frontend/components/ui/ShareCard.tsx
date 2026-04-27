"use client";

import { useState } from "react";

interface ShareCardProps {
  skillTitle: string;
  mentorName: string;
  bondId?: string;
}

function TwitterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );
}

export default function ShareCard({ skillTitle, mentorName, bondId }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const bondUrl  = bondId ? `https://cosigned.xyz/bond/${bondId}` : "https://cosigned.xyz";
  const shareText = `Just earned my CoSigned credential for ${skillTitle} under the mentorship of ${mentorName}.\n\nVerified on Base blockchain. Bond #${bondId ?? "—"}\n${bondUrl}\n\n#CoSigned #Web3 #BuildInPublic`;

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLinkedIn = () => {
    // Copy text to clipboard for LinkedIn (LinkedIn share URL doesn't support pre-filled text well)
    navigator.clipboard.writeText(shareText).catch(() => {});
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(bondUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = shareText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-default)",
      backgroundColor: "var(--bg-elevated)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Share your achievement
        </span>
      </div>

      {/* Preview text */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--text-secondary)", lineHeight: 1.7,
          margin: 0, whiteSpace: "pre-line",
        }}>
          {shareText}
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ padding: "12px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={handleTwitter}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
            padding: "8px 16px", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-default)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-primary)",
            cursor: "pointer", transition: "all var(--transition-fast)",
            minHeight: 44,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "var(--accent-teal-border)";
            e.currentTarget.style.color = "var(--accent-teal)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          aria-label="Share on X (Twitter)"
        >
          <TwitterIcon />
          Post on X
        </button>

        <button
          onClick={handleLinkedIn}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
            padding: "8px 16px", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-default)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-primary)",
            cursor: "pointer", transition: "all var(--transition-fast)",
            minHeight: 44,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "var(--accent-teal-border)";
            e.currentTarget.style.color = "var(--accent-teal)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          aria-label="Share on LinkedIn"
        >
          <LinkedInIcon />
          LinkedIn
        </button>

        <button
          onClick={handleCopy}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
            padding: "8px 16px", borderRadius: "var(--radius-sm)",
            border: `1px solid ${copied ? "var(--accent-teal-border)" : "var(--border-default)"}`,
            backgroundColor: copied ? "var(--accent-teal-dim)" : "var(--bg-surface)",
            color: copied ? "var(--accent-teal)" : "var(--text-primary)",
            cursor: "pointer", transition: "all var(--transition-fast)",
            minHeight: 44,
          }}
          aria-label={copied ? "Copied!" : "Copy share text"}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy Text"}
        </button>
      </div>
    </div>
  );
}
