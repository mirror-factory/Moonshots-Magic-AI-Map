/**
 * @module components/map/map-status-bar
 * Map overlay controls split across 3 positions:
 * - Top center: Date filter chips
 * - Bottom left: Vertical toolbar (zoom, location, rotate, 3D, isochrone, settings)
 * - Bottom center: Minimal coordinate readout
 */

"use client";

import { useEffect, useState, useRef, useCallback, Fragment } from "react";
import maplibregl from "maplibre-gl";
import { Settings, Box, Clock, Loader2, X, LocateFixed, Plus, Minus, RotateCw } from "lucide-react";
import { useMap } from "./use-map";
import { SettingsModal } from "@/components/settings/settings-modal";
import { type DatePreset, DATE_PRESET_LABELS } from "@/lib/map/event-filters";

interface MapStatus {
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
}


// ── User Location Marker ──────────────────────────────────────────────
const USER_LOC_SOURCE = "user-location-source";
const USER_LOC_GLOW = "user-location-glow";
const USER_LOC_DOT = "user-location-dot";
const USER_LOC_LABEL = "user-location-label";

/** Color for the user location marker — teal to distinguish from event markers. */
const USER_LOC_COLOR = "#00D4AA";

/** Module-level animation frame ID for the user location pulse. */
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

/**
 * Creates or updates the user location marker on the map.
 * @param map - MapLibre map instance.
 * @param coords - [lng, lat] coordinates.
 */
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

/** Props for {@link MapStatusBar}. */
interface MapStatusBarProps {
  mode3D?: boolean;
  onToggle3D?: () => void;
  onStartPersonalization?: () => void;
  isochroneActive?: boolean;
  isochroneLoading?: boolean;
  onToggleIsochrone?: () => void;
  /** Currently active date filter preset. */
  activePreset?: DatePreset;
  /** Callback when user changes the date filter preset. */
  onPresetChange?: (preset: DatePreset) => void;
  /** Whether AI search results are currently overriding the date filter. */
  aiResultsActive?: boolean;
  /** Callback to clear AI search results and restore the date filter. */
  onClearAiResults?: () => void;
  /** Callback when location is enabled/disabled. True = location available. */
  onLocationChange?: (enabled: boolean) => void;
}

/** Map overlay controls — filter chips, toolbar, location button, and coordinate readout. */
export function MapStatusBar({ mode3D = false, onToggle3D, onStartPersonalization, isochroneActive, isochroneLoading, onToggleIsochrone, activePreset, onPresetChange, aiResultsActive, onClearAiResults, onLocationChange }: MapStatusBarProps) {
  const map = useMap();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoRotating, setAutoRotating] = useState(false);
  const autoRotateRef = useRef<number>(0);
  const userCoordsRef = useRef<[number, number] | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [status, setStatus] = useState<MapStatus>({
    lat: 28.5383,
    lng: -81.3792,
    zoom: 10,
    pitch: 0,
  });

  useEffect(() => {
    if (!map) return;

    const update = () => {
      const center = map.getCenter();
      setStatus({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
        pitch: map.getPitch(),
      });
    };

    update();
    map.on("move", update);
    return () => {
      map.off("move", update);
    };
  }, [map]);

  // Persistent geolocation tracking — always show "You are here" marker
  useEffect(() => {
    if (!map || !navigator.geolocation) return;

    const onPosition = (pos: GeolocationPosition) => {
      const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
      userCoordsRef.current = coords;
      setHasLocation(true);

      // Wait for style to load before adding marker
      if (map.isStyleLoaded()) {
        updateUserLocationMarker(map, coords);
      } else {
        map.once("load", () => updateUserLocationMarker(map, coords));
      }
    };

    const onError = () => {
      // Geolocation unavailable — no marker
    };

    // Get initial position, then watch for updates
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
  }, [map]);

  /** Toggle location on/off. When on: show marker + fly there. When off: hide marker + notify parent. */
  const toggleLocation = useCallback(() => {
    if (!map) return;

    // If location is currently enabled, turn it off
    if (locationEnabled && hasLocation) {
      setLocationEnabled(false);
      removeUserLocationMarker(map);
      onLocationChange?.(false);
      return;
    }

    // Enable location
    setLocationEnabled(true);
    onLocationChange?.(true);

    // If we already have coordinates, show marker and fly there
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

    // Otherwise request fresh position
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        userCoordsRef.current = coords;
        setHasLocation(true);
        updateUserLocationMarker(map, coords);
        map.flyTo({
          center: coords,
          zoom: 16,
          pitch: 50,
          duration: 1800,
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [map, locationEnabled, hasLocation, onLocationChange]);

  // Auto-rotate animation
  useEffect(() => {
    if (!map || !autoRotating) {
      cancelAnimationFrame(autoRotateRef.current);
      return;
    }

    let lastTime = performance.now();
    const SPEED = 1.5; // degrees per second

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

  /** Toggle auto-rotation on/off. */
  const toggleAutoRotate = useCallback(() => {
    setAutoRotating((prev) => !prev);
  }, []);

  /** Zoom in one level. */
  const zoomIn = useCallback(() => {
    map?.zoomIn({ duration: 300 });
  }, [map]);

  /** Zoom out one level. */
  const zoomOut = useCallback(() => {
    map?.zoomOut({ duration: 300 });
  }, [map]);

  const isDark = true; // Dark mode is forced globally

  const presets: DatePreset[] = ["all", "today", "weekend", "week", "month"];

  // Shared glass pill styles for top overlays
  const glassPill = {
    background: isDark ? "rgba(10, 10, 15, 0.7)" : "rgba(255, 255, 255, 0.8)",
    border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.12)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  // Icon colors adapt to theme
  const iconActive = isDark ? "#ffffff" : "#0a0a0f";
  const iconMuted = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.45)";

  return (
    <>
      {/* ─── TOP CENTER: Date filter chips ─── */}
      {onPresetChange && (
        <div
          className="absolute left-1/2 top-6 z-20 -translate-x-1/2"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          <div
            className="flex items-center gap-1 rounded-full px-1.5 py-1"
            style={glassPill}
          >
            {aiResultsActive ? (
              <button
                onClick={onClearAiResults}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: "#3560FF",
                  color: "#ffffff",
                }}
              >
                AI Results
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              presets.map((preset, i) => {
                const isActive = activePreset === preset;
                return (
                  <Fragment key={preset}>
                    {i > 0 && (
                      <div
                        className="h-4 w-px shrink-0"
                        style={{ background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }}
                      />
                    )}
                    <button
                      onClick={() => onPresetChange(preset)}
                      className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-all hover:opacity-80"
                      style={{
                        background: isActive ? "#3560FF" : "transparent",
                        color: isActive
                          ? "#ffffff"
                          : isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {DATE_PRESET_LABELS[preset]}
                    </button>
                  </Fragment>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── BOTTOM LEFT: Vertical Toolbar ─── */}
      <div
        className="absolute bottom-4 left-4 z-20 flex flex-col gap-1 rounded-full px-1 py-1.5"
        style={glassPill}
      >
        {/* Zoom In */}
        <ToolbarButton
          onClick={zoomIn}
          active
          activeColor={iconActive}
          mutedColor={iconMuted}
          label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </ToolbarButton>
        {/* Zoom Out */}
        <ToolbarButton
          onClick={zoomOut}
          active
          activeColor={iconActive}
          mutedColor={iconMuted}
          label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        {/* Divider */}
        <div className="mx-auto h-px w-5" style={{ background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }} />

        {/* My Location (toggle) */}
        <ToolbarButton
          onClick={toggleLocation}
          active={hasLocation && locationEnabled}
          activeColor="#3560FF"
          mutedColor={iconMuted}
          label={locationEnabled ? "Hide my location" : "Show my location"}
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
        </ToolbarButton>
        {/* Auto-Rotate */}
        <ToolbarButton
          onClick={toggleAutoRotate}
          active={autoRotating}
          activeColor="#3560FF"
          mutedColor={iconMuted}
          label={autoRotating ? "Stop rotation" : "Auto-rotate"}
        >
          <RotateCw className={`h-4 w-4 ${autoRotating ? "animate-spin" : ""}`} style={autoRotating ? { animationDuration: "3s" } : undefined} />
        </ToolbarButton>
        {/* 3D Toggle */}
        {onToggle3D && (
          <ToolbarButton
            onClick={onToggle3D}
            active={mode3D}
            activeColor={iconActive}
            mutedColor={iconMuted}
            label={mode3D ? "Disable 3D" : "Enable 3D"}
          >
            <Box className="h-4 w-4" />
          </ToolbarButton>
        )}

        {/* Divider */}
        <div className="mx-auto h-px w-5" style={{ background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }} />

        {/* Travel Zones (Isochrone) */}
        {onToggleIsochrone && (
          <ToolbarButton
            onClick={onToggleIsochrone}
            active={isochroneActive ?? false}
            activeColor={iconActive}
            mutedColor={iconMuted}
            label={isochroneActive ? "Hide travel zones" : "Show travel zones"}
          >
            {isochroneLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </ToolbarButton>
        )}
        {/* Settings */}
        <ToolbarButton
          onClick={() => setSettingsOpen(true)}
          active={false}
          activeColor={iconActive}
          mutedColor={iconMuted}
          label="Settings"
        >
          <Settings className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* ─── BOTTOM CENTER: Coordinate readout ─── */}
      <div
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 rounded-t-lg px-4 py-1 text-[10px] backdrop-blur-md"
        style={{
          background: isDark ? "rgba(10, 10, 15, 0.6)" : "rgba(0, 0, 0, 0.35)",
          color: "rgba(255, 255, 255, 0.5)",
          fontFamily: "var(--font-rajdhani)",
        }}
      >
        {status.lat.toFixed(4)}, {status.lng.toFixed(4)} · z{status.zoom.toFixed(1)} · {status.pitch.toFixed(0)}°
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onStartPersonalization={onStartPersonalization}
      />
    </>
  );
}

/** A single icon button in the top-right toolbar. */
function ToolbarButton({
  onClick,
  active,
  activeColor,
  mutedColor,
  label,
  children,
}: {
  onClick: () => void;
  active: boolean;
  activeColor: string;
  mutedColor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10"
      style={{ color: active ? activeColor : mutedColor }}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
