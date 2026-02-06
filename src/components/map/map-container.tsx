/**
 * @module components/map/map-container
 * Root map component. Initializes a MapLibre GL instance, provides it via
 * {@link MapContext}, and composes child map layers (markers, popups, controls).
 * Uses OpenFreeMap for free map tiles (no API key required).
 * Supports 3D mode with terrain and building extrusion.
 */

"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { useTheme } from "next-themes";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapContext } from "./use-map";
import {
  MAP_STYLES_BY_THEME,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_PITCH,
  DEFAULT_BEARING,
} from "@/lib/map/config";
import { MapStatusBar } from "./map-status-bar";
import { MapControls } from "./map-controls";
import { MapMarkers } from "./map-markers";
import { MapPopups } from "./map-popups";
import { EVENT_CATEGORIES, type EventCategory, type EventEntry } from "@/lib/registries/types";
import { FlyoverOverlay } from "./flyover-overlay";
import {
  type FlyoverProgress,
  createFlyoverProgress,
  startFlyover as startFlyoverState,
  nextWaypoint,
  togglePause,
  stopFlyover as stopFlyoverState,
  updateWaypointAudio,
} from "@/lib/flyover/flyover-engine";
import { animateToWaypoint, introAnimation, outroAnimation, calculateCenter } from "@/lib/flyover/camera-animator";
import { speak, stopSpeaking, playAudioBuffer, generateAudioBuffer } from "@/lib/voice/cartesia-tts";
import { playFlyoverIntro, stopFlyoverAudio } from "@/lib/flyover/flyover-audio";

interface MapContainerProps {
  events: EventEntry[];
  onAskAbout?: (eventTitle: string) => void;
  onFlyoverRequest?: (handler: (eventIds: string[], theme?: string) => void) => void;
  onStartPersonalization?: () => void;
  children?: ReactNode;
}

/** Renders the root map with MapLibre GL and composes child layers. */
export function MapContainer({ events, onAskAbout, onFlyoverRequest, onStartPersonalization, children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [mode3D, setMode3D] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Set<EventCategory>>(
    () => new Set(EVENT_CATEGORIES),
  );
  const [flyoverProgress, setFlyoverProgress] = useState<FlyoverProgress | null>(null);
  const flyoverAbortRef = useRef<boolean>(false);
  const introPlayingRef = useRef<boolean>(false);
  const introPromiseRef = useRef<Promise<void> | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: isDark ? MAP_STYLES_BY_THEME.dark : MAP_STYLES_BY_THEME.light,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      attributionControl: {},
    });

    instance.addControl(new maplibregl.NavigationControl(), "top-right");
    instance.addControl(
      new maplibregl.ScaleControl({ maxWidth: 150 }),
      "bottom-right",
    );

    // Track when style is loaded
    instance.on("style.load", () => {
      setStyleLoaded(true);
    });

    setMap(instance);

    return () => {
      instance.remove();
    };
    // Only run on mount - theme changes handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to theme changes
  useEffect(() => {
    if (!map) return;

    const newStyle = isDark ? MAP_STYLES_BY_THEME.dark : MAP_STYLES_BY_THEME.light;

    // Store current view state
    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();

    // Mark style as not loaded during transition
    setStyleLoaded(false);

    // Change style and restore view
    map.setStyle(newStyle);

    map.once("style.load", () => {
      // Restore view
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);

      // Mark style as loaded
      setStyleLoaded(true);

      // Re-apply 3D mode if it was enabled
      if (mode3D) {
        add3DLayers(map, isDark);
      }
    });
  }, [map, isDark, mode3D]);

  // Handle 3D mode toggle
  useEffect(() => {
    if (!map || !styleLoaded) return;

    if (mode3D) {
      // Enable 3D mode
      add3DLayers(map, isDark);
      map.easeTo({ pitch: 50, duration: 1000 });
    } else {
      // Disable 3D mode
      remove3DLayers(map);
      map.easeTo({ pitch: 0, duration: 1000 });
    }
  }, [map, mode3D, isDark, styleLoaded]);

  const handleToggleCategory = useCallback((category: EventCategory) => {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const handleToggle3D = useCallback(() => {
    setMode3D((prev) => !prev);
  }, []);

  // Start a flyover tour with given event IDs
  const handleStartFlyover = useCallback(
    async (eventIds: string[], theme?: string) => {
      console.log("[Flyover] Starting tour with IDs:", eventIds, "theme:", theme);
      console.log("[Flyover] Map ready:", !!map, "Style loaded:", styleLoaded);

      if (!map || !styleLoaded) {
        console.warn("[Flyover] Map not ready, cannot start tour");
        return;
      }

      // Find events by ID
      const tourEvents = eventIds
        .map((id) => events.find((e) => e.id === id))
        .filter((e): e is EventEntry => e !== undefined);

      console.log("[Flyover] Found events:", tourEvents.length, "of", eventIds.length);

      if (tourEvents.length < 2) {
        console.warn("[Flyover] Need at least 2 events for a tour, found:", tourEvents.length);
        return;
      }

      // Enable 3D mode for cinematic effect
      if (!mode3D) {
        setMode3D(true);
      }

      // Create initial flyover progress (with basic narratives)
      const progress = createFlyoverProgress({ events: tourEvents, theme, enableVoice: true });
      const started = startFlyoverState(progress);
      console.log("[Flyover] Tour started, state:", started.state);
      setFlyoverProgress(started);
      flyoverAbortRef.current = false;

      // Start intro audio immediately and track when it finishes
      // Waypoint audio will wait for this to complete
      introPlayingRef.current = true;
      introPromiseRef.current = playFlyoverIntro()
        .catch(console.error)
        .finally(() => {
          introPlayingRef.current = false;
          console.log("[Flyover] Intro audio finished");
        });

      // Prepare AI-generated narratives and audio in parallel
      try {
        // Call narration API for AI-generated narratives
        const narrateResponse = await fetch("/api/flyover/narrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            events: tourEvents.map((e) => ({
              id: e.id,
              title: e.title,
              venue: e.venue,
              description: e.description,
              category: e.category,
              startDate: e.startDate,
              price: e.price,
            })),
            theme,
          }),
        });

        if (narrateResponse.ok) {
          const { narratives } = await narrateResponse.json() as {
            narratives: Array<{ eventId: string; narrative: string }>;
          };

          console.log("[Flyover] Received", narratives.length, "AI narratives");

          // Generate audio for all narratives in parallel
          const audioPromises = narratives.map(async ({ eventId, narrative }) => {
            const audioBuffer = await generateAudioBuffer(narrative);
            return { eventId, narrative, audioBuffer };
          });

          const audioResults = await Promise.all(audioPromises);

          // Update waypoints with new narratives and audio
          if (!flyoverAbortRef.current) {
            setFlyoverProgress((prev) => {
              if (!prev) return null;

              const updates = audioResults.map((result) => {
                const waypointIndex = prev.waypoints.findIndex(
                  (w) => w.eventId === result.eventId
                );
                return {
                  index: waypointIndex,
                  narrative: result.narrative,
                  audioBuffer: result.audioBuffer ?? undefined,
                };
              });

              return updateWaypointAudio(prev, updates);
            });

            console.log("[Flyover] Audio pipeline ready");
          }
        }
      } catch (error) {
        console.error("[Flyover] Failed to prepare audio:", error);
        // Continue with basic narratives - the tour will still work
      }
    },
    [map, styleLoaded, events, mode3D],
  );

  // Register flyover handler with parent - use a stable callback wrapper
  useEffect(() => {
    // Create a stable wrapper that always calls the latest handler
    const wrapper = (eventIds: string[], theme?: string) => {
      handleStartFlyover(eventIds, theme);
    };
    onFlyoverRequest?.(wrapper);
  }, [onFlyoverRequest, handleStartFlyover]);

  // Flyover loop - runs when flyover is active
  useEffect(() => {
    if (!map || !flyoverProgress || flyoverProgress.state === "idle" || flyoverProgress.state === "complete") {
      // Clean up highlight when flyover ends
      if (map && (flyoverProgress?.state === "complete" || flyoverProgress?.state === "idle")) {
        removeVenueHighlight(map);
      }
      return;
    }

    const runFlyover = async () => {
      if (flyoverAbortRef.current) return;

      const { waypoints, currentIndex, state } = flyoverProgress;
      const waypoint = waypoints[currentIndex];

      if (state === "preparing") {
        // Intro animation
        const center = calculateCenter(waypoints.map((w) => w.center));
        await introAnimation(map, center);
        if (flyoverAbortRef.current) return;
        setFlyoverProgress((prev) => prev ? { ...prev, state: "flying" } : null);
        return;
      }

      if (state === "flying" && waypoint) {
        // Update venue highlight to current waypoint
        updateVenueHighlight(map, waypoint.center);

        // Fly to waypoint
        await animateToWaypoint(map, waypoint);
        if (flyoverAbortRef.current) return;

        // Wait for intro audio to finish before playing waypoint audio
        // This prevents cutting off the intro message
        if (introPromiseRef.current) {
          console.log("[Flyover] Waiting for intro audio to finish...");
          await introPromiseRef.current;
          introPromiseRef.current = null; // Clear after first wait
        }

        // Start narration
        setFlyoverProgress((prev) =>
          prev ? { ...prev, state: "narrating", currentNarrative: waypoint.narrative } : null,
        );

        // Play pre-buffered audio if available, otherwise generate on-the-fly
        try {
          if (waypoint.audioBuffer) {
            // Play pre-buffered audio
            await playAudioBuffer(waypoint.audioBuffer);
          } else {
            // Fallback: generate audio on-the-fly
            await speak(waypoint.narrative);
          }
        } catch (error) {
          console.error("[Flyover] TTS error:", error);
          // Continue even if TTS fails - use captions as fallback
        }

        if (flyoverAbortRef.current) return;

        // Brief pause after narration
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (flyoverAbortRef.current) return;

        // Move to next waypoint or complete
        const next = nextWaypoint(flyoverProgress);
        if (next.state === "complete") {
          // Remove highlight before outro
          removeVenueHighlight(map);
          // Outro animation
          const center = calculateCenter(waypoints.map((w) => w.center));
          await outroAnimation(map, center);
          setFlyoverProgress(next);
        } else {
          setFlyoverProgress(next);
        }
      }
    };

    if (!flyoverProgress.isPaused) {
      runFlyover();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally using granular deps to avoid re-running on every progress update
  }, [map, flyoverProgress?.state, flyoverProgress?.currentIndex, flyoverProgress?.isPaused]);

  // Flyover controls
  const handleFlyoverPause = useCallback(() => {
    setFlyoverProgress((prev) => (prev ? togglePause(prev) : null));
  }, []);

  const handleFlyoverStop = useCallback(() => {
    flyoverAbortRef.current = true;
    introPlayingRef.current = false;
    introPromiseRef.current = null;
    stopFlyoverAudio();
    stopSpeaking();
    setFlyoverProgress((prev) => (prev ? stopFlyoverState(prev) : null));
  }, []);

  const handleFlyoverNext = useCallback(() => {
    stopSpeaking();
    setFlyoverProgress((prev) => (prev ? nextWaypoint(prev) : null));
  }, []);

  const handleFlyoverJumpTo = useCallback((index: number) => {
    stopSpeaking();
    setFlyoverProgress((prev) => {
      if (!prev || index < 0 || index >= prev.waypoints.length) return prev;
      return {
        ...prev,
        state: "flying",
        currentIndex: index,
        waypointProgress: 0,
        currentNarrative: prev.waypoints[index].narrative,
        isPaused: false,
      };
    });
  }, []);

  return (
    <MapContext value={map}>
      <div className="relative h-full w-full">
        <div
          ref={containerRef}
          style={{ position: "absolute", inset: 0 }}
        />

        <MapControls
          open={controlsOpen}
          onToggle={() => setControlsOpen((p) => !p)}
          visibleCategories={visibleCategories}
          onToggleCategory={handleToggleCategory}
          events={events}
          eventCount={events.length}
          onAskAbout={onAskAbout}
        />

        <MapMarkers events={events} visibleCategories={visibleCategories} styleLoaded={styleLoaded} isDark={isDark} />
        <MapPopups onAskAbout={onAskAbout} />
        <MapStatusBar mode3D={mode3D} onToggle3D={handleToggle3D} onStartPersonalization={onStartPersonalization} />

        {/* Flyover overlay */}
        {flyoverProgress && (
          <FlyoverOverlay
            progress={flyoverProgress}
            onTogglePause={handleFlyoverPause}
            onStop={handleFlyoverStop}
            onNext={handleFlyoverNext}
            onJumpTo={handleFlyoverJumpTo}
          />
        )}

        {children}
      </div>
    </MapContext>
  );
}

/**
 * Adds 3D terrain and building layers to the map.
 * Uses OpenFreeMap source which has building data with render_height.
 * @param map - The MapLibre GL map instance.
 * @param isDark - Whether dark theme is active.
 * @see https://maplibre.org/maplibre-gl-js/docs/examples/display-buildings-in-3d/
 */
function add3DLayers(map: maplibregl.Map, isDark: boolean) {
  // Safety check - ensure style is loaded
  if (!map.isStyleLoaded()) return;

  // Log available sources for debugging
  const style = map.getStyle();
  const sourceNames = Object.keys(style?.sources || {});
  console.log("[3D] Available sources:", sourceNames);

  // Add 3D buildings layer if not already present
  if (!map.getLayer("3d-buildings")) {
    // Find the vector source - try openfreemap first (official example), then openmaptiles
    const sources = style?.sources || {};
    let buildingSource: string | undefined;

    for (const name of ["openmaptiles", "carto", "composite"]) {
      if (sources[name]) {
        buildingSource = name;
        break;
      }
    }

    // Fallback: use first available vector source
    if (!buildingSource) {
      for (const [name, source] of Object.entries(sources)) {
        if ((source as { type: string }).type === "vector") {
          buildingSource = name;
          break;
        }
      }
    }

    if (!buildingSource) {
      console.warn("[3D] No vector source found for buildings. Sources:", sourceNames);
      return;
    }

    // Find the first symbol layer with text to insert buildings below labels
    const layers = style?.layers || [];
    let labelLayerId: string | undefined;
    for (const layer of layers) {
      if (layer.type === "symbol" && (layer.layout as Record<string, unknown>)?.["text-field"]) {
        labelLayerId = layer.id;
        break;
      }
    }

    console.log("[3D] Adding buildings layer with source:", buildingSource, "below:", labelLayerId);

    // Use exact paint properties from official MapLibre example
    // https://maplibre.org/maplibre-gl-js/docs/examples/display-buildings-in-3d/
    // Note: CARTO/OpenMapTiles uses "render_height" or "height" depending on tile source
    const heightExpr: maplibregl.ExpressionSpecification = [
      "coalesce",
      ["get", "render_height"],
      ["get", "height"],
      10,
    ];

    map.addLayer(
      {
        id: "3d-buildings",
        source: buildingSource,
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 13,
        paint: {
          "fill-extrusion-color": isDark
            ? [
                "interpolate",
                ["linear"],
                heightExpr,
                0, "#1a1a2e",
                50, "#2a2a4e",
                100, "#3a3a6e",
                200, "#4a4a8e",
              ]
            : [
                "interpolate",
                ["linear"],
                heightExpr,
                0, "#9090a0",
                50, "#7070a0",
                100, "#5050a0",
                200, "#3030a0",
              ],
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            13, 0,
            14.5, heightExpr,
          ],
          "fill-extrusion-base": ["get", "render_min_height"],
          "fill-extrusion-opacity": 0.85,
        },
      },
      labelLayerId,
    );

    console.log("[3D] Buildings layer added successfully");
  }
}

/**
 * Removes 3D building layers from the map.
 * @param map - The MapLibre GL map instance.
 */
function remove3DLayers(map: maplibregl.Map) {
  // Safety check - ensure style is loaded
  if (!map.isStyleLoaded()) return;

  // Remove 3D buildings layer
  if (map.getLayer("3d-buildings")) {
    map.removeLayer("3d-buildings");
    console.log("[3D] Buildings layer removed");
  }
}

/** Venue highlight source and layer IDs. */
const HIGHLIGHT_SOURCE = "venue-highlight-source";
const HIGHLIGHT_PULSE_LAYER = "venue-highlight-pulse";
const HIGHLIGHT_GLOW_LAYER = "venue-highlight-glow";

/**
 * Adds or updates a venue highlight on the map.
 * Creates a pulsing glow effect around the venue location.
 * @param map - The MapLibre GL map instance.
 * @param coordinates - The venue coordinates [lng, lat].
 */
function updateVenueHighlight(map: maplibregl.Map, coordinates: [number, number]) {
  if (!map.isStyleLoaded()) return;

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates },
        properties: {},
      },
    ],
  };

  // Add or update source
  const source = map.getSource(HIGHLIGHT_SOURCE) as maplibregl.GeoJSONSource | undefined;
  if (source) {
    source.setData(geojson);
  } else {
    map.addSource(HIGHLIGHT_SOURCE, { type: "geojson", data: geojson });

    // Add outer glow layer
    map.addLayer({
      id: HIGHLIGHT_GLOW_LAYER,
      type: "circle",
      source: HIGHLIGHT_SOURCE,
      paint: {
        "circle-radius": 60,
        "circle-color": "#FFD700",
        "circle-opacity": 0.15,
        "circle-blur": 1,
      },
    });

    // Add pulsing center layer
    map.addLayer({
      id: HIGHLIGHT_PULSE_LAYER,
      type: "circle",
      source: HIGHLIGHT_SOURCE,
      paint: {
        "circle-radius": 25,
        "circle-color": "#FFD700",
        "circle-opacity": 0.4,
        "circle-stroke-width": 3,
        "circle-stroke-color": "#FFD700",
        "circle-stroke-opacity": 0.8,
      },
    });
  }
}

/**
 * Removes the venue highlight from the map.
 * @param map - The MapLibre GL map instance.
 */
function removeVenueHighlight(map: maplibregl.Map) {
  if (!map.isStyleLoaded()) return;

  if (map.getLayer(HIGHLIGHT_PULSE_LAYER)) {
    map.removeLayer(HIGHLIGHT_PULSE_LAYER);
  }
  if (map.getLayer(HIGHLIGHT_GLOW_LAYER)) {
    map.removeLayer(HIGHLIGHT_GLOW_LAYER);
  }
  if (map.getSource(HIGHLIGHT_SOURCE)) {
    map.removeSource(HIGHLIGHT_SOURCE);
  }
}
