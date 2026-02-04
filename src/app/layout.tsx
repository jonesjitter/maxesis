import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAXESIS | Creator & Gamer",
  description: "Welcome to the official MAXESIS hub. Content creator, gamer, and digital pioneer.",
  keywords: ["maxesis", "gaming", "content creator", "twitch", "tiktok"],
  openGraph: {
    title: "MAXESIS | Creator & Gamer",
    description: "Welcome to the official MAXESIS hub",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a]`}
      >
        <Providers>
          <Navigation />
          <div className="md:pt-20 pb-24 md:pb-0">
            {children}
          </div>
          <div className="crt-overlay" />
        </Providers>
      </body>
    </html>
  );
}
