/**
 * @module components/effects/starfield-transition
 * Full-screen starfield transition overlay for seamless page transitions.
 * Shows dark sky with stars, sparkles, and grain texture.
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stars } from "./stars";
import { Sparkles } from "./sparkles";

interface StarfieldTransitionProps {
  /** Whether to show the transition. */
  show: boolean;
  /** Callback when transition completes. */
  onComplete?: () => void;
  /** Duration of fade out in milliseconds. */
  duration?: number;
}

/**
 * Starfield transition overlay for seamless page transitions.
 * Automatically fades out after appearing.
 */
export function StarfieldTransition({
  show,
  onComplete,
  duration = 1500,
}: StarfieldTransitionProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Wait longer before starting fade to give map time to load
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 800);

      // Call onComplete after full transition
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, duration + 800);

      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [show, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration / 1000, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-[1000]"
          style={{ background: "#050505" }}
        >
          {/* Stars with shooting stars */}
          <Stars count={300} shootingStars={3} />

          {/* Sparkles */}
          <Sparkles count={20} />

          {/* Grain texture */}
          <div className="grain-texture absolute inset-0 z-10" />

          {/* Blue ambient glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "80vw",
              height: "80vh",
              background:
                "radial-gradient(ellipse, rgba(0, 99, 205, 0.3) 0%, rgba(0, 99, 205, 0.1) 50%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
