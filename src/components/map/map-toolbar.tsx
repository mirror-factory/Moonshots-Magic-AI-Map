/**
 * @module components/map/map-toolbar
 * Unified top-center icon bar with expandable tabs (Filter, Distance, Search, Settings, Demos)
 * and standalone buttons (List, Chat, Location).
 * Absorbs geolocation, auto-rotate, audio, and zoom logic from the old MapStatusBar.
 */

"use client";

import { useEffect, useState, useRef, useCallback, Fragment } from "react";
import maplibregl from "maplibre-gl";
import {
  CalendarDays,
  Search,
  Settings,
  Play,
  X,
  Box,
  Loader2,
  LocateFixed,
  Plus,
  Minus,
  RotateCw,
  Volume2,
  VolumeX,
  User,
  Map,
  Compass,
  Film,
  Sparkles,
  Layers,
  CloudSun,
  Bus,
  Landmark,
  List,
  MessageSquare,
  Crosshair,
  TriangleAlert,
  Wind,
  TrainFront,
  Plane,
  Building2,
  Zap,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import {
  DATA_LAYER_KEYS,
  DATA_LAYER_CONFIGS,
  type DataLayerKey,
  type WeatherSubType,
  type LayerCategory,
} from "@/lib/map/data-layers";
import {
  startBackgroundMusic,
  stopBackgroundMusic,
  setBackgroundMusicVolume,
} from "@/lib/audio/background-music";
import { useMap } from "./use-map";
import { MapSearchBar } from "./map-search-bar";
import {
  type DatePreset,
  type DistancePreset,
  DATE_PRESET_LABELS,
  DISTANCE_PRESET_LABELS,
} from "@/lib/map/event-filters";

// ── User Location Marker (moved from MapStatusBar) ──────────────────
const USER_LOC_SOURCE = "user-location-source";
const USER_LOC_GLOW = "user-location-glow";
const USER_LOC_DOT = "user-location-dot";
const USER_LOC_LABEL = "user-location-label";
const USER_LOC_COLOR = "#00D4AA";

let userLocPulseFrame: number | null = null;

/** Starts a continuous pulse animation on the user location marker. */
function startUserLocPulse(map: maplibregl.Map) {
  stopUserLocPulse();
  const t0 = performance.now();

  const animate = () => {
    if (!map.getStyle()) { userLocPulseFrame = null; return; }
    const t = (performance.now() - t0) / 1000;
    const p = Math.sin(t * 2) * 0.5 + 0.5;

    if (map.getLayer(USER_LOC_GLOW)) {
      map.setPaintProperty(USER_LOC_GLOW, "circle-radius", 20 + p * 20);
      map.setPaintProperty(USER_LOC_GLOW, "circle-opacity", 0.1 + p * 0.15);
    }
    if (map.getLayer(USER_LOC_DOT)) {
      map.setPaintProperty(USER_LOC_DOT, "circle-radius", 6 + p * 2);
    }

    userLocPulseFrame = requestAnimationFrame(animate);
  };

  userLocPulseFrame = requestAnimationFrame(animate);
}

/** Stops the user location pulse animation. */
function stopUserLocPulse() {
  if (userLocPulseFrame !== null) {
    cancelAnimationFrame(userLocPulseFrame);
    userLocPulseFrame = null;
  }
}

/** Creates or updates the user location marker on the map. */
function updateUserLocationMarker(map: maplibregl.Map, coords: [number, number]) {
  if (!map.getStyle()) return;

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      geometry: { type: "Point", coordinates: coords },
      properties: { label: "You are here" },
    }],
  };

  const source = map.getSource(USER_LOC_SOURCE) as maplibregl.GeoJSONSource | undefined;
  if (source) {
    source.setData(geojson);
    return;
  }

  map.addSource(USER_LOC_SOURCE, { type: "geojson", data: geojson });

  map.addLayer({
    id: USER_LOC_GLOW,
    type: "circle",
    source: USER_LOC_SOURCE,
    paint: {
      "circle-radius": 30,
      "circle-color": USER_LOC_COLOR,
      "circle-opacity": 0.15,
      "circle-blur": 1,
    },
  });

  map.addLayer({
    id: USER_LOC_DOT,
    type: "circle",
    source: USER_LOC_SOURCE,
    paint: {
      "circle-radius": 7,
      "circle-color": USER_LOC_COLOR,
      "circle-opacity": 0.95,
      "circle-stroke-width": 2.5,
      "circle-stroke-color": "#FFFFFF",
      "circle-stroke-opacity": 1,
    },
  });

  map.addLayer({
    id: USER_LOC_LABEL,
    type: "symbol",
    source: USER_LOC_SOURCE,
    layout: {
      "text-field": ["get", "label"],
      "text-size": 11,
      "text-offset": [0, 1.6],
      "text-anchor": "top",
      "text-font": ["Open Sans Bold"],
    },
    paint: {
      "text-color": USER_LOC_COLOR,
      "text-halo-color": "rgba(0, 0, 0, 0.7)",
      "text-halo-width": 2,
    },
  });

  startUserLocPulse(map);
}

/** Removes all user location marker layers and source from the map. */
function removeUserLocationMarker(map: maplibregl.Map) {
  if (!map.getStyle()) return;
  stopUserLocPulse();
  for (const id of [USER_LOC_LABEL, USER_LOC_DOT, USER_LOC_GLOW]) {
    if (map.getLayer(id)) map.removeLayer(id);
  }
  if (map.getSource(USER_LOC_SOURCE)) map.removeSource(USER_LOC_SOURCE);
}

// ── Layer icon mapping (icon name → Lucide component) ────────────────
const LAYER_ICONS: Record<string, LucideIcon> = {
  "cloud-sun": CloudSun,
  "triangle-alert": TriangleAlert,
  "wind": Wind,
  "bus": Bus,
  "train-front": TrainFront,
  "plane": Plane,
  "landmark": Landmark,
  "building-2": Building2,
  "map-pin": MapPin,
  "zap": Zap,
};

/** Category display labels and order. */
const CATEGORY_ORDER: { key: LayerCategory; label: string }[] = [
  { key: "environment", label: "Environment" },
  { key: "transit", label: "Transit" },
  { key: "city", label: "City" },
  { key: "infrastructure", label: "Infrastructure" },
];

// ── Weather sub-type options ─────────────────────────────────────────
const WEATHER_SUB_TYPES: { value: WeatherSubType; label: string }[] = [
  { value: "temperature", label: "Temp" },
  { value: "wind", label: "Wind" },
  { value: "precipitation", label: "Rain" },
  { value: "radar", label: "Radar" },
];

// ── Tab types ────────────────────────────────────────────────────────
type ToolbarTab = "filter" | "distance" | "search" | "settings" | "demos";

/** Demo option identifiers. */
export type DemoOption = "home" | "story" | "flyover" | "showcase" | "personalize";

/** Props for {@link MapToolbar}. */
interface MapToolbarProps {
  /** Currently active date filter preset. */
  activePreset?: DatePreset;
  /** Callback when user changes the date filter preset. */
  onPresetChange?: (preset: DatePreset) => void;
  /** Active distance filter in miles, or null for no distance filter. */
  distanceFilter?: DistancePreset;
  /** Callback when distance filter changes. */
  onDistanceFilterChange?: (distance: DistancePreset) => void;
  /** Whether the user's location is available for distance filtering. */
  hasUserLocation?: boolean;
  /** Whether AI search results are currently overriding the date filter. */
  aiResultsActive?: boolean;
  /** Callback to clear AI search results and restore the date filter. */
  onClearAiResults?: () => void;
  /** Callback to get directions to a coordinate (from search). */
  onGetDirectionsToCoord?: (coordinate: [number, number]) => void;
  /** Set of active data layer keys. */
  activeDataLayers?: Set<DataLayerKey>;
  /** Set of loading data layer keys. */
  loadingDataLayers?: Set<DataLayerKey>;
  /** Callback when a data layer is toggled. */
  onToggleDataLayer?: (key: DataLayerKey) => void;
  /** Fetched data per layer for status display. */
  dataLayerData?: Partial<Record<DataLayerKey, unknown>>;
  /** Current weather sub-type. */
  weatherSubType?: WeatherSubType;
  /** Callback when weather sub-type changes. */
  onWeatherSubTypeChange?: (subType: WeatherSubType) => void;
  /** Whether 3D mode is on. */
  mode3D?: boolean;
  /** Toggle 3D mode. */
  onToggle3D?: () => void;
  /** Callback when location is enabled/disabled. */
  onLocationChange?: (enabled: boolean) => void;
  /** Start personalization flow. */
  onStartPersonalization?: () => void;
  /** Callback when user location is updated (for distance filtering). */
  onLocationUpdate?: (coords: [number, number]) => void;
  /** Callback when a demo option is selected. */
  onDemo?: (option: DemoOption) => void;
  /** Force-stop auto-rotation (e.g. when directions or flyover are active). */
  disableAutoRotate?: boolean;
  /** Whether coordinate readout is visible. */
  showCoordinates?: boolean;
  /** Toggle coordinate readout visibility. */
  onToggleCoordinates?: () => void;
  /** Whether events panel is open. */
  eventsPanelOpen?: boolean;
  /** Toggle events panel visibility. */
  onToggleEventsPanel?: () => void;
  /** Current chat position mode. */
  chatPosition?: "center" | "right";
  /** Callback when chat position changes. */
  onChatPositionChange?: (position: "center" | "right") => void;
  /** Called when a toolbar tab or layer panel is opened (for clearing data layers). */
  onToolbarTabOpen?: () => void;
  /** Clear all active data layers. */
  onClearDataLayers?: () => void;
  /** Local venues for search autocomplete (deduplicated from events). */
  localVenues?: import("@/lib/map/geocoding").LocalVenue[];
}

/** Shared glass pill styles for the toolbar. */
const glassPill: React.CSSProperties = {
  background: "rgba(10, 10, 15, 0.82)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
};

/** Unified top-center icon bar with expandable filter/search/layers/settings tabs. */
export function MapToolbar({
  activePreset,
  onPresetChange,
  distanceFilter,
  onDistanceFilterChange,
  hasUserLocation,
  aiResultsActive,
  onClearAiResults,
  onGetDirectionsToCoord,
  activeDataLayers,
  loadingDataLayers,
  onToggleDataLayer,
  weatherSubType,
  onWeatherSubTypeChange,
  mode3D = false,
  onToggle3D,
  onLocationChange,
  onStartPersonalization,
  onLocationUpdate,
  onDemo,
  disableAutoRotate,
  showCoordinates,
  onToggleCoordinates,
  eventsPanelOpen,
  onToggleEventsPanel,
  chatPosition = "center",
  onChatPositionChange,
  onToolbarTabOpen,
  onClearDataLayers,
  localVenues,
}: MapToolbarProps) {
  const map = useMap();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ToolbarTab | null>(null);

  // Geolocation state
  const [locating, setLocating] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const userCoordsRef = useRef<[number, number] | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Auto-rotate state
  const [autoRotating, setAutoRotating] = useState(false);
  const autoRotateRef = useRef<number>(0);

  // Audio state
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.12);

  // Data layer boxes visibility
  const [layersVisible, setLayersVisible] = useState(false);

  // Ref tracking whether a data layer is active (for gating GPS marker updates)
  const dataLayerActiveRef = useRef(false);

  // Update data layer active ref when activeDataLayers changes
  useEffect(() => {
    dataLayerActiveRef.current = (activeDataLayers?.size ?? 0) > 0;
  }, [activeDataLayers]);

  // Close dropdown on click outside
  useEffect(() => {
    if (activeTab === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeTab]);

  // ── Persistent geolocation tracking ──
  useEffect(() => {
    if (!map || !navigator.geolocation) return;

    const onPosition = (pos: GeolocationPosition) => {
      const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
      userCoordsRef.current = coords;
      setHasLocation(true);
      onLocationUpdate?.(coords);

      // Don't show GPS marker while a data layer is active
      if (dataLayerActiveRef.current) return;

      if (map.isStyleLoaded()) {
        updateUserLocationMarker(map, coords);
      } else {
        map.once("load", () => updateUserLocationMarker(map, coords));
      }
    };

    const onError = () => { /* Geolocation unavailable */ };

    navigator.geolocation.getCurrentPosition(onPosition, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
    });

    watchIdRef.current = navigator.geolocation.watchPosition(onPosition, onError, {
      enableHighAccuracy: true,
      maximumAge: 30000,
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      removeUserLocationMarker(map);
    };
  }, [map, onLocationUpdate]);

  /** Location button: enable → fly-to on first click, fly-to on subsequent clicks. */
  const handleLocationClick = useCallback(() => {
    if (!map) return;

    // GPS and data layers are mutually exclusive — clear any active layers
    onClearDataLayers?.();

    // If location is already enabled and we have coords, just fly to them
    if (locationEnabled && hasLocation && userCoordsRef.current) {
      map.flyTo({
        center: userCoordsRef.current,
        zoom: 16,
        pitch: 50,
        duration: 1800,
      });
      return;
    }

    // If not enabled, enable it
    if (!locationEnabled) {
      setLocationEnabled(true);
      onLocationChange?.(true);

      if (userCoordsRef.current) {
        updateUserLocationMarker(map, userCoordsRef.current);
        map.flyTo({
          center: userCoordsRef.current,
          zoom: 16,
          pitch: 50,
          duration: 1800,
        });
        return;
      }
    }

    // Request geolocation if we don't have it yet
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        userCoordsRef.current = coords;
        setHasLocation(true);
        setLocationEnabled(true);
        onLocationChange?.(true);
        updateUserLocationMarker(map, coords);
        map.flyTo({ center: coords, zoom: 16, pitch: 50, duration: 1800 });
        setLocating(false);
      },
      () => { setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [map, locationEnabled, hasLocation, onLocationChange, onClearDataLayers]);

  // ── Auto-rotate animation ──
  useEffect(() => {
    if (!map || !autoRotating) {
      cancelAnimationFrame(autoRotateRef.current);
      return;
    }

    let lastTime = performance.now();
    const SPEED = 1.5;

    const animate = (now: number) => {
      if (!autoRotating) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const bearing = map.getBearing() + SPEED * dt;
      map.easeTo({ bearing, duration: 0, animate: false });
      autoRotateRef.current = requestAnimationFrame(animate);
    };

    autoRotateRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(autoRotateRef.current);
  }, [map, autoRotating]);

  // Stop auto-rotate when directions or flyover are active
  useEffect(() => {
    if (disableAutoRotate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAutoRotating(false);
    }
  }, [disableAutoRotate]);

  // GPS marker and data layers are mutually exclusive
  useEffect(() => {
    if (!map) return;
    const hasActiveLayer = (activeDataLayers?.size ?? 0) > 0;
    if (hasActiveLayer) {
      removeUserLocationMarker(map);
    } else if (locationEnabled && userCoordsRef.current) {
      updateUserLocationMarker(map, userCoordsRef.current);
    }
  }, [map, activeDataLayers, locationEnabled]);

  const toggleAutoRotate = useCallback(() => setAutoRotating((prev) => !prev), []);

  const zoomIn = useCallback(() => { map?.zoomIn({ duration: 300 }); }, [map]);
  const zoomOut = useCallback(() => { map?.zoomOut({ duration: 300 }); }, [map]);

  /** Toggle ambient background music. */
  const toggleAudio = useCallback(() => {
    if (audioPlaying) {
      void stopBackgroundMusic();
      setAudioPlaying(false);
    } else {
      startBackgroundMusic("showcase", audioVolume);
      setAudioPlaying(true);
    }
  }, [audioPlaying, audioVolume]);

  /** Change ambient music volume. */
  const handleVolumeChange = useCallback((value: number) => {
    setAudioVolume(value);
    setBackgroundMusicVolume(value);
  }, []);

  /** Toggle a tab open/closed — closes layers and events panel for mutual exclusivity. */
  const handleTabClick = useCallback((tab: ToolbarTab) => {
    const opening = activeTab !== tab;
    setActiveTab((prev) => (prev === tab ? null : tab));
    setLayersVisible(false);
    if (eventsPanelOpen) onToggleEventsPanel?.();
    if (opening) onToolbarTabOpen?.();
  }, [activeTab, eventsPanelOpen, onToggleEventsPanel, onToolbarTabOpen]);

  // ── Active indicators ──
  const filterActive = (activePreset !== undefined && activePreset !== "all");
  const distanceActive = distanceFilter !== null;
  const searchActive = false;
  const settingsActive = mode3D;
  const layersActive = (activeDataLayers?.size ?? 0) > 0;
  const locationActive = hasLocation && locationEnabled;

  /** Toggle layers panel — closes other dropdowns and events panel for mutual exclusivity. */
  const toggleLayers = useCallback(() => {
    const opening = !layersVisible;
    setLayersVisible((prev) => !prev);
    setActiveTab(null);
    if (eventsPanelOpen) onToggleEventsPanel?.();
    if (opening) onToolbarTabOpen?.();
  }, [layersVisible, eventsPanelOpen, onToggleEventsPanel, onToolbarTabOpen]);

  const presets: DatePreset[] = ["all", "today", "weekend", "week", "month"];

  return (
    <div ref={toolbarRef} className="absolute left-1/2 top-6 z-20 -translate-x-1/2" style={{ fontFamily: "var(--font-rajdhani)" }}>
      {/* AI Results chip overrides the icon bar */}
      {aiResultsActive ? (
        <div className="flex items-center rounded-full px-1.5 py-1" style={glassPill}>
          <button
            onClick={onClearAiResults}
            className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:opacity-80"
            style={{ background: "#3560FF", color: "#ffffff" }}
          >
            AI Results
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        /* Icon bar — [List] [Calendar] [Compass] [Search] [Layers] [Chat] [Location] [Settings] | [Play] */
        <div className="flex items-center gap-0.5 rounded-full px-1.5 py-1" style={glassPill}>
          {/* List — standalone: toggle events panel (closes other dropdowns) */}
          {onToggleEventsPanel && (
            <StandaloneIcon
              icon={List}
              active={!!eventsPanelOpen}
              onClick={() => {
                setActiveTab(null);
                setLayersVisible(false);
                onToggleEventsPanel();
              }}
              label="Events list"
            />
          )}

          {/* Calendar — tab: date presets */}
          <TabIcon icon={CalendarDays} tab="filter" activeTab={activeTab} hasIndicator={filterActive} onClick={handleTabClick} label="Date filter" />

          {/* Compass — tab: distance presets */}
          {onDistanceFilterChange && (
            <TabIcon icon={Compass} tab="distance" activeTab={activeTab} hasIndicator={distanceActive} onClick={handleTabClick} label="Distance filter" indicatorColor="#00D4AA" />
          )}

          {/* Search — tab */}
          <TabIcon icon={Search} tab="search" activeTab={activeTab} hasIndicator={searchActive} onClick={handleTabClick} label="Search places" />

          {/* Layers — standalone */}
          {onToggleDataLayer && (
            <StandaloneIcon
              icon={Layers}
              active={layersVisible}
              onClick={toggleLayers}
              label="Data layers"
              indicatorActive={layersActive}
            />
          )}

          {/* Location — standalone */}
          <button
            onClick={handleLocationClick}
            className="relative flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-white/10"
            style={{ color: locating ? "#ffffff" : locationActive ? USER_LOC_COLOR : "rgba(255, 255, 255, 0.5)" }}
            aria-label="My location"
            title="My location"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {locationActive && (
              <span
                className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                style={{ background: USER_LOC_COLOR, boxShadow: `0 0 4px ${USER_LOC_COLOR}` }}
              />
            )}
          </button>

          {/* Settings — tab */}
          <TabIcon icon={Settings} tab="settings" activeTab={activeTab} hasIndicator={settingsActive} onClick={handleTabClick} label="Settings" />

          {/* Separator + Play */}
          {onDemo && (
            <>
              <div className="mx-0.5 h-4 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              <TabIcon icon={Play} tab="demos" activeTab={activeTab} hasIndicator={false} onClick={handleTabClick} label="Demos" />
            </>
          )}
        </div>
      )}

      {/* ── Filter Dropdown (date presets only) ── */}
      {activeTab === "filter" && onPresetChange && (
        <div
          className="absolute left-1/2 top-full mt-2 flex -translate-x-1/2 items-center gap-1 rounded-xl px-2 py-1.5 shadow-xl"
          style={{
            ...glassPill,
          }}
        >
          {presets.map((preset, i) => {
            const isActive = activePreset === preset;
            return (
              <Fragment key={preset}>
                {i > 0 && (
                  <div className="h-4 w-px shrink-0" style={{ background: "rgba(255,255,255,0.12)" }} />
                )}
                <button
                  onClick={() => onPresetChange(preset)}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    background: isActive ? "#3560FF" : "transparent",
                    color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
                  }}
                >
                  {DATE_PRESET_LABELS[preset]}
                </button>
              </Fragment>
            );
          })}
        </div>
      )}

      {/* ── Distance Dropdown (1/3/5/10 mi) ── */}
      {activeTab === "distance" && onDistanceFilterChange && (
        <div
          className="absolute left-1/2 top-full mt-2 flex -translate-x-1/2 items-center gap-1 rounded-xl px-2 py-1.5 shadow-xl"
          style={{
            ...glassPill,
          }}
        >
          {([1, 3, 5, 10] as const).map((miles) => {
            const isDistActive = distanceFilter === miles;
            return (
              <button
                key={miles}
                onClick={() => onDistanceFilterChange(isDistActive ? null : miles)}
                disabled={!hasUserLocation}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all hover:opacity-80 disabled:opacity-30"
                style={{
                  background: isDistActive ? "#00D4AA" : "transparent",
                  color: isDistActive ? "#000000" : "rgba(255, 255, 255, 0.55)",
                }}
                title={hasUserLocation ? `Within ${miles} miles of you` : "Enable location first"}
              >
                {DISTANCE_PRESET_LABELS[miles]}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Search Dropdown (below icon bar) ── */}
      {activeTab === "search" && (
        <div
          className="absolute left-1/2 top-full mt-2 flex -translate-x-1/2 items-center gap-2 rounded-xl px-2 py-1 shadow-xl"
          style={{ ...glassPill, width: "min(380px, calc(100vw - 2rem))" }}
        >
          <div className="flex-1">
            <MapSearchBar onGetDirections={onGetDirectionsToCoord} fullWidth localVenues={localVenues} onDirectionsRequested={() => setActiveTab(null)} />
          </div>
        </div>
      )}

      {/* ── Data Layer Toggle Grid (below icon bar, toggled by Layers icon) ── */}
      {layersVisible && onToggleDataLayer && activeDataLayers && loadingDataLayers && (
        <div
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-xl p-3 shadow-xl"
          style={{ ...glassPill, width: "min(360px, calc(100vw - 2rem))" }}
        >
          {CATEGORY_ORDER.map(({ key: cat, label: catLabel }) => {
            const layersInCat = DATA_LAYER_KEYS.filter(
              (k) => DATA_LAYER_CONFIGS[k].category === cat,
            );
            if (layersInCat.length === 0) return null;
            return (
              <div key={cat} className="mb-2 last:mb-0">
                <p
                  className="mb-1.5 px-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "rgba(255, 255, 255, 0.35)" }}
                >
                  {catLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {layersInCat.map((layerKey) => {
                    const cfg = DATA_LAYER_CONFIGS[layerKey];
                    const IconComp = LAYER_ICONS[cfg.icon];
                    return (
                      <LayerToggleBox
                        key={layerKey}
                        icon={IconComp ? <IconComp className="h-3.5 w-3.5" /> : null}
                        label={cfg.label}
                        active={activeDataLayers.has(layerKey)}
                        loading={loadingDataLayers.has(layerKey)}
                        onClick={() => { onToggleDataLayer(layerKey); setLayersVisible(false); }}
                        title={cfg.description}
                        needsKey={!!cfg.requiresKey}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Weather sub-type selector (visible when weather layer is active) */}
          {activeDataLayers.has("weather") && onWeatherSubTypeChange && (
            <>
              <div className="mx-0 my-2 h-px" style={{ background: "rgba(255, 255, 255, 0.08)" }} />
              <div className="flex items-center gap-1">
                {WEATHER_SUB_TYPES.map((st) => (
                  <button
                    key={st.value}
                    onClick={() => onWeatherSubTypeChange(st.value)}
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-all"
                    style={{
                      background: weatherSubType === st.value ? "#3560FF" : "transparent",
                      color: weatherSubType === st.value ? "#fff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Demos Dropdown (absolute) ── */}
      {activeTab === "demos" && onDemo && (
        <div
          className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 overflow-y-auto rounded-xl p-2 shadow-xl"
          style={{
            ...glassPill,
            maxHeight: "min(70vh, 520px)",
          }}
        >
          <p
            className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "rgba(255, 255, 255, 0.4)" }}
          >
            Presentations
          </p>

          <DemoRow
            icon={<Map className="h-4 w-4" />}
            label="Home Screen"
            description="Reset to default view"
            onClick={() => { onDemo("home"); setActiveTab(null); }}
          />
          <DemoRow
            icon={<Compass className="h-4 w-4" />}
            label="Story of Orlando"
            description="Cinematic history tour"
            onClick={() => { onDemo("story"); setActiveTab(null); }}
          />
          <DemoRow
            icon={<Film className="h-4 w-4" />}
            label="Flyover Tour"
            description="AI-narrated event tour"
            onClick={() => { onDemo("flyover"); setActiveTab(null); }}
          />
          <DemoRow
            icon={<Sparkles className="h-4 w-4" />}
            label="Features Showcase"
            description="Digital twin capabilities"
            onClick={() => { onDemo("showcase"); setActiveTab(null); }}
            highlight
          />
          <DemoRow
            icon={<User className="h-4 w-4" />}
            label="Personalization"
            description="Set your preferences"
            onClick={() => { onDemo("personalize"); setActiveTab(null); }}
          />
        </div>
      )}

      {/* ── Settings Dropdown (absolute) ── */}
      {activeTab === "settings" && (
        <div
          className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-xl p-2 shadow-xl"
          style={{
            ...glassPill,
          }}
        >
          {/* 3D View */}
          {onToggle3D && (
            <SettingsRow label="3D View" icon={<Box className="h-4 w-4" />}>
              <ToggleSwitch active={mode3D} onClick={onToggle3D} />
            </SettingsRow>
          )}

          <Divider />

          {/* Auto-Rotate */}
          <SettingsRow
            label="Auto-Rotate"
            icon={<RotateCw className={`h-4 w-4 ${autoRotating ? "animate-spin" : ""}`} style={autoRotating ? { animationDuration: "3s" } : undefined} />}
            highlight={autoRotating}
          >
            <ToggleSwitch active={autoRotating} onClick={toggleAutoRotate} />
          </SettingsRow>

          <Divider />

          {/* Ambient Audio */}
          <SettingsRow
            label="Ambient Audio"
            icon={audioPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            highlight={audioPlaying}
          >
            <ToggleSwitch active={audioPlaying} onClick={toggleAudio} />
          </SettingsRow>

          {/* Volume slider (only when audio is playing) */}
          {audioPlaying && (
            <div className="mb-1 flex items-center gap-2 px-2 py-1">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(audioVolume * 100)}
                onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full accent-[#3560FF]"
                style={{
                  background: `linear-gradient(to right, #3560FF ${audioVolume * 100}%, rgba(255,255,255,0.2) ${audioVolume * 100}%)`,
                }}
                aria-label="Volume"
              />
              <span className="w-7 text-right text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {Math.round(audioVolume * 100)}%
              </span>
            </div>
          )}

          <Divider />

          {/* Zoom */}
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-medium" style={{ color: "rgba(255, 255, 255, 0.65)" }}>Zoom</span>
            <div className="flex items-center gap-1">
              <button
                onClick={zoomOut}
                className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
                aria-label="Zoom out"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={zoomIn}
                className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
                aria-label="Zoom in"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <Divider />

          {/* Coordinates */}
          {onToggleCoordinates && (
            <SettingsRow label="Coordinates" icon={<Crosshair className="h-4 w-4" />}>
              <ToggleSwitch active={!!showCoordinates} onClick={onToggleCoordinates} />
            </SettingsRow>
          )}

          {/* Chat Position */}
          {onChatPositionChange && (
            <>
              <Divider />
              <SettingsRow label="Chat: Right Side" icon={<MessageSquare className="h-4 w-4" />}>
                <ToggleSwitch active={chatPosition === "right"} onClick={() => onChatPositionChange(chatPosition === "right" ? "center" : "right")} />
              </SettingsRow>
            </>
          )}

          <Divider />

          {/* Personalize */}
          {onStartPersonalization && (
            <button
              onClick={onStartPersonalization}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-xs font-medium transition-colors hover:bg-white/5"
              style={{ color: "rgba(255, 255, 255, 0.65)" }}
            >
              <User className="h-4 w-4" />
              Personalize
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────

/** A single icon tab in the toolbar with an optional active indicator dot. */
function TabIcon({
  icon: Icon,
  tab,
  activeTab,
  hasIndicator,
  onClick,
  label,
  indicatorColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tab: ToolbarTab;
  activeTab: ToolbarTab | null;
  hasIndicator: boolean;
  onClick: (tab: ToolbarTab) => void;
  label: string;
  indicatorColor?: string;
}) {
  const isSelected = activeTab === tab;

  return (
    <button
      onClick={() => onClick(tab)}
      className="relative flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-white/10"
      style={{ color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.5)" }}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
      {hasIndicator && (
        <span
          className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
          style={{ background: indicatorColor ?? "#3560FF" }}
        />
      )}
    </button>
  );
}

/** A standalone icon button (not a tab — toggles external state). */
function StandaloneIcon({
  icon: Icon,
  active,
  onClick,
  label,
  indicatorActive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  label: string;
  indicatorActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-white/10"
      style={{ color: active ? "#3560FF" : "rgba(255, 255, 255, 0.55)" }}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
      {indicatorActive && (
        <span
          className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full"
          style={{ background: "#3560FF", boxShadow: "0 0 4px #3560FF" }}
        />
      )}
    </button>
  );
}

/** Small toggle switch used in layers and settings dropdowns. */
function ToggleSwitch({ active, onClick }: { active: boolean; onClick?: () => void }) {
  return (
    <div
      className="h-4 w-7 cursor-pointer rounded-full p-0.5 transition-colors"
      style={{ background: active ? "#3560FF" : "rgba(255, 255, 255, 0.15)" }}
      onClick={onClick}
      role="switch"
      aria-checked={active}
    >
      <div
        className="h-3 w-3 rounded-full transition-transform"
        style={{
          background: "#fff",
          transform: active ? "translateX(12px)" : "translateX(0)",
        }}
      />
    </div>
  );
}

/** A labeled row in the settings dropdown. */
function SettingsRow({
  label,
  icon,
  highlight,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/5">
      <span style={{ color: highlight ? "#3560FF" : "rgba(255, 255, 255, 0.5)" }}>{icon}</span>
      <span
        className="flex-1 text-xs font-medium"
        style={{ color: "rgba(255, 255, 255, 0.65)" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

/** Horizontal divider for the settings dropdown. */
function Divider() {
  return <div className="mx-2 my-1 h-px" style={{ background: "rgba(255, 255, 255, 0.08)" }} />;
}

/** A row in the demos dropdown with icon, label, and description. */
function DemoRow({
  icon,
  label,
  description,
  onClick,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5"
    >
      <span style={{ color: highlight ? "#3560FF" : "rgba(255, 255, 255, 0.5)" }}>{icon}</span>
      <div className="flex-1">
        <span
          className="block text-xs font-medium"
          style={{ color: highlight ? "#3560FF" : "rgba(255, 255, 255, 0.65)" }}
        >
          {label}
        </span>
        <span className="block text-[10px]" style={{ color: "rgba(255, 255, 255, 0.35)" }}>
          {description}
        </span>
      </div>
    </button>
  );
}

/** Inline data layer toggle box — outlined by default, blue fill + glow when active. */
function LayerToggleBox({
  icon,
  label,
  active,
  loading,
  onClick,
  title,
  needsKey,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  loading: boolean;
  onClick: () => void;
  title?: string;
  needsKey?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all"
      style={{
        borderColor: active ? "#3560FF" : "rgba(255, 255, 255, 0.15)",
        background: active ? "rgba(53, 96, 255, 0.15)" : "rgba(10, 10, 15, 0.6)",
        color: active ? "#ffffff" : needsKey ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(12px)",
        boxShadow: active ? "0 0 12px rgba(53, 96, 255, 0.4), inset 0 0 8px rgba(53, 96, 255, 0.1)" : "none",
      }}
      title={title}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "#3560FF" }} />
      ) : (
        <span style={{ color: active ? "#3560FF" : "rgba(255, 255, 255, 0.45)" }}>{icon}</span>
      )}
      {label}
    </button>
  );
}
