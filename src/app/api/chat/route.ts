/**
 * @module api/chat
 * `POST /api/chat` — Streaming chat endpoint. Accepts an array of UI
 * messages and returns an agent UI stream powered by the {@link eventAgent}.
 * Max execution duration is 30 seconds (Vercel serverless limit).
 */

import { createAgentUIStreamResponse } from "ai";
import { eventAgent } from "@/lib/agents/event-agent";

export const maxDuration = 30;

/**
 * Handles POST requests by streaming an agent UI response.
 *
 * @param req - The incoming request containing chat messages.
 * @returns A streaming agent UI response.
 */
export async function POST(req: Request) {
  const { messages } = await req.json();

  return createAgentUIStreamResponse({
    agent: eventAgent,
    uiMessages: messages,
  });
}
