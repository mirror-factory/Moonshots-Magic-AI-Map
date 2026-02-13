/**
 * @module agents/tools/search-events
 * AI SDK tool that queries the event registry by category, date range,
 * location, price, tags, and free-text search. Returns a slim projection
 * of matching events for the agent to present.
 */

import { tool } from "ai";
import { z } from "zod";
import { getEvents } from "@/lib/registries/events";
import { EVENT_CATEGORIES } from "@/lib/registries/types";

/** Agent tool: search the event registry with multi-criteria filters. */
export const searchEvents = tool({
  description:
    "Search the event registry by criteria. Use this to find events matching user preferences like category, date range, price, location, or text search.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe("Text search on title, description, tags, venue"),
    category: z.enum(EVENT_CATEGORIES).optional().describe("Event category filter"),
    dateRange: z
      .object({
        start: z.string().describe("ISO 8601 start date"),
        end: z.string().describe("ISO 8601 end date"),
      })
      .optional()
      .describe("Date range filter"),
    city: z.string().optional().describe("City name filter"),
    isFree: z.boolean().optional().describe("Filter for free events only"),
    tags: z.array(z.string()).optional().describe("Filter by tags"),
    limit: z.number().default(10).describe("Max results to return"),
  }),
  execute: async (params) => {
    const events = getEvents({
      query: params.query,
      category: params.category,
      dateRange: params.dateRange,
      city: params.city,
      isFree: params.isFree,
      tags: params.tags,
      limit: params.limit,
      status: "active",
    });
    return {
      count: events.length,
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        category: e.category,
        venue: e.venue,
        city: e.city,
        startDate: e.startDate,
        endDate: e.endDate,
        price: e.price,
        tags: e.tags,
        coordinates: e.coordinates,
        featured: e.featured,
        imageUrl: e.imageUrl,
        source: e.source,
      })),
    };
  },
});
