/**
 * @module agents/tools/change-event-filter
 * Client-side tool that lets the AI change the active event filter
 * (date preset and/or category). No server-side execute — handled
 * in the chat component's {@link onToolCall} callback.
 */

import { tool } from "ai";
import { z } from "zod";

/**
 * Client-side tool for changing the map's active event filter.
 * Supports date presets (today, weekend, week, all) and category filtering.
 */
export const changeEventFilter = tool({
  description:
    "Change the map's event filter to show events matching a date range or category. " +
    "Use this when users ask to see today's events, weekend events, this week's events, " +
    "or all events. Also supports filtering by category like music, food, arts, etc. " +
    "This changes the persistent map filter, not a one-time search.",
  inputSchema: z.object({
    preset: z
      .enum(["all", "today", "weekend", "week", "month"])
      .optional()
      .describe(
        "Date preset filter: 'today' for today's events, 'weekend' for Saturday-Sunday, " +
        "'week' for this week (Mon-Sun), 'month' for this calendar month, 'all' for all events.",
      ),
    category: z
      .enum([
        "music", "arts", "sports", "food", "tech", "community",
        "family", "nightlife", "outdoor", "education", "festival", "market", "other",
      ])
      .optional()
      .describe("Optional category to filter by."),
  }),
});
