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
    "The story of Central Florida — a region that sent humans to the Moon and built worlds of magic. Born from impossible ambitions, shaped by extraordinary talent, and home to the boldest ideas on Earth.",
  metadataBase: new URL("https://moonshotsandmagic.com"),
  openGraph: {
    title: "Moonshots & Magic — Where Ambition Meets Wonder",
    description:
      "The story of Central Florida. From the Saturn V to Spaceship Earth — a region built on moonshots and magic, and the people who made it all possible.",
    url: "https://moonshotsandmagic.com",
    siteName: "Moonshots & Magic",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/homepage.png", width: 1200, height: 630, alt: "Moonshots & Magic — Where Ambition Meets Wonder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonshots & Magic — Where Ambition Meets Wonder",
    description:
      "The story of Central Florida. A region built on moonshots and magic — explore the events, people, and places that define one of America's most extraordinary places.",
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
