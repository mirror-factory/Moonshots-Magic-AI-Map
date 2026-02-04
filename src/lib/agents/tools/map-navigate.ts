/**
 * @module agents/tools/map-navigate
 * AI SDK tool for controlling the interactive map from the chat.
 * This is a **client-side only** tool — it has no `execute` function.
 * The tool invocation is serialized to the UI stream and rendered by
 * the {@link MapAction} component, which performs the actual map operation.
 */

import { tool } from "ai";
import { z } from "zod";

/** Agent tool: client-side map navigation (no server execute). */
export const mapNavigate = tool({
  description:
    "Control the interactive map. Use this to show events on the map, fly to locations, or highlight clusters. This is a client-side tool - it will be rendered in the chat UI and executed on the client.",
  inputSchema: z.object({
    action: z
      .enum(["flyTo", "highlight", "fitBounds"])
      .describe("Map action to perform"),
    coordinates: z
      .tuple([z.number(), z.number()])
      .optional()
      .describe("[longitude, latitude] for flyTo"),
    eventIds: z
      .array(z.string())
      .optional()
      .describe("Event IDs to highlight on map"),
    zoom: z.number().optional().describe("Zoom level (1-20)"),
  }),
  // No execute function - this is a client-side tool
});
