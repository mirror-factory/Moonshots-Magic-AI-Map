/**
 * @module lib/voice/cartesia-tts
 * Cartesia Sonic text-to-speech integration for reading AI responses aloud.
 * Falls back to Web Speech API if Cartesia is unavailable.
 */

/** Cartesia API configuration. */
const CARTESIA_API_URL = "https://api.cartesia.ai/tts/bytes";

/** Default voice ID for Cartesia Sonic (Narrator Lady). */
const DEFAULT_VOICE_ID = "b7d50908-b17c-442d-ad8d-810c63997ed9";

/** Audio context for playback. */


/** Current audio source for stopping playback. */
let currentSource: AudioBufferSourceNode | null = null;

/** Current audio element for HTML5 playback. */
let currentAudio: HTMLAudioElement | null = null;

/** Whether audio is currently playing. */
let isPlaying = false;

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
    const blob = new Blob([arrayBuffer], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(blob);

    // Use HTML5 Audio for reliable playback
    currentAudio = new Audio(audioUrl);
    currentAudio.volume = 1.0;

    isPlaying = true;

    return new Promise((resolve, reject) => {
      if (!currentAudio) {
        reject(new Error("Audio element not created"));
        return;
      }

      currentAudio.onended = () => {
        console.log("[Cartesia] Playback ended");
        isPlaying = false;
        currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      currentAudio.onerror = (e) => {
        console.error("[Cartesia] Audio playback error:", e);
        isPlaying = false;
        currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        reject(new Error("Audio playback failed"));
      };

      console.log("[Cartesia] Starting playback...");
      currentAudio.play().catch((e) => {
        console.error("[Cartesia] Play failed:", e);
        isPlaying = false;
        currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        reject(e);
      });
    });
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
      isPlaying = false;
      resolve();
    };
    utterance.onerror = (event) => {
      console.error("[WebSpeech] Error:", event.error);
      isPlaying = false;
      reject(event.error);
    };

    isPlaying = true;
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stops any currently playing speech.
 */
export function stopSpeaking(): void {
  // Stop HTML5 Audio (Cartesia WAV)
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  // Stop AudioContext source (legacy)
  if (currentSource) {
    try {
      currentSource.stop();
    } catch {
      // Already stopped
    }
    currentSource = null;
  }

  // Stop Web Speech
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  isPlaying = false;
}

/**
 * Checks if audio is currently playing.
 * @returns True if speaking.
 */
export function isSpeaking(): boolean {
  return isPlaying;
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
  // Stop any current playback
  stopSpeaking();

  const blob = new Blob([buffer], { type: "audio/wav" });
  const audioUrl = URL.createObjectURL(blob);

  currentAudio = new Audio(audioUrl);
  currentAudio.volume = 1.0;
  isPlaying = true;

  return new Promise((resolve, reject) => {
    if (!currentAudio) {
      reject(new Error("Audio element not created"));
      return;
    }

    currentAudio.onended = () => {
      console.log("[Audio] Playback ended");
      isPlaying = false;
      currentAudio = null;
      URL.revokeObjectURL(audioUrl);
      resolve();
    };

    currentAudio.onerror = (e) => {
      console.error("[Audio] Playback error:", e);
      isPlaying = false;
      currentAudio = null;
      URL.revokeObjectURL(audioUrl);
      reject(new Error("Audio playback failed"));
    };

    currentAudio.play().catch((e) => {
      console.error("[Audio] Play failed:", e);
      isPlaying = false;
      currentAudio = null;
      URL.revokeObjectURL(audioUrl);
      reject(e);
    });
  });
}

/**
 * Generates audio from Cartesia API without playing it.
 * Optimized for speed with higher speaking rate and parallel requests.
 * @param text - Text to synthesize.
 * @param voiceId - Optional voice ID override.
 * @param fast - Use faster speaking speed (default true for flyovers).
 * @returns Promise resolving to ArrayBuffer of audio data, or null if failed.
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
    console.error("[Cartesia] Generation error:", error);
    return null;
  }
}
