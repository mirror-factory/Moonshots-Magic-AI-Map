/**
 * @module components/map/map-markers
 * Renders event data as a GeoJSON multi-layer neon orb stack on the map.
 * Shows events matching the active date filter by default (today/weekend/week).
 * AI highlights override the filter when active.
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
import type { EventEntry } from "@/lib/registries/types";
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

/** Highlight pulse layer ID. */
const HIGHLIGHT_PULSE = "events-highlight-pulse";

/** Filter that matches nothing — hides all markers when no events match. */
const HIDE_ALL_FILTER: maplibregl.ExpressionFilterSpecification = ["==", ["get", "id"], ""];

interface MapMarkersProps {
  events: EventEntry[];
  styleLoaded: boolean;
  isDark?: boolean;
  /** Event IDs currently visible on the map (from date filter or AI highlights). */
  visibleEventIds?: string[];
  /** Event IDs currently highlighted by the AI chat (for glow effect). */
  highlightedEventIds?: string[];
}

/** Renders events as a 4-layer neon orb stack, filtered by visibleEventIds. */
export function MapMarkers({ events, styleLoaded, isDark, visibleEventIds, highlightedEventIds }: MapMarkersProps) {
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

  // AI-controlled highlighting: set featureState + pulse layer for highlighted markers
  useEffect(() => {
    if (!map || !styleLoaded || !map.getSource("events")) return;

    const isActive = highlightedEventIds && highlightedEventIds.length > 0;
    const highlightSet = new Set(highlightedEventIds ?? []);

    // Set feature state for highlighted events (for glow brightness)
    for (const event of events) {
      const isHighlighted = highlightSet.has(event.id);
      map.setFeatureState(
        { source: "events", id: event.id },
        {
          highlighted: isActive && isHighlighted,
          dimmed: false,
        },
      );
    }

    // Add or remove the highlight pulse layer
    if (isActive) {
      if (!map.getLayer(HIGHLIGHT_PULSE)) {
        const colorEntries = Object.entries(CATEGORY_COLORS).flatMap(([cat, color]) => [cat, color]);
        const colorExpr = ["match", ["get", "category"], ...colorEntries, "#888888"] as unknown as maplibregl.ExpressionSpecification;

        map.addLayer({
          id: HIGHLIGHT_PULSE,
          type: "circle",
          source: "events",
          filter: ["in", ["get", "id"], ["literal", highlightedEventIds!]],
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 14, 12, 24, 16, 34],
            "circle-color": colorExpr,
            "circle-opacity": 0.2,
            "circle-blur": 1.0,
          },
        });
      } else {
        map.setFilter(HIGHLIGHT_PULSE, ["in", ["get", "id"], ["literal", highlightedEventIds!]]);
      }
    } else if (map.getLayer(HIGHLIGHT_PULSE)) {
      map.removeLayer(HIGHLIGHT_PULSE);
    }
  }, [map, styleLoaded, highlightedEventIds, events]);

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

      // Hover and highlight aware expressions
      const hoverState = ["boolean", ["feature-state", "hover"], false] as unknown as maplibregl.ExpressionSpecification;
      const highlightedState = ["boolean", ["feature-state", "highlighted"], false] as unknown as maplibregl.ExpressionSpecification;

      // Compact glow — smaller, uniform radii so markers don't balloon.
      const outerRadius: maplibregl.ExpressionSpecification = isDark
        ? ["interpolate", ["linear"], ["zoom"], 8, 14, 12, 22, 16, 32]
        : ["interpolate", ["linear"], ["zoom"], 8, 10, 12, 18, 16, 26];
      const outerBlurBase = isDark ? 1.0 : 1.5;
      const outerBlurHover = isDark ? 0.8 : 1.2;
      const outerBase = isDark ? 0.25 : 0.1;
      const outerHover = isDark ? 0.45 : 0.25;
      const outerHighlight = isDark ? 0.55 : 0.35;

      const glowRadius: maplibregl.ExpressionSpecification = isDark
        ? ["interpolate", ["linear"], ["zoom"], 8, 8, 12, 14, 16, 20]
        : ["interpolate", ["linear"], ["zoom"], 8, 6, 12, 11, 16, 16];
      const glowBlurBase = isDark ? 0.5 : 0.8;
      const glowBlurHover = isDark ? 0.3 : 0.5;
      const glowBase = isDark ? 0.55 : 0.3;
      const glowHover = isDark ? 0.75 : 0.5;
      const glowHighlight = isDark ? 0.85 : 0.6;

      const featuredOpacity = isDark ? 0.3 : 0.15;
      const featuredBlur = isDark ? 1.0 : 1.3;

      // 1. Outer glow — ambient halo (brightens on hover/highlight)
      map.addLayer({
        id: "events-outer-glow",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": outerRadius,
          "circle-color": colorExpr,
          "circle-opacity": [
            "case",
            highlightedState, outerHighlight,
            hoverState, outerHover,
            outerBase,
          ] as unknown as maplibregl.ExpressionSpecification,
          "circle-blur": ["case", hoverState, outerBlurHover, outerBlurBase] as unknown as maplibregl.ExpressionSpecification,
        },
      });

      // 2. Visible glow (brightens on hover/highlight)
      map.addLayer({
        id: "events-glow-layer",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": glowRadius,
          "circle-color": colorExpr,
          "circle-opacity": [
            "case",
            highlightedState, glowHighlight,
            hoverState, glowHover,
            glowBase,
          ] as unknown as maplibregl.ExpressionSpecification,
          "circle-blur": ["case", hoverState, glowBlurHover, glowBlurBase] as unknown as maplibregl.ExpressionSpecification,
        },
      });

      // Featured event extra glow — larger, brighter
      map.addLayer({
        id: FEATURED_GLOW,
        type: "circle",
        source: "events",
        filter: ["==", ["get", "featured"], true],
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 16, 12, 26, 16, 36],
          "circle-color": colorExpr,
          "circle-opacity": featuredOpacity,
          "circle-blur": featuredBlur,
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
      const ids = visibleEventIds ?? [];
      const filterExpr: maplibregl.ExpressionFilterSpecification = ids.length > 0
        ? ["in", ["get", "id"], ["literal", ids]] as unknown as maplibregl.ExpressionFilterSpecification
        : HIDE_ALL_FILTER;

      for (const layerId of MARKER_LAYERS) {
        if (map.getLayer(layerId)) {
          map.setFilter(layerId, filterExpr);
        }
      }

      if (map.getLayer(FEATURED_GLOW)) {
        map.setFilter(
          FEATURED_GLOW,
          ids.length > 0
            ? ["all", ["==", ["get", "featured"], true], filterExpr] as unknown as maplibregl.ExpressionFilterSpecification
            : HIDE_ALL_FILTER,
        );
      }
    };

    addLayers();

    map.on("style.load", addLayers);

    return () => {
      map.off("style.load", addLayers);
    };
  }, [map, events, visibleEventIds, styleLoaded, isDark]);

  return null;
}
