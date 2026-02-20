/**
 * @module lib/audio/background-music
 * Ambient background music controller for flyover tours and Orlando showcase.
 * Delegates to the unified audio manager for playback.
 */

import * as audioManager from "./audio-manager";

/** Audio paths for each mode. */
const AUDIO_PATHS = {
  flyover: "/audio/liosound_Lofi_loop-01.mp3",
  showcase: "/audio/Real Estate 03.mp3",
} as const;

/** Music mode type. */
export type MusicMode = keyof typeof AUDIO_PATHS;

/** Default volumes (kept low to not overpower narration). */
const DEFAULT_VOLUME: Record<MusicMode, number> = {
  flyover: 0.15,
  showcase: 0.3,
};

/** Track the current mode to avoid restarting same track. */
let currentMode: MusicMode | null = null;

/**
 * Starts background music with a smooth fade-in.
 * @param mode - Which track to play: "flyover" or "showcase".
 * @param volume - Target volume (0-1). Defaults per mode.
 */
export function startBackgroundMusic(
  mode: MusicMode,
  volume?: number,
): void {
  // Already playing this mode — skip
  if (currentMode === mode) return;

  currentMode = mode;
  const targetVolume = volume ?? DEFAULT_VOLUME[mode];
  audioManager.setBackground(AUDIO_PATHS[mode], { volume: targetVolume });
}

/**
 * Stops background music with a smooth fade-out.
 * @returns Promise that resolves when fade completes.
 */
export function stopBackgroundMusic(): Promise<void> {
  currentMode = null;
  return audioManager.stopBackground();
}

/**
 * Sets the volume of the currently playing background music.
 * @param volume - Volume level (0-1).
 */
export function setBackgroundMusicVolume(volume: number): void {
  audioManager.setBackgroundVolume(volume);
}

/**
 * Returns the current volume of the background music.
 * @returns Volume level (0-1), or 0 if nothing is playing.
 */
export function getBackgroundMusicVolume(): number {
  return audioManager.getBackgroundVolume();
}
