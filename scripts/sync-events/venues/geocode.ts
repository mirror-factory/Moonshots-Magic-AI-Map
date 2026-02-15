/**
 * @module sync-events/venues/geocode
 * Address-based geocoding via MapTiler Geocoding API.
 * Only accepts street-level results for Central Florida.
 */

const MAPTILER_GEOCODE_URL = "https://api.maptiler.com/geocoding";

/** Downtown Orlando proximity for biasing results. */
const PROXIMITY_LNG = -81.379;
const PROXIMITY_LAT = 28.538;

/** Central Florida bounding box for result validation. */
const BOUNDS = {
  minLat: 27.9,
  maxLat: 29.35,
  minLng: -82.1,
  maxLng: -80.5,
};

/** Rate limit delay between API calls (ms). */
const RATE_LIMIT_MS = 100;

/** In-memory geocode cache to avoid re-geocoding within a sync run. */
const geocodeCache = new Map<string, { lat: number; lng: number } | null>();

/** Last call timestamp for rate limiting. */
let lastCallTime = 0;

/**
 * Wait to respect rate limiting.
 */
async function rateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }
  lastCallTime = Date.now();
}

/**
 * Geocode an address string via MapTiler.
 * Only returns coordinates for street-level results within Central Florida.
 * @param address - Street address to geocode.
 * @param city - Optional city for context.
 * @returns Coordinates `{ lat, lng }` or null if not resolvable.
 */
export async function geocodeAddress(
  address: string,
  city?: string,
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.MAPTILER_API_KEY;
  if (!apiKey) return null;

  const query = city ? `${address}, ${city}, FL` : `${address}, FL`;
  const cacheKey = query.toLowerCase().trim();

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) ?? null;
  }

  await rateLimit();

  try {
    const params = new URLSearchParams({
      key: apiKey,
      proximity: `${PROXIMITY_LNG},${PROXIMITY_LAT}`,
      country: "us",
      limit: "1",
      types: "address",
    });

    const url = `${MAPTILER_GEOCODE_URL}/${encodeURIComponent(query)}.json?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json() as {
      features?: Array<{
        center?: [number, number];
        place_name?: string;
        relevance?: number;
      }>;
    };

    const feature = data.features?.[0];
    if (!feature?.center) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const [lng, lat] = feature.center;

    // Validate within Central Florida bounding box
    if (
      lat < BOUNDS.minLat ||
      lat > BOUNDS.maxLat ||
      lng < BOUNDS.minLng ||
      lng > BOUNDS.maxLng
    ) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    // Reject vague results (no street number in place name)
    const placeName = feature.place_name ?? "";
    const hasStreetNumber = /^\d/.test(placeName);
    if (!hasStreetNumber && (feature.relevance ?? 0) < 0.8) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const result = { lat, lng };
    geocodeCache.set(cacheKey, result);
    return result;
  } catch {
    geocodeCache.set(cacheKey, null);
    return null;
  }
}
