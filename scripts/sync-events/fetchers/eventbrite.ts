/**
 * @module sync-events/fetchers/eventbrite
 * Two-phase Eventbrite fetcher:
 * 1. Destination Search API discovers event IDs (bulk, fast).
 * 2. Events API enriches each event with venue + ticket data.
 * @see https://www.eventbrite.com/platform/api
 */

import type { EventEntry, EventCategory } from "../../../src/lib/registries/types";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const DESTINATION_URL = "https://www.eventbriteapi.com/v3/destination/search/";
const EVENTS_API_URL = "https://www.eventbriteapi.com/v3/events";
const RATE_LIMIT_MS = 200;
const ENRICH_BATCH_SIZE = 10;

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
  image?: { url?: string };
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  timezone?: string;
  is_online_event?: boolean;
  is_free?: boolean;
  tags?: Array<{ prefix?: string; tag?: string; display_name?: string }>;
  primary_venue_id?: string;
}

/** Shape of the enriched event from /v3/events/{id}/?expand=venue,ticket_availability. */
interface EbEnrichedEvent {
  id?: string;
  name?: { text?: string; html?: string };
  description?: { text?: string; html?: string };
  url?: string;
  start?: { timezone?: string; local?: string; utc?: string };
  end?: { timezone?: string; local?: string; utc?: string };
  is_free?: boolean;
  logo?: { url?: string; original?: { url?: string } };
  venue?: {
    name?: string;
    latitude?: string;
    longitude?: string;
    address?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      region?: string;
      postal_code?: string;
      latitude?: string;
      longitude?: string;
      localized_address_display?: string;
    };
  };
  ticket_availability?: {
    minimum_ticket_price?: { major_value?: string; currency?: string; value?: number };
    maximum_ticket_price?: { major_value?: string; currency?: string; value?: number };
    is_sold_out?: boolean;
    is_free?: boolean;
    has_available_tickets?: boolean;
  };
}

/** Destination search response shape. */
interface EbSearchResponse {
  events?: {
    results?: EbDestinationEvent[];
    pagination?: {
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
 * Fetch Orlando-area events from Eventbrite.
 * Phase 1: Destination Search discovers event IDs + basic metadata.
 * Phase 2: Events API enriches with venue lat/lng, address, and ticket prices.
 * Requires EVENTBRITE_PRIVATE_TOKEN env var.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchEventbriteEvents(): Promise<EventEntry[]> {
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN;
  if (!token) {
    logger.warn("EVENTBRITE_PRIVATE_TOKEN not set — skipping Eventbrite");
    return [];
  }

  logger.section("Eventbrite (Destination Search + Enrich)");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "Eventbrite");
  const maxPages = 10;

  // ── Phase 1: Discover events via destination search ──
  const queries = [
    "Orlando FL events",
    "Orlando concerts",
    "Orlando food and drink",
    "Orlando arts and theater",
    "Orlando festivals",
    "Winter Park FL events",
    "Kissimmee FL events",
  ];

  /** Lightweight discovery record from phase 1. */
  interface DiscoveredEvent {
    id: string;
    name: string;
    summary: string;
    url: string;
    imageUrl?: string;
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
    timezone: string;
    isFree: boolean;
    tags: EbDestinationEvent["tags"];
  }

  const discovered = new Map<string, DiscoveredEvent>();

  for (const query of queries) {
    let continuation: string | undefined;
    let pageNum = 0;

    try {
      while (pageNum < maxPages) {
        const body: Record<string, unknown> = {
          event_search: {
            q: query,
            dates: "current_future",
            ...(continuation ? { continuation } : {}),
          },
        };

        logger.info(`Discovering "${query}" page ${pageNum + 1}...`);

        const response = await rateFetch(DESTINATION_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          logger.debug(`Destination search returned ${response.status} for "${query}"`);
          break;
        }

        const data = (await response.json()) as EbSearchResponse;
        const results = data.events?.results ?? [];
        if (results.length === 0) break;

        for (const raw of results) {
          if (!raw.id || discovered.has(raw.id)) continue;
          if (raw.is_online_event) continue;

          discovered.set(raw.id, {
            id: raw.id,
            name: raw.name || "Untitled Event",
            summary: raw.summary || "",
            url: raw.url || "",
            imageUrl: raw.image?.url,
            startDate: raw.start_date || "",
            startTime: raw.start_time || "00:00",
            endDate: raw.end_date,
            endTime: raw.end_time,
            timezone: raw.timezone || "America/New_York",
            isFree: raw.is_free ?? false,
            tags: raw.tags,
          });
        }

        const pagination = data.events?.pagination;
        if (!pagination?.continuation) break;
        continuation = pagination.continuation;
        pageNum++;
      }
    } catch (err) {
      logger.error(
        `Discovery failed for "${query}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  logger.success(`Discovered ${discovered.size} unique events`);

  // ── Phase 2: Enrich events with venue + ticket data ──
  logger.info(`Enriching ${discovered.size} events with venue & ticket data (batches of ${ENRICH_BATCH_SIZE})...`);

  const eventIds = Array.from(discovered.keys());
  const events: EventEntry[] = [];
  let enriched = 0;
  let enrichFailed = 0;

  for (let i = 0; i < eventIds.length; i += ENRICH_BATCH_SIZE) {
    const batch = eventIds.slice(i, i + ENRICH_BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map(async (eid) => {
        const url = `${EVENTS_API_URL}/${eid}/?expand=venue,ticket_availability`;
        const res = await rateFetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null;
        return (await res.json()) as EbEnrichedEvent;
      }),
    );

    for (let j = 0; j < batch.length; j++) {
      const eid = batch[j];
      const disc = discovered.get(eid)!;
      const result = batchResults[j];
      const detail = result.status === "fulfilled" ? result.value : null;

      if (!detail) {
        enrichFailed++;
        // Still include event with discovery data only (default coords)
      }

      const venue = detail?.venue;
      const lat = venue?.address?.latitude
        ? parseFloat(venue.address.latitude)
        : venue?.latitude
          ? parseFloat(venue.latitude)
          : 28.5383;
      const lng = venue?.address?.longitude
        ? parseFloat(venue.address.longitude)
        : venue?.longitude
          ? parseFloat(venue.longitude)
          : -81.3792;

      // Skip events that still have default/zero coordinates (no known venue)
      const hasRealCoords = lat !== 28.5383 || lng !== -81.3792;

      const now = new Date().toISOString();
      const category = inferCategory(disc.tags);

      // Parse price from enriched ticket_availability
      let price: EventEntry["price"];
      const ta = detail?.ticket_availability;
      const isFree = disc.isFree || detail?.is_free || ta?.is_free;
      if (isFree) {
        price = { min: 0, max: 0, currency: "USD", isFree: true };
      } else if (ta?.minimum_ticket_price) {
        const minVal = parseFloat(ta.minimum_ticket_price.major_value ?? "0");
        const maxVal = ta?.maximum_ticket_price
          ? parseFloat(ta.maximum_ticket_price.major_value ?? "0")
          : minVal;
        if (minVal > 0 || maxVal > 0) {
          price = {
            min: minVal,
            max: maxVal,
            currency: ta.minimum_ticket_price.currency ?? "USD",
            isFree: false,
          };
        }
      }

      // Use enriched start/end dates if available, fall back to discovery data
      const startDate = detail?.start?.utc
        || (disc.startDate ? new Date(`${disc.startDate}T${disc.startTime}:00`).toISOString() : now);
      const endDate = detail?.end?.utc
        || (disc.endDate ? new Date(`${disc.endDate}T${disc.endTime || "23:59"}:00`).toISOString() : undefined);

      const entry: EventEntry = {
        id: `eb-${eid}`,
        title: detail?.name?.text || disc.name,
        description: detail?.description?.text?.slice(0, 500) || disc.summary,
        category,
        coordinates: [lng, lat],
        venue: venue?.name || (hasRealCoords ? "Venue TBD" : "Unknown Venue"),
        address: venue?.address?.localized_address_display
          || venue?.address?.address_1
          || "",
        city: venue?.address?.city || "Orlando",
        region: venue?.address?.region || "Central Florida",
        startDate,
        endDate,
        timezone: detail?.start?.timezone || disc.timezone,
        price,
        url: detail?.url || disc.url,
        imageUrl: detail?.logo?.original?.url || detail?.logo?.url || disc.imageUrl,
        tags: (disc.tags ?? [])
          .filter((t) => t.prefix === "OrganizerTag")
          .map((t) => t.display_name?.toLowerCase() ?? "")
          .filter(Boolean),
        source: { type: "eventbrite", fetchedAt: now },
        sourceId: eid,
        createdAt: now,
        updatedAt: now,
        status: "active",
      };

      events.push(entry);
      enriched++;
    }

    if ((i + ENRICH_BATCH_SIZE) % 100 === 0 || i + ENRICH_BATCH_SIZE >= eventIds.length) {
      logger.info(`  Enriched ${Math.min(i + ENRICH_BATCH_SIZE, eventIds.length)}/${eventIds.length}...`);
    }
  }

  logger.success(
    `Fetched ${events.length} events from Eventbrite (${enriched - enrichFailed} enriched, ${enrichFailed} fallback)`,
  );
  return events;
}
