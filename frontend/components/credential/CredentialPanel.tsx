"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/Address";
import { Download, LinkedInLogo, XLogo } from "@/components/ui/icons";
import { Certificate, downloadSvgAsPng, type CertificateProps } from "@/components/credential/Certificate";

/** Completed-bond credential with download and share actions. */
export function CredentialPanel(props: Omit<CertificateProps, "state"> & { isParty: boolean }) {
  const { isParty, ...certificate } = props;
  const ref = useRef<SVGSVGElement>(null);
  const [downloading, setDownloading] = useState(false);

  const bondUrl = `${siteConfig.url}/bond/${certificate.bondId ?? ""}`;
  const shareText = `I just earned a CoSigned credential for ${certificate.skillTitle} — co-signed on-chain by my ${
    certificate.variant === "mentor" ? "learner" : "mentor"
  } and minted as a soulbound token on Base.`;

  const slug = certificate.skillTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "credential";

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl shadow-glow">
        <Certificate ref={ref} {...certificate} state="completed" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<Download size={15} />}
          loading={downloading}
          onClick={async () => {
            if (!ref.current) return;
            setDownloading(true);
            try {
              await downloadSvgAsPng(ref.current, `cosigned-${slug}-${certificate.bondId}.png`);
            } finally {
              setDownloading(false);
            }
          }}
        >
          Download PNG
        </Button>
        {isParty && (
          <>
            <a
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[13px] font-medium hover:bg-raised"
              href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(bondUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              <XLogo /> Share
            </a>
            <a
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[13px] font-medium hover:bg-raised"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(bondUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              <LinkedInLogo /> LinkedIn
            </a>
          </>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-fg-subtle">
          Copy link <CopyButton value={bondUrl} label="Copy bond link" />
        </span>
      </div>
    </div>
  );
}
