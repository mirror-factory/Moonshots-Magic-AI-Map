/**
 * @module components/map/map-markers
 * Renders event data as a GeoJSON multi-layer neon orb stack on the map.
 * Manages the MapLibre source/layer lifecycle and applies category visibility filters.
 *
 * Layer stack (bottom → top):
 * 1. `events-outer-glow` — Large radius, heavy blur, very low opacity (ambient halo)
 * 2. `events-glow-layer` — Medium blur, medium opacity (visible glow)
 * 3. `events-layer`      — Core dot, full opacity, no stroke (click target)
 * 4. `events-center-dot`  — Tiny white center, slight blur (lit-from-within)
 */

"use client";

import { useEffect } from "react";
import { useMap } from "./use-map";
import { eventsToGeoJSON } from "@/lib/map/geojson";
import { CATEGORY_COLORS } from "@/lib/map/config";
import type { EventEntry, EventCategory } from "@/lib/registries/types";
import type maplibregl from "maplibre-gl";

/** All marker layer IDs in render order. */
const MARKER_LAYERS = [
  "events-outer-glow",
  "events-glow-layer",
  "events-layer",
  "events-center-dot",
] as const;

/** Featured-event extra glow layer ID. */
const FEATURED_GLOW = "featured-glow-layer";

interface MapMarkersProps {
  events: EventEntry[];
  visibleCategories: Set<EventCategory>;
  styleLoaded: boolean;
  isDark?: boolean;
}

/** Renders events as a 4-layer neon orb stack with category-based colors. */
export function MapMarkers({ events, visibleCategories, styleLoaded }: MapMarkersProps) {
  const map = useMap();

  // Track hovered feature for featureState-based glow
  useEffect(() => {
    if (!map || !styleLoaded) return;

    let hoveredId: string | number | null = null;

    const onMouseMove = (e: maplibregl.MapLayerMouseEvent) => {
      if (!e.features?.length) return;
      const feature = e.features[0];
      const id = feature.id;
      if (id === undefined || id === null) return;

      if (hoveredId !== null && hoveredId !== id) {
        map.setFeatureState({ source: "events", id: hoveredId }, { hover: false });
      }
      hoveredId = id;
      map.setFeatureState({ source: "events", id }, { hover: true });
    };

    const onMouseLeave = () => {
      if (hoveredId !== null) {
        map.setFeatureState({ source: "events", id: hoveredId }, { hover: false });
        hoveredId = null;
      }
    };

    map.on("mousemove", "events-layer", onMouseMove);
    map.on("mouseleave", "events-layer", onMouseLeave);

    return () => {
      map.off("mousemove", "events-layer", onMouseMove);
      map.off("mouseleave", "events-layer", onMouseLeave);
    };
  }, [map, styleLoaded]);

  useEffect(() => {
    if (!map || !styleLoaded) return;

    const addLayers = () => {
      const geojson = eventsToGeoJSON(events);

      // Add or update source (promoteId enables featureState hover)
      if (map.getSource("events")) {
        (map.getSource("events") as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource("events", { type: "geojson", data: geojson, promoteId: "id" });
      }

      // Skip if core layer already exists (style.load re-entry)
      if (map.getLayer("events-layer")) {
        applyFilters();
        return;
      }

      // Build color expression from category colors
      const colorEntries = Object.entries(CATEGORY_COLORS).flatMap(([cat, color]) => [cat, color]);
      const colorExpr = [
        "match",
        ["get", "category"],
        ...colorEntries,
        "#888888",
      ] as unknown as maplibregl.ExpressionSpecification;

      // Hover-aware radius/opacity expressions
      const hoverState = ["boolean", ["feature-state", "hover"], false] as unknown as maplibregl.ExpressionSpecification;

      // 1. Outer glow — ambient halo (expands on hover)
      map.addLayer({
        id: "events-outer-glow",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": [
            "case", hoverState,
            ["interpolate", ["linear"], ["zoom"], 8, 28, 12, 48, 16, 70],
            ["interpolate", ["linear"], ["zoom"], 8, 18, 12, 32, 16, 50],
          ] as unknown as maplibregl.ExpressionSpecification,
          "circle-color": colorExpr,
          "circle-opacity": ["case", hoverState, 0.25, 0.12] as unknown as maplibregl.ExpressionSpecification,
          "circle-blur": 1.5,
        },
      });

      // 2. Visible glow (brightens on hover)
      map.addLayer({
        id: "events-glow-layer",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": [
            "case", hoverState,
            ["interpolate", ["linear"], ["zoom"], 8, 16, 12, 26, 16, 40],
            ["interpolate", ["linear"], ["zoom"], 8, 10, 12, 18, 16, 28],
          ] as unknown as maplibregl.ExpressionSpecification,
          "circle-color": colorExpr,
          "circle-opacity": ["case", hoverState, 0.55, 0.35] as unknown as maplibregl.ExpressionSpecification,
          "circle-blur": 0.8,
        },
      });

      // Featured event extra glow — larger, brighter
      map.addLayer({
        id: FEATURED_GLOW,
        type: "circle",
        source: "events",
        filter: ["==", ["get", "featured"], true],
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 28, 12, 48, 16, 70],
          "circle-color": colorExpr,
          "circle-opacity": 0.25,
          "circle-blur": 1.2,
        },
      });

      // 3. Core dot — click target
      map.addLayer({
        id: "events-layer",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 4, 12, 8, 16, 13],
          "circle-color": colorExpr,
          "circle-opacity": 1.0,
        },
      });

      // 4. White center dot — lit-from-within
      map.addLayer({
        id: "events-center-dot",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 12, 3, 16, 5],
          "circle-color": "#ffffff",
          "circle-opacity": 0.85,
          "circle-blur": 0.3,
        },
      });

      applyFilters();
    };

    const applyFilters = () => {
      const filterExpr: maplibregl.ExpressionFilterSpecification = [
        "in",
        ["get", "category"],
        ["literal", [...visibleCategories]],
      ];

      for (const layerId of MARKER_LAYERS) {
        if (map.getLayer(layerId)) {
          map.setFilter(layerId, filterExpr);
        }
      }

      if (map.getLayer(FEATURED_GLOW)) {
        map.setFilter(FEATURED_GLOW, [
          "all",
          ["==", ["get", "featured"], true],
          filterExpr,
        ] as unknown as maplibregl.ExpressionFilterSpecification);
      }
    };

    addLayers();

    map.on("style.load", addLayers);

    return () => {
      map.off("style.load", addLayers);
    };
  }, [map, events, visibleCategories, styleLoaded]);

  return null;
}
