/**
 * @module app/map/layout
 * Layout and SEO metadata for the interactive map page.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Map — Moonshots & Magic",
  description:
    "Browse events across Central Florida on an interactive map. Filter by category and date, ask AI what's nearby, or take a cinematic flyover tour of the region.",
  openGraph: {
    title: "Moonshots & Magic — Interactive Map of Central Florida",
    description:
      "Browse events across Central Florida. Filter by category and date, ask AI what's happening near you, or take a cinematic flyover tour of the region.",
    url: "https://moonshotsandmagic.com/map",
    siteName: "Moonshots & Magic",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og/map.png", width: 1200, height: 630, alt: "Moonshots & Magic — Interactive Map of Central Florida" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonshots & Magic — Interactive Map of Central Florida",
    description:
      "Browse events, filter by category and date, ask AI what's happening near you, or take a cinematic flyover tour of Central Florida.",
  },
};

/** Layout wrapper for the map page — passes through children with SEO metadata. */
export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
