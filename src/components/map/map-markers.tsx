/**
 * @module components/map/map-markers
 * Renders event data as a GeoJSON layer stack on the map.
 * Shows events matching the active date filter by default (today/weekend/week).
 * AI highlights override the filter when active.
 *
 * Layer stack (bottom → top):
 * 1. `events-glow-layer` — Soft glow behind each marker
 * 2. `events-layer`      — Core dot, full opacity (click target)
 * 3. `events-center-dot`  — Tiny white center (lit-from-within)
 */

"use client";

import { useEffect } from "react";
import { useMap } from "./use-map";
import { eventsToGeoJSON } from "@/lib/map/geojson";
import { CATEGORY_COLORS } from "@/lib/map/config";
import { playSfx } from "@/lib/audio/sound-effects";
import type { EventEntry } from "@/lib/registries/types";
import type maplibregl from "maplibre-gl";

/** All individual (unclustered) marker layer IDs in render order. */
const MARKER_LAYERS = [
  "events-glow-layer",
  "events-layer",
  "events-center-dot",
] as const;

/** Highlight pulse layer ID. */
const HIGHLIGHT_PULSE = "events-highlight-pulse";

/** Cluster layer IDs. */
const CLUSTER_CIRCLE = "events-cluster-circle";
const CLUSTER_COUNT = "events-cluster-count";

/** Filter that matches only unclustered points. */
const UNCLUSTERED_FILTER: maplibregl.ExpressionFilterSpecification =
  ["!", ["has", "point_count"]] as unknown as maplibregl.ExpressionFilterSpecification;

/** Filter that matches only cluster points. */
const CLUSTER_FILTER: maplibregl.ExpressionFilterSpecification =
  ["has", "point_count"] as unknown as maplibregl.ExpressionFilterSpecification;

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
      if (hoveredId !== id) {
        playSfx("markerHover");
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
      // Build GeoJSON with ONLY visible events so clusters count correctly
      const ids = visibleEventIds ?? [];
      const idSet = new Set(ids);
      const visibleEvents = ids.length > 0
        ? events.filter((e) => idSet.has(e.id))
        : [];
      const geojson = eventsToGeoJSON(visibleEvents);

      // Add or update source (promoteId enables featureState hover, cluster groups nearby points)
      if (map.getSource("events")) {
        (map.getSource("events") as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource("events", {
          type: "geojson",
          data: geojson,
          promoteId: "id",
          cluster: true,
          clusterMaxZoom: 13,
          clusterRadius: 50,
        });
      }

      // Skip if core layer already exists (style.load re-entry)
      if (map.getLayer("events-layer")) return;

      // --- Cluster layers ---
      const brandColorSolid = "#3560FF";

      // Cluster circle
      map.addLayer({
        id: CLUSTER_CIRCLE,
        type: "circle",
        source: "events",
        filter: CLUSTER_FILTER,
        paint: {
          "circle-radius": [
            "step", ["get", "point_count"],
            16, 5, 20, 15, 26, 30, 32,
          ],
          "circle-color": brandColorSolid,
          "circle-opacity": isDark ? 0.85 : 0.75,
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255, 255, 255, 0.5)",
        },
      });

      // Cluster count label
      map.addLayer({
        id: CLUSTER_COUNT,
        type: "symbol",
        source: "events",
        filter: CLUSTER_FILTER,
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 13,
          "text-font": ["Open Sans Bold"],
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#FFFFFF",
        },
      });

      // Click cluster to zoom in
      map.on("click", CLUSTER_CIRCLE, (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [CLUSTER_CIRCLE] });
        if (!features.length) return;
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource("events") as maplibregl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId).then((zoom) => {
          const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
          map.easeTo({ center: coords, zoom: zoom + 0.5, duration: 500 });
        });
      });

      // Cursor pointer on cluster hover
      map.on("mouseenter", CLUSTER_CIRCLE, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", CLUSTER_CIRCLE, () => { map.getCanvas().style.cursor = ""; });

      // --- Individual marker layers (only unclustered points) ---

      // Build color expression from category colors
      const colorEntries = Object.entries(CATEGORY_COLORS).flatMap(([cat, color]) => [cat, color]);
      const colorExpr = [
        "match",
        ["get", "category"],
        ...colorEntries,
        "#888888",
      ] as unknown as maplibregl.ExpressionSpecification;

      // Hover boolean from feature-state (set by mousemove/mouseleave handlers)
      const hoverBool = ["boolean", ["feature-state", "hover"], false] as unknown as maplibregl.ExpressionSpecification;

      // Helper: zoom-interpolated radius with hover scale.
      // MapLibre requires interpolate(zoom) as the OUTERMOST expression;
      // case/feature-state goes INSIDE at each zoom stop.
      const hoverRadius = (stops: [number, number, number], scale: number) =>
        [
          "interpolate", ["linear"], ["zoom"],
          8, ["case", hoverBool, stops[0] * scale, stops[0]],
          12, ["case", hoverBool, stops[1] * scale, stops[1]],
          16, ["case", hoverBool, stops[2] * scale, stops[2]],
        ] as unknown as maplibregl.ExpressionSpecification;

      // 1. Soft glow behind marker
      map.addLayer({
        id: "events-glow-layer",
        type: "circle",
        source: "events",
        filter: UNCLUSTERED_FILTER,
        paint: {
          "circle-radius": hoverRadius([8, 13, 18], 2),
          "circle-color": ["case", hoverBool, "#FFD700", colorExpr] as unknown as maplibregl.ExpressionSpecification,
          "circle-opacity": ["case", hoverBool, 0.7, isDark ? 0.4 : 0.25] as unknown as maplibregl.ExpressionSpecification,
          "circle-blur": 0.6,
        },
      });

      // 2. Core dot — click target
      map.addLayer({
        id: "events-layer",
        type: "circle",
        source: "events",
        filter: UNCLUSTERED_FILTER,
        paint: {
          "circle-radius": hoverRadius([4, 8, 13], 1.8),
          "circle-color": ["case", hoverBool, "#FFD700", colorExpr] as unknown as maplibregl.ExpressionSpecification,
          "circle-opacity": 1.0,
          "circle-stroke-width": ["case", hoverBool, 2, 0] as unknown as maplibregl.ExpressionSpecification,
          "circle-stroke-color": "#FFFFFF",
        },
      });

      // 3. White center dot — lit-from-within
      map.addLayer({
        id: "events-center-dot",
        type: "circle",
        source: "events",
        filter: UNCLUSTERED_FILTER,
        paint: {
          "circle-radius": hoverRadius([1.5, 3, 5], 1.5),
          "circle-color": "#ffffff",
          "circle-opacity": ["case", hoverBool, 1.0, 0.85] as unknown as maplibregl.ExpressionSpecification,
          "circle-blur": 0.3,
        },
      });
    };

    addLayers();

    map.on("style.load", addLayers);

    return () => {
      map.off("style.load", addLayers);
    };
  }, [map, events, visibleEventIds, styleLoaded, isDark]);

  return null;
}
