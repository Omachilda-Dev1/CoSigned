"use client";

import type { ReactNode, CSSProperties } from "react";

interface StyledCardProps {
  children: ReactNode;
  accent?: string;       // accent colour — defaults to var(--accent-teal)
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  as?: "div" | "button" | "article";
}

/**
 * StyledCard — layered card design.
 * Outer shell shows the accent colour at corners.
 * Inner panel is inset with its own border-radius and shadow.
 * Matches the reference design: accent frame + white inner panel.
 */
export default function StyledCard({
  children,
  accent,
  className,
  style,
  onClick,
  as: Tag = "div",
}: StyledCardProps) {
  const accentColor = accent ?? "var(--accent-teal)";

  const outerStyle: CSSProperties = {
    position: "relative",
    borderRadius: 20,
    background: accentColor,
    padding: 10,
    boxShadow: `0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)`,
    cursor: onClick ? "pointer" : "default",
    transition: "transform 200ms ease, box-shadow 200ms ease",
    ...style,
  };

  const innerStyle: CSSProperties = {
    borderRadius: 13,
    backgroundColor: "var(--bg-surface)",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.08)",
    border: "1px solid var(--border-default)",
    overflow: "hidden",
    position: "relative",
  };

  if (Tag === "button") {
    return (
      <button
        onClick={onClick}
        className={className}
        style={{
          ...outerStyle,
          background: accentColor,
          border: "none",
          textAlign: "left",
          width: "100%",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.14)`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)`;
        }}
      >
        <div style={innerStyle}>{children}</div>
      </button>
    );
  }

  return (
    <Tag
      className={className}
      style={outerStyle}
      onClick={onClick}
      onMouseEnter={onClick ? (e: React.MouseEvent<HTMLElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.14)`;
      } : undefined}
      onMouseLeave={onClick ? (e: React.MouseEvent<HTMLElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)`;
      } : undefined}
    >
      <div style={innerStyle}>{children}</div>
    </Tag>
  );
}
