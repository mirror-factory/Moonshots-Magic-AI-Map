/**
 * @module components/effects/film-grain
 * Canvas-based animated film grain effect for the brand aesthetic.
 * Creates a retro 70s-80s analog photography look with animated noise.
 * Should only be rendered in dark mode.
 */

"use client";

import { useEffect, useRef } from "react";

/** Animated canvas noise overlay at 35% opacity with mix-blend-overlay. */
export function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      // Use 2x device pixel ratio for sharpness
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationId: number;
    const renderNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise; // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
        data[i + 3] = Math.random() * 80 + 40; // Alpha: 40-120
      }
      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(renderNoise);
    };
    renderNoise();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-35 mix-blend-overlay"
      style={{ zIndex: 50 }}
      aria-hidden="true"
    />
  );
}
