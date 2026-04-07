/**
 * CoSigned Brand Tokens
 * Single source of truth for all brand colors.
 * Use these in Tailwind config, CSS vars, and JS/TS code.
 */

export const brand = {
  // Core backgrounds
  bgDark:       "#0D0D0D",   // primary dark background
  bgDarkCard:   "#141414",   // card/surface on dark
  bgLight:      "#F5F0E8",   // warm cream — light mode background
  bgLightCard:  "#FFFFFF",   // card on light

  // Icon gradient
  gradientStart: "#4DFFD2",  // teal — gradient start / "Co" text
  gradientEnd:   "#C8FF4D",  // yellow-green — gradient end / "Signed" text (dark mode)

  // Text
  textDark:     "#1A1A1A",   // near-black — "Signed" text on light bg
  textLight:    "#F5F0E8",   // cream — body text on dark bg
  textMuted:    "#6B7280",   // muted gray

  // Accent
  teal:         "#4DFFD2",   // primary accent — teal
  yellow:       "#C8FF4D",   // secondary accent — yellow-green
  lockGold:     "#E8C84D",   // lock icon color

  // Status badge colors (Day 19)
  statusPending:    "#C8FF4D",  // yellow
  statusActive:     "#4DFFD2",  // teal/blue
  statusSigned:     "#F97316",  // orange
  statusCompleted:  "#4DFFD2",  // teal
  statusDisputed:   "#EF4444",  // red
} as const;

export type BrandColor = keyof typeof brand;
