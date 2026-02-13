/**
 * @module sync-events/fetchers/serpapi
 * Fetches events from SerpApi Google Events API.
 * @see https://serpapi.com/google-events-api
 */

import type { EventEntry } from "../../../src/lib/registries/types";
import { inferCategoryFromText } from "../utils/category-mapper";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const API_BASE = "https://serpapi.com/search.json";
const RATE_LIMIT_MS = 1000;

/** Shape of a single Google Events result from SerpApi. */
interface SerpEvent {
  title?: string;
  date?: { start_date?: string; when?: string };
  address?: string[];
  link?: string;
  description?: string;
  venue?: { name?: string; rating?: number; reviews?: number; link?: string };
  thumbnail?: string;
  ticket_info?: Array<{ source?: string; link?: string; link_type?: string }>;
  event_location_map?: {
    image?: string;
    link?: string;
    serpapi_link?: string;
  };
}

/** SerpApi response shape for Google Events. */
interface SerpApiResponse {
  events_results?: SerpEvent[];
  error?: string;
  search_metadata?: { status?: string };
}

/** Queries to run against Google Events for broad Orlando coverage. */
const SEARCH_QUERIES = [
  "events in Orlando FL this week",
  "events in Orlando FL this weekend",
  "things to do in Orlando FL",
  "concerts in Orlando FL",
  "festivals in Orlando FL",
  "food events in Orlando FL",
  "sports events in Orlando FL",
  "family events in Orlando FL",
  "art events in Orlando FL",
  "tech events in Orlando FL",
  "outdoor events in Orlando FL",
  "nightlife in Orlando FL",
  "community events in Orlando FL",
  "Orlando FL events today",
  "events near Kissimmee FL",
  "events near Winter Park FL",
  "events near Lake Eola Orlando",
  "theme park events Orlando",
  "Orlando downtown events",
  "Orlando music events",
  "Orlando comedy shows",
  "free events Orlando FL",
  "events in Sanford FL",
  "events in Celebration FL",
  "events at UCF Orlando",
  "Orlando farmers market",
  "Orlando FL charity events",
  "Orlando FL workshops",
  "Cape Canaveral events",
  "events in Daytona Beach FL",
  "Orlando convention center events",
  "Dr Phillips Center events Orlando",
  "Amway Center events Orlando",
  "Disney Springs events",
  "International Drive Orlando events",
  "events in Maitland FL",
  "events in Altamonte Springs FL",
  "events in Ocoee FL",
  "events in Clermont FL",
  "events in Apopka FL",
  "events in St Cloud FL",
  "events in Longwood FL",
  "events in Casselberry FL",
  "events in Lake Mary FL",
  "events in Oviedo FL",
  "events in DeLand FL",
  "events in Mount Dora FL",
  "events in Tavares FL",
  "events in Leesburg FL",
  "events in Cocoa Beach FL",
];

/**
 * Parse a SerpApi date string into an ISO 8601 date.
 * SerpApi returns dates like "Sat, Feb 15" or "Feb 15 – 16" or "Tomorrow".
 * @param dateInfo - Date info from SerpApi.
 * @returns ISO 8601 date string.
 */
function parseSerpDate(dateInfo?: SerpEvent["date"]): string {
  if (!dateInfo) return new Date().toISOString();

  if (dateInfo.start_date) {
    try {
      const parsed = new Date(dateInfo.start_date);
      if (!isNaN(parsed.getTime())) {
        // SerpApi sometimes returns dates without a year (e.g. "Feb 12")
        // which JS parses as year 2001. Fix by using the current year.
        const now = new Date();
        if (parsed.getFullYear() < now.getFullYear()) {
          parsed.setFullYear(now.getFullYear());
          // If it's now in the past, bump to next year
          if (parsed.getTime() < now.getTime() - 7 * 86400000) {
            parsed.setFullYear(now.getFullYear() + 1);
          }
        }
        return parsed.toISOString();
      }
    } catch {
      // fall through
    }
  }

  if (dateInfo.when) {
    try {
      // Try direct parse first
      const parsed = new Date(dateInfo.when);
      if (!isNaN(parsed.getTime())) return parsed.toISOString();
    } catch {
      // fall through
    }

    // Handle relative dates
    const when = dateInfo.when.toLowerCase();
    const now = new Date();

    if (when.includes("today")) {
      return now.toISOString();
    }
    if (when.includes("tomorrow")) {
      now.setDate(now.getDate() + 1);
      return now.toISOString();
    }

    // Try parsing "Mon, Feb 15" style
    const match = when.match(
      /(?:mon|tue|wed|thu|fri|sat|sun),?\s+(\w+)\s+(\d+)/i,
    );
    if (match) {
      const [, month, day] = match;
      const year = now.getFullYear();
      const attempt = new Date(`${month} ${day}, ${year}`);
      if (!isNaN(attempt.getTime())) {
        // If the date is in the past, assume next year
        if (attempt < now) {
          attempt.setFullYear(year + 1);
        }
        return attempt.toISOString();
      }
    }
  }

  return new Date().toISOString();
}

/**
 * Extract coordinates from venue/address using known Orlando area locations.
 * Falls back to downtown Orlando center.
 * @param event - SerpApi event.
 * @returns [lng, lat] coordinates.
 */
function extractCoordinates(event: SerpEvent): [number, number] {
  const addressStr = [
    event.venue?.name,
    ...(event.address ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Known venue location mappings for common Orlando venues
  const VENUE_COORDS: Record<string, [number, number]> = {
    "amway center": [-81.3839, 28.5392],
    "dr. phillips center": [-81.3762, 28.5386],
    "dr phillips center": [-81.3762, 28.5386],
    "camping world stadium": [-81.4029, 28.5392],
    "exploria stadium": [-81.3891, 28.5411],
    "lake eola": [-81.3734, 28.5432],
    "wall street plaza": [-81.3789, 28.5415],
    "universal": [-81.4684, 28.4747],
    "disney springs": [-81.5194, 28.3712],
    "magic kingdom": [-81.5639, 28.4177],
    "epcot": [-81.5494, 28.3747],
    "hollywood studios": [-81.5589, 28.3583],
    "animal kingdom": [-81.5907, 28.3553],
    "sea world": [-81.4618, 28.4114],
    "seaworld": [-81.4618, 28.4114],
    "international drive": [-81.4704, 28.4347],
    "i-drive": [-81.4704, 28.4347],
    "convention center": [-81.4693, 28.4274],
    "kennedy space center": [-80.6501, 28.5728],
    "cape canaveral": [-80.6077, 28.3922],
    "cocoa beach": [-80.6077, 28.3200],
    "winter park": [-81.3392, 28.5992],
    "park avenue": [-81.3512, 28.5992],
    "kissimmee": [-81.4168, 28.2920],
    "celebration": [-81.5333, 28.3253],
    "sanford": [-81.2732, 28.8003],
    "daytona": [-81.0229, 29.2108],
    "ucf": [-81.2000, 28.6024],
    "downtown orlando": [-81.3792, 28.5383],
    "mills 50": [-81.3670, 28.5500],
    "thornton park": [-81.3682, 28.5395],
    "college park": [-81.3969, 28.5639],
    "ivanhoe village": [-81.3813, 28.5581],
    "winter garden": [-81.5862, 28.5653],
    "mount dora": [-81.6434, 28.8025],
    "maitland": [-81.3634, 28.6275],
    "altamonte springs": [-81.3654, 28.6611],
    "oviedo": [-81.2084, 28.6700],
    "lake mary": [-81.3178, 28.7589],
    "longwood": [-81.3384, 28.7031],
    "apopka": [-81.5084, 28.6764],
    "clermont": [-81.7729, 28.5494],
    "st. cloud": [-81.2812, 28.2489],
    "st cloud": [-81.2812, 28.2489],
    "deland": [-81.3031, 29.0280],
    "tavares": [-81.7256, 28.8042],
    "leesburg": [-81.8779, 28.8108],
  };

  for (const [key, coords] of Object.entries(VENUE_COORDS)) {
    if (addressStr.includes(key)) {
      // Add small jitter to avoid exact overlaps
      const jitter = () => (Math.random() - 0.5) * 0.005;
      return [coords[0] + jitter(), coords[1] + jitter()];
    }
  }

  // Default: downtown Orlando with random jitter
  const jitter = () => (Math.random() - 0.5) * 0.03;
  return [-81.3792 + jitter(), 28.5383 + jitter()];
}

/**
 * Generate a stable ID from event title and date.
 * @param event - SerpApi event.
 * @param index - Index within batch.
 * @returns Stable ID string.
 */
function generateEventId(event: SerpEvent, index: number): string {
  const slug = (event.title ?? `event-${index}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const dateSlug = (event.date?.start_date ?? "")
    .replace(/[^0-9]/g, "")
    .slice(0, 8);
  return `serp-${slug}-${dateSlug || index}`;
}

/**
 * Fetch Orlando-area events from SerpApi Google Events.
 * Requires SERPAPI_KEY env var.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchSerpApiEvents(): Promise<EventEntry[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    logger.warn("SERPAPI_KEY not set — skipping SerpApi Google Events");
    return [];
  }

  logger.section("SerpApi Google Events");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "SerpApi");
  const events: EventEntry[] = [];
  const seenTitles = new Set<string>();
  let queriesFetched = 0;

  for (const query of SEARCH_QUERIES) {
    try {
      const params = new URLSearchParams({
        engine: "google_events",
        q: query,
        api_key: apiKey,
        hl: "en",
        gl: "us",
      });

      const url = `${API_BASE}?${params}`;
      logger.info(`Query ${queriesFetched + 1}/${SEARCH_QUERIES.length}: "${query}"`);

      const response = await rateFetch(url);
      const data = (await response.json()) as SerpApiResponse;

      if (data.error) {
        logger.warn(`SerpApi error for "${query}": ${data.error}`);
        continue;
      }

      const results = data.events_results ?? [];
      let added = 0;

      for (let i = 0; i < results.length; i++) {
        const raw = results[i];
        if (!raw.title) continue;

        // Skip duplicates within this batch
        const normalizedTitle = raw.title.toLowerCase().trim();
        if (seenTitles.has(normalizedTitle)) continue;
        seenTitles.add(normalizedTitle);

        const now = new Date().toISOString();
        const coordinates = extractCoordinates(raw);
        const addressParts = raw.address ?? [];
        const city =
          addressParts.find((a) =>
            /orlando|kissimmee|winter park|sanford|daytona|cocoa|celebration|maitland|altamonte|oviedo|clermont|apopka/i.test(
              a,
            ),
          ) ?? "Orlando";

        const categoryText = [
          raw.title,
          raw.description ?? "",
          raw.venue?.name ?? "",
        ].join(" ");

        const entry: EventEntry = {
          id: generateEventId(raw, events.length + i),
          title: raw.title,
          description: raw.description ?? "",
          category: inferCategoryFromText(categoryText),
          coordinates,
          venue: raw.venue?.name ?? addressParts[0] ?? "Unknown Venue",
          address: addressParts.slice(0, 2).join(", "),
          city,
          region: "Central Florida",
          startDate: parseSerpDate(raw.date),
          timezone: "America/New_York",
          url: raw.link,
          imageUrl: raw.thumbnail,
          tags: [],
          source: { type: "serpapi", fetchedAt: now },
          createdAt: now,
          updatedAt: now,
          status: "active",
        };

        events.push(entry);
        added++;
      }

      logger.info(`  → ${added} new events (${results.length} results total)`);
      queriesFetched++;
    } catch (err) {
      logger.error(
        `SerpApi query "${query}" failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  logger.success(`Fetched ${events.length} unique events from SerpApi across ${queriesFetched} queries`);
  return events;
}
