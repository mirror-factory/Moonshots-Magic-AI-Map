/**
 * @module components/map/data-layers/map-ev-chargers-layer
 * Headless component that renders EV charging stations from NREL AFDC.
 * Requires NEXT_PUBLIC_NREL_API_KEY. Fetched once (1hr server cache).
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
const EV_SOURCE = "ev-chargers-source";
const EV_GLOW = "ev-chargers-glow";
const EV_CIRCLES = "ev-chargers-circles";
const EV_LABELS = "ev-chargers-labels";

/** EV station from the API. */
interface EvStation {
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  evLevel2: number;
  dcFast: number;
  network: string;
}

/** Props for {@link MapEvChargersLayer}. */
interface MapEvChargersLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** EV charger color (electric green). */
const EV_COLOR = "#22c55e";

/** Renders EV charging stations as green circle markers. */
export function MapEvChargersLayer({ active, onDataReady, onLoadingChange }: MapEvChargersLayerProps) {
  const map = useMap();
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
      if (map.getLayer(EV_LABELS)) map.removeLayer(EV_LABELS);
      if (map.getLayer(EV_CIRCLES)) map.removeLayer(EV_CIRCLES);
      if (map.getLayer(EV_GLOW)) map.removeLayer(EV_GLOW);
      if (map.getSource(EV_SOURCE)) map.removeSource(EV_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    onLoadingChangeRef.current?.(true);

    fetch("/api/layers/ev-chargers")
      .then((res) => res.json())
      .then((data: { stations: EvStation[]; error?: string }) => {
        if (data.error) {
          console.warn("[EV Chargers]", data.error);
        }
        if (!map.getStyle() || !data.stations?.length) return;

        const geojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: data.stations.map((s) => ({
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [s.longitude, s.latitude],
            },
            properties: {
              name: s.name,
              ports: s.evLevel2 + s.dcFast,
              hasDcFast: s.dcFast > 0,
              network: s.network,
            },
          })),
        };

        if (!map.getSource(EV_SOURCE)) {
          map.addSource(EV_SOURCE, { type: "geojson", data: geojson });
        } else {
          (map.getSource(EV_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
        }

        if (!map.getLayer(EV_GLOW)) {
          map.addLayer({
            id: EV_GLOW,
            type: "circle",
            source: EV_SOURCE,
            paint: {
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                8, 10, 14, 20,
              ] as unknown as maplibregl.ExpressionSpecification,
              "circle-color": EV_COLOR,
              "circle-opacity": 0.15,
              "circle-blur": 0.5,
            },
          });
        }

        if (!map.getLayer(EV_CIRCLES)) {
          map.addLayer({
            id: EV_CIRCLES,
            type: "circle",
            source: EV_SOURCE,
            paint: {
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                8, 4, 14, 8,
              ] as unknown as maplibregl.ExpressionSpecification,
              "circle-color": EV_COLOR,
              "circle-opacity": 0.9,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#ffffff",
            },
          });
        }

        if (!map.getLayer(EV_LABELS)) {
          map.addLayer({
            id: EV_LABELS,
            type: "symbol",
            source: EV_SOURCE,
            layout: {
              "text-field": ["get", "name"] as unknown as maplibregl.ExpressionSpecification,
              "text-size": 10,
              "text-offset": [0, 1.4] as [number, number],
              "text-anchor": "top",
              "text-font": ["Open Sans Regular"],
              "text-allow-overlap": false,
              "text-max-width": 10,
            },
            paint: {
              "text-color": "rgba(255, 255, 255, 0.6)",
              "text-halo-color": "rgba(0, 0, 0, 0.8)",
              "text-halo-width": 1,
            },
          });
        }

        // Hover popup on EV stations
        if (!cleanupPopup) {
          cleanupPopup = addLayerHoverPopup(map, EV_CIRCLES, (p) => {
            const ports = Number(p.ports) || 0;
            const hasFast = p.hasDcFast === true || p.hasDcFast === "true";
            return (
              `<div class="dl-title">${p.name ?? "EV Station"}</div>` +
              `<div class="dl-badge" style="background:#22c55e;color:#fff">${ports} port${ports !== 1 ? "s" : ""}${hasFast ? " · DC Fast" : ""}</div>` +
              `<div class="dl-subtitle">${p.network ?? ""}</div>`
            );
          });
        }

        // Fit to stations and rotate on initial load
        if (data.stations?.length) {
          const coords = data.stations.map(
            (s: EvStation) => [s.longitude, s.latitude] as [number, number],
          );
          void fitBoundsToPoints(map, coords, {
            padding: { top: 120, bottom: 200, left: 120, right: 120 },
            maxZoom: 15,
            duration: 1800,
          }).then(() => {
            if (!cancelled) startDataLayerRotation(map);
          });
        }

        onDataReadyRef.current?.(data);
      })
      .catch((err) => {
        console.error("[EV Chargers] Fetch failed:", err);
      })
      .finally(() => {
        onLoadingChangeRef.current?.(false);
      });

    return cleanup;
  }, [map, active]);

  return null;
}
