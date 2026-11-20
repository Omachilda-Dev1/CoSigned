"use client";

import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { siteConfig } from "@/lib/config";
import { shortAddress } from "@/lib/format";

export type CertificateState = "preview" | "pending" | "completed";

export interface CertificateProps {
  skillTitle: string;
  learnerName?: string;
  mentorName?: string;
  learner?: string;
  mentor?: string;
  bondId?: string;
  issuedOn?: string;
  state: CertificateState;
  variant?: "learner" | "mentor";
}

// The certificate is a standalone artifact, so it uses fixed colours (not theme
// tokens) and system font fallbacks — it must render identically when exported.
const C = {
  bg: "#0B0C11",
  panel: "#11131A",
  line: "#262938",
  text: "#EEEFF4",
  muted: "#7E8197",
  placeholder: "#3A3D4E",
  teal: "#4DFFD2",
  lime: "#C8FF4D",
  gold: "#E8C84D",
};
const DISPLAY = "Syne, 'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'DM Mono', ui-monospace, Menlo, Consolas, monospace";

function clamp(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** 1200×800 SVG credential. Pass a ref to export it (see `downloadSvgAsPng`). */
export const Certificate = forwardRef<SVGSVGElement, CertificateProps>(function Certificate(
  { skillTitle, learnerName, mentorName, learner, mentor, bondId, issuedOn, state, variant = "learner" },
  ref,
) {
  const learnerLabel = learnerName?.trim() || (learner ? shortAddress(learner, 6) : "");
  const mentorLabel = mentorName?.trim() || (mentor ? shortAddress(mentor, 6) : "");
  const skill = skillTitle.trim();
  const skillSize = skill.length > 34 ? 44 : 56;
  const completed = state === "completed";
  const verifyUrl = bondId ? `${siteConfig.url}/bond/${bondId}` : siteConfig.url;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 800"
      width="100%"
      role="img"
      aria-label={`CoSigned credential${skill ? ` for ${skill}` : ""}`}
      className="block h-auto w-full rounded-2xl"
    >
      <defs>
        <radialGradient id="cert-glow" cx="50%" cy="38%" r="65%">
          <stop offset="0" stopColor={C.teal} stopOpacity="0.10" />
          <stop offset="1" stopColor={C.teal} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cert-rule" x1="0" x2="1">
          <stop offset="0" stopColor={C.lime} stopOpacity="0" />
          <stop offset="0.5" stopColor={C.lime} stopOpacity="0.8" />
          <stop offset="1" stopColor={C.lime} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cert-mark" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.teal} />
          <stop offset="1" stopColor={C.lime} />
        </linearGradient>
      </defs>

      <rect width="1200" height="800" rx="28" fill={C.bg} />
      <rect width="1200" height="800" rx="28" fill="url(#cert-glow)" />
      <rect
        x="24" y="24" width="1152" height="752" rx="18" fill="none"
        stroke={completed ? C.teal : C.line} strokeOpacity={completed ? 0.45 : 1}
        strokeDasharray={state === "preview" ? "10 8" : undefined} strokeWidth="2"
      />

      {/* Header */}
      <g transform="translate(560 64) scale(1.25)">
        <g stroke="url(#cert-mark)" strokeWidth="3.2" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d="M6 6 26 26l8-4L22 10Z" /><path d="m26 26 4 16 12-12Z" />
          <path d="M58 6 38 26l-8-4L42 10Z" /><path d="m38 26-4 16-12-12Z" />
          <path d="M6 6q26-12 52 0" /><path d="M22 30q10 16 20 0" />
        </g>
        <rect x="25.5" y="24" width="13" height="10" rx="2" fill={C.bg} stroke={C.gold} strokeWidth="1.8" />
        <path d="M28.5 24q0-5 3.5-5t3.5 5" stroke={C.gold} strokeWidth="1.8" fill="none" />
      </g>
      <text x="600" y="176" textAnchor="middle" fontFamily={DISPLAY} fontWeight="700" fontSize="34" fill={C.text}>
        <tspan fill={C.teal}>Co</tspan>Signed
      </text>
      <text x="600" y="206" textAnchor="middle" fontFamily={MONO} fontSize="13" letterSpacing="4" fill={C.muted}>
        DUAL-SIGNATURE MENTORSHIP CREDENTIAL
      </text>
      <rect x="380" y="232" width="440" height="1.5" fill="url(#cert-rule)" />

      {/* Corner badges */}
      <text x="64" y="80" fontFamily={MONO} fontSize="14" letterSpacing="2" fill={C.muted}>
        {state === "preview" ? "PREVIEW" : bondId ? `BOND #${bondId}` : ""}
      </text>
      <g transform="translate(1000 58)">
        <rect width="136" height="32" rx="16" fill={C.lime} fillOpacity="0.12" stroke={C.lime} strokeOpacity="0.6" />
        <text x="68" y="21" textAnchor="middle" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={C.lime}>
          {variant === "mentor" ? "MENTOR PROOF" : "LEARNER PROOF"}
        </text>
      </g>

      {/* Body */}
      <text x="600" y="302" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="20" fill={C.muted}>
        This certifies that
      </text>
      <text x="600" y="358" textAnchor="middle" fontFamily={DISPLAY} fontWeight="700" fontSize="42" fill={learnerLabel ? C.text : C.placeholder}>
        {clamp(learnerLabel || "Learner name", 32)}
      </text>
      <text x="600" y="408" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="20" fill={C.muted}>
        has demonstrated
      </text>
      <text x="600" y={430 + skillSize} textAnchor="middle" fontFamily={DISPLAY} fontWeight="800" fontSize={skillSize} fill={skill ? C.lime : C.placeholder}>
        {clamp(skill || "Skill title", 44)}
      </text>
      <text x="600" y="548" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="20" fill={C.muted}>
        under the mentorship of
      </text>
      <text x="600" y="594" textAnchor="middle" fontFamily={DISPLAY} fontWeight="600" fontSize="30" fill={mentorLabel ? C.teal : C.placeholder}>
        {clamp(mentorLabel || "Mentor name", 36)}
      </text>

      {/* Footer */}
      <line x1="64" y1="650" x2="1136" y2="650" stroke={C.line} />
      <text x="64" y="690" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={C.muted}>STATUS</text>
      <text x="64" y="720" fontFamily={MONO} fontSize="18" fill={completed ? C.teal : C.muted}>
        {completed ? `Co-signed${issuedOn ? ` · ${issuedOn}` : ""}` : "Awaiting co-signatures"}
      </text>
      <text x="64" y="748" fontFamily={MONO} fontSize="12" fill={C.muted}>
        Soulbound · ERC-5192 · Base
      </text>

      <g transform="translate(600 712)">
        <circle r="34" fill="none" stroke={completed ? C.teal : C.line} strokeWidth="2" />
        <circle r="26" fill={completed ? C.teal : C.line} fillOpacity={completed ? 0.14 : 0.4} />
        {completed ? (
          <path d="M-11 0l7 7 15-15" stroke={C.teal} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <g stroke={C.muted} strokeWidth="2.5" fill="none" strokeLinecap="round">
            <rect x="-9" y="-2" width="18" height="13" rx="2" />
            <path d="M-5-2v-5a5 5 0 0 1 10 0v5" />
          </g>
        )}
      </g>

      <g opacity={state === "preview" ? 0.35 : 1}>
        <text x="1040" y="690" textAnchor="end" fontFamily={MONO} fontSize="12" letterSpacing="2" fill={C.muted}>VERIFY</text>
        <text x="1040" y="716" textAnchor="end" fontFamily={MONO} fontSize="14" fill={C.text}>
          {bondId ? `Bond #${bondId}` : "Bond #—"}
        </text>
        <rect x="1056" y="666" width="88" height="88" rx="10" fill={C.panel} stroke={C.line} />
        <g transform="translate(1064 674)">
          <QRCodeSVG value={verifyUrl} size={72} bgColor="transparent" fgColor={C.teal} level="M" />
        </g>
      </g>
    </svg>
  );
});

/** Rasterises an SVG element to a PNG and triggers a download. */
export async function downloadSvgAsPng(svg: SVGSVGElement, filename: string, scale = 2) {
  const [w, h] = [1200, 800];
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  const markup = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not render certificate."));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable.");
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
