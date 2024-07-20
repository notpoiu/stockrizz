import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react"
import DisableIphoneZoomBehaviour from "@/components/disable-iphone-zoom-behaviour";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "stockrizz",
  description: "The stockfish of rizz",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "stockrizz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <DisableIphoneZoomBehaviour />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
