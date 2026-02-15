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

/** CartoDB fallback style URLs — always available, no API key required. */
export const CARTO_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
} as const;

/** MapTiler style URL templates (requires API key). */
export const MAPTILER_STYLES = maptilerKey
  ? {
      light: `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`,
      dark: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${maptilerKey}`,
    }
  : null;

/**
 * Patches a MapTiler style to fix compatibility issues with MapLibre GL.
 * - Removes vector sources that have no `url` or `tiles` (e.g. `maptiler_attribution`).
 *   These are metadata-only sources that cause `Lh.url` crashes in MapLibre.
 * - Strips layers referencing removed sources.
 * @param style - Parsed style JSON object.
 * @returns The patched style object (mutated in-place).
 */
function patchMapTilerStyle(style: Record<string, unknown>): Record<string, unknown> {
  const sources = style.sources as Record<string, Record<string, unknown>> | undefined;
  if (!sources) return style;

  // Find vector sources with no tile data
  const broken = new Set<string>();
  for (const [name, src] of Object.entries(sources)) {
    if (src.type === "vector" && !src.url && !src.tiles) {
      broken.add(name);
      delete sources[name];
    }
  }

  if (broken.size > 0) {
    console.log("[Map] Removed tile-less sources:", [...broken].join(", "));
    // Strip layers referencing removed sources
    const layers = style.layers as Array<Record<string, unknown>> | undefined;
    if (layers) {
      style.layers = layers.filter((l) => !broken.has(l.source as string));
    }
  }

  return style;
}

/**
 * Fetches a MapLibre style JSON with retry logic.
 * Tries MapTiler first (up to 3 attempts with backoff), falls back to CartoDB on failure.
 * Returns the parsed style object — never a URL — so MapLibre won't hit 503s itself.
 * Patches MapTiler-specific issues (tile-less attribution sources).
 * @param isDark - Whether to fetch the dark theme variant.
 * @returns Parsed style JSON object ready for `new Map({ style })`.
 */
export async function fetchMapStyle(isDark: boolean): Promise<object> {
  const urls = [
    // Primary: MapTiler (if key available)
    ...(MAPTILER_STYLES ? [isDark ? MAPTILER_STYLES.dark : MAPTILER_STYLES.light] : []),
    // Fallback: CartoDB
    isDark ? CARTO_STYLES.dark : CARTO_STYLES.light,
  ];

  for (const url of urls) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const styleJson = await res.json();
          return patchMapTilerStyle(styleJson);
        }
        console.warn(`[Map] Style fetch attempt ${attempt + 1} failed (${res.status}) for ${url}`);
      } catch (err) {
        console.warn(`[Map] Style fetch attempt ${attempt + 1} error for ${url}:`, err);
      }
      // Backoff: 300ms, 900ms
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 300 * Math.pow(3, attempt)));
      }
    }
    console.warn(`[Map] All retries failed for ${url}, trying next source`);
  }

  // Should never reach here since CartoDB is highly reliable,
  // but return a minimal valid style as last resort.
  console.error("[Map] All style sources failed");
  return { version: 8, sources: {}, layers: [] };
}

/** Default map center as `[longitude, latitude]` (West of Lake Eola, Downtown Orlando). */
export const DEFAULT_CENTER: [number, number] = [-81.3780, 28.5431];
/** Default zoom level on initial load. */
export const DEFAULT_ZOOM = 15;
/** Default camera pitch in degrees (tilted for 3D buildings). */
export const DEFAULT_PITCH = 40;
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
