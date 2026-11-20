import { baseSepolia } from "wagmi/chains";
import type { Address } from "viem";

/** The single chain CoSigned is deployed to. */
export const chain = baseSepolia;

export const contracts = {
  cosigned: (process.env.NEXT_PUBLIC_COSIGNED_ADDRESS ||
    "0xd1D2a913eb75B43125AA860bea1BabC27F2d550A") as Address,
  nft: (process.env.NEXT_PUBLIC_COSIGNED_NFT_ADDRESS ||
    "0xC6Fce62038C0FD7f50c447a51C05492096554df5") as Address,
} as const;

export const siteConfig = {
  name: "CoSigned",
  tagline: "Your skills. Witnessed on-chain.",
  description:
    "Mentors and learners co-sign skill Bonds on Base. When both sign, each receives a soulbound credential — proof of mentorship neither party can fake alone.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://co-signed.vercel.app").replace(/\/$/, ""),
  repo: "https://github.com/Omachilda-Dev1/CoSigned",
} as const;

/** Smallest stake the UI will suggest. The contract accepts any amount > 0. */
export const MIN_STAKE_ETH = "0.001";
export const DEFAULT_STAKE_ETH = "0.01";

/** Mirrors the hard-coded 7-day window in CoSigned.resolveDispute. */
export const DISPUTE_WINDOW_SECONDS = 7 * 24 * 60 * 60;

const explorer = chain.blockExplorers.default.url;

export const explorerUrl = {
  address: (address: string) => `${explorer}/address/${address}`,
  tx: (hash: string) => `${explorer}/tx/${hash}`,
  token: (tokenId: bigint | string) => `${explorer}/nft/${contracts.nft}/${tokenId.toString()}`,
};

export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";
