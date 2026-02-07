/**
 * @module api/eventbrite/search
 * Eventbrite event search API route. Returns 503 if no API key is configured.
 * Uses the Eventbrite Destination Search API (v3/destination/search) since the
 * legacy /v3/events/search/ endpoint was deprecated.
 *
 * Falls back to organization events endpoint if an org ID is configured.
 */

import { NextResponse } from "next/server";
import { parseEventbriteEvent } from "@/lib/registries/eventbrite-parser";

const EVENTBRITE_TOKEN = process.env.EVENTBRITE_PRIVATE_TOKEN || process.env.EVENTBRITE_API_KEY;
const EVENTBRITE_BASE_URL = "https://www.eventbriteapi.com/v3";

/**
 * GET /api/eventbrite/search?lat=&lng=&radius=&q=
 * Searches Eventbrite events by location and query.
 * Uses EVENTBRITE_PRIVATE_TOKEN as OAuth Bearer token.
 *
 * NOTE: Requires a valid OAuth private token from
 * https://www.eventbrite.com/platform/api-keys (not the API Key ID).
 */
export async function GET(request: Request) {
  if (!EVENTBRITE_TOKEN) {
    return NextResponse.json(
      {
        error: "Eventbrite API token not configured",
        message: "Set EVENTBRITE_PRIVATE_TOKEN in your environment variables. See docs/EVENTBRITE-SETUP.md for instructions.",
      },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "25mi";
  const q = searchParams.get("q") || "";

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing required parameters: lat, lng" },
      { status: 400 },
    );
  }

  const headers = {
    Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
  };

  try {
    // Try the destination search endpoint first (current API)
    const destParams = new URLSearchParams({
      "latitude": lat,
      "longitude": lng,
      "within": radius,
      ...(q ? { "q": q } : {}),
      "dates": "current_future",
      "page_size": "20",
    });

    const destResponse = await fetch(
      `${EVENTBRITE_BASE_URL}/destination/search/?${destParams.toString()}`,
      {
        headers,
        next: { revalidate: 300 },
      },
    );

    if (destResponse.ok) {
      const data = await destResponse.json();
      const events = (data.events || []).map(parseEventbriteEvent);
      return NextResponse.json({
        events,
        pagination: {
          page: data.page_number || 1,
          pageCount: data.page_count || 1,
          totalCount: data.event_count || events.length,
        },
        source: "destination_search",
      });
    }

    // If destination search fails, try legacy search endpoint as fallback
    const legacyParams = new URLSearchParams({
      "location.latitude": lat,
      "location.longitude": lng,
      "location.within": radius,
      ...(q ? { "q": q } : {}),
      "expand": "venue",
    });

    const legacyResponse = await fetch(
      `${EVENTBRITE_BASE_URL}/events/search/?${legacyParams.toString()}`,
      {
        headers,
        next: { revalidate: 300 },
      },
    );

    if (legacyResponse.ok) {
      const data = await legacyResponse.json();
      const events = (data.events || []).map(parseEventbriteEvent);
      return NextResponse.json({
        events,
        pagination: {
          page: data.pagination?.page_number || 1,
          pageCount: data.pagination?.page_count || 1,
          totalCount: data.pagination?.object_count || events.length,
        },
        source: "legacy_search",
      });
    }

    // Both endpoints failed — return the error from destination search
    const errorText = await destResponse.text();

    // Check for auth errors specifically
    if (destResponse.status === 400 || destResponse.status === 401) {
      return NextResponse.json(
        {
          error: "Eventbrite authentication failed",
          message: "Your EVENTBRITE_PRIVATE_TOKEN may be invalid. Ensure you're using the OAuth Private Token (not the API Key ID) from https://www.eventbrite.com/platform/api-keys",
          details: errorText,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Eventbrite API error", details: errorText },
      { status: destResponse.status },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Eventbrite", details: String(error) },
      { status: 500 },
    );
  }
}
