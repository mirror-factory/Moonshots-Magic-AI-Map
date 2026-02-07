/**
 * @module registries/eventbrite-parser
 * Transforms raw Eventbrite API responses into the EventEntry shape.
 * Maps Eventbrite category/subcategory IDs to our EventCategory values.
 */

import type { EventEntry, EventCategory } from "./types";

/**
 * Maps Eventbrite category IDs to our EventCategory values.
 * @see https://www.eventbrite.com/platform/api#/reference/categories
 */
const EVENTBRITE_CATEGORY_MAP: Record<string, EventCategory> = {
  "103": "music",        // Music
  "105": "arts",         // Performing & Visual Arts
  "104": "arts",         // Film, Media & Entertainment
  "108": "sports",       // Sports & Fitness
  "110": "food",         // Food & Drink
  "102": "tech",         // Science & Technology
  "113": "community",    // Community & Culture
  "115": "family",       // Family & Education
  "109": "outdoor",      // Travel & Outdoor
  "107": "education",    // Health & Wellness
  "106": "festival",     // Fashion & Beauty
  "111": "nightlife",    // Nightlife
  "114": "community",    // Religion & Spirituality
  "112": "community",    // Government & Politics
  "116": "community",    // Charity & Causes
  "199": "other",        // Other
  "101": "community",    // Business & Professional
};

/** Shape of a raw Eventbrite event from the API. */
interface EventbriteRawEvent {
  id?: string;
  name?: { text?: string };
  description?: { text?: string };
  start?: { utc?: string; timezone?: string };
  end?: { utc?: string };
  url?: string;
  logo?: { url?: string };
  category_id?: string;
  subcategory_id?: string;
  is_free?: boolean;
  venue?: {
    name?: string;
    address?: {
      address_1?: string;
      city?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
  };
}

/**
 * Parses a raw Eventbrite event into our EventEntry shape.
 * @param raw - Raw event data from the Eventbrite API.
 * @returns Normalized EventEntry.
 */
export function parseEventbriteEvent(raw: EventbriteRawEvent): EventEntry {
  const categoryId = raw.category_id || "199";
  const category: EventCategory = EVENTBRITE_CATEGORY_MAP[categoryId] || "other";

  const lat = raw.venue?.address?.latitude ? parseFloat(raw.venue.address.latitude) : 28.5383;
  const lng = raw.venue?.address?.longitude ? parseFloat(raw.venue.address.longitude) : -81.3792;

  const now = new Date().toISOString();

  return {
    id: `eb-${raw.id || "unknown"}`,
    title: raw.name?.text || "Untitled Event",
    description: raw.description?.text || "",
    category,
    coordinates: [lng, lat],
    venue: raw.venue?.name || "Unknown Venue",
    address: raw.venue?.address?.address_1 || "",
    city: raw.venue?.address?.city || "Orlando",
    region: raw.venue?.address?.region || "Central Florida",
    startDate: raw.start?.utc || now,
    endDate: raw.end?.utc,
    timezone: raw.start?.timezone || "America/New_York",
    price: raw.is_free
      ? { min: 0, max: 0, currency: "USD", isFree: true }
      : undefined,
    url: raw.url,
    imageUrl: raw.logo?.url,
    tags: [],
    source: { type: "scraper", site: "eventbrite.com", fetchedAt: now },
    sourceId: raw.id,
    createdAt: now,
    updatedAt: now,
    status: "active",
  };
}
