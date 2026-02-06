import type { NewsletterEntry } from "@/lib/registries/types";

/**
 * Factory for creating test NewsletterEntry objects with sensible defaults.
 * Override any field via the `overrides` parameter.
 */
export function createTestNewsletter(
  overrides: Partial<NewsletterEntry> = {},
): NewsletterEntry {
  return {
    id: "nl-test-001",
    title: "Orlando Weekend Guide",
    summary: "Your guide to the best events this weekend in Orlando.",
    content:
      "# Weekend Guide\n\nDiscover the best events happening this weekend in Orlando and Central Florida.",
    category: "events",
    publishedAt: "2026-02-01T10:00:00Z",
    source: "Orlando Weekly",
    author: "Staff Writer",
    tags: ["events", "weekend", "guide"],
    ...overrides,
  };
}

/**
 * Creates a set of diverse test newsletters covering multiple categories.
 */
export function createTestNewsletterSet(): NewsletterEntry[] {
  return [
    createTestNewsletter({
      id: "nl-001",
      title: "Orlando Weekend Guide",
      category: "events",
      publishedAt: "2026-02-01T10:00:00Z",
      source: "Orlando Weekly",
      tags: ["events", "weekend"],
    }),
    createTestNewsletter({
      id: "nl-002",
      title: "Best New Restaurants in Orlando",
      category: "food",
      publishedAt: "2026-01-28T10:00:00Z",
      source: "Orlando Eater",
      tags: ["food", "restaurants"],
    }),
    createTestNewsletter({
      id: "nl-003",
      title: "Tech Scene Update",
      category: "tech",
      publishedAt: "2026-01-25T10:00:00Z",
      source: "Orlando Tech Weekly",
      tags: ["tech", "startups"],
    }),
  ];
}
