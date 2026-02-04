/**
 * @module components/effects/vignette
 * Radial gradient edge darkening effect for the brand aesthetic.
 * Creates a subtle vignette that focuses attention on the center.
 * Should only be rendered in dark mode.
 */

"use client";

/** Radial gradient vignette that darkens edges. */
export function Vignette() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: 30,
        background:
          "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)",
      }}
      aria-hidden="true"
    />
  );
}
