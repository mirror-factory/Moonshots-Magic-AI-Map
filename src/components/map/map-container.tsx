/**
 * @module components/map/map-container
 * Root map component. Initializes a MapLibre GL instance, provides it via
 * {@link MapContext}, and composes child map layers (markers, popups, controls).
 * Uses OpenFreeMap for free map tiles (no API key required).
 * Supports 3D mode with terrain and building extrusion.
 */

"use client";

import { useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from "react";
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
  getTerrainSourceUrl,
  TERRAIN_CONFIG,
} from "@/lib/map/config";
import { MapStatusBar } from "./map-status-bar";
import { MapControls } from "./map-controls";
import { MapMarkers } from "./map-markers";
import { MapHotspots } from "./map-hotspots";
import { MapPopups } from "./map-popups";
import type { EventEntry } from "@/lib/registries/types";
import { MapDirections } from "./map-directions";
import { DirectionsPanel } from "./directions-panel";
import { MapIsochrone } from "./map-isochrone";
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
import { animateToWaypoint, cinematicIntro, outroAnimation, calculateCenter, orbitWaypoint } from "@/lib/flyover/camera-animator";
import { speak, stopSpeaking, playAudioBuffer, generateAudioBuffer } from "@/lib/voice/cartesia-tts";
import { playFlyoverIntro, stopFlyoverAudio } from "@/lib/flyover/flyover-audio";
import { getDirections, type DirectionsResult, type TravelProfile } from "@/lib/map/routing";
import { getIsochrone, type IsochroneResult } from "@/lib/map/isochrone";
import { type DatePreset, getEventsForPreset } from "@/lib/map/event-filters";
import type { EventCategory } from "@/lib/registries/types";
import {
  type HighlightCardInfo,
  selectEventHighlight,
  deselectEventHighlight,
  buildCardInfo,
} from "@/lib/map/venue-highlight";
import { Stars } from "@/components/effects/stars";

/** Default isochrone time ranges in minutes. */
const ISOCHRONE_MINUTES: number[] = [5, 10, 15, 30];
/** Default isochrone travel profile. */
const ISOCHRONE_PROFILE: TravelProfile = "driving-car";

interface MapContainerProps {
  events: EventEntry[];
  onAskAbout?: (eventTitle: string) => void;
  onFlyoverRequest?: (handler: (eventIds: string[], theme?: string) => void) => void;
  onDirectionsRequest?: (handler: (coordinates: [number, number]) => void) => void;
  /** Registers a handler for AI-driven filter changes. */
  onFilterChangeRequest?: (handler: (preset?: DatePreset, category?: EventCategory) => void) => void;
  /** Registers a handler that opens an event detail from external callers. */
  onOpenDetailRequest?: (handler: (eventId: string) => void) => void;
  /** Registers a handler for cinematic "show on map" with rotation + card. */
  onShowOnMapRequest?: (handler: (eventId: string) => void) => void;
  onStartPersonalization?: () => void;
  /** Event IDs currently highlighted by the AI chat. */
  highlightedEventIds?: string[];
  /** Callback to clear AI-highlighted events and restore the date filter. */
  onClearHighlights?: () => void;
  /** Callback when location is toggled on/off. */
  onLocationChange?: (enabled: boolean) => void;
  children?: ReactNode;
}

/** Renders the root map with MapLibre GL and composes child layers. */
export function MapContainer({ events, onAskAbout, onFlyoverRequest, onDirectionsRequest, onFilterChangeRequest, onOpenDetailRequest, onShowOnMapRequest, onStartPersonalization, highlightedEventIds, onClearHighlights, onLocationChange, children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [controlsOpen] = useState(false);
  const [mode3D, setMode3D] = useState(true);
  const [flyoverProgress, setFlyoverProgress] = useState<FlyoverProgress | null>(null);
  const flyoverAbortRef = useRef<boolean>(false);
  const introPlayingRef = useRef<boolean>(false);
  const introPromiseRef = useRef<Promise<void> | null>(null);
  const ambientOrbitRef = useRef<number>(0);
  const ambientStoppedRef = useRef<boolean>(false);
  /** Global clear-selection callback — only one selection (popup or show-on-map) active at a time. */
  const clearSelectionRef = useRef<(() => void) | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Directions state
  const [directionsRoute, setDirectionsRoute] = useState<DirectionsResult | null>(null);
  const [directionsOrigin, setDirectionsOrigin] = useState<[number, number] | null>(null);
  const [directionsDestination, setDirectionsDestination] = useState<[number, number] | null>(null);
  const [directionsProfile, setDirectionsProfile] = useState<TravelProfile>("driving-car");
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState<string | null>(null);

  // Isochrone state
  const [isochroneResult, setIsochroneResult] = useState<IsochroneResult | null>(null);
  const [isochroneActive, setIsochroneActive] = useState(false);
  const [isochroneLoading, setIsochroneLoading] = useState(false);

  // Date filter state — default to today's events
  const [activePreset, setActivePreset] = useState<DatePreset>("today");

  const defaultEventIds = useMemo(
    () => getEventsForPreset(events, activePreset),
    [events, activePreset],
  );

  const aiResultsActive = (highlightedEventIds?.length ?? 0) > 0;
  const effectiveEventIds = aiResultsActive ? highlightedEventIds! : defaultEventIds;

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

    // Zoom/rotate controls moved to custom bottom-left toolbar (MapStatusBar)
    instance.addControl(
      new maplibregl.ScaleControl({ maxWidth: 150 }),
      "bottom-right",
    );

    // Track when style is loaded + apply blue tint
    instance.on("style.load", () => {
      tintMapGrayscale(instance, isDark);
      setStyleLoaded(true);
    });

    setMap(instance);

    return () => {
      cancelAnimationFrame(ambientOrbitRef.current);
      instance.remove();
    };
    // Only run on mount - theme changes handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ambient cinematic orbit — continuous slow rotation on load, stops on user interaction
  useEffect(() => {
    if (!map || !styleLoaded || ambientStoppedRef.current) return;

    const ROTATION_SPEED = 1.2; // degrees per second (slow cinematic orbit)
    const ORBIT_RADIUS = 0.003; // lng/lat radius of circular drift around Lake Eola
    let lastTime = performance.now();

    const stopAmbient = () => {
      ambientStoppedRef.current = true;
      cancelAnimationFrame(ambientOrbitRef.current);
      map.off("mousedown", stopAmbient);
      map.off("touchstart", stopAmbient);
      map.off("wheel", stopAmbient);
    };

    // Stop on any user interaction
    map.on("mousedown", stopAmbient);
    map.on("touchstart", stopAmbient);
    map.on("wheel", stopAmbient);

    const animate = (now: number) => {
      if (ambientStoppedRef.current) return;

      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const bearing = map.getBearing() + ROTATION_SPEED * dt;

      // Slow circular orbit around Lake Eola center
      const t = now / 1000;
      const orbitAngle = t * 0.04; // ~90s per full circle
      const centerLng = DEFAULT_CENTER[0] + Math.sin(orbitAngle) * ORBIT_RADIUS;
      const centerLat = DEFAULT_CENTER[1] + Math.cos(orbitAngle) * ORBIT_RADIUS;

      map.easeTo({
        bearing,
        center: [centerLng, centerLat],
        duration: 0,
        animate: false,
      });

      ambientOrbitRef.current = requestAnimationFrame(animate);
    };

    ambientOrbitRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(ambientOrbitRef.current);
      map.off("mousedown", stopAmbient);
      map.off("touchstart", stopAmbient);
      map.off("wheel", stopAmbient);
    };
  }, [map, styleLoaded]);

  // React to theme changes — only reload style when theme actually changes
  const prevThemeRef = useRef(isDark);
  useEffect(() => {
    if (!map) return;

    // Skip if the theme hasn't changed (avoids wiping custom layers)
    if (prevThemeRef.current === isDark) return;
    prevThemeRef.current = isDark;

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

      // Apply blue tint to light-mode basemap
      tintMapGrayscale(map, isDark);

      // Mark style as loaded
      setStyleLoaded(true);

      // Re-apply 3D mode if it was enabled
      if (mode3D) {
        add3DLayers(map, isDark);
      }
    });
  }, [map, isDark, mode3D]);

  // Handle 3D mode toggle (terrain, buildings, three.js markers)
  useEffect(() => {
    if (!map || !styleLoaded) return;

    if (mode3D) {
      add3DLayers(map, isDark);
      map.easeTo({ pitch: 50, duration: 1000 });

      // Dynamic import keeps three.js (~150KB gz) out of initial bundle
      import("@/lib/map/three-layer").then(({ createThreeLayer, THREE_LAYER_ID }) => {
        if (!map.getLayer(THREE_LAYER_ID)) {
          const layer = createThreeLayer(events);
          map.addLayer(layer);
          console.log("[3D] Three.js marker layer added");
        }
      }).catch((err) => console.error("[3D] Failed to load three.js layer:", err));
    } else {
      // Only tear down if 3D layers were previously added
      const has3D = map.getLayer("3d-buildings") || map.getSource("terrain-dem");
      if (has3D) {
        // Remove three.js layer first (before removing terrain source it may reference)
        import("@/lib/map/three-layer").then(({ THREE_LAYER_ID }) => {
          if (map.getLayer(THREE_LAYER_ID)) {
            map.removeLayer(THREE_LAYER_ID);
            console.log("[3D] Three.js marker layer removed");
          }
        }).catch(() => {});

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
    if (highlighted.length === 1) {
      map.flyTo({ center: highlighted[0].coordinates, zoom: 14, duration: 1200 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds();
    for (const e of highlighted) {
      bounds.extend(e.coordinates as [number, number]);
    }
    map.fitBounds(bounds, { padding: 100, duration: 1200 });
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

      // Stop ambient orbit if running
      ambientStoppedRef.current = true;
      cancelAnimationFrame(ambientOrbitRef.current);

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
      console.log("[Flyover] Starting immediate audio generation for", started.waypoints.length, "waypoints");
      const basicAudioPromise = Promise.all(
        started.waypoints.map(async (wp) => {
          try {
            const audioBuffer = await generateAudioBuffer(wp.narrative);
            return { eventId: wp.eventId, narrative: wp.narrative, audioBuffer };
          } catch {
            return { eventId: wp.eventId, narrative: wp.narrative, audioBuffer: null as ArrayBuffer | null };
          }
        }),
      );

      // Update waypoints when basic audio is ready
      basicAudioPromise.then((results) => {
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
          if (updates.length === 0) return prev;
          console.log("[Flyover] Basic audio ready for", updates.length, "waypoints");
          return updateWaypointAudio(prev, updates);
        });
      });

      // In parallel, prepare AI-generated narratives for higher quality audio
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
              price: e.price,
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

            console.log("[Flyover] AI audio pipeline ready");
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

  // Flyover loop - runs when flyover is active
  useEffect(() => {
    if (!map || !flyoverProgress || flyoverProgress.state === "idle" || flyoverProgress.state === "complete") {
      // Clean up highlight when flyover ends
      if (map && (flyoverProgress?.state === "complete" || flyoverProgress?.state === "idle")) {
        deselectEventHighlight(map);
      }
      return;
    }

    const runFlyover = async () => {
      if (flyoverAbortRef.current) return;

      const { waypoints, currentIndex, state } = flyoverProgress;
      const waypoint = waypoints[currentIndex];

      if (state === "preparing") {
        // Cinematic intro — orbital sweep
        const center = calculateCenter(waypoints.map((w) => w.center));
        await cinematicIntro(map, center, flyoverAbortRef);
        if (flyoverAbortRef.current) return;
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
          price: ev.price,
        });
        selectEventHighlight(map, waypoint.center, ev.imageUrl, cardInfo);

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

        // Start narration + gentle orbital drift during speech
        setFlyoverProgress((prev) =>
          prev ? { ...prev, state: "narrating", currentNarrative: waypoint.narrative } : null,
        );

        // Play audio and orbit concurrently
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

        const orbitPromise = orbitWaypoint(map, waypoint.center, {
          duration: 8000,
          degreesPerOrbit: 25,
          abortRef: flyoverAbortRef,
        });

        // Wait for audio to finish (orbit will be cancelled by abortRef if needed)
        await audioPromise;
        // Don't wait for orbit to finish — audio determines pacing
        void orbitPromise;

        if (flyoverAbortRef.current) return;

        // Brief pause after narration
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (flyoverAbortRef.current) return;

        // Move to next waypoint or complete
        const next = nextWaypoint(flyoverProgress);
        if (next.state === "complete") {
          // Remove highlight before outro
          deselectEventHighlight(map);
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
      // Get user's current location via Geolocation API
      if (!navigator.geolocation) {
        setDirectionsError("Geolocation is not supported by your browser");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin: [number, number] = [position.coords.longitude, position.coords.latitude];
          setDirectionsDestination(coordinates);
          fetchDirections(origin, coordinates, directionsProfile);
        },
        () => {
          // Fallback: use map center as origin
          if (map) {
            const center = map.getCenter();
            fetchDirections([center.lng, center.lat], coordinates, directionsProfile);
          } else {
            setDirectionsError("Could not determine your location");
          }
        },
        { enableHighAccuracy: true, timeout: 5000 },
      );
    },
    [directionsProfile, fetchDirections, map],
  );

  // Register directions handler with parent
  useEffect(() => {
    onDirectionsRequest?.(handleGetDirections);
  }, [onDirectionsRequest, handleGetDirections]);

  // Open event detail in the dropdown from a map popup click
  const [detailEventId, setDetailEventId] = useState<string | null>(null);
  const handleOpenDetail = useCallback((eventId: string) => {
    setDetailEventId(eventId);
  }, []);

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

      // ── Clear ANY existing selection (popup click OR previous show-on-map) ──
      clearSelectionRef.current?.();

      // Stop ambient orbit if running
      ambientStoppedRef.current = true;
      cancelAnimationFrame(ambientOrbitRef.current);

      const coords = event.coordinates as [number, number];

      // Build card info for the highlight
      const cardInfo: HighlightCardInfo = buildCardInfo({
        title: event.title,
        venue: event.venue,
        startDate: event.startDate,
        source: event.source,
        price: event.price,
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
      const cleanupThisSelection = () => {
        cancelAnimationFrame(showOnMapOrbitRef.current);
        showOnMapOrbitRef.current = 0;
        if (showOnMapRenderRef.current) {
          map.off("render", showOnMapRenderRef.current);
          showOnMapRenderRef.current = null;
        }
        showOnMapDismissRef.current?.remove();
        showOnMapDismissRef.current = null;
        showOnMapCoordsRef.current = null;
        deselectEventHighlight(map);
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
      map.flyTo({
        center: coords,
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
          if (!showOnMapDismissRef.current) return; // Selection cleared mid-orbit
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

  const handleCloseDirections = useCallback(() => {
    setDirectionsRoute(null);
    setDirectionsOrigin(null);
    setDirectionsDestination(null);
    setDirectionsError(null);
    setDirectionsLoading(false);
  }, []);

  // --- Isochrone handlers ---
  const handleToggleIsochrone = useCallback(() => {
    if (isochroneActive) {
      setIsochroneActive(false);
      setIsochroneResult(null);
      return;
    }

    setIsochroneActive(true);
    setIsochroneLoading(true);

    const fetchIsochrone = (center: [number, number]) => {
      getIsochrone(center, ISOCHRONE_MINUTES, ISOCHRONE_PROFILE)
        .then((result) => {
          setIsochroneResult(result);
        })
        .catch((err) => {
          console.error("[Isochrone] Error:", err);
          setIsochroneActive(false);
        })
        .finally(() => setIsochroneLoading(false));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchIsochrone([pos.coords.longitude, pos.coords.latitude]),
        () => {
          // Fallback to map center
          if (map) {
            const c = map.getCenter();
            fetchIsochrone([c.lng, c.lat]);
          } else {
            setIsochroneActive(false);
            setIsochroneLoading(false);
          }
        },
        { enableHighAccuracy: true, timeout: 5000 },
      );
    } else if (map) {
      const c = map.getCenter();
      fetchIsochrone([c.lng, c.lat]);
    }
  }, [isochroneActive, map]);

  return (
    <MapContext value={map}>
      <div className="relative h-full w-full">
        {/* Corner vignette effect */}
        <div className="pointer-events-none absolute inset-0 z-10" style={{
          background: `
            radial-gradient(ellipse 500px 500px at top left, rgba(0, 0, 0, 0.6) 0%, transparent 70%),
            radial-gradient(ellipse 500px 500px at top right, rgba(0, 0, 0, 0.6) 0%, transparent 70%),
            radial-gradient(ellipse 500px 500px at bottom left, rgba(0, 0, 0, 0.6) 0%, transparent 70%),
            radial-gradient(ellipse 500px 500px at bottom right, rgba(0, 0, 0, 0.6) 0%, transparent 70%)
          `,
        }} />
        {/* Corner blue glows */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-96 w-96 opacity-40" style={{
          background: "radial-gradient(circle at top left, rgba(0, 99, 205, 0.3) 0%, transparent 60%)",
          filter: "blur(60px)"
        }} />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-96 w-96 opacity-40" style={{
          background: "radial-gradient(circle at top right, rgba(0, 99, 205, 0.3) 0%, transparent 60%)",
          filter: "blur(60px)"
        }} />
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-96 w-96 opacity-40" style={{
          background: "radial-gradient(circle at bottom left, rgba(0, 99, 205, 0.3) 0%, transparent 60%)",
          filter: "blur(60px)"
        }} />
        <div className="pointer-events-none absolute bottom-0 right-0 z-10 h-96 w-96 opacity-40" style={{
          background: "radial-gradient(circle at bottom right, rgba(0, 99, 205, 0.3) 0%, transparent 60%)",
          filter: "blur(60px)"
        }} />

        {/* Stars overlay */}
        <Stars count={120} shootingStars={3} />

        <div
          ref={containerRef}
          style={{ position: "absolute", inset: 0 }}
        />

        <MapControls
          open={controlsOpen}
          events={events}
          eventCount={events.length}
          highlightedEventIds={highlightedEventIds}
          effectiveEventIds={effectiveEventIds}
          aiResultsActive={aiResultsActive}
          activePreset={activePreset}
          onPresetChange={setActivePreset}
          onAskAbout={onAskAbout}
          onShowEventOnMap={handleShowEventOnMap}
          detailEventId={detailEventId}
          onClearDetailEvent={() => setDetailEventId(null)}
        />

        <MapMarkers events={events} styleLoaded={styleLoaded} isDark={isDark} visibleEventIds={effectiveEventIds} highlightedEventIds={highlightedEventIds} />
        <MapHotspots events={events} styleLoaded={styleLoaded} isDark={isDark} />
        <MapPopups onAskAbout={onAskAbout} onGetDirections={handleGetDirections} onOpenDetail={handleOpenDetail} clearSelectionRef={clearSelectionRef} />
        <MapDirections route={directionsRoute} origin={directionsOrigin} destination={directionsDestination} />
        <MapIsochrone result={isochroneResult} events={events} />
        <MapStatusBar
          mode3D={mode3D}
          onToggle3D={handleToggle3D}
          onStartPersonalization={onStartPersonalization}
          isochroneActive={isochroneActive}
          isochroneLoading={isochroneLoading}
          onToggleIsochrone={handleToggleIsochrone}
          activePreset={activePreset}
          onPresetChange={setActivePreset}
          aiResultsActive={aiResultsActive}
          onClearAiResults={onClearHighlights}
          onLocationChange={onLocationChange}
        />

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

  // --- Terrain ---
  const terrainUrl = getTerrainSourceUrl();
  if (terrainUrl && !map.getSource("terrain-dem")) {
    map.addSource("terrain-dem", {
      type: "raster-dem",
      tiles: [terrainUrl],
      tileSize: 256,
      maxzoom: 14,
    });
    map.setTerrain({ source: "terrain-dem", exaggeration: TERRAIN_CONFIG.exaggeration });

    // Hillshade layer for depth
    if (!map.getLayer("terrain-hillshade")) {
      map.addLayer({
        id: "terrain-hillshade",
        type: "hillshade",
        source: "terrain-dem",
        paint: {
          "hillshade-illumination-direction": TERRAIN_CONFIG.hillshadeDirection,
          "hillshade-exaggeration": 0.3,
          "hillshade-shadow-color": isDark ? "#000000" : "#3a3a3a",
          "hillshade-highlight-color": isDark ? "#2a2a2a" : "#f0f0f0",
        },
      });
    }
    console.log("[3D] Terrain + hillshade added");
  }

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

    for (const name of ["openmaptiles", "carto", "composite"]) {
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
        minzoom: 13,
        paint: {
          "fill-extrusion-color": isDark
            ? [
                "interpolate", ["linear"], heightExpr,
                0, "#1a1a1a", 50, "#2a2a2a", 100, "#383838", 200, "#484848",
              ]
            : [
                "interpolate", ["linear"], heightExpr,
                0, "#b0b0b0", 50, "#c0c0c0", 100, "#cccccc", 200, "#d8d8d8",
              ],
          "fill-extrusion-height": [
            "interpolate", ["linear"], ["zoom"],
            13, 0, 14.5, ["*", heightExpr, 2.5],
          ],
          "fill-extrusion-base": ["get", "render_min_height"],
          "fill-extrusion-opacity": isDark ? 0.9 : 0.88,
          "fill-extrusion-vertical-gradient": true,
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
function tintMapGrayscale(map: maplibregl.Map, isDark: boolean) {
  if (!map.isStyleLoaded()) return;

  const set = (layerId: string, prop: string, value: unknown) => {
    if (map.getLayer(layerId)) {
      try { map.setPaintProperty(layerId, prop, value); } catch { /* skip */ }
    }
  };

  if (!isDark) {
    // --- Light mode (Positron): already grayscale, minor tweaks ---
    // Slightly cooler background
    set("background", "background-color", "#eaeaea");

    // Desaturate any remaining green in parks/land
    for (const id of ["landcover", "landuse", "park_national_park", "park_nature_reserve", "landcover-grass", "landcover-wood"]) {
      set(id, "fill-color", "#dcdcdc");
    }

    // Water — muted cool gray instead of Positron's light blue
    set("water", "fill-color", "#c0c8d0");
    set("water_shadow", "fill-color", "rgba(180, 188, 196, 1)");

    // Buildings
    set("building", "fill-color", "#d4d4d4");
    set("building-top", "fill-color", "#dadada");
  } else {
    // --- Dark mode: Dark Matter blue-blacks → neutral dark grays ---
    set("background", "background-color", "#1a1a1a");

    for (const id of ["landcover", "landuse"]) {
      set(id, "fill-color", "#222222");
    }

    set("building", "fill-color", "#2a2a2a");
    set("building-top", "fill-color", "#303030");

    // Water — dark gray with slight coolness
    set("water", "fill-color", "#252a30");
    set("water_shadow", "fill-color", "rgba(30, 35, 42, 1)");

    // Roads — subtle light grays
    for (const id of ["road_trunk_primary", "road_secondary_tertiary", "road_minor"]) {
      set(id, "line-color", "#3a3a3a");
    }
    set("road_major_motorway", "line-color", "#404040");
  }
}

