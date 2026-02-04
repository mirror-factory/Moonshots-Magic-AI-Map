/**
 * @module registries/newsletters
 * Query functions for the newsletter registry. All reads are from the static
 * `newsletters.json` data file loaded at build time. Results are filtered,
 * sorted, and paginated in-memory.
 */

import type { NewsletterEntry, NewsletterFilters, NewsletterRegistry } from "./types";
import newslettersData from "@/data/newsletters.json";

const registry = newslettersData as NewsletterRegistry;

/** Case-insensitive full-text match across key newsletter fields. */
function matchesQuery(entry: NewsletterEntry, query: string): boolean {
  const q = query.toLowerCase();
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.summary.toLowerCase().includes(q) ||
    entry.content.toLowerCase().includes(q) ||
    entry.tags.some((t) => t.toLowerCase().includes(q))
  );
}

/**
 * Query the newsletter registry with optional filters.
 * Applies filters in order: query, category, dateRange, source, tags.
 * Results are sorted by publication date descending (newest first),
 * then limited.
 *
 * @param filters - Optional query constraints. Omit for all entries.
 * @returns Filtered and sorted array of newsletter entries.
 *
 * @example
 * ```ts
 * const techNews = getNewsletters({ category: "tech", limit: 5 });
 * ```
 */
export function getNewsletters(filters?: NewsletterFilters): NewsletterEntry[] {
  let entries = registry.entries;

  if (!filters) return entries;

  if (filters.query) {
    entries = entries.filter((e) => matchesQuery(e, filters.query!));
  }

  if (filters.category) {
    entries = entries.filter((e) => e.category === filters.category);
  }

  if (filters.dateRange) {
    const start = new Date(filters.dateRange.start).getTime();
    const end = new Date(filters.dateRange.end).getTime();
    entries = entries.filter((e) => {
      const d = new Date(e.publishedAt).getTime();
      return d >= start && d <= end;
    });
  }

  if (filters.source) {
    const source = filters.source.toLowerCase();
    entries = entries.filter((e) => e.source.toLowerCase().includes(source));
  }

  if (filters.tags?.length) {
    const tags = filters.tags.map((t) => t.toLowerCase());
    entries = entries.filter((e) =>
      tags.some((t) => e.tags.some((et) => et.toLowerCase().includes(t))),
    );
  }

  // Sort by publishedAt descending (newest first)
  entries.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  if (filters.limit) {
    entries = entries.slice(0, filters.limit);
  }

  return entries;
}

/**
 * Look up a single newsletter entry by its UUID.
 *
 * @param id - The newsletter UUID.
 * @returns The matching entry, or `undefined` if not found.
 */
export function getNewsletterById(id: string): NewsletterEntry | undefined {
  return registry.entries.find((e) => e.id === id);
}

/**
 * Free-text search across newsletter titles, summaries, content, and tags.
 *
 * @param query - Search string (case-insensitive).
 * @returns All matching newsletter entries.
 */
export function searchNewsletters(query: string): NewsletterEntry[] {
  return registry.entries.filter((e) => matchesQuery(e, query));
}

/**
 * Return the most recently published newsletter entries.
 *
 * @param limit - Maximum number of results (default 5).
 * @returns Entries sorted by publication date descending.
 */
export function getRecentNewsletters(limit = 5): NewsletterEntry[] {
  return [...registry.entries]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}
