/**
 * @module lib/map/camera-utils
 * Unified camera navigation utilities for MapLibre GL.
 * Single source of truth for all flyTo, fitBounds, and coordinate validation.
 * Used by flyover engine, presentation, chat map actions, and show-on-map.
 */

import type { Map as MaplibreMap, LngLatBoundsLike } from "maplibre-gl";

/** Default camera parameters for cinematic navigation. */
const DEFAULTS = {
  zoom: 14,
  pitch: 50,
  bearing: 0,
  duration: 1500,
  curve: 1.42,
} as const;

/** Options for {@link flyToPoint}. */
export interface FlyToOptions {
  /** Target zoom level. */
  zoom?: number;
  /** Camera pitch in degrees. */
  pitch?: number;
  /** Camera bearing in degrees. */
  bearing?: number;
  /** Animation duration in milliseconds. */
  duration?: number;
  /** Easing curve factor. */
  curve?: number;
  /** Whether the animation is essential (cannot be interrupted by user). */
  essential?: boolean;
}

/** Options for {@link fitBoundsToPoints}. */
export interface FitBoundsOptions {
  /** Padding around the bounds in pixels. */
  padding?: number | { top: number; bottom: number; left: number; right: number };
  /** Maximum zoom level when fitting. */
  maxZoom?: number;
  /** Animation duration in milliseconds. */
  duration?: number;
}

/**
 * Validates that coordinates are a valid [lng, lat] pair.
 * @param coords - Coordinates to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidCoordinates(coords: unknown): coords is [number, number] {
  if (!Array.isArray(coords) || coords.length !== 2) return false;
  const [lng, lat] = coords;
  if (typeof lng !== "number" || typeof lat !== "number") return false;
  if (Number.isNaN(lng) || Number.isNaN(lat)) return false;
  if (Math.abs(lng) > 180 || Math.abs(lat) > 90) return false;
  return true;
}

/**
 * Flies the map camera to a specific point with cinematic defaults.
 * This is the **single entry point** for all flyTo operations in the app.
 *
 * @param map - MapLibre map instance.
 * @param center - Target coordinates [lng, lat].
 * @param options - Animation options.
 * @returns Promise that resolves when the animation completes.
 */
export function flyToPoint(
  map: MaplibreMap,
  center: [number, number],
  options: FlyToOptions = {},
): Promise<void> {
  if (!isValidCoordinates(center)) {
    console.warn("[camera-utils] Invalid coordinates:", center);
    return Promise.resolve();
  }

  map.stop();

  const {
    zoom = DEFAULTS.zoom,
    pitch = DEFAULTS.pitch,
    bearing = DEFAULTS.bearing,
    duration = DEFAULTS.duration,
    curve = DEFAULTS.curve,
    essential = true,
  } = options;

  return new Promise((resolve) => {
    let resolved = false;

    const done = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      map.off("moveend", onMoveEnd);
      resolve();
    };

    const onMoveEnd = () => done();
    map.on("moveend", onMoveEnd);

    // Fallback timeout in case moveend never fires (camera already at target)
    const timer = setTimeout(done, duration + 500);

    map.flyTo({
      center,
      zoom,
      pitch,
      bearing,
      duration,
      curve,
      essential,
    });
  });
}

/**
 * Fits the map bounds to contain all given coordinate points.
 *
 * @param map - MapLibre map instance.
 * @param coordinates - Array of [lng, lat] coordinate pairs.
 * @param options - Fit bounds options.
 * @returns Promise that resolves when the animation completes.
 */
export function fitBoundsToPoints(
  map: MaplibreMap,
  coordinates: [number, number][],
  options: FitBoundsOptions = {},
): Promise<void> {
  const validCoords = coordinates.filter(isValidCoordinates);

  if (validCoords.length === 0) {
    console.warn("[camera-utils] No valid coordinates for fitBounds");
    return Promise.resolve();
  }

  // Single point — just flyTo
  if (validCoords.length === 1) {
    return flyToPoint(map, validCoords[0], { duration: options.duration });
  }

  map.stop();

  const {
    padding = { top: 100, bottom: 100, left: 100, right: 100 },
    maxZoom = 16,
    duration = 1200,
  } = options;

  // Calculate bounds
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const [lng, lat] of validCoords) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }

  const bounds: LngLatBoundsLike = [[minLng, minLat], [maxLng, maxLat]];

  return new Promise((resolve) => {
    let resolved = false;

    const done = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      map.off("moveend", onMoveEnd);
      resolve();
    };

    const onMoveEnd = () => done();
    map.on("moveend", onMoveEnd);
    const timer = setTimeout(done, duration + 500);

    map.fitBounds(bounds, { padding, maxZoom, duration });
  });
}

/**
 * Calculates the center point of multiple coordinates.
 * @param coordinates - Array of [lng, lat] coordinate pairs.
 * @returns Center point [lng, lat], defaulting to Orlando if empty.
 */
export function calculateCenter(coordinates: [number, number][]): [number, number] {
  const valid = coordinates.filter(isValidCoordinates);
  if (valid.length === 0) return [-81.3792, 28.5383];

  const sum = valid.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0],
  );

  return [sum[0] / valid.length, sum[1] / valid.length];
}
