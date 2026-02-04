/**
 * @module agents/event-agent
 * Configures the AI {@link ToolLoopAgent} that powers the chat assistant.
 * Combines five tools (search, details, newsletters, ranking, map navigation)
 * with a system prompt tailored for Orlando event discovery.
 */

import { ToolLoopAgent, stepCountIs } from "ai";
import { searchEvents } from "./tools/search-events";
import { getEventDetails } from "./tools/get-event-details";
import { searchNewsletters } from "./tools/search-newsletters";
import { rankEvents } from "./tools/rank-events";
import { mapNavigate } from "./tools/map-navigate";

/**
 * Pre-configured agent instance used by the `/api/chat` route.
 * Runs up to 10 tool-call steps per conversation turn.
 * Uses Claude Haiku for fast, cost-effective responses.
 */
export const eventAgent = new ToolLoopAgent({
  model: "anthropic/claude-haiku",

  instructions: `You are the Moonshots & Magic AI assistant for Orlando & Central Florida events.
You help users discover events, get personalized recommendations, explore the interactive map,
and learn about what's happening in the region.

GUIDELINES:
- When recommending events, explain WHY each one matches the user's criteria
- When showing events, always include date, venue, and category
- Use the mapNavigate tool to show events on the map when relevant
- Search newsletters for additional context and recent news
- Be enthusiastic about Orlando's vibrant event scene
- If no events match, suggest broadening the search criteria
- For "top N" requests, use rankEvents to provide reasoned rankings
- Keep responses concise but informative
- When multiple events match, highlight the most relevant ones first
- Today's date is ${new Date().toISOString().split("T")[0]}`,

  tools: {
    searchEvents,
    getEventDetails,
    searchNewsletters,
    rankEvents,
    mapNavigate,
  },

  stopWhen: stepCountIs(10),
});
