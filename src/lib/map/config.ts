/**
 * @module map/config
 * Map configuration constants — styles, default viewport, preset locations,
 * category colors, and labels. Used by MapLibre GL and UI controls.
 */

import type { EventCategory } from "@/lib/registries/types";

/** MapTiler API key from environment. */
export const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

/** Available CARTO basemap style URLs for MapLibre GL (fallback without 3D). */
export const MAP_STYLES = {
  darkMatter:
    "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  positron: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
} as const;

/** MapTiler style URLs by theme — supports 3D terrain and buildings. */
export const MAP_STYLES_BY_THEME = {
  light: MAPTILER_KEY
    ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`
    : MAP_STYLES.positron,
  dark: MAPTILER_KEY
    ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`
    : MAP_STYLES.darkMatter,
} as const;

/** MapTiler terrain source URL for 3D terrain. */
export const TERRAIN_SOURCE = MAPTILER_KEY
  ? `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`
  : "";

/** Default map center as `[longitude, latitude]` (Orlando, FL). */
export const DEFAULT_CENTER: [number, number] = [-81.3792, 28.5383];
/** Default zoom level on initial load. */
export const DEFAULT_ZOOM = 10;
/** Default camera pitch in degrees (tilted for 3D view). */
export const DEFAULT_PITCH = 50;
/** Default camera bearing in degrees. */
export const DEFAULT_BEARING = -15;

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
  music: "#ff6b6b",
  arts: "#b197fc",
  sports: "#74c0fc",
  food: "#ffa94d",
  tech: "#69db7c",
  community: "#ffd43b",
  family: "#f783ac",
  nightlife: "#b197fc",
  outdoor: "#69db7c",
  education: "#74c0fc",
  festival: "#ff6b6b",
  market: "#ffa94d",
  other: "#888888",
};

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
