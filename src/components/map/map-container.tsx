/**
 * @module components/map/map-container
 * Root map component. Initializes a MapLibre GL instance, provides it via
 * {@link MapContext}, and composes child map layers (markers, popups, controls).
 * Uses OpenFreeMap for free map tiles (no API key required).
 * Supports 3D mode with terrain and building extrusion.
 */

"use client";

import { useEffect, useRef, useState, useCallback, useMemo, useReducer, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapContext } from "./use-map";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_PITCH,
  DEFAULT_BEARING,
  fetchMapStyle,
} from "@/lib/map/config";
import { MapStatusBar } from "./map-status-bar";
import { MapToolbar, type DemoOption } from "./map-toolbar";
import { MapControls } from "./map-controls";
import { EventsPanelContent } from "./events-dropdown";
import { MapMarkers } from "./map-markers";
import { MapHotspots } from "./map-hotspots";
import { MapPopups } from "./map-popups";
import type { EventEntry } from "@/lib/registries/types";
import { MapDirections } from "./map-directions";
import { DirectionsPanel } from "./directions-panel";
import {
  dataLayerReducer,
  initialDataLayerState,
  type DataLayerKey,
} from "@/lib/map/data-layers";
import { MapWeatherLayer } from "./data-layers/map-weather-layer";
import { MapTransitLayer } from "./data-layers/map-transit-layer";
import { MapTransitShapesLayer } from "./data-layers/map-transit-shapes-layer";
import { MapCityDataLayer } from "./data-layers/map-city-data-layer";
import { MapNwsAlertsLayer } from "./data-layers/map-nws-alerts-layer";
import { MapAircraftLayer } from "./data-layers/map-aircraft-layer";
import { MapSunrailLayer } from "./data-layers/map-sunrail-layer";
import { MapCountyDataLayer } from "./data-layers/map-county-data-layer";
import { MapDevelopmentsLayer } from "./data-layers/map-developments-layer";
import { MapEvChargersLayer } from "./data-layers/map-ev-chargers-layer";
import { MapAirQualityLayer } from "./data-layers/map-air-quality-layer";
import { DataLayerInfoPanel } from "./data-layers/data-layer-info-panel";
import { FlyoverOverlay } from "./flyover-overlay";
import { MapGuide } from "./map-guide";
import {
  type FlyoverProgress,
  createFlyoverProgress,
  startFlyover as startFlyoverState,
  nextWaypoint,
  togglePause,
  stopFlyover as stopFlyoverState,
  updateWaypointAudio,
} from "@/lib/flyover/flyover-engine";
import { animateToWaypoint, cinematicIntro, outroAnimation, calculateCenter, orbitWaypoint } from "@/lib/flyover/camera-animator";
import { speak, stopSpeaking, playAudioBuffer, generateAudioBuffer } from "@/lib/voice/cartesia-tts";
import { playFlyoverIntro, stopFlyoverAudio } from "@/lib/flyover/flyover-audio";
import { getDirections, type DirectionsResult, type TravelProfile } from "@/lib/map/routing";
import {
  type DatePreset,
  type DistancePreset,
  getEventsForPreset,
  filterEventsByDistance,
  createRadiusCircleGeoJSON,
} from "@/lib/map/event-filters";
import { flyToPoint, fitBoundsToPoints } from "@/lib/map/camera-utils";
import { startBackgroundMusic, stopBackgroundMusic } from "@/lib/audio/background-music";
import type { EventCategory } from "@/lib/registries/types";
import {
  type HighlightCardInfo,
  selectEventHighlight,
  deselectEventHighlight,
  buildCardInfo,
} from "@/lib/map/venue-highlight";
import type { LocalVenue } from "@/lib/map/geocoding";

interface MapContainerProps {
  events: EventEntry[];
  onAskAbout?: (eventTitle: string) => void;
  onFlyoverRequest?: (handler: (eventIds: string[], theme?: string) => void) => void;
  onDirectionsRequest?: (handler: (coordinates: [number, number]) => void) => void;
  /** Registers a handler for AI-driven filter changes. */
  onFilterChangeRequest?: (handler: (preset?: DatePreset, category?: EventCategory) => void) => void;
  /** Registers a handler that opens an event detail from external callers. */
  onOpenDetailRequest?: (handler: (eventId: string) => void) => void;
  /** Registers a handler that closes the event detail panel. */
  onCloseDetailRequest?: (handler: () => void) => void;
  /** Registers a handler that closes the directions panel. */
  onCloseDirectionsRequest?: (handler: () => void) => void;
  /** Registers a handler for cinematic "show on map" with rotation + card. */
  onShowOnMapRequest?: (handler: (eventId: string) => void) => void;
  onStartPersonalization?: () => void;
  /** Event IDs currently highlighted by the AI chat. */
  highlightedEventIds?: string[];
  /** Callback to clear AI-highlighted events and restore the date filter. */
  onClearHighlights?: () => void;
  /** Callback when location is toggled on/off. */
  onLocationChange?: (enabled: boolean) => void;
  /** Registers a handler for AI-driven data layer toggles. */
  onToggleDataLayerRequest?: (handler: (layerKey: string, action: "on" | "off" | "toggle") => void) => void;
  /** Start the Story of Orlando presentation. */
  onStartPresentation?: () => void;
  /** Start the Features Showcase presentation. */
  onStartShowcase?: () => void;
  /** Current chat position mode. */
  chatPosition?: "center" | "right";
  /** Callback when chat position changes. */
  onChatPositionChange?: (position: "center" | "right") => void;
  /** Fires when a data layer becomes active or all layers are deactivated. */
  onDataLayerActiveChange?: (active: boolean) => void;
  /** Fires when flyover becomes active or ends. */
  onFlyoverActiveChange?: (active: boolean) => void;
  children?: ReactNode;
}

/** Renders the root map with MapLibre GL and composes child layers. */
export function MapContainer({ events, onAskAbout, onFlyoverRequest, onDirectionsRequest, onFilterChangeRequest, onOpenDetailRequest, onCloseDetailRequest, onCloseDirectionsRequest, onShowOnMapRequest, onStartPersonalization, highlightedEventIds, onClearHighlights, onLocationChange, onToggleDataLayerRequest, onStartPresentation, onStartShowcase, chatPosition, onChatPositionChange, onDataLayerActiveChange, onFlyoverActiveChange, children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [eventsPanelOpen, setEventsPanelOpen] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [mode3D, setMode3D] = useState(true);
  const [flyoverProgress, setFlyoverProgress] = useState<FlyoverProgress | null>(null);
  const flyoverAbortRef = useRef<boolean>(false);
  const flyoverGenRef = useRef(0);
  const introPlayingRef = useRef<boolean>(false);
  const introPromiseRef = useRef<Promise<void> | null>(null);
  const introCompleteRef = useRef<boolean>(false);
  /** Global clear-selection callback — only one selection (popup or show-on-map) active at a time. Pass `keepHighlight` to preserve the canvas card (e.g. when directions start). */
  const clearSelectionRef = useRef<((keepHighlight?: boolean) => void) | null>(null);
  // Map is always rendered in dark mode regardless of system theme
  const isDark = true;

  // Directions state
  const [directionsRoute, setDirectionsRoute] = useState<DirectionsResult | null>(null);
  const [directionsOrigin, setDirectionsOrigin] = useState<[number, number] | null>(null);
  const [directionsDestination, setDirectionsDestination] = useState<[number, number] | null>(null);
  const [directionsProfile, setDirectionsProfile] = useState<TravelProfile>("driving-car");
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  /** Current step coordinate for the green navigation dot. */
  const [directionsStepCoord, setDirectionsStepCoord] = useState<[number, number] | null>(null);
  /** Whether the origin came from actual GPS (true) or map center fallback (false). */
  const [directionsOriginIsGps, setDirectionsOriginIsGps] = useState(false);

  // Data layers state
  const [dlState, dlDispatch] = useReducer(dataLayerReducer, initialDataLayerState);
  /** Selected development index for carousel ↔ map sync. */
  const [selectedDevIndex, setSelectedDevIndex] = useState(0);

  /** Toggle a data layer on/off. */
  const handleToggleDataLayer = useCallback((key: DataLayerKey) => {
    dlDispatch({ type: "TOGGLE", key });
  }, []);

  /** Handle data ready from a layer component. */
  const handleLayerDataReady = useCallback(
    (key: DataLayerKey, data: unknown) => {
      dlDispatch({ type: "DATA_READY", key, data });
      // Request AI analysis
      fetch("/api/layers/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layerKey: key, data }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((result) => {
          if (result?.analysis) {
            dlDispatch({ type: "ANALYSIS_READY", key, content: result.analysis, model: result.model });
          }
        })
        .catch((err) => console.error("[DataLayers] Analysis failed:", err));
    },
    [],
  );

  /** Handle AI-driven data layer toggle. */
  const handleAiToggleDataLayer = useCallback(
    (layerKey: string, action: "on" | "off" | "toggle") => {
      const key = layerKey as DataLayerKey;
      if (action === "toggle") {
        dlDispatch({ type: "TOGGLE", key });
      } else if (action === "on" && !dlState.active.has(key)) {
        dlDispatch({ type: "TOGGLE", key });
      } else if (action === "off" && dlState.active.has(key)) {
        dlDispatch({ type: "TOGGLE", key });
      }
    },
    [dlState.active],
  );

  // Register AI toggle handler with parent
  useEffect(() => {
    onToggleDataLayerRequest?.(handleAiToggleDataLayer);
  }, [onToggleDataLayerRequest, handleAiToggleDataLayer]);

  /** Handle loading state changes from layer components. */
  const handleLayerLoadingChange = useCallback(
    (key: DataLayerKey, loading: boolean) => {
      if (loading) {
        dlDispatch({ type: "LOAD_START", key });
      }
    },
    [],
  );

  // Date filter state — default to today's events
  const [activePreset, setActivePreset] = useState<DatePreset>("today");
  // Distance filter state
  const [distanceFilter, setDistanceFilter] = useState<DistancePreset>(null);
  const userLocationRef = useRef<[number, number] | null>(null);
  const [hasUserLocation, setHasUserLocation] = useState(false);

  const defaultEventIds = useMemo(
    () => getEventsForPreset(events, activePreset),
    [events, activePreset],
  );

  // Apply distance filter on top of date filter
  const filteredEventIds = useMemo(() => {
    if (!distanceFilter || !userLocationRef.current) return defaultEventIds;
    return filterEventsByDistance(defaultEventIds, events, userLocationRef.current, distanceFilter);
  }, [defaultEventIds, events, distanceFilter]);

  const aiResultsActive = (highlightedEventIds?.length ?? 0) > 0;
  const dataLayerActive = dlState.active.size > 0;
  const effectiveEventIds = dataLayerActive ? [] : aiResultsActive ? highlightedEventIds! : filteredEventIds;

  // Deduplicated venue list for search autocomplete
  const localVenues = useMemo<LocalVenue[]>(() => {
    const seen = new Map<string, LocalVenue>();
    for (const e of events) {
      const key = e.venue.toLowerCase();
      if (!seen.has(key) && e.coordinates) {
        seen.set(key, { name: e.venue, address: e.address || e.venue, coordinates: e.coordinates });
      }
    }
    return Array.from(seen.values());
  }, [events]);

  // Notify parent when data layer active state changes (for chat snap-down)
  useEffect(() => {
    onDataLayerActiveChange?.(dataLayerActive);
  }, [dataLayerActive, onDataLayerActiveChange]);

  // ── Location update from toolbar ──
  const handleLocationUpdate = useCallback((coords: [number, number]) => {
    userLocationRef.current = coords;
    setHasUserLocation(true);
  }, []);

  // ── Radius circle layer ──
  const RADIUS_SOURCE = "distance-radius-source";
  const RADIUS_FILL = "distance-radius-fill";
  const RADIUS_LINE = "distance-radius-line";

  useEffect(() => {
    if (!map || !styleLoaded) return;

    const cleanup = () => {
      if (map.getLayer(RADIUS_LINE)) map.removeLayer(RADIUS_LINE);
      if (map.getLayer(RADIUS_FILL)) map.removeLayer(RADIUS_FILL);
      if (map.getSource(RADIUS_SOURCE)) map.removeSource(RADIUS_SOURCE);
    };

    if (!distanceFilter || !userLocationRef.current) {
      cleanup();
      return;
    }

    const circleFeature = createRadiusCircleGeoJSON(userLocationRef.current, distanceFilter);
    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [circleFeature],
    };

    if (map.getSource(RADIUS_SOURCE)) {
      (map.getSource(RADIUS_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource(RADIUS_SOURCE, { type: "geojson", data: geojson });

      map.addLayer({
        id: RADIUS_FILL,
        type: "fill",
        source: RADIUS_SOURCE,
        paint: {
          "fill-color": "#00D4AA",
          "fill-opacity": 0.06,
        },
      });

      map.addLayer({
        id: RADIUS_LINE,
        type: "line",
        source: RADIUS_SOURCE,
        paint: {
          "line-color": "#00D4AA",
          "line-width": 2,
          "line-opacity": 0.5,
          "line-dasharray": [4, 3],
        },
      });
    }

    return cleanup;
  }, [map, styleLoaded, distanceFilter]);

  // Initialize map — pre-fetch style to avoid MapLibre hitting 503s
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let mapInstance: maplibregl.Map | null = null;

    (async () => {
      // Pre-fetch style JSON with retry + fallback (prevents MapLibre 503 crash)
      const styleJson = await fetchMapStyle(isDark);
      if (cancelled || !containerRef.current) return;

      mapInstance = new maplibregl.Map({
        container: containerRef.current,
        style: styleJson as maplibregl.StyleSpecification,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: DEFAULT_PITCH,
        bearing: DEFAULT_BEARING,
        attributionControl: {},
        maxTileCacheSize: 50,
        fadeDuration: 0,
        // Restrict viewport to Central Florida region
        maxBounds: [[-83.5, 27.0], [-79.5, 30.0]],
      });

      // Zoom/rotate controls moved to custom bottom-left toolbar (MapStatusBar)
      mapInstance.addControl(
        new maplibregl.ScaleControl({ maxWidth: 150 }),
        "bottom-right",
      );

      // Track when style is loaded
      mapInstance.on("style.load", () => {
        setStyleLoaded(true);
      });

      setMap(mapInstance);
    })();

    return () => {
      cancelled = true;
      mapInstance?.remove();
    };
    // Only run on mount - theme changes handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle 3D mode toggle (terrain, buildings, three.js markers)
  useEffect(() => {
    if (!map || !styleLoaded) return;

    if (mode3D) {
      add3DLayers(map, isDark);
      map.easeTo({ pitch: 50, duration: 1000 });

      // Three.js marker layer disabled — the second WebGL context competes
      // with MapLibre for GPU resources and causes significant lag.
      // Re-enable when performance is optimized or on high-end GPUs.
    } else {
      // Only tear down if 3D layers were previously added
      const has3D = map.getLayer("3d-buildings");
      if (has3D) {
        remove3DLayers(map);
        map.easeTo({ pitch: 0, duration: 1000 });
      }
    }
  }, [map, mode3D, isDark, styleLoaded, events]);

  // Lock map during flyover: disable pan/rotate, allow zoom only
  useEffect(() => {
    if (!map) return;
    const isFlyoverActive = flyoverProgress &&
      flyoverProgress.state !== "idle" &&
      flyoverProgress.state !== "complete";

    if (isFlyoverActive) {
      map.dragPan.disable();
      map.dragRotate.disable();
      map.keyboard.disable();
      map.touchZoomRotate.disableRotation();
    } else {
      map.dragPan.enable();
      map.dragRotate.enable();
      map.keyboard.enable();
      map.touchZoomRotate.enableRotation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Only react to state changes, not full progress object
  }, [map, flyoverProgress?.state]);

  // Fit map to highlighted events when they change
  useEffect(() => {
    if (!map || !highlightedEventIds?.length) return;
    const highlighted = events.filter((e) => highlightedEventIds.includes(e.id));
    if (highlighted.length === 0) return;
    const coords = highlighted.map((e) => e.coordinates as [number, number]);
    void fitBoundsToPoints(map, coords, { padding: 100, duration: 1200 });
  }, [map, highlightedEventIds, events]);

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

      // Find events by ID, cap at 5 to keep flyover concise and avoid TTS overload
      const MAX_FLYOVER_EVENTS = 5;
      const tourEvents = eventIds
        .map((id) => events.find((e) => e.id === id))
        .filter((e): e is EventEntry => e !== undefined)
        .slice(0, MAX_FLYOVER_EVENTS);

      console.log("[Flyover] Found events:", tourEvents.length, "of", eventIds.length, "(max:", MAX_FLYOVER_EVENTS, ")");

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

      // Start ambient background music for flyover
      startBackgroundMusic("flyover");

      // Start intro audio immediately and track when it finishes
      // Waypoint audio will wait for this to complete
      introPlayingRef.current = true;
      introPromiseRef.current = playFlyoverIntro()
        .catch(console.error)
        .finally(() => {
          introPlayingRef.current = false;
          console.log("[Flyover] Intro audio finished");
        });

      // OPTIMIZATION: Generate audio from basic narratives IMMEDIATELY
      // so buffers are ready by the time the camera reaches each waypoint.
      // AI-narrated audio (generated in parallel) replaces these when ready.
      const audioStartTime = performance.now();
      console.log("[Flyover] Starting immediate audio generation for", started.waypoints.length, "waypoints");
      const basicAudioPromise = Promise.all(
        started.waypoints.map(async (wp) => {
          const wpStart = performance.now();
          try {
            const audioBuffer = await generateAudioBuffer(wp.narrative);
            console.log(`[Flyover] Audio ready for "${wp.event.title}" (${wp.narrative.length} chars) in ${Math.round(performance.now() - wpStart)}ms`);
            return { eventId: wp.eventId, narrative: wp.narrative, audioBuffer };
          } catch {
            console.warn(`[Flyover] Audio failed for "${wp.event.title}" in ${Math.round(performance.now() - wpStart)}ms`);
            return { eventId: wp.eventId, narrative: wp.narrative, audioBuffer: null as ArrayBuffer | null };
          }
        }),
      );

      // Update waypoints when basic audio is ready
      basicAudioPromise.then((results) => {
        console.log(`[Flyover] Basic audio pipeline completed in ${Math.round(performance.now() - audioStartTime)}ms`);
        if (flyoverAbortRef.current) return;
        setFlyoverProgress((prev) => {
          if (!prev) return null;
          // Only update waypoints that don't already have audio (AI may have beaten us)
          const updates = results
            .filter((r) => r.audioBuffer)
            .map((r) => ({
              index: prev.waypoints.findIndex((w) => w.eventId === r.eventId),
              narrative: r.narrative,
              audioBuffer: r.audioBuffer!,
            }))
            .filter((u) => u.index >= 0 && !prev.waypoints[u.index].audioBuffer);

          // IMPORTANT: Force audioReady after basic audio completes, even if some failed.
          // Waypoints without buffers will fall back to live TTS during playback.
          const updated = updates.length > 0 ? updateWaypointAudio(prev, updates) : prev;
          if (updated.audioReady) return updated; // All ready, updateWaypointAudio handled it

          console.log("[Flyover] Basic audio ready for", updates.length, "waypoints — enabling flyover");
          return { ...updated, audioReady: true };
        });
      });

      // In parallel, prepare AI-generated narratives for higher quality audio
      const aiStartTime = performance.now();
      try {
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
            })),
            theme,
          }),
        });

        if (narrateResponse.ok) {
          const { narratives } = await narrateResponse.json() as {
            narratives: Array<{ eventId: string; narrative: string }>;
          };

          console.log("[Flyover] Received", narratives.length, "AI narratives, generating audio");

          // Generate audio for AI narratives in parallel (replaces basic audio)
          const audioPromises = narratives.map(async ({ eventId, narrative }) => {
            const audioBuffer = await generateAudioBuffer(narrative);
            return { eventId, narrative, audioBuffer };
          });

          const audioResults = await Promise.all(audioPromises);

          // Replace with AI-narrated audio
          if (!flyoverAbortRef.current) {
            setFlyoverProgress((prev) => {
              if (!prev) return null;

              const updates = audioResults.map((result) => {
                const waypointIndex = prev.waypoints.findIndex(
                  (w) => w.eventId === result.eventId,
                );
                return {
                  index: waypointIndex,
                  narrative: result.narrative,
                  audioBuffer: result.audioBuffer ?? undefined,
                };
              });

              return updateWaypointAudio(prev, updates);
            });

            console.log(`[Flyover] AI audio pipeline ready in ${Math.round(performance.now() - aiStartTime)}ms`);
          }
        }
      } catch (error) {
        console.error("[Flyover] AI narrative generation failed:", error);
        // Basic audio is already generating — tour continues with fallback
      }
    },
    [map, styleLoaded, events, mode3D],
  );

  // Register flyover handler with parent - use a stable callback wrapper
  useEffect(() => {
    const wrapper = (eventIds: string[], theme?: string) => {
      handleStartFlyover(eventIds, theme);
    };
    onFlyoverRequest?.(wrapper);
  }, [onFlyoverRequest, handleStartFlyover]);

  /** Handle demo option selection from toolbar. */
  const handleDemo = useCallback((option: DemoOption) => {
    switch (option) {
      case "home":
        if (map) {
          flyToPoint(map, DEFAULT_CENTER, {
            zoom: DEFAULT_ZOOM,
            pitch: DEFAULT_PITCH,
            bearing: DEFAULT_BEARING,
            duration: 2000,
          });
        }
        break;
      case "story":
        onStartPresentation?.();
        break;
      case "flyover": {
        const sampleEvents = events
          .filter((e) => e.coordinates)
          .slice(0, 5)
          .map((e) => e.id);
        if (sampleEvents.length > 0) {
          handleStartFlyover(sampleEvents, "Best of Orlando");
        }
        break;
      }
      case "showcase":
        onStartShowcase?.();
        break;
      case "personalize":
        onStartPersonalization?.();
        break;
    }
  }, [map, events, onStartPresentation, onStartShowcase, onStartPersonalization, handleStartFlyover]);

  // Flyover loop - runs when flyover is active
  useEffect(() => {
    if (!map || !flyoverProgress || flyoverProgress.state === "idle" || flyoverProgress.state === "complete") {
      // Clean up highlight when flyover ends
      if (map && (flyoverProgress?.state === "complete" || flyoverProgress?.state === "idle")) {
        deselectEventHighlight(map);
      }
      return;
    }

    const thisGen = flyoverGenRef.current;

    const runFlyover = async () => {
      /** Check if this loop is still the active generation. */
      const isStale = () => flyoverGenRef.current !== thisGen;

      if (isStale()) return;

      // Reset abort flag for this generation — old RAF callbacks from the
      // previous generation will have already fired and seen the true value.
      flyoverAbortRef.current = false;

      const { waypoints, currentIndex, state } = flyoverProgress;
      const waypoint = waypoints[currentIndex];

      if (state === "preparing") {
        // Cinematic intro — orbital sweep (only runs once)
        if (!introCompleteRef.current) {
          const center = calculateCenter(waypoints.map((w) => w.center));
          await cinematicIntro(map, center, flyoverAbortRef);
          if (isStale()) return;
          introCompleteRef.current = true;
        }

        // Gate on audio readiness — re-fires when audioReady changes
        if (!flyoverProgress.audioReady) {
          console.log(`[Flyover] Waiting for audio... ${flyoverProgress.audioReadyCount}/${waypoints.length} ready`);
          return;
        }

        // All audio ready — transition to flying
        introCompleteRef.current = false;
        setFlyoverProgress((prev) => prev ? { ...prev, state: "flying" } : null);
        return;
      }

      if (state === "flying" && waypoint) {
        // Update venue highlight to current waypoint with floating card
        const ev = waypoint.event;
        const cardInfo: HighlightCardInfo = buildCardInfo({
          title: ev.title,
          venue: ev.venue,
          startDate: ev.startDate,
          source: ev.source,
        });
        selectEventHighlight(map, waypoint.center, ev.imageUrl, cardInfo);

        // Fly to waypoint
        await animateToWaypoint(map, waypoint);
        if (isStale()) return;

        // Wait for intro audio to finish before playing waypoint audio
        // This prevents cutting off the intro message
        if (introPromiseRef.current) {
          console.log("[Flyover] Waiting for intro audio to finish...");
          await introPromiseRef.current;
          introPromiseRef.current = null; // Clear after first wait
        }
        if (isStale()) return;

        // Start narration + gentle orbital drift during speech
        setFlyoverProgress((prev) =>
          prev ? { ...prev, state: "narrating", currentNarrative: waypoint.narrative } : null,
        );

        // Play audio and orbit concurrently — orbit follows audio duration
        const orbitDone = { current: false };
        const audioPromise = (async () => {
          try {
            if (waypoint.audioBuffer) {
              await playAudioBuffer(waypoint.audioBuffer);
            } else {
              await speak(waypoint.narrative);
            }
          } catch (error) {
            console.error("[Flyover] TTS error:", error);
          }
        })();

        // Merged abort ref: stops orbit when audio finishes OR flyover is aborted/skipped
        const mergedAbortRef = {
          get current() { return flyoverAbortRef.current || orbitDone.current; },
        };

        const orbitPromise = orbitWaypoint(map, waypoint.center, {
          duration: 30000,  // generous upper bound — audio determines real duration
          degreesPerOrbit: 25,
          abortRef: mergedAbortRef,
        });

        // Wait for FULL narration before advancing
        await audioPromise;
        orbitDone.current = true; // signal orbit to stop naturally
        void orbitPromise;

        if (isStale()) return;

        // Brief pause after narration
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (isStale()) return;

        // Move to next waypoint or complete
        const next = nextWaypoint(flyoverProgress);
        if (next.state === "complete") {
          // Remove highlight before outro
          deselectEventHighlight(map);
          // Fade out background music
          void stopBackgroundMusic();
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
  }, [map, flyoverProgress?.state, flyoverProgress?.currentIndex, flyoverProgress?.isPaused, flyoverProgress?.audioReady]);

  // Flyover controls
  const handleFlyoverPause = useCallback(() => {
    setFlyoverProgress((prev) => (prev ? togglePause(prev) : null));
  }, []);

  const handleFlyoverStop = useCallback(() => {
    flyoverAbortRef.current = true;
    flyoverGenRef.current++;
    introPlayingRef.current = false;
    introPromiseRef.current = null;
    introCompleteRef.current = false;
    stopFlyoverAudio();
    stopSpeaking();
    void stopBackgroundMusic();
    setFlyoverProgress((prev) => (prev ? stopFlyoverState(prev) : null));
  }, []);

  const handleFlyoverNext = useCallback(() => {
    flyoverAbortRef.current = true;
    flyoverGenRef.current++;
    stopSpeaking();
    stopFlyoverAudio();
    // Don't reset flyoverAbortRef here — the new effect's runFlyover will
    // reset it, ensuring old RAF callbacks see true and stop first.
    setFlyoverProgress((prev) => (prev ? nextWaypoint(prev) : null));
  }, []);

  const handleFlyoverJumpTo = useCallback((index: number) => {
    flyoverAbortRef.current = true;
    flyoverGenRef.current++;
    stopSpeaking();
    stopFlyoverAudio();
    // Don't reset flyoverAbortRef here — same reason as handleFlyoverNext.
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

  // --- Directions handlers ---
  const fetchDirections = useCallback(
    async (origin: [number, number], dest: [number, number], profile: TravelProfile) => {
      setDirectionsLoading(true);
      setDirectionsError(null);
      setDirectionsOrigin(origin);
      setDirectionsDestination(dest);
      try {
        const result = await getDirections(origin, dest, profile);
        setDirectionsRoute(result);
      } catch (err) {
        setDirectionsError(err instanceof Error ? err.message : "Failed to get directions");
      } finally {
        setDirectionsLoading(false);
      }
    },
    [],
  );

  const handleGetDirections = useCallback(
    (coordinates: [number, number]) => {
      // ── Stop orbit/dismiss but keep the highlight card above the destination ──
      clearSelectionRef.current?.(/* keepHighlight */ true);
      map?.stop();

      // Close events panel — directions and events panels are mutually exclusive
      setEventsPanelOpen(false);

      // Show loading panel immediately (before geolocation resolves)
      setDirectionsLoading(true);
      setDirectionsError(null);
      setDirectionsRoute(null);
      setDirectionsDestination(coordinates);
      setDirectionsStepCoord(null);
      setDirectionsOriginIsGps(false);

      // Get user's current location via Geolocation API
      if (!navigator.geolocation) {
        setDirectionsError("Geolocation is not supported by your browser. Please enable location services.");
        setDirectionsLoading(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin: [number, number] = [position.coords.longitude, position.coords.latitude];
          console.log("[Directions] GPS origin:", origin, "accuracy:", position.coords.accuracy, "m");
          setDirectionsOriginIsGps(true);
          fetchDirections(origin, coordinates, directionsProfile);
        },
        (geoErr) => {
          console.warn("[Directions] Geolocation failed:", geoErr.code, geoErr.message);
          // Timeout (code 3) → fall back to map center instead of showing error
          if (geoErr.code === 3 && map) {
            const center = map.getCenter();
            const origin: [number, number] = [center.lng, center.lat];
            console.log("[Directions] GPS timeout, falling back to map center:", origin);
            setDirectionsOriginIsGps(false);
            fetchDirections(origin, coordinates, directionsProfile);
            return;
          }
          // Permission denied (code 1) or other errors show message
          const reason = geoErr.code === 1
            ? "Location permission denied. Please allow location access in your browser settings."
            : "Could not determine your location. Please check location settings.";
          setDirectionsError(reason);
          setDirectionsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
      );
    },
    [map, directionsProfile, fetchDirections],
  );

  // Register directions handler with parent
  useEffect(() => {
    onDirectionsRequest?.(handleGetDirections);
  }, [onDirectionsRequest, handleGetDirections]);

  /** Gets directions to an event from the user's current location. */
  const handleEventDirections = useCallback(
    (event: EventEntry) => {
      if (!event.coordinates || !map) return;
      const coords = event.coordinates as [number, number];

      // Show golden highlight card above the destination before starting directions
      const cardInfo = buildCardInfo({
        title: event.title,
        venue: event.venue,
        startDate: event.startDate,
        source: event.source,
      });
      selectEventHighlight(map, coords, event.imageUrl, cardInfo);

      handleGetDirections(coords);
    },
    [map, handleGetDirections],
  );

  // Open event detail in the dropdown from a map popup click
  const [detailEventId, setDetailEventId] = useState<string | null>(null);

  // Close data layers when event detail, directions, or flyover become active
  const directionsActive = !!directionsRoute || directionsLoading;
  const flyoverActive = !!flyoverProgress && flyoverProgress.state !== "idle" && flyoverProgress.state !== "complete";

  // Notify parent when flyover active state changes (for chat hide/restore)
  useEffect(() => {
    onFlyoverActiveChange?.(flyoverActive);
  }, [flyoverActive, onFlyoverActiveChange]);
  useEffect(() => {
    if (detailEventId || directionsActive || flyoverActive) {
      dlDispatch({ type: "CLEAR" });
    }
  }, [detailEventId, directionsActive, flyoverActive]);

  // Close directions when data layers activate or flyover starts
  const dataLayersActive = dlState.active.size > 0;
  useEffect(() => {
    if (dataLayersActive || flyoverActive) {
      setDirectionsRoute(null);
      setDirectionsOrigin(null);
      setDirectionsDestination(null);
      setDirectionsError(null);
      setDirectionsLoading(false);
      setDirectionsStepCoord(null);
      setDirectionsOriginIsGps(false);
    }
  }, [dataLayersActive, flyoverActive]);

  const handleCloseDirections = useCallback(() => {
    // Only clean up the highlight if directions were actually active
    const wasActive = !!directionsRoute || directionsLoading || !!directionsDestination;
    setDirectionsRoute(null);
    setDirectionsOrigin(null);
    setDirectionsDestination(null);
    setDirectionsError(null);
    setDirectionsLoading(false);
    setDirectionsStepCoord(null);
    setDirectionsOriginIsGps(false);
    if (wasActive && map) deselectEventHighlight(map);
  }, [map, directionsRoute, directionsLoading, directionsDestination]);

  const handleOpenDetail = useCallback((eventId: string) => {
    setDetailEventId(eventId);
    // Auto-open events panel when detail is requested
    setEventsPanelOpen(true);
    // Close data layers — event detail and data layers are mutually exclusive
    dlDispatch({ type: "CLEAR" });
    // Close directions — event detail and directions are mutually exclusive
    handleCloseDirections();
  }, [handleCloseDirections]);

  /** Toggle events panel visibility — clears data layers and directions when opening. */
  const handleToggleEventsPanel = useCallback(() => {
    setEventsPanelOpen((prev) => {
      if (!prev) {
        dlDispatch({ type: "CLEAR" }); // opening → clear data layers
        handleCloseDirections(); // opening → close directions panel
      }
      return !prev;
    });
  }, [handleCloseDirections]);

  // Handle AI-driven filter changes (preset and/or category)
  const handleFilterChange = useCallback(
    (preset?: DatePreset) => {
      if (preset) {
        setActivePreset(preset);
      }
      // Category filtering can be extended here in the future
      // For now, clear AI highlights so the preset filter takes effect
      onClearHighlights?.();
    },
    [onClearHighlights],
  );

  // Register filter change handler with parent
  useEffect(() => {
    onFilterChangeRequest?.(handleFilterChange);
  }, [onFilterChangeRequest, handleFilterChange]);

  // Register open-detail handler with parent
  useEffect(() => {
    onOpenDetailRequest?.(handleOpenDetail);
  }, [onOpenDetailRequest, handleOpenDetail]);

  /** Close the event detail panel and events dropdown. */
  const handleCloseDetail = useCallback(() => {
    setDetailEventId(null);
    setEventsPanelOpen(false);
  }, []);

  // Register close-detail handler with parent
  useEffect(() => {
    onCloseDetailRequest?.(handleCloseDetail);
  }, [onCloseDetailRequest, handleCloseDetail]);

  // Register close-directions handler with parent
  useEffect(() => {
    onCloseDirectionsRequest?.(handleCloseDirections);
  }, [onCloseDirectionsRequest, handleCloseDirections]);

  // Cinematic "show on map" — fly to event with rotation + info card
  const showOnMapOrbitRef = useRef<number>(0);
  const showOnMapDismissRef = useRef<HTMLButtonElement | null>(null);
  const showOnMapRenderRef = useRef<(() => void) | null>(null);
  const showOnMapCoordsRef = useRef<[number, number] | null>(null);

  /** Handles cinematic show-on-map: fly to event, show card, start gentle orbit. */
  const handleShowEventOnMap = useCallback(
    (eventId: string) => {
      if (!map || !styleLoaded) return;

      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      // Clear data layers — show-on-map and data layers are mutually exclusive
      dlDispatch({ type: "CLEAR" });

      // ── Clear ANY existing selection (popup click OR previous show-on-map) ──
      clearSelectionRef.current?.();

      const coords = event.coordinates as [number, number];

      // Build card info for the highlight
      const cardInfo: HighlightCardInfo = buildCardInfo({
        title: event.title,
        venue: event.venue,
        startDate: event.startDate,
        source: event.source,
      });

      // Show highlight card + golden pulse on the dot
      selectEventHighlight(map, coords, event.imageUrl, cardInfo);

      // ── Create dismiss X button (screen-space positioned) ──
      showOnMapCoordsRef.current = coords;
      const dismissEl = document.createElement("button");
      dismissEl.className = "venue-dismiss-btn";
      dismissEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      dismissEl.style.cssText = `
        position: absolute; z-index: 10; display: flex; align-items: center;
        justify-content: center; width: 22px; height: 22px; border-radius: 50%;
        background: rgba(0,0,0,0.75); border: 1.5px solid rgba(255,255,255,0.3);
        color: #fff; cursor: pointer; backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px); transition: background 0.15s;
        pointer-events: auto;
      `;
      dismissEl.addEventListener("mouseenter", () => { dismissEl.style.background = "rgba(220,50,50,0.85)"; });
      dismissEl.addEventListener("mouseleave", () => { dismissEl.style.background = "rgba(0,0,0,0.75)"; });
      showOnMapDismissRef.current = dismissEl;

      const positionDismiss = () => {
        if (!showOnMapDismissRef.current || !showOnMapCoordsRef.current) return;
        const pt = map.project(showOnMapCoordsRef.current);
        showOnMapDismissRef.current.style.left = `${pt.x - 11}px`;
        showOnMapDismissRef.current.style.top = `${pt.y - 11}px`;
      };

      showOnMapRenderRef.current = positionDismiss;
      map.getCanvasContainer().appendChild(dismissEl);
      positionDismiss();
      map.on("render", positionDismiss);

      // ── Local cleanup function for THIS selection ──
      const cleanupThisSelection = (keepHighlight = false) => {
        cancelAnimationFrame(showOnMapOrbitRef.current);
        showOnMapOrbitRef.current = 0;
        if (showOnMapRenderRef.current) {
          map.off("render", showOnMapRenderRef.current);
          showOnMapRenderRef.current = null;
        }
        showOnMapDismissRef.current?.remove();
        showOnMapDismissRef.current = null;
        showOnMapCoordsRef.current = null;
        if (!keepHighlight) deselectEventHighlight(map);
        if (clearSelectionRef.current === cleanupThisSelection) {
          clearSelectionRef.current = null;
        }
      };

      // Register as the active selection
      clearSelectionRef.current = cleanupThisSelection;

      // Wire dismiss button click
      dismissEl.addEventListener("click", (evt) => {
        evt.stopPropagation();
        cleanupThisSelection();
      });

      // Fly to the event with cinematic pitch
      void flyToPoint(map, coords, {
        zoom: 16,
        pitch: 55,
        bearing: map.getBearing(),
        duration: 2000,
      });

      // Start gentle orbit after camera arrives
      map.once("moveend", () => {
        if (!showOnMapDismissRef.current) return; // Selection already cleared
        let lastTime = performance.now();
        const ORBIT_SPEED = 2; // degrees per second

        const orbit = (now: number) => {
          if (!showOnMapDismissRef.current || showOnMapOrbitRef.current === 0) return; // Selection cleared mid-orbit
          const dt = (now - lastTime) / 1000;
          lastTime = now;
          const bearing = map.getBearing() + ORBIT_SPEED * dt;
          map.easeTo({ bearing, duration: 0, animate: false });
          showOnMapOrbitRef.current = requestAnimationFrame(orbit);
        };

        showOnMapOrbitRef.current = requestAnimationFrame(orbit);

        // Stop orbit on user interaction (keep selection active)
        const stopOrbit = () => {
          cancelAnimationFrame(showOnMapOrbitRef.current);
          showOnMapOrbitRef.current = 0;
          map.off("mousedown", stopOrbit);
          map.off("touchstart", stopOrbit);
          map.off("wheel", stopOrbit);
        };

        map.on("mousedown", stopOrbit);
        map.on("touchstart", stopOrbit);
        map.on("wheel", stopOrbit);
      });
    },
    [map, styleLoaded, events],
  );

  // Register show-on-map handler with parent
  useEffect(() => {
    onShowOnMapRequest?.(handleShowEventOnMap);
  }, [onShowOnMapRequest, handleShowEventOnMap]);

  const handleDirectionsProfileChange = useCallback(
    (profile: TravelProfile) => {
      setDirectionsProfile(profile);
      if (directionsOrigin && directionsDestination) {
        fetchDirections(directionsOrigin, directionsDestination, profile);
      }
    },
    [directionsOrigin, directionsDestination, fetchDirections],
  );

  /** Fly the map camera to a step coordinate and update the green navigation dot. */
  const handleFlyToStep = useCallback(
    (coordinate: [number, number]) => {
      // Cancel any active show-on-map orbit so it doesn't fight the flyTo, but keep the card
      clearSelectionRef.current?.(/* keepHighlight */ true);
      setDirectionsStepCoord(coordinate);
      if (!map) return;
      map.stop();
      map.flyTo({
        center: coordinate,
        zoom: 19,
        pitch: 60,
        duration: 1200,
      });
    },
    [map],
  );

  return (
    <MapContext value={map}>
      <div className="relative h-full w-full">
        {/* Corner vignette + blue glow — single composited layer (no blur filter) */}
        <div className="pointer-events-none absolute inset-0 z-10" style={{
          background: `
            radial-gradient(ellipse 500px 500px at top left, rgba(0, 0, 0, 0.85) 0%, transparent 70%),
            radial-gradient(ellipse 500px 500px at top right, rgba(0, 0, 0, 0.85) 0%, transparent 70%),
            radial-gradient(ellipse 500px 500px at bottom left, rgba(0, 0, 0, 0.85) 0%, transparent 70%),
            radial-gradient(ellipse 500px 500px at bottom right, rgba(0, 0, 0, 0.85) 0%, transparent 70%),
            radial-gradient(ellipse 600px 600px at top left, rgba(0, 99, 205, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 600px 600px at top right, rgba(0, 99, 205, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 600px 600px at bottom left, rgba(0, 99, 205, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 600px 600px at bottom right, rgba(0, 99, 205, 0.12) 0%, transparent 50%)
          `,
        }} />


        <div
          ref={containerRef}
          style={{ position: "absolute", inset: 0 }}
        />

        <MapControls />

        <MapMarkers events={events} styleLoaded={styleLoaded} isDark={isDark} visibleEventIds={effectiveEventIds} highlightedEventIds={highlightedEventIds} />
        <MapHotspots events={events} styleLoaded={styleLoaded} isDark={isDark} />
        <MapPopups onAskAbout={onAskAbout} onGetDirections={handleGetDirections} onOpenDetail={handleOpenDetail} clearSelectionRef={clearSelectionRef} onInteraction={() => dlDispatch({ type: "CLEAR" })} />
        <MapDirections route={directionsRoute} origin={directionsOrigin} destination={directionsDestination} stepCoordinate={directionsStepCoord} />

        {/* Data layers */}
        <MapWeatherLayer
          active={dlState.active.has("weather")}
          subType={dlState.weatherSubType}
          onDataReady={(data) => handleLayerDataReady("weather", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("weather", loading)}
        />
        <MapTransitShapesLayer active={dlState.active.has("transit")} />
        <MapTransitLayer
          active={dlState.active.has("transit")}
          onDataReady={(data) => handleLayerDataReady("transit", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("transit", loading)}
        />
        <MapCityDataLayer
          active={dlState.active.has("cityData")}
          onDataReady={(data) => handleLayerDataReady("cityData", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("cityData", loading)}
        />
        <MapNwsAlertsLayer
          active={dlState.active.has("nwsAlerts")}
          onDataReady={(data) => handleLayerDataReady("nwsAlerts", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("nwsAlerts", loading)}
        />
        <MapAircraftLayer
          active={dlState.active.has("aircraft")}
          onDataReady={(data) => handleLayerDataReady("aircraft", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("aircraft", loading)}
        />
        <MapSunrailLayer
          active={dlState.active.has("sunrail")}
          onDataReady={(data) => handleLayerDataReady("sunrail", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("sunrail", loading)}
        />
        <MapCountyDataLayer
          active={dlState.active.has("countyData")}
          onDataReady={(data) => handleLayerDataReady("countyData", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("countyData", loading)}
        />
        <MapDevelopmentsLayer
          active={dlState.active.has("developments")}
          onDataReady={(data) => handleLayerDataReady("developments", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("developments", loading)}
          selectedIndex={selectedDevIndex}
          onSelectIndex={setSelectedDevIndex}
        />
        <MapEvChargersLayer
          active={dlState.active.has("evChargers")}
          onDataReady={(data) => handleLayerDataReady("evChargers", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("evChargers", loading)}
        />
        <MapAirQualityLayer
          active={dlState.active.has("airQuality")}
          onDataReady={(data) => handleLayerDataReady("airQuality", data)}
          onLoadingChange={(loading) => handleLayerLoadingChange("airQuality", loading)}
        />

        {/* Unified data layer info panel (bottom-left) */}
        {dlState.active.size > 0 && (() => {
          const activeKey = Array.from(dlState.active)[0];
          const layerData = dlState.data[activeKey];
          const isLayerLoading = dlState.loading.has(activeKey);
          const hasAnalysis = dlState.analysis?.key === activeKey;
          const isAnalyzing = !hasAnalysis && (isLayerLoading || !!layerData);
          return (
            <DataLayerInfoPanel
              layerKey={activeKey}
              data={layerData}
              isLoading={isLayerLoading}
              isAnalyzing={isAnalyzing}
              analysisContent={hasAnalysis ? dlState.analysis!.content : undefined}
              analysisModel={hasAnalysis ? dlState.analysis!.model : undefined}
              weatherSubType={activeKey === "weather" ? dlState.weatherSubType : undefined}
              onClose={() => dlDispatch({ type: "DISMISS_ANALYSIS" })}
              selectedDevIndex={activeKey === "developments" ? selectedDevIndex : undefined}
              onSelectDevIndex={activeKey === "developments" ? setSelectedDevIndex : undefined}
            />
          );
        })()}

        <MapToolbar
          activePreset={activePreset}
          onPresetChange={setActivePreset}
          aiResultsActive={aiResultsActive}
          onClearAiResults={onClearHighlights}
          distanceFilter={distanceFilter}
          onDistanceFilterChange={setDistanceFilter}
          hasUserLocation={hasUserLocation}
          onLocationUpdate={handleLocationUpdate}
          onGetDirectionsToCoord={handleGetDirections}
          activeDataLayers={dlState.active}
          loadingDataLayers={dlState.loading}
          onToggleDataLayer={handleToggleDataLayer}
          dataLayerData={dlState.data}
          weatherSubType={dlState.weatherSubType}
          onWeatherSubTypeChange={(subType) => dlDispatch({ type: "SET_WEATHER_SUB_TYPE", subType })}
          mode3D={mode3D}
          onToggle3D={handleToggle3D}
          onLocationChange={onLocationChange}
          onStartPersonalization={onStartPersonalization}
          onDemo={handleDemo}
          disableAutoRotate={
            !!directionsRoute || directionsLoading ||
            (!!flyoverProgress && flyoverProgress.state !== "idle" && flyoverProgress.state !== "complete")
          }
          showCoordinates={showCoordinates}
          onToggleCoordinates={() => setShowCoordinates((p) => !p)}
          eventsPanelOpen={eventsPanelOpen}
          onToggleEventsPanel={handleToggleEventsPanel}
          chatPosition={chatPosition}
          onChatPositionChange={onChatPositionChange}
          onToolbarTabOpen={() => dlDispatch({ type: "CLEAR" })}
          onClearDataLayers={() => dlDispatch({ type: "CLEAR" })}
          localVenues={localVenues}
        />

        <MapStatusBar visible={showCoordinates} />

        {/* Events slide-in panel */}
        <AnimatePresence>
          {eventsPanelOpen && (
            <motion.div
              initial={{ x: -360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -360, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="grain-texture absolute z-20 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
              style={{
                top: "5.5rem",
                left: "1rem",
                width: "min(380px, calc(100vw - 2rem))",
                maxHeight: "min(65vh, calc(100vh - 8rem))",
                background: "rgba(10, 10, 15, 0.82)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
              }}
            >
              <EventsPanelContent
                events={events}
                effectiveEventIds={effectiveEventIds}
                aiResultsActive={aiResultsActive}
                activePreset={activePreset}
                onPresetChange={setActivePreset}
                onAskAbout={(title) => {
                  onAskAbout?.(title);
                  setEventsPanelOpen(false);
                }}
                onShowOnMap={(event) => handleShowEventOnMap(event.id)}
                onGetDirections={(event) => {
                  handleEventDirections(event);
                  setEventsPanelOpen(false);
                }}
                onClose={() => setEventsPanelOpen(false)}
                detailEventId={detailEventId}
                onClearDetailEvent={() => setDetailEventId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Directions panel */}
        {(directionsRoute || directionsLoading || directionsError) && (
          <DirectionsPanel
            route={directionsRoute}
            loading={directionsLoading}
            profile={directionsProfile}
            onProfileChange={handleDirectionsProfileChange}
            onClose={handleCloseDirections}
            error={directionsError}
            origin={directionsOrigin}
            destination={directionsDestination}
            onFlyToStep={handleFlyToStep}
            originIsGps={directionsOriginIsGps}
            onRetryLocation={directionsDestination ? () => handleGetDirections(directionsDestination) : undefined}
          />
        )}

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

        {/* First-time map guide */}
        <MapGuide />
      </div>
    </MapContext>
  );
}

/**
 * Adds 3D terrain, hillshade, and building layers to the map.
 * Terrain uses MapTiler DEM (gracefully skipped without API key).
 * Buildings use OpenMapTiles schema (`render_height`).
 * @param map - The MapLibre GL map instance.
 * @param isDark - Whether dark theme is active.
 */
function add3DLayers(map: maplibregl.Map, isDark: boolean) {
  // Guard: ensure style object is available (callers already gate on React styleLoaded state)
  if (!map.getStyle()) return;

  const style = map.getStyle();
  const sourceNames = Object.keys(style?.sources || {});
  console.log("[3D] Available sources:", sourceNames);

  // --- 3D buildings ---
  // Remove flat building layers from the style (e.g. CARTO Dark Matter has "building" + "building-top")
  // so they don't render over our 3D extrusion layer.
  for (const flatId of ["building-top", "building"]) {
    if (map.getLayer(flatId)) {
      map.removeLayer(flatId);
    }
  }

  if (!map.getLayer("3d-buildings")) {
    const sources = style?.sources || {};
    let buildingSource: string | undefined;

    for (const name of ["maptiler_planet", "openmaptiles", "carto", "composite"]) {
      if (sources[name]) {
        buildingSource = name;
        break;
      }
    }

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

    const layers = style?.layers || [];
    let labelLayerId: string | undefined;
    for (const layer of layers) {
      if (layer.type === "symbol" && (layer.layout as Record<string, unknown>)?.["text-field"]) {
        labelLayerId = layer.id;
        break;
      }
    }

    console.log("[3D] Adding buildings layer with source:", buildingSource, "below:", labelLayerId);

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
        minzoom: 14,
        paint: {
          "fill-extrusion-color": isDark ? "#2a2a2a" : "#c8c8c8",
          "fill-extrusion-height": heightExpr,
          "fill-extrusion-base": [
            "coalesce",
            ["get", "render_min_height"],
            0,
          ],
          "fill-extrusion-opacity": 0.7,
        },
      },
      labelLayerId,
    );

    console.log("[3D] Buildings layer added successfully");
  }

  // Sky / atmosphere layer removed — CartoDB styles do not support the "sky" layer type.
}

/**
 * Removes 3D terrain, hillshade, and building layers from the map.
 * @param map - The MapLibre GL map instance.
 */
function remove3DLayers(map: maplibregl.Map) {
  if (!map.getStyle()) return;

  // Remove terrain
  map.setTerrain(null);
  if (map.getLayer("terrain-hillshade")) {
    map.removeLayer("terrain-hillshade");
  }
  if (map.getSource("terrain-dem")) {
    map.removeSource("terrain-dem");
  }

  // Remove 3D buildings
  if (map.getLayer("3d-buildings")) {
    map.removeLayer("3d-buildings");
  }

  console.log("[3D] Layers removed");
}

// Venue highlight functions moved to @/lib/map/venue-highlight.ts

/**
 * Shifts basemap layers toward a neutral grayscale palette.
 * Light mode: Voyager warm tones → cool grays.
 * Dark mode: Dark Matter blue-blacks → pure dark grays.
 * Layer IDs match the CartoDB GL style specs.
 * @param map - The MapLibre GL map instance.
 * @param isDark - Whether dark theme is active.
 */

