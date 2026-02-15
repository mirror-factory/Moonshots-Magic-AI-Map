/**
 * @module sync-events/fetchers/visit-orlando
 * Scrapes events from visitorlando.com/events.
 * Note: Visit Orlando may use partial JS rendering; we scrape the
 * server-rendered HTML which typically includes the initial event listing.
 */

import * as cheerio from "cheerio";
import type { EventEntry } from "../../../src/lib/registries/types";
import { buildScrapedEvent } from "../normalizers/scraper-normalizer";
import { createRateLimitedFetch } from "../utils/rate-limiter";
import { logger } from "../utils/logger";

const BASE_URL = "https://www.visitorlando.com";
const EVENTS_PATH = "/events";
const RATE_LIMIT_MS = 2000; // robots.txt crawl-delay: 2

/**
 * Scrape events from Visit Orlando website.
 * @returns Array of normalized EventEntry objects.
 */
export async function fetchVisitOrlandoEvents(): Promise<EventEntry[]> {
  logger.section("Visit Orlando Scraper");
  const rateFetch = createRateLimitedFetch(RATE_LIMIT_MS, "VisitOrlando");
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

      // Visit Orlando uses various card layouts — try common selectors
      const eventCards = $(
        '[class*="event-card"], [class*="listing-card"], .card, article, [data-event]',
      ).toArray();

      if (eventCards.length === 0 && page > 1) break;

      for (const card of eventCards) {
        const $card = $(card);
        const title = $card.find('h2, h3, h4, [class*="title"]').first().text().trim();
        if (!title || title.length < 3) continue;

        const dateText = $card
          .find('[class*="date"], time, [datetime], [class*="when"]')
          .first()
          .text()
          .trim();
        const datetime = $card.find("time").attr("datetime") ?? "";
        const venue = $card
          .find('[class*="venue"], [class*="location"], [class*="where"]')
          .first()
          .text()
          .trim();
        const description = $card
          .find('[class*="desc"], [class*="summary"], p')
          .first()
          .text()
          .trim();
        const link = $card.find("a").first().attr("href");
        const imageUrl =
          $card.find("img").first().attr("data-src") ??
          $card.find("img").first().attr("src");
        const categoryText = $card
          .find('[class*="category"], [class*="tag"], [class*="type"]')
          .first()
          .text()
          .trim();

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
            "vo",
            "visitorlando.com",
          ),
        );
      }
    }

    logger.success(`Scraped ${events.length} events from Visit Orlando`);
  } catch (err) {
    logger.error(
      `Visit Orlando scrape failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return events;
}

/** Resolve a potentially relative URL against the base. */
function resolveUrl(href: string): string {
  if (href.startsWith("http")) return href;
  return `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
}

/** Attempt to parse a loose date string into ISO 8601 (Eastern → UTC). */
function parseLooseDate(text: string): string {
  if (!text) return "";
  const d = new Date(text);
  if (isNaN(d.getTime())) return "";
  // Treat parsed time as Eastern and convert to UTC
  const month = d.getMonth();
  const etOffset = (month >= 2 && month <= 10) ? 4 : 5;
  return new Date(Date.UTC(d.getFullYear(), month, d.getDate(), d.getHours() + etOffset, d.getMinutes())).toISOString();
}
