import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Backgrounds
        "bg-dark":       "#0D0D0D",
        "bg-dark-card":  "#141414",
        "bg-light":      "#F5F0E8",

        // Brand accents
        "accent-teal":   "#4DFFD2",
        "accent-yellow": "#C8FF4D",
        "lock-gold":     "#E8C84D",

        // Text
        "text-dark":     "#1A1A1A",
        "text-light":    "#F5F0E8",
        "text-muted":    "#6B7280",

        // Status badges
        status: {
          pending:   "#C8FF4D",
          active:    "#4DFFD2",
          signed:    "#F97316",
          completed: "#4DFFD2",
          disputed:  "#EF4444",
        },
      },
      fontFamily: {
        display: ["Syne", "Arial Black", "sans-serif"],
        mono:    ["DM Mono", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4DFFD2 0%, #C8FF4D 100%)",
        "brand-gradient-h": "linear-gradient(90deg, #4DFFD2 0%, #C8FF4D 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
