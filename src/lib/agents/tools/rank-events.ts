/**
 * @module agents/tools/rank-events
 * AI SDK tool that loads a set of events by ID and returns them alongside
 * ranking criteria so the LLM can reason about ordering in its response.
 */

import { tool } from "ai";
import { z } from "zod";
import { getEventById } from "@/lib/registries/events";

/** Agent tool: prepare events for LLM-driven ranking. */
export const rankEvents = tool({
  description:
    'Rank and score a set of events based on user preferences. Use this for "top N" or "best" requests. Returns events for you to rank in your response with reasoning.',
  inputSchema: z.object({
    eventIds: z.array(z.string()).describe("Event IDs to rank"),
    criteria: z
      .string()
      .describe(
        'What to optimize for (e.g., "romantic date night", "family outdoor fun")',
      ),
    limit: z.number().default(5).describe("How many top results to return"),
  }),
  execute: async ({ eventIds, criteria, limit }) => {
    const events = eventIds
      .map((id) => getEventById(id))
      .filter((e) => e !== undefined);
    return {
      events: events.slice(0, limit).map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        category: e.category,
        venue: e.venue,
        city: e.city,
        startDate: e.startDate,
        price: e.price,
        tags: e.tags,
        coordinates: e.coordinates,
        imageUrl: e.imageUrl,
        source: e.source,
      })),
      criteria,
      requestedLimit: limit,
    };
  },
});
