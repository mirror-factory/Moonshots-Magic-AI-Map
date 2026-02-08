/**
 * @module map/isochrone
 * OpenRouteService Isochrones API wrapper. Fetches travel-time polygons
 * for given time ranges and returns GeoJSON for map rendering.
 */

import { ORS_API_BASE } from "./config";
import type { TravelProfile } from "./routing";

/** Result from an isochrone query. */
export interface IsochroneResult {
  /** GeoJSON FeatureCollection of isochrone polygons. */
  geojson: GeoJSON.FeatureCollection;
  /** Center point used for the query. */
  center: [number, number];
  /** Time ranges in minutes. */
  ranges: number[];
  /** Travel profile used. */
  profile: TravelProfile;
}

/**
 * Fetches isochrone polygons from OpenRouteService.
 *
 * @param center - Center point as `[longitude, latitude]`.
 * @param minutes - Array of time ranges in minutes (e.g., [5, 10, 15, 30]).
 * @param profile - Travel mode (default: `"driving-car"`).
 * @returns Isochrone result with GeoJSON polygons for each time range.
 * @throws Error if the API key is missing or the request fails.
 */
export async function getIsochrone(
  center: [number, number],
  minutes: number[] = [5, 10, 15, 30],
  profile: TravelProfile = "driving-car",
): Promise<IsochroneResult> {
  const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_ORS_API_KEY is not configured");
  }

  const rangesInSeconds = minutes.map((m) => m * 60);

  const response = await fetch(`${ORS_API_BASE}/isochrones/${profile}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      locations: [center],
      range: rangesInSeconds,
      range_type: "time",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`ORS Isochrones API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as GeoJSON.FeatureCollection;

  // Add minutes property to each feature for styling
  const features = data.features.map((feature, index) => ({
    ...feature,
    properties: {
      ...feature.properties,
      minutes: minutes[minutes.length - 1 - index] ?? 0,
    },
  }));

  return {
    geojson: { ...data, features },
    center,
    ranges: minutes,
    profile,
  };
}
