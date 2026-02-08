/**
 * @module components/map/map-isochrone
 * Renders isochrone polygons on the map as fill layers with decreasing opacity.
 * Events outside the outermost polygon are dimmed via marker opacity adjustment.
 */

"use client";

import { useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "./use-map";
import type { IsochroneResult } from "@/lib/map/isochrone";
import type { EventEntry, EventCategory } from "@/lib/registries/types";

/** Source and layer IDs for isochrone overlays. */
const ISO_SOURCE = "isochrone-source";
const ISO_FILL = "isochrone-fill";
const ISO_OUTLINE = "isochrone-outline";

interface MapIsochroneProps {
  /** Isochrone result to render, or null to clear. */
  result: IsochroneResult | null;
  /** All events (for dimming those outside the polygon). */
  events: EventEntry[];
  /** Currently visible categories. */
  visibleCategories: Set<EventCategory>;
}

/** Renders isochrone travel-time polygons on the map. */
export function MapIsochrone({ result }: MapIsochroneProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const cleanup = () => {
      if (map.getLayer(ISO_FILL)) map.removeLayer(ISO_FILL);
      if (map.getLayer(ISO_OUTLINE)) map.removeLayer(ISO_OUTLINE);
      if (map.getSource(ISO_SOURCE)) map.removeSource(ISO_SOURCE);
    };

    if (!result) {
      cleanup();
      return;
    }

    // Add or update isochrone source
    if (!map.getSource(ISO_SOURCE)) {
      map.addSource(ISO_SOURCE, { type: "geojson", data: result.geojson });
    } else {
      (map.getSource(ISO_SOURCE) as maplibregl.GeoJSONSource).setData(result.geojson);
    }

    // Fill layer — gradient opacity based on time range
    if (!map.getLayer(ISO_FILL)) {
      map.addLayer(
        {
          id: ISO_FILL,
          type: "fill",
          source: ISO_SOURCE,
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "minutes"],
              5, "#3b82f6",
              10, "#6366f1",
              15, "#8b5cf6",
              30, "#a855f7",
            ] as unknown as maplibregl.ExpressionSpecification,
            "fill-opacity": [
              "interpolate",
              ["linear"],
              ["get", "minutes"],
              5, 0.25,
              30, 0.08,
            ] as unknown as maplibregl.ExpressionSpecification,
          },
        },
        // Insert below event marker layers
        "events-outer-glow",
      );
    }

    // Outline layer
    if (!map.getLayer(ISO_OUTLINE)) {
      map.addLayer(
        {
          id: ISO_OUTLINE,
          type: "line",
          source: ISO_SOURCE,
          paint: {
            "line-color": [
              "interpolate",
              ["linear"],
              ["get", "minutes"],
              5, "#3b82f6",
              30, "#a855f7",
            ] as unknown as maplibregl.ExpressionSpecification,
            "line-width": 2,
            "line-opacity": 0.6,
          },
        },
        "events-outer-glow",
      );
    }

    return cleanup;
  }, [map, result]);

  return null;
}
