"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";
import { chain } from "@/lib/config";
import { ThemeProvider, useTheme } from "@/components/ui/ThemeToggle";

function RainbowKit({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const shared = { borderRadius: "medium", fontStack: "system", overlayBlur: "small" } as const;
  return (
    <RainbowKitProvider
      initialChain={chain}
      theme={
        theme === "dark"
          ? darkTheme({ ...shared, accentColor: "#4DFFD2", accentColorForeground: "#04160F" })
          : lightTheme({ ...shared, accentColor: "#007A6A", accentColorForeground: "#FFFFFF" })
      }
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: true } } }),
  );

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKit>{children}</RainbowKit>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
