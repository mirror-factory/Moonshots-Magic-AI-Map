/**
 * @module components/map/data-layers/layer-rotation
 * Shared auto-rotation manager for data layers.
 * Only one data layer rotation runs at a time — starting a new one
 * stops the previous, preventing conflicts during fitBounds animations.
 */

import type { Map as MaplibreMap } from "maplibre-gl";

/** Currently active rotation frame ID. */
let activeFrame: number | null = null;

/** Rotation speed in degrees per second. */
const ROTATION_SPEED = 3;

/**
 * Starts auto-rotation for a data layer view.
 * Stops any previously running data layer rotation first.
 *
 * @param map - MapLibre map instance.
 */
export function startDataLayerRotation(map: MaplibreMap): void {
  stopDataLayerRotation();
  let lastTime = performance.now();

  const animate = (now: number) => {
    if (!map.getStyle()) {
      activeFrame = null;
      return;
    }
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    map.easeTo({ bearing: map.getBearing() + ROTATION_SPEED * dt, duration: 0, animate: false });
    activeFrame = requestAnimationFrame(animate);
  };

  activeFrame = requestAnimationFrame(animate);
}

/**
 * Stops the currently running data layer rotation.
 */
export function stopDataLayerRotation(): void {
  if (activeFrame !== null) {
    cancelAnimationFrame(activeFrame);
    activeFrame = null;
  }
}
