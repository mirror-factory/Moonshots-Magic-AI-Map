/**
 * @module sync-events/fetchers/orlando-weekly
 * Scrapes events from community.orlandoweekly.com.
 */

import * as cheerio from "cheerio";
import type { EventEntry } from "../../../src/lib/registries/types";
import { buildScrapedEvent } from "../normalizers/scraper-normalizer";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const BASE_URL = "https://community.orlandoweekly.com";
const EVENTS_PATH = "/events";
const RATE_LIMIT_MS = 1000;

/**
 * Scrape events from Orlando Weekly community events page.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchOrlandoWeeklyEvents(): Promise<EventEntry[]> {
  logger.section("Orlando Weekly Scraper");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "OrlandoWeekly");
  const events: EventEntry[] = [];
  const maxPages = 10;

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
      const eventCards = $('[class*="event"], .event-card, .listing, article').toArray();

      if (eventCards.length === 0 && page > 1) break;

      for (const card of eventCards) {
        const $card = $(card);
        const title = $card.find('h2, h3, [class*="title"]').first().text().trim();
        if (!title) continue;

        const dateText = $card.find('[class*="date"], time, [datetime]').first().text().trim();
        const datetime = $card.find("time").attr("datetime") ?? "";
        const venue = $card.find('[class*="venue"], [class*="location"]').first().text().trim();
        const description = $card.find('[class*="desc"], p').first().text().trim();
        const link = $card.find("a").first().attr("href");
        const imageUrl = $card.find("img").first().attr("src");
        const categoryText = $card.find('[class*="category"], [class*="tag"]').first().text().trim();

        const startDate = datetime || parseLooseDate(dateText);
        if (!startDate) continue;

        events.push(
          await buildScrapedEvent(
            {
              title,
              description,
              startDate,
              venue: venue || "Orlando",
              url: link ? resolveUrl(link) : undefined,
              imageUrl: imageUrl ? resolveUrl(imageUrl) : undefined,
              categoryText,
            },
            "ow",
            "community.orlandoweekly.com",
          ),
        );
      }
    }

    logger.success(`Scraped ${events.length} events from Orlando Weekly`);
  } catch (err) {
    logger.error(
      `Orlando Weekly scrape failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return events;
}

/** Resolve a potentially relative URL against the base. */
function resolveUrl(href: string): string {
  if (href.startsWith("http")) return href;
  return `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
}

/**
 * Attempt to parse a loose date string into ISO 8601.
 * @param text - Date text like "Feb 14, 2026" or "2026-02-14".
 * @returns ISO date string or empty string if unparseable.
 */
function parseLooseDate(text: string): string {
  if (!text) return "";
  const d = new Date(text);
  if (isNaN(d.getTime())) return "";
  // Treat parsed time as Eastern and convert to UTC
  const month = d.getMonth();
  const etOffset = (month >= 2 && month <= 10) ? 4 : 5;
  return new Date(Date.UTC(d.getFullYear(), month, d.getDate(), d.getHours() + etOffset, d.getMinutes())).toISOString();
}
