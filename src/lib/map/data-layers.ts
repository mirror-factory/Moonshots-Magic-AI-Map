/**
 * @module map/data-layers
 * Types, constants, and reducer for the real-time data layer system.
 * Each layer can be independently toggled, loaded, and analyzed.
 * Multiple layers can be active simultaneously.
 */

/** Unique key for each data layer. */
export type DataLayerKey =
  | "weather"
  | "transit"
  | "cityData"
  | "nwsAlerts"
  | "aircraft"
  | "sunrail"
  | "developments"
  | "countyData"
  | "evChargers"
  | "airQuality";

/** Weather sub-type selector. */
export type WeatherSubType = "temperature" | "wind" | "precipitation" | "radar";

/** Display category for organizing layers in the toolbar. */
export type LayerCategory = "environment" | "transit" | "city" | "infrastructure";

/** Configuration metadata for each data layer. */
export interface DataLayerConfig {
  /** Display label. */
  label: string;
  /** Lucide icon name. */
  icon: string;
  /** Brief description shown on hover. */
  description: string;
  /** Display category. */
  category: LayerCategory;
  /** Whether this layer requires an API key env var. */
  requiresKey?: string;
}

/** Static configuration for all data layers. */
export const DATA_LAYER_CONFIGS: Record<DataLayerKey, DataLayerConfig> = {
  weather: {
    label: "Weather",
    icon: "cloud-sun",
    description: "Temperature, wind, precipitation, and radar overlays",
    category: "environment",
  },
  nwsAlerts: {
    label: "NWS Alerts",
    icon: "triangle-alert",
    description: "Active weather warnings and advisories",
    category: "environment",
  },
  airQuality: {
    label: "Air Quality",
    icon: "wind",
    description: "Real-time AQI from EPA monitoring stations",
    category: "environment",
    requiresKey: "NEXT_PUBLIC_AIRNOW_API_KEY",
  },
  transit: {
    label: "LYNX Buses",
    icon: "bus",
    description: "Real-time LYNX bus positions and routes",
    category: "transit",
  },
  sunrail: {
    label: "SunRail",
    icon: "train-front",
    description: "SunRail commuter rail stops and routes",
    category: "transit",
  },
  aircraft: {
    label: "Aircraft",
    icon: "plane",
    description: "Live aircraft positions near MCO",
    category: "transit",
  },
  cityData: {
    label: "City Data",
    icon: "landmark",
    description: "Orlando permits and code enforcement",
    category: "city",
  },
  developments: {
    label: "Developments",
    icon: "building-2",
    description: "Downtown Orlando development projects",
    category: "city",
  },
  countyData: {
    label: "Points of Interest",
    icon: "map-pin",
    description: "Parks, trails, public art, and fire stations",
    category: "city",
  },
  evChargers: {
    label: "EV Chargers",
    icon: "zap",
    description: "Electric vehicle charging stations",
    category: "infrastructure",
    requiresKey: "NEXT_PUBLIC_NREL_API_KEY",
  },
};

/** All data layer keys in display order. */
export const DATA_LAYER_KEYS: DataLayerKey[] = [
  "weather",
  "nwsAlerts",
  "airQuality",
  "transit",
  "sunrail",
  "aircraft",
  "cityData",
  "developments",
  "countyData",
  "evChargers",
];

/** State for the data layer system. */
export interface DataLayerState {
  /** Currently active (toggled on) layers. */
  active: Set<DataLayerKey>;
  /** Layers currently fetching data. */
  loading: Set<DataLayerKey>;
  /** Fetched data keyed by layer. */
  data: Partial<Record<DataLayerKey, unknown>>;
  /** Current AI analysis to display, or null if dismissed. */
  analysis: { key: DataLayerKey; content: string; model?: string } | null;
  /** Current weather sub-type selection. */
  weatherSubType: WeatherSubType;
}

/** Actions for the data layer reducer. */
export type DataLayerAction =
  | { type: "TOGGLE"; key: DataLayerKey }
  | { type: "CLEAR" }
  | { type: "LOAD_START"; key: DataLayerKey }
  | { type: "DATA_READY"; key: DataLayerKey; data: unknown }
  | { type: "ANALYSIS_READY"; key: DataLayerKey; content: string; model?: string }
  | { type: "DISMISS_ANALYSIS" }
  | { type: "SET_WEATHER_SUB_TYPE"; subType: WeatherSubType };

/** Initial state for the data layer reducer. */
export const initialDataLayerState: DataLayerState = {
  active: new Set(),
  loading: new Set(),
  data: {},
  analysis: null,
  weatherSubType: "temperature",
};

/**
 * Reducer for data layer state transitions.
 * Only one layer active at a time — toggling a new layer deactivates the previous.
 * @param state - Current state.
 * @param action - Action to apply.
 * @returns New state.
 */
export function dataLayerReducer(
  state: DataLayerState,
  action: DataLayerAction,
): DataLayerState {
  switch (action.type) {
    case "CLEAR":
      return { ...state, active: new Set(), loading: new Set(), data: {}, analysis: null };
    case "TOGGLE": {
      if (state.active.has(action.key)) {
        // Toggling off the current layer
        return {
          ...state,
          active: new Set(),
          loading: new Set(),
          data: {},
          analysis: null,
        };
      }
      // Toggling on — deactivate all others (single-select)
      const next = new Set<DataLayerKey>([action.key]);
      return { ...state, active: next, loading: new Set(), data: {}, analysis: null };
    }
    case "LOAD_START": {
      const nextLoading = new Set(state.loading);
      nextLoading.add(action.key);
      return { ...state, loading: nextLoading };
    }
    case "DATA_READY": {
      const nextLoading = new Set(state.loading);
      nextLoading.delete(action.key);
      return {
        ...state,
        loading: nextLoading,
        data: { ...state.data, [action.key]: action.data },
      };
    }
    case "ANALYSIS_READY":
      return {
        ...state,
        analysis: { key: action.key, content: action.content, model: action.model },
      };
    case "DISMISS_ANALYSIS":
      return { ...state, analysis: null };
    case "SET_WEATHER_SUB_TYPE":
      return { ...state, weatherSubType: action.subType };
    default:
      return state;
  }
}
