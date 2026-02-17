/**
 * @module app/layout
 * Root layout for the application. Configures fonts, theme provider, and global styles.
 */

import type { Metadata } from "next";
import { Inter, Geist_Mono, Bebas_Neue, Chakra_Petch, Rajdhani, Oswald } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Moonshots & Magic",
    template: "%s — Moonshots & Magic",
  },
  description:
    "Discover the events, people, and places that make Central Florida extraordinary. Culture, tech, entertainment, and community — all in one place.",
  metadataBase: new URL("https://windsurf-project-3-ten.vercel.app"),
  openGraph: {
    title: "Moonshots & Magic | Explore Central Florida's Story",
    description:
      "Discover the events, people, and places that make Central Florida extraordinary. Culture, tech, entertainment, and community — all in one place.",
    url: "https://moonshotsandmagic.com",
    siteName: "Moonshots & Magic",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/homepage.png", width: 1200, height: 630, alt: "Moonshots & Magic | Explore Central Florida's Story" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonshots & Magic | Explore Central Florida's Story",
    description:
      "Discover the events, people, and places that make Central Florida extraordinary. Culture, tech, entertainment, and community — all in one place.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Root layout wrapping all pages with fonts, theme provider, and global styles. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${bebasNeue.variable} ${chakraPetch.variable} ${rajdhani.variable} ${oswald.variable} antialiased`}
      >
        <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
