/**
 * @module sync-events/fetchers/eventbrite
 * Fetches events from the Eventbrite API using the existing parser.
 */

import type { EventEntry } from "../../../src/lib/registries/types";
import { parseEventbriteEvent } from "../../../src/lib/registries/eventbrite-parser";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const API_BASE = "https://www.eventbriteapi.com/v3";
const RATE_LIMIT_MS = 200;

/** Eventbrite paginated response shape. */
interface EbResponse {
  events?: Array<Record<string, unknown>>;
  pagination?: {
    has_more_items?: boolean;
    continuation?: string;
    page_count?: number;
  };
}

/**
 * Fetch Orlando-area events from the Eventbrite API.
 * Requires EVENTBRITE_PRIVATE_TOKEN env var.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchEventbriteEvents(): Promise<EventEntry[]> {
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN;
  if (!token) {
    logger.warn("EVENTBRITE_PRIVATE_TOKEN not set — skipping Eventbrite");
    return [];
  }

  logger.section("Eventbrite API");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "Eventbrite");
  const events: EventEntry[] = [];
  let continuation: string | undefined;
  let pageNum = 0;
  const maxPages = 5;

  try {
    while (pageNum < maxPages) {
      const params = new URLSearchParams({
        "location.latitude": "28.5383",
        "location.longitude": "-81.3792",
        "location.within": "50mi",
        expand: "venue,category",
        status: "live",
      });
      if (continuation) {
        params.set("continuation", continuation);
      }

      const url = `${API_BASE}/events/search/?${params}`;
      logger.info(`Fetching page ${pageNum + 1}...`);

      const response = await rateFetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as EbResponse;

      const ebEvents = data.events ?? [];
      if (ebEvents.length === 0) break;

      for (const raw of ebEvents) {
        const parsed = parseEventbriteEvent(raw as Parameters<typeof parseEventbriteEvent>[0]);
        // Update source to use proper eventbrite type instead of scraper
        const entry: EventEntry = {
          ...parsed,
          source: { type: "eventbrite", fetchedAt: new Date().toISOString() },
        };
        events.push(entry);
      }

      if (!data.pagination?.has_more_items) break;
      continuation = data.pagination.continuation;
      pageNum++;
    }

    logger.success(`Fetched ${events.length} events from Eventbrite`);
  } catch (err) {
    logger.error(
      `Eventbrite fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return events;
}
