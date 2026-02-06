/**
 * @module agents/tools/start-flyover
 * AI SDK tool that triggers a narrated flyover tour of selected events.
 * This is a client-side tool - executed in the browser, not on the server.
 */

import { tool } from "ai";
import { z } from "zod";

/**
 * Agent tool: start a narrated flyover tour of events.
 * This is a client-side tool that triggers map animation.
 */
export const startFlyover = tool({
  description:
    "Start a narrated flyover tour of events on the map. Creates a cinematic 3D tour that flies the camera to each event location with captions. Best for showcasing multiple events in a geographic area.",
  inputSchema: z.object({
    eventIds: z
      .array(z.string())
      .min(2)
      .max(10)
      .describe("Array of 2-10 event IDs to include in the tour"),
    theme: z
      .string()
      .optional()
      .describe("Optional theme or narrative focus for the tour (e.g., 'music events', 'family fun')"),
  }),
  // No execute - this is a client-side tool
});
