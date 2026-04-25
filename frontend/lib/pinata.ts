/**
 * Pinata IPFS upload helper.
 * Uploads bond metadata JSON to IPFS and returns the CID.
 * Uses the Pinata public API — JWT from environment variable.
 */

export interface BondMetadata {
  name: string;
  description: string;
  attributes: Array<{ trait_type: string; value: string }>;
  external_url: string;
}

/**
 * Uploads a JSON object to IPFS via Pinata.
 * Returns the IPFS CID (e.g. "QmXyz...").
 * Falls back to a deterministic placeholder if no JWT is configured.
 */
export async function uploadBondMetadata(metadata: BondMetadata): Promise<string> {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  // No JWT configured — return a placeholder CID for dev/testnet
  if (!jwt) {
    console.warn("PINATA_JWT not set — using placeholder IPFS hash");
    return `ipfs://QmPlaceholder_${Date.now()}`;
  }

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: { name: metadata.name },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Pinata upload failed: ${err}`);
  }

  const data = await response.json() as { IpfsHash: string };
  return `ipfs://${data.IpfsHash}`;
}

/**
 * Builds the bond metadata object from form values.
 */
export function buildBondMetadata({
  skillTitle,
  successCriteria,
  mentorAddress,
  learnerAddress,
  deadline,
  bondId,
}: {
  skillTitle: string;
  successCriteria: string;
  mentorAddress: string;
  learnerAddress: string;
  deadline: string;
  bondId?: string;
}): BondMetadata {
  return {
    name: `CoSigned: ${skillTitle}`,
    description: `Dual-signature proof of mentorship on CoSigned. Skill: ${skillTitle}. Success criteria: ${successCriteria}`,
    external_url: bondId ? `https://cosigned.xyz/bond/${bondId}` : "https://cosigned.xyz",
    attributes: [
      { trait_type: "Mentor",    value: mentorAddress },
      { trait_type: "Learner",   value: learnerAddress },
      { trait_type: "Skill",     value: skillTitle },
      { trait_type: "Deadline",  value: deadline },
      { trait_type: "Chain",     value: "Base Sepolia" },
      { trait_type: "Soulbound", value: "true" },
    ],
  };
}
