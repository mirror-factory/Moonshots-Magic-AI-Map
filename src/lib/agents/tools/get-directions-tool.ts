/**
 * @module agents/tools/get-directions-tool
 * AI SDK tool that triggers directions from the user's location to an event.
 * This is a client-side tool — executed in the browser, not on the server.
 */

import { tool } from "ai";
import { z } from "zod";

/**
 * Agent tool: get directions to an event location.
 * This is a client-side tool with no execute function.
 */
export const getDirectionsTool = tool({
  description:
    "Get directions from the user's current location to an event. Displays a route on the map with distance and estimated travel time. Use when users ask 'how do I get to', 'directions to', or 'how far is' an event.",
  inputSchema: z.object({
    eventId: z.string().describe("The event ID to navigate to"),
    coordinates: z
      .tuple([z.number(), z.number()])
      .describe("[longitude, latitude] of the event venue"),
    title: z.string().describe("The event or venue title for display"),
  }),
  // No execute — client-side tool
});
