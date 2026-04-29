"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ConnectButton from "@/components/wallet/ConnectButton";

const NAV_LINKS = [
  { label: "How it Works", href: "/how-to-use" },
  { label: "Explore",      href: "/explore" },
  { label: "Dashboard",    href: "/dashboard" },
];

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6"  x2="6"  y2="18"/>
      <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
  );
}

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div ref={menuRef}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid var(--nav-border)",
        backgroundColor: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 24px", maxWidth: 1280, margin: "0 auto",
        }}>
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0, flexShrink: 0 }}
            aria-label="Go to home"
          >
            <Logo width={140} height={36} />
          </button>

          {/* Desktop nav links */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: isActive ? 700 : 500,
                    padding: "8px 14px", borderRadius: "var(--radius-sm)",
                    border: isActive ? "1px solid var(--accent-teal-border)" : "1px solid transparent",
                    backgroundColor: isActive ? "var(--accent-teal-dim)" : "transparent",
                    color: isActive ? "var(--accent-teal)" : "var(--text-muted)",
                    cursor: "pointer", transition: "all var(--transition-fast)",
                    minHeight: 44, whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-default)"; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "transparent"; }}}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Desktop right */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle />
            <ConnectButton />
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="mobile-nav" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <button
              onClick={() => setOpen(v => !v)}
              style={{
                background: "none", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)", cursor: "pointer",
                padding: "8px", color: "var(--text-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 44, minWidth: 44,
                backgroundColor: open ? "var(--bg-elevated)" : "transparent",
              }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 98,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(2px)",
            }}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "min(320px, 85vw)",
            zIndex: 99,
            backgroundColor: "var(--bg-surface)",
            borderLeft: "1px solid var(--border-default)",
            display: "flex", flexDirection: "column",
            boxShadow: "var(--shadow-lg)",
            overflowY: "auto",
          }}>
            {/* Drawer header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-subtle)",
            }}>
              <Logo width={120} height={32} />
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", padding: 8,
                  display: "flex", alignItems: "center",
                  minHeight: 44, minWidth: 44,
                }}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Drawer links */}
            <div style={{ padding: "16px 12px", flex: 1 }}>
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    style={{
                      display: "flex", alignItems: "center", width: "100%",
                      padding: "14px 16px", borderRadius: "var(--radius-md)",
                      border: "none",
                      backgroundColor: isActive ? "var(--accent-teal-dim)" : "transparent",
                      color: isActive ? "var(--accent-teal)" : "var(--text-primary)",
                      fontFamily: "var(--font-display)", fontSize: 16, fontWeight: isActive ? 700 : 500,
                      cursor: "pointer", textAlign: "left",
                      marginBottom: 4, minHeight: 52,
                      transition: "background-color var(--transition-fast)",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-elevated)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Drawer footer — wallet connect */}
            <div style={{
              padding: "16px 20px",
              borderTop: "1px solid var(--border-subtle)",
            }}>
              <ConnectButton />
            </div>
          </div>
        </>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav  { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
