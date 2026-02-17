/**
 * @module app/brand-guide/layout
 * Layout and SEO metadata for the brand guide page.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Guide — Moonshots & Magic",
  description:
    "Explore the colors, typography, and visual identity behind Moonshots & Magic — a platform celebrating Central Florida's culture, events, and community.",
  openGraph: {
    title: "Moonshots & Magic — Visual Identity & Brand Guide",
    description:
      "Explore the colors, typography, and visual identity behind Moonshots & Magic — a platform celebrating Central Florida's culture, events, and community.",
    url: "https://moonshotsandmagic.com/brand-guide",
    siteName: "Moonshots & Magic",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/brand-guide.png", width: 1200, height: 630, alt: "Moonshots & Magic — Visual Identity & Brand Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonshots & Magic — Visual Identity & Brand Guide",
    description:
      "Explore the colors, typography, and visual identity behind Moonshots & Magic — a platform celebrating Central Florida's culture and community.",
  },
};

/** Layout wrapper for the brand guide page — passes through children with SEO metadata. */
export default function BrandGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
