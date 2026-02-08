/**
 * @module map/routing
 * OpenRouteService Directions API wrapper. Fetches driving/walking/cycling
 * routes and returns GeoJSON linestrings with ETA and distance metadata.
 */

import { ORS_API_BASE } from "./config";

/** Supported travel profiles for the ORS Directions API. */
export type TravelProfile = "driving-car" | "foot-walking" | "cycling-regular";

/** A single turn-by-turn instruction step. */
export interface RouteStep {
  /** Distance in meters for this step. */
  distance: number;
  /** Duration in seconds for this step. */
  duration: number;
  /** Human-readable instruction text. */
  instruction: string;
}

/** Result from a directions query. */
export interface DirectionsResult {
  /** Route geometry as a GeoJSON LineString. */
  geometry: GeoJSON.LineString;
  /** Total route duration in seconds. */
  duration: number;
  /** Total route distance in meters. */
  distance: number;
  /** Turn-by-turn steps. */
  steps: RouteStep[];
  /** Bounding box [minLng, minLat, maxLng, maxLat]. */
  bbox: [number, number, number, number];
}

/**
 * Fetches directions between two points from OpenRouteService.
 *
 * @param from - Origin as `[longitude, latitude]`.
 * @param to - Destination as `[longitude, latitude]`.
 * @param profile - Travel mode (default: `"driving-car"`).
 * @returns Directions result with geometry, ETA, distance, and steps.
 * @throws Error if the API key is missing or the request fails.
 */
export async function getDirections(
  from: [number, number],
  to: [number, number],
  profile: TravelProfile = "driving-car",
): Promise<DirectionsResult> {
  const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_ORS_API_KEY is not configured");
  }

  const response = await fetch(`${ORS_API_BASE}/directions/${profile}/geojson`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      coordinates: [from, to],
      instructions: true,
      units: "mi",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`ORS Directions API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as {
    features: Array<{
      geometry: GeoJSON.LineString;
      properties: {
        summary: { distance: number; duration: number };
        segments: Array<{
          steps: Array<{
            distance: number;
            duration: number;
            instruction: string;
          }>;
        }>;
      };
    }>;
    bbox: number[];
  };

  const feature = data.features[0];
  if (!feature) {
    throw new Error("No route found between the specified points");
  }

  const { summary, segments } = feature.properties;
  const steps = segments.flatMap((seg) =>
    seg.steps.map((s) => ({
      distance: s.distance,
      duration: s.duration,
      instruction: s.instruction,
    })),
  );

  return {
    geometry: feature.geometry,
    duration: summary.duration,
    distance: summary.distance,
    steps,
    bbox: data.bbox as [number, number, number, number],
  };
}

/**
 * Formats a duration in seconds to a human-readable string.
 *
 * @param seconds - Duration in seconds.
 * @returns Formatted string like "5 min", "1 hr 23 min".
 */
export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainder = mins % 60;
  return remainder > 0 ? `${hrs} hr ${remainder} min` : `${hrs} hr`;
}

/**
 * Formats a distance in meters to a human-readable string.
 *
 * @param meters - Distance in meters.
 * @returns Formatted string like "0.5 mi", "3.2 mi".
 */
export function formatDistance(meters: number): string {
  const miles = meters / 1609.344;
  return `${miles.toFixed(1)} mi`;
}
