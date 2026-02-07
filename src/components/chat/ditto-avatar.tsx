/**
 * @module components/chat/ditto-avatar
 * Simple animated SVG avatar for Ditto with idle, thinking, and excited states.
 */

"use client";

import { motion } from "motion/react";

type DittoState = "idle" | "thinking" | "excited";

interface DittoAvatarProps {
  /** Current animation state. */
  state?: DittoState;
  /** Size of the avatar in pixels. */
  size?: number;
}

/** Animated Ditto face SVG with 3 expression states. */
export function DittoAvatar({ state = "idle", size = 40 }: DittoAvatarProps) {
  return (
    <motion.div
      animate={
        state === "idle"
          ? { y: [0, -3, 0] }
          : state === "thinking"
            ? { y: [0, -2, 0], scale: [1, 1.02, 1] }
            : { scale: [1, 1.15, 1] }
      }
      transition={{
        duration: state === "excited" ? 0.5 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} fill="none">
        {/* Head */}
        <circle cx="20" cy="20" r="18" fill="var(--brand-primary)" opacity="0.15" />
        <circle cx="20" cy="20" r="16" fill="var(--brand-primary)" opacity="0.3" />

        {/* Eyes */}
        <motion.circle
          cx="14"
          cy="18"
          r="2.5"
          fill="var(--brand-primary)"
          animate={
            state === "thinking"
              ? { cx: [14, 16, 12, 14] }
              : state === "excited"
                ? { r: [2.5, 3, 2.5] }
                : {}
          }
          transition={{ duration: state === "thinking" ? 1.5 : 0.5, repeat: Infinity }}
        />
        <motion.circle
          cx="26"
          cy="18"
          r="2.5"
          fill="var(--brand-primary)"
          animate={
            state === "thinking"
              ? { cx: [26, 28, 24, 26] }
              : state === "excited"
                ? { r: [2.5, 3, 2.5] }
                : {}
          }
          transition={{ duration: state === "thinking" ? 1.5 : 0.5, repeat: Infinity }}
        />

        {/* Mouth */}
        <motion.path
          d={state === "excited" ? "M14 26 Q20 32 26 26" : "M14 26 Q20 29 26 26"}
          stroke="var(--brand-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={state === "thinking" ? { d: ["M14 26 Q20 27 26 26", "M14 26 Q20 29 26 26"] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </svg>

      {/* Sparkle dots for excited state */}
      {state === "excited" && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                background: "var(--brand-primary-soft)",
                top: `${10 + i * 8}%`,
                left: `${i % 2 === 0 ? -10 : 100}%`,
              }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
