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
  (process.env.NEXT_PUBLIC_COSIGNED_ADDRESS as `0x${string}`) ||
  "0xd1D2a913eb75B43125AA860bea1BabC27F2d550A" as `0x${string}`;

export const COSIGNED_NFT_ADDRESS =
  (process.env.NEXT_PUBLIC_COSIGNED_NFT_ADDRESS as `0x${string}`) ||
  "0xC6Fce62038C0FD7f50c447a51C05492096554df5" as `0x${string}`;

// ── ABIs ─────────────────────────────────────────────────────────────────────

export const COSIGNED_ABI     = CoSignedABI    as const;
export const COSIGNED_NFT_ABI = CoSignedNFTABI as const;

// ── Chain ─────────────────────────────────────────────────────────────────────

export const BASE_SEPOLIA_CHAIN_ID = 84532;
