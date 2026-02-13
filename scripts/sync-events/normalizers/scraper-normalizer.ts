/**
 * @module sync-events/normalizers/scraper-normalizer
 * Shared helpers for normalizing scraped event data into EventEntry shape.
 */

import { createHash } from "node:crypto";
import type { EventEntry, EventCategory } from "../../../src/lib/registries/types";
import { inferCategoryFromText } from "../utils/category-mapper";

/** Known Orlando venue coordinates [lng, lat]. */
const VENUE_COORDS: Record<string, [number, number]> = {
  "dr. phillips center": [-81.3792, 28.5383],
  "amway center": [-81.3839, 28.5392],
  "camping world stadium": [-81.4019, 28.5392],
  "exploria stadium": [-81.3894, 28.5411],
  "kia center": [-81.3839, 28.5392],
  "lake eola": [-81.3730, 28.5431],
  "lake eola park": [-81.3730, 28.5431],
  "wall street plaza": [-81.3785, 28.5418],
  "church street": [-81.3798, 28.5402],
  "orlando museum of art": [-81.3687, 28.5728],
  "orlando science center": [-81.3680, 28.5724],
  "harry p. leu gardens": [-81.3559, 28.5688],
  "leu gardens": [-81.3559, 28.5688],
  "orlando city hall": [-81.3794, 28.5422],
  "central park winter park": [-81.3510, 28.5978],
  "park avenue winter park": [-81.3510, 28.5978],
  "ucf arena": [-81.1997, 28.6024],
  "addition financial arena": [-81.1997, 28.6024],
  "senor frogs": [-81.4714, 28.4381],
  "pointe orlando": [-81.4714, 28.4381],
  "international drive": [-81.4714, 28.4381],
  "icon park": [-81.4616, 28.4423],
  "universal studios": [-81.4684, 28.4747],
  "walt disney world": [-81.5639, 28.3852],
  "epcot": [-81.5494, 28.3747],
  "magic kingdom": [-81.5812, 28.4177],
  "animal kingdom": [-81.5903, 28.3553],
  "seaworld": [-81.4612, 28.4114],
  "florida mall": [-81.3827, 28.4718],
  "mills 50": [-81.3672, 28.5535],
  "thornton park": [-81.3696, 28.5393],
  "ivanhoe village": [-81.3740, 28.5611],
  "college park": [-81.3911, 28.5572],
  "audubon park": [-81.3422, 28.5545],
  "east end market": [-81.3423, 28.5546],
  "winter garden": [-81.5862, 28.5653],
  "winter park farmers market": [-81.3391, 28.5991],
  "mennello museum": [-81.3685, 28.5729],
  "bob carr theater": [-81.3823, 28.5381],
  "the plaza live": [-81.3659, 28.5552],
  "house of blues": [-81.5309, 28.3710],
  "hard rock live": [-81.4684, 28.4747],
  "will's pub": [-81.3669, 28.5546],
  "the social": [-81.3787, 28.5420],
  "the beacham": [-81.3785, 28.5418],
  "gilt": [-81.3787, 28.5420],
  "orlando vineland premium outlets": [-81.5122, 28.3890],
  "lake nona town center": [-81.2346, 28.3708],
  "celebration town center": [-81.5340, 28.3253],
  "maitland civic center": [-81.3629, 28.6259],
};

/** Default Orlando coordinates. */
const DEFAULT_COORDS: [number, number] = [-81.3792, 28.5383];

/**
 * Look up coordinates for a venue name.
 * @param venueName - Venue name to look up.
 * @returns [lng, lat] coordinates.
 */
export function lookupVenueCoords(venueName: string): [number, number] {
  const normalized = venueName.toLowerCase().trim();
  for (const [key, coords] of Object.entries(VENUE_COORDS)) {
    if (normalized.includes(key)) return coords;
  }
  return DEFAULT_COORDS;
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
 * @param input - Scraped event input.
 * @param idPrefix - Source prefix ("ow", "vo", "co").
 * @param siteName - Site name for source metadata.
 * @returns Normalized EventEntry.
 */
export function buildScrapedEvent(
  input: ScrapedEventInput,
  idPrefix: string,
  siteName: string,
): EventEntry {
  const now = new Date().toISOString();
  const hash = generateScrapedId(input.title, input.startDate);
  const combinedText = [input.title, input.categoryText ?? "", input.description].join(" ");
  const category: EventCategory = inferCategoryFromText(combinedText);
  const coords = lookupVenueCoords(input.venue);

  return {
    id: `${idPrefix}-${hash}`,
    title: input.title,
    description: input.description,
    category,
    coordinates: coords,
    venue: input.venue,
    address: input.address ?? "",
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
