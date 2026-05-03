"use client";

import { useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CertificateCardProps {
  learnerName: string;
  mentorName: string;
  skillTitle: string;
  successCriteria: string;
  startDate: string;
  completedDate: string;
  bondId?: string;
  tokenType: "LEARNER_PROOF" | "MENTOR_PROOF";
  status: "preview" | "pending" | "completed";
  animated?: boolean;
  mentorSigned?: boolean;
  learnerSigned?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COSIGNED_ADDRESS = "0xd1D2a913eb75B43125AA860bea1BabC27F2d550A";
const PLACEHOLDER_COLOR = "#2A2A3A";
const MUTED = "#5A5A7A";
const TEAL = "#4DFFD2";
const YELLOW = "#E8FF47";
const LIGHT = "#F0F0F5";

function formatDate(iso: string): string {
  if (!iso) return "DD MMM YYYY";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VerifiedSeal() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="Verified">
      <circle cx="18" cy="18" r="17" stroke={TEAL} strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="18" cy="18" r="12" fill={TEAL} fillOpacity="0.15" />
      <path d="M12 18l4 4 8-8" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockSeal() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="Pending">
      <circle cx="18" cy="18" r="17" stroke={MUTED} strokeOpacity="0.4" strokeWidth="1" />
      <rect x="12" y="18" width="12" height="9" rx="2" stroke={MUTED} strokeWidth="1.5" fill="none" />
      <path d="M14 18v-3a4 4 0 0 1 8 0v3" stroke={MUTED} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="22.5" r="1.5" fill={MUTED} />
    </svg>
  );
}

function SignatureDot({ signed }: { signed: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: signed ? TEAL : MUTED,
        marginLeft: 6,
        verticalAlign: "middle",
        flexShrink: 0,
      }}
      aria-label={signed ? "Signed" : "Not signed"}
    />
  );
}

// ─── QR Section ───────────────────────────────────────────────────────────────

function QRSection({
  bondId,
  status,
}: {
  bondId?: string;
  status: "preview" | "pending" | "completed";
}) {
  const isPreview = !bondId || status === "preview";
  const qrUrl = isPreview
    ? "https://cosigned.xyz/preview"
    : `https://sepolia.basescan.org/address/${COSIGNED_ADDRESS}?bondId=${bondId}`;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    opacity: isPreview ? 0.3 : 1,
  };

  const qrWrapStyle: React.CSSProperties = {
    border: `1px solid rgba(77, 255, 210, 0.2)`,
    borderRadius: 6,
    padding: 4,
    background: "rgba(10, 10, 15, 0.8)",
    boxShadow: status === "completed" ? "0 0 10px rgba(77, 255, 210, 0.2)" : "none",
    lineHeight: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={qrWrapStyle}>
        <QRCodeSVG
          value={qrUrl}
          size={48}
          bgColor="transparent"
          fgColor={TEAL}
          level="M"
        />
      </div>
      <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 7, color: MUTED, textAlign: "center" }}>
        Scan to verify
      </span>
      <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 8, color: MUTED, textAlign: "center" }}>
        {bondId ? `Bond #${bondId}` : "Bond #—"}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CertificateCard({
  learnerName,
  mentorName,
  skillTitle,
  successCriteria: _successCriteria,
  startDate,
  completedDate,
  bondId,
  tokenType,
  status,
  animated = false,
  mentorSigned = false,
  learnerSigned = false,
}: CertificateCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // ── Resolved display values ──────────────────────────────────────────────
  const displayLearner = learnerName || "Learner Name";
  const displayMentor  = mentorName  || "Your Name";
  const displaySkill   = skillTitle  || "Skill Title";
  const displayStart   = startDate   ? formatDate(startDate)   : "DD MMM YYYY";
  const displayEnd     = completedDate && status === "completed"
    ? formatDate(completedDate)
    : status === "preview" ? "DD MMM YYYY" : "Pending";

  const isEmpty = (v: string, placeholder: string) => !v ? placeholder : v;

  // ── Card styles ──────────────────────────────────────────────────────────
  const borderStyle =
    status === "preview"
      ? "1px dashed rgba(77, 255, 210, 0.2)"
      : status === "completed"
      ? "1px solid rgba(77, 255, 210, 0.4)"
      : "1px solid rgba(77, 255, 210, 0.15)";

  const boxShadow =
    status === "completed"
      ? "0 0 60px rgba(77, 255, 210, 0.15)"
      : "0 0 40px rgba(77, 255, 210, 0.1)";

  const cardStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    maxWidth: 600,
    aspectRatio: "600 / 400",
    background: `
      radial-gradient(ellipse at center, rgba(77,255,210,0.08) 0%, rgba(10,10,15,0.95) 70%),
      #0A0A0F
    `,
    border: borderStyle,
    borderRadius: 16,
    boxShadow,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "var(--font-syne, sans-serif)",
  };

  // ── Download PNG — SVG-to-canvas approach (works in production) ─────────
  const handleDownload = useCallback(() => {
    if (!cardRef.current) return;

    // Serialize the card element as SVG using foreignObject
    const el = cardRef.current;
    const { width, height } = el.getBoundingClientRect();
    const scale = 2;
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw dark background
    ctx.fillStyle = "#0A0A0F";
    ctx.fillRect(0, 0, w, h);

    // Use XMLSerializer to get the DOM as SVG foreignObject
    const data = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <foreignObject width="${w}" height="${h}">
          <div xmlns="http://www.w3.org/1999/xhtml"
            style="width:${width}px;height:${height}px;transform:scale(${scale});transform-origin:top left;overflow:hidden;">
            ${el.outerHTML}
          </div>
        </foreignObject>
      </svg>`;

    const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = `cosigned-${(skillTitle || "credential").replace(/\s+/g, "-").toLowerCase()}-${bondId || "preview"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.onerror = () => {
      // Fallback: open the card in a new tab for manual save
      URL.revokeObjectURL(url);
      const fallback = window.open("", "_blank");
      if (fallback) {
        fallback.document.write(`<html><body style="margin:0;background:#0A0A0F">${el.outerHTML}</body></html>`);
        fallback.document.close();
        fallback.focus();
        alert("Right-click the certificate and choose 'Save image as' to download.");
      }
    };

    img.src = url;
  }, [skillTitle, bondId]);

  // ── Share ────────────────────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    const text = `Just earned my CoSigned credential for ${displaySkill} under the mentorship of ${displayMentor}.\nVerified on Base blockchain. Bond #${bondId || "—"}\ncosigned.xyz/bond/${bondId || ""}\n#CoSigned #Web3 #BuildInPublic`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    navigator.clipboard.writeText(text).catch(() => {});
  }, [displaySkill, displayMentor, bondId]);

  // ── Animation wrapper ────────────────────────────────────────────────────
  const Wrapper = animated && !prefersReduced ? motion.div : "div";
  const motionProps =
    animated && !prefersReduced
      ? { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" } }
      : {};

  return (
    <div style={{ width: "100%", maxWidth: 600 }}>
      {/* @ts-expect-error motion/div union */}
      <Wrapper {...motionProps}>
        <div ref={cardRef} style={cardStyle}>

          {/* ── HEADER ── */}
          <div style={{ padding: "16px 20px 0", position: "relative" }}>
            {/* Preview label */}
            {status === "preview" && (
              <span style={{ position: "absolute", top: 12, left: 16, fontFamily: "var(--font-dm-mono, monospace)", fontSize: 9, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Preview
              </span>
            )}

            {/* Token type badge */}
            <span style={{
              position: "absolute", top: 12, right: 16,
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: 9,
              color: YELLOW, textTransform: "uppercase", letterSpacing: "0.1em",
              background: "rgba(232,255,71,0.15)", border: `1px solid ${YELLOW}`,
              borderRadius: 999, padding: "3px 10px",
            }}>
              {tokenType === "LEARNER_PROOF" ? "Learner Proof" : "Mentor Proof"}
            </span>

            {/* Wordmark */}
            <div style={{ textAlign: "center", paddingTop: 4 }}>
              <div style={{ fontFamily: "var(--font-syne, sans-serif)", fontWeight: 700, fontSize: 24, color: YELLOW, lineHeight: 1 }}>
                CoSigned
              </div>
              <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 4 }}>
                Dual-Signature Mentorship Protocol
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, marginTop: 12, background: "linear-gradient(90deg, transparent, #E8FF47, transparent)" }} />
          </div>

          {/* ── BODY ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 24px", textAlign: "center", gap: 0 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: MUTED, marginBottom: 5 }}>
              This certifies that
            </div>
            <div style={{ fontFamily: "var(--font-syne, sans-serif)", fontWeight: 700, fontSize: 22, color: !learnerName ? PLACEHOLDER_COLOR : LIGHT, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              {isEmpty(learnerName, "Learner Name")}
              {status === "pending" && <SignatureDot signed={learnerSigned} />}
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: MUTED, marginBottom: 6 }}>
              has successfully completed
            </div>
            <div style={{
              fontFamily: "var(--font-syne, sans-serif)", fontWeight: 700, fontSize: 18,
              color: !skillTitle ? PLACEHOLDER_COLOR : YELLOW,
              marginBottom: 8, maxWidth: "80%",
              overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {isEmpty(skillTitle, "Skill Title")}
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: MUTED, marginBottom: 5 }}>
              under the mentorship of
            </div>
            <div style={{ fontFamily: "var(--font-syne, sans-serif)", fontWeight: 500, fontSize: 15, color: !mentorName ? PLACEHOLDER_COLOR : TEAL, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              {isEmpty(mentorName, "Your Name")}
              {status === "pending" && <SignatureDot signed={mentorSigned} />}
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 20px 8px" }}>
            {/* Three columns */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              {/* Left — start date */}
              <div style={{ textAlign: "left", minWidth: 80 }}>
                <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 9, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Started</div>
                <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: !startDate ? PLACEHOLDER_COLOR : LIGHT }}>{displayStart}</div>
              </div>

              {/* Center — seal */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {status === "completed" ? <VerifiedSeal /> : <LockSeal />}
                {status !== "completed" && (
                  <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 8, color: MUTED, textAlign: "center" }}>
                    Pending Co-Signatures
                  </div>
                )}
              </div>

              {/* Right — QR code */}
              <div style={{ textAlign: "right", minWidth: 80, display: "flex", justifyContent: "flex-end" }}>
                <QRSection bondId={bondId} status={status} />
              </div>
            </div>

            {/* Completed date row */}
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 9, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Completed</div>
              <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: status === "completed" && completedDate ? LIGHT : MUTED, fontStyle: status !== "completed" ? "italic" : "normal" }}>
                {displayEnd}
              </div>
            </div>

            {/* Bottom strip */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 6 }}>
              <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 9, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="10" height="10" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <circle cx="32" cy="32" r="14" stroke={TEAL} strokeWidth="2.5" fill="none" />
                  <path d="M20 20 L32 32 L44 20" stroke={TEAL} strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
                cosigned.xyz
              </div>
            </div>
          </div>
        </div>
      </Wrapper>

      {/* ── Download / Share buttons (completed only) ── */}
      {status === "completed" && (
        <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
          <button
            onClick={handleDownload}
            style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12,
              padding: "8px 20px", border: `1px solid ${TEAL}`, color: TEAL,
              background: "transparent", borderRadius: 6, cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(77,255,210,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            aria-label="Download certificate as PNG"
          >
            Download PNG
          </button>
          <button
            onClick={handleShare}
            style={{
              fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12,
              padding: "8px 20px", border: `1px solid ${YELLOW}`, color: YELLOW,
              background: "transparent", borderRadius: 6, cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(232,255,71,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            aria-label="Share certificate"
          >
            Share
          </button>
        </div>
      )}
    </div>
  );
}
