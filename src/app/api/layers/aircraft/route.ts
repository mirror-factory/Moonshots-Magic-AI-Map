/**
 * @module api/layers/aircraft
 * GET route that fetches live aircraft positions near Orlando (MCO) from OpenSky Network.
 * Anonymous access (no API key). 15-second cache.
 */

import { NextResponse } from "next/server";

/**
 * OpenSky Network bounding box around Orlando (roughly 50nm radius of MCO).
 * MCO coordinates: 28.4312, -81.3081
 */
const OPENSKY_URL =
  "https://opensky-network.org/api/states/all?lamin=27.9&lomin=-82.0&lamax=29.0&lomax=-80.8";

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 15 * 1000; // 15 seconds

/** Aircraft position data. */
interface AircraftPosition {
  icao24: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  velocity: number;
  onGround: boolean;
}

/**
 * Fetches live aircraft positions near MCO.
 * @returns JSON with aircraft array.
 */
export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=15" },
      });
    }

    const res = await fetch(OPENSKY_URL, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`OpenSky API returned ${res.status}`);
    }

    const data = (await res.json()) as {
      states: Array<Array<unknown>> | null;
    };

    const aircraft: AircraftPosition[] = (data.states ?? [])
      .filter(
        (s) =>
          s[6] != null &&
          s[5] != null &&
          typeof s[6] === "number" &&
          typeof s[5] === "number",
      )
      .map((s) => ({
        icao24: String(s[0]),
        callsign: String(s[1] ?? "").trim(),
        latitude: s[6] as number,
        longitude: s[5] as number,
        altitude: Math.round(((s[7] as number) ?? 0) * 3.281), // meters → feet
        heading: (s[10] as number) ?? 0,
        velocity: Math.round(((s[9] as number) ?? 0) * 1.944), // m/s → knots
        onGround: (s[8] as boolean) ?? false,
      }));

    const responseData = {
      aircraft,
      aircraftCount: aircraft.length,
      inFlight: aircraft.filter((a) => !a.onGround).length,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=15" },
    });
  } catch (error) {
    console.error("[Aircraft] Error:", error);
    return NextResponse.json(
      { aircraft: [], aircraftCount: 0, inFlight: 0, error: "Failed to fetch aircraft data" },
      { status: 500 },
    );
  }
}
