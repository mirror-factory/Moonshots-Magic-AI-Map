/**
 * @module lib/flyover/flyover-audio
 * Audio handling for flyover tours including pre-recorded intro
 * and parallel audio generation.
 */

import { generateAudioBuffer, playAudioBuffer, stopSpeaking } from "@/lib/voice/cartesia-tts";

/** Path to pre-recorded flyover intro audio. */
const INTRO_AUDIO_PATH = "/audio/flyover-intro.wav";

/** Flyover intro message (used if generating dynamically).
 * This message is intentionally longer (~7 seconds) to give time for
 * Cartesia to generate all waypoint audio in parallel while playing.
 */
export const FLYOVER_INTRO_MESSAGE =
  "Absolutely! I'd love to take you on a tour. Get ready for a cinematic flyover of some incredible spots around Orlando. We'll swoop through the city and I'll share the highlights at each location. Here we go!";

/** Cache for loaded intro audio. */
let introAudioCache: ArrayBuffer | null = null;

/**
 * Loads the pre-recorded intro audio from static assets.
 * Falls back to generating dynamically if file not found.
 * @returns Promise resolving to AudioBuffer, or null if unavailable.
 */
async function loadIntroAudio(): Promise<ArrayBuffer | null> {
  if (introAudioCache) {
    return introAudioCache;
  }

  try {
    // Try to load pre-recorded audio
    const response = await fetch(INTRO_AUDIO_PATH);
    if (response.ok) {
      introAudioCache = await response.arrayBuffer();
      console.log("[FlyoverAudio] Loaded pre-recorded intro");
      return introAudioCache;
    }
  } catch {
    console.log("[FlyoverAudio] Pre-recorded intro not found, will generate dynamically");
  }

  // Fallback: generate dynamically (slower but works)
  try {
    const buffer = await generateAudioBuffer(FLYOVER_INTRO_MESSAGE);
    if (buffer) {
      introAudioCache = buffer;
      console.log("[FlyoverAudio] Generated intro audio dynamically");
      return introAudioCache;
    }
  } catch (error) {
    console.error("[FlyoverAudio] Failed to generate intro:", error);
  }

  return null;
}

/**
 * Plays the flyover intro audio while preparing main content.
 * Returns immediately, playing audio in the background.
 * @returns Promise that resolves when intro finishes playing.
 */
export async function playFlyoverIntro(): Promise<void> {
  const introBuffer = await loadIntroAudio();

  if (introBuffer) {
    return playAudioBuffer(introBuffer);
  }

  // If no audio available, just resolve after a short delay
  return new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Stops any currently playing flyover audio.
 */
export function stopFlyoverAudio(): void {
  stopSpeaking();
}

/**
 * Generates audio for all waypoint narratives in parallel.
 * @param narratives - Array of narrative strings.
 * @returns Promise resolving to array of ArrayBuffers (null for failures).
 */
export async function generateWaypointAudio(
  narratives: string[]
): Promise<(ArrayBuffer | null)[]> {
  console.log("[FlyoverAudio] Generating audio for", narratives.length, "waypoints in parallel");

  const promises = narratives.map((narrative) => generateAudioBuffer(narrative));
  const results = await Promise.all(promises);

  const successCount = results.filter((r) => r !== null).length;
  console.log("[FlyoverAudio] Generated", successCount, "of", narratives.length, "audio buffers");

  return results;
}

/**
 * Plays intro and generates waypoint audio in parallel.
 * This is the optimized flow that minimizes perceived delay.
 * @param narratives - Array of narrative strings for waypoints.
 * @returns Promise resolving to waypoint audio buffers.
 */
export async function prepareAndPlayIntro(
  narratives: string[]
): Promise<(ArrayBuffer | null)[]> {
  // Start intro playback and audio generation in parallel
  const [, waypointAudio] = await Promise.all([
    playFlyoverIntro(),
    generateWaypointAudio(narratives),
  ]);

  return waypointAudio;
}
