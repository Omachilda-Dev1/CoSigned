"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Syne, DM_Mono } from "next/font/google";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300","400","500"], variable: "--font-dm-mono", display: "swap" });
const queryClient = new QueryClient();

// Pages that manage their own nav
const CUSTOM_NAV_PAGES = ["/profile"];

function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Use shared Navbar on all pages except those with custom navs
  const useSharedNav = !CUSTOM_NAV_PAGES.some(p => pathname.startsWith(p));

  return (
    <div key={pathname} className="page-enter">
      {useSharedNav && <Navbar />}
      {children}
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${dmMono.variable} antialiased`}>
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
      </body>
    </html>
  );
}
