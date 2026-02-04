/**
 * @module components/effects/static-stars
 * Static star field effect for the brand aesthetic.
 * Creates 150+ white dots scattered across the viewport with varying sizes and opacities.
 * Should only be rendered in dark mode.
 */

"use client";

import { useMemo } from "react";

interface Star {
  left: string;
  top: string;
  size: number;
  opacity: number;
}

/** Generates static star positions (memoized to prevent re-generation on re-render). */
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 0.5, // 0.5-2.5px
    opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
  }));
}

/** Static star field overlay with 150 white dots. */
export function StaticStars() {
  const stars = useMemo(() => generateStars(150), []);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 20 }}
      aria-hidden="true"
    >
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
