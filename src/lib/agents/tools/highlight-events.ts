/**
 * @module agents/tools/highlight-events
 * AI SDK tool that highlights specific events on the map.
 * This is a client-side tool — executed in the browser, not on the server.
 * Dims non-highlighted markers and brightens highlighted ones.
 * Pass an empty array to clear all highlights.
 */

import { tool } from "ai";
import { z } from "zod";

/**
 * Agent tool: highlight events on the map.
 * This is a client-side tool with no execute function.
 */
export const highlightEvents = tool({
  description:
    "Highlight specific events on the map by dimming all other markers and making the selected ones glow. Pass an empty eventIds array to clear highlights and restore normal view. Use after search or rank results to visually connect chat results to the map.",
  inputSchema: z.object({
    eventIds: z
      .array(z.string())
      .describe("Event IDs to highlight on the map. Empty array clears all highlights."),
    fitBounds: z
      .boolean()
      .optional()
      .describe("Whether to fit the map view to show all highlighted events (default: true)"),
  }),
  // No execute — client-side tool
});
