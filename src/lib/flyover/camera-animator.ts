/**
 * @module lib/flyover/camera-animator
 * MapLibre camera animation utilities for flyover tours.
 * Provides smooth, cinematic camera movements between waypoints,
 * including orbital sweeps using rAF-driven bearing increments.
 */

import type { Map as MaplibreMap } from "maplibre-gl";
import type { FlyoverWaypoint } from "./flyover-engine";

/** Options for camera animation. */
export interface CameraAnimationOptions {
  /** Animation duration in milliseconds. */
  duration?: number;
  /** Easing curve factor (higher = more ease). */
  curve?: number;
  /** Whether to allow interruption. */
  essential?: boolean;
}

/** Options for orbital camera functions. */
export interface OrbitalOptions {
  /** Total orbit duration in milliseconds. */
  duration?: number;
  /** Degrees of bearing rotation per orbit. */
  degreesPerOrbit?: number;
  /** Camera pitch during orbit. */
  pitch?: number;
  /** Abort ref — set `.current = true` to cancel the orbit mid-frame. */
  abortRef?: { current: boolean };
}

/**
 * Animates the map camera to a waypoint position.
 * Uses MapLibre's flyTo with cinematic settings.
 * @param map - MapLibre map instance.
 * @param waypoint - Target waypoint.
 * @param options - Animation options.
 * @returns Promise that resolves when animation completes.
 */
export function animateToWaypoint(
  map: MaplibreMap,
  waypoint: FlyoverWaypoint,
  options: CameraAnimationOptions = {}
): Promise<void> {
  const { duration = waypoint.duration, curve = 1.42, essential = true } = options;

  return new Promise((resolve) => {
    const onMoveEnd = () => {
      map.off("moveend", onMoveEnd);
      resolve();
    };

    map.on("moveend", onMoveEnd);

    map.flyTo({
      center: waypoint.center,
      zoom: waypoint.zoom,
      pitch: waypoint.pitch,
      bearing: waypoint.bearing,
      duration,
      curve,
      essential,
    });
  });
}

/**
 * Smoothly animates camera pitch and bearing for a dramatic effect.
 * @param map - MapLibre map instance.
 * @param pitch - Target pitch angle.
 * @param bearing - Target bearing angle.
 * @param duration - Animation duration in milliseconds.
 */
export function animateCameraAngle(
  map: MaplibreMap,
  pitch: number,
  bearing: number,
  duration: number = 1000
): void {
  map.easeTo({
    pitch,
    bearing,
    duration,
  });
}

/**
 * Resets the camera to a neutral overhead view.
 * @param map - MapLibre map instance.
 * @param center - Center coordinates [lng, lat].
 * @param duration - Animation duration in milliseconds.
 */
export function resetCamera(
  map: MaplibreMap,
  center: [number, number],
  duration: number = 1500
): Promise<void> {
  return new Promise((resolve) => {
    const onMoveEnd = () => {
      map.off("moveend", onMoveEnd);
      resolve();
    };

    map.on("moveend", onMoveEnd);

    map.flyTo({
      center,
      zoom: 11,
      pitch: 0,
      bearing: 0,
      duration,
      essential: true,
    });
  });
}

/**
 * Cinematic intro animation — orbital sweep replacing simple flyTo.
 * Flies to the center with a tilted camera, then sweeps 60° of bearing.
 * @param map - MapLibre map instance.
 * @param center - Center coordinates [lng, lat].
 * @param abortRef - Optional abort ref for cancellation.
 * @returns Promise that resolves when the intro sequence completes.
 */
export function cinematicIntro(
  map: MaplibreMap,
  center: [number, number],
  abortRef?: { current: boolean }
): Promise<void> {
  return new Promise((resolve) => {
    const onMoveEnd = () => {
      map.off("moveend", onMoveEnd);
      if (abortRef?.current) {
        resolve();
        return;
      }
      // After reaching center, do a short orbital sweep
      orbitalSweep(map, { duration: 3000, degreesPerOrbit: 60, pitch: 50, abortRef })
        .then(resolve);
    };

    map.on("moveend", onMoveEnd);

    map.flyTo({
      center,
      zoom: 13,
      pitch: 50,
      bearing: -30,
      duration: 2500,
      curve: 1.3,
      essential: true,
    });
  });
}

/**
 * Slow orbital sweep — rotates bearing smoothly using rAF.
 * Used during narration to add subtle camera motion.
 * @param map - MapLibre map instance.
 * @param options - Orbital animation options.
 * @returns Promise that resolves when orbit completes or is aborted.
 */
export function orbitalSweep(
  map: MaplibreMap,
  options: OrbitalOptions = {}
): Promise<void> {
  const {
    duration = 6000,
    degreesPerOrbit = 45,
    pitch = 50,
    abortRef,
  } = options;

  return new Promise((resolve) => {
    const startBearing = map.getBearing();
    const startTime = performance.now();

    const frame = (now: number) => {
      if (abortRef?.current) {
        resolve();
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing: ease-in-out cubic
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const bearing = startBearing + degreesPerOrbit * eased;

      map.easeTo({
        bearing,
        pitch,
        duration: 0,
        animate: false,
      });

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(frame);
  });
}

/**
 * Orbits the camera around a waypoint during narration.
 * Provides gentle bearing rotation to keep the view dynamic.
 * @param map - MapLibre map instance.
 * @param center - Waypoint center to orbit around.
 * @param options - Orbital options.
 * @returns Promise that resolves when orbit completes or is aborted.
 */
export function orbitWaypoint(
  map: MaplibreMap,
  _center: [number, number],
  options: OrbitalOptions = {}
): Promise<void> {
  // _center accepted for API consistency — rAF bearing rotation naturally orbits
  // around the current map center (already set by animateToWaypoint).
  const {
    duration = 8000,
    degreesPerOrbit = 30,
    pitch,
    abortRef,
  } = options;

  return orbitalSweep(map, {
    duration,
    degreesPerOrbit,
    pitch: pitch ?? map.getPitch(),
    abortRef,
  });
}

/**
 * Creates an intro camera animation (legacy — use cinematicIntro for orbital version).
 * Zooms out and tilts. Used at the start of a flyover tour.
 * @param map - MapLibre map instance.
 * @param center - Center coordinates [lng, lat].
 * @param duration - Animation duration in milliseconds.
 */
export function introAnimation(
  map: MaplibreMap,
  center: [number, number],
  duration: number = 2000
): Promise<void> {
  return new Promise((resolve) => {
    const onMoveEnd = () => {
      map.off("moveend", onMoveEnd);
      resolve();
    };

    map.on("moveend", onMoveEnd);

    map.flyTo({
      center,
      zoom: 12,
      pitch: 45,
      bearing: -20,
      duration,
      curve: 1.2,
      essential: true,
    });
  });
}

/**
 * Creates an outro camera animation that rises up and levels out.
 * Used at the end of a flyover tour.
 * @param map - MapLibre map instance.
 * @param center - Center coordinates [lng, lat].
 * @param duration - Animation duration in milliseconds.
 */
export function outroAnimation(
  map: MaplibreMap,
  center: [number, number],
  duration: number = 2500
): Promise<void> {
  return new Promise((resolve) => {
    const onMoveEnd = () => {
      map.off("moveend", onMoveEnd);
      resolve();
    };

    map.on("moveend", onMoveEnd);

    map.flyTo({
      center,
      zoom: 10,
      pitch: 0,
      bearing: 0,
      duration,
      curve: 1.5,
      essential: true,
    });
  });
}

/**
 * Calculates the center point of multiple coordinates.
 * @param coordinates - Array of [lng, lat] coordinates.
 * @returns Center point [lng, lat].
 */
export function calculateCenter(coordinates: [number, number][]): [number, number] {
  if (coordinates.length === 0) {
    return [-81.3792, 28.5383]; // Default to Orlando
  }

  const sum = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0]
  );

  return [sum[0] / coordinates.length, sum[1] / coordinates.length];
}
