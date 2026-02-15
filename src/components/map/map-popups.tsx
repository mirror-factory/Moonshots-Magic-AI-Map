/**
 * @module components/map/map-popups
 * Handles hover and click interactions on the events layer using canvas-rendered
 * flyover-style cards from the shared venue-highlight module.
 *
 * Hover: floating card above the marker (no pulse, disappears on mouse leave).
 * Click: card + golden pulsating orb + auto-rotation orbit. Selection persists
 * through map drag/pan — only the X dismiss button removes it.
 *
 * Uses a shared {@link clearSelectionRef} so that only one selection
 * (popup-click OR show-on-map) is active at any time.
 */

"use client";

import { useEffect, useRef, useCallback, type MutableRefObject } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "./use-map";
import {
  showHoverCard,
  removeHoverCard,
  selectEventHighlight,
  deselectEventHighlight,
  buildCardInfo,
} from "@/lib/map/venue-highlight";

/** Props for {@link MapPopups}. */
interface MapPopupsProps {
  /** Callback when user clicks "Ask about this". */
  onAskAbout?: (eventTitle: string) => void;
  /** Callback when user clicks "Directions". */
  onGetDirections?: (coordinates: [number, number], eventTitle: string) => void;
  /** Callback when user clicks "More Detail" — opens the events dropdown. */
  onOpenDetail?: (eventId: string) => void;
  /** Shared ref — only one selection (popup-click or show-on-map) active at a time. Pass `keepHighlight` to preserve the canvas card. */
  clearSelectionRef?: MutableRefObject<((keepHighlight?: boolean) => void) | null>;
  /** Called when a popup interaction occurs (e.g. event clicked on map). */
  onInteraction?: () => void;
}

/** Handles hover and click popup interactions on the events map layer. */
export function MapPopups({ onAskAbout, onGetDirections, onOpenDetail, clearSelectionRef, onInteraction }: MapPopupsProps) {
  const map = useMap();

  /** Stable refs for callback props — avoids re-registering map listeners when callbacks change identity. */
  const onInteractionRef = useRef(onInteraction);
  onInteractionRef.current = onInteraction;
  const onAskAboutRef = useRef(onAskAbout);
  onAskAboutRef.current = onAskAbout;
  const onGetDirectionsRef = useRef(onGetDirections);
  onGetDirectionsRef.current = onGetDirections;
  const onOpenDetailRef = useRef(onOpenDetail);
  onOpenDetailRef.current = onOpenDetail;

  /** Whether a selection (click) is currently active. */
  const isSelectedRef = useRef(false);
  /** The dismiss button DOM element (screen-space positioned). */
  const dismissElRef = useRef<HTMLButtonElement | null>(null);
  /** Coordinates of the currently selected event (for screen projection). */
  const selectedCoordsRef = useRef<[number, number] | null>(null);
  /** Stored render handler for cleanup. */
  const renderHandlerRef = useRef<(() => void) | null>(null);
  /** Animation frame ID for the orbit loop. */
  const orbitFrameRef = useRef<number>(0);
  /** Track selected event ID to prevent re-selecting same event. */
  const selectedEventIdRef = useRef<string | null>(null);
  /** Whether this component owns the shared clearSelectionRef. */
  const ownsSelectionRef = useRef(false);

  /** Stops the orbit animation loop. */
  const stopOrbit = useCallback(() => {
    cancelAnimationFrame(orbitFrameRef.current);
    orbitFrameRef.current = 0;
  }, []);

  /** Removes the dismiss (X) button from the DOM and cleans up render listener. */
  const removeDismissButton = useCallback(() => {
    if (renderHandlerRef.current && map) {
      map.off("render", renderHandlerRef.current);
      renderHandlerRef.current = null;
    }
    dismissElRef.current?.remove();
    dismissElRef.current = null;
    selectedCoordsRef.current = null;
  }, [map]);

  /** Clears the entire selection: card, pulse, orbit, X button. Pass `keepHighlight` to preserve the canvas card (e.g. when directions start). */
  const clearSelection = useCallback((keepHighlight = false) => {
    if (!map) return;
    stopOrbit();
    if (!keepHighlight) deselectEventHighlight(map);
    removeDismissButton();
    isSelectedRef.current = false;
    selectedEventIdRef.current = null;
    // Unregister from shared ref if we own it
    if (ownsSelectionRef.current && clearSelectionRef) {
      clearSelectionRef.current = null;
      ownsSelectionRef.current = false;
    }
  }, [map, stopOrbit, removeDismissButton, clearSelectionRef]);

  useEffect(() => {
    if (!map) return;

    // ── Hover: canvas card (no pulse) ──────────────────────────────────
    const handleMouseMove = (e: maplibregl.MapLayerMouseEvent) => {
      if (isSelectedRef.current) return; // Don't show hover when selection is active
      const features = e.features;
      if (!features?.length) return;

      const feature = features[0];
      const props = feature.properties;
      if (!props) return;

      const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];

      map.getCanvas().style.cursor = "pointer";

      const cardInfo = buildCardInfo({
        title: String(props.title ?? ""),
        venue: String(props.venue ?? ""),
        startDate: String(props.startDate ?? ""),
        source: String(props.sourceType ?? ""),
      });

      showHoverCard(map, coords, String(props.imageUrl ?? ""), cardInfo);
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      if (!isSelectedRef.current) {
        removeHoverCard(map);
      }
    };

    // ── Click: canvas card + golden pulse + orbit ──────────────────────
    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      const features = e.features;
      if (!features?.length) return;

      const feature = features[0];
      const props = feature.properties;
      if (!props) return;

      const eventId = String(props.id ?? "");

      // If clicking same event, ignore
      if (selectedEventIdRef.current === eventId) return;

      // ── Clear ANY existing selection (previous popup OR show-on-map) ──
      if (clearSelectionRef?.current) {
        clearSelectionRef.current();
      } else {
        clearSelection();
      }

      const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];

      // Remove hover card
      removeHoverCard(map);

      // Mark as selected
      isSelectedRef.current = true;
      selectedEventIdRef.current = eventId;

      // Notify parent of interaction (e.g. to clear data layers)
      onInteractionRef.current?.();

      // Build card info
      const cardInfo = buildCardInfo({
        title: String(props.title ?? ""),
        venue: String(props.venue ?? ""),
        startDate: String(props.startDate ?? ""),
        source: String(props.sourceType ?? ""),
      });

      // Show the highlight: canvas card + golden pulsating orb
      selectEventHighlight(map, coords, String(props.imageUrl ?? ""), cardInfo);

      // Open the detail panel in the dropdown for action buttons
      if (onOpenDetailRef.current && eventId) {
        onOpenDetailRef.current(eventId);
      }

      // Add screen-space X dismiss button (positioned via map.project())
      selectedCoordsRef.current = coords;
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
      dismissEl.addEventListener("mouseenter", () => {
        dismissEl.style.background = "rgba(220, 50, 50, 0.85)";
      });
      dismissEl.addEventListener("mouseleave", () => {
        dismissEl.style.background = "rgba(0, 0, 0, 0.75)";
      });
      dismissEl.addEventListener("click", (evt) => {
        evt.stopPropagation();
        clearSelection();
      });
      dismissElRef.current = dismissEl;

      // Position helper: projects geo coords to screen and places the X at the golden orb
      const positionDismiss = () => {
        if (!dismissElRef.current || !selectedCoordsRef.current) return;
        const pt = map.project(selectedCoordsRef.current);
        // Center the X on the golden orb (button is 22×22px)
        dismissElRef.current.style.left = `${pt.x - 11}px`;
        dismissElRef.current.style.top = `${pt.y - 11}px`;
      };

      renderHandlerRef.current = positionDismiss;
      map.getCanvasContainer().appendChild(dismissEl);
      positionDismiss();
      map.on("render", positionDismiss);

      // Register as the active selection in the shared ref
      if (clearSelectionRef) {
        clearSelectionRef.current = clearSelection;
        ownsSelectionRef.current = true;
      }

      // Fly to the event with cinematic pitch
      map.flyTo({
        center: coords,
        zoom: Math.max(map.getZoom(), 15),
        pitch: 55,
        duration: 1500,
      });

      // Start gentle orbit after camera arrives
      map.once("moveend", () => {
        if (!isSelectedRef.current) return;

        let lastTime = performance.now();
        const ORBIT_SPEED = 2; // degrees per second

        const orbit = (now: number) => {
          if (!isSelectedRef.current) return;
          const dt = (now - lastTime) / 1000;
          lastTime = now;
          const bearing = map.getBearing() + ORBIT_SPEED * dt;
          map.easeTo({ bearing, duration: 0, animate: false });
          orbitFrameRef.current = requestAnimationFrame(orbit);
        };

        orbitFrameRef.current = requestAnimationFrame(orbit);

        // Stop orbit on user interaction (but keep selection)
        const pauseOrbit = () => {
          stopOrbit();
          map.off("mousedown", pauseOrbit);
          map.off("touchstart", pauseOrbit);
          map.off("wheel", pauseOrbit);
        };

        map.on("mousedown", pauseOrbit);
        map.on("touchstart", pauseOrbit);
        map.on("wheel", pauseOrbit);
      });
    };

    // ── Click on empty map area: clear any selection (popup or show-on-map) ──
    const handleMapClick = (e: maplibregl.MapMouseEvent) => {
      const hasAnySelection = isSelectedRef.current || clearSelectionRef?.current;
      if (!hasAnySelection) return;

      // Check if click was on the events layer — if so, handleClick handles it
      const features = map.queryRenderedFeatures(e.point, { layers: ["events-layer"] });
      if (features.length > 0) return;

      // Clear via shared ref (covers both popup and show-on-map selections)
      if (clearSelectionRef?.current) {
        clearSelectionRef.current();
      } else {
        clearSelection();
      }
    };

    map.on("mousemove", "events-layer", handleMouseMove);
    map.on("mouseleave", "events-layer", handleMouseLeave);
    map.on("click", "events-layer", handleClick);
    map.on("click", handleMapClick);

    return () => {
      map.off("mousemove", "events-layer", handleMouseMove);
      map.off("mouseleave", "events-layer", handleMouseLeave);
      map.off("click", "events-layer", handleClick);
      map.off("click", handleMapClick);
      stopOrbit();
      removeHoverCard(map);
      deselectEventHighlight(map);
      removeDismissButton();
    };
  }, [map, clearSelection, clearSelectionRef, stopOrbit, removeDismissButton]);

  return null;
}
