/**
 * @module lib/audio/sound-effects
 * Sound effects player with Web Audio API synthesis.
 * Registry-driven: reads effect definitions from sound-effects.json.
 * Singleton AudioContext, lazy-initialized on first play.
 */

import registry from "@/data/sound-effects.json";

/** Shape of a single effect entry in the registry. */
interface SfxEntry {
  type: "synthesized" | "file";
  synth?: string;
  file?: string;
  volume: number;
  description: string;
}

/** Typed registry. */
const effects = registry as Record<string, SfxEntry>;

/** Shared AudioContext — created on first play to comply with autoplay policy. */
let ctx: AudioContext | null = null;

/** Whether sound effects are enabled (defaults to on). */
let enabled = true;

/** Tracks last play time per effect name for debouncing. */
const lastPlayTime: Record<string, number> = {};

/** Minimum interval between same-name plays (ms). */
const DEBOUNCE_MS = 80;

/**
 * Returns (or creates) the shared AudioContext.
 * @returns The singleton AudioContext.
 */
function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

/**
 * Synthesizes and plays a "boop" sound — a sine oscillator sweeping
 * from 800 Hz to 400 Hz over 100 ms with exponential volume decay.
 * @param volume - Peak volume (0–1).
 */
function playBoop(volume: number): void {
  const ac = getContext();
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ac.currentTime + 0.1);

  gain.gain.setValueAtTime(volume, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.15);
}

/**
 * Plays a named sound effect from the registry.
 * Debounced: ignores rapid-fire calls within {@link DEBOUNCE_MS}.
 * @param name - Effect name matching a key in sound-effects.json.
 */
export function playSfx(name: string): void {
  if (!enabled) return;

  const entry = effects[name];
  if (!entry) return;

  // Debounce
  const now = performance.now();
  if (now - (lastPlayTime[name] ?? 0) < DEBOUNCE_MS) return;
  lastPlayTime[name] = now;

  if (entry.type === "synthesized" && entry.synth === "boop") {
    playBoop(entry.volume);
  }
  // Future: handle entry.type === "file" with fetch + decodeAudioData
}

/**
 * Enables or disables all sound effects.
 * @param value - True to enable, false to mute.
 */
export function setSfxEnabled(value: boolean): void {
  enabled = value;
}

/**
 * Returns whether sound effects are currently enabled.
 * @returns True if enabled.
 */
export function isSfxEnabled(): boolean {
  return enabled;
}
