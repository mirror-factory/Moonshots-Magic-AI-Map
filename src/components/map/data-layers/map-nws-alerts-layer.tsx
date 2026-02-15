/**
 * @module components/map/data-layers/map-nws-alerts-layer
 * Headless component that renders NWS weather alerts as colored polygon overlays.
 * Polls every 5 minutes. Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";

/** Source and layer IDs. */
const NWS_SOURCE = "nws-alerts-source";
const NWS_FILL = "nws-alerts-fill";
const NWS_OUTLINE = "nws-alerts-outline";

/** Props for {@link MapNwsAlertsLayer}. */
interface MapNwsAlertsLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Renders NWS weather alert polygons on the map. */
export function MapNwsAlertsLayer({ active, onDataReady, onLoadingChange }: MapNwsAlertsLayerProps) {
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
      if (map.getLayer(NWS_OUTLINE)) map.removeLayer(NWS_OUTLINE);
      if (map.getLayer(NWS_FILL)) map.removeLayer(NWS_FILL);
      if (map.getSource(NWS_SOURCE)) map.removeSource(NWS_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    const fetchAndRender = (isInitial: boolean) => {
      if (isInitial) onLoadingChangeRef.current?.(true);

      fetch("/api/layers/nws-alerts")
        .then((res) => {
          if (!res.ok) throw new Error(`NWS API ${res.status}`);
          return res.json();
        })
        .then((data: { features: GeoJSON.Feature[]; alertCount: number }) => {
          if (!map.getStyle()) return;

          const geojson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: data.features.filter((f) => f.geometry),
          };

          if (!map.getSource(NWS_SOURCE)) {
            map.addSource(NWS_SOURCE, { type: "geojson", data: geojson });
          } else {
            (map.getSource(NWS_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
          }

          if (!map.getLayer(NWS_FILL)) {
            map.addLayer({
              id: NWS_FILL,
              type: "fill",
              source: NWS_SOURCE,
              paint: {
                "fill-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
                "fill-opacity": 0.2,
              },
            });
          }

          if (!map.getLayer(NWS_OUTLINE)) {
            map.addLayer({
              id: NWS_OUTLINE,
              type: "line",
              source: NWS_SOURCE,
              paint: {
                "line-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
                "line-width": 2,
                "line-opacity": 0.7,
              },
            });
          }

          if (isInitial) onDataReadyRef.current?.(data);
        })
        .catch((err) => {
          console.error("[NWS Alerts] Fetch failed:", err);
        })
        .finally(() => {
          if (isInitial) onLoadingChangeRef.current?.(false);
        });
    };

    fetchAndRender(true);
    intervalRef.current = setInterval(() => fetchAndRender(false), 5 * 60 * 1000);

    return cleanup;
  }, [map, active]);

  return null;
}
