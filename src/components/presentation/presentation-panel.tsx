/**
 * @module components/presentation/presentation-panel
 * Full-height right-side glass panel for cinematic Orlando presentation mode.
 * Drives camera animations, pre-generated TTS narration, and map story markers.
 * Uses camera-animator utilities via the useMap hook.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Play, Pause, SkipForward, X, Volume2, VolumeX } from "lucide-react";
import type maplibregl from "maplibre-gl";
import { useMap } from "@/components/map/use-map";
import {
  PRESENTATION_LANDMARKS,
  type PresentationLandmark,
} from "@/data/presentation-landmarks";
import { orbitalSweep } from "@/lib/flyover/camera-animator";
import { stopSpeaking } from "@/lib/voice/cartesia-tts";

/** Presentation playback state. */
type PresentationState = "idle" | "flying" | "narrating" | "paused" | "complete";

/** Story marker source and layer IDs for MapLibre. */
const STORY_SOURCE = "presentation-story-markers";
const STORY_GLOW_LAYER = "presentation-markers-glow";
const STORY_DOT_LAYER = "presentation-markers-dot";
const STORY_BG_LAYER = "presentation-markers-bg";
const STORY_LABEL_LAYER = "presentation-markers-label";
const STORY_IMAGE_LAYER = "presentation-markers-image";

/** Orbital angles vary per chapter for visual interest. */
const ORBITAL_CONFIGS = [
  { degrees: 25, direction: 1 },
  { degrees: 30, direction: -1 },
  { degrees: 20, direction: 1 },
  { degrees: 35, direction: -1 },
  { degrees: 25, direction: 1 },
  { degrees: 30, direction: -1 },
  { degrees: 20, direction: 1 },
  { degrees: 35, direction: -1 },
  { degrees: 25, direction: 1 },
  { degrees: 30, direction: -1 },
  { degrees: 15, direction: 1 },
];

/** Target thumbnail width in pixels for map marker images. */
const MARKER_THUMB_WIDTH = 120;

/**
 * Loads an image, resizes to a thumbnail, applies grayscale + contrast,
 * clips to a rounded rectangle, and registers it with the MapLibre map instance.
 * @param map - MapLibre map instance.
 * @param url - Image URL to load.
 * @param imageId - ID to register the processed image under.
 * @param borderRadius - Corner radius in pixels (applied at thumbnail scale).
 */
async function loadRoundedGrayscaleImage(
  map: maplibregl.Map,
  url: string,
  imageId: string,
  borderRadius: number = 10,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Scale down to thumbnail size
      const scale = MARKER_THUMB_WIDTH / img.naturalWidth;
      const w = MARKER_THUMB_WIDTH;
      const h = Math.round(img.naturalHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }

      // Clip to rounded rectangle
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, borderRadius);
      ctx.closePath();
      ctx.clip();

      // Apply grayscale + slight contrast boost
      ctx.filter = "grayscale(1) contrast(1.1)";
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      map.addImage(imageId, { width: w, height: h, data: new Uint8Array(imageData.data.buffer) });
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

interface PresentationPanelProps {
  /** Callback to exit presentation mode. */
  onExit: () => void;
}

/**
 * Plays a pre-generated audio file. Returns a promise that resolves when done.
 * @param landmarkId - The landmark ID matching the filename.
 * @returns Promise resolving when playback ends (or immediately if file missing).
 */
function playPreGeneratedAudio(landmarkId: string): {
  promise: Promise<void>;
  stop: () => void;
} {
  let audio: HTMLAudioElement | null = null;
  let stopped = false;

  const promise = new Promise<void>((resolve) => {
    if (stopped) { resolve(); return; }

    audio = new Audio(`/audio/presentation/${landmarkId}.wav`);
    audio.volume = 1.0;

    audio.onended = () => { resolve(); };
    audio.onerror = () => { resolve(); }; // Resolve on error (file may not exist)

    audio.play().catch(() => resolve());
  });

  const stop = () => {
    stopped = true;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
  };

  return { promise, stop };
}

/**
 * Cinematic presentation panel telling the Moonshots & Magic story.
 * Full-height right panel with chronological timeline, TTS narration,
 * and map story markers that build up as chapters progress.
 */
export function PresentationPanel({ onExit }: PresentationPanelProps) {
  const map = useMap();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [state, setState] = useState<PresentationState>("idle");
  const [narrativeVisible, setNarrativeVisible] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [visitedIndices, setVisitedIndices] = useState<Set<number>>(new Set());

  // Use refs for mutable state accessed by the async loop
  const abortRef = useRef(false);
  const ttsEnabledRef = useRef(true);
  const visitedRef = useRef<Set<number>>(new Set());
  const currentAudioStopRef = useRef<(() => void) | null>(null);
  const loopIdRef = useRef(0); // Incremented to invalidate stale loops

  const totalLandmarks = PRESENTATION_LANDMARKS.length;
  const landmark = currentIndex >= 0 ? PRESENTATION_LANDMARKS[currentIndex] : null;

  // Keep refs in sync
  useEffect(() => { ttsEnabledRef.current = ttsEnabled; }, [ttsEnabled]);

  /** Add story markers source and layers to the map, including map images. */
  const initStoryMarkers = useCallback(async () => {
    if (!map) return;
    cleanupStoryMarkers();

    // Load panel images as rounded grayscale icons for map markers
    for (const lm of PRESENTATION_LANDMARKS) {
      const imageId = `story-img-${lm.id}`;
      if (!map.hasImage(imageId)) {
        try {
          await loadRoundedGrayscaleImage(
            map,
            `/images/presentation/${lm.id}.jpg`,
            imageId,
            16,
          );
        } catch {
          // Image may not exist — skip silently
        }
      }
    }

    map.addSource(STORY_SOURCE, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });

    map.addLayer({
      id: STORY_GLOW_LAYER,
      type: "circle",
      source: STORY_SOURCE,
      paint: {
        "circle-radius": 20,
        "circle-color": "#3560FF",
        "circle-opacity": 0.3,
        "circle-blur": 1,
      },
    });

    map.addLayer({
      id: STORY_DOT_LAYER,
      type: "circle",
      source: STORY_SOURCE,
      paint: {
        "circle-radius": 7,
        "circle-color": "#3560FF",
        "circle-opacity": 0.9,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#FFFFFF",
        "circle-stroke-opacity": 0.9,
      },
    });

    // Background "pill" layer behind text — dark frosted rectangle effect
    map.addLayer({
      id: STORY_BG_LAYER,
      type: "circle",
      source: STORY_SOURCE,
      paint: {
        "circle-radius": 48,
        "circle-color": "rgba(10, 15, 30, 0.7)",
        "circle-opacity": 0.8,
        "circle-blur": 0.6,
        "circle-translate": [0, -40],
      },
    });

    map.addLayer({
      id: STORY_LABEL_LAYER,
      type: "symbol",
      source: STORY_SOURCE,
      layout: {
        "text-field": ["concat", ["get", "year"], "\n", ["get", "title"]],
        "text-size": 18,
        "text-offset": [0, -2.8],
        "text-anchor": "bottom",
        "text-font": ["Open Sans Bold"],
        "text-max-width": 10,
        "text-line-height": 1.4,
        "text-letter-spacing": 0.05,
      },
      paint: {
        "text-color": "#FFFFFF",
        "text-halo-color": "rgba(10, 15, 30, 0.9)",
        "text-halo-width": 4,
      },
    });

    // Image icon layer — rendered above the text label (B&W, rounded via canvas pre-processing)
    map.addLayer({
      id: STORY_IMAGE_LAYER,
      type: "symbol",
      source: STORY_SOURCE,
      layout: {
        "icon-image": ["concat", "story-img-", ["get", "id"]] as unknown as maplibregl.ExpressionSpecification,
        "icon-size": 1.0,
        "icon-offset": [0, -80] as [number, number],
        "icon-allow-overlap": true,
        "icon-anchor": "bottom",
      },
      paint: {
        "icon-opacity": 0.85,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  /** Update GeoJSON features to show markers for visited landmarks. */
  const updateStoryMarkers = useCallback(
    (visited: Set<number>) => {
      if (!map) return;
      const source = map.getSource(STORY_SOURCE) as maplibregl.GeoJSONSource | undefined;
      if (!source) return;

      const features = Array.from(visited).map((idx) => {
        const lm = PRESENTATION_LANDMARKS[idx];
        return {
          type: "Feature" as const,
          properties: { id: lm.id, year: lm.year, title: lm.title },
          geometry: { type: "Point" as const, coordinates: lm.coordinates },
        };
      });

      source.setData({ type: "FeatureCollection", features });
    },
    [map],
  );

  /** Remove story markers, image layer, and loaded images from the map. */
  const cleanupStoryMarkers = useCallback(() => {
    if (!map) return;
    [STORY_IMAGE_LAYER, STORY_LABEL_LAYER, STORY_BG_LAYER, STORY_DOT_LAYER, STORY_GLOW_LAYER].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource(STORY_SOURCE)) map.removeSource(STORY_SOURCE);

    // Remove loaded map images
    for (const lm of PRESENTATION_LANDMARKS) {
      const imageId = `story-img-${lm.id}`;
      if (map.hasImage(imageId)) map.removeImage(imageId);
    }
  }, [map]);

  /** Fly camera to a landmark. Resolves when animation completes or after a timeout fallback. */
  const flyToLandmark = useCallback(
    (lm: PresentationLandmark): Promise<void> => {
      if (!map || abortRef.current) return Promise.resolve();

      return new Promise((resolve) => {
        let resolved = false;
        const done = () => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timer);
          map.off("moveend", onMoveEnd);
          resolve();
        };

        const onMoveEnd = () => done();
        map.on("moveend", onMoveEnd);

        // Fallback: if flyTo doesn't trigger moveend (e.g. camera already near target),
        // resolve after the animation duration + a small buffer
        const timer = setTimeout(done, lm.duration + 200);

        map.flyTo({
          center: lm.coordinates,
          zoom: lm.zoom,
          pitch: lm.pitch,
          bearing: lm.bearing,
          duration: lm.duration,
          curve: 1.42,
          essential: true,
        });
      });
    },
    [map],
  );

  /** Run the presentation loop from a given starting index. */
  const runFromIndex = useCallback(
    async (startIdx: number) => {
      if (!map) return;

      // Increment loop ID to invalidate any previous loop
      const thisLoopId = ++loopIdRef.current;
      abortRef.current = false;

      for (let i = startIdx; i < totalLandmarks; i++) {
        // Check if this loop is still the active one
        if (abortRef.current || loopIdRef.current !== thisLoopId) break;

        const lm = PRESENTATION_LANDMARKS[i];
        const orbital = ORBITAL_CONFIGS[i % ORBITAL_CONFIGS.length];

        setCurrentIndex(i);
        setNarrativeVisible(false);
        setState("flying");

        // Fly to landmark
        await flyToLandmark(lm);
        if (abortRef.current || loopIdRef.current !== thisLoopId) break;

        // Add marker for this location
        visitedRef.current = new Set([...visitedRef.current, i]);
        setVisitedIndices(new Set(visitedRef.current));
        updateStoryMarkers(visitedRef.current);

        // Brief pause then show narrative
        await new Promise((r) => setTimeout(r, 100));
        if (abortRef.current || loopIdRef.current !== thisLoopId) break;
        setNarrativeVisible(true);
        setState("narrating");

        // Start pre-generated audio and orbital drift concurrently
        let audioControl: { promise: Promise<void>; stop: () => void } | null = null;
        if (ttsEnabledRef.current) {
          audioControl = playPreGeneratedAudio(lm.id);
          currentAudioStopRef.current = audioControl.stop;
        }

        const orbitPromise = orbitalSweep(map, {
          duration: lm.lingerDuration,
          degreesPerOrbit: orbital.degrees * orbital.direction,
          pitch: lm.pitch,
          abortRef,
        });

        // Wait for both audio and orbit (whichever is longer)
        await Promise.all([audioControl?.promise ?? Promise.resolve(), orbitPromise]);
        currentAudioStopRef.current = null;
        if (abortRef.current || loopIdRef.current !== thisLoopId) break;

        // Small gap between chapters
        await new Promise((r) => setTimeout(r, 200));
        if (abortRef.current || loopIdRef.current !== thisLoopId) break;
      }

      if (!abortRef.current && loopIdRef.current === thisLoopId) {
        setState("complete");
      }
    },
    [map, flyToLandmark, totalLandmarks, updateStoryMarkers],
  );

  /** Stop current playback (audio + orbit + camera animation). */
  const stopAll = useCallback(() => {
    abortRef.current = true;
    currentAudioStopRef.current?.();
    currentAudioStopRef.current = null;
    stopSpeaking();
    // Stop any in-progress flyTo/easeTo so moveend fires immediately
    if (map) {
      try { map.stop(); } catch { /* ignore if map is disposed */ }
    }
  }, [map]);

  // Initialize markers and auto-start
  useEffect(() => {
    if (!map) return;

    const start = () => {
      initStoryMarkers();
      runFromIndex(0);
    };

    if (map.isStyleLoaded()) {
      const timer = setTimeout(start, 300);
      return () => { clearTimeout(timer); stopAll(); };
    }

    map.once("load", start);
    return () => { stopAll(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Toggle pause/resume. */
  const togglePause = useCallback(() => {
    if (state === "flying" || state === "narrating") {
      abortRef.current = true;
      currentAudioStopRef.current?.();
      currentAudioStopRef.current = null;
      setState("paused");
    } else if (state === "paused") {
      // Resume from current chapter
      runFromIndex(currentIndex);
      setState("flying");
    }
  }, [state, currentIndex, runFromIndex]);

  /** Skip to next chapter — immediately starts the next landmark. */
  const skipNext = useCallback(() => {
    if (currentIndex >= totalLandmarks - 1) return;
    stopAll();
    const nextIdx = currentIndex + 1;
    // Use queueMicrotask for near-zero delay (allows stopAll to settle)
    queueMicrotask(() => runFromIndex(nextIdx));
  }, [currentIndex, totalLandmarks, stopAll, runFromIndex]);

  /** Jump to a specific chapter. */
  const jumpTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalLandmarks) return;
      stopAll();
      queueMicrotask(() => runFromIndex(index));
    },
    [totalLandmarks, stopAll, runFromIndex],
  );

  /** Toggle TTS. */
  const toggleTts = useCallback(() => {
    setTtsEnabled((prev) => {
      if (prev) {
        currentAudioStopRef.current?.();
        currentAudioStopRef.current = null;
      }
      return !prev;
    });
  }, []);

  /** Exit presentation. */
  const handleExit = useCallback(() => {
    stopAll();
    cleanupStoryMarkers();

    if (map) {
      map.flyTo({
        center: [-81.3792, 28.5383],
        zoom: 12,
        pitch: 45,
        bearing: 0,
        duration: 1500,
        essential: true,
      });
    }

    onExit();
  }, [map, onExit, cleanupStoryMarkers, stopAll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopAll(); };
  }, [stopAll]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="grain-texture glow-border fixed right-0 top-0 z-40 flex h-screen w-[440px] max-w-[92vw] flex-col"
      style={{
        background: "var(--glass-bg)",
        borderLeft: "1px solid var(--glass-border)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
      }}
    >
      {/* Brand header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-bold uppercase tracking-[0.15em]"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                color: "var(--brand-primary, #3560FF)",
                textShadow: "0 0 30px rgba(53, 96, 255, 0.3)",
              }}
            >
              Moonshots & Magic
            </h1>
            <p
              className="mt-0.5 text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--text-dim)" }}
            >
              The Story of Central Florida
            </p>
          </div>
          <button
            onClick={handleExit}
            className="rounded-full p-1.5 transition-colors hover:bg-white/10"
            title="Exit presentation"
          >
            <X className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
          </button>
        </div>
      </div>

      {/* Timeline + Chapter content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Vertical timeline bar */}
        <div className="relative flex w-14 flex-shrink-0 flex-col items-center py-2">
          {/* Progress line (filled) */}
          <div
            className="absolute left-1/2 top-2 w-px -translate-x-1/2"
            style={{
              height: `${(Math.max(currentIndex, 0) / Math.max(totalLandmarks - 1, 1)) * 100}%`,
              background: "var(--brand-primary, #3560FF)",
              transition: "height 1s ease-out",
            }}
          />
          {/* Background line */}
          <div
            className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          {/* Year dots */}
          {PRESENTATION_LANDMARKS.map((lm, i) => {
            const isActive = i === currentIndex;
            const isVisited = visitedIndices.has(i);
            return (
              <button
                key={lm.id}
                onClick={() => jumpTo(i)}
                className="group relative z-10 flex flex-col items-center"
                style={{ flex: 1, justifyContent: "center", cursor: "pointer" }}
                title={`${lm.year} — ${lm.title}`}
              >
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 12 : 8,
                    height: isActive ? 12 : 8,
                    background: isActive
                      ? "#3560FF"
                      : isVisited
                        ? "rgba(53, 96, 255, 0.6)"
                        : "rgba(255,255,255,0.15)",
                    boxShadow: isActive ? "0 0 12px rgba(53, 96, 255, 0.6)" : "none",
                    border: isActive ? "2px solid #FFFFFF" : "none",
                  }}
                />
                <span
                  className="mt-0.5 text-center leading-none transition-all duration-300"
                  style={{
                    fontSize: isActive ? "9px" : "7px",
                    color: isActive ? "#FFFFFF" : isVisited ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                    fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {lm.year}
                </span>
              </button>
            );
          })}
        </div>

        {/* Chapter content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-2">
          <AnimatePresence mode="wait">
            {landmark && (
              <motion.div
                key={landmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-1 flex-col"
              >
                {/* Year — large with frosted background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-3 inline-flex self-start rounded-xl px-5 py-2"
                  style={{
                    background: "rgba(53, 96, 255, 0.12)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(53, 96, 255, 0.2)",
                  }}
                >
                  <span
                    className="text-6xl font-bold"
                    style={{
                      fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                      color: "var(--brand-primary, #3560FF)",
                      textShadow:
                        "0 0 40px rgba(53, 96, 255, 0.5), 0 0 80px rgba(53, 96, 255, 0.2)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {landmark.year}
                  </span>
                </motion.div>

                {/* Chapter indicator */}
                <p
                  className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em]"
                  style={{ color: "var(--text-dim)" }}
                >
                  Chapter {landmark.chapter} of {totalLandmarks}
                </p>

                {/* Landmark title */}
                <h2
                  className="mb-0.5 text-2xl font-bold leading-tight"
                  style={{
                    fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                    color: "var(--text)",
                  }}
                >
                  {landmark.title}
                </h2>
                <p
                  className="mb-4 text-sm italic"
                  style={{ color: "rgba(53, 96, 255, 0.8)" }}
                >
                  {landmark.subtitle}
                </p>

                {/* B&W landmark image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative mb-4 overflow-hidden rounded-xl"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow:
                      "0 0 20px rgba(53, 96, 255, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Image
                    src={`/images/presentation/${landmark.id}.jpg`}
                    alt={landmark.title}
                    width={400}
                    height={225}
                    className="h-auto w-full object-cover"
                    style={{
                      filter: "grayscale(1) contrast(1.1) brightness(0.9)",
                      maxHeight: "180px",
                    }}
                    unoptimized
                  />
                  {/* Gradient overlay for blending */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 50%, rgba(10, 15, 30, 0.6) 100%)",
                    }}
                  />
                </motion.div>

                {/* Narrative text */}
                <AnimatePresence>
                  {narrativeVisible && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-sm leading-relaxed"
                      style={{
                        color: "var(--text)",
                        fontFamily: "var(--font-chakra-petch, sans-serif)",
                        lineHeight: 1.7,
                      }}
                    >
                      {landmark.narrative}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pre-start state */}
          {currentIndex < 0 && (
            <div className="flex flex-1 items-center justify-center">
              <p className="animate-pulse text-sm" style={{ color: "var(--text-dim)" }}>
                Preparing your journey...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex-shrink-0 px-6 pb-5 pt-3">
        <div
          className="flex items-center justify-center gap-1.5 rounded-full px-4 py-2"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {state === "complete" ? (
            <>
              <button
                onClick={() => {
                  visitedRef.current = new Set();
                  setVisitedIndices(new Set());
                  jumpTo(0);
                }}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                style={{ background: "var(--brand-primary, #3560FF)" }}
              >
                <Play className="h-3.5 w-3.5" />
                Replay
              </button>
              <button
                onClick={handleExit}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs text-white/60 transition-colors hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
                Exit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTts}
                className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                title={ttsEnabled ? "Mute narration" : "Unmute narration"}
              >
                {ttsEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>
              <div className="mx-0.5 h-4 w-px bg-white/15" />
              <button
                onClick={togglePause}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                title={state === "paused" ? "Resume" : "Pause"}
              >
                {state === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              <button
                onClick={skipNext}
                className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                title="Next chapter"
                disabled={currentIndex >= totalLandmarks - 1}
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
              <div className="mx-0.5 h-4 w-px bg-white/15" />
              <button
                onClick={handleExit}
                className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                title="Exit presentation"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
