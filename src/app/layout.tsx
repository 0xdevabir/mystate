import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyState — Beautiful GitHub Stats for Your Profile",
  description:
    "Create stunning GitHub stats cards for your profile README. Pick a template, copy one line of code, and showcase your developer journey.",
  metadataBase: new URL("https://mystate.devabir.me"),
  openGraph: {
    title: "MyState — Beautiful GitHub Stats",
    description: "Create stunning GitHub stats cards for your profile README.",
    url: "https://mystate.devabir.me",
    siteName: "MyState",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
