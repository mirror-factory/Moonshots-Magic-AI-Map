/**
 * @module api/layers/developments
 * GET route that returns Downtown Orlando development projects.
 * Uses curated static data from Downtown Orlando DDB.
 * Long cache (24h) since projects don't change frequently.
 */

import { NextResponse } from "next/server";
import developments from "@/data/developments.json";

/** Status colors for development markers. */
const STATUS_COLORS: Record<string, string> = {
  proposed: "#f59e0b",     // amber
  "in-progress": "#3b82f6", // blue
  completed: "#22c55e",     // green
};

/** Category colors for development type. */
const CATEGORY_COLORS: Record<string, string> = {
  residential: "#a855f7",
  commercial: "#f97316",
  "mixed-use": "#3b82f6",
  institutional: "#06b6d4",
  "public-space": "#22c55e",
  hospitality: "#ec4899",
};

/**
 * Returns downtown Orlando development projects.
 * @returns JSON with development data and summary.
 */
export async function GET() {
  const projects = developments.map((dev, i) => ({
    id: `dev-${i}`,
    name: dev.name,
    status: dev.status,
    description: dev.description,
    address: dev.address,
    latitude: dev.lat,
    longitude: dev.lng,
    category: dev.category,
    imageUrl: dev.imageUrl ?? null,
    timelineStart: dev.timelineStart ?? null,
    timelineCompletion: dev.timelineCompletion ?? null,
    investment: dev.investment ?? null,
    statusColor: STATUS_COLORS[dev.status] ?? "#94a3b8",
    categoryColor: CATEGORY_COLORS[dev.category] ?? "#94a3b8",
  }));

  const summary = {
    total: projects.length,
    proposed: projects.filter((p) => p.status === "proposed").length,
    inProgress: projects.filter((p) => p.status === "in-progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  return NextResponse.json(
    { projects, summary, fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } },
  );
}
