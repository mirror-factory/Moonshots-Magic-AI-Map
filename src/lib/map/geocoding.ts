/**
 * @module lib/map/geocoding
 * MapTiler Geocoding API client for forward search with autocomplete.
 * Also provides local venue search from the app's event data.
 * Used by the map search bar component.
 */

/** A single geocoding result feature. */
export interface GeocodingResult {
  /** Unique feature ID. */
  id: string;
  /** Display name of the place. */
  placeName: string;
  /** Short text (first line in autocomplete). */
  text: string;
  /** Coordinates [lng, lat]. */
  center: [number, number];
  /** Place type (e.g. "poi", "address", "place"). */
  placeType: string;
}

/** A local venue entry for search. */
export interface LocalVenue {
  /** Venue name. */
  name: string;
  /** Address string. */
  address: string;
  /** Coordinates [lng, lat]. */
  coordinates: [number, number];
}

/** MapTiler Geocoding API response feature. */
interface GeocodingFeature {
  id: string;
  place_name: string;
  text: string;
  center: [number, number];
  place_type: string[];
}

/** Default proximity point — Downtown Orlando [lng, lat]. */
const ORLANDO_CENTER: [number, number] = [-81.3780, 28.5431];

/** Forward geocode a query string using the MapTiler Geocoding API. */
export async function geocodeForward(
  query: string,
  options: {
    /** Bias results toward this point [lng, lat]. */
    proximity?: [number, number];
    /** Max results (1–10). */
    limit?: number;
    /** Include POI types in results. */
    types?: string[];
  } = {},
): Promise<GeocodingResult[]> {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (!key) {
    console.warn("[Geocoding] No MapTiler API key configured");
    return [];
  }

  if (!query.trim()) return [];

  // Use proximity to bias results toward Orlando area.
  // bbox parameter is NOT supported by MapTiler Geocoding and breaks the API.
  const prox = options.proximity ?? ORLANDO_CENTER;

  const params = new URLSearchParams({
    key,
    autocomplete: "true",
    language: "en",
    limit: String(options.limit ?? 5),
    proximity: `${prox[0]},${prox[1]}`,
    country: "us",
  });

  if (options.types?.length) {
    params.set("types", options.types.join(","));
  }

  const encoded = encodeURIComponent(query.trim());
  const url = `https://api.maptiler.com/geocoding/${encoded}.json?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("[Geocoding] API error:", res.status);
      return [];
    }

    const data = await res.json();
    const features: GeocodingFeature[] = data.features ?? [];

    return features.map((f) => ({
      id: f.id,
      placeName: f.place_name,
      text: f.text,
      center: f.center,
      placeType: f.place_type[0] ?? "unknown",
    }));
  } catch (err) {
    console.warn("[Geocoding] Fetch error:", err);
    return [];
  }
}

/**
 * Searches local venue data with fuzzy substring matching.
 * Matches venue names against the query, scoring exact prefix matches higher.
 * @param query - Search query string.
 * @param venues - Deduplicated venue list from events.
 * @param limit - Max results to return.
 * @returns Matching venues as GeocodingResult entries.
 */
export function searchLocalVenues(
  query: string,
  venues: LocalVenue[],
  limit: number = 5,
): GeocodingResult[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];

  const scored: { venue: LocalVenue; score: number }[] = [];

  for (const venue of venues) {
    const name = venue.name.toLowerCase();

    // Exact match
    if (name === q) {
      scored.push({ venue, score: 100 });
      continue;
    }

    // Starts with query
    if (name.startsWith(q)) {
      scored.push({ venue, score: 80 });
      continue;
    }

    // Word boundary match (e.g. "beacham" matches "The Beacham")
    const words = name.split(/\s+/);
    if (words.some((w) => w.startsWith(q))) {
      scored.push({ venue, score: 60 });
      continue;
    }

    // Contains substring
    if (name.includes(q)) {
      scored.push({ venue, score: 40 });
      continue;
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ venue }) => ({
      id: `local-${venue.name}`,
      placeName: venue.address || venue.name,
      text: venue.name,
      center: venue.coordinates,
      placeType: "poi",
    }));
}
