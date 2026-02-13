/**
 * @module sync-events/fetchers/tkx
 * Scrapes upcoming events from tkx.events calendar (Orlando ticketing platform).
 * Iterates through monthly calendar pages for full-year coverage.
 */

import * as cheerio from "cheerio";
import type { EventEntry } from "../../../src/lib/registries/types";
import { buildScrapedEvent } from "../normalizers/scraper-normalizer";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const BASE_URL = "https://www.tkx.events";
const CALENDAR_URL = `${BASE_URL}/calendar`;
const RATE_LIMIT_MS = 1500;

/**
 * Scrape upcoming events from tkx.events calendar pages (month by month).
 * Covers from the current month through December of the current year.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchTkxEvents(): Promise<EventEntry[]> {
  logger.section("TKX Events Scraper (Calendar)");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "TKX");
  const events: EventEntry[] = [];
  const seen = new Set<string>();

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-based
  const currentYear = now.getFullYear();

  try {
    // Iterate from current month through December
    for (let month = currentMonth; month <= 12; month++) {
      const url = `${CALENDAR_URL}?month=${month}&year=${currentYear}`;
      logger.info(`Fetching calendar: ${currentYear}-${String(month).padStart(2, "0")}...`);

      const response = await rateFetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const eventLinks = $('a[href^="/events/"]').toArray();
      let monthCount = 0;

      for (const el of eventLinks) {
        const $el = $(el);
        const href = $el.attr("href") ?? "";
        if (!href || seen.has(href)) continue;
        seen.add(href);

        const title = $el.find("h2, h3").first().text().trim();
        if (!title) continue;

        // Calendar format: paragraphs contain date + venue/time info
        const paragraphs = $el.find("p").toArray().map((p) => $(p).text().trim()).filter(Boolean);

        const dateLine = paragraphs[0] ?? "";
        const startDate = parseTkxDate(dateLine, currentYear, month);
        if (!startDate) {
          logger.debug(`Skipping "${title}" — could not parse date from "${dateLine}"`);
          continue;
        }

        // Calendar venue format: "City | Venue | Time" or "Venue • City"
        const venueLine = paragraphs[1] ?? "";
        const { venue, city } = parseTkxVenue(venueLine);

        const imageUrl = $el.find("img").first().attr("src") ?? undefined;
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
        monthCount++;
      }

      logger.info(`  → ${monthCount} events for ${currentYear}-${String(month).padStart(2, "0")}`);
    }

    // Fetch detail pages for descriptions (batch, rate-limited)
    const detailLimit = Math.min(events.length, 100);
    logger.info(`Fetching detail pages for ${detailLimit} of ${events.length} events...`);

    for (let i = 0; i < detailLimit; i++) {
      const event = events[i];
      if (!event.url) continue;

      try {
        const detailRes = await rateFetch(event.url);
        const detailHtml = await detailRes.text();
        const $detail = cheerio.load(detailHtml);

        const desc = $detail('meta[name="description"]').attr("content")
          ?? $detail('meta[property="og:description"]').attr("content")
          ?? "";

        if (desc) {
          event.description = desc.trim();
        }

        const ogImage = $detail('meta[property="og:image"]').attr("content");
        if (ogImage && !event.imageUrl) {
          event.imageUrl = ogImage;
        }
      } catch {
        // Skip detail page errors silently
      }
    }

    logger.success(`Scraped ${events.length} events from TKX Events (calendar)`);
  } catch (err) {
    logger.error(
      `TKX scrape failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return events;
}

/**
 * Parse a TKX date line into an ISO 8601 string.
 * Calendar format: "Sat • Feb 14" or "Thu, Feb 12 • 9:00 pm"
 * Also handles pipe-delimited time: "Orlando | Venue | 06:00 pm"
 * @param text - Date text from the event card.
 * @param year - Year to use for the date.
 * @param expectedMonth - Expected month (1-based) for validation.
 * @returns ISO date string, or empty string if unparseable.
 */
function parseTkxDate(text: string, year: number, expectedMonth: number): string {
  if (!text) return "";

  // Normalize: replace comma after day name with bullet for uniform splitting
  const normalized = text.replace(/^(\w{3}),\s*/, "$1 • ");

  // Split on bullet separator and clean up
  const parts = normalized.split("•").map((s) => s.trim());
  if (parts.length < 2) return "";

  // parts[0] = "Thu", parts[1] = "Feb 12", parts[2] = "9:00 pm" (optional)
  const dateStr = parts[1]; // "Feb 12"
  const timeStr = parts[2] ?? "";

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

  // Use the provided year; if the month doesn't match expected, still use it
  // (calendar may show events from adjacent months)
  const useYear = month + 1 < expectedMonth ? year + 1 : year;

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

  const date = new Date(useYear, month, day, hours, minutes);
  return date.toISOString();
}

/**
 * Parse a TKX venue line into venue name and city.
 * Handles both formats:
 *   - Bullet: "The Corner • Orlando"
 *   - Pipe: "Orlando | The Beacham | 06:00 pm"
 * @param text - Venue text from the event card.
 * @returns Object with venue and city strings.
 */
function parseTkxVenue(text: string): { venue: string; city: string } {
  if (!text) return { venue: "", city: "Orlando" };

  // Pipe-delimited format (calendar): "Orlando | The Beacham | 06:00 pm"
  if (text.includes("|")) {
    const parts = text.split("|").map((s) => s.trim());
    if (parts.length >= 2) {
      return { city: parts[0], venue: parts[1] };
    }
  }

  // Bullet-delimited format (homepage): "The Corner • Orlando"
  const parts = text.split("•").map((s) => s.trim());
  if (parts.length >= 2) {
    return { venue: parts[0], city: parts[1] };
  }

  return { venue: text, city: "Orlando" };
}
