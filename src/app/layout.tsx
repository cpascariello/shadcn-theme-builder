import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { WalletProvider } from "@/components/wallet-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://themer.stasho.xyz";
const title = "shadcn Theme Builder — Powered by Aleph Cloud";
const description =
  "Visual shadcn/ui theme editor hosted on Aleph Cloud. Save and sync themes as Aleph aggregate messages with wallet-based authentication. Decentralized hosting, decentralized storage.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(siteUrl),
  keywords: [
    "aleph cloud",
    "aleph.im",
    "aleph aggregate",
    "decentralized hosting",
    "decentralized storage",
    "shadcn",
    "shadcn/ui",
    "theme builder",
    "tailwind css",
    "web3",
    "wallet authentication",
    "oklch",
  ],
  authors: [{ name: "Stasho" }],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "shadcn Theme Builder",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}
      >
        <WalletProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
