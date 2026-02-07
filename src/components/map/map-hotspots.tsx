/**
 * @module components/map/map-hotspots
 * MapLibre heatmap layer that renders event density as glowing hot spots.
 * Uses event coordinates to create a heatmap below the marker layers.
 */

"use client";

import { useEffect } from "react";
import { useMap } from "./use-map";
import type { EventEntry } from "@/lib/registries/types";
import type maplibregl from "maplibre-gl";

const HEATMAP_SOURCE = "events-heatmap";
const HEATMAP_LAYER = "events-heatmap-layer";

interface MapHotspotsProps {
  /** Events to render as heatmap. */
  events: EventEntry[];
  /** Whether the map style is loaded. */
  styleLoaded: boolean;
  /** Whether dark mode is active. */
  isDark?: boolean;
}

/** Renders event density as a MapLibre heatmap layer. */
export function MapHotspots({ events, styleLoaded, isDark = false }: MapHotspotsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !styleLoaded) return;

    const opacity = isDark ? 0.3 : 0.15;

    const addHeatmap = () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: events.map((e) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: e.coordinates },
          properties: { featured: e.featured ? 1 : 0 },
        })),
      };

      if (map.getSource(HEATMAP_SOURCE)) {
        (map.getSource(HEATMAP_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(HEATMAP_SOURCE, { type: "geojson", data: geojson });
      }

      if (!map.getLayer(HEATMAP_LAYER)) {
        // Insert below glow layer if it exists, otherwise add on top
        const beforeLayer = map.getLayer("events-glow-layer") ? "events-glow-layer" : undefined;

        map.addLayer(
          {
            id: HEATMAP_LAYER,
            type: "heatmap",
            source: HEATMAP_SOURCE,
            paint: {
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "featured"],
                0, 0.5,
                1, 1,
              ],
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 0.3,
                14, 1,
              ],
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 15,
                10, 30,
                14, 60,
              ],
              "heatmap-opacity": opacity,
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(0, 0, 0, 0)",
                0.2, "rgba(53, 96, 255, 0.3)",
                0.4, "rgba(53, 96, 255, 0.5)",
                0.6, "rgba(100, 140, 255, 0.6)",
                0.8, "rgba(150, 180, 255, 0.8)",
                1, "rgba(255, 255, 255, 0.9)",
              ],
            },
          },
          beforeLayer,
        );
      } else {
        map.setPaintProperty(HEATMAP_LAYER, "heatmap-opacity", opacity);
      }
    };

    addHeatmap();
    map.on("style.load", addHeatmap);

    return () => {
      map.off("style.load", addHeatmap);
    };
  }, [map, events, styleLoaded, isDark]);

  return null;
}
