/**
 * @module components/map/data-layers/map-county-data-layer
 * Headless component that renders Orange County GIS data (parks, trails, art, fire stations).
 * Fetched once (1hr cache on server). Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { addLayerHoverPopup } from "./layer-popup";

/** Source and layer IDs. */
const COUNTY_SOURCE = "county-data-source";
const COUNTY_GLOW = "county-data-glow";
const COUNTY_CIRCLES = "county-data-circles";
const COUNTY_LABELS = "county-data-labels";

/** County data point from the API. */
interface CountyPoint {
  id: string;
  category: string;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  icon: string;
}

/** Props for {@link MapCountyDataLayer}. */
interface MapCountyDataLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Renders Orange County GIS data as colored point markers. */
export function MapCountyDataLayer({ active, onDataReady, onLoadingChange }: MapCountyDataLayerProps) {
  const map = useMap();
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;

  useEffect(() => {
    if (!map) return;

    let cleanupPopup: (() => void) | null = null;

    const cleanup = () => {
      cleanupPopup?.();
      if (map.getLayer(COUNTY_LABELS)) map.removeLayer(COUNTY_LABELS);
      if (map.getLayer(COUNTY_CIRCLES)) map.removeLayer(COUNTY_CIRCLES);
      if (map.getLayer(COUNTY_GLOW)) map.removeLayer(COUNTY_GLOW);
      if (map.getSource(COUNTY_SOURCE)) map.removeSource(COUNTY_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    onLoadingChangeRef.current?.(true);

    fetch("/api/layers/county-data")
      .then((res) => {
        if (!res.ok) throw new Error(`County Data API ${res.status}`);
        return res.json();
      })
      .then((data: { points: CountyPoint[]; summary: Record<string, number> }) => {
        if (!map.getStyle()) return;

        const geojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: data.points.map((pt) => ({
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [pt.longitude, pt.latitude],
            },
            properties: {
              name: pt.name,
              category: pt.category,
              color: pt.color,
              icon: pt.icon,
            },
          })),
        };

        if (!map.getSource(COUNTY_SOURCE)) {
          map.addSource(COUNTY_SOURCE, { type: "geojson", data: geojson });
        } else {
          (map.getSource(COUNTY_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
        }

        if (!map.getLayer(COUNTY_GLOW)) {
          map.addLayer({
            id: COUNTY_GLOW,
            type: "circle",
            source: COUNTY_SOURCE,
            paint: {
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                8, 10, 14, 20,
              ] as unknown as maplibregl.ExpressionSpecification,
              "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
              "circle-opacity": 0.15,
              "circle-blur": 0.5,
            },
          });
        }

        if (!map.getLayer(COUNTY_CIRCLES)) {
          map.addLayer({
            id: COUNTY_CIRCLES,
            type: "circle",
            source: COUNTY_SOURCE,
            paint: {
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                8, 4, 14, 8,
              ] as unknown as maplibregl.ExpressionSpecification,
              "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
              "circle-opacity": 0.85,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#ffffff",
              "circle-stroke-opacity": 0.4,
            },
          });
        }

        if (!map.getLayer(COUNTY_LABELS)) {
          map.addLayer({
            id: COUNTY_LABELS,
            type: "symbol",
            source: COUNTY_SOURCE,
            layout: {
              "text-field": ["get", "name"] as unknown as maplibregl.ExpressionSpecification,
              "text-size": 10,
              "text-offset": [0, 1.4] as [number, number],
              "text-anchor": "top",
              "text-font": ["Open Sans Regular"],
              "text-allow-overlap": false,
            },
            paint: {
              "text-color": "rgba(255, 255, 255, 0.7)",
              "text-halo-color": "rgba(0, 0, 0, 0.8)",
              "text-halo-width": 1,
            },
          });
        }

        // Hover popup on county data points
        cleanupPopup = addLayerHoverPopup(map, COUNTY_CIRCLES, (p) =>
          `<div class="dl-title">${p.name ?? "Unknown"}</div>` +
          `<div class="dl-badge" style="background:${String(p.color)};color:#fff">${p.category ?? ""}</div>`,
        );

        onDataReadyRef.current?.(data);
      })
      .catch((err) => {
        console.error("[County Data] Fetch failed:", err);
      })
      .finally(() => {
        onLoadingChangeRef.current?.(false);
      });

    return cleanup;
  }, [map, active]);

  return null;
}
