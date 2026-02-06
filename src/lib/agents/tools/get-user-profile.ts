/**
 * @module agents/tools/get-user-profile
 * AI SDK tool that retrieves the current user's profile for personalization.
 * Returns preferences, interests, and interaction history.
 */

import { tool } from "ai";
import { z } from "zod";

/**
 * Agent tool: retrieve the user's profile.
 * This is a client-side tool - returns profile data stored in localStorage.
 */
export const getUserProfile = tool({
  description:
    "Get the current user's profile including interests, preferences, and past interactions. Use this to personalize recommendations and understand what the user likes.",
  inputSchema: z.object({}),
  // No execute - this is a client-side tool
});
