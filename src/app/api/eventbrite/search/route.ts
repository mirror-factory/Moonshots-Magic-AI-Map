/**
 * @module api/eventbrite/search
 * Eventbrite event search API route. Returns 503 if no API key is configured.
 * Searches Eventbrite and normalizes results to EventEntry shape.
 */

import { NextResponse } from "next/server";
import { parseEventbriteEvent } from "@/lib/registries/eventbrite-parser";

const EVENTBRITE_API_KEY = process.env.EVENTBRITE_API_KEY;
const EVENTBRITE_BASE_URL = "https://www.eventbriteapi.com/v3";

/**
 * GET /api/eventbrite/search?lat=&lng=&radius=&q=
 * Searches Eventbrite events by location and query.
 */
export async function GET(request: Request) {
  if (!EVENTBRITE_API_KEY) {
    return NextResponse.json(
      {
        error: "Eventbrite API key not configured",
        message: "Set EVENTBRITE_API_KEY in your environment variables. See docs/EVENTBRITE-SETUP.md for instructions.",
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

  try {
    const params = new URLSearchParams({
      "location.latitude": lat,
      "location.longitude": lng,
      "location.within": radius,
      "q": q,
      "expand": "venue",
    });

    const response = await fetch(
      `${EVENTBRITE_BASE_URL}/events/search/?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_API_KEY}`,
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Eventbrite API error", details: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();
    const events = (data.events || []).map(parseEventbriteEvent);

    return NextResponse.json({
      events,
      pagination: {
        page: data.pagination?.page_number || 1,
        pageCount: data.pagination?.page_count || 1,
        totalCount: data.pagination?.object_count || events.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Eventbrite", details: String(error) },
      { status: 500 },
    );
  }
}
