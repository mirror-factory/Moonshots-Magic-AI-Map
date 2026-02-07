/**
 * @module components/chat/ditto-avatar
 * Animated SVG avatar for Ditto with idle, thinking, excited, greeting,
 * and celebrating states. Each state has unique eye, mouth, and particle
 * animations for personality.
 */

"use client";

import { motion } from "motion/react";

/** Available Ditto expression states. */
export type DittoState = "idle" | "thinking" | "excited" | "greeting" | "celebrating";

interface DittoAvatarProps {
  /** Current animation state. */
  state?: DittoState;
  /** Size of the avatar in pixels. */
  size?: number;
}

/** Mouth path for each expression state. */
const MOUTH_PATHS: Record<DittoState, string> = {
  idle: "M14 26 Q20 29 26 26",
  thinking: "M14 26 Q20 27 26 26",
  excited: "M14 26 Q20 32 26 26",
  greeting: "M13 25 Q20 32 27 25",
  celebrating: "M12 24 Q20 34 28 24",
};

/** Animated Ditto face SVG with 5 expression states. */
export function DittoAvatar({ state = "idle", size = 40 }: DittoAvatarProps) {
  const bodyAnimation = {
    idle: { y: [0, -3, 0] },
    thinking: { y: [0, -2, 0], scale: [1, 1.02, 1] },
    excited: { scale: [1, 1.15, 1] },
    greeting: { y: [0, -4, 0], rotate: [0, 3, -3, 0] },
    celebrating: { scale: [1, 1.2, 1], y: [0, -5, 0] },
  };

  const bodyTransition = {
    idle: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    thinking: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
    excited: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
    greeting: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const },
    celebrating: { duration: 0.6, repeat: Infinity, ease: "easeInOut" as const },
  };

  return (
    <motion.div
      animate={bodyAnimation[state]}
      transition={bodyTransition[state]}
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
              : state === "greeting"
                ? { cy: [18, 16, 18], r: [2.5, 2.8, 2.5] }
                : state === "celebrating"
                  ? { r: [2.5, 1, 2.5] }
                  : state === "excited"
                    ? { r: [2.5, 3, 2.5] }
                    : {}
          }
          transition={{
            duration: state === "thinking" ? 1.5 : state === "celebrating" ? 0.4 : 0.5,
            repeat: Infinity,
          }}
        />
        <motion.circle
          cx="26"
          cy="18"
          r="2.5"
          fill="var(--brand-primary)"
          animate={
            state === "thinking"
              ? { cx: [26, 28, 24, 26] }
              : state === "greeting"
                ? { cy: [18, 16, 18], r: [2.5, 2.8, 2.5] }
                : state === "celebrating"
                  ? { r: [2.5, 1, 2.5] }
                  : state === "excited"
                    ? { r: [2.5, 3, 2.5] }
                    : {}
          }
          transition={{
            duration: state === "thinking" ? 1.5 : state === "celebrating" ? 0.4 : 0.5,
            repeat: Infinity,
          }}
        />

        {/* Star eyes for celebrating */}
        {state === "celebrating" && (
          <>
            <motion.text
              x="11"
              y="21"
              fontSize="7"
              fill="var(--brand-primary)"
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ★
            </motion.text>
            <motion.text
              x="23"
              y="21"
              fontSize="7"
              fill="var(--brand-primary)"
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
            >
              ★
            </motion.text>
          </>
        )}

        {/* Mouth — morphs between states */}
        <motion.path
          d={MOUTH_PATHS[state]}
          stroke="var(--brand-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={
            state === "thinking"
              ? { d: [MOUTH_PATHS.thinking, MOUTH_PATHS.idle, MOUTH_PATHS.thinking] }
              : {}
          }
          transition={{ duration: 1, repeat: Infinity }}
        />
      </svg>

      {/* Sparkle dots for excited/greeting state */}
      {(state === "excited" || state === "greeting") && (
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

      {/* Confetti dots for celebrating state */}
      {state === "celebrating" && (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const colors = ["#ff6b6b", "#69db7c", "#ffd43b", "#74c0fc", "#b197fc", "#ffa94d"];
            const angles = [0, 60, 120, 180, 240, 300];
            const rad = (angles[i] * Math.PI) / 180;
            return (
              <motion.div
                key={`confetti-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  background: colors[i],
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [0, Math.cos(rad) * 20, 0],
                  y: [0, Math.sin(rad) * 20, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
              />
            );
          })}
        </>
      )}
    </motion.div>
  );
}
