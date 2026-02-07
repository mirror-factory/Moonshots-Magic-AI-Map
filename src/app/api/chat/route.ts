/**
 * @module api/chat
 * `POST /api/chat` — Streaming chat endpoint. Accepts an array of UI
 * messages and optional ambient context. Returns an agent UI stream
 * powered by the {@link eventAgent} or a context-aware agent.
 * Max execution duration is 30 seconds (Vercel serverless limit).
 */

import { createAgentUIStreamResponse } from "ai";
import { eventAgent, createEventAgent } from "@/lib/agents/event-agent";

export const maxDuration = 30;

/**
 * Handles POST requests by streaming an agent UI response.
 * If ambient context is provided in the request body, creates a
 * context-aware agent for this request.
 *
 * @param req - The incoming request containing chat messages and optional context.
 * @returns A streaming agent UI response.
 */
export async function POST(req: Request) {
  const { messages, context } = await req.json();
  const agent = context ? createEventAgent(undefined, context) : eventAgent;

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
}
