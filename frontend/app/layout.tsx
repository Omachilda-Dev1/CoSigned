import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoSigned — Your skills. Witnessed on-chain.",
  description:
    "A Web3 DApp where mentors and learners co-sign skill Bonds on-chain. Permanent, verifiable proof that a real mentorship happened.",
  keywords: ["Web3", "mentorship", "NFT", "soulbound", "Base", "blockchain"],
  openGraph: {
    title: "CoSigned",
    description: "Your skills. Witnessed on-chain.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${dmMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
