import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Syne, DM_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const syne   = Syne({ subsets: ["latin"], variable: "--font-syne",    display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300","400","500"], variable: "--font-dm-mono", display: "swap" });

export const metadata: Metadata = {
  title: "CoSigned — Your skills. Witnessed on-chain.",
  description: "A Web3 DApp where mentors and learners co-sign skill Bonds on-chain.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${dmMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
