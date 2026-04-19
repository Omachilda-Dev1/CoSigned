/**
 * Contract addresses and ABIs for CoSigned.
 * Addresses are populated after Day 14 testnet deploy.
 * ABIs are copied from artifacts/ via scripts/copy-abis.js
 */

import CoSignedABI    from "./abi/CoSigned.json";
import CoSignedNFTABI from "./abi/CoSignedNFT.json";

// ── Addresses ────────────────────────────────────────────────────────────────
// Populated from environment variables after testnet deploy (Day 14)

export const COSIGNED_ADDRESS =
  (process.env.NEXT_PUBLIC_COSIGNED_ADDRESS as `0x${string}`) || ("" as `0x${string}`);

export const COSIGNED_NFT_ADDRESS =
  (process.env.NEXT_PUBLIC_COSIGNED_NFT_ADDRESS as `0x${string}`) || ("" as `0x${string}`);

// ── ABIs ─────────────────────────────────────────────────────────────────────

export const COSIGNED_ABI     = CoSignedABI    as const;
export const COSIGNED_NFT_ABI = CoSignedNFTABI as const;

// ── Chain ─────────────────────────────────────────────────────────────────────

export const BASE_SEPOLIA_CHAIN_ID = 84532;
