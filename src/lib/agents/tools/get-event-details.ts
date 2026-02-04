/**
 * @module agents/tools/get-event-details
 * AI SDK tool that retrieves the full {@link EventEntry} for a given event
 * UUID. Returns an error object if the ID is not found.
 */

import { tool } from "ai";
import { z } from "zod";
import { getEventById } from "@/lib/registries/events";

/** Agent tool: fetch full details for a single event by ID. */
export const getEventDetails = tool({
  description: "Get full details for a specific event by its ID.",
  inputSchema: z.object({
    eventId: z.string().describe("The event UUID"),
  }),
  execute: async ({ eventId }) => {
    const event = getEventById(eventId);
    if (!event) return { error: "Event not found" };
    return event;
  },
});
