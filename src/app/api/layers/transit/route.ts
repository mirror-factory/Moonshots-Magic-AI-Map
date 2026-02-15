/**
 * @module api/layers/transit
 * GET route that decodes LYNX GTFS-RT vehicle positions from protobuf to JSON.
 * Returns bus positions with route info for map rendering. 15-second cache.
 */

import { NextResponse } from "next/server";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

/** LYNX GTFS-RT vehicle position feed URL. */
const LYNX_FEED_URL = "http://gtfsrt.golynx.com/gtfsrt/GTFS_VehiclePositions.pb";

/** Decoded bus position data. */
interface BusPosition {
  vehicleId: string;
  routeId: string;
  latitude: number;
  longitude: number;
  bearing: number | null;
  speed: number | null;
  timestamp: number | null;
}

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 15 * 1000; // 15 seconds

/**
 * Fetches and decodes LYNX bus positions from GTFS-RT protobuf feed.
 * @returns JSON with bus positions array.
 */
export async function GET() {
  try {
    // Return cached if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=15" },
      });
    }

    const res = await fetch(LYNX_FEED_URL, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`LYNX feed returned ${res.status}`);
    }

    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer),
    );

    const buses: BusPosition[] = [];

    for (const entity of feed.entity) {
      const vehicle = entity.vehicle;
      if (!vehicle?.position) continue;

      buses.push({
        vehicleId: vehicle.vehicle?.id || entity.id || "unknown",
        routeId: vehicle.trip?.routeId || "unknown",
        latitude: vehicle.position.latitude,
        longitude: vehicle.position.longitude,
        bearing: vehicle.position.bearing ?? null,
        speed: vehicle.position.speed ?? null,
        timestamp: vehicle.timestamp
          ? Number(vehicle.timestamp)
          : null,
      });
    }

    const responseData = {
      buses,
      busCount: buses.length,
      routeCount: new Set(buses.map((b) => b.routeId)).size,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=15" },
    });
  } catch (error) {
    console.error("[Transit] Error:", error);
    return NextResponse.json(
      { buses: [], busCount: 0, routeCount: 0, error: "Failed to fetch transit data" },
      { status: 500 },
    );
  }
}
