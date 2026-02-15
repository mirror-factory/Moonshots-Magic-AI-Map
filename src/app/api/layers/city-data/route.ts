/**
 * @module api/layers/city-data
 * GET route that proxies Orlando Socrata open data APIs.
 * Fetches code enforcement cases and commercial/residential permits.
 * Returns combined GeoJSON for map rendering. 15-minute cache.
 */

import { NextResponse } from "next/server";
import proj4 from "proj4";

/**
 * Florida State Plane East (EPSG:2236, NAD83, US survey feet) projection.
 * Orlando's Socrata API returns gpsx/gpsy in this coordinate system.
 */
const FL_STATE_PLANE_EAST =
  "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs";

/** Orlando Socrata API endpoints. */
const ENDPOINTS = {
  codeEnforcement: "https://data.cityoforlando.net/resource/k6e8-nw6w.json?$limit=200&$order=:created_at+DESC",
  commercialPermits: "https://data.cityoforlando.net/resource/rrba-s48e.json?$limit=200&$order=:created_at+DESC",
  residentialPermits: "https://data.cityoforlando.net/resource/3ypu-438f.json?$limit=200&$order=:created_at+DESC",
};

/** Type colors for different data sources. */
const TYPE_COLORS: Record<string, string> = {
  codeEnforcement: "#ef4444",   // red
  commercialPermit: "#3b82f6",  // blue
  residentialPermit: "#22c55e", // green
};

/** A city data point with location. */
interface CityDataPoint {
  id: string;
  type: "codeEnforcement" | "commercialPermit" | "residentialPermit";
  title: string;
  description: string;
  address: string;
  date: string;
  latitude: number;
  longitude: number;
  color: string;
}

/** In-memory cache. */
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Extracts latitude/longitude from various Socrata field formats.
 * Orlando code enforcement uses `gpsx` (longitude) and `gpsy` (latitude).
 * Permit datasets have no coordinate fields — they'll be filtered out.
 * @param record - A Socrata API record.
 * @returns [latitude, longitude] or null.
 */
function extractCoords(record: Record<string, unknown>): [number, number] | null {
  // Orlando code enforcement: gpsx/gpsy in Florida State Plane East (US feet)
  // Must convert to WGS84 for MapLibre
  if (record.gpsx && record.gpsy) {
    const x = Number(record.gpsx);
    const y = Number(record.gpsy);
    if (!isNaN(x) && !isNaN(y) && x !== 0 && y !== 0) {
      const [lng, lat] = proj4(FL_STATE_PLANE_EAST, "EPSG:4326", [x, y]);
      if (lat >= 25 && lat <= 30 && lng >= -83 && lng <= -80) {
        return [lat, lng];
      }
    }
  }

  // Try WGS84 field names
  const lat = record.latitude || record.lat || record.y;
  const lng = record.longitude || record.lng || record.lon || record.x;

  if (lat && lng) {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!isNaN(latNum) && !isNaN(lngNum) && latNum >= 25 && latNum <= 30) {
      return [latNum, lngNum];
    }
  }

  return null;
}

/**
 * Fetches Orlando city data from Socrata APIs.
 * @returns JSON with city data points and summary.
 */
export async function GET() {
  try {
    // Return cached if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=900" },
      });
    }

    // Fetch all endpoints in parallel
    const [ceRes, cpRes, rpRes] = await Promise.allSettled([
      fetch(ENDPOINTS.codeEnforcement, { signal: AbortSignal.timeout(10000) }),
      fetch(ENDPOINTS.commercialPermits, { signal: AbortSignal.timeout(10000) }),
      fetch(ENDPOINTS.residentialPermits, { signal: AbortSignal.timeout(10000) }),
    ]);

    const points: CityDataPoint[] = [];

    // Process code enforcement
    // Fields: apno, casetype, casename, casedt, derived_address, gpsx, gpsy
    if (ceRes.status === "fulfilled" && ceRes.value.ok) {
      const records = (await ceRes.value.json()) as Record<string, unknown>[];
      for (const rec of records) {
        const coords = extractCoords(rec);
        if (!coords) continue;
        points.push({
          id: `ce-${rec.apno || String(points.length)}`,
          type: "codeEnforcement",
          title: String(rec.casetype || rec.case_type || "Code Enforcement"),
          description: String(rec.casename || ""),
          address: String(rec.derived_address || ""),
          date: String(rec.casedt || ""),
          latitude: coords[0],
          longitude: coords[1],
          color: TYPE_COLORS.codeEnforcement,
        });
      }
    }

    // Process commercial permits
    // Fields: permit_number, application_type, worktype, permit_address, issue_permit_date
    // Note: No coordinate fields — permits without geocoded coords will be skipped on map
    // but still included in summary data for AI analysis
    if (cpRes.status === "fulfilled" && cpRes.value.ok) {
      const records = (await cpRes.value.json()) as Record<string, unknown>[];
      for (const rec of records) {
        const coords = extractCoords(rec);
        if (!coords) continue;
        points.push({
          id: `cp-${rec.permit_number || String(points.length)}`,
          type: "commercialPermit",
          title: String(rec.application_type || rec.worktype || "Commercial Permit"),
          description: String(rec.worktype || ""),
          address: String(rec.permit_address || ""),
          date: String(rec.issue_permit_date || rec.processed_date || ""),
          latitude: coords[0],
          longitude: coords[1],
          color: TYPE_COLORS.commercialPermit,
        });
      }
    }

    // Process residential permits
    // Fields: permit_number, application_type, worktype, permit_address, issue_permit_date
    if (rpRes.status === "fulfilled" && rpRes.value.ok) {
      const records = (await rpRes.value.json()) as Record<string, unknown>[];
      for (const rec of records) {
        const coords = extractCoords(rec);
        if (!coords) continue;
        points.push({
          id: `rp-${rec.permit_number || String(points.length)}`,
          type: "residentialPermit",
          title: String(rec.application_type || rec.worktype || "Residential Permit"),
          description: String(rec.worktype || ""),
          address: String(rec.permit_address || ""),
          date: String(rec.issue_permit_date || rec.processed_date || ""),
          latitude: coords[0],
          longitude: coords[1],
          color: TYPE_COLORS.residentialPermit,
        });
      }
    }

    const summary = {
      codeEnforcement: points.filter((p) => p.type === "codeEnforcement").length,
      commercialPermits: points.filter((p) => p.type === "commercialPermit").length,
      residentialPermits: points.filter((p) => p.type === "residentialPermit").length,
      total: points.length,
    };

    const responseData = {
      points,
      summary,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, max-age=900" },
    });
  } catch (error) {
    console.error("[CityData] Error:", error);
    return NextResponse.json(
      { points: [], summary: {}, error: "Failed to fetch city data" },
      { status: 500 },
    );
  }
}
