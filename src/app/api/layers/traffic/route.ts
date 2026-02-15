/**
 * @module api/layers/traffic
 * GET route for TomTom traffic flow data near Orlando.
 * Requires NEXT_PUBLIC_TOMTOM_API_KEY env var.
 * Returns traffic incident GeoJSON. 2-minute cache.
 */

import { NextResponse } from "next/server";

/** TomTom Traffic Incidents API. */
const TOMTOM_BASE = "https://api.tomtom.com/traffic/services/5/incidentDetails";

/** Orlando bounding box. */
const BBOX = "28.35,-81.55,28.65,-81.15";

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Fetches traffic incidents from TomTom API.
 * @returns JSON with traffic incident data.
 */
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { incidents: [], error: "NEXT_PUBLIC_TOMTOM_API_KEY not configured. Get a free key at https://developer.tomtom.com" },
      { status: 200 },
    );
  }

  try {
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=120" },
      });
    }

    const url = `${TOMTOM_BASE}?key=${apiKey}&bbox=${BBOX}&fields=%7Bincidents%7Btype%2Cgeometry%7Bcoordinates%7D%2Cproperties%7BiconCategory%2CmagnitudeOfDelay%2Cevents%7Bdescription%7D%2CstartTime%2CendTime%7D%7D%7D&language=en-US&categoryFilter=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C14`;

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

    if (res.status === 403) {
      return NextResponse.json(
        { incidents: [], incidentCount: 0, error: "TomTom API key lacks traffic API access. Enable 'Traffic Flow' and 'Traffic Incidents' in your TomTom developer portal." },
        { status: 200 },
      );
    }

    if (!res.ok) {
      throw new Error(`TomTom API returned ${res.status}`);
    }

    const data = (await res.json()) as { incidents?: Array<Record<string, unknown>> };

    const incidents = (data.incidents ?? []).map((inc, i) => ({
      id: `traffic-${i}`,
      ...inc,
    }));

    const responseData = {
      incidents,
      incidentCount: incidents.length,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=120" },
    });
  } catch (error) {
    console.error("[Traffic] Error:", error);
    return NextResponse.json(
      { incidents: [], incidentCount: 0, error: "Failed to fetch traffic data" },
      { status: 500 },
    );
  }
}
