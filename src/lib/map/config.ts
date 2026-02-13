/**
 * @module map/config
 * Map configuration constants — styles, default viewport, preset locations,
 * category colors, and labels. Used by MapLibre GL and UI controls.
 */

import type { EventCategory } from "@/lib/registries/types";

/**
 * Map style URLs by theme.
 *
 * Primary: MapTiler Streets v2 (rich POI labels, building names, restaurant names).
 * Fallback: CartoDB Positron/Dark Matter if no MapTiler API key is configured.
 *
 * Both use the OpenMapTiles schema — `render_height` and `source-layer: "building"` work.
 *
 * @see https://docs.maptiler.com/schema/
 * @see https://github.com/CartoDB/basemap-styles
 */
const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

export const MAP_STYLES_BY_THEME = maptilerKey
  ? {
      light: `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`,
      dark: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${maptilerKey}`,
    } as const
  : {
      light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    } as const;

/** Default map center as `[longitude, latitude]` (West of Lake Eola, Downtown Orlando). */
export const DEFAULT_CENTER: [number, number] = [-81.3780, 28.5431];
/** Default zoom level on initial load. */
export const DEFAULT_ZOOM = 15;
/** Default camera pitch in degrees (tilted for 3D buildings). */
export const DEFAULT_PITCH = 55;
/** Default camera bearing in degrees (angled for cinematic entry). */
export const DEFAULT_BEARING = -30;

/** Named locations for the "Quick Navigate" UI. Each has a center and zoom. */
export const PRESET_LOCATIONS: Record<string, { center: [number, number]; zoom: number }> = {
  orlando: { center: [-81.3792, 28.5383], zoom: 11 },
  downtown: { center: [-81.3789, 28.5421], zoom: 14 },
  kissimmee: { center: [-81.4076, 28.2920], zoom: 12 },
  tampa: { center: [-82.4572, 27.9506], zoom: 11 },
  winterPark: { center: [-81.3393, 28.5986], zoom: 13 },
  lakeEola: { center: [-81.3730, 28.5431], zoom: 15 },
};

/**
 * Hex color for each event category. MapLibre requires literal hex values
 * (not CSS custom properties), so these **must** stay in sync with the
 * `--category-*` CSS variables defined in `globals.css`.
 */
export const CATEGORY_COLORS: Record<EventCategory, string> = {
  music: "#5b8def",
  arts: "#7c9cf0",
  sports: "#4a90e8",
  food: "#6a9ff5",
  tech: "#3d82e6",
  community: "#88adf4",
  family: "#7b9eef",
  nightlife: "#5570d9",
  outdoor: "#4d95ea",
  education: "#6089e8",
  festival: "#6b8ff0",
  market: "#5e9ae8",
  other: "#7090c8",
};

/**
 * Returns the MapTiler terrain DEM source URL, or null if no API key is set.
 * @returns Terrain source URL or null.
 */
export function getTerrainSourceUrl(): string | null {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (!key) return null;
  return `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${key}`;
}

/** Terrain configuration for 3D mode. */
export const TERRAIN_CONFIG = {
  /** Height exaggeration factor (1.0 = realistic, higher = dramatic). */
  exaggeration: 1.5,
  /** Hillshade light direction in degrees (315 = northwest sun). */
  hillshadeDirection: 315,
} as const;

/** OpenRouteService API base URL. */
export const ORS_API_BASE = "https://api.openrouteservice.org/v2";

/** Human-readable display labels for each event category. */
export const CATEGORY_LABELS: Record<EventCategory, string> = {
  music: "Music",
  arts: "Arts & Culture",
  sports: "Sports",
  food: "Food & Drink",
  tech: "Tech",
  community: "Community",
  family: "Family",
  nightlife: "Nightlife",
  outdoor: "Outdoor",
  education: "Education",
  festival: "Festival",
  market: "Market",
  other: "Other",
};
