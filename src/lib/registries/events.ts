/**
 * @module registries/events
 * Query functions for the event registry. All reads are from the static
 * `events.json` data file loaded at build time. Results are filtered,
 * sorted, and paginated in-memory.
 */

import type { EventEntry, EventFilters, EventCategory, EventRegistry } from "./types";
import eventsData from "@/data/events.json";

const registry = eventsData as EventRegistry;

/** Case-insensitive full-text match across key event fields. */
function matchesQuery(event: EventEntry, query: string): boolean {
  const q = query.toLowerCase();
  return (
    event.title.toLowerCase().includes(q) ||
    event.description.toLowerCase().includes(q) ||
    event.tags.some((t) => t.toLowerCase().includes(q)) ||
    event.venue.toLowerCase().includes(q) ||
    event.city.toLowerCase().includes(q)
  );
}

/**
 * Query the event registry with optional filters.
 * Applies filters in order: status, query, category, dateRange, city,
 * region, tags, featured. Results are sorted by start date ascending,
 * then paginated via `offset` and `limit`.
 *
 * **IMPORTANT**: By default, only active future events are returned.
 * Past events (events where endDate or startDate is before now) are excluded.
 *
 * @param filters - Optional query constraints. Omit for all events.
 * @returns Filtered and sorted array of events.
 *
 * @example
 * ```ts
 * const freeMusic = getEvents({ category: "music", limit: 5 });
 * ```
 */
export function getEvents(filters?: EventFilters): EventEntry[] {
  let events = registry.events;

  // Filter out past events by default (unless explicitly requesting past events)
  const now = new Date().getTime();
  if (!filters?.status || filters.status !== "past") {
    events = events.filter((e) => {
      // Use endDate if available, otherwise use startDate
      const eventDate = new Date(e.endDate || e.startDate).getTime();
      return eventDate >= now && e.status !== "past";
    });
  }

  // Apply additional filters if provided
  if (filters?.status) {
    events = events.filter((e) => e.status === filters.status);
  }

  if (filters?.query) {
    events = events.filter((e) => matchesQuery(e, filters.query!));
  }

  if (filters?.category) {
    const cats = Array.isArray(filters.category)
      ? filters.category
      : [filters.category];
    events = events.filter((e) => cats.includes(e.category));
  }

  if (filters?.dateRange) {
    const start = new Date(filters.dateRange.start).getTime();
    const end = new Date(filters.dateRange.end).getTime();
    events = events.filter((e) => {
      const d = new Date(e.startDate).getTime();
      return d >= start && d <= end;
    });
  }

  if (filters?.city) {
    const city = filters.city.toLowerCase();
    events = events.filter((e) => e.city.toLowerCase() === city);
  }

  if (filters?.region) {
    const region = filters.region.toLowerCase();
    events = events.filter((e) => e.region.toLowerCase() === region);
  }

  if (filters?.tags?.length) {
    const tags = filters.tags.map((t) => t.toLowerCase());
    events = events.filter((e) =>
      tags.some((t) => e.tags.some((et) => et.toLowerCase().includes(t))),
    );
  }

  if (filters?.featured) {
    events = events.filter((e) => e.featured);
  }

  // Sort by start date ascending
  events.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  // Deduplicate recurring events — keep only the next upcoming occurrence per title
  const seen = new Set<string>();
  events = events.filter((e) => {
    const key = e.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (filters?.offset) {
    events = events.slice(filters.offset);
  }

  if (filters?.limit) {
    events = events.slice(0, filters.limit);
  }

  return events;
}

/**
 * Look up a single event by its UUID.
 *
 * @param id - The event UUID.
 * @returns The matching event, or `undefined` if not found.
 */
export function getEventById(id: string): EventEntry | undefined {
  return registry.events.find((e) => e.id === id);
}

/**
 * Return all events whose coordinates fall within a geographic bounding box.
 * Only returns active future events (excludes past events by default).
 *
 * @param sw - Southwest corner as `[longitude, latitude]`.
 * @param ne - Northeast corner as `[longitude, latitude]`.
 * @returns Future events within the bounding box.
 */
export function getEventsByBounds(
  sw: [number, number],
  ne: [number, number],
): EventEntry[] {
  const now = new Date().getTime();
  return registry.events.filter((e) => {
    const [lng, lat] = e.coordinates;
    const eventDate = new Date(e.endDate || e.startDate).getTime();
    return (
      lng >= sw[0] &&
      lng <= ne[0] &&
      lat >= sw[1] &&
      lat <= ne[1] &&
      eventDate >= now &&
      e.status !== "past"
    );
  });
}

/**
 * Return all events matching a specific category.
 * Only returns active future events (excludes past events by default).
 *
 * @param category - The category to filter by.
 * @returns Matching future events (unordered).
 */
export function getEventsByCategory(category: EventCategory): EventEntry[] {
  const now = new Date().getTime();
  return registry.events.filter((e) => {
    const eventDate = new Date(e.endDate || e.startDate).getTime();
    return e.category === category && eventDate >= now && e.status !== "past";
  });
}

/**
 * Return active events starting on or after the current time,
 * sorted by start date ascending.
 *
 * @param limit - Maximum number of results (default 10).
 * @returns Upcoming events sorted soonest-first.
 */
export function getUpcomingEvents(limit = 10): EventEntry[] {
  const now = new Date().getTime();
  return registry.events
    .filter((e) => e.status === "active" && new Date(e.startDate).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, limit);
}

/**
 * Free-text search across event titles, descriptions, tags, venues, and cities.
 * Only returns active future events (excludes past events by default).
 *
 * @param query - Search string (case-insensitive).
 * @returns All matching future events.
 */
export function searchEvents(query: string): EventEntry[] {
  const now = new Date().getTime();
  return registry.events.filter((e) => {
    // Filter out past events
    const eventDate = new Date(e.endDate || e.startDate).getTime();
    return eventDate >= now && e.status !== "past" && matchesQuery(e, query);
  });
}

/**
 * Aggregate event counts per category, sorted by count descending.
 *
 * @returns Array of `{ category, count }` objects.
 */
export function getEventCategories(): { category: EventCategory; count: number }[] {
  const counts = new Map<EventCategory, number>();
  for (const event of registry.events) {
    counts.set(event.category, (counts.get(event.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Return every event in the registry without filtering.
 *
 * @returns All events.
 */
export function getAllEvents(): EventEntry[] {
  return registry.events;
}

/** Aggregate source statistics for the Event Sources info panel. */
export interface SourceStats {
  /** Human-readable label for the source. */
  label: string;
  /** Number of events from this source. */
  count: number;
  /** Source type key. */
  type: string;
}

/** Human-readable labels for each source type. */
const SOURCE_LABELS: Record<string, string> = {
  manual: "Seed / Manual",
  ticketmaster: "Ticketmaster",
  eventbrite: "Eventbrite",
  serpapi: "SerpApi (Google Events)",
  scraper: "Web Scrapers",
  overpass: "Overpass API",
  predicthq: "PredictHQ",
};

/**
 * Compute event counts grouped by source type, plus registry metadata.
 *
 * @returns Object with source breakdown, total count, and last sync timestamp.
 */
export function getEventSourceStats(): {
  sources: SourceStats[];
  total: number;
  lastSynced: string;
} {
  const counts = new Map<string, number>();
  for (const event of registry.events) {
    const type = event.source.type;
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  const sources = Array.from(counts.entries())
    .map(([type, count]) => ({
      label: SOURCE_LABELS[type] ?? type,
      count,
      type,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    sources,
    total: registry.events.length,
    lastSynced: registry.lastSynced,
  };
}
