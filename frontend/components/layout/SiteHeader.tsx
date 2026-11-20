"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Close, Menu } from "@/components/ui/icons";
import { ConnectButton } from "@/components/wallet/ConnectButton";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/how-to-use", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="shrink-0 rounded-md" aria-label="CoSigned home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                isActive(href) ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <ConnectButton />
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg text-fg-muted hover:bg-raised hover:text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <Close size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="h-[calc(100dvh-4rem)] border-t border-line bg-bg md:hidden">
          <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 font-display text-lg font-semibold",
                  isActive(href) ? "bg-raised text-fg" : "text-fg-muted",
                )}
              >
                {label}
              </Link>
            ))}
            <div className="mt-4 border-t border-line pt-5 sm:hidden">
              <ConnectButton block />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
