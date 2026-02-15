/**
 * @module components/map/data-layers/map-opd-calls-layer
 * Headless component that renders OPD calls for service as colored circle markers.
 * Polls every 5 minutes. Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { addLayerHoverPopup } from "./layer-popup";

/** Source and layer IDs. */
const OPD_SOURCE = "opd-calls-source";
const OPD_GLOW = "opd-calls-glow";
const OPD_CIRCLES = "opd-calls-circles";

/** OPD call point from the API. */
interface OpdCall {
  id: string;
  type: string;
  address: string;
  datetime: string;
  latitude: number;
  longitude: number;
  color: string;
}

/** Props for {@link MapOpdCallsLayer}. */
interface MapOpdCallsLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Renders OPD calls for service as animated circle markers. */
export function MapOpdCallsLayer({ active, onDataReady, onLoadingChange }: MapOpdCallsLayerProps) {
  const map = useMap();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;

  useEffect(() => {
    if (!map) return;

    let cleanupPopup: (() => void) | null = null;

    const cleanup = () => {
      cleanupPopup?.();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (map.getLayer(OPD_CIRCLES)) map.removeLayer(OPD_CIRCLES);
      if (map.getLayer(OPD_GLOW)) map.removeLayer(OPD_GLOW);
      if (map.getSource(OPD_SOURCE)) map.removeSource(OPD_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    const fetchAndRender = (isInitial: boolean) => {
      if (isInitial) onLoadingChangeRef.current?.(true);

      fetch("/api/layers/opd-calls")
        .then((res) => {
          if (!res.ok) throw new Error(`OPD API ${res.status}`);
          return res.json();
        })
        .then((data: { calls: OpdCall[]; callCount: number }) => {
          if (!map.getStyle()) return;

          const geojson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: data.calls.map((call) => ({
              type: "Feature" as const,
              geometry: {
                type: "Point" as const,
                coordinates: [call.longitude, call.latitude],
              },
              properties: {
                id: call.id,
                type: call.type,
                color: call.color,
                address: call.address,
              },
            })),
          };

          if (!map.getSource(OPD_SOURCE)) {
            map.addSource(OPD_SOURCE, { type: "geojson", data: geojson });
          } else {
            (map.getSource(OPD_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
          }

          if (!map.getLayer(OPD_GLOW)) {
            map.addLayer({
              id: OPD_GLOW,
              type: "circle",
              source: OPD_SOURCE,
              paint: {
                "circle-radius": [
                  "interpolate", ["linear"], ["zoom"],
                  8, 12, 14, 24,
                ] as unknown as maplibregl.ExpressionSpecification,
                "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
                "circle-opacity": 0.2,
                "circle-blur": 0.6,
              },
            });
          }

          if (!map.getLayer(OPD_CIRCLES)) {
            map.addLayer({
              id: OPD_CIRCLES,
              type: "circle",
              source: OPD_SOURCE,
              paint: {
                "circle-radius": [
                  "interpolate", ["linear"], ["zoom"],
                  8, 4, 14, 8,
                ] as unknown as maplibregl.ExpressionSpecification,
                "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
                "circle-opacity": 0.85,
                "circle-stroke-width": 1.5,
                "circle-stroke-color": "#ffffff",
                "circle-stroke-opacity": 0.5,
              },
            });
          }

          // Hover popup
          if (!cleanupPopup) {
            cleanupPopup = addLayerHoverPopup(map, OPD_CIRCLES, (p) =>
              `<div class="dl-title">${p.type ?? "Call"}</div>` +
              `<div class="dl-subtitle">${p.address ?? ""}</div>`,
            );
          }

          if (isInitial) onDataReadyRef.current?.(data);
        })
        .catch((err) => {
          console.error("[OPD Calls] Fetch failed:", err);
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
