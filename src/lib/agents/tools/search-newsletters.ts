/**
 * @module agents/tools/search-newsletters
 * AI SDK tool that performs free-text search across the newsletter registry.
 * Returns a slim projection of matching entries for the agent.
 */

import { tool } from "ai";
import { z } from "zod";
import { searchNewsletters as search } from "@/lib/registries/newsletters";

/** Agent tool: search newsletter content by query string. */
export const searchNewsletters = tool({
  description:
    "Search newsletter content for information about events, news, culture, food, and local happenings in Orlando & Central Florida.",
  inputSchema: z.object({
    query: z.string().describe("Search query"),
    limit: z.number().default(5).describe("Max results to return"),
  }),
  execute: async ({ query, limit }) => {
    const results = search(query);
    return {
      count: results.length,
      newsletters: results.slice(0, limit).map((n) => ({
        id: n.id,
        title: n.title,
        summary: n.summary,
        category: n.category,
        source: n.source,
        author: n.author,
        publishedAt: n.publishedAt,
        tags: n.tags,
      })),
    };
  },
});
