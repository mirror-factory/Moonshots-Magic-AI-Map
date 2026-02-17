/**
 * @module app/brand-guide/layout
 * Layout and SEO metadata for the brand guide page.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Guide — Moonshots & Magic",
  description:
    "The visual identity of Moonshots & Magic — colors, typography, animations, and design language inspired by Central Florida's legacy of moonshots and magic.",
  openGraph: {
    title: "Moonshots & Magic — Brand Guide",
    description:
      "Colors, typography, animations, and visual identity for the Moonshots & Magic platform. Inspired by Central Florida's legacy of space exploration and theme park wonder.",
    url: "https://moonshotsandmagic.com/brand-guide",
    siteName: "Moonshots & Magic",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/brand-guide.png", width: 1200, height: 630, alt: "Moonshots & Magic — Brand Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonshots & Magic — Brand Guide",
    description:
      "The visual identity of Moonshots & Magic. Colors, typography, and animations inspired by Central Florida's moonshots and magic.",
  },
};

/** Layout wrapper for the brand guide page — passes through children with SEO metadata. */
export default function BrandGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
