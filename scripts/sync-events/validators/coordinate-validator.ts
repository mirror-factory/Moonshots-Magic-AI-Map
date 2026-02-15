/**
 * @module sync-events/validators/coordinate-validator
 * Validates event coordinates fall within the Orlando metro bounding box.
 * Rejects events outside the area, with null/zero coords, or at the
 * generic downtown Orlando fallback.
 */

/**
 * Central Florida bounding box — covers the 50-mile TM search radius.
 * Includes: Orlando, Daytona Beach, Lakeland, Deland, Sanford, Melbourne,
 * Kissimmee, Winter Park, St. Cloud, Cocoa, The Villages.
 * Excludes: Tampa, Jacksonville, Miami, and non-FL locations.
 */
const BOUNDS = {
  latMin: 27.90,
  latMax: 29.35,
  lngMin: -82.10,
  lngMax: -80.50,
} as const;

/** Known downtown Orlando fallback coordinates. */
const DOWNTOWN_FALLBACK_LAT = 28.5383;
const DOWNTOWN_FALLBACK_LNG = -81.3792;

/** Result of coordinate validation. */
export interface CoordValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate that coordinates are within the Orlando metro bounding box.
 * Rejects null/zero, downtown fallback, and out-of-bounds coordinates.
 * @param lat - Latitude value.
 * @param lng - Longitude value.
 * @returns Validation result with reason if invalid.
 */
export function validateCoordinates(lat: number, lng: number): CoordValidationResult {
  // Reject null, undefined, NaN, or zero
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return { valid: false, reason: "missing or zero coordinates" };
  }

  // Reject exact downtown Orlando fallback (indicates unresolved venue)
  if (lat === DOWNTOWN_FALLBACK_LAT && lng === DOWNTOWN_FALLBACK_LNG) {
    return { valid: false, reason: "downtown Orlando fallback coordinates" };
  }

  // Reject out-of-bounds
  if (lat < BOUNDS.latMin || lat > BOUNDS.latMax || lng < BOUNDS.lngMin || lng > BOUNDS.lngMax) {
    return {
      valid: false,
      reason: `outside Orlando metro bounds (lat: ${lat}, lng: ${lng})`,
    };
  }

  return { valid: true };
}
