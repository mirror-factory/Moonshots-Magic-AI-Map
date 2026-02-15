/**
 * @module components/map/data-layers/map-sunrail-layer
 * Headless component that renders SunRail commuter rail stops and route line.
 * Static data — fetched once. Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { fitBoundsToPoints } from "@/lib/map/camera-utils";
import { startDataLayerRotation, stopDataLayerRotation } from "./layer-rotation";
import { addLayerHoverPopup } from "./layer-popup";

/** Source and layer IDs. */
const SUNRAIL_ROUTE_SOURCE = "sunrail-route-source";
const SUNRAIL_STOPS_SOURCE = "sunrail-stops-source";
const SUNRAIL_ROUTE_CASING = "sunrail-route-casing";
const SUNRAIL_ROUTE_LINE = "sunrail-route-line";
const SUNRAIL_STOPS_GLOW = "sunrail-stops-glow";
const SUNRAIL_STOPS_DOT = "sunrail-stops-dot";
const SUNRAIL_STOPS_LABEL = "sunrail-stops-label";

/** SunRail brand color. */
const SUNRAIL_COLOR = "#005DAA";
const SUNRAIL_GLOW = "#60a5fa";

/** Station from the API. */
interface Station {
  name: string;
  latitude: number;
  longitude: number;
  zone: string;
  color: string;
}

/** Props for {@link MapSunrailLayer}. */
interface MapSunrailLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Renders SunRail route and stops on the map. */
export function MapSunrailLayer({ active, onDataReady, onLoadingChange }: MapSunrailLayerProps) {
  const map = useMap();
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;

  useEffect(() => {
    if (!map) return;

    let cancelled = false;
    let cleanupPopup: (() => void) | null = null;

    const cleanup = () => {
      cancelled = true;
      cleanupPopup?.();
      stopDataLayerRotation();
      if (map.getLayer(SUNRAIL_STOPS_LABEL)) map.removeLayer(SUNRAIL_STOPS_LABEL);
      if (map.getLayer(SUNRAIL_STOPS_DOT)) map.removeLayer(SUNRAIL_STOPS_DOT);
      if (map.getLayer(SUNRAIL_STOPS_GLOW)) map.removeLayer(SUNRAIL_STOPS_GLOW);
      if (map.getLayer(SUNRAIL_ROUTE_LINE)) map.removeLayer(SUNRAIL_ROUTE_LINE);
      if (map.getLayer(SUNRAIL_ROUTE_CASING)) map.removeLayer(SUNRAIL_ROUTE_CASING);
      if (map.getSource(SUNRAIL_STOPS_SOURCE)) map.removeSource(SUNRAIL_STOPS_SOURCE);
      if (map.getSource(SUNRAIL_ROUTE_SOURCE)) map.removeSource(SUNRAIL_ROUTE_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    onLoadingChangeRef.current?.(true);

    fetch("/api/layers/sunrail")
      .then((res) => {
        if (!res.ok) throw new Error(`SunRail API ${res.status}`);
        return res.json();
      })
      .then((data: { stations: Station[]; routeLine: GeoJSON.Feature; stationCount: number }) => {
        if (!map.getStyle() || cancelled) return;

        // Route line source (with existence guard for re-toggle)
        const routeGeojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: [data.routeLine],
        };
        if (!map.getSource(SUNRAIL_ROUTE_SOURCE)) {
          map.addSource(SUNRAIL_ROUTE_SOURCE, { type: "geojson", data: routeGeojson });
        } else {
          (map.getSource(SUNRAIL_ROUTE_SOURCE) as maplibregl.GeoJSONSource).setData(routeGeojson);
        }

        // Station stops source (with existence guard)
        const stopsGeojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: data.stations.map((s) => ({
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [s.longitude, s.latitude] },
            properties: { name: s.name, zone: s.zone, color: s.color },
          })),
        };
        if (!map.getSource(SUNRAIL_STOPS_SOURCE)) {
          map.addSource(SUNRAIL_STOPS_SOURCE, { type: "geojson", data: stopsGeojson });
        } else {
          (map.getSource(SUNRAIL_STOPS_SOURCE) as maplibregl.GeoJSONSource).setData(stopsGeojson);
        }

        // Route casing — wide glow for visibility at any zoom
        if (!map.getLayer(SUNRAIL_ROUTE_CASING)) {
          map.addLayer({
            id: SUNRAIL_ROUTE_CASING,
            type: "line",
            source: SUNRAIL_ROUTE_SOURCE,
            paint: {
              "line-color": SUNRAIL_COLOR,
              "line-width": [
                "interpolate", ["linear"], ["zoom"],
                7, 10, 14, 20,
              ] as unknown as maplibregl.ExpressionSpecification,
              "line-opacity": 0.25,
              "line-blur": 4,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
        }

        // Route core line — bright and clearly visible
        if (!map.getLayer(SUNRAIL_ROUTE_LINE)) {
          map.addLayer({
            id: SUNRAIL_ROUTE_LINE,
            type: "line",
            source: SUNRAIL_ROUTE_SOURCE,
            paint: {
              "line-color": SUNRAIL_GLOW,
              "line-width": [
                "interpolate", ["linear"], ["zoom"],
                7, 3, 14, 7,
              ] as unknown as maplibregl.ExpressionSpecification,
              "line-opacity": 0.9,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
        }

        // Stop glow
        if (!map.getLayer(SUNRAIL_STOPS_GLOW)) {
          map.addLayer({
            id: SUNRAIL_STOPS_GLOW,
            type: "circle",
            source: SUNRAIL_STOPS_SOURCE,
            paint: {
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                8, 12, 14, 25,
              ] as unknown as maplibregl.ExpressionSpecification,
              "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
              "circle-opacity": 0.2,
              "circle-blur": 0.5,
            },
          });
        }

        // Stop dot
        if (!map.getLayer(SUNRAIL_STOPS_DOT)) {
          map.addLayer({
            id: SUNRAIL_STOPS_DOT,
            type: "circle",
            source: SUNRAIL_STOPS_SOURCE,
            paint: {
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                8, 5, 14, 10,
              ] as unknown as maplibregl.ExpressionSpecification,
              "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
              "circle-opacity": 0.95,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });
        }

        // Station labels — thick dark halo for translucent pill effect
        if (!map.getLayer(SUNRAIL_STOPS_LABEL)) {
          map.addLayer({
            id: SUNRAIL_STOPS_LABEL,
            type: "symbol",
            source: SUNRAIL_STOPS_SOURCE,
            layout: {
              "text-field": ["get", "name"] as unknown as maplibregl.ExpressionSpecification,
              "text-size": 12,
              "text-offset": [0, 1.8] as [number, number],
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

        // Hover popup on station dots
        const zoneLabels: Record<string, string> = { north: "North Zone", central: "Central Zone", south: "South Zone" };
        if (!cleanupPopup) {
          cleanupPopup = addLayerHoverPopup(map, SUNRAIL_STOPS_DOT, (p) =>
            `<div class="dl-title">${p.name ?? "Station"}</div>` +
            `<div class="dl-badge" style="background:${String(p.color)};color:#fff">${zoneLabels[String(p.zone)] ?? String(p.zone)}</div>`,
          );
        }

        // Fit to route
        const coords = data.stations.map(
          (s) => [s.longitude, s.latitude] as [number, number],
        );
        void fitBoundsToPoints(map, coords, {
          padding: { top: 120, bottom: 200, left: 120, right: 120 },
          maxZoom: 12,
          duration: 1800,
        }).then(() => {
          if (!cancelled) startDataLayerRotation(map);
        });

        onDataReadyRef.current?.(data);
      })
      .catch((err) => {
        console.error("[SunRail] Fetch failed:", err);
      })
      .finally(() => {
        onLoadingChangeRef.current?.(false);
      });

    return cleanup;
  }, [map, active]);

  return null;
}
