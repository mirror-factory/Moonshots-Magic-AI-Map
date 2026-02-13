/**
 * @module sync-events/fetchers/eventbrite
 * Fetches events from the Eventbrite Destination Search API (POST).
 * @see https://www.eventbrite.com/platform/api
 */

import type { EventEntry, EventCategory } from "../../../src/lib/registries/types";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const API_URL = "https://www.eventbriteapi.com/v3/destination/search/";
const RATE_LIMIT_MS = 300;

/** Eventbrite category tag → our EventCategory. */
const EB_CATEGORY_MAP: Record<string, EventCategory> = {
  "103": "music",
  "105": "arts",
  "104": "arts",
  "108": "sports",
  "110": "food",
  "102": "tech",
  "113": "community",
  "115": "family",
  "109": "outdoor",
  "107": "education",
  "106": "festival",
  "111": "nightlife",
  "114": "community",
  "112": "community",
  "116": "community",
  "101": "community",
  "199": "other",
};

/** Shape of an event from the destination search response. */
interface EbDestinationEvent {
  id?: string;
  name?: string;
  summary?: string;
  url?: string;
  image_id?: string;
  image?: { url?: string };
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  timezone?: string;
  is_online_event?: boolean;
  is_free?: boolean;
  tags?: Array<{ prefix?: string; tag?: string; display_name?: string }>;
  primary_venue?: {
    name?: string;
    address?: {
      address_1?: string;
      city?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
  };
  primary_venue_id?: string;
  ticket_availability?: {
    minimum_ticket_price?: { major_value?: string; currency?: string };
    maximum_ticket_price?: { major_value?: string; currency?: string };
    is_free?: boolean;
  };
}

/** Destination search response shape. */
interface EbSearchResponse {
  events?: {
    results?: EbDestinationEvent[];
    pagination?: {
      object_count?: number;
      page_size?: number;
      continuation?: string;
      has_more_items?: boolean;
    };
  };
}

/**
 * Infer category from Eventbrite tags.
 * @param tags - Eventbrite tag array.
 * @returns Our EventCategory.
 */
function inferCategory(tags?: EbDestinationEvent["tags"]): EventCategory {
  if (!tags) return "other";
  for (const tag of tags) {
    if (tag.prefix === "EventbriteCategory") {
      const id = tag.tag?.split("/")[1];
      if (id && EB_CATEGORY_MAP[id]) return EB_CATEGORY_MAP[id];
    }
  }
  return "other";
}

/**
 * Build ISO date string from Eventbrite date + time parts.
 * @param date - YYYY-MM-DD string.
 * @param time - HH:MM string.
 * @param tz - Timezone string.
 * @returns ISO 8601 date string.
 */
function buildIsoDate(date?: string, time?: string, tz?: string): string {
  if (!date) return new Date().toISOString();
  const timePart = time || "00:00";
  // Build a date string and let JS parse it in UTC, since we store the tz separately
  return new Date(`${date}T${timePart}:00`).toISOString();
}

/**
 * Fetch Orlando-area events from the Eventbrite Destination Search API.
 * Requires EVENTBRITE_PRIVATE_TOKEN env var.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchEventbriteEvents(): Promise<EventEntry[]> {
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN;
  if (!token) {
    logger.warn("EVENTBRITE_PRIVATE_TOKEN not set — skipping Eventbrite");
    return [];
  }

  logger.section("Eventbrite Destination Search API");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "Eventbrite");
  const events: EventEntry[] = [];
  let continuation: string | undefined;
  let pageNum = 0;
  const maxPages = 10;

  /** Search queries to cover Orlando area broadly. */
  const queries = [
    "Orlando FL events",
    "Orlando concerts",
    "Orlando food and drink",
    "Orlando arts and theater",
    "Orlando festivals",
    "Winter Park FL events",
    "Kissimmee FL events",
  ];

  const seenIds = new Set<string>();

  for (const query of queries) {
    continuation = undefined;
    pageNum = 0;

    try {
      while (pageNum < maxPages) {
        const body: Record<string, unknown> = {
          event_search: {
            q: query,
            dates: "current_future",
          },
        };

        if (continuation) {
          (body.event_search as Record<string, unknown>).continuation = continuation;
        }

        logger.info(`Fetching "${query}" page ${pageNum + 1}...`);

        const response = await rateFetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          logger.debug(`Eventbrite returned ${response.status} for "${query}"`);
          break;
        }

        const data = (await response.json()) as EbSearchResponse;
        const results = data.events?.results ?? [];
        if (results.length === 0) break;

        for (const raw of results) {
          if (!raw.id || seenIds.has(raw.id)) continue;
          if (raw.is_online_event) continue; // Skip online-only events
          seenIds.add(raw.id);

          const lat = raw.primary_venue?.address?.latitude
            ? parseFloat(raw.primary_venue.address.latitude)
            : 28.5383;
          const lng = raw.primary_venue?.address?.longitude
            ? parseFloat(raw.primary_venue.address.longitude)
            : -81.3792;

          const now = new Date().toISOString();
          const category = inferCategory(raw.tags);

          // Parse price from ticket_availability
          let price: EventEntry["price"];
          if (raw.is_free || raw.ticket_availability?.is_free) {
            price = { min: 0, max: 0, currency: "USD", isFree: true };
          } else if (raw.ticket_availability?.minimum_ticket_price) {
            const minVal = parseFloat(raw.ticket_availability.minimum_ticket_price.major_value ?? "0");
            const maxVal = raw.ticket_availability?.maximum_ticket_price
              ? parseFloat(raw.ticket_availability.maximum_ticket_price.major_value ?? "0")
              : minVal;
            price = {
              min: minVal,
              max: maxVal,
              currency: raw.ticket_availability.minimum_ticket_price.currency ?? "USD",
              isFree: false,
            };
          }

          const entry: EventEntry = {
            id: `eb-${raw.id}`,
            title: raw.name || "Untitled Event",
            description: raw.summary || "",
            category,
            coordinates: [lng, lat],
            venue: raw.primary_venue?.name || "Unknown Venue",
            address: raw.primary_venue?.address?.address_1 || "",
            city: raw.primary_venue?.address?.city || "Orlando",
            region: raw.primary_venue?.address?.region || "Central Florida",
            startDate: buildIsoDate(raw.start_date, raw.start_time, raw.timezone),
            endDate: raw.end_date
              ? buildIsoDate(raw.end_date, raw.end_time, raw.timezone)
              : undefined,
            timezone: raw.timezone || "America/New_York",
            price,
            url: raw.url,
            imageUrl: raw.image?.url,
            tags: (raw.tags ?? [])
              .filter((t) => t.prefix === "OrganizerTag")
              .map((t) => t.display_name?.toLowerCase() ?? "")
              .filter(Boolean),
            source: { type: "eventbrite", fetchedAt: now },
            sourceId: raw.id,
            createdAt: now,
            updatedAt: now,
            status: "active",
          };

          events.push(entry);
        }

        const pagination = data.events?.pagination;
        if (!pagination?.continuation) break;
        continuation = pagination.continuation;
        pageNum++;
      }
    } catch (err) {
      logger.error(
        `Eventbrite fetch failed for "${query}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  logger.success(`Fetched ${events.length} events from Eventbrite`);
  return events;
}
