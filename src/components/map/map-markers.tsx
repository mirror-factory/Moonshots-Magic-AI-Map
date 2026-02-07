/**
 * @module components/map/map-markers
 * Renders event data as a GeoJSON circle layer on the map. Manages the
 * MapLibre source/layer lifecycle and applies category visibility filters.
 */

"use client";

import { useEffect } from "react";
import { useMap } from "./use-map";
import { eventsToGeoJSON } from "@/lib/map/geojson";
import { CATEGORY_COLORS } from "@/lib/map/config";
import type { EventEntry, EventCategory } from "@/lib/registries/types";

interface MapMarkersProps {
  events: EventEntry[];
  visibleCategories: Set<EventCategory>;
  styleLoaded: boolean;
  isDark?: boolean;
}

/** Renders events as a GeoJSON circle layer with category-based colors. */
export function MapMarkers({ events, visibleCategories, styleLoaded, isDark = false }: MapMarkersProps) {
  const map = useMap();

  // Add source and layer when style is loaded
  useEffect(() => {
    if (!map || !styleLoaded) return;

    // Theme-aware stroke color: white in dark mode, dark gray in light mode
    const strokeColor = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(50, 50, 50, 0.8)";

    const addLayer = () => {
      const geojson = eventsToGeoJSON(events);

      // Always try to add/update - source might have been removed on style reload
      if (map.getSource("events")) {
        (map.getSource("events") as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource("events", { type: "geojson", data: geojson });
      }

      // Add layer if it doesn't exist
      if (!map.getLayer("events-layer")) {
        // Build color expression from category colors
        const colorEntries = Object.entries(CATEGORY_COLORS).flatMap(([cat, color]) => [cat, color]);
        const colorExpr = [
          "match",
          ["get", "category"],
          ...colorEntries,
          "#888888", // fallback
        ] as unknown as maplibregl.ExpressionSpecification;

        // Glow layer behind markers
        if (!map.getLayer("events-glow-layer")) {
          map.addLayer({
            id: "events-glow-layer",
            type: "circle",
            source: "events",
            paint: {
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 10,
                12, 21,
                16, 36,
              ],
              "circle-color": colorExpr,
              "circle-opacity": 0.3,
              "circle-blur": 0.8,
            },
          });
        }

        // Featured event extra glow
        if (!map.getLayer("featured-glow-layer")) {
          map.addLayer({
            id: "featured-glow-layer",
            type: "circle",
            source: "events",
            filter: ["==", ["get", "featured"], true],
            paint: {
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 20,
                12, 40,
                16, 60,
              ],
              "circle-color": colorExpr,
              "circle-opacity": 0.2,
              "circle-blur": 0.8,
            },
          });
        }

        map.addLayer({
          id: "events-layer",
          type: "circle",
          source: "events",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              8, 5,
              12, 9,
              16, 14,
            ],
            "circle-color": colorExpr,
            "circle-stroke-color": strokeColor,
            "circle-stroke-width": 2,
            "circle-opacity": 1.0,
          },
        });
      } else {
        // Update stroke color if layer exists (theme changed)
        map.setPaintProperty("events-layer", "circle-stroke-color", strokeColor);
      }

      // Apply category filter to all layers
      const filterExpr: maplibregl.ExpressionFilterSpecification = [
        "in",
        ["get", "category"],
        ["literal", [...visibleCategories]],
      ];
      map.setFilter("events-layer", filterExpr);
      if (map.getLayer("events-glow-layer")) {
        map.setFilter("events-glow-layer", filterExpr);
      }
      if (map.getLayer("featured-glow-layer")) {
        map.setFilter("featured-glow-layer", [
          "all",
          ["==", ["get", "featured"], true],
          filterExpr,
        ] as unknown as maplibregl.ExpressionFilterSpecification);
      }
    };

    // Add layer now since styleLoaded is true
    addLayer();

    // Re-add layer whenever style reloads (theme change, etc.)
    map.on("style.load", addLayer);

    return () => {
      map.off("style.load", addLayer);
    };
  }, [map, events, visibleCategories, styleLoaded, isDark]);

  return null;
}

// Need to import for the GeoJSONSource type
import type maplibregl from "maplibre-gl";
