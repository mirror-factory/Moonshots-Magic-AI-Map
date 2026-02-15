/**
 * @module components/presentation/features-showcase
 * Full-height right-side glass panel for the Features Showcase presentation.
 * Demonstrates app capabilities by orchestrating data layer toggles,
 * camera animations, and narrative text for each showcase step.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipForward, X, Sparkles } from "lucide-react";
import { useMap } from "@/components/map/use-map";
import { SHOWCASE_STEPS, type ShowcaseStep } from "@/data/features-showcase-steps";
import { flyToPoint } from "@/lib/map/camera-utils";
import { deselectEventHighlight } from "@/lib/map/venue-highlight";
import { startBackgroundMusic, stopBackgroundMusic } from "@/lib/audio/background-music";

/** Showcase playback state. */
type ShowcaseState = "idle" | "flying" | "lingering" | "paused" | "complete";

/** Props for {@link FeaturesShowcase}. */
interface FeaturesShowcaseProps {
  /** Callback to close the showcase. */
  onExit: () => void;
  /** Callback to toggle a data layer on/off. */
  onToggleDataLayer?: (layerKey: string, action: "on" | "off" | "toggle") => void;
  /** Callback to ask the AI about the current step. */
  onAskAI?: (context: string) => void;
  /** Callback to show an event on the map with cinematic flyover. */
  onShowEventOnMap?: (eventId: string) => void;
  /** Callback to open an event's detail panel. */
  onOpenDetail?: (eventId: string) => void;
  /** Callback to close the event detail panel. */
  onCloseDetail?: () => void;
}

/** Full-height Features Showcase presentation panel. */
export function FeaturesShowcase({ onExit, onToggleDataLayer, onAskAI, onShowEventOnMap, onOpenDetail, onCloseDetail }: FeaturesShowcaseProps) {
  const map = useMap();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<ShowcaseState>("idle");
  const [narrativeVisible, setNarrativeVisible] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeLayerRef = useRef<string | null>(null);
  const isPausedRef = useRef(false);

  const currentStep = SHOWCASE_STEPS[currentIndex];
  const isComplete = state === "complete";
  const isPaused = state === "paused";

  /** Deactivates the currently active data layer. */
  const deactivateCurrentLayer = useCallback(() => {
    if (activeLayerRef.current && onToggleDataLayer) {
      onToggleDataLayer(activeLayerRef.current, "off");
      activeLayerRef.current = null;
    }
  }, [onToggleDataLayer]);

  /** Runs a single step: fly camera, activate layer, show narrative, linger. */
  const runStep = useCallback(
    (index: number) => {
      if (!map) return;
      const step = SHOWCASE_STEPS[index];
      if (!step) {
        setState("complete");
        deactivateCurrentLayer();
        return;
      }

      // Cancel any pending timers
      if (timerRef.current) clearTimeout(timerRef.current);

      abortRef.current = new AbortController();
      setState("flying");
      setNarrativeVisible(false);
      setCurrentIndex(index);

      // Clear any previously selected event highlight and close detail panel
      if (map) deselectEventHighlight(map);
      onCloseDetail?.();

      // Deactivate previous layer, activate new one
      deactivateCurrentLayer();
      if (step.activateLayer && onToggleDataLayer) {
        onToggleDataLayer(step.activateLayer, "on");
        activeLayerRef.current = step.activateLayer;
      }

      // Fly camera
      flyToPoint(map, step.coordinates, {
        zoom: step.zoom,
        pitch: step.pitch,
        bearing: step.bearing,
        duration: step.duration,
      });

      // After fly completes, show narrative and linger
      timerRef.current = setTimeout(() => {
        if (isPausedRef.current) return;
        setState("lingering");
        setNarrativeVisible(true);

        // Select an event on the map if the step specifies one
        if (step.selectEventId) {
          onShowEventOnMap?.(step.selectEventId);
          onOpenDetail?.(step.selectEventId);
        }

        // Auto-advance after linger
        timerRef.current = setTimeout(() => {
          if (isPausedRef.current) return;
          const nextIndex = index + 1;
          if (nextIndex < SHOWCASE_STEPS.length) {
            runStep(nextIndex);
          } else {
            setState("complete");
            deactivateCurrentLayer();
          }
        }, step.lingerDuration);
      }, step.duration + 500);
    },
    [map, onToggleDataLayer, onShowEventOnMap, onOpenDetail, onCloseDetail, deactivateCurrentLayer],
  );

  /** Start the showcase from the beginning. */
  const startShowcase = useCallback(() => {
    startBackgroundMusic("showcase", 0.1);
    runStep(0);
  }, [runStep]);

  /** Skip to the next step. */
  const skipToNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isPausedRef.current = false;
    setState("flying");

    const nextIndex = currentIndex + 1;
    if (nextIndex < SHOWCASE_STEPS.length) {
      runStep(nextIndex);
    } else {
      setState("complete");
      deactivateCurrentLayer();
    }
  }, [currentIndex, runStep, deactivateCurrentLayer]);

  /** Pause/resume playback. */
  const togglePause = useCallback(() => {
    if (isPaused) {
      isPausedRef.current = false;
      setState("lingering");
      setNarrativeVisible(true);
      // Resume auto-advance
      timerRef.current = setTimeout(() => {
        if (isPausedRef.current) return;
        const nextIndex = currentIndex + 1;
        if (nextIndex < SHOWCASE_STEPS.length) {
          runStep(nextIndex);
        } else {
          setState("complete");
          deactivateCurrentLayer();
        }
      }, 5000);
    } else {
      isPausedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("paused");
    }
  }, [isPaused, currentIndex, runStep, deactivateCurrentLayer]);

  /** Jump to a specific step by clicking its dot. */
  const jumpToStep = useCallback(
    (index: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      isPausedRef.current = false;
      runStep(index);
    },
    [runStep],
  );

  /** Clean exit. */
  const handleExit = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();
    if (map) deselectEventHighlight(map);
    onCloseDetail?.();
    deactivateCurrentLayer();
    void stopBackgroundMusic();
    onExit();
  }, [map, onExit, onCloseDetail, deactivateCurrentLayer]);

  // Auto-start on mount
  useEffect(() => {
    const t = setTimeout(() => startShowcase(), 800);
    return () => {
      clearTimeout(t);
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
      void stopBackgroundMusic();
    };
  }, []);

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="pointer-events-auto fixed right-0 top-0 z-40 flex h-full w-[420px] max-w-[90vw] flex-col"
      style={{
        background: "linear-gradient(135deg, rgba(10, 10, 20, 0.92) 0%, rgba(15, 12, 30, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        fontFamily: "var(--font-rajdhani)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <Sparkles className="h-5 w-5 text-[#3560FF]" />
        <div className="flex-1">
          <h2 className="text-base font-bold tracking-wide text-white">Features Showcase</h2>
          <p className="text-xs text-white/40">Moonshots & Magic Digital Twin</p>
        </div>
        <button
          onClick={handleExit}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          aria-label="Exit showcase"
        >
          <X className="h-4 w-4 text-white/50" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 px-5 py-3">
        {SHOWCASE_STEPS.map((step, i) => (
          <button
            key={step.id}
            onClick={() => jumpToStep(i)}
            className="group relative flex flex-col items-center"
            title={step.title}
          >
            <div
              className="h-2.5 w-2.5 rounded-full transition-all"
              style={{
                background:
                  i === currentIndex
                    ? "#3560FF"
                    : i < currentIndex
                      ? "rgba(53, 96, 255, 0.4)"
                      : "rgba(255, 255, 255, 0.15)",
                boxShadow: i === currentIndex ? "0 0 8px rgba(53, 96, 255, 0.6)" : "none",
                transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
              }}
            />
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <div className="mb-4 text-4xl">✨</div>
              <h3 className="mb-2 text-xl font-bold text-white">Showcase Complete</h3>
              <p className="mb-6 text-sm text-white/50">
                You&apos;ve seen what Moonshots &amp; Magic can do. Ask the AI to explore further!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={startShowcase}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  Replay
                </button>
                <button
                  onClick={handleExit}
                  className="rounded-lg bg-[#3560FF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3560FF]/80"
                >
                  Close
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Step icon + number */}
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl">{currentStep.icon}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    background: "rgba(53, 96, 255, 0.15)",
                    color: "#3560FF",
                  }}
                >
                  Step {currentStep.step} of {SHOWCASE_STEPS.length}
                </span>
              </div>

              {/* Title + subtitle */}
              <h3 className="mb-1 text-xl font-bold tracking-wide text-white">{currentStep.title}</h3>
              <p className="mb-4 text-sm font-medium text-white/40">{currentStep.subtitle}</p>

              {/* Narrative text */}
              <AnimatePresence>
                {narrativeVisible && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-sm leading-relaxed text-white/70"
                  >
                    {currentStep.narrative}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Flying indicator */}
              {state === "flying" && (
                <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3560FF]" />
                  Flying to location...
                </div>
              )}

              {/* Active layer indicator */}
              {currentStep.activateLayer && narrativeVisible && (
                <div
                  className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
                  style={{
                    background: "rgba(53, 96, 255, 0.1)",
                    border: "1px solid rgba(53, 96, 255, 0.2)",
                    color: "rgba(53, 96, 255, 0.8)",
                  }}
                >
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3560FF]" />
                  {currentStep.title} active on map
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      {!isComplete && (
        <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
          <button
            onClick={handleExit}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white/60"
          >
            Exit
          </button>

          <div className="flex items-center gap-2">
            {onAskAI && (
              <button
                onClick={() => onAskAI(`Tell me more about: ${currentStep.title} - ${currentStep.subtitle}`)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/70"
              >
                <Sparkles className="h-3 w-3" />
                Ask AI
              </button>
            )}

            <button
              onClick={togglePause}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <Play className="h-3.5 w-3.5 text-white" />
              ) : (
                <Pause className="h-3.5 w-3.5 text-white" />
              )}
            </button>

            <button
              onClick={skipToNext}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Next step"
            >
              <SkipForward className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
