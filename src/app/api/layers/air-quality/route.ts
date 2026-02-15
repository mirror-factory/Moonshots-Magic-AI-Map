/**
 * @module api/layers/air-quality
 * GET route for AirNow EPA air quality data near Orlando.
 * Requires NEXT_PUBLIC_AIRNOW_API_KEY env var.
 * 30-minute cache since AQI updates hourly.
 */

import { NextResponse } from "next/server";

/** AirNow observation API. */
const AIRNOW_BASE = "https://www.airnowapi.org/aq/observation/latLong/current/";

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 30 * 60 * 1000; // 30 minutes

/** AQI color mapping. */
const AQI_COLORS: Record<string, string> = {
  Good: "#00e400",
  Moderate: "#ffff00",
  "Unhealthy for Sensitive Groups": "#ff7e00",
  Unhealthy: "#ff0000",
  "Very Unhealthy": "#8f3f97",
  Hazardous: "#7e0023",
};

/**
 * Fetches current AQI readings near Orlando from AirNow.
 * @returns JSON with AQI observations.
 */
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_AIRNOW_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { observations: [], error: "NEXT_PUBLIC_AIRNOW_API_KEY not configured. Get a free key at https://docs.airnowapi.org/account/request/" },
      { status: 200 },
    );
  }

  try {
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=1800" },
      });
    }

    const params = new URLSearchParams({
      format: "application/json",
      latitude: "28.5383",
      longitude: "-81.3792",
      distance: "25",
      API_KEY: apiKey,
    });

    const res = await fetch(`${AIRNOW_BASE}?${params}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`AirNow API returned ${res.status}`);
    }

    const observations = (await res.json()) as Array<{
      DateObserved: string;
      HourObserved: number;
      ParameterName: string;
      AQI: number;
      Category: { Name: string; Number: number };
      Latitude: number;
      Longitude: number;
      ReportingArea: string;
      StateCode: string;
    }>;

    const mapped = observations.map((obs) => ({
      parameter: obs.ParameterName,
      aqi: obs.AQI,
      category: obs.Category.Name,
      color: AQI_COLORS[obs.Category.Name] ?? "#999999",
      latitude: obs.Latitude,
      longitude: obs.Longitude,
      area: obs.ReportingArea,
      dateObserved: obs.DateObserved,
      hourObserved: obs.HourObserved,
    }));

    const responseData = {
      observations: mapped,
      primaryAqi: mapped.find((o) => o.parameter === "PM2.5")?.aqi ?? mapped[0]?.aqi ?? 0,
      primaryCategory: mapped.find((o) => o.parameter === "PM2.5")?.category ?? mapped[0]?.category ?? "Unknown",
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=1800" },
    });
  } catch (error) {
    console.error("[Air Quality] Error:", error);
    return NextResponse.json(
      { observations: [], error: "Failed to fetch air quality data" },
      { status: 500 },
    );
  }
}
