/**
 * @module agents/tools/start-presentation
 * AI SDK tool that triggers cinematic presentation mode.
 * This is a client-side tool — executed in the browser, not on the server.
 */

import { tool } from "ai";
import { z } from "zod";

/**
 * Agent tool: start the cinematic Orlando presentation.
 * Launches a narrated tour of Orlando landmarks with camera animations.
 * This is a client-side tool (no execute function).
 */
export const startPresentation = tool({
  description:
    "Start a cinematic presentation about Orlando's history and the Moonshots & Magic story. " +
    "Launches a narrated tour that flies the camera through key landmarks — from Lake Eola to " +
    "Cape Canaveral to Disney to Universal — while showing rich narrative chapters in a side panel.",
  inputSchema: z.object({}),
  // No execute — client-side tool
});
