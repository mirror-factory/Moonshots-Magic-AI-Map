/**
 * @module lib/voice/cartesia-tts
 * Cartesia Sonic text-to-speech integration for reading AI responses aloud.
 * Falls back to Web Speech API if Cartesia is unavailable.
 */

/** Cartesia API configuration. */
const CARTESIA_API_URL = "https://api.cartesia.ai/tts/bytes";

/** Default voice ID for Cartesia Sonic (Narrator Lady). */
const DEFAULT_VOICE_ID = "b7d50908-b17c-442d-ad8d-810c63997ed9";

// ── Request concurrency limiter ──────────────────────────────────────
/** Maximum number of concurrent Cartesia API requests. */
const MAX_CONCURRENT = 2;
/** Number of requests currently in flight. */
let activeRequests = 0;
/** Queue of callbacks waiting for a slot. */
const requestQueue: Array<() => void> = [];
/** Set of in-flight AbortControllers for cancellation. */
const activeAbortControllers = new Set<AbortController>();
/**
 * Cancellation epoch — incremented by {@link cancelAllGenerations}.
 * Requests that were queued at an older epoch bail immediately after
 * acquiring their slot, preventing them from hitting the API.
 */
let cancelEpoch = 0;

/** Acquires a request slot, waiting if at capacity. */
function acquireSlot(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return Promise.resolve();
  }
  return new Promise((resolve) => requestQueue.push(() => { activeRequests++; resolve(); }));
}

/** Releases a request slot and dequeues the next waiter. */
function releaseSlot(): void {
  activeRequests--;
  const next = requestQueue.shift();
  if (next) next();
}

/**
 * Cancels all in-flight audio generation requests and drains the queue.
 * Increments {@link cancelEpoch} so drained requests bail after acquiring
 * their slot instead of making new API calls.
 */
export function cancelAllGenerations(): void {
  cancelEpoch++;
  for (const ac of activeAbortControllers) ac.abort();
  activeAbortControllers.clear();
  // Drain waiting queue — callbacks will check cancelEpoch and bail
  while (requestQueue.length > 0) {
    const cb = requestQueue.shift();
    if (cb) { activeRequests++; cb(); }
  }
}

import * as audioManager from "@/lib/audio/audio-manager";

/**
 * Speaks text using Cartesia Sonic API.
 * Requires NEXT_PUBLIC_CARTESIA_API_KEY environment variable.
 * @param text - Text to speak.
 * @param voiceId - Optional voice ID override.
 * @returns Promise that resolves when speech completes.
 */
export async function speakWithCartesia(
  text: string,
  voiceId: string = DEFAULT_VOICE_ID
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_CARTESIA_API_KEY;

  console.log("[Cartesia] API Key present:", !!apiKey, apiKey ? `(${apiKey.substring(0, 10)}...)` : "(none)");

  if (!apiKey) {
    console.warn("[Cartesia] No API key found. Make sure NEXT_PUBLIC_CARTESIA_API_KEY is set in .env.local and restart the dev server!");
    return speakWithWebSpeech(text);
  }

  console.log("[Cartesia] Starting TTS request with voice:", voiceId);

  try {
    // Stop any current playback
    stopSpeaking();

    const requestBody = {
      model_id: "sonic-2",
      transcript: text,
      voice: {
        mode: "id",
        id: voiceId,
      },
      output_format: {
        container: "wav",
        encoding: "pcm_s16le",
        sample_rate: 24000,
      },
      language: "en",
    };

    console.log("[Cartesia] Request:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(CARTESIA_API_URL, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Cartesia-Version": "2024-11-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Cartesia] API error:", response.status, errorText);
      throw new Error(`Cartesia API error: ${response.status} - ${errorText}`);
    }

    console.log("[Cartesia] Response received, creating audio...");

    const arrayBuffer = await response.arrayBuffer();
    const { promise } = audioManager.playBuffer(arrayBuffer);
    return promise;
  } catch (error) {
    console.error("[Cartesia] TTS error:", error);
    // Fallback to Web Speech API
    console.log("[Cartesia] Falling back to Web Speech API...");
    return speakWithWebSpeech(text);
  }
}

/**
 * Speaks text using the Web Speech API (fallback).
 * @param text - Text to speak.
 * @returns Promise that resolves when speech completes.
 */
export function speakWithWebSpeech(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.error("[WebSpeech] Not supported in this environment");
      reject(new Error("Web Speech API not supported"));
      return;
    }

    console.log("[WebSpeech] Starting speech...");

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a nice voice - voices may load async
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("[WebSpeech] Available voices:", voices.length);
      const preferredVoice = voices.find(
        (v) => v.name.includes("Samantha") || v.name.includes("Google") || v.lang.startsWith("en")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log("[WebSpeech] Using voice:", preferredVoice.name);
      }
    };

    // Voices may not be loaded yet
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    utterance.onend = () => {
      console.log("[WebSpeech] Speech ended");
      resolve();
    };
    utterance.onerror = (event) => {
      console.error("[WebSpeech] Error:", event.error);
      reject(event.error);
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stops any currently playing speech and resolves any pending audio promise.
 * This ensures callers awaiting playback are unblocked immediately,
 * preventing zombie async loops from continuing after a skip/stop.
 */
export function stopSpeaking(): void {
  audioManager.stopForeground();
}

/**
 * Checks if audio is currently playing.
 * @returns True if speaking (always false now — kept for API compat).
 */
export function isSpeaking(): boolean {
  return false;
}

/**
 * Main speak function - uses Cartesia with Web Speech fallback.
 * @param text - Text to speak.
 */
export async function speak(text: string): Promise<void> {
  return speakWithCartesia(text);
}

/**
 * Plays an audio buffer directly (for pre-generated audio).
 * @param buffer - The ArrayBuffer containing WAV audio data.
 * @returns Promise that resolves when playback completes.
 */
export async function playAudioBuffer(buffer: ArrayBuffer): Promise<void> {
  const { promise } = audioManager.playBuffer(buffer);
  return promise;
}

/**
 * Generates audio from Cartesia API without playing it.
 * Rate-limited to {@link MAX_CONCURRENT} concurrent requests.
 * Supports cancellation via {@link cancelAllGenerations}.
 * @param text - Text to synthesize.
 * @param voiceId - Optional voice ID override.
 * @param fast - Use faster speaking speed (default true for flyovers).
 * @returns Promise resolving to ArrayBuffer of audio data, or null if failed/cancelled.
 */
export async function generateAudioBuffer(
  text: string,
  voiceId: string = DEFAULT_VOICE_ID,
  fast: boolean = true
): Promise<ArrayBuffer | null> {
  const apiKey = process.env.NEXT_PUBLIC_CARTESIA_API_KEY;

  if (!apiKey) {
    console.warn("[Cartesia] No API key found for audio generation");
    return null;
  }

  // Capture epoch before waiting — if it changes, a cancel fired while queued
  const myEpoch = cancelEpoch;

  // Wait for a request slot
  await acquireSlot();

  // Bail if cancelAllGenerations() fired while we were queued
  if (cancelEpoch !== myEpoch) {
    releaseSlot();
    return null;
  }

  const ac = new AbortController();
  activeAbortControllers.add(ac);

  const startTime = Date.now();

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
        transcript: text,
        voice: { mode: "id", id: voiceId },
        output_format: {
          container: "wav",
          encoding: "pcm_s16le",
          sample_rate: 24000,
        },
        language: "en",
        // Speed control: "fastest" or "fast" for quicker generation
        ...(fast && {
          __experimental_controls: {
            speed: "fast",
          },
        }),
      }),
      signal: ac.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Cartesia] API error:", response.status, errorText);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const elapsed = Date.now() - startTime;
    console.log(`[Cartesia] Generated ${text.length} chars in ${elapsed}ms`);

    return buffer;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.log("[Cartesia] Generation cancelled");
      return null;
    }
    console.error("[Cartesia] Generation error:", error);
    return null;
  } finally {
    activeAbortControllers.delete(ac);
    releaseSlot();
  }
}
