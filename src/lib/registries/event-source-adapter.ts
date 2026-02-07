/**
 * @module lib/registries/event-source-adapter
 * Adapter pattern for multi-source event data. Provides a StaticAdapter
 * (always available, wraps getEvents) and an EventbriteAdapter (available
 * when EVENTBRITE_API_KEY is set). CompositeEventSource merges all
 * available adapters and deduplicates results.
 */

import type { EventEntry, EventFilters } from "./types";
import { getEvents } from "./events";

/** Interface for event data sources. */
export interface EventSourceAdapter {
  /** Human-readable source name. */
  name: string;
  /** Whether this adapter is currently available (e.g. API key present). */
  isAvailable(): boolean;
  /** Fetch events with optional filters. */
  fetchEvents(filters?: EventFilters): Promise<EventEntry[]>;
}

/** Adapter wrapping the static events.json data. Always available. */
export class StaticAdapter implements EventSourceAdapter {
  /** @inheritdoc */
  readonly name = "static";

  /** Static data is always available. */
  isAvailable(): boolean {
    return true;
  }

  /** Fetch events from the static JSON registry. */
  async fetchEvents(filters?: EventFilters): Promise<EventEntry[]> {
    return getEvents(filters);
  }
}

/** Adapter wrapping the Eventbrite API. Available when env var is set. */
export class EventbriteAdapter implements EventSourceAdapter {
  /** @inheritdoc */
  readonly name = "eventbrite";

  /** Check if the Eventbrite API key is configured. */
  isAvailable(): boolean {
    return !!process.env.EVENTBRITE_API_KEY;
  }

  /** Fetch events from the Eventbrite search endpoint. */
  async fetchEvents(filters?: EventFilters): Promise<EventEntry[]> {
    if (!this.isAvailable()) return [];

    try {
      const params = new URLSearchParams();
      if (filters?.query) params.set("q", filters.query);
      if (filters?.category) {
        const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
        params.set("categories", cats.join(","));
      }

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/eventbrite/search?${params}`, {
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) return [];
      const data = (await res.json()) as { events?: EventEntry[] };
      return data.events ?? [];
    } catch {
      return [];
    }
  }
}

/**
 * Composite event source that merges results from all available adapters.
 * Deduplicates events by matching title + venue + date.
 */
export class CompositeEventSource {
  private adapters: EventSourceAdapter[];

  /** Create a composite source from the given adapters. */
  constructor(adapters: EventSourceAdapter[]) {
    this.adapters = adapters;
  }

  /**
   * Fetch events from all available adapters and merge results.
   * @param filters - Optional filters to pass to each adapter.
   * @returns Merged, deduplicated event list.
   */
  async fetchEvents(filters?: EventFilters): Promise<EventEntry[]> {
    const available = this.adapters.filter((a) => a.isAvailable());
    const results = await Promise.allSettled(
      available.map((a) => a.fetchEvents(filters)),
    );

    const allEvents: EventEntry[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allEvents.push(...result.value);
      }
    }

    return deduplicateEvents(allEvents);
  }
}

/** Deduplicate events by ID, falling back to title+venue+date match. */
function deduplicateEvents(events: EventEntry[]): EventEntry[] {
  const seen = new Map<string, EventEntry>();

  for (const event of events) {
    // Primary dedup by ID
    if (seen.has(event.id)) continue;

    // Secondary dedup by title+venue+date
    const key = `${event.title.toLowerCase()}|${event.venue.toLowerCase()}|${event.startDate}`;
    if (!seen.has(key)) {
      seen.set(event.id, event);
      seen.set(key, event);
    }
  }

  // Return unique events (only those keyed by ID)
  const result: EventEntry[] = [];
  const idsSeen = new Set<string>();
  for (const [key, event] of seen) {
    if (key === event.id && !idsSeen.has(event.id)) {
      idsSeen.add(event.id);
      result.push(event);
    }
  }

  return result;
}

/** Default composite source with static + eventbrite adapters. */
export const defaultEventSource = new CompositeEventSource([
  new StaticAdapter(),
  new EventbriteAdapter(),
]);
