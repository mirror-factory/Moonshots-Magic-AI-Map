/**
 * @module components/map/use-map
 * React context and hook for accessing the MapLibre GL map instance.
 * Provided by {@link MapContainer} and consumed by child map components.
 */

"use client";

import { createContext, useContext } from "react";
import type maplibregl from "maplibre-gl";

export const MapContext = createContext<maplibregl.Map | null>(null);

/**
 * Returns the current MapLibre GL map instance from context.
 *
 * @returns The map instance, or null if not yet initialized.
 */
export function useMap() {
  return useContext(MapContext);
}
