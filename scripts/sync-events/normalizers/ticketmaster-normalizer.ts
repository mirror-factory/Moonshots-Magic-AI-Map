/**
 * @module sync-events/normalizers/ticketmaster-normalizer
 * Transforms Ticketmaster Discovery API responses into EventEntry shape.
 */

import type { EventEntry } from "../../../src/lib/registries/types";
import { mapTicketmasterCategory } from "../utils/category-mapper";

/** Shape of a Ticketmaster embedded event from the Discovery API. */
export interface TmEvent {
  id: string;
  name: string;
  url?: string;
  dates?: {
    start?: { dateTime?: string; localDate?: string; localTime?: string };
    end?: { dateTime?: string };
    timezone?: string;
  };
  info?: string;
  pleaseNote?: string;
  priceRanges?: Array<{
    min?: number;
    max?: number;
    currency?: string;
  }>;
  images?: Array<{ url?: string; width?: number; ratio?: string }>;
  classifications?: Array<{
    segment?: { name?: string };
    genre?: { name?: string };
    subGenre?: { name?: string };
  }>;
  _embedded?: {
    venues?: Array<{
      name?: string;
      address?: { line1?: string };
      city?: { name?: string };
      state?: { name?: string; stateCode?: string };
      location?: { longitude?: string; latitude?: string };
      timezone?: string;
    }>;
  };
}

/**
 * Pick the best image from Ticketmaster image array (prefer 16_9 ratio, largest).
 * @param images - Array of TM image objects.
 * @returns Best image URL or undefined.
 */
function pickBestImage(
  images?: TmEvent["images"],
): string | undefined {
  if (!images?.length) return undefined;
  const wide = images.filter((i) => i.ratio === "16_9");
  const pool = wide.length > 0 ? wide : images;
  const sorted = [...pool].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url;
}

/**
 * Infer the region from the city and state.
 * @param city - City name.
 * @param stateCode - Two-letter state code.
 * @returns Region string.
 */
function inferRegion(city?: string, stateCode?: string): string {
  if (!city) return "Central Florida";
  const lc = city.toLowerCase();
  if (lc === "orlando") return "Downtown Orlando";
  if (lc === "winter park") return "Winter Park";
  if (lc === "kissimmee") return "Kissimmee";
  if (lc === "sanford") return "Sanford";
  if (lc === "tampa" || lc === "st. petersburg") return "Tampa Bay";
  if (stateCode === "FL") return "Central Florida";
  return city;
}

/**
 * Build the canonical Ticketmaster event page URL from an event ID.
 * All Discovery API IDs (including `Za5ju3rKuq` resale/Universe IDs) resolve
 * via `https://www.ticketmaster.com/event/{id}`.
 *
 * @param id - Raw TM event ID (without `tm-` prefix).
 * @returns Canonical ticketmaster.com URL for the event.
 */
function buildTmUrl(id: string): string {
  return `https://www.ticketmaster.com/event/${id}`;
}

/**
 * Normalize a Ticketmaster event into our EventEntry shape.
 * @param tm - Raw Ticketmaster event object.
 * @returns Normalized EventEntry.
 */
export function normalizeTmEvent(tm: TmEvent): EventEntry {
  const venue = tm._embedded?.venues?.[0];
  const lat = venue?.location?.latitude
    ? parseFloat(venue.location.latitude)
    : 28.5383;
  const lng = venue?.location?.longitude
    ? parseFloat(venue.location.longitude)
    : -81.3792;

  const classification = tm.classifications?.[0];
  const category = mapTicketmasterCategory(
    classification?.segment?.name,
    classification?.genre?.name,
  );

  const now = new Date().toISOString();
  const startDate =
    tm.dates?.start?.dateTime ??
    (tm.dates?.start?.localDate
      ? `${tm.dates.start.localDate}T${tm.dates.start.localTime ?? "00:00:00"}`
      : now);

  const tags: string[] = [];
  if (classification?.genre?.name) tags.push(classification.genre.name.toLowerCase());
  if (classification?.subGenre?.name) tags.push(classification.subGenre.name.toLowerCase());

  const priceRange = tm.priceRanges?.[0];
  const price = priceRange
    ? {
        min: priceRange.min ?? 0,
        max: priceRange.max ?? 0,
        currency: priceRange.currency ?? "USD",
        isFree: (priceRange.min ?? 0) === 0 && (priceRange.max ?? 0) === 0,
      }
    : undefined;

  return {
    id: `tm-${tm.id}`,
    title: tm.name,
    description: tm.info ?? tm.pleaseNote ?? "",
    category,
    coordinates: [lng, lat],
    venue: venue?.name ?? "Unknown Venue",
    address: venue?.address?.line1 ?? "",
    city: venue?.city?.name ?? "Orlando",
    region: inferRegion(venue?.city?.name, venue?.state?.stateCode),
    startDate,
    endDate: tm.dates?.end?.dateTime,
    timezone: venue?.timezone ?? tm.dates?.timezone ?? "America/New_York",
    price,
    url: buildTmUrl(tm.id),
    imageUrl: pickBestImage(tm.images),
    tags,
    source: { type: "ticketmaster", fetchedAt: now },
    sourceId: tm.id,
    createdAt: now,
    updatedAt: now,
    status: "active",
  };
}
