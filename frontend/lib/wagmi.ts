import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { chain, siteConfig } from "@/lib/config";

export const wagmiConfig = getDefaultConfig({
  appName: siteConfig.name,
  appDescription: siteConfig.description,
  appUrl: siteConfig.url,
  // WalletConnect requires a project ID; injected wallets work without one.
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "cosigned-dev",
  chains: [chain],
  transports: {
    [chain.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || undefined),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
