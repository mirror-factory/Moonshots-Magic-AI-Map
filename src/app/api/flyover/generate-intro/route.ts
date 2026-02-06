/**
 * @module api/flyover/generate-intro
 * One-time endpoint to generate the flyover intro audio.
 * Downloads as a WAV file that can be saved to public/audio/.
 */

import { NextResponse } from "next/server";

const CARTESIA_API_URL = "https://api.cartesia.ai/tts/bytes";
const DEFAULT_VOICE_ID = "b7d50908-b17c-442d-ad8d-810c63997ed9";

/** Longer intro message (~7 seconds) to give time for Cartesia to generate waypoint audio. */
const INTRO_MESSAGE =
  "Absolutely! I'd love to take you on a tour. Get ready for a cinematic flyover of some incredible spots around Orlando. We'll swoop through the city and I'll share the highlights at each location. Here we go!";

/**
 * GET /api/flyover/generate-intro
 * Generates and returns the flyover intro audio as a downloadable WAV file.
 */
export async function GET() {
  const apiKey = process.env.CARTESIA_API_KEY || process.env.NEXT_PUBLIC_CARTESIA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "CARTESIA_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(CARTESIA_API_URL, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Cartesia-Version": "2024-11-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: "sonic-2",
        transcript: INTRO_MESSAGE,
        voice: { mode: "id", id: DEFAULT_VOICE_ID },
        output_format: {
          container: "wav",
          encoding: "pcm_s16le",
          sample_rate: 24000,
        },
        language: "en",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Cartesia API error: ${response.status} - ${errorText}` },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'attachment; filename="flyover-intro.wav"',
      },
    });
  } catch (error) {
    console.error("[GenerateIntro] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
