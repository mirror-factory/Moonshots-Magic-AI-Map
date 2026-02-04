/**
 * @module components/map/map-container
 * Root map component. Initializes a MapLibre GL instance, provides it via
 * {@link MapContext}, and composes child map layers (markers, popups, controls).
 * Supports 3D terrain and buildings via OpenFreeMap (free, no API key).
 */

"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { useTheme } from "next-themes";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapContext } from "./use-map";
import {
  MAP_STYLES_BY_THEME,
  TERRAIN_SOURCE,
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

    // Add 3D terrain if MapTiler is configured
    instance.on("load", () => {
      if (TERRAIN_SOURCE) {
        instance.addSource("terrain", {
          type: "raster-dem",
          url: TERRAIN_SOURCE,
          tileSize: 256,
        });
        instance.setTerrain({ source: "terrain", exaggeration: 1.5 });
      }

      // Add 3D buildings layer
      add3DBuildings(instance, isDark);
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

    // Change style and restore view + 3D layers
    map.setStyle(newStyle);

    map.once("style.load", () => {
      // Restore view
      map.setCenter(center);
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setBearing(bearing);

      // Re-add terrain
      if (TERRAIN_SOURCE && !map.getSource("terrain")) {
        map.addSource("terrain", {
          type: "raster-dem",
          url: TERRAIN_SOURCE,
          tileSize: 256,
        });
        map.setTerrain({ source: "terrain", exaggeration: 1.5 });
      }

      // Re-add 3D buildings
      add3DBuildings(map, isDark);
    });
  }, [map, isDark]);

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

/**
 * Adds 3D building extrusions to the map.
 * Uses OpenFreeMap's OpenMapTiles-compatible source.
 */
function add3DBuildings(map: maplibregl.Map, isDark: boolean) {
  // Wait a tick for style to fully load sources
  setTimeout(() => {
    const style = map.getStyle();
    if (!style?.sources) return;

    // OpenFreeMap uses "openmaptiles" as the source name
    const buildingSource = Object.keys(style.sources).find(
      (name) => name === "openmaptiles" || name === "composite"
    );

    if (!buildingSource) return;
    if (map.getLayer("3d-buildings")) return;

    try {
      map.addLayer({
        id: "3d-buildings",
        source: buildingSource,
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": isDark ? "#1a1a24" : "#d1d5db",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            14.5,
            ["get", "render_height"],
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            14.5,
            ["get", "render_min_height"],
          ],
          "fill-extrusion-opacity": 0.7,
        },
      });
    } catch {
      // Building layer may not be available in all styles
    }
  }, 100);
}
