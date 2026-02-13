/**
 * @module sync-events/utils/dedup
 * Priority-based deduplication for merged event lists.
 */

import type { EventEntry } from "../../../src/lib/registries/types";

/** Source priority: lower number wins. Ticketmaster is most authoritative. */
const SOURCE_PRIORITY: Record<string, number> = {
  ticketmaster: 1,
  eventbrite: 2,
  serpapi: 3,
  scraper: 4,
  overpass: 5,
  predicthq: 6,
};

/** Get the priority of an event source (lower = higher priority). */
function getSourcePriority(event: EventEntry): number {
  return SOURCE_PRIORITY[event.source.type] ?? 99;
}

/**
 * Ticket-package suffixes that Ticketmaster appends to the same base event.
 * Stripped during normalization to collapse "Event Name Suite Admission"
 * and "Event Name Boardwalk Club" into the same dedup key.
 */
const PACKAGE_SUFFIXES = [
  /\b(?:suite|lounge|club|vip|box|balcony|terrace|skybox|loge|mezzanine|platinum|gold|silver|bronze|premium|presale|general)\s*(?:admission|adm|access|seating|seats|ticket|tickets|pass|passes|entry|worker|row|section)?\s*$/i,
  /\b(?:presidents?\s*row|boardwalk\s*club|daytona\s*500\s*club|rolex\s*lounge)\s*(?:adm|admission|access)?\s*$/i,
  /\b(?:harl?ey\s*j.?s?\s*suite)\s*$/i,
];

/**
 * Normalize a string for dedup comparison.
 * Lowercases, strips non-alphanumeric chars, strips ticket package
 * suffixes, normalizes team-name order for "vs" matchups, and collapses whitespace.
 */
function normalizeForDedup(str: string): string {
  let s = str.toLowerCase();

  // Strip year prefixes like "2026 noaps" → "noaps"
  s = s.replace(/^\d{4}\s+/, "");

  // Strip package suffixes
  for (const re of PACKAGE_SUFFIXES) {
    s = s.replace(re, "");
  }

  // Normalize "Team A vs Team B" ↔ "Team B vs Team A"
  const vsMatch = s.match(/^(.+?)\s+(?:vs\.?|versus)\s+(.+)$/i);
  if (vsMatch) {
    const teams = [vsMatch[1].trim(), vsMatch[2].trim()].sort();
    s = teams.join(" vs ");
  }

  return s
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract YYYY-MM-DD from an ISO 8601 date string. */
function extractDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}

/**
 * Build a dedup key from title, venue, and start date.
 * @param event - Event entry to key.
 * @returns Normalized dedup key string.
 */
export function buildDedupKey(event: EventEntry): string {
  const title = normalizeForDedup(event.title);
  const venue = normalizeForDedup(event.venue);
  const date = extractDate(event.startDate);
  return `${title}|${venue}|${date}`;
}

/**
 * Deduplicate events by title+venue+date, keeping the highest-priority source.
 * Events are first sorted by source priority so the best source wins.
 * @param events - All fetched events (from multiple sources).
 * @returns Deduplicated event list.
 */
export function deduplicateEvents(events: EventEntry[]): EventEntry[] {
  const sorted = [...events].sort(
    (a, b) => getSourcePriority(a) - getSourcePriority(b),
  );

  const seen = new Map<string, EventEntry>();
  const seenIds = new Set<string>();

  for (const event of sorted) {
    if (seenIds.has(event.id)) continue;

    const key = buildDedupKey(event);
    if (seen.has(key)) continue;

    seen.set(key, event);
    seenIds.add(event.id);
  }

  return Array.from(seen.values());
}
