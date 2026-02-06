/**
 * @module agents/tools/update-user-profile
 * AI SDK tool that updates the user's profile based on conversation context.
 * Allows the AI to save learned preferences from natural dialogue.
 */

import { tool } from "ai";
import { z } from "zod";
import { EVENT_CATEGORIES } from "@/lib/registries/types";

const vibeSchema = z.enum(["chill", "energetic", "adventurous", "romantic", "family-friendly"]);
const priceRangeSchema = z.enum(["free", "budget", "moderate", "premium", "any"]);
const dayPreferenceSchema = z.enum(["weekday", "weekend"]);
const timePreferenceSchema = z.enum(["morning", "afternoon", "evening", "night"]);

/**
 * Agent tool: update the user's profile with new preferences.
 * This is a client-side tool - updates profile data in localStorage.
 */
export const updateUserProfile = tool({
  description:
    "Update the user's profile with preferences learned from conversation. Use this when users express interests, availability, or context about themselves. Only update fields that were explicitly mentioned.",
  inputSchema: z.object({
    name: z.string().optional().describe("User's name if they provided it"),
    categories: z
      .array(z.enum(EVENT_CATEGORIES))
      .optional()
      .describe("Event categories the user is interested in"),
    vibes: z
      .array(vibeSchema)
      .optional()
      .describe("Atmosphere preferences: chill, energetic, adventurous, romantic, family-friendly"),
    priceRange: priceRangeSchema
      .optional()
      .describe("Budget preference for events"),
    preferredDays: z
      .array(dayPreferenceSchema)
      .optional()
      .describe("Preferred days for events: weekday, weekend"),
    preferredTimes: z
      .array(timePreferenceSchema)
      .optional()
      .describe("Preferred times: morning, afternoon, evening, night"),
    travelRadius: z
      .number()
      .optional()
      .describe("Maximum travel distance in miles"),
    hasKids: z.boolean().optional().describe("Whether user has children"),
    hasPets: z.boolean().optional().describe("Whether user has pets"),
    goals: z
      .array(z.string())
      .optional()
      .describe("User's goals or reasons for attending events"),
  }),
  // No execute - this is a client-side tool
});
