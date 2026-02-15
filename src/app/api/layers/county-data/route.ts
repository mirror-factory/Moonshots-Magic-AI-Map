/**
 * @module api/layers/county-data
 * GET route that fetches Orange County GIS data (parks, trails, public art, fire stations).
 * Uses OCGIS ArcGIS REST API — no authentication required.
 * 1-hour cache since this data changes infrequently.
 */

import { NextResponse } from "next/server";

/** OCGIS ArcGIS REST base URL. */
const OCGIS_BASE = "https://ocgis4.ocfl.net/arcgis/rest/services/Public_Dynamic/MapServer";

/** Layer IDs and their labels from the OCGIS service. */
const COUNTY_LAYERS = [
  { id: 30, label: "Parks", color: "#22c55e", icon: "park" },
  { id: 70, label: "Trails", color: "#84cc16", icon: "trail" },
  { id: 47, label: "Public Art", color: "#a855f7", icon: "art" },
  { id: 27, label: "Fire Stations", color: "#ef4444", icon: "fire" },
];

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 60 * 60 * 1000; // 1 hour

/** County data point. */
interface CountyPoint {
  id: string;
  category: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  color: string;
  icon: string;
}

/**
 * Fetches county data from OCGIS ArcGIS REST API.
 * @returns JSON with points organized by category.
 */
export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=3600" },
      });
    }

    const points: CountyPoint[] = [];

    // Fetch all layers in parallel
    const results = await Promise.allSettled(
      COUNTY_LAYERS.map(async (layer) => {
        const url = `${OCGIS_BASE}/${layer.id}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultRecordCount=100`;
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) throw new Error(`OCGIS layer ${layer.id} returned ${res.status}`);
        const geojson = (await res.json()) as GeoJSON.FeatureCollection;
        return { layer, geojson };
      }),
    );

    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      const { layer, geojson } = result.value;

      for (const feature of geojson.features) {
        const geom = feature.geometry;
        let lat: number;
        let lng: number;

        // Handle different geometry types
        if (geom.type === "Point") {
          [lng, lat] = (geom as GeoJSON.Point).coordinates;
        } else if (geom.type === "MultiPoint") {
          [lng, lat] = (geom as GeoJSON.MultiPoint).coordinates[0];
        } else if (geom.type === "LineString") {
          // Use midpoint of the line
          const coords = (geom as GeoJSON.LineString).coordinates;
          const mid = Math.floor(coords.length / 2);
          [lng, lat] = coords[mid];
        } else if (geom.type === "Polygon") {
          // Use centroid approximation (average of first ring)
          const ring = (geom as GeoJSON.Polygon).coordinates[0];
          lng = ring.reduce((s, c) => s + c[0], 0) / ring.length;
          lat = ring.reduce((s, c) => s + c[1], 0) / ring.length;
        } else {
          continue;
        }

        if (isNaN(lat) || isNaN(lng)) continue;

        const props = feature.properties || {};
        const name = String(props.PARK_NAME || props.TRAIL_NAME || props.ART_TITLE || props.STATION_NAME || props.NAME || props.name || "Unknown");

        points.push({
          id: `county-${layer.icon}-${feature.id || points.length}`,
          category: layer.label,
          name,
          address: String(props.ADDRESS || props.LOCATION || ""),
          latitude: lat,
          longitude: lng,
          color: layer.color,
          icon: layer.icon,
        });
      }
    }

    const summary = Object.fromEntries(
      COUNTY_LAYERS.map((l) => [l.label, points.filter((p) => p.category === l.label).length]),
    );

    const responseData = {
      points,
      summary: { ...summary, total: points.length },
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (error) {
    console.error("[County Data] Error:", error);
    return NextResponse.json(
      { points: [], summary: { total: 0 }, error: "Failed to fetch county data" },
      { status: 500 },
    );
  }
}
