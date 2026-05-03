"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";
import Navbar from "@/components/ui/Navbar";

const queryClient = new QueryClient();
const CUSTOM_NAV_PAGES = ["/profile", "/bond"];

function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const useSharedNav = !CUSTOM_NAV_PAGES.some(p => pathname.startsWith(p));
  return (
    <div key={pathname} className="page-enter">
      {useSharedNav && <Navbar />}
      {children}
    </div>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#4DFFD2",
            accentColorForeground: "#0A0A0F",
            borderRadius: "medium",
            fontStack: "system",
          })}
        >
          <PageWrapper>{children}</PageWrapper>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
