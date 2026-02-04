/**
 * @module components/map/map-container
 * Root map component. Initializes a MapLibre GL instance, provides it via
 * {@link MapContext}, and composes child map layers (markers, popups, controls).
 */

"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapContext } from "./use-map";
import {
  MAP_STYLES,
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

interface MapContainerProps {
  events: EventEntry[];
  onAskAbout?: (eventTitle: string) => void;
  children?: ReactNode;
}

/** Renders the root map with MapLibre GL and composes child layers. */
export function MapContainer({ events, onAskAbout, children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Set<EventCategory>>(
    () => new Set(EVENT_CATEGORIES),
  );

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLES.darkMatter,
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

    setMap(instance);

    return () => {
      instance.remove();
    };
  }, []);

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
          eventCount={events.length}
        />

        <MapMarkers events={events} visibleCategories={visibleCategories} />
        <MapPopups onAskAbout={onAskAbout} />
        <MapStatusBar />

        {children}
      </div>
    </MapContext>
  );
}
