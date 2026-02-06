/**
 * @module map/config
 * Map configuration constants — styles, default viewport, preset locations,
 * category colors, and labels. Used by MapLibre GL and UI controls.
 */

import type { EventCategory } from "@/lib/registries/types";

/**
 * Map style URLs by theme.
 * Uses OpenFreeMap Liberty style for both themes (has 3D building height data).
 * Grayscale and dark effects are applied via CSS filters on the map canvas.
 * @see https://openfreemap.org
 */
export const MAP_STYLES_BY_THEME = {
  light: "https://tiles.openfreemap.org/styles/liberty",
  dark: "https://tiles.openfreemap.org/styles/liberty",
} as const;

/** Default map center as `[longitude, latitude]` (Orlando, FL). */
export const DEFAULT_CENTER: [number, number] = [-81.3792, 28.5383];
/** Default zoom level on initial load. */
export const DEFAULT_ZOOM = 10;
/** Default camera pitch in degrees (flat for performance). */
export const DEFAULT_PITCH = 0;
/** Default camera bearing in degrees. */
export const DEFAULT_BEARING = 0;

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
