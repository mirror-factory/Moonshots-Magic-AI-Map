/**
 * @module sync-events/fetchers/tkx
 * Scrapes upcoming events from tkx.events (Orlando ticketing platform).
 * Events are server-rendered in the initial HTML, so no JS execution is needed.
 */

import * as cheerio from "cheerio";
import type { EventEntry } from "../../../src/lib/registries/types";
import { buildScrapedEvent } from "../normalizers/scraper-normalizer";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const BASE_URL = "https://www.tkx.events";
const RATE_LIMIT_MS = 1500;

/**
 * Scrape upcoming events from tkx.events.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchTkxEvents(): Promise<EventEntry[]> {
  logger.section("TKX Events Scraper");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "TKX");
  const events: EventEntry[] = [];

  try {
    logger.info("Fetching homepage...");
    const response = await rateFetch(BASE_URL);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Event cards are links to /events/... with nested content
    const eventLinks = $('a[href^="/events/"]').toArray();
    logger.info(`Found ${eventLinks.length} event links`);

    const seen = new Set<string>();

    for (const el of eventLinks) {
      const $el = $(el);
      const href = $el.attr("href") ?? "";

      // Skip duplicates (same event can appear in multiple sections)
      if (!href || seen.has(href)) continue;
      seen.add(href);

      // Extract title from heading (h2 or h3)
      const title = $el.find("h2, h3").first().text().trim();
      if (!title) continue;

      // Extract paragraphs — typically: date line + venue line
      const paragraphs = $el.find("p").toArray().map((p) => $(p).text().trim()).filter(Boolean);

      // Parse date from first paragraph: "Thu • Feb 12 • 9:00 pm" or "Thu • Feb 12"
      const dateLine = paragraphs[0] ?? "";
      const startDate = parseTkxDate(dateLine);
      if (!startDate) {
        logger.debug(`Skipping "${title}" — could not parse date from "${dateLine}"`);
        continue;
      }

      // Parse venue from second paragraph: "The Corner • Orlando"
      const venueLine = paragraphs[1] ?? "";
      const { venue, city } = parseTkxVenue(venueLine);

      // Extract image URL
      const imageUrl = $el.find("img").first().attr("src") ?? undefined;

      // Build the full event URL
      const eventUrl = `${BASE_URL}${href}`;

      events.push(
        buildScrapedEvent(
          {
            title,
            description: "",
            startDate,
            venue: venue || "Orlando Venue",
            city: city || "Orlando",
            url: eventUrl,
            imageUrl,
            categoryText: "",
          },
          "tkx",
          "tkx.events",
        ),
      );
    }

    // Optionally fetch detail pages for descriptions (batch, rate-limited)
    const detailLimit = Math.min(events.length, 50);
    logger.info(`Fetching detail pages for ${detailLimit} events...`);

    for (let i = 0; i < detailLimit; i++) {
      const event = events[i];
      if (!event.url) continue;

      try {
        const detailRes = await rateFetch(event.url);
        const detailHtml = await detailRes.text();
        const $detail = cheerio.load(detailHtml);

        // Look for description text in the detail page
        const desc = $detail('meta[name="description"]').attr("content")
          ?? $detail('meta[property="og:description"]').attr("content")
          ?? "";

        if (desc) {
          event.description = desc.trim();
        }

        // Try to get a better image from og:image
        const ogImage = $detail('meta[property="og:image"]').attr("content");
        if (ogImage && !event.imageUrl) {
          event.imageUrl = ogImage;
        }
      } catch {
        // Skip detail page errors silently
      }
    }

    logger.success(`Scraped ${events.length} events from TKX Events`);
  } catch (err) {
    logger.error(
      `TKX scrape failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return events;
}

/**
 * Parse a TKX date line into an ISO 8601 string.
 * Handles two formats:
 *   - Bullet-separated: "Thu • Feb 12 • 9:00 pm"
 *   - Comma-separated:  "Thu, Feb 12 • 9:00 pm"
 * @param text - Date text from the event card.
 * @returns ISO date string, or empty string if unparseable.
 */
function parseTkxDate(text: string): string {
  if (!text) return "";

  // Normalize: replace comma after day name with bullet for uniform splitting
  const normalized = text.replace(/^(\w{3}),\s*/, "$1 • ");

  // Split on bullet separator and clean up
  const parts = normalized.split("•").map((s) => s.trim());
  if (parts.length < 2) return "";

  // parts[0] = "Thu", parts[1] = "Feb 12", parts[2] = "9:00 pm" (optional)
  const dateStr = parts[1]; // "Feb 12"
  const timeStr = parts[2] ?? ""; // "9:00 pm" or ""

  // Parse month and day
  const dateMatch = dateStr.match(/^(\w+)\s+(\d+)$/);
  if (!dateMatch) return "";

  const monthName = dateMatch[1];
  const day = parseInt(dateMatch[2], 10);

  const monthMap: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const month = monthMap[monthName];
  if (month === undefined) return "";

  // Determine year: if month/day has passed this year, use next year
  const now = new Date();
  let year = now.getFullYear();
  const candidate = new Date(year, month, day);
  if (candidate.getTime() < now.getTime() - 86400000 * 7) {
    year += 1;
  }

  // Parse time if available
  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      const isPM = timeMatch[3].toLowerCase() === "pm";
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    }
  }

  const date = new Date(year, month, day, hours, minutes);
  return date.toISOString();
}

/**
 * Parse a TKX venue line into venue name and city.
 * Format: "The Corner • Orlando" or "The Beacham • Orlando"
 * @param text - Venue text from the event card.
 * @returns Object with venue and city strings.
 */
function parseTkxVenue(text: string): { venue: string; city: string } {
  if (!text) return { venue: "", city: "Orlando" };

  const parts = text.split("•").map((s) => s.trim());
  if (parts.length >= 2) {
    return { venue: parts[0], city: parts[1] };
  }
  // If no bullet separator, the whole thing is probably the venue
  return { venue: text, city: "Orlando" };
}
