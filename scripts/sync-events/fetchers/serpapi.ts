/**
 * @module sync-events/fetchers/serpapi
 * Fetches events from SerpApi Google Events API.
 * @see https://serpapi.com/google-events-api
 */

import type { EventEntry } from "../../../src/lib/registries/types";
import { inferCategoryFromText } from "../utils/category-mapper";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";
import { lookupVenueCoordsWithGeocode } from "../venues/venue-lookup";

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
  // Future month coverage (6+ months ahead)
  "events in Orlando FL March 2026",
  "events in Orlando FL April 2026",
  "events in Orlando FL May 2026",
  "events in Orlando FL June 2026",
  "events in Orlando FL July 2026",
  "events in Orlando FL August 2026",
  "Orlando summer events 2026",
  "Orlando spring events 2026",
  "festivals Orlando FL 2026",
  "concerts Orlando FL spring 2026",
];

/**
 * Extract hours and minutes from a time string like "7 PM", "8:30 AM", "10 PM".
 * @param text - String potentially containing a time.
 * @returns Parsed hours (24h) and minutes, or null if no time found.
 */
function extractTime(text: string): { hours: number; minutes: number } | null {
  const match = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const isPM = match[3].toLowerCase() === "pm";
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  return { hours, minutes };
}

/**
 * Build a UTC ISO string from date parts + Eastern Time hours/minutes.
 * EDT (Mar–Nov) = UTC-4, EST (Nov–Mar) = UTC-5.
 * @param year - Full year.
 * @param month - 0-indexed month.
 * @param day - Day of month.
 * @param hours - Hours in Eastern Time (24h).
 * @param minutes - Minutes.
 * @returns ISO 8601 UTC string.
 */
function easternToUtc(year: number, month: number, day: number, hours: number, minutes: number): string {
  const etOffset = (month >= 2 && month <= 10) ? 4 : 5;
  return new Date(Date.UTC(year, month, day, hours + etOffset, minutes)).toISOString();
}

/**
 * Parse a SerpApi date string into an ISO 8601 date.
 * SerpApi returns dates like "Sat, Feb 15" or "Feb 15 – 16" or "Tomorrow".
 * The `when` field may include time: "Friday, Feb 13, 7 PM – 10 PM".
 * All times are treated as Eastern Time and converted to UTC.
 * @param dateInfo - Date info from SerpApi.
 * @returns ISO 8601 date string.
 */
function parseSerpDate(dateInfo?: SerpEvent["date"]): string {
  if (!dateInfo) return new Date().toISOString();

  // Extract time from the `when` field (e.g. "Friday, Feb 13, 7 PM – 10 PM")
  const timeFromWhen = dateInfo.when ? extractTime(dateInfo.when) : null;

  if (dateInfo.start_date) {
    try {
      const parsed = new Date(dateInfo.start_date);
      if (!isNaN(parsed.getTime())) {
        const now = new Date();
        let year = parsed.getFullYear();
        // SerpApi sometimes returns dates without a year (e.g. "Feb 12")
        // which JS parses as year 2001. Fix by using the current year.
        if (year < now.getFullYear()) {
          year = now.getFullYear();
        }
        const month = parsed.getMonth();
        const day = parsed.getDate();

        // If the date is in the past, bump to next year
        const check = new Date(Date.UTC(year, month, day));
        if (check.getTime() < now.getTime() - 7 * 86400000) {
          year++;
        }

        const hours = timeFromWhen?.hours ?? 0;
        const minutes = timeFromWhen?.minutes ?? 0;
        return easternToUtc(year, month, day, hours, minutes);
      }
    } catch {
      // fall through
    }
  }

  if (dateInfo.when) {
    const when = dateInfo.when;
    const now = new Date();

    // Handle relative dates
    const whenLower = when.toLowerCase();
    if (whenLower.includes("today")) {
      const hours = timeFromWhen?.hours ?? now.getHours();
      const minutes = timeFromWhen?.minutes ?? 0;
      return easternToUtc(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    }
    if (whenLower.includes("tomorrow")) {
      const tom = new Date(now);
      tom.setDate(tom.getDate() + 1);
      const hours = timeFromWhen?.hours ?? 0;
      const minutes = timeFromWhen?.minutes ?? 0;
      return easternToUtc(tom.getFullYear(), tom.getMonth(), tom.getDate(), hours, minutes);
    }

    // Try parsing "Mon, Feb 15" or "Friday, Feb 13, 7 PM" style
    const match = when.match(
      /(?:mon|tue|wed|thu|fri|sat|sun)\w*,?\s+(\w+)\s+(\d+)/i,
    );
    if (match) {
      const [, monthStr, dayStr] = match;
      const year = now.getFullYear();
      const attempt = new Date(`${monthStr} ${dayStr}, ${year}`);
      if (!isNaN(attempt.getTime())) {
        let useYear = year;
        if (attempt.getTime() < now.getTime() - 7 * 86400000) {
          useYear = year + 1;
        }
        const hours = timeFromWhen?.hours ?? 0;
        const minutes = timeFromWhen?.minutes ?? 0;
        return easternToUtc(useYear, attempt.getMonth(), attempt.getDate(), hours, minutes);
      }
    }
  }

  return new Date().toISOString();
}

/**
 * Extract coordinates from venue/address using canonical registry + geocode fallback.
 * Returns null if no match found — never falls back to downtown Orlando.
 * @param event - SerpApi event.
 * @returns [lng, lat] coordinates or null.
 */
async function extractCoordinates(event: SerpEvent): Promise<[number, number] | null> {
  const venueName = event.venue?.name;
  const addressParts = event.address ?? [];
  const addressStr = addressParts.slice(0, 2).join(", ");
  const city = addressParts.find((a) =>
    /orlando|kissimmee|winter park|sanford|daytona|cocoa|celebration|maitland|altamonte|oviedo|clermont|apopka/i.test(a),
  );

  // Try canonical + geocode via venue name
  if (venueName) {
    const match = await lookupVenueCoordsWithGeocode(venueName, addressStr, city);
    if (match) return [match.lng, match.lat];
  }

  // Try geocoding the address directly
  if (addressStr) {
    const match = await lookupVenueCoordsWithGeocode(addressStr, undefined, city);
    if (match) return [match.lng, match.lat];
  }

  return null;
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
        const coordinates = await extractCoordinates(raw);
        if (!coordinates) continue; // Skip events with no resolvable coordinates
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
