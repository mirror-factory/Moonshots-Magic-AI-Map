/**
 * @module components/map/data-layers/map-transit-layer
 * Headless component that renders LYNX bus positions as circle markers.
 * Polls every 15 seconds for real-time updates.
 * Auto-zooms to fit all buses and starts auto-rotation on activation.
 * Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { fitBoundsToPoints } from "@/lib/map/camera-utils";
import { startDataLayerRotation, stopDataLayerRotation } from "./layer-rotation";
import { addLayerHoverPopup } from "./layer-popup";

/** Source and layer IDs for transit markers. */
const TRANSIT_SOURCE = "transit-buses-source";
/** Outer glow layer ID — exported so shapes layer can insert before it. */
export const TRANSIT_GLOW = "transit-buses-glow";
/** Core circle layer ID — exported so shapes layer can insert before it. */
export const TRANSIT_CIRCLES = "transit-buses-circles";
const TRANSIT_LABELS = "transit-buses-labels";

/** LYNX brand color. */
const LYNX_COLOR = "#0077C8";
/** Bright glow accent. */
const LYNX_GLOW = "#00AAFF";

/** Module-level animation frame for transit pulse. */
let transitPulseFrame: number | null = null;

/** Starts a continuous pulse animation on transit bus markers + labels. */
function startTransitPulse(map: maplibregl.Map) {
  stopTransitPulse();
  const t0 = performance.now();

  const animate = () => {
    if (!map.getStyle()) { transitPulseFrame = null; return; }
    const t = (performance.now() - t0) / 1000;
    const p = Math.sin(t * 2) * 0.5 + 0.5; // 0→1 ~1Hz

    if (map.getLayer(TRANSIT_GLOW)) {
      map.setPaintProperty(TRANSIT_GLOW, "circle-opacity", 0.1 + p * 0.25);
      map.setPaintProperty(TRANSIT_GLOW, "circle-radius",
        ["interpolate", ["linear"], ["zoom"],
          8, 10 + p * 5,
          12, 18 + p * 8,
          16, 28 + p * 10,
        ] as unknown as maplibregl.ExpressionSpecification,
      );
    }
    if (map.getLayer(TRANSIT_LABELS)) {
      map.setPaintProperty(TRANSIT_LABELS, "text-halo-width", 1.5 + p * 1.5);
    }

    transitPulseFrame = requestAnimationFrame(animate);
  };

  transitPulseFrame = requestAnimationFrame(animate);
}

/** Stops the transit pulse animation. */
function stopTransitPulse() {
  if (transitPulseFrame !== null) {
    cancelAnimationFrame(transitPulseFrame);
    transitPulseFrame = null;
  }
}

/** Bus position from the API. */
interface BusPosition {
  vehicleId: string;
  routeId: string;
  latitude: number;
  longitude: number;
  bearing: number | null;
  speed: number | null;
}

/** Props for {@link MapTransitLayer}. */
interface MapTransitLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when transit data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Renders LYNX bus positions as animated circle markers on the map. */
export function MapTransitLayer({
  active,
  onDataReady,
  onLoadingChange,
}: MapTransitLayerProps) {
  const map = useMap();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;

  useEffect(() => {
    if (!map) return;

    // Cancelled flag prevents orphaned fitBounds promises from starting
    // rotation after this effect has cleaned up (e.g. when switching layers).
    let cancelled = false;
    let cleanupPopup: (() => void) | null = null;

    const cleanup = () => {
      cancelled = true;
      cleanupPopup?.();
      stopTransitPulse();
      stopDataLayerRotation();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Stop any in-progress camera animation so moveend fires immediately
      try { map.stop(); } catch { /* map may be disposed */ }
      if (map.getLayer(TRANSIT_LABELS)) map.removeLayer(TRANSIT_LABELS);
      if (map.getLayer(TRANSIT_CIRCLES)) map.removeLayer(TRANSIT_CIRCLES);
      if (map.getLayer(TRANSIT_GLOW)) map.removeLayer(TRANSIT_GLOW);
      if (map.getSource(TRANSIT_SOURCE)) map.removeSource(TRANSIT_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    const fetchAndRender = (isInitial: boolean) => {
      if (isInitial) onLoadingChangeRef.current?.(true);

      fetch("/api/layers/transit")
        .then((res) => {
          if (!res.ok) throw new Error(`Transit API ${res.status}`);
          return res.json();
        })
        .then(
          (data: { buses: BusPosition[]; busCount: number; routeCount: number }) => {
            if (!map.getStyle()) return;

            const features = data.buses.map((bus) => ({
              type: "Feature" as const,
              geometry: {
                type: "Point" as const,
                coordinates: [bus.longitude, bus.latitude],
              },
              properties: {
                vehicleId: bus.vehicleId,
                routeId: bus.routeId,
                bearing: bus.bearing ?? 0,
                label: bus.routeId,
              },
            }));

            const geojson: GeoJSON.FeatureCollection = {
              type: "FeatureCollection",
              features,
            };

            // Add or update source
            if (!map.getSource(TRANSIT_SOURCE)) {
              map.addSource(TRANSIT_SOURCE, {
                type: "geojson",
                data: geojson,
              });
            } else {
              (
                map.getSource(TRANSIT_SOURCE) as maplibregl.GeoJSONSource
              ).setData(geojson);
            }

            // 1. Outer glow — subtle pulsating halo
            if (!map.getLayer(TRANSIT_GLOW)) {
              map.addLayer({
                id: TRANSIT_GLOW,
                type: "circle",
                source: TRANSIT_SOURCE,
                paint: {
                  "circle-radius": [
                    "interpolate", ["linear"], ["zoom"],
                    8, 12,
                    12, 20,
                    16, 32,
                  ] as unknown as maplibregl.ExpressionSpecification,
                  "circle-color": LYNX_GLOW,
                  "circle-opacity": 0.2,
                  "circle-blur": 0.6,
                },
              });
            }

            // 2. Core bus dot — compact
            if (!map.getLayer(TRANSIT_CIRCLES)) {
              map.addLayer({
                id: TRANSIT_CIRCLES,
                type: "circle",
                source: TRANSIT_SOURCE,
                paint: {
                  "circle-radius": [
                    "interpolate", ["linear"], ["zoom"],
                    8, 4,
                    12, 6,
                    16, 10,
                  ] as unknown as maplibregl.ExpressionSpecification,
                  "circle-color": LYNX_COLOR,
                  "circle-opacity": 0.95,
                  "circle-stroke-width": 1.5,
                  "circle-stroke-color": "#ffffff",
                },
              });
            }

            // 3. Route number label — compact, no connector
            if (!map.getLayer(TRANSIT_LABELS)) {
              map.addLayer({
                id: TRANSIT_LABELS,
                type: "symbol",
                source: TRANSIT_SOURCE,
                layout: {
                  "text-field": ["get", "label"] as unknown as maplibregl.ExpressionSpecification,
                  "text-size": [
                    "interpolate", ["linear"], ["zoom"],
                    8, 9,
                    12, 11,
                    16, 14,
                  ] as unknown as maplibregl.ExpressionSpecification,
                  "text-font": ["Open Sans Bold"],
                  "text-offset": [0, -1.4] as [number, number],
                  "text-anchor": "bottom",
                  "text-allow-overlap": false,
                  "text-letter-spacing": 0.05,
                },
                paint: {
                  "text-color": "#ffffff",
                  "text-halo-color": "rgba(0, 77, 160, 0.9)",
                  "text-halo-width": 2,
                  "text-halo-blur": 0.5,
                },
              });
            }

            // Start pulsing animation
            startTransitPulse(map);

            // Hover popup
            if (!cleanupPopup) {
              cleanupPopup = addLayerHoverPopup(map, TRANSIT_CIRCLES, (p) =>
                `<div class="dl-title">Bus Route ${p.routeId ?? "?"}</div>` +
                `<div class="dl-subtitle">Vehicle ${p.vehicleId ?? "?"}</div>`,
              );
            }

            // Auto-zoom to fit all buses on initial load
            if (isInitial && data.buses.length > 0) {
              const coords = data.buses.map(
                (b) => [b.longitude, b.latitude] as [number, number],
              );
              void fitBoundsToPoints(map, coords, {
                padding: { top: 120, bottom: 200, left: 120, right: 120 },
                maxZoom: 15,
                duration: 1800,
              }).then(() => {
                if (!cancelled) startDataLayerRotation(map);
              });
            }

            if (isInitial) onDataReadyRef.current?.(data);
          },
        )
        .catch((err) => {
          console.error("[Transit] Fetch failed:", err);
        })
        .finally(() => {
          if (isInitial) onLoadingChangeRef.current?.(false);
        });
    };

    // Initial fetch
    fetchAndRender(true);

    // Poll every 15 seconds
    intervalRef.current = setInterval(() => fetchAndRender(false), 15 * 1000);

    return cleanup;
  }, [map, active]);

  return null;
}
