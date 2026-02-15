/**
 * @module sync-events/venues/venue-lookup
 * Canonical venue coordinate lookup. Single source of truth for all normalizers.
 * Falls back to MapTiler geocoding for unknown venues.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { geocodeAddress } from "./geocode";

/** Shape of a venue entry in canonical-venues.json. */
interface CanonicalVenue {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

/** Loaded canonical venues keyed by slug. */
const venues: Record<string, CanonicalVenue> = JSON.parse(
  readFileSync(join(__dirname, "canonical-venues.json"), "utf-8"),
);

/** Full venue info returned by lookups. */
export interface VenueMatch {
  lat: number;
  lng: number;
  address: string;
}

/** Flattened alias → venue info lookup built from canonical venues. */
const aliasMap = new Map<string, VenueMatch>();

for (const [slug, venue] of Object.entries(venues)) {
  const info: VenueMatch = { lat: venue.lat, lng: venue.lng, address: venue.address };
  // Index by full name
  aliasMap.set(venue.name.toLowerCase(), info);
  // Index by slug (dashes → spaces) for partial matching
  const slugKey = slug.replace(/-/g, " ");
  if (!aliasMap.has(slugKey)) {
    aliasMap.set(slugKey, info);
  }
}

/**
 * Look up canonical venue info (coordinates + address) for a venue name.
 * Uses normalized substring matching (lowercase, strip "the", trim).
 * Returns null if no match — never falls back to downtown Orlando.
 * @param venueName - Venue name to look up.
 * @returns Venue info `{ lat, lng, address }` or null if not found.
 */
export function lookupVenueCoords(
  venueName: string,
): VenueMatch | null {
  const normalized = venueName
    .toLowerCase()
    .replace(/^the\s+/, "")
    .trim();

  if (!normalized) return null;

  // Exact match first
  for (const [key, coords] of aliasMap) {
    if (normalized === key) return coords;
  }

  // Substring match — venue name contains a canonical key
  for (const [key, coords] of aliasMap) {
    if (normalized.includes(key)) return coords;
  }

  // Reverse substring — canonical key contains the venue name
  for (const [key, coords] of aliasMap) {
    if (key.includes(normalized) && normalized.length >= 4) return coords;
  }

  return null;
}

/**
 * Look up venue coordinates with geocode fallback.
 * Tries canonical registry first, then geocodes the address via MapTiler.
 * @param venueName - Venue name to look up.
 * @param address - Street address for geocoding fallback.
 * @param city - City for geocoding context.
 * @returns Venue info `{ lat, lng, address }` or null if not found.
 */
export async function lookupVenueCoordsWithGeocode(
  venueName: string,
  address?: string,
  city?: string,
): Promise<VenueMatch | null> {
  // Try canonical registry first
  const canonical = lookupVenueCoords(venueName);
  if (canonical) return canonical;

  // Try geocoding the address
  if (address) {
    const geocoded = await geocodeAddress(address, city);
    if (geocoded) {
      return { lat: geocoded.lat, lng: geocoded.lng, address };
    }
  }

  // Try geocoding the venue name itself
  const geocodedByName = await geocodeAddress(venueName, city);
  if (geocodedByName) {
    return { lat: geocodedByName.lat, lng: geocodedByName.lng, address: "" };
  }

  return null;
}

/**
 * Get all canonical venue entries.
 * @returns Record of slug → venue data.
 */
export function getAllCanonicalVenues(): Record<string, CanonicalVenue> {
  return venues;
}
