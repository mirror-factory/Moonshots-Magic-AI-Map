/**
 * @module api/newsletters
 * `GET /api/newsletters` — REST endpoint for querying newsletters. Supports
 * query params: `query`, `category`, `startDate`, `endDate`, `source`,
 * `tags`, `limit`. Returns `{ count, entries }`.
 */

import { NextRequest, NextResponse } from "next/server";
import { getNewsletters } from "@/lib/registries/newsletters";
import type { NewsletterCategory, NewsletterFilters } from "@/lib/registries/types";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const filters: NewsletterFilters = {};

  const query = params.get("query");
  if (query) filters.query = query;

  const category = params.get("category");
  if (category) filters.category = category as NewsletterCategory;

  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  if (startDate && endDate) {
    filters.dateRange = { start: startDate, end: endDate };
  }

  const source = params.get("source");
  if (source) filters.source = source;

  const tags = params.get("tags");
  if (tags) filters.tags = tags.split(",");

  const limit = params.get("limit");
  if (limit) filters.limit = parseInt(limit, 10);

  const entries = getNewsletters(filters);

  return NextResponse.json({ count: entries.length, entries });
}
