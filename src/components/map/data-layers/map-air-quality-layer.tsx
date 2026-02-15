/**
 * @module components/map/data-layers/map-air-quality-layer
 * Headless component that renders EPA AQI monitoring data near Orlando.
 * Requires NEXT_PUBLIC_AIRNOW_API_KEY. 30-minute refresh.
 * Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { fitBoundsToPoints } from "@/lib/map/camera-utils";
import { startDataLayerRotation, stopDataLayerRotation } from "./layer-rotation";
import { addLayerHoverPopup } from "./layer-popup";

/** Source and layer IDs. */
const AQI_SOURCE = "air-quality-source";
const AQI_HEATMAP = "air-quality-heatmap";
const AQI_CIRCLES = "air-quality-circles";
const AQI_LABELS = "air-quality-labels";

/** AQI observation from the API. */
interface AqiObservation {
  parameter: string;
  aqi: number;
  category: string;
  color: string;
  latitude: number;
  longitude: number;
  area: string;
}

/** Props for {@link MapAirQualityLayer}. */
interface MapAirQualityLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Renders AQI data as colored circle markers with value labels. */
export function MapAirQualityLayer({ active, onDataReady, onLoadingChange }: MapAirQualityLayerProps) {
  const map = useMap();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;

  useEffect(() => {
    if (!map) return;

    let cleanupPopup: (() => void) | null = null;
    let cancelled = false;

    const cleanup = () => {
      cancelled = true;
      cleanupPopup?.();
      stopDataLayerRotation();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (map.getLayer(AQI_LABELS)) map.removeLayer(AQI_LABELS);
      if (map.getLayer(AQI_CIRCLES)) map.removeLayer(AQI_CIRCLES);
      if (map.getLayer(AQI_HEATMAP)) map.removeLayer(AQI_HEATMAP);
      if (map.getSource(AQI_SOURCE)) map.removeSource(AQI_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    const fetchAndRender = (isInitial: boolean) => {
      if (isInitial) onLoadingChangeRef.current?.(true);

      fetch("/api/layers/air-quality")
        .then((res) => res.json())
        .then((data: { observations: AqiObservation[]; error?: string }) => {
          if (data.error) {
            console.warn("[Air Quality]", data.error);
          }
          if (!map.getStyle() || !data.observations?.length) return;

          const geojson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: data.observations.map((obs) => ({
              type: "Feature" as const,
              geometry: {
                type: "Point" as const,
                coordinates: [obs.longitude, obs.latitude],
              },
              properties: {
                aqi: obs.aqi,
                parameter: obs.parameter,
                category: obs.category,
                color: obs.color,
                label: `AQI ${obs.aqi}`,
                area: obs.area,
              },
            })),
          };

          if (!map.getSource(AQI_SOURCE)) {
            map.addSource(AQI_SOURCE, { type: "geojson", data: geojson });
          } else {
            (map.getSource(AQI_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
          }

          // Large colored area circle
          if (!map.getLayer(AQI_HEATMAP)) {
            map.addLayer({
              id: AQI_HEATMAP,
              type: "circle",
              source: AQI_SOURCE,
              paint: {
                "circle-radius": [
                  "interpolate", ["linear"], ["zoom"],
                  6, 40, 12, 80,
                ] as unknown as maplibregl.ExpressionSpecification,
                "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
                "circle-opacity": 0.08,
                "circle-blur": 1,
              },
            });
          }

          // Core indicator dot
          if (!map.getLayer(AQI_CIRCLES)) {
            map.addLayer({
              id: AQI_CIRCLES,
              type: "circle",
              source: AQI_SOURCE,
              paint: {
                "circle-radius": [
                  "interpolate", ["linear"], ["zoom"],
                  6, 8, 12, 16,
                ] as unknown as maplibregl.ExpressionSpecification,
                "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
                "circle-opacity": 0.8,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
              },
            });
          }

          // AQI value labels
          if (!map.getLayer(AQI_LABELS)) {
            map.addLayer({
              id: AQI_LABELS,
              type: "symbol",
              source: AQI_SOURCE,
              layout: {
                "text-field": ["get", "label"] as unknown as maplibregl.ExpressionSpecification,
                "text-size": 12,
                "text-offset": [0, 0] as [number, number],
                "text-anchor": "center",
                "text-font": ["Open Sans Bold"],
                "text-allow-overlap": true,
              },
              paint: {
                "text-color": "#ffffff",
                "text-halo-color": "rgba(0, 0, 0, 0.6)",
                "text-halo-width": 1.5,
              },
            });
          }

          // Hover popup on AQI circles
          if (!cleanupPopup) {
            cleanupPopup = addLayerHoverPopup(map, AQI_CIRCLES, (p) =>
              `<div class="dl-title">Air Quality: ${p.category ?? "Unknown"}</div>` +
              `<div class="dl-badge" style="background:${String(p.color)};color:#fff">AQI ${p.aqi ?? "N/A"}</div>` +
              `<div class="dl-subtitle">${p.parameter ?? ""} · ${p.area ?? ""}</div>`,
            );
          }

          // Fit to AQI stations and start rotation on initial load
          if (isInitial && data.observations?.length) {
            const coords = data.observations.map(
              (obs: AqiObservation) => [obs.longitude, obs.latitude] as [number, number],
            );
            void fitBoundsToPoints(map, coords, {
              padding: { top: 120, bottom: 200, left: 120, right: 120 },
              maxZoom: 11,
              duration: 1800,
            }).then(() => {
              if (!cancelled) startDataLayerRotation(map);
            });
          }

          if (isInitial) onDataReadyRef.current?.(data);
        })
        .catch((err) => {
          console.error("[Air Quality] Fetch failed:", err);
        })
        .finally(() => {
          if (isInitial) onLoadingChangeRef.current?.(false);
        });
    };

    fetchAndRender(true);
    intervalRef.current = setInterval(() => fetchAndRender(false), 30 * 60 * 1000);

    return cleanup;
  }, [map, active]);

  return null;
}
