/**
 * @module lib/flyover/camera-animator
 * MapLibre camera animation utilities for flyover tours.
 * Provides smooth, cinematic camera movements between waypoints.
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
 * Creates an intro camera animation that zooms out and tilts.
 * Used at the start of a flyover tour.
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
