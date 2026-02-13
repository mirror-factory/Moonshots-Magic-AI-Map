/**
 * @module registries/types
 * Shared type definitions for the event and newsletter registry system.
 * All registry data conforms to these schemas; used across the data layer,
 * API routes, agent tools, and UI components.
 */

/**
 * All supported event categories. Used as the source of truth for
 * category filtering, map colors, and UI labels.
 *
 * @example
 * ```ts
 * import { EVENT_CATEGORIES } from "@/lib/registries/types";
 * EVENT_CATEGORIES.forEach(cat => console.log(cat));
 * ```
 */
export const EVENT_CATEGORIES = [
  "music",
  "arts",
  "sports",
  "food",
  "tech",
  "community",
  "family",
  "nightlife",
  "outdoor",
  "education",
  "festival",
  "market",
  "other",
] as const;

/** Union of valid event category strings, derived from {@link EVENT_CATEGORIES}. */
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

/** All supported newsletter categories. */
export const NEWSLETTER_CATEGORIES = [
  "events",
  "news",
  "culture",
  "food",
  "tech",
  "community",
  "arts",
  "outdoor",
  "nightlife",
] as const;

/** Union of valid newsletter category strings, derived from {@link NEWSLETTER_CATEGORIES}. */
export type NewsletterCategory = (typeof NEWSLETTER_CATEGORIES)[number];

/**
 * Discriminated union describing how an event was ingested.
 * The `type` field determines which additional metadata is available.
 */
export type EventSource =
  | { type: "manual"; addedBy: string }
  | { type: "ticketmaster"; fetchedAt: string }
  | { type: "eventbrite"; fetchedAt: string }
  | { type: "overpass"; fetchedAt: string }
  | { type: "scraper"; site: string; fetchedAt: string }
  | { type: "predicthq"; fetchedAt: string }
  | { type: "serpapi"; fetchedAt: string };

/**
 * A single event in the registry.
 *
 * @example
 * ```ts
 * const event: EventEntry = {
 *   id: "evt-001",
 *   title: "Jazz in the Park",
 *   description: "Live jazz every Friday",
 *   category: "music",
 *   coordinates: [-81.3730, 28.5431],
 *   venue: "Lake Eola Amphitheater",
 *   address: "512 E Washington St",
 *   city: "Orlando",
 *   region: "Central Florida",
 *   startDate: "2025-06-20T19:00:00Z",
 *   timezone: "America/New_York",
 *   tags: ["jazz", "live-music", "outdoor"],
 *   source: { type: "manual", addedBy: "admin" },
 *   createdAt: "2025-05-01T00:00:00Z",
 *   updatedAt: "2025-05-01T00:00:00Z",
 *   status: "active",
 * };
 * ```
 */
export interface EventEntry {
  /** Unique event identifier (UUID). */
  id: string;
  /** Human-readable event title. */
  title: string;
  /** Full event description. */
  description: string;
  /** Primary category for filtering and color-coding. */
  category: EventCategory;
  /** Optional subcategory for finer classification. */
  subcategory?: string;
  /** Geographic position as `[longitude, latitude]`. */
  coordinates: [number, number];
  /** Venue or location name. */
  venue: string;
  /** Street address. */
  address: string;
  /** City name. */
  city: string;
  /** Broader region (e.g. "Central Florida"). */
  region: string;
  /** Event start date/time in ISO 8601 format. */
  startDate: string;
  /** Optional end date/time in ISO 8601 format. */
  endDate?: string;
  /** Whether the event spans the full day. */
  allDay?: boolean;
  /** Recurrence rule, if the event repeats. */
  recurring?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval?: number;
    endDate?: string;
  };
  /** IANA timezone identifier. */
  timezone: string;
  /** Pricing information. */
  price?: {
    /** Minimum ticket price. */
    min: number;
    /** Maximum ticket price. */
    max: number;
    /** ISO 4217 currency code. */
    currency: string;
    /** Whether the event is free to attend. */
    isFree: boolean;
  };
  /** External URL for tickets or more info. */
  url?: string;
  /** URL of the event's hero image. */
  imageUrl?: string;
  /** Searchable tags for discovery. */
  tags: string[];
  /** How this event was ingested into the registry. */
  source: EventSource;
  /** Identifier in the originating source system. */
  sourceId?: string;
  /** ISO 8601 timestamp when the record was created. */
  createdAt: string;
  /** ISO 8601 timestamp when the record was last updated. */
  updatedAt: string;
  /** ISO 8601 timestamp after which the event should be hidden. */
  expiresAt?: string;
  /** Current lifecycle status. */
  status: "active" | "cancelled" | "postponed" | "past";
  /** Whether this event is editorially featured. */
  featured?: boolean;
}

/** Top-level shape of the `events.json` data file. */
export interface EventRegistry {
  /** Schema version. */
  version: "1.0.0";
  /** ISO 8601 timestamp of the last data sync. */
  lastSynced: string;
  /** Aggregate statistics. */
  metadata: {
    totalEvents: number;
    activeEvents: number;
    categories: Partial<Record<EventCategory, number>>;
    regions: string[];
  };
  /** All event entries. */
  events: EventEntry[];
}

/** A single newsletter article or post. */
export interface NewsletterEntry {
  /** Unique newsletter identifier (UUID). */
  id: string;
  /** Article title. */
  title: string;
  /** Short plain-text summary. */
  summary: string;
  /** Full article content in Markdown format. */
  content: string;
  /** Content category. */
  category: NewsletterCategory;
  /** Optional geographic coordinates if location-specific. */
  coordinates?: [number, number];
  /** Optional venue name. */
  venue?: string;
  /** Optional street address. */
  address?: string;
  /** ISO 8601 publication timestamp. */
  publishedAt: string;
  /** Optional ISO 8601 date of the related event. */
  eventDate?: string;
  /** Name of the publishing source. */
  source: string;
  /** Author name. */
  author?: string;
  /** Link to the original article. */
  url?: string;
  /** URL of the article's hero image. */
  imageUrl?: string;
  /** Searchable tags. */
  tags: string[];
}

/** Top-level shape of the `newsletters.json` data file. */
export interface NewsletterRegistry {
  /** Schema version. */
  version: "1.0.0";
  /** ISO 8601 timestamp of the last update. */
  lastUpdated: string;
  /** Aggregate statistics. */
  metadata: {
    totalEntries: number;
    sources: string[];
  };
  /** All newsletter entries. */
  entries: NewsletterEntry[];
}

/**
 * Query parameters accepted by `getEvents()` in `events.ts`.
 * All fields are optional; omitted fields impose no constraint.
 */
export interface EventFilters {
  /** Free-text search across title, description, tags, and venue. */
  query?: string;
  /** Single category or array of categories to include. */
  category?: EventCategory | EventCategory[];
  /** ISO 8601 date range (inclusive). */
  dateRange?: { start: string; end: string };
  /** City name (case-insensitive match). */
  city?: string;
  /** Region name (case-insensitive match). */
  region?: string;
  /** Tags to match (case-insensitive, any-match). */
  tags?: string[];
  /** Filter by lifecycle status. */
  status?: EventEntry["status"];
  /** If `true`, only free events; if `false`, only paid events. */
  isFree?: boolean;
  /** If `true`, only featured events. */
  featured?: boolean;
  /** Maximum number of results to return. */
  limit?: number;
  /** Number of results to skip (for pagination). */
  offset?: number;
}

/**
 * Query parameters accepted by `getNewsletters()` in `newsletters.ts`.
 * All fields are optional; omitted fields impose no constraint.
 */
export interface NewsletterFilters {
  /** Free-text search across title, summary, content, and tags. */
  query?: string;
  /** Newsletter category to filter by. */
  category?: NewsletterCategory;
  /** ISO 8601 date range (inclusive). */
  dateRange?: { start: string; end: string };
  /** Source name (case-insensitive substring match). */
  source?: string;
  /** Tags to match (case-insensitive, any-match). */
  tags?: string[];
  /** Maximum number of results to return. */
  limit?: number;
}
