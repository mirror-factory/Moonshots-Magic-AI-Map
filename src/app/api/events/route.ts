/**
 * @module api/events
 * `GET /api/events` — REST endpoint for querying events. Supports query
 * params: `query`, `category`, `startDate`, `endDate`, `city`, `region`,
 * `tags`, `status`, `featured`, `limit`, `offset`.
 * Returns `{ count, events }`.
 */

import { NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/registries/events";
import type { EventCategory, EventFilters } from "@/lib/registries/types";

/**
 * Handles GET requests for querying events with optional filters.
 *
 * @param req - The incoming request with search params.
 * @returns JSON response with event count and matching events.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const filters: EventFilters = {};

  const query = params.get("query");
  if (query) filters.query = query;

  const category = params.get("category");
  if (category) {
    filters.category = category.includes(",")
      ? (category.split(",") as EventCategory[])
      : (category as EventCategory);
  }

  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  if (startDate && endDate) {
    filters.dateRange = { start: startDate, end: endDate };
  }

  const city = params.get("city");
  if (city) filters.city = city;

  const region = params.get("region");
  if (region) filters.region = region;

  const tags = params.get("tags");
  if (tags) filters.tags = tags.split(",");

  const status = params.get("status");
  if (status) filters.status = status as EventFilters["status"];

  const featured = params.get("featured");
  if (featured) filters.featured = featured === "true";

  const limit = params.get("limit");
  if (limit) filters.limit = parseInt(limit, 10);

  const offset = params.get("offset");
  if (offset) filters.offset = parseInt(offset, 10);

  const events = getEvents(filters);

  return NextResponse.json({ count: events.length, events });
}
