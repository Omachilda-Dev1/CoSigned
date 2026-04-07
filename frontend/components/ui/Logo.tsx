"use client";

/**
 * CoSigned Logo Component
 * Renders the correct SVG variant based on mode and desired variant.
 *
 * Usage:
 *   <Logo />                        — full logo, auto dark/light
 *   <Logo variant="icon" />         — icon only
 *   <Logo variant="wordmark" />     — wordmark only
 *   <Logo mode="dark" />            — force dark version
 *   <Logo mode="light" />           — force light version
 */

type LogoVariant = "full" | "icon" | "wordmark";
type LogoMode = "dark" | "light" | "auto";

interface LogoProps {
  variant?: LogoVariant;
  mode?: LogoMode;
  className?: string;
  width?: number;
  height?: number;
}

// ─── Shared defs ────────────────────────────────────────────────────────────

function IconPaths({ stroke }: { stroke: string }) {
  return (
    <>
      {/* Left pen nib */}
      <path d="M6 6 L26 26 L34 22 L22 10 Z" stroke={stroke} strokeWidth="2.8" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M26 26 L30 42 L42 30 Z"       stroke={stroke} strokeWidth="2.8" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Right pen nib */}
      <path d="M58 6 L38 26 L30 22 L42 10 Z" stroke={stroke} strokeWidth="2.8" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M38 26 L34 42 L22 30 Z"       stroke={stroke} strokeWidth="2.8" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Connecting arcs */}
      <path d="M6 6 Q32 -6 58 6"   stroke={stroke} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M22 30 Q32 46 42 30" stroke={stroke} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
    </>
  );
}

function LockMark({ bg }: { bg: string }) {
  return (
    <>
      <rect x="25.5" y="24" width="13" height="10" rx="2" fill={bg} stroke="#E8C84D" strokeWidth="1.8"/>
      <path d="M28.5 24 Q28.5 19 32 19 Q35.5 19 35.5 24" stroke="#E8C84D" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="32" cy="29" r="1.5" fill="#E8C84D"/>
    </>
  );
}

// ─── Icon only ───────────────────────────────────────────────────────────────

function IconSVG({ mode, className, width = 64, height = 64 }: Omit<LogoProps, "variant">) {
  const isDark = mode !== "light";
  const stroke = isDark ? "url(#iconGrad)" : "#1A1A1A";
  const lockBg = isDark ? "#0D0D0D" : "#F5F0E8";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="CoSigned icon"
    >
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4DFFD2"/>
          <stop offset="100%" stopColor="#C8FF4D"/>
        </linearGradient>
      </defs>
      <IconPaths stroke={stroke}/>
      <LockMark bg={lockBg}/>
    </svg>
  );
}

// ─── Wordmark only ───────────────────────────────────────────────────────────

function WordmarkSVG({ mode, className, width = 220, height = 52 }: Omit<LogoProps, "variant">) {
  const isDark = mode !== "light";
  const signedColor = isDark ? "#C8FF4D" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 52"
      fill="none"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="CoSigned wordmark"
    >
      <text x="0"  y="42" fontFamily="'Syne', 'Arial Black', sans-serif" fontWeight="700" fontSize="42" fill="#4DFFD2">Co</text>
      <text x="58" y="42" fontFamily="'Syne', 'Arial Black', sans-serif" fontWeight="700" fontSize="42" fill={signedColor}>Signed</text>
    </svg>
  );
}

// ─── Full logo ────────────────────────────────────────────────────────────────

function FullLogoSVG({ mode, className, width = 280, height = 72 }: Omit<LogoProps, "variant">) {
  const isDark = mode !== "light";
  const iconStroke = isDark ? "url(#fullIconGrad)" : "#1A1A1A";
  const lockBg     = isDark ? "#0D0D0D" : "#F5F0E8";
  const signedColor = isDark ? "#C8FF4D" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 72"
      fill="none"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="CoSigned logo"
    >
      <defs>
        <linearGradient id="fullIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4DFFD2"/>
          <stop offset="100%" stopColor="#C8FF4D"/>
        </linearGradient>
      </defs>

      {/* Icon at 64x64, offset to vertically center in 72px height */}
      <g transform="translate(4, 4)">
        <IconPaths stroke={iconStroke}/>
        <LockMark bg={lockBg}/>
      </g>

      {/* Wordmark — x offset after 64px icon + 8px gap */}
      <text x="76"  y="50" fontFamily="'Syne', 'Arial Black', sans-serif" fontWeight="700" fontSize="36" fill="#4DFFD2">{`Co`}</text>
      <text x="130" y="50" fontFamily="'Syne', 'Arial Black', sans-serif" fontWeight="700" fontSize="36" fill={signedColor}>Signed</text>
    </svg>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function Logo({
  variant = "full",
  mode = "auto",
  className,
  width,
  height,
}: LogoProps) {
  // "auto" renders both and uses CSS to show the right one
  if (mode === "auto") {
    return (
      <>
        {/* Shown in dark mode */}
        <span className="hidden dark:inline-flex">
          {variant === "icon"     && <IconSVG     mode="dark"  className={className} width={width} height={height}/>}
          {variant === "wordmark" && <WordmarkSVG mode="dark"  className={className} width={width} height={height}/>}
          {variant === "full"     && <FullLogoSVG mode="dark"  className={className} width={width} height={height}/>}
        </span>
        {/* Shown in light mode */}
        <span className="inline-flex dark:hidden">
          {variant === "icon"     && <IconSVG     mode="light" className={className} width={width} height={height}/>}
          {variant === "wordmark" && <WordmarkSVG mode="light" className={className} width={width} height={height}/>}
          {variant === "full"     && <FullLogoSVG mode="light" className={className} width={width} height={height}/>}
        </span>
      </>
    );
  }

  if (variant === "icon")     return <IconSVG     mode={mode} className={className} width={width} height={height}/>;
  if (variant === "wordmark") return <WordmarkSVG mode={mode} className={className} width={width} height={height}/>;
  return <FullLogoSVG mode={mode} className={className} width={width} height={height}/>;
}
