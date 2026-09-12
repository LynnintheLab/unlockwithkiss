import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL(process.env.SITE_URL || "https://loveu.lynninthelab.space");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "For AThel",
    title: "For AThel — A little corner, just for you",
    description: "Even on the quiet days, it’s still you. Little moments, saved with love.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "For AThel — A little corner, just for you",
    description: "Even on the quiet days, it’s still you. Little moments, saved with love.",
    images: [{ url: "/opengraph-image", alt: "For AThel. Even on the quiet days, it’s still you." }],
  },
  title: "For AThel — Our little corner",
  description: "Little moments, saved just for you.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
