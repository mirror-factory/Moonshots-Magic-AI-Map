/**
 * @module components/effects/sparkles
 * Sparkles component - optimized with CSS animations for moving through space effect.
 * Creates a dreamy, magical atmosphere with twinkling particles.
 */

"use client";

import { useEffect, useRef } from "react";

interface SparklesProps {
  /** Number of sparkles to render. */
  count?: number;
}

/**
 * Renders animated sparkles with approach animation (moving through space effect).
 * Uses CSS animations for optimal performance.
 */
export function Sparkles({ count = 20 }: SparklesProps) {
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sparklesRef.current) return;

    const sparkles = Array.from({ length: count }, () => {
      const sparkle = document.createElement("div");
      const size = Math.random() * 3 + 1;
      const depth = Math.random(); // 0-1, determines speed of approach
      const duration = 3 + depth * 4; // 3-7 seconds based on depth
      const delay = Math.random() * 2; // Stagger start times

      sparkle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.4 ? "#0063CD" : "#FFFFFF"};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.4 + 0.2};
        box-shadow: 0 0 ${size * 3}px currentColor;
        pointer-events: none;
        animation: sparkleApproach ${duration}s ease-in-out ${delay}s infinite;
        will-change: transform, opacity;
      `;
      return sparkle;
    });

    sparkles.forEach((sparkle) => sparklesRef.current?.appendChild(sparkle));

    return () => {
      sparkles.forEach((sparkle) => sparkle.remove());
    };
  }, [count]);

  return <div ref={sparklesRef} className="pointer-events-none absolute inset-0 z-10" />;
}
