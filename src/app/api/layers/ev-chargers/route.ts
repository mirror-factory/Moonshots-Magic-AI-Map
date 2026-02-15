/**
 * @module api/layers/ev-chargers
 * GET route for NREL Alternative Fuels Station Locator (EV chargers near Orlando).
 * Requires NEXT_PUBLIC_NREL_API_KEY env var.
 * 1-hour cache since charger locations are relatively static.
 */

import { NextResponse } from "next/server";

/** NREL AFDC API base. */
const NREL_BASE = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json";

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 60 * 60 * 1000; // 1 hour

/** EV charger station. */
interface EvStation {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  evLevel1: number;
  evLevel2: number;
  dcFast: number;
  network: string;
  accessCode: string;
}

/**
 * Fetches EV charger locations near Orlando from NREL.
 * @returns JSON with station data.
 */
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_NREL_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { stations: [], error: "NEXT_PUBLIC_NREL_API_KEY not configured. Get a free key at https://developer.nrel.gov/signup/" },
      { status: 200 },
    );
  }

  try {
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=3600" },
      });
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      fuel_type: "ELEC",
      zip: "32801",
      radius: "20",
      limit: "200",
      status: "E",
    });

    const res = await fetch(`${NREL_BASE}?${params}`, {
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      throw new Error(`NREL API returned ${res.status}`);
    }

    const data = (await res.json()) as {
      fuel_stations?: Array<Record<string, unknown>>;
      alt_fuel_station?: Array<Record<string, unknown>>;
    };

    const stations: EvStation[] = (data.fuel_stations ?? data.alt_fuel_station ?? []).map((s) => ({
      id: Number(s.id),
      name: String(s.station_name || "Unknown"),
      address: String(s.street_address || ""),
      city: String(s.city || "Orlando"),
      latitude: Number(s.latitude),
      longitude: Number(s.longitude),
      evLevel1: Number(s.ev_level1_evse_num || 0),
      evLevel2: Number(s.ev_level2_evse_num || 0),
      dcFast: Number(s.ev_dc_fast_num || 0),
      network: String(s.ev_network || "Unknown"),
      accessCode: String(s.access_code || "public"),
    }));

    const responseData = {
      stations,
      stationCount: stations.length,
      totalPorts: stations.reduce((s, st) => s + st.evLevel1 + st.evLevel2 + st.dcFast, 0),
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (error) {
    console.error("[EV Chargers] Error:", error);
    return NextResponse.json(
      { stations: [], stationCount: 0, error: "Failed to fetch EV charger data" },
      { status: 500 },
    );
  }
}
