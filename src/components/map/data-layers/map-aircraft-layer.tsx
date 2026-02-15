/**
 * @module components/map/data-layers/map-aircraft-layer
 * Headless component that renders live aircraft positions near MCO as markers.
 * Polls every 15 seconds. Uses bearing for rotation.
 * Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { addLayerHoverPopup } from "./layer-popup";

/** Source and layer IDs. */
const AIRCRAFT_SOURCE = "aircraft-source";
const AIRCRAFT_GLOW = "aircraft-glow";
const AIRCRAFT_CIRCLES = "aircraft-circles";
const AIRCRAFT_LABELS = "aircraft-labels";

/** Module-level animation frame for aircraft pulse. */
let aircraftPulseFrame: number | null = null;

/** Starts a pulse animation on aircraft markers. */
function startAircraftPulse(map: maplibregl.Map) {
  stopAircraftPulse();
  const t0 = performance.now();

  const animate = () => {
    if (!map.getStyle()) { aircraftPulseFrame = null; return; }
    const t = (performance.now() - t0) / 1000;
    const p = Math.sin(t * 1.5) * 0.5 + 0.5;

    if (map.getLayer(AIRCRAFT_GLOW)) {
      map.setPaintProperty(AIRCRAFT_GLOW, "circle-opacity", 0.1 + p * 0.2);
    }

    aircraftPulseFrame = requestAnimationFrame(animate);
  };

  aircraftPulseFrame = requestAnimationFrame(animate);
}

/** Stops the aircraft pulse animation. */
function stopAircraftPulse() {
  if (aircraftPulseFrame !== null) {
    cancelAnimationFrame(aircraftPulseFrame);
    aircraftPulseFrame = null;
  }
}

/** Aircraft position from the API. */
interface AircraftPosition {
  icao24: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  velocity: number;
  onGround: boolean;
}

/** Props for {@link MapAircraftLayer}. */
interface MapAircraftLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Renders live aircraft positions near MCO as animated markers. */
export function MapAircraftLayer({ active, onDataReady, onLoadingChange }: MapAircraftLayerProps) {
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
      stopAircraftPulse();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (map.getLayer(AIRCRAFT_LABELS)) map.removeLayer(AIRCRAFT_LABELS);
      if (map.getLayer(AIRCRAFT_CIRCLES)) map.removeLayer(AIRCRAFT_CIRCLES);
      if (map.getLayer(AIRCRAFT_GLOW)) map.removeLayer(AIRCRAFT_GLOW);
      if (map.getSource(AIRCRAFT_SOURCE)) map.removeSource(AIRCRAFT_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    let consecutiveFailures = 0;

    const fetchAndRender = (isInitial: boolean) => {
      if (isInitial) onLoadingChangeRef.current?.(true);

      // Stop polling after 3 consecutive failures to avoid console spam
      if (consecutiveFailures >= 3 && !isInitial) return;

      fetch("/api/layers/aircraft")
        .then((res) => {
          if (!res.ok) throw new Error(`Aircraft API ${res.status}`);
          consecutiveFailures = 0;
          return res.json();
        })
        .then((data: { aircraft: AircraftPosition[]; aircraftCount: number }) => {
          if (!map.getStyle()) return;

          const features = data.aircraft
            .filter((a) => !a.onGround)
            .map((a) => ({
              type: "Feature" as const,
              geometry: {
                type: "Point" as const,
                coordinates: [a.longitude, a.latitude],
              },
              properties: {
                callsign: a.callsign || a.icao24,
                altitude: a.altitude,
                heading: a.heading,
                velocity: a.velocity,
              },
            }));

          const geojson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features,
          };

          if (!map.getSource(AIRCRAFT_SOURCE)) {
            map.addSource(AIRCRAFT_SOURCE, { type: "geojson", data: geojson });
          } else {
            (map.getSource(AIRCRAFT_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
          }

          // Glow
          if (!map.getLayer(AIRCRAFT_GLOW)) {
            map.addLayer({
              id: AIRCRAFT_GLOW,
              type: "circle",
              source: AIRCRAFT_SOURCE,
              paint: {
                "circle-radius": [
                  "interpolate", ["linear"], ["zoom"],
                  6, 16, 12, 30,
                ] as unknown as maplibregl.ExpressionSpecification,
                "circle-color": "#60a5fa",
                "circle-opacity": 0.2,
                "circle-blur": 0.5,
              },
            });
          }

          // Core dot
          if (!map.getLayer(AIRCRAFT_CIRCLES)) {
            map.addLayer({
              id: AIRCRAFT_CIRCLES,
              type: "circle",
              source: AIRCRAFT_SOURCE,
              paint: {
                "circle-radius": [
                  "interpolate", ["linear"], ["zoom"],
                  6, 5, 12, 10,
                ] as unknown as maplibregl.ExpressionSpecification,
                "circle-color": "#3b82f6",
                "circle-opacity": 0.9,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
              },
            });
          }

          // Callsign labels — thick dark halo for translucent pill effect
          if (!map.getLayer(AIRCRAFT_LABELS)) {
            map.addLayer({
              id: AIRCRAFT_LABELS,
              type: "symbol",
              source: AIRCRAFT_SOURCE,
              layout: {
                "text-field": ["get", "callsign"] as unknown as maplibregl.ExpressionSpecification,
                "text-size": 11,
                "text-offset": [0, 1.6] as [number, number],
                "text-anchor": "top",
                "text-font": ["Open Sans Bold"],
                "text-allow-overlap": false,
                "text-padding": 4 as unknown as maplibregl.ExpressionSpecification,
              },
              paint: {
                "text-color": "#ffffff",
                "text-halo-color": "rgba(10, 10, 20, 0.85)",
                "text-halo-width": 4,
                "text-halo-blur": 0.5,
              },
            });
          }

          startAircraftPulse(map);

          // Hover popup on aircraft dots
          if (!cleanupPopup) {
            cleanupPopup = addLayerHoverPopup(map, AIRCRAFT_CIRCLES, (p) => {
              const alt = Number(p.altitude) || 0;
              const vel = Number(p.velocity) || 0;
              return (
                `<div class="dl-title">${p.callsign || "Unknown"}</div>` +
                `<div class="dl-subtitle">${alt.toLocaleString()} ft · ${vel} kts</div>` +
                `<div class="dl-detail">Heading ${Math.round(Number(p.heading) || 0)}°</div>`
              );
            });
          }

          if (isInitial) onDataReadyRef.current?.(data);
        })
        .catch((err) => {
          consecutiveFailures++;
          if (consecutiveFailures <= 1) {
            console.error("[Aircraft] Fetch failed:", err);
          }
          if (consecutiveFailures === 3) {
            console.warn("[Aircraft] 3 consecutive failures — pausing polling");
          }
        })
        .finally(() => {
          if (isInitial) onLoadingChangeRef.current?.(false);
        });
    };

    fetchAndRender(true);
    intervalRef.current = setInterval(() => fetchAndRender(false), 15 * 1000);

    return cleanup;
  }, [map, active]);

  return null;
}
