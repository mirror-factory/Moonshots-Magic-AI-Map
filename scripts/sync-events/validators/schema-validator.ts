/**
 * @module sync-events/validators/schema-validator
 * Validates required fields and format constraints on EventEntry objects.
 * Events missing required fields or with invalid formats are excluded.
 */

import type { EventEntry } from "../../../src/lib/registries/types";

/** Result of schema validation. */
export interface SchemaValidationResult {
  valid: boolean;
  reasons: string[];
}

/** HTTP/HTTPS URL pattern. */
const URL_PATTERN = /^https?:\/\/.+/;

/** ISO 8601 date pattern (basic check). */
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

/**
 * Validate that an event has all required fields with valid formats.
 * @param event - Event entry to validate.
 * @returns Validation result with reasons for failure.
 */
export function validateSchema(event: EventEntry): SchemaValidationResult {
  const reasons: string[] = [];

  // Required string fields
  if (!event.id) reasons.push("missing id");
  if (!event.title?.trim()) reasons.push("missing title");
  if (!event.venue?.trim()) reasons.push("missing venue");
  if (!event.startDate) reasons.push("missing startDate");

  // Coordinates must be a 2-element array
  if (
    !event.coordinates ||
    !Array.isArray(event.coordinates) ||
    event.coordinates.length !== 2
  ) {
    reasons.push("missing or invalid coordinates");
  }

  // Source must exist
  if (!event.source?.type) reasons.push("missing source type");

  // URL format validation (only if URL is provided)
  if (event.url && !URL_PATTERN.test(event.url)) {
    reasons.push(`invalid URL format: ${event.url}`);
  }

  // Date format validation
  if (event.startDate && !ISO_DATE_PATTERN.test(event.startDate)) {
    reasons.push(`invalid startDate format: ${event.startDate}`);
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
