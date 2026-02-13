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
  onStartPersonalization?: () => void;
  /** Event IDs currently highlighted by the AI chat. */
  highlightedEventIds?: string[];
  /** Callback to clear AI-highlighted events and restore the date filter. */
  onClearHighlights?: () => void;
  children?: ReactNode;
}

/** Renders the root map with MapLibre GL and composes child layers. */
export function MapContainer({ events, onAskAbout, onFlyoverRequest, onDirectionsRequest, onFilterChangeRequest, onOpenDetailRequest, onStartPersonalization, highlightedEventIds, onClearHighlights, children }: MapContainerProps) {
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

    instance.addControl(new maplibregl.NavigationControl(), "top-right");
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
        removeVenueHighlight(map);
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
        const cardInfo: HighlightCardInfo = {
          title: ev.title,
          venue: ev.venue,
          date: new Date(ev.startDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
          source: ev.source.type === "manual" ? "Curated" : ev.source.type.charAt(0).toUpperCase() + ev.source.type.slice(1),
          price: ev.price?.isFree ? "Free" : ev.price ? `$${ev.price.min}${ev.price.max > ev.price.min ? `–$${ev.price.max}` : ""}` : "See details",
        };
        updateVenueHighlight(map, waypoint.center, ev.imageUrl, cardInfo);

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
          detailEventId={detailEventId}
          onClearDetailEvent={() => setDetailEventId(null)}
        />

        <MapMarkers events={events} styleLoaded={styleLoaded} isDark={isDark} visibleEventIds={effectiveEventIds} highlightedEventIds={highlightedEventIds} />
        <MapHotspots events={events} styleLoaded={styleLoaded} isDark={isDark} />
        <MapPopups onAskAbout={onAskAbout} onGetDirections={handleGetDirections} onOpenDetail={handleOpenDetail} />
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

/** Venue highlight source and layer IDs. */
const HIGHLIGHT_SOURCE = "venue-highlight-source";
const HIGHLIGHT_PULSE_LAYER = "venue-highlight-pulse";
const HIGHLIGHT_GLOW_LAYER = "venue-highlight-glow";
const HIGHLIGHT_IMAGE_LAYER = "venue-highlight-image";
const HIGHLIGHT_IMAGE_ID = "venue-highlight-img";
const HIGHLIGHT_CARD_WIDTH = 340;
const HIGHLIGHT_CARD_HEIGHT = 110;
const HIGHLIGHT_THUMB_WIDTH = 100;

/** Module-level animation frame ID for the pulse loop. */
let pulseAnimFrame: number | null = null;

/**
 * Starts a continuous pulsation animation on the venue highlight layers.
 * Uses requestAnimationFrame for smooth sinusoidal oscillation.
 * @param map - The MapLibre GL map instance.
 */
function startPulseAnimation(map: maplibregl.Map) {
  stopPulseAnimation();

  const startTime = performance.now();

  const animate = () => {
    if (!map.getStyle()) { pulseAnimFrame = null; return; }

    const t = (performance.now() - startTime) / 1000;
    const pulse = Math.sin(t * 2.5) * 0.5 + 0.5; // 0→1 at ~1.25 Hz

    if (map.getLayer(HIGHLIGHT_GLOW_LAYER)) {
      map.setPaintProperty(HIGHLIGHT_GLOW_LAYER, "circle-radius", 40 + pulse * 40);
      map.setPaintProperty(HIGHLIGHT_GLOW_LAYER, "circle-opacity", 0.08 + pulse * 0.18);
    }

    if (map.getLayer(HIGHLIGHT_PULSE_LAYER)) {
      map.setPaintProperty(HIGHLIGHT_PULSE_LAYER, "circle-radius", 14 + pulse * 14);
      map.setPaintProperty(HIGHLIGHT_PULSE_LAYER, "circle-opacity", 0.3 + pulse * 0.35);
      map.setPaintProperty(HIGHLIGHT_PULSE_LAYER, "circle-stroke-opacity", 0.5 + pulse * 0.4);
    }

    pulseAnimFrame = requestAnimationFrame(animate);
  };

  pulseAnimFrame = requestAnimationFrame(animate);
}

/** Stops the venue highlight pulse animation. */
function stopPulseAnimation() {
  if (pulseAnimFrame !== null) {
    cancelAnimationFrame(pulseAnimFrame);
    pulseAnimFrame = null;
  }
}

/** Truncates text to fit within a pixel width using canvas measureText. */
function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + "...").width > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + "...";
}

/** Event info for the flyover highlight card. */
interface HighlightCardInfo {
  /** Event title. */
  title: string;
  /** Venue name. */
  venue: string;
  /** Formatted date string. */
  date: string;
  /** Source label. */
  source: string;
  /** Price label (e.g. "Free", "$25"). */
  price: string;
}

/**
 * Renders a horizontal flyover card (image left, text right) onto a canvas
 * and registers it with the MapLibre map instance.
 * @param map - MapLibre map instance.
 * @param url - Image URL to load.
 * @param imageId - ID to register the processed image under.
 * @param info - Event text info for the right panel.
 * @returns Promise resolving to true if rendered successfully.
 */
async function loadHighlightImage(
  map: maplibregl.Map,
  url: string,
  imageId: string,
  info?: HighlightCardInfo,
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = HIGHLIGHT_CARD_WIDTH;
      const h = HIGHLIGHT_CARD_HEIGHT;
      const stemH = 10;
      const totalH = h + stemH;
      const radius = 14;
      const thumbW = HIGHLIGHT_THUMB_WIDTH;
      const textX = thumbW + 12;
      const textMaxW = w - textX - 12;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = totalH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(false); return; }

      // Card background
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, radius);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = "rgba(10, 10, 15, 0.92)";
      ctx.fillRect(0, 0, w, h);

      // Left thumbnail — centre-crop to fill thumbW x h
      const srcAspect = img.naturalWidth / img.naturalHeight;
      const dstAspect = thumbW / h;
      let srcX = 0, srcY = 0, srcW = img.naturalWidth, srcH = img.naturalHeight;
      if (srcAspect > dstAspect) {
        srcW = Math.round(img.naturalHeight * dstAspect);
        srcX = Math.round((img.naturalWidth - srcW) / 2);
      } else {
        srcH = Math.round(img.naturalWidth / dstAspect);
        srcY = Math.round((img.naturalHeight - srcH) / 2);
      }
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, thumbW, h);
      ctx.restore();

      // Right panel text
      if (info) {
        // Title (bold, white)
        ctx.font = "bold 14px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fillText(truncateText(ctx, info.title, textMaxW), textX, 24);

        // Venue (medium, white/70%)
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText(truncateText(ctx, info.venue, textMaxW), textX, 42);

        // Date (small, white/55%)
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.fillText(truncateText(ctx, info.date, textMaxW), textX, 60);

        // Source (small, white/40%)
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillText(truncateText(ctx, info.source, textMaxW), textX, 78);

        // Price (bold, accent blue)
        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = info.price === "Free" ? "#00D4AA" : "#66AAF0";
        ctx.fillText(info.price, textX, 98);
      }

      // Stem connector triangle
      ctx.beginPath();
      ctx.moveTo(w / 2 - 7, h - 1);
      ctx.lineTo(w / 2, h + stemH);
      ctx.lineTo(w / 2 + 7, h - 1);
      ctx.closePath();
      ctx.fillStyle = "rgba(10, 10, 15, 0.92)";
      ctx.fill();

      // Border
      ctx.beginPath();
      ctx.roundRect(0.5, 0.5, w - 1, h - 1, radius);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const imageData = ctx.getImageData(0, 0, w, totalH);

      if (map.hasImage(imageId)) map.removeImage(imageId);
      map.addImage(imageId, {
        width: w,
        height: totalH,
        data: new Uint8Array(imageData.data.buffer),
      });

      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Adds or updates a venue highlight on the map with a pulsating glow
 * and an optional floating event card above the orb.
 * @param map - The MapLibre GL map instance.
 * @param coordinates - The venue coordinates [lng, lat].
 * @param imageUrl - Optional event image URL for the card thumbnail.
 * @param cardInfo - Optional event text info for the floating card.
 */
function updateVenueHighlight(
  map: maplibregl.Map,
  coordinates: [number, number],
  imageUrl?: string,
  cardInfo?: HighlightCardInfo,
) {
  if (!map.getStyle()) return;

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

    // Outer glow layer (animated via pulse)
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

    // Center pulse layer (animated via pulse)
    map.addLayer({
      id: HIGHLIGHT_PULSE_LAYER,
      type: "circle",
      source: HIGHLIGHT_SOURCE,
      paint: {
        "circle-radius": 20,
        "circle-color": "#FFD700",
        "circle-opacity": 0.5,
        "circle-stroke-width": 3,
        "circle-stroke-color": "#FFD700",
        "circle-stroke-opacity": 0.8,
      },
    });

    // Start continuous pulse animation
    startPulseAnimation(map);
  }

  // Load event image and add floating image layer above the orb
  if (imageUrl) {
    // Remove previous image layer while new one loads
    if (map.getLayer(HIGHLIGHT_IMAGE_LAYER)) {
      map.removeLayer(HIGHLIGHT_IMAGE_LAYER);
    }

    loadHighlightImage(map, imageUrl, HIGHLIGHT_IMAGE_ID, cardInfo).then((ok) => {
      if (!ok || !map.getStyle() || !map.getSource(HIGHLIGHT_SOURCE)) return;

      // Remove stale layer if somehow re-added
      if (map.getLayer(HIGHLIGHT_IMAGE_LAYER)) return;

      map.addLayer({
        id: HIGHLIGHT_IMAGE_LAYER,
        type: "symbol",
        source: HIGHLIGHT_SOURCE,
        layout: {
          "icon-image": HIGHLIGHT_IMAGE_ID,
          "icon-size": 1.0,
          "icon-anchor": "bottom",
          "icon-offset": [0, -24] as [number, number],
          "icon-allow-overlap": true,
        },
        paint: {
          "icon-opacity": 0.95,
        },
      });
    });
  }
}

/**
 * Removes the venue highlight (orb, pulse, image) from the map.
 * @param map - The MapLibre GL map instance.
 */
function removeVenueHighlight(map: maplibregl.Map) {
  if (!map.getStyle()) return;

  stopPulseAnimation();

  if (map.getLayer(HIGHLIGHT_IMAGE_LAYER)) {
    map.removeLayer(HIGHLIGHT_IMAGE_LAYER);
  }
  if (map.getLayer(HIGHLIGHT_PULSE_LAYER)) {
    map.removeLayer(HIGHLIGHT_PULSE_LAYER);
  }
  if (map.getLayer(HIGHLIGHT_GLOW_LAYER)) {
    map.removeLayer(HIGHLIGHT_GLOW_LAYER);
  }
  if (map.getSource(HIGHLIGHT_SOURCE)) {
    map.removeSource(HIGHLIGHT_SOURCE);
  }
  if (map.hasImage(HIGHLIGHT_IMAGE_ID)) {
    map.removeImage(HIGHLIGHT_IMAGE_ID);
  }
}

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

