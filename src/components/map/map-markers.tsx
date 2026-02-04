/**
 * @module components/map/map-markers
 * Renders event data as a GeoJSON circle layer on the map. Manages the
 * MapLibre source/layer lifecycle and applies category visibility filters.
 */

"use client";

import { useEffect, useState } from "react";
import { useMap } from "./use-map";
import { eventsToGeoJSON } from "@/lib/map/geojson";
import { CATEGORY_COLORS } from "@/lib/map/config";
import type { EventEntry, EventCategory } from "@/lib/registries/types";

interface MapMarkersProps {
  events: EventEntry[];
  visibleCategories: Set<EventCategory>;
}

export function MapMarkers({ events, visibleCategories }: MapMarkersProps) {
  const map = useMap();
  const [loaded, setLoaded] = useState(false);

  // Add source and layer on mount
  useEffect(() => {
    if (!map) return;

    const addLayer = () => {
      const geojson = eventsToGeoJSON(events);

      if (map.getSource("events")) {
        (map.getSource("events") as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource("events", { type: "geojson", data: geojson });

        // Build color expression from category colors
        const colorEntries = Object.entries(CATEGORY_COLORS).flatMap(([cat, color]) => [cat, color]);
        const colorExpr = [
          "match",
          ["get", "category"],
          ...colorEntries,
          "#888888", // fallback
        ] as unknown as maplibregl.ExpressionSpecification;

        map.addLayer({
          id: "events-layer",
          type: "circle",
          source: "events",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              8, 4,
              12, 7,
              16, 12,
            ],
            "circle-color": colorExpr,
            "circle-stroke-color": "rgba(255, 255, 255, 0.8)",
            "circle-stroke-width": 1.5,
            "circle-opacity": 0.9,
          },
        });
      }

      setLoaded(true);
    };

    if (map.isStyleLoaded()) {
      addLayer();
    } else {
      map.on("load", addLayer);
    }

    return () => {
      map.off("load", addLayer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, events]);

  // Filter by visible categories
  useEffect(() => {
    if (!map || !loaded) return;

    const filterExpr: maplibregl.ExpressionFilterSpecification = [
      "in",
      ["get", "category"],
      ["literal", [...visibleCategories]],
    ];

    map.setFilter("events-layer", filterExpr);
  }, [map, loaded, visibleCategories]);

  return null;
}

// Need to import for the GeoJSONSource type
import type maplibregl from "maplibre-gl";
