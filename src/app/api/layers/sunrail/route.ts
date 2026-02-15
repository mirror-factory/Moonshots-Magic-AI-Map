/**
 * @module api/layers/sunrail
 * GET route that returns SunRail commuter rail stops and route geometry.
 * Uses hardcoded station data since SunRail GTFS static is intermittent.
 * Long cache (24h) since stations don't change.
 */

import { NextResponse } from "next/server";

/** SunRail station data (16 stations, DeBary to Poinciana). */
const SUNRAIL_STATIONS = [
  { name: "DeBary", lat: 28.8600, lng: -81.3136, zone: "north" },
  { name: "Sanford", lat: 28.8123, lng: -81.2695, zone: "north" },
  { name: "Lake Mary", lat: 28.7588, lng: -81.3178, zone: "north" },
  { name: "Longwood", lat: 28.7031, lng: -81.3385, zone: "north" },
  { name: "Altamonte Springs", lat: 28.6614, lng: -81.3651, zone: "north" },
  { name: "Maitland", lat: 28.6275, lng: -81.3633, zone: "central" },
  { name: "Winter Park / Amtrak", lat: 28.5994, lng: -81.3523, zone: "central" },
  { name: "Florida Hospital Health Village", lat: 28.5758, lng: -81.3720, zone: "central" },
  { name: "LYNX Central / Church Street", lat: 28.5411, lng: -81.3792, zone: "central" },
  { name: "Orlando Health / Amtrak", lat: 28.5270, lng: -81.3825, zone: "central" },
  { name: "Sand Lake Road", lat: 28.4517, lng: -81.3754, zone: "south" },
  { name: "Meadow Woods", lat: 28.3913, lng: -81.3668, zone: "south" },
  { name: "Tupperware / Kissimmee", lat: 28.3419, lng: -81.3908, zone: "south" },
  { name: "Kissimmee / Amtrak", lat: 28.3040, lng: -81.4076, zone: "south" },
  { name: "Poinciana", lat: 28.2398, lng: -81.4611, zone: "south" },
];

/** SunRail brand colors. */
const ZONE_COLORS: Record<string, string> = {
  north: "#E31837",   // Red
  central: "#00A651", // Green
  south: "#005DAA",   // Blue
};

/**
 * Returns SunRail station data and route line.
 * @returns JSON with stations, route GeoJSON, and summary.
 */
export async function GET() {
  const stations = SUNRAIL_STATIONS.map((s, i) => ({
    id: `sunrail-${i}`,
    name: s.name,
    latitude: s.lat,
    longitude: s.lng,
    zone: s.zone,
    color: ZONE_COLORS[s.zone],
  }));

  // Route line connecting all stations in order
  const routeLine: GeoJSON.Feature = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: SUNRAIL_STATIONS.map((s) => [s.lng, s.lat]),
    },
    properties: { name: "SunRail Corridor" },
  };

  const responseData = {
    stations,
    routeLine,
    stationCount: stations.length,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(responseData, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
