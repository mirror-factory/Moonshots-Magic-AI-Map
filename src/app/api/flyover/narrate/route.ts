/**
 * @module api/flyover/narrate
 * API endpoint for generating AI-powered tour narratives using Haiku.
 * Generates narratives for multiple events in parallel for speed.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";

/** Input schema for a single event to narrate. */
interface NarrateEventInput {
  id: string;
  title: string;
  venue: string;
  description: string;
  category: string;
  startDate: string;
}

/** Request body schema. */
interface NarrateRequest {
  events: NarrateEventInput[];
  theme?: string;
}

/** Response schema. */
interface NarrateResponse {
  narratives: Array<{
    eventId: string;
    narrative: string;
  }>;
}

/**
 * Generates a single event narrative using Haiku.
 * Produces engaging, descriptive narrations optimized for TTS.
 * @param event - Event data.
 * @param theme - Optional tour theme.
 * @param index - Position in tour (1-indexed).
 * @param total - Total number of stops.
 */
async function generateNarrative(
  event: NarrateEventInput,
  theme: string | undefined,
  index: number,
  total: number
): Promise<string> {
  const dayName = new Date(event.startDate).toLocaleDateString("en-US", { weekday: "long" });
  // Position indicator
  const position = index === 1 ? "First up" : index === total ? "And for our final stop" : "Next up";

  // Truncate description if too long
  const shortDesc = event.description.length > 200
    ? event.description.substring(0, 200) + "..."
    : event.description;

  const prompt = `You are a tour guide narrating a flyover of Orlando events. Write 2 engaging sentences (25-35 words total) for this stop.

EVENT DETAILS:
- Title: "${event.title}"
- Venue: ${event.venue}
- Day: ${dayName}
- Category: ${event.category}
- Description: ${shortDesc}
${theme ? `- Tour theme: ${theme}` : ""}

RULES:
1. Start with "${position},"
2. First sentence: Announce the event with energy and what makes it special
3. Second sentence: Add a compelling detail from the description that would excite someone
4. Don't just list facts - paint a picture of the experience
5. Avoid repeating the venue if it's in the title
6. No quotes in output
7. Keep it conversational and exciting

GOOD EXAMPLES:
"First up, we're swooping over the Orlando Jazz Festival at Lake Eola! Picture yourself swaying to world-class musicians under the stars this Saturday."
"Next up, the Food & Wine Classic transforms Dr. Phillips into a culinary paradise. Sample dishes from over fifty local chefs while enjoying live entertainment."
"And for our final stop, the Mardi Gras Celebration brings New Orleans magic to Universal. Expect vibrant parades, authentic Cajun flavors, and beads galore!"`;

  try {
    const result = await generateText({
      model: gateway("anthropic/claude-3-5-haiku-latest"),
      prompt,
      maxOutputTokens: 100,
      temperature: 0.7,
    });

    return result.text.trim().replace(/^["']|["']$/g, "");
  } catch (error) {
    console.error(`[Narrate] Failed to generate for ${event.id}:`, error);
    // Improved fallback with some description
    const descSnippet = event.description.split(".")[0];
    return `${position}, ${event.title} at ${event.venue}. ${descSnippet}.`;
  }
}

/**
 * POST /api/flyover/narrate
 * Generates AI-powered narratives for tour events in parallel.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NarrateRequest;
    const { events, theme } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "events array is required" },
        { status: 400 }
      );
    }

    if (events.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 events allowed" },
        { status: 400 }
      );
    }

    console.log(`[Narrate] Generating narratives for ${events.length} events, theme: "${theme}"`);

    // Generate all narratives in parallel
    const narrativePromises = events.map((event, index) =>
      generateNarrative(event, theme, index + 1, events.length).then((narrative) => ({
        eventId: event.id,
        narrative,
      }))
    );

    const narratives = await Promise.all(narrativePromises);

    console.log(`[Narrate] Generated ${narratives.length} narratives`);

    return NextResponse.json({ narratives } as NarrateResponse);
  } catch (error) {
    console.error("[Narrate] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate narratives" },
      { status: 500 }
    );
  }
}
