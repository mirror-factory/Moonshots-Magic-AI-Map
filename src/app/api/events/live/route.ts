/**
 * @module api/events/live
 * `GET /api/events/live` — Returns merged events from all available sources.
 * Uses 5-minute cache for performance. Combines static data with live
 * sources (Eventbrite when available).
 */

import { NextResponse } from "next/server";
import { defaultEventSource } from "@/lib/registries/event-source-adapter";

/**
 * Handles GET requests for live event data.
 * Merges all available event sources and returns deduplicated results.
 *
 * @returns JSON response with merged event list.
 */
export async function GET() {
  try {
    const events = await defaultEventSource.fetchEvents({ status: "active" });

    return NextResponse.json(
      { events, count: events.length, timestamp: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("[Live Events] Error fetching events:", error);
    return NextResponse.json(
      { events: [], count: 0, error: "Failed to fetch live events" },
      { status: 500 },
    );
  }
}
