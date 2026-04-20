"use client";

/**
 * NFTReveal — wraps CertificateCard with the completed animation.
 * Used on the Bond Detail page when status transitions to Completed.
 */
import CertificateCard, { type CertificateCardProps } from "./CertificateCard";

type NFTRevealProps = Omit<CertificateCardProps, "status" | "animated">;

export default function NFTReveal(props: NFTRevealProps) {
  return (
    <CertificateCard
      {...props}
      status="completed"
      animated={true}
    />
  );
}
