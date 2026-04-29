import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vicevault.vercel.app"),
  title: "Vice Vault | GTA 6 Leonida Interactive Map & Fan Hub",
  description: "The ultimate GTA 6 companion. Explore the interactive Leonida map, stay updated with Vice City news, create custom memes, and join the elite fan community.",
  keywords: ["GTA 6", "Grand Theft Auto VI", "Leonida", "Vice City", "GTA 6 Map", "GTA 6 News", "Vice Vault", "Leonida Map", "GTA VI interactive map", "Vice City fan community", "Leonida citizen stories"],
  openGraph: {
    title: "Vice Vault | GTA 6 Leonida Interactive Map & Fan Hub",
    description: "The ultimate GTA 6 companion. Explore the interactive Leonida map, stay updated with the latest Vice City news, and join the elite fan community.",
    url: "https://www.vicevault.vercel.app",
    siteName: "Vice Vault",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Vice Vault - GTA 6 Companion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vice Vault | GTA 6 Leonida Interactive Map & Fan Hub",
    description: "The ultimate GTA 6 companion. Explore the interactive Leonida map, stay updated with the latest Vice City news, and join the elite fan community.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "wnwX0v0OGT7E25CuYA6r3_NjExggVU9PFITJXnpMp8U",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex bg-background text-foreground">
        <AppShell>
          {children}
        </AppShell>
        <Analytics />
      </body>
    </html>
  );
}
