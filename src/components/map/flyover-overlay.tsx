/**
 * @module components/map/flyover-overlay
 * Full-screen overlay UI for flyover tours.
 * Displays navigation controls, captions, and progress indicator.
 */

"use client";

import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, ChevronRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FlyoverProgress, FlyoverWaypoint } from "@/lib/flyover/flyover-engine";

interface FlyoverOverlayProps {
  /** Current flyover progress state. */
  progress: FlyoverProgress;
  /** Callback when pause/resume is clicked. */
  onTogglePause: () => void;
  /** Callback when stop is clicked. */
  onStop: () => void;
  /** Callback when skip to next is clicked. */
  onNext: () => void;
  /** Callback to jump to a specific waypoint index. */
  onJumpTo?: (index: number) => void;
}

/** Caption/narration text display - positioned center-bottom. */
function CaptionBar({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-6 left-1/2 z-20 w-[90%] max-w-2xl -translate-x-1/2"
    >
      <div
        className="rounded-xl px-5 py-3 text-center text-sm leading-relaxed backdrop-blur-lg"
        style={{
          background: "rgba(0, 0, 0, 0.75)",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}

/** Progress indicator showing current position in tour with clickable waypoints. */
function ProgressIndicator({
  current,
  waypoints,
  onJumpTo,
}: {
  current: number;
  waypoints: FlyoverWaypoint[];
  onJumpTo?: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {waypoints.map((waypoint, i) => (
        <button
          key={waypoint.eventId}
          onClick={() => onJumpTo?.(i)}
          className="group relative h-2 w-6 rounded-full transition-all hover:h-2.5 hover:w-7"
          style={{
            background: i <= current ? "var(--brand-primary)" : "rgba(255,255,255,0.3)",
            cursor: onJumpTo ? "pointer" : "default",
          }}
          title={waypoint.event.title}
        >
          {/* Tooltip on hover */}
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {waypoint.event.title.length > 25
              ? waypoint.event.title.substring(0, 25) + "..."
              : waypoint.event.title}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Loading indicator shown during the "preparing" state while audio generates. */
function PreparingIndicator({ readyCount, total }: { readyCount: number; total: number }) {
  const pct = total > 0 ? (readyCount / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
    >
      <div
        className="flex items-center gap-3 rounded-full px-5 py-3 shadow-xl backdrop-blur-lg"
        style={{
          background: "rgba(0, 0, 0, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <Loader2 className="h-4 w-4 animate-spin text-[var(--brand-primary)]" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-white/80">
            Preparing your flyover...
          </span>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--brand-primary)" }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
        <span className="text-[11px] tabular-nums text-white/50">
          {readyCount}/{total}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Full-screen flyover overlay with controls and info display.
 * Shows event cards, captions, and navigation controls during tours.
 */
export function FlyoverOverlay({
  progress,
  onTogglePause,
  onStop,
  onNext,
  onJumpTo,
}: FlyoverOverlayProps) {
  const isActive = progress.state !== "idle" && progress.state !== "complete";
  const isPreparing = progress.state === "preparing";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-30"
        >
          {/* Top bar with controls - centered at top of screen */}
          <div className="pointer-events-auto absolute left-1/2 top-4 z-20 flex max-w-[95vw] -translate-x-1/2 items-center gap-3">
            {/* Combined tour info and controls */}
            <div
              className="flex items-center gap-4 rounded-full px-5 py-2.5 shadow-xl backdrop-blur-lg"
              style={{
                background: "rgba(0, 0, 0, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              {/* Tour title */}
              <span className="text-sm font-semibold text-white">
                Flyover Tour
              </span>

              {/* Progress - clickable waypoints */}
              <ProgressIndicator
                current={progress.currentIndex}
                waypoints={progress.waypoints}
                onJumpTo={isPreparing ? undefined : onJumpTo}
              />

              {/* Divider */}
              <div className="h-5 w-px bg-white/20" />

              {/* Controls */}
              <div className="flex items-center gap-1">
                {/* End Tour button - intentional, red-tinted */}
                <Button
                  variant="ghost"
                  className="h-8 gap-1 rounded-full px-3 text-xs font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  onClick={onStop}
                  title="End tour"
                >
                  <X className="h-3.5 w-3.5" />
                  End
                </Button>
                <div className="mx-1 h-4 w-px bg-white/20" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
                  onClick={onTogglePause}
                  title={progress.isPaused ? "Resume" : "Pause"}
                  disabled={isPreparing}
                >
                  {progress.isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
                  onClick={onNext}
                  title="Skip to next"
                  disabled={isPreparing || progress.currentIndex >= progress.waypoints.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Preparing indicator (bottom center) */}
          <AnimatePresence>
            {isPreparing && (
              <PreparingIndicator
                readyCount={progress.audioReadyCount}
                total={progress.waypoints.length}
              />
            )}
          </AnimatePresence>

          {/* Caption bar */}
          <AnimatePresence>
            {progress.currentNarrative && !isPreparing && (
              <CaptionBar text={progress.currentNarrative} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
