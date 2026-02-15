/**
 * @module components/map/data-layers/map-traffic-layer
 * Headless component that renders TomTom traffic incidents as line overlays.
 * Requires NEXT_PUBLIC_TOMTOM_API_KEY. Polls every 2 minutes.
 * Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";

/** Source and layer IDs. */
const TRAFFIC_SOURCE = "traffic-source";
const TRAFFIC_LINE = "traffic-line";

/** Props for {@link MapTrafficLayer}. */
interface MapTrafficLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Renders TomTom traffic incidents as colored line overlays. */
export function MapTrafficLayer({ active, onDataReady, onLoadingChange }: MapTrafficLayerProps) {
  const map = useMap();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;

  useEffect(() => {
    if (!map) return;

    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (map.getLayer(TRAFFIC_LINE)) map.removeLayer(TRAFFIC_LINE);
      if (map.getSource(TRAFFIC_SOURCE)) map.removeSource(TRAFFIC_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    const fetchAndRender = (isInitial: boolean) => {
      if (isInitial) onLoadingChangeRef.current?.(true);

      fetch("/api/layers/traffic")
        .then((res) => res.json())
        .then((data: { incidents: Array<Record<string, unknown>>; error?: string }) => {
          if (data.error) {
            console.warn("[Traffic]", data.error);
          }
          if (!map.getStyle()) return;

          // TomTom incidents have geometry.coordinates as LineString arrays
          const features = data.incidents
            .filter((inc) => {
              const geom = inc.geometry as { coordinates?: unknown } | undefined;
              return geom?.coordinates;
            })
            .map((inc, i) => ({
              type: "Feature" as const,
              geometry: inc.geometry as GeoJSON.Geometry,
              properties: {
                id: `traffic-${i}`,
                delay: ((inc.properties as Record<string, unknown>)?.magnitudeOfDelay as number) ?? 0,
              },
            }));

          const geojson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features,
          };

          if (!map.getSource(TRAFFIC_SOURCE)) {
            map.addSource(TRAFFIC_SOURCE, { type: "geojson", data: geojson });
          } else {
            (map.getSource(TRAFFIC_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
          }

          if (!map.getLayer(TRAFFIC_LINE)) {
            map.addLayer({
              id: TRAFFIC_LINE,
              type: "line",
              source: TRAFFIC_SOURCE,
              paint: {
                "line-color": [
                  "interpolate", ["linear"], ["get", "delay"],
                  0, "#22c55e",
                  1, "#eab308",
                  2, "#f97316",
                  3, "#ef4444",
                  4, "#dc2626",
                ] as unknown as maplibregl.ExpressionSpecification,
                "line-width": [
                  "interpolate", ["linear"], ["zoom"],
                  8, 2, 14, 6,
                ] as unknown as maplibregl.ExpressionSpecification,
                "line-opacity": 0.7,
              },
              layout: { "line-cap": "round", "line-join": "round" },
            });
          }

          if (isInitial) onDataReadyRef.current?.(data);
        })
        .catch((err) => {
          console.error("[Traffic] Fetch failed:", err);
        })
        .finally(() => {
          if (isInitial) onLoadingChangeRef.current?.(false);
        });
    };

    fetchAndRender(true);
    intervalRef.current = setInterval(() => fetchAndRender(false), 2 * 60 * 1000);

    return cleanup;
  }, [map, active]);

  return null;
}
