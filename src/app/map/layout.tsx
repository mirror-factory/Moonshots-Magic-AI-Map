/**
 * @module app/map/layout
 * Layout and SEO metadata for the interactive map page.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Map — Moonshots & Magic",
  description:
    "An interactive map of Central Florida's events, landmarks, and cultural moments. Filter by category, date, and location. Chat with an AI to find what's happening near you. Take a cinematic flyover tour of the region.",
  openGraph: {
    title: "Moonshots & Magic — Explore Central Florida on the Map",
    description:
      "Browse events across Central Florida — from aerospace conferences to theme park openings. Filter by category and date, search with AI, or take a cinematic flyover tour of the region.",
    url: "https://moonshots-magic-ai-map.vercel.app/map",
    siteName: "Moonshots & Magic",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonshots & Magic — Explore Central Florida on the Map",
    description:
      "Browse events, filter by category and date, chat with AI to find what's happening near you, or take a cinematic flyover tour of the region.",
  },
};

/** Layout wrapper for the map page — passes through children with SEO metadata. */
export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
