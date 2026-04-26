"use client";

/**
 * HeroIllustration
 * Shows the CoSigned dual-signature flow:
 * Mentor wallet → Bond (lock) → Learner wallet → NFT credential
 * Adapts to dark/light via CSS variables.
 */
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Two parties co-signing a Bond on-chain to mint soulbound credentials"
      role="img"
      className="w-full h-auto"
    >
      {/* ── Defs ── */}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--border)" />
        </marker>
        <marker id="arrow-accent" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* ══════════════════════════════════════════
          LEFT — MENTOR WALLET CARD
      ══════════════════════════════════════════ */}
      <rect x="12" y="80" width="118" height="148" rx="8"
        fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />

      {/* Card header bar */}
      <rect x="12" y="80" width="118" height="32" rx="8"
        fill="var(--bg-card-alt)" />
      <rect x="12" y="96" width="118" height="16"
        fill="var(--bg-card-alt)" />

      {/* Header dots */}
      <circle cx="28" cy="96" r="4" fill="var(--border)" />
      <circle cx="42" cy="96" r="4" fill="var(--border)" />
      <circle cx="56" cy="96" r="4" fill="var(--border)" />

      {/* Avatar circle */}
      <circle cx="71" cy="148" r="22"
        fill="var(--bg-card-alt)" stroke="var(--border)" strokeWidth="1" />
      {/* Person icon */}
      <circle cx="71" cy="141" r="7" fill="var(--text-muted)" />
      <path d="M52 168 Q52 156 71 156 Q90 156 90 168"
        fill="var(--text-muted)" />

      {/* Label */}
      <rect x="30" y="178" width="82" height="8" rx="3" fill="var(--border)" />
      <rect x="42" y="192" width="58" height="6" rx="3" fill="var(--bg-card-alt)" />

      {/* "MENTOR" tag */}
      <rect x="28" y="210" width="86" height="6" rx="3" fill="var(--accent)" opacity="0.25" />
      <text x="71" y="215.5"
        textAnchor="middle"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        letterSpacing="0.08em"
        fill="var(--accent)"
      >MENTOR</text>

      {/* Wallet address stub */}
      <text x="71" y="232"
        textAnchor="middle"
        fontSize="5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text-muted)"
      >0x4f2a…c91d</text>

      {/* ══════════════════════════════════════════
          RIGHT — LEARNER WALLET CARD
      ══════════════════════════════════════════ */}
      <rect x="390" y="80" width="118" height="148" rx="8"
        fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />

      <rect x="390" y="80" width="118" height="32" rx="8"
        fill="var(--bg-card-alt)" />
      <rect x="390" y="96" width="118" height="16"
        fill="var(--bg-card-alt)" />

      <circle cx="406" cy="96" r="4" fill="var(--border)" />
      <circle cx="420" cy="96" r="4" fill="var(--border)" />
      <circle cx="434" cy="96" r="4" fill="var(--border)" />

      <circle cx="449" cy="148" r="22"
        fill="var(--bg-card-alt)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="449" cy="141" r="7" fill="var(--text-muted)" />
      <path d="M430 168 Q430 156 449 156 Q468 156 468 168"
        fill="var(--text-muted)" />

      <rect x="408" y="178" width="82" height="8" rx="3" fill="var(--border)" />
      <rect x="420" y="192" width="58" height="6" rx="3" fill="var(--bg-card-alt)" />

      <rect x="406" y="210" width="86" height="6" rx="3" fill="var(--accent)" opacity="0.25" />
      <text x="449" y="215.5"
        textAnchor="middle"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        letterSpacing="0.08em"
        fill="var(--accent)"
      >LEARNER</text>

      <text x="449" y="232"
        textAnchor="middle"
        fontSize="5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text-muted)"
      >0x9b1e…3fa2</text>

      {/* ══════════════════════════════════════════
          CENTER — BOND CARD (elevated, focal point)
      ══════════════════════════════════════════ */}
      <g transform="translate(0, -8) scale(1.0)" style={{ filter: "drop-shadow(0 0 20px rgba(77,255,210,0.2))" }}>
      <rect x="186" y="60" width="148" height="188" rx="10"
        fill="rgba(77,255,210,0.06)" stroke="rgba(77,255,210,0.5)" strokeWidth="2" />

      {/* Bond header */}
      <rect x="186" y="60" width="148" height="36" rx="10"
        fill="rgba(77,255,210,0.08)" />
      <rect x="186" y="78" width="148" height="18"
        fill="rgba(77,255,210,0.08)" />

      <text x="260" y="83"
        textAnchor="middle"
        fontSize="6"
        fontFamily="var(--font-dm-mono), monospace"
        letterSpacing="0.1em"
        fill="var(--text-muted)"
      >BOND #042</text>

      {/* Lock icon — center of bond card */}
      <rect x="244" y="118" width="32" height="26" rx="4"
        fill="rgba(77,255,210,0.1)" stroke="#4DFFD2" strokeWidth="2" />
      <path d="M250 118 L250 110 Q250 102 260 102 Q270 102 270 110 L270 118"
        stroke="#4DFFD2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="260" cy="129" r="3.5" fill="#4DFFD2" opacity="0.9" />
      <rect x="258.5" y="129" width="3" height="6" rx="1" fill="#4DFFD2" opacity="0.9" />

      {/* Skill title line */}
      <text x="260" y="162"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="var(--font-syne), sans-serif"
        fill="var(--text)"
      >React Dev</text>

      {/* Divider */}
      <line x1="200" y1="172" x2="320" y2="172"
        stroke="var(--border)" strokeWidth="1" />

      {/* Status row */}
      <text x="200" y="184"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text-muted)"
      >Status</text>
      <rect x="280" y="177" width="38" height="11" rx="3"
        fill="var(--accent)" opacity="0.15" />
      <text x="299" y="185"
        textAnchor="middle"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--accent)"
      >ACTIVE</text>

      {/* Stake row */}
      <text x="200" y="200"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text-muted)"
      >Stake</text>
      <text x="318" y="200"
        textAnchor="end"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text)"
      >0.05 ETH</text>

      {/* Deadline row */}
      <text x="200" y="216"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text-muted)"
      >Deadline</text>
      <text x="318" y="216"
        textAnchor="end"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text)"
      >30 days</text>

      {/* Signature indicators */}
      <line x1="200" y1="226" x2="320" y2="226"
        stroke="var(--border)" strokeWidth="1" />

      {/* Mentor sig — signed */}
      <circle cx="208" cy="238" r="4"
        fill="var(--accent)" opacity="0.9" />
      {/* Checkmark */}
      <path d="M205.5 238 L207.2 240 L210.5 236"
        stroke="#0D0D0D" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="216" y="241"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text-muted)"
      >Mentor signed</text>

      {/* Learner sig — pending */}
      <circle cx="208" cy="252" r="4"
        fill="none" stroke="var(--border)" strokeWidth="1.2" />
      <text x="216" y="255"
        fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        fill="var(--text-muted)"
      >Learner pending…</text>

      </g>{/* end center card group */}

      {/* ══════════════════════════════════════════
          CONNECTING LINES — animated yellow-green
      ══════════════════════════════════════════ */}

      {/* Mentor → Bond */}
      <line x1="132" y1="154" x2="184" y2="154"
        stroke="#E8FF47" strokeWidth="1.5"
        strokeDasharray="6 4"
        markerEnd="url(#arrow-yellow)"
        style={{ animation: "dashPulse 1.5s linear infinite" }}
      />

      {/* Bond → Learner */}
      <line x1="336" y1="154" x2="388" y2="154"
        stroke="#E8FF47" strokeWidth="1.5"
        strokeDasharray="6 4"
        markerEnd="url(#arrow-yellow)"
        style={{ animation: "dashPulse 1.5s linear infinite 0.75s" }}
      />

      {/* ══════════════════════════════════════════
          BOTTOM — NFT CREDENTIAL CARDS (larger)
      ══════════════════════════════════════════ */}

      {/* Label above */}
      <text x="260" y="272"
        textAnchor="middle" fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace"
        letterSpacing="0.08em" fill="var(--text-muted)"
      >ON COMPLETION — MINTED TO BOTH</text>

      {/* NFT card left — MENTOR PROOF */}
      <rect x="136" y="278" width="110" height="56" rx="8"
        fill="rgba(77,255,210,0.06)" stroke="#4DFFD2" strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 12px rgba(77,255,210,0.2))" }}
      />
      <rect x="136" y="278" width="110" height="16" rx="8" fill="rgba(77,255,210,0.1)" />
      <rect x="136" y="287" width="110" height="7" fill="rgba(77,255,210,0.1)" />
      <text x="191" y="291" textAnchor="middle" fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace" letterSpacing="0.08em" fill="#4DFFD2"
      >MENTOR PROOF</text>
      <rect x="181" y="300" width="20" height="14" rx="3"
        fill="rgba(77,255,210,0.1)" stroke="#4DFFD2" strokeWidth="1.2" />
      <path d="M184 300 L184 296 Q184 292 191 292 Q198 292 198 296 L198 300"
        stroke="#4DFFD2" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <text x="191" y="324" textAnchor="middle" fontSize="5"
        fontFamily="var(--font-dm-mono), monospace" fill="#5A5A7A"
      >Soulbound</text>

      {/* NFT card right — LEARNER PROOF */}
      <rect x="274" y="278" width="110" height="56" rx="8"
        fill="rgba(77,255,210,0.06)" stroke="#4DFFD2" strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 12px rgba(77,255,210,0.2))" }}
      />
      <rect x="274" y="278" width="110" height="16" rx="8" fill="rgba(77,255,210,0.1)" />
      <rect x="274" y="287" width="110" height="7" fill="rgba(77,255,210,0.1)" />
      <text x="329" y="291" textAnchor="middle" fontSize="5.5"
        fontFamily="var(--font-dm-mono), monospace" letterSpacing="0.08em" fill="#4DFFD2"
      >LEARNER PROOF</text>
      <rect x="319" y="300" width="20" height="14" rx="3"
        fill="rgba(77,255,210,0.1)" stroke="#4DFFD2" strokeWidth="1.2" />
      <path d="M322 300 L322 296 Q322 292 329 292 Q336 292 336 296 L336 300"
        stroke="#4DFFD2" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <text x="329" y="324" textAnchor="middle" fontSize="5"
        fontFamily="var(--font-dm-mono), monospace" fill="#5A5A7A"
      >Soulbound</text>

      {/* Drop lines */}
      <line x1="260" y1="248" x2="191" y2="276"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="260" y1="248" x2="329" y2="276"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />

      {/* Yellow arrow marker */}
      <defs>
        <marker id="arrow-yellow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#E8FF47" />
        </marker>
      </defs>

      <style>{`
        @keyframes dashPulse {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </svg>
  );
}