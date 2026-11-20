import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Pins bond metadata JSON to IPFS via Pinata.
 * Runs server-side so the Pinata JWT is never shipped to the browser.
 */

const MAX_BYTES = 8 * 1024;

const metadataSchema = z
  .object({
    name: z.string().min(1).max(160),
    description: z.string().max(1200),
    external_url: z.string().url().max(200),
    attributes: z
      .array(z.object({ trait_type: z.string().max(40), value: z.string().max(200) }))
      .max(12),
    properties: z
      .object({
        mentorName: z.string().max(60).optional(),
        learnerName: z.string().max(60).optional(),
      })
      .optional(),
  })
  .strict();

export async function POST(request: Request) {
  // NEXT_PUBLIC_PINATA_JWT is read only as a legacy fallback; prefer PINATA_JWT.
  const jwt = process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt) {
    return NextResponse.json({ error: "IPFS pinning is not configured." }, { status: 501 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ error: "Metadata too large." }, { status: 413 });
  }

  let parsed;
  try {
    parsed = metadataSchema.safeParse(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid metadata." }, { status: 400 });
  }

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      pinataContent: parsed.data,
      pinataMetadata: { name: parsed.data.name },
    }),
  });

  if (!res.ok) {
    console.error("Pinata upload failed", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Failed to pin metadata to IPFS." }, { status: 502 });
  }

  const { IpfsHash } = (await res.json()) as { IpfsHash: string };
  return NextResponse.json({ cid: IpfsHash });
}
