/**
 * @module components/effects/ambient-particles
 * Floating ambient particles over the map in dark mode.
 * Uses pure CSS animations (no motion/react) for performance.
 * 25 small circles drift upward with varying speeds and opacities.
 */

"use client";

import { useMemo } from "react";

interface Particle {
  left: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

/** Generate particle configs (memoized). */
function generateParticles(count: number): Particle[] {
  const colors = ["rgba(53, 96, 255, 0.2)", "rgba(255, 255, 255, 0.15)"];
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 2, // 2-4px
    opacity: Math.random() * 0.4 + 0.1, // 0.1-0.5
    duration: Math.random() * 15 + 15, // 15-30s
    delay: Math.random() * 20, // 0-20s
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

/** Floating ambient particles overlay for dark mode. */
export function AmbientParticles() {
  const particles = useMemo(() => generateParticles(25), []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 15 }}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            opacity: p.opacity,
            animation: `float-up ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
