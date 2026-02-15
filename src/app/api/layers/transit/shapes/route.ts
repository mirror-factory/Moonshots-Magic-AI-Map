/**
 * @module api/layers/transit/shapes
 * GET route that fetches LYNX GTFS static data (ZIP), extracts shapes.txt,
 * trips.txt, and routes.txt, and returns route geometries as GeoJSON.
 * 24-hour in-memory cache; graceful 503 if LYNX feed is down.
 */

import { NextResponse } from "next/server";
import { unzipSync } from "fflate";

/** LYNX GTFS static data ZIP URL. */
const GTFS_ZIP_URL = "http://www.golynx.com/files/GTFS/google_transit.zip";

/** 24-hour cache. */
let cache: { data: GeoJSON.FeatureCollection; timestamp: number } | null = null;
const CACHE_MS = 24 * 60 * 60 * 1000;

/** Parsed shape point from shapes.txt. */
interface ShapePoint {
  shapeId: string;
  lat: number;
  lon: number;
  sequence: number;
}

/** Parsed trip row from trips.txt. */
interface TripRow {
  routeId: string;
  shapeId: string;
}

/** Parsed route row from routes.txt. */
interface RouteRow {
  routeId: string;
  shortName: string;
  longName: string;
  color: string;
}

/**
 * Parses a CSV string into an array of header-keyed objects.
 * Handles Windows (CRLF) and Unix (LF) line endings.
 */
function parseCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(",");
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (values[j] ?? "").trim().replace(/^"|"$/g, "");
    }
    rows.push(row);
  }

  return rows;
}

/**
 * Extracts a named file from a GTFS ZIP buffer.
 * @returns The file contents as a UTF-8 string, or null if not found.
 */
function extractFile(zipData: Uint8Array, filename: string): string | null {
  const files = unzipSync(zipData);
  const entry = files[filename];
  if (!entry) return null;
  return new TextDecoder().decode(entry);
}

/**
 * Builds a GeoJSON FeatureCollection from GTFS static data.
 * Groups shapes by route_id (via trips.txt join) and enriches with route metadata.
 */
function buildGeoJSON(
  shapes: ShapePoint[],
  trips: TripRow[],
  routes: RouteRow[],
): GeoJSON.FeatureCollection {
  // Group shape points by shape_id, sorted by sequence
  const shapeGroups = new Map<string, ShapePoint[]>();
  for (const pt of shapes) {
    const group = shapeGroups.get(pt.shapeId);
    if (group) {
      group.push(pt);
    } else {
      shapeGroups.set(pt.shapeId, [pt]);
    }
  }

  // Sort each group by sequence
  for (const group of shapeGroups.values()) {
    group.sort((a, b) => a.sequence - b.sequence);
  }

  // Map shape_id → route_id (first match from trips)
  const shapeToRoute = new Map<string, string>();
  for (const trip of trips) {
    if (trip.shapeId && !shapeToRoute.has(trip.shapeId)) {
      shapeToRoute.set(trip.shapeId, trip.routeId);
    }
  }

  // Route metadata lookup
  const routeMap = new Map<string, RouteRow>();
  for (const route of routes) {
    routeMap.set(route.routeId, route);
  }

  // Group shape coordinates by route_id (one MultiLineString per route)
  const routeLines = new Map<string, [number, number][][]>();
  for (const [shapeId, points] of shapeGroups) {
    const routeId = shapeToRoute.get(shapeId);
    if (!routeId) continue;
    const coords: [number, number][] = points.map((p) => [p.lon, p.lat]);
    const existing = routeLines.get(routeId);
    if (existing) {
      existing.push(coords);
    } else {
      routeLines.set(routeId, [coords]);
    }
  }

  // Build features
  const features: GeoJSON.Feature[] = [];
  for (const [routeId, lines] of routeLines) {
    const routeMeta = routeMap.get(routeId);
    features.push({
      type: "Feature",
      geometry: {
        type: "MultiLineString",
        coordinates: lines,
      },
      properties: {
        routeId,
        shortName: routeMeta?.shortName ?? routeId,
        longName: routeMeta?.longName ?? "",
        color: routeMeta?.color ? `#${routeMeta.color}` : "#FFD700",
      },
    });
  }

  return { type: "FeatureCollection", features };
}

/**
 * Fetches LYNX GTFS static ZIP and returns route shapes as GeoJSON.
 * @returns GeoJSON FeatureCollection with MultiLineString per route.
 */
export async function GET() {
  try {
    // Return cached if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=86400" },
      });
    }

    const res = await fetch(GTFS_ZIP_URL, {
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      throw new Error(`LYNX GTFS feed returned ${res.status}`);
    }

    const buffer = await res.arrayBuffer();
    const zipData = new Uint8Array(buffer);

    // Extract required files
    const shapesText = extractFile(zipData, "shapes.txt");
    const tripsText = extractFile(zipData, "trips.txt");
    const routesText = extractFile(zipData, "routes.txt");

    if (!shapesText || !tripsText || !routesText) {
      throw new Error("Missing required GTFS files in ZIP");
    }

    // Parse CSV data
    const shapesRaw = parseCsv(shapesText);
    const shapes: ShapePoint[] = shapesRaw.map((row) => ({
      shapeId: row["shape_id"] ?? "",
      lat: parseFloat(row["shape_pt_lat"] ?? "0"),
      lon: parseFloat(row["shape_pt_lon"] ?? "0"),
      sequence: parseInt(row["shape_pt_sequence"] ?? "0", 10),
    }));

    const tripsRaw = parseCsv(tripsText);
    const trips: TripRow[] = tripsRaw.map((row) => ({
      routeId: row["route_id"] ?? "",
      shapeId: row["shape_id"] ?? "",
    }));

    const routesRaw = parseCsv(routesText);
    const routes: RouteRow[] = routesRaw.map((row) => ({
      routeId: row["route_id"] ?? "",
      shortName: row["route_short_name"] ?? "",
      longName: row["route_long_name"] ?? "",
      color: row["route_color"] ?? "",
    }));

    const geojson = buildGeoJSON(shapes, trips, routes);

    cache = { data: geojson, timestamp: Date.now() };

    return NextResponse.json(geojson, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch (error) {
    console.error("[Transit Shapes] Error:", error);

    // Return stale cache if available
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }

    return NextResponse.json(
      { type: "FeatureCollection", features: [], error: "Failed to fetch GTFS shapes" },
      { status: 503 },
    );
  }
}
