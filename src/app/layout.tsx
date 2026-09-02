import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
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
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
