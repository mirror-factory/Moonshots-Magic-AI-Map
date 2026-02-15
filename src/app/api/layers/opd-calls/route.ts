/**
 * @module api/layers/opd-calls
 * GET route that fetches Orlando Police Department calls for service.
 * Uses Orlando Open Data Socrata API. 5-minute cache.
 */

import { NextResponse } from "next/server";

/**
 * OPD Calls for Service dataset on Socrata.
 * NOTE: The Orlando OPD calls dataset has been intermittently unavailable.
 * If the dataset ID changes, update here.
 */
const OPD_URL = "https://data.cityoforlando.net/resource/uum5-kxa3.json?$limit=200&$order=incident_datetime+DESC";

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 5 * 60 * 1000; // 5 minutes

/** Call type color mapping. */
const CALL_TYPE_COLORS: Record<string, string> = {
  DISTURBANCE: "#ef4444",
  SUSPICIOUS: "#f97316",
  TRAFFIC: "#eab308",
  THEFT: "#8b5cf6",
  ACCIDENT: "#3b82f6",
  MEDICAL: "#22c55e",
  FIRE: "#dc2626",
};

/**
 * Fetches recent OPD calls for service.
 * @returns JSON with call data points.
 */
export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }

    const res = await fetch(OPD_URL, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`OPD Socrata API returned ${res.status}`);
    }

    const records = (await res.json()) as Array<Record<string, unknown>>;

    const calls = records
      .filter((rec) => rec.location)
      .map((rec, i) => {
        // Socrata location field is { latitude, longitude }
        const loc = rec.location as { latitude?: string; longitude?: string } | undefined;
        const lat = Number(loc?.latitude);
        const lng = Number(loc?.longitude);

        if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

        const callType = String(rec.incident_type || rec.description || "Unknown").toUpperCase();
        const colorKey = Object.keys(CALL_TYPE_COLORS).find((k) => callType.includes(k));

        return {
          id: `opd-${rec.incident_id || i}`,
          type: String(rec.incident_type || rec.description || "Unknown"),
          address: String(rec.location_description || rec.address || ""),
          datetime: String(rec.incident_datetime || ""),
          latitude: lat,
          longitude: lng,
          color: colorKey ? CALL_TYPE_COLORS[colorKey] : "#94a3b8",
        };
      })
      .filter(Boolean);

    const responseData = {
      calls,
      callCount: calls.length,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch (error) {
    console.error("[OPD Calls] Error:", error);
    return NextResponse.json(
      { calls: [], callCount: 0, error: "Failed to fetch OPD calls" },
      { status: 500 },
    );
  }
}
