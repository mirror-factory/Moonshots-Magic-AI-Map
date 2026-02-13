/**
 * @module sync-events/fetchers/city-of-orlando
 * Scrapes events from orlando.gov/Events.
 */

import * as cheerio from "cheerio";
import type { EventEntry } from "../../../src/lib/registries/types";
import { buildScrapedEvent } from "../normalizers/scraper-normalizer";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const BASE_URL = "https://www.orlando.gov";
const EVENTS_PATH = "/Events";
const RATE_LIMIT_MS = 1000;

/**
 * Scrape events from City of Orlando website.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchCityOfOrlandoEvents(): Promise<EventEntry[]> {
  logger.section("City of Orlando Scraper");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "CityOfOrlando");
  const events: EventEntry[] = [];
  const maxPages = 5;

  try {
    for (let page = 1; page <= maxPages; page++) {
      const url = page === 1
        ? `${BASE_URL}${EVENTS_PATH}`
        : `${BASE_URL}${EVENTS_PATH}?page=${page}`;

      logger.info(`Scraping page ${page}...`);

      let html: string;
      try {
        const response = await rateFetch(url);
        html = await response.text();
      } catch {
        logger.warn(`Failed to fetch page ${page} — stopping pagination`);
        break;
      }

      const $ = cheerio.load(html);
      const eventItems = $(
        '[class*="event"], .listing-item, .views-row, article, .event-item',
      ).toArray();

      if (eventItems.length === 0 && page > 1) break;

      for (const item of eventItems) {
        const $item = $(item);
        const title = $item.find('h2, h3, h4, [class*="title"]').first().text().trim();
        if (!title) continue;

        const dateText = $item.find('[class*="date"], time, .field-date').first().text().trim();
        const datetime = $item.find("time").attr("datetime") ?? "";
        const venue = $item.find('[class*="venue"], [class*="location"]').first().text().trim();
        const description = $item.find('[class*="desc"], [class*="summary"], p').first().text().trim();
        const link = $item.find("a").first().attr("href");
        const imageUrl = $item.find("img").first().attr("src");

        const startDate = datetime || parseLooseDate(dateText);
        if (!startDate) continue;

        events.push(
          buildScrapedEvent(
            {
              title,
              description,
              startDate,
              venue: venue || "City of Orlando",
              city: "Orlando",
              url: link ? resolveUrl(link) : undefined,
              imageUrl: imageUrl ? resolveUrl(imageUrl) : undefined,
            },
            "co",
            "orlando.gov",
          ),
        );
      }
    }

    logger.success(`Scraped ${events.length} events from City of Orlando`);
  } catch (err) {
    logger.error(
      `City of Orlando scrape failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return events;
}

/** Resolve a potentially relative URL against the base. */
function resolveUrl(href: string): string {
  if (href.startsWith("http")) return href;
  return `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
}

/** Attempt to parse a loose date string into ISO 8601. */
function parseLooseDate(text: string): string {
  if (!text) return "";
  const d = new Date(text);
  if (isNaN(d.getTime())) return "";
  return d.toISOString();
}
