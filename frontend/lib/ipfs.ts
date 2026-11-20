import type { BondMetadata } from "@/types/bond";
import { IPFS_GATEWAY, siteConfig } from "@/lib/config";

/** Strips an `ipfs://` prefix. Returns null for empty or placeholder hashes. */
export function cidOf(ipfsHash: string): string | null {
  const cid = ipfsHash.replace(/^ipfs:\/\//, "").trim();
  if (!cid || cid.startsWith("QmPlaceholder")) return null;
  return cid;
}

export function gatewayUrl(ipfsHash: string): string | null {
  const cid = cidOf(ipfsHash);
  return cid ? `${IPFS_GATEWAY}${cid}` : null;
}

export function buildBondMetadata(input: {
  skillTitle: string;
  successCriteria: string;
  mentor: string;
  learner: string;
  deadline: string;
  mentorName?: string;
  learnerName?: string;
}): BondMetadata {
  return {
    name: `CoSigned: ${input.skillTitle}`,
    description: `Dual-signature proof of mentorship on CoSigned. Success criteria: ${input.successCriteria}`,
    external_url: siteConfig.url,
    attributes: [
      { trait_type: "Skill", value: input.skillTitle },
      { trait_type: "Mentor", value: input.mentor },
      { trait_type: "Learner", value: input.learner },
      { trait_type: "Deadline", value: input.deadline },
      { trait_type: "Chain", value: "Base Sepolia" },
      { trait_type: "Soulbound", value: "true" },
    ],
    properties: {
      mentorName: input.mentorName?.trim() || undefined,
      learnerName: input.learnerName?.trim() || undefined,
    },
  };
}

/**
 * Pins metadata via the server route (the Pinata JWT never reaches the browser).
 * Resolves to `ipfs://<cid>`, or "" when pinning isn't configured — the
 * contract accepts an empty hash, and the bond still works without metadata.
 */
export async function pinBondMetadata(metadata: BondMetadata): Promise<string> {
  const res = await fetch("/api/ipfs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metadata),
  });

  if (res.status === 501) return "";
  if (!res.ok) {
    const { error } = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(error || "Failed to upload metadata to IPFS.");
  }
  const { cid } = (await res.json()) as { cid: string };
  return `ipfs://${cid}`;
}
