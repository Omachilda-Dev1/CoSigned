"use client";

/**
 * HeroIllustration
 * All colours use CSS variables from the design system.
 * Works correctly in both dark and light mode.
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
      <defs>
        <marker id="arrow-flow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--accent-teal)" />
        </marker>
      </defs>

      {/* ══════════════════════════════════════════
          LEFT — MENTOR WALLET CARD
      ══════════════════════════════════════════ */}
      <rect x="12" y="80" width="118" height="148" rx="8"
        fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="1" />

      {/* Card header */}
      <rect x="12" y="80" width="118" height="32" rx="8" fill="var(--bg-elevated)" />
      <rect x="12" y="96" width="118" height="16" fill="var(--bg-elevated)" />
      <circle cx="28" cy="96" r="4" fill="var(--border-default)" />
      <circle cx="42" cy="96" r="4" fill="var(--border-default)" />
      <circle cx="56" cy="96" r="4" fill="var(--border-default)" />

      {/* Avatar */}
      <circle cx="71" cy="148" r="22" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1" />
      <circle cx="71" cy="141" r="7" fill="var(--text-muted)" />
      <path d="M52 168 Q52 156 71 156 Q90 156 90 168" fill="var(--text-muted)" />

      {/* Labels */}
      <rect x="30" y="178" width="82" height="8" rx="3" fill="var(--border-default)" />
      <rect x="42" y="192" width="58" height="6" rx="3" fill="var(--bg-elevated)" />
      <rect x="28" y="210" width="86" height="14" rx="3" fill="var(--accent-teal-dim)" />
      <text x="71" y="219" textAnchor="middle" fontSize="5.5"
        fontFamily="var(--font-mono), monospace" letterSpacing="0.08em" fill="var(--accent-teal)"
      >MENTOR</text>
      <text x="71" y="232" textAnchor="middle" fontSize="5"
        fontFamily="var(--font-mono), monospace" fill="var(--text-muted)"
      >0x4f2a…c91d</text>

      {/* ══════════════════════════════════════════
          RIGHT — LEARNER WALLET CARD
      ══════════════════════════════════════════ */}
      <rect x="390" y="80" width="118" height="148" rx="8"
        fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="1" />
      <rect x="390" y="80" width="118" height="32" rx="8" fill="var(--bg-elevated)" />
      <rect x="390" y="96" width="118" height="16" fill="var(--bg-elevated)" />
      <circle cx="406" cy="96" r="4" fill="var(--border-default)" />
      <circle cx="420" cy="96" r="4" fill="var(--border-default)" />
      <circle cx="434" cy="96" r="4" fill="var(--border-default)" />
      <circle cx="449" cy="148" r="22" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1" />
      <circle cx="449" cy="141" r="7" fill="var(--text-muted)" />
      <path d="M430 168 Q430 156 449 156 Q468 156 468 168" fill="var(--text-muted)" />
      <rect x="408" y="178" width="82" height="8" rx="3" fill="var(--border-default)" />
      <rect x="420" y="192" width="58" height="6" rx="3" fill="var(--bg-elevated)" />
      <rect x="406" y="210" width="86" height="14" rx="3" fill="var(--accent-teal-dim)" />
      <text x="449" y="219" textAnchor="middle" fontSize="5.5"
        fontFamily="var(--font-mono), monospace" letterSpacing="0.08em" fill="var(--accent-teal)"
      >LEARNER</text>
      <text x="449" y="232" textAnchor="middle" fontSize="5"
        fontFamily="var(--font-mono), monospace" fill="var(--text-muted)"
      >0x9b1e…3fa2</text>

      {/* ══════════════════════════════════════════
          CENTER — BOND CARD (focal point)
      ══════════════════════════════════════════ */}
      <g transform="translate(0, -8)">
        {/* Card background — uses surface with teal border */}
        <rect x="186" y="60" width="148" height="188" rx="10"
          fill="var(--bg-surface)" stroke="var(--accent-teal)" strokeWidth="2" />

        {/* Header strip */}
        <rect x="186" y="60" width="148" height="36" rx="10" fill="var(--accent-teal-dim)" />
        <rect x="186" y="78" width="148" height="18" fill="var(--accent-teal-dim)" />
        <text x="260" y="83" textAnchor="middle" fontSize="6"
          fontFamily="var(--font-mono), monospace" letterSpacing="0.1em" fill="var(--accent-teal)"
        >BOND #042</text>

        {/* Lock icon */}
        <rect x="244" y="118" width="32" height="26" rx="4"
          fill="var(--accent-teal-dim)" stroke="var(--accent-teal)" strokeWidth="2" />
        <path d="M250 118 L250 110 Q250 102 260 102 Q270 102 270 110 L270 118"
          stroke="var(--accent-teal)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="260" cy="129" r="3.5" fill="var(--accent-teal)" opacity="0.9" />
        <rect x="258.5" y="129" width="3" height="6" rx="1" fill="var(--accent-teal)" opacity="0.9" />

        {/* Skill title */}
        <text x="260" y="162" textAnchor="middle" fontSize="7.5" fontWeight="700"
          fontFamily="var(--font-display), sans-serif" fill="var(--text-primary)"
        >React Dev</text>

        {/* Divider */}
        <line x1="200" y1="172" x2="320" y2="172" stroke="var(--border-default)" strokeWidth="1" />

        {/* Status row */}
        <text x="200" y="184" fontSize="5.5" fontFamily="var(--font-mono), monospace" fill="var(--text-muted)">Status</text>
        <rect x="280" y="177" width="38" height="11" rx="3" fill="var(--accent-teal-dim)" />
        <text x="299" y="185" textAnchor="middle" fontSize="5.5"
          fontFamily="var(--font-mono), monospace" fill="var(--accent-teal)"
        >ACTIVE</text>

        {/* Stake row */}
        <text x="200" y="200" fontSize="5.5" fontFamily="var(--font-mono), monospace" fill="var(--text-muted)">Stake</text>
        <text x="318" y="200" textAnchor="end" fontSize="5.5"
          fontFamily="var(--font-mono), monospace" fill="var(--text-primary)"
        >0.05 ETH</text>

        {/* Deadline row */}
        <text x="200" y="216" fontSize="5.5" fontFamily="var(--font-mono), monospace" fill="var(--text-muted)">Deadline</text>
        <text x="318" y="216" textAnchor="end" fontSize="5.5"
          fontFamily="var(--font-mono), monospace" fill="var(--text-primary)"
        >30 days</text>

        {/* Signature indicators */}
        <line x1="200" y1="226" x2="320" y2="226" stroke="var(--border-default)" strokeWidth="1" />

        {/* Mentor signed */}
        <circle cx="208" cy="238" r="4" fill="var(--accent-teal)" opacity="0.9" />
        <path d="M205.5 238 L207.2 240 L210.5 236"
          stroke="var(--text-inverse)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="216" y="241" fontSize="5.5" fontFamily="var(--font-mono), monospace" fill="var(--text-muted)">Mentor signed</text>

        {/* Learner pending */}
        <circle cx="208" cy="252" r="4" fill="none" stroke="var(--border-default)" strokeWidth="1.2" />
        <text x="216" y="255" fontSize="5.5" fontFamily="var(--font-mono), monospace" fill="var(--text-muted)">Learner pending…</text>
      </g>

      {/* ══════════════════════════════════════════
          CONNECTING LINES — teal animated
      ══════════════════════════════════════════ */}
      <line x1="132" y1="154" x2="184" y2="154"
        stroke="var(--accent-teal)" strokeWidth="2"
        strokeDasharray="6 4"
        markerEnd="url(#arrow-flow)"
        style={{ animation: "dashPulse 1.5s linear infinite" }}
      />
      <line x1="336" y1="154" x2="388" y2="154"
        stroke="var(--accent-teal)" strokeWidth="2"
        strokeDasharray="6 4"
        markerEnd="url(#arrow-flow)"
        style={{ animation: "dashPulse 1.5s linear infinite 0.75s" }}
      />

      {/* ══════════════════════════════════════════
          BOTTOM — NFT CREDENTIAL CARDS
      ══════════════════════════════════════════ */}
      <text x="260" y="272" textAnchor="middle" fontSize="5.5"
        fontFamily="var(--font-mono), monospace" letterSpacing="0.08em" fill="var(--text-muted)"
      >ON COMPLETION — MINTED TO BOTH</text>

      {/* NFT card left — MENTOR PROOF */}
      <rect x="136" y="278" width="110" height="56" rx="8"
        fill="var(--bg-surface)" stroke="var(--accent-teal)" strokeWidth="1.5" />
      <rect x="136" y="278" width="110" height="16" rx="8" fill="var(--accent-teal-dim)" />
      <rect x="136" y="287" width="110" height="7" fill="var(--accent-teal-dim)" />
      <text x="191" y="291" textAnchor="middle" fontSize="5.5"
        fontFamily="var(--font-mono), monospace" letterSpacing="0.08em" fill="var(--accent-teal)"
      >MENTOR PROOF</text>
      <rect x="181" y="300" width="20" height="14" rx="3"
        fill="var(--accent-teal-dim)" stroke="var(--accent-teal)" strokeWidth="1.2" />
      <path d="M184 300 L184 296 Q184 292 191 292 Q198 292 198 296 L198 300"
        stroke="var(--accent-teal)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <text x="191" y="324" textAnchor="middle" fontSize="5"
        fontFamily="var(--font-mono), monospace" fill="var(--text-muted)"
      >Soulbound</text>

      {/* NFT card right — LEARNER PROOF */}
      <rect x="274" y="278" width="110" height="56" rx="8"
        fill="var(--bg-surface)" stroke="var(--accent-teal)" strokeWidth="1.5" />
      <rect x="274" y="278" width="110" height="16" rx="8" fill="var(--accent-teal-dim)" />
      <rect x="274" y="287" width="110" height="7" fill="var(--accent-teal-dim)" />
      <text x="329" y="291" textAnchor="middle" fontSize="5.5"
        fontFamily="var(--font-mono), monospace" letterSpacing="0.08em" fill="var(--accent-teal)"
      >LEARNER PROOF</text>
      <rect x="319" y="300" width="20" height="14" rx="3"
        fill="var(--accent-teal-dim)" stroke="var(--accent-teal)" strokeWidth="1.2" />
      <path d="M322 300 L322 296 Q322 292 329 292 Q336 292 336 296 L336 300"
        stroke="var(--accent-teal)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <text x="329" y="324" textAnchor="middle" fontSize="5"
        fontFamily="var(--font-mono), monospace" fill="var(--text-muted)"
      >Soulbound</text>

      {/* Drop lines */}
      <line x1="260" y1="248" x2="191" y2="276"
        stroke="var(--border-default)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="260" y1="248" x2="329" y2="276"
        stroke="var(--border-default)" strokeWidth="1" strokeDasharray="3 3" />

      <style>{`
        @keyframes dashPulse { to { stroke-dashoffset: -20; } }
      `}</style>
    </svg>
  );
}
