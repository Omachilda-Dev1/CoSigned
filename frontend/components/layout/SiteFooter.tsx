import Link from "next/link";
import { chain, contracts, explorerUrl, siteConfig } from "@/lib/config";
import { LogoMark } from "@/components/ui/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container flex flex-col gap-6 py-10 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark size={22} />
          <span>{siteConfig.tagline}</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          <Link href="/how-to-use" className="hover:text-fg">
            How it works
          </Link>
          <a href={explorerUrl.address(contracts.cosigned)} target="_blank" rel="noreferrer" className="hover:text-fg">
            Contract
          </a>
          <a href={siteConfig.repo} target="_blank" rel="noreferrer" className="hover:text-fg">
            GitHub
          </a>
          <span className="font-mono text-xs text-fg-subtle">
            {chain.name} · {chain.id}
          </span>
        </nav>
      </div>
    </footer>
  );
}
