/**
 * @module components/effects/blurred-stars
 * Animated blurred star field for the intro modal background.
 * Creates a dreamy, space-like atmosphere with slow-drifting stars.
 */

"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur: number;
  drift: { x: number; y: number };
  duration: number;
}

interface BlurredStarsProps {
  /** Number of stars to render. */
  count?: number;
  /** Base color of the stars. */
  color?: string;
}

/**
 * Generates random star configurations with position, size, and animation parameters.
 * @param count - Number of stars to generate.
 * @returns Array of star configurations.
 */
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 4, // 1-5px
    opacity: 0.3 + Math.random() * 0.7, // 0.3-1.0
    blur: Math.random() * 3, // 0-3px blur
    drift: {
      x: (Math.random() - 0.5) * 20, // -10 to 10 pixels drift
      y: (Math.random() - 0.5) * 20,
    },
    duration: 3 + Math.random() * 4, // 3-7s animation duration
  }));
}

/** Individual star with subtle drift animation. */
function StarComponent({ star, color }: { star: Star; color: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: star.size,
        height: star.size,
        background: color,
        opacity: star.opacity,
        filter: `blur(${star.blur}px)`,
      }}
      animate={{
        x: [0, star.drift.x, 0],
        y: [0, star.drift.y, 0],
        opacity: [star.opacity, star.opacity * 0.6, star.opacity],
      }}
      transition={{
        duration: star.duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/**
 * Animated blurred star field background.
 * Stars slowly drift and pulse for a dreamy space atmosphere.
 */
export function BlurredStars({ count = 150, color = "#ffffff" }: BlurredStarsProps) {
  const stars = useMemo(() => generateStars(count), [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blue ambient glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #0063CD 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <StarComponent key={star.id} star={star} color={color} />
      ))}
    </div>
  );
}
