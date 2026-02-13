/**
 * @module sync-events/fetchers/ticketmaster
 * Fetches events from the Ticketmaster Discovery API.
 * @see https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
 */

import type { EventEntry } from "../../../src/lib/registries/types";
import {
  normalizeTmEvent,
  type TmEvent,
} from "../normalizers/ticketmaster-normalizer";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const API_BASE = "https://app.ticketmaster.com/discovery/v2/events.json";
const RATE_LIMIT_MS = 500;

/** Ticketmaster API response shape. */
interface TmResponse {
  _embedded?: { events?: TmEvent[] };
  page?: { totalPages?: number; number?: number; totalElements?: number };
}

/**
 * Fetch Orlando-area events from Ticketmaster Discovery API.
 * Requires TICKETMASTER_API_KEY env var.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchTicketmasterEvents(): Promise<EventEntry[]> {
  const apiKey =
    process.env.TICKETMASTER_CONSUMER_KEY ?? process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    logger.warn(
      "TICKETMASTER_CONSUMER_KEY / TICKETMASTER_API_KEY not set — skipping Ticketmaster",
    );
    return [];
  }

  logger.section("Ticketmaster Discovery API");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "Ticketmaster");
  const events: EventEntry[] = [];
  let page = 0;
  const maxPages = 5; // TM caps at 1000 events (5 pages x 200)

  try {
    while (page < maxPages) {
      const params = new URLSearchParams({
        apikey: apiKey,
        latlong: "28.5383,-81.3792",
        radius: "50",
        unit: "miles",
        size: "200",
        page: String(page),
        sort: "date,asc",
        startDateTime: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
        endDateTime: new Date(Date.now() + 90 * 86400000).toISOString().replace(/\.\d+Z$/, "Z"),
      });

      const url = `${API_BASE}?${params}`;
      logger.info(`Fetching page ${page + 1}...`);

      const response = await rateFetch(url);
      const data = (await response.json()) as TmResponse;

      const tmEvents = data._embedded?.events ?? [];
      if (tmEvents.length === 0) break;

      for (const tm of tmEvents) {
        events.push(normalizeTmEvent(tm));
      }

      const totalPages = data.page?.totalPages ?? 1;
      page++;
      if (page >= totalPages) break;
    }

    logger.success(`Fetched ${events.length} events from Ticketmaster`);
  } catch (err) {
    logger.error(
      `Ticketmaster fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return events;
}
