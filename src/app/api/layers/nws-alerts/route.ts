/**
 * @module api/layers/nws-alerts
 * GET route that fetches active NWS weather alerts for central Florida.
 * Returns native GeoJSON polygon/multipolygon features with severity metadata.
 * 5-minute cache.
 */

import { NextResponse } from "next/server";

/** NWS API endpoint for active Florida alerts. */
const NWS_URL = "https://api.weather.gov/alerts/active?area=FL&status=actual&message_type=alert";

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 5 * 60 * 1000; // 5 minutes

/** Severity color mapping. */
const SEVERITY_COLORS: Record<string, string> = {
  Extreme: "#ff0000",
  Severe: "#ff6600",
  Moderate: "#ffcc00",
  Minor: "#00cc66",
  Unknown: "#999999",
};

/**
 * Fetches active NWS alerts for Florida, filtered to the Orlando metro area.
 * @returns JSON with GeoJSON features and summary.
 */
export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }

    const res = await fetch(NWS_URL, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "(moonshots-magic-ai-map, contact@moonshotsandmagic.com)",
        Accept: "application/geo+json",
      },
    });

    if (!res.ok) {
      throw new Error(`NWS API returned ${res.status}`);
    }

    const geojson = (await res.json()) as {
      features: Array<{
        properties: Record<string, unknown>;
        geometry: unknown;
      }>;
    };

    // Filter to Central Florida counties
    const centralFlCounties = new Set([
      "Orange", "Seminole", "Osceola", "Lake", "Volusia",
      "Brevard", "Polk", "Sumter",
    ]);

    const alerts = geojson.features
      .filter((f) => {
        const zones = String(f.properties.areaDesc || "");
        return centralFlCounties.size === 0 || Array.from(centralFlCounties).some((c) => zones.includes(c));
      })
      .map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          color: SEVERITY_COLORS[String(f.properties.severity)] ?? SEVERITY_COLORS.Unknown,
        },
      }));

    const responseData = {
      type: "FeatureCollection",
      features: alerts,
      alertCount: alerts.length,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch (error) {
    console.error("[NWS Alerts] Error:", error);
    return NextResponse.json(
      { type: "FeatureCollection", features: [], alertCount: 0, error: "Failed to fetch NWS alerts" },
      { status: 500 },
    );
  }
}
