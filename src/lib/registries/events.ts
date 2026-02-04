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
 * region, tags, isFree, featured. Results are sorted by start date ascending,
 * then paginated via `offset` and `limit`.
 *
 * @param filters - Optional query constraints. Omit for all events.
 * @returns Filtered and sorted array of events.
 *
 * @example
 * ```ts
 * const freeMusic = getEvents({ category: "music", isFree: true, limit: 5 });
 * ```
 */
export function getEvents(filters?: EventFilters): EventEntry[] {
  let events = registry.events;

  if (!filters) return events;

  if (filters.status) {
    events = events.filter((e) => e.status === filters.status);
  }

  if (filters.query) {
    events = events.filter((e) => matchesQuery(e, filters.query!));
  }

  if (filters.category) {
    const cats = Array.isArray(filters.category)
      ? filters.category
      : [filters.category];
    events = events.filter((e) => cats.includes(e.category));
  }

  if (filters.dateRange) {
    const start = new Date(filters.dateRange.start).getTime();
    const end = new Date(filters.dateRange.end).getTime();
    events = events.filter((e) => {
      const d = new Date(e.startDate).getTime();
      return d >= start && d <= end;
    });
  }

  if (filters.city) {
    const city = filters.city.toLowerCase();
    events = events.filter((e) => e.city.toLowerCase() === city);
  }

  if (filters.region) {
    const region = filters.region.toLowerCase();
    events = events.filter((e) => e.region.toLowerCase() === region);
  }

  if (filters.tags?.length) {
    const tags = filters.tags.map((t) => t.toLowerCase());
    events = events.filter((e) =>
      tags.some((t) => e.tags.some((et) => et.toLowerCase().includes(t))),
    );
  }

  if (filters.isFree !== undefined) {
    events = events.filter((e) =>
      filters.isFree ? e.price?.isFree : !e.price?.isFree,
    );
  }

  if (filters.featured) {
    events = events.filter((e) => e.featured);
  }

  // Sort by start date ascending
  events.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  if (filters.offset) {
    events = events.slice(filters.offset);
  }

  if (filters.limit) {
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
 *
 * @param sw - Southwest corner as `[longitude, latitude]`.
 * @param ne - Northeast corner as `[longitude, latitude]`.
 * @returns Events within the bounding box.
 */
export function getEventsByBounds(
  sw: [number, number],
  ne: [number, number],
): EventEntry[] {
  return registry.events.filter((e) => {
    const [lng, lat] = e.coordinates;
    return lng >= sw[0] && lng <= ne[0] && lat >= sw[1] && lat <= ne[1];
  });
}

/**
 * Return all events matching a specific category.
 *
 * @param category - The category to filter by.
 * @returns Matching events (unordered).
 */
export function getEventsByCategory(category: EventCategory): EventEntry[] {
  return registry.events.filter((e) => e.category === category);
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
 *
 * @param query - Search string (case-insensitive).
 * @returns All matching events.
 */
export function searchEvents(query: string): EventEntry[] {
  return registry.events.filter((e) => matchesQuery(e, query));
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
