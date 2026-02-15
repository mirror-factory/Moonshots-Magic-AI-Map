/**
 * @module sync-events/normalizers/scraper-normalizer
 * Shared helpers for normalizing scraped event data into EventEntry shape.
 */

import { createHash } from "node:crypto";
import type { EventEntry, EventCategory } from "../../../src/lib/registries/types";
import { inferCategoryFromText } from "../utils/category-mapper";
import { lookupVenueCoords, lookupVenueCoordsWithGeocode } from "../venues/venue-lookup";

/** Default Orlando coordinates (used when no canonical match found). */
const DEFAULT_COORDS: [number, number] = [-81.3792, 28.5383];

/**
 * Look up coordinates for a venue name using the canonical registry.
 * Synchronous version — falls back to downtown Orlando if no match.
 * @param venueName - Venue name to look up.
 * @returns [lng, lat] coordinates.
 */
export function lookupScraperVenueCoords(venueName: string): [number, number] {
  const match = lookupVenueCoords(venueName);
  if (match) return [match.lng, match.lat];
  return DEFAULT_COORDS;
}

/**
 * Look up coordinates with geocode fallback.
 * Async version that tries canonical registry then MapTiler geocoding.
 * @param venueName - Venue name to look up.
 * @param address - Optional address for geocoding.
 * @param city - Optional city for geocoding context.
 * @returns [lng, lat] coordinates.
 */
export async function lookupScraperVenueCoordsAsync(
  venueName: string,
  address?: string,
  city?: string,
): Promise<[number, number]> {
  const match = await lookupVenueCoordsWithGeocode(venueName, address, city);
  if (match) return [match.lng, match.lat];
  return DEFAULT_COORDS;
}

/**
 * Look up the canonical address for a venue name.
 * @param venueName - Venue name to look up.
 * @returns Canonical address or empty string if not found.
 */
function lookupScraperVenueAddress(venueName: string): string {
  const match = lookupVenueCoords(venueName);
  return match?.address ?? "";
}

/**
 * Generate a deterministic 8-char hex ID from title and date.
 * @param title - Event title.
 * @param date - Event date string.
 * @returns 8-character hex hash.
 */
export function generateScrapedId(title: string, date: string): string {
  const input = `${title}|${date}`;
  return createHash("sha256").update(input).digest("hex").slice(0, 8);
}

/** Input shape for building an EventEntry from scraped data. */
export interface ScrapedEventInput {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  venue: string;
  address?: string;
  city?: string;
  url?: string;
  imageUrl?: string;
  categoryText?: string;
  tags?: string[];
  allDay?: boolean;
}

/**
 * Build an EventEntry from scraped data.
 * Now async to support geocode fallback for unknown venues.
 * @param input - Scraped event input.
 * @param idPrefix - Source prefix ("ow", "vo", "co").
 * @param siteName - Site name for source metadata.
 * @returns Normalized EventEntry.
 */
export async function buildScrapedEvent(
  input: ScrapedEventInput,
  idPrefix: string,
  siteName: string,
): Promise<EventEntry> {
  const now = new Date().toISOString();
  const hash = generateScrapedId(input.title, input.startDate);
  const combinedText = [input.title, input.categoryText ?? "", input.description].join(" ");
  const category: EventCategory = inferCategoryFromText(combinedText);
  const coords = await lookupScraperVenueCoordsAsync(input.venue, input.address, input.city);

  return {
    id: `${idPrefix}-${hash}`,
    title: input.title,
    description: input.description,
    category,
    coordinates: coords,
    venue: input.venue,
    address: input.address || lookupScraperVenueAddress(input.venue),
    city: input.city ?? "Orlando",
    region: "Central Florida",
    startDate: input.startDate,
    endDate: input.endDate,
    allDay: input.allDay,
    timezone: "America/New_York",
    url: input.url,
    imageUrl: input.imageUrl,
    tags: input.tags ?? [],
    source: { type: "scraper", site: siteName, fetchedAt: now },
    createdAt: now,
    updatedAt: now,
    status: "active",
  };
}
