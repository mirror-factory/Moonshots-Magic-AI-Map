/**
 * @module lib/audio/audio-manager
 * Global singleton audio manager guaranteeing only ONE foreground audio
 * source plays at a time. Background music is tracked separately.
 * Every `play()` call immediately stops any active foreground audio.
 */

/** Generation counter — each `play()` increments this. */
let generationId = 0;

/** The single active foreground audio element. */
let activeForeground: HTMLAudioElement | null = null;

/** Resolve callback for the active foreground promise. */
let foregroundResolve: (() => void) | null = null;

/** The single active background audio element. */
let activeBackground: HTMLAudioElement | null = null;

/** Background fade interval. */
let bgFadeInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Immediately stops and disposes the active foreground audio.
 * Resolves any pending foreground promise so callers unblock.
 */
function killForeground(): void {
  const resolve = foregroundResolve;
  foregroundResolve = null;

  if (activeForeground) {
    activeForeground.onended = null;
    activeForeground.onerror = null;
    activeForeground.pause();
    activeForeground.currentTime = 0;
    activeForeground = null;
  }

  // Also stop Web Speech API if active
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  resolve?.();
}

/**
 * Plays an audio source as the foreground track.
 * Immediately stops any currently playing foreground audio.
 * @param source - URL string or Blob URL for the audio.
 * @param opts - Optional volume setting.
 * @returns Object with `stop()` to halt playback and `promise` that resolves on end.
 */
export function play(
  source: string,
  opts?: { volume?: number },
): { stop: () => void; promise: Promise<void> } {
  // Kill any active foreground immediately
  killForeground();

  const thisGen = ++generationId;
  const audio = new Audio(source);
  audio.volume = opts?.volume ?? 1.0;
  activeForeground = audio;

  const promise = new Promise<void>((resolve) => {
    foregroundResolve = resolve;

    audio.onended = () => {
      if (generationId === thisGen) {
        foregroundResolve = null;
        activeForeground = null;
      }
      resolve();
    };

    audio.onerror = () => {
      if (generationId === thisGen) {
        foregroundResolve = null;
        activeForeground = null;
      }
      resolve();
    };

    audio.play().catch(() => {
      if (generationId === thisGen) {
        foregroundResolve = null;
        activeForeground = null;
      }
      resolve();
    });
  });

  const stop = () => {
    if (activeForeground === audio) {
      killForeground();
    } else {
      // Already replaced — just stop this element
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };

  return { stop, promise };
}

/**
 * Plays an ArrayBuffer as foreground audio via Blob URL.
 * @param buffer - WAV/audio ArrayBuffer.
 * @param opts - Optional volume setting.
 * @returns Object with `stop()` and `promise`.
 */
export function playBuffer(
  buffer: ArrayBuffer,
  opts?: { volume?: number },
): { stop: () => void; promise: Promise<void> } {
  const blob = new Blob([buffer], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  const result = play(url, opts);

  // Clean up blob URL when done
  result.promise.then(() => URL.revokeObjectURL(url));

  return result;
}

/**
 * Stops all foreground audio immediately.
 * Does NOT stop background music — use `stopBackground()` for that.
 */
export function stopForeground(): void {
  killForeground();
}

/**
 * Stops ALL audio — foreground and background.
 */
export function stopAll(): void {
  killForeground();
  stopBackground();
}

/**
 * Starts background music with fade-in.
 * Replaces any currently playing background track.
 * @param source - URL of the audio file.
 * @param opts - Volume and fade duration options.
 */
export function setBackground(
  source: string,
  opts?: { volume?: number; fadeMs?: number },
): void {
  // Stop existing background
  stopBackgroundInstant();

  const targetVolume = opts?.volume ?? 0.15;
  const fadeMs = opts?.fadeMs ?? 1500;
  const audio = new Audio(source);
  audio.loop = true;
  audio.volume = 0;
  activeBackground = audio;

  audio.play().catch((err) => {
    console.warn("[AudioManager] Background autoplay blocked:", err);
  });

  // Fade in
  const steps = 30;
  const stepMs = fadeMs / steps;
  const volumeStep = targetVolume / steps;
  let current = 0;

  bgFadeInterval = setInterval(() => {
    current += volumeStep;
    if (current >= targetVolume) {
      current = targetVolume;
      if (bgFadeInterval) clearInterval(bgFadeInterval);
      bgFadeInterval = null;
    }
    if (audio === activeBackground) {
      try { audio.volume = Math.min(current, 1); } catch { /* disposed */ }
    }
  }, stepMs);
}

/**
 * Stops background music with a smooth fade-out.
 * @param fadeMs - Fade duration in ms.
 * @returns Promise that resolves when fade completes.
 */
export function stopBackground(fadeMs: number = 1500): Promise<void> {
  return new Promise((resolve) => {
    if (bgFadeInterval) {
      clearInterval(bgFadeInterval);
      bgFadeInterval = null;
    }

    if (!activeBackground || activeBackground.paused) {
      stopBackgroundInstant();
      resolve();
      return;
    }

    const audio = activeBackground;
    const startVolume = audio.volume;
    const steps = 30;
    const stepMs = fadeMs / steps;
    const volumeStep = startVolume / steps;
    let current = startVolume;

    bgFadeInterval = setInterval(() => {
      current -= volumeStep;
      if (current <= 0) {
        current = 0;
        if (bgFadeInterval) clearInterval(bgFadeInterval);
        bgFadeInterval = null;
        stopBackgroundInstant();
        resolve();
      }
      try { audio.volume = Math.max(current, 0); } catch { /* disposed */ }
    }, stepMs);
  });
}

/** Immediately stop and dispose background audio (no fade). */
function stopBackgroundInstant(): void {
  if (bgFadeInterval) {
    clearInterval(bgFadeInterval);
    bgFadeInterval = null;
  }
  if (activeBackground) {
    activeBackground.pause();
    activeBackground.src = "";
    activeBackground = null;
  }
}

/**
 * Sets the volume of the currently playing background music.
 * @param volume - Volume level (0-1).
 */
export function setBackgroundVolume(volume: number): void {
  if (activeBackground) {
    try { activeBackground.volume = Math.max(0, Math.min(1, volume)); } catch { /* disposed */ }
  }
}

/**
 * Returns the current background music volume.
 * @returns Volume level (0-1), or 0 if not playing.
 */
export function getBackgroundVolume(): number {
  if (activeBackground) {
    try { return activeBackground.volume; } catch { return 0; }
  }
  return 0;
}
