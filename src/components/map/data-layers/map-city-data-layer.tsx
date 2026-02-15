/**
 * @module components/map/data-layers/map-city-data-layer
 * Headless component rendering Orlando city data (code enforcement) as
 * red dot markers with glow. Auto-zooms to fit all points and starts
 * auto-rotation on activation.
 * Returns null — manages MapLibre sources/layers via useEffect.
 * Card UI is rendered by the unified DataLayerInfoPanel.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { fitBoundsToPoints } from "@/lib/map/camera-utils";
import { startDataLayerRotation, stopDataLayerRotation } from "./layer-rotation";

// ── Layer IDs ────────────────────────────────────────────────────────
const CITY_SOURCE = "city-data-source";
const CITY_HEATMAP = "city-data-heatmap";
const CITY_GLOW = "city-data-glow";
const CITY_CIRCLES = "city-data-circles";
const CITY_LABELS = "city-data-labels";

/** City data point from the API. */
interface CityDataPoint {
  id: string;
  type: string;
  title: string;
  description: string;
  address: string;
  date: string;
  latitude: number;
  longitude: number;
  color: string;
}

/** Summary from the API. */
interface CityDataSummary {
  codeEnforcement: number;
  commercialPermits: number;
  residentialPermits: number;
  total: number;
}

/** Props for {@link MapCityDataLayer}. */
interface MapCityDataLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when city data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Headless component rendering Orlando city data as heatmap + markers on the map. */
export function MapCityDataLayer({
  active,
  onDataReady,
  onLoadingChange,
}: MapCityDataLayerProps) {
  const map = useMap();
  const fetchedRef = useRef(false);
  const cachedCoordsRef = useRef<[number, number][]>([]);
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;

  useEffect(() => {
    if (!map) return;

    // Cancelled flag prevents orphaned fitBounds promises from starting
    // rotation after this effect has cleaned up (e.g. when switching layers).
    let cancelled = false;

    const cleanup = () => {
      cancelled = true;
      stopDataLayerRotation();
      // Stop any in-progress camera animation so moveend fires immediately
      try { map.stop(); } catch { /* map may be disposed */ }
      for (const id of [CITY_LABELS, CITY_CIRCLES, CITY_GLOW, CITY_HEATMAP]) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      if (map.getSource(CITY_SOURCE)) map.removeSource(CITY_SOURCE);
    };

    if (!active) {
      cleanup();
      fetchedRef.current = false;
      return;
    }

    // Re-activation with cached data — just zoom + rotate
    if (fetchedRef.current) {
      if (cachedCoordsRef.current.length > 0) {
        void fitBoundsToPoints(map, cachedCoordsRef.current, {
          padding: { top: 120, bottom: 200, left: 120, right: 120 },
          maxZoom: 14,
          duration: 1800,
        }).then(() => {
          if (!cancelled) startDataLayerRotation(map);
        });
      }
      return cleanup;
    }

    onLoadingChangeRef.current?.(true);
    fetchedRef.current = true;

    fetch("/api/layers/city-data")
      .then((res) => {
        if (!res.ok) throw new Error(`City data API ${res.status}`);
        return res.json();
      })
      .then(
        (data: { points: CityDataPoint[]; summary: CityDataSummary }) => {
          if (!map.getStyle()) return;

          const features = data.points.map((point) => ({
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [point.longitude, point.latitude],
            },
            properties: {
              id: point.id,
              type: point.type,
              title: point.title,
              description: point.description,
              address: point.address,
              date: point.date,
              color: point.color,
            },
          }));

          const geojson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features,
          };

          // Add source
          if (!map.getSource(CITY_SOURCE)) {
            map.addSource(CITY_SOURCE, { type: "geojson", data: geojson });
          } else {
            (map.getSource(CITY_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
          }

          // ── Red glow behind dots (all zoom levels) ──
          if (!map.getLayer(CITY_GLOW)) {
            map.addLayer({
              id: CITY_GLOW,
              type: "circle",
              source: CITY_SOURCE,
              paint: {
                "circle-radius": [
                  "interpolate", ["linear"], ["zoom"],
                  8, 6,
                  12, 12,
                  16, 20,
                ] as unknown as maplibregl.ExpressionSpecification,
                "circle-color": "#EF4444",
                "circle-opacity": 0.25,
                "circle-blur": 0.8,
              },
            });
          }

          // ── Red dot markers (all zoom levels) ──
          if (!map.getLayer(CITY_CIRCLES)) {
            map.addLayer({
              id: CITY_CIRCLES,
              type: "circle",
              source: CITY_SOURCE,
              paint: {
                "circle-radius": [
                  "interpolate", ["linear"], ["zoom"],
                  8, 3,
                  12, 5,
                  16, 8,
                ] as unknown as maplibregl.ExpressionSpecification,
                "circle-color": "#EF4444",
                "circle-opacity": 0.9,
                "circle-stroke-width": 1,
                "circle-stroke-color": "rgba(255, 255, 255, 0.5)",
              },
            });
          }

          // ── Labels (visible at street level) ──
          if (!map.getLayer(CITY_LABELS)) {
            map.addLayer({
              id: CITY_LABELS,
              type: "symbol",
              source: CITY_SOURCE,
              minzoom: 15,
              layout: {
                "text-field": ["get", "title"] as unknown as maplibregl.ExpressionSpecification,
                "text-size": 10,
                "text-offset": [0, 1.4] as [number, number],
                "text-anchor": "top",
                "text-font": ["Open Sans Bold"],
                "text-max-width": 10,
              },
              paint: {
                "text-color": "#EF4444",
                "text-halo-color": "rgba(0, 0, 0, 0.8)",
                "text-halo-width": 1.5,
                "text-opacity": 0.8,
              },
            });
          }

          // Auto-zoom to fit all enforcement points + start rotation
          if (data.points.length > 0) {
            const coords = data.points.map(
              (p) => [p.longitude, p.latitude] as [number, number],
            );
            cachedCoordsRef.current = coords;
            void fitBoundsToPoints(map, coords, {
              padding: { top: 120, bottom: 200, left: 120, right: 120 },
              maxZoom: 14,
              duration: 1800,
            }).then(() => {
              if (!cancelled) startDataLayerRotation(map);
            });
          }

          onDataReadyRef.current?.(data);
        },
      )
      .catch((err) => {
        console.error("[CityData] Fetch failed:", err);
      })
      .finally(() => {
        onLoadingChangeRef.current?.(false);
      });

    return cleanup;
  }, [map, active]);

  return null;
}
