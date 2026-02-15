/**
 * @module components/map/data-layers/map-transit-shapes-layer
 * Headless component that renders LYNX bus route shapes as animated gold
 * glowing lines. Fetches GTFS static shape data and renders 3 line layers
 * (casing, glow, core) with a progressive draw animation and RAF pulse.
 * Shape lines render BELOW transit bus dots via `beforeId`.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { TRANSIT_GLOW } from "./map-transit-layer";

/** Source and layer IDs for transit route shapes. */
const SHAPES_SOURCE = "transit-shapes-source";
const SHAPES_CASING = "transit-shapes-casing";
const SHAPES_GLOW_LAYER = "transit-shapes-glow";
const SHAPES_CORE = "transit-shapes-core";

/** Drawing animation duration in ms. */
const DRAW_DURATION_MS = 2500;

/** Props for {@link MapTransitShapesLayer}. */
interface MapTransitShapesLayerProps {
  /** Whether this layer is active. */
  active: boolean;
}

/**
 * Progressively draws route lines by interpolating through all route
 * coordinates over `DRAW_DURATION_MS` with an ease-out curve.
 * Updates the source data each frame with a growing subset of each route's coords.
 */
function animateDrawing(
  map: maplibregl.Map,
  fullData: GeoJSON.FeatureCollection,
  drawFrameRef: React.MutableRefObject<number>,
  drawCompleteRef: React.MutableRefObject<boolean>,
) {
  drawCompleteRef.current = false;
  const drawStart = performance.now();

  // Pre-compute coordinate arrays for each feature
  const featureCoords = fullData.features.map((f) => {
    const geom = f.geometry as GeoJSON.MultiLineString;
    return geom.coordinates;
  });

  const animate = (now: number) => {
    if (drawCompleteRef.current) return;

    const elapsed = now - drawStart;
    const progress = Math.min(elapsed / DRAW_DURATION_MS, 1);
    // Ease-out quadratic
    const eased = 1 - Math.pow(1 - progress, 2);

    const partialFeatures: GeoJSON.Feature[] = fullData.features.map((f, i) => {
      const allLines = featureCoords[i];
      const partialLines = allLines.map((line) => {
        const count = Math.max(2, Math.floor(eased * line.length));
        return line.slice(0, count);
      });

      return {
        ...f,
        geometry: {
          type: "MultiLineString" as const,
          coordinates: partialLines,
        },
      };
    });

    const source = map.getSource(SHAPES_SOURCE) as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData({ type: "FeatureCollection", features: partialFeatures });
    }

    if (progress < 1) {
      drawFrameRef.current = requestAnimationFrame(animate);
    } else {
      drawCompleteRef.current = true;
      // Set the full data once drawing completes
      source?.setData(fullData);
    }
  };

  drawFrameRef.current = requestAnimationFrame(animate);
}

/** Renders LYNX bus route shapes as animated gold glowing lines on the map. */
export function MapTransitShapesLayer({ active }: MapTransitShapesLayerProps) {
  const map = useMap();
  const pulseFrameRef = useRef<number>(0);
  const drawFrameRef = useRef<number>(0);
  const drawCompleteRef = useRef(false);

  useEffect(() => {
    if (!map) return;

    const cleanup = () => {
      cancelAnimationFrame(pulseFrameRef.current);
      cancelAnimationFrame(drawFrameRef.current);
      drawCompleteRef.current = true;
      for (const id of [SHAPES_CORE, SHAPES_GLOW_LAYER, SHAPES_CASING]) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      if (map.getSource(SHAPES_SOURCE)) map.removeSource(SHAPES_SOURCE);
    };

    if (!active) {
      cleanup();
      return;
    }

    // Fetch shapes data
    fetch("/api/layers/transit/shapes")
      .then((res) => {
        if (!res.ok) throw new Error(`Shapes API ${res.status}`);
        return res.json();
      })
      .then((geojson: GeoJSON.FeatureCollection) => {
        if (!map.getStyle()) return;
        if (!geojson.features?.length) return;

        // Start with empty data for draw animation
        const emptyData: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: geojson.features.map((f) => ({
            ...f,
            geometry: {
              type: "MultiLineString" as const,
              coordinates: (f.geometry as GeoJSON.MultiLineString).coordinates.map(
                (line) => (line.length > 0 ? [line[0]] : []),
              ),
            },
          })),
        };

        // Add source
        if (!map.getSource(SHAPES_SOURCE)) {
          map.addSource(SHAPES_SOURCE, { type: "geojson", data: emptyData });
        }

        // Determine `beforeId` — insert shapes below transit bus dots
        const beforeId = map.getLayer(TRANSIT_GLOW) ? TRANSIT_GLOW : undefined;

        // 1. Casing — outer ambient glow
        if (!map.getLayer(SHAPES_CASING)) {
          map.addLayer(
            {
              id: SHAPES_CASING,
              type: "line",
              source: SHAPES_SOURCE,
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": "#FFE082",
                "line-width": [
                  "interpolate", ["linear"], ["zoom"],
                  8, 8,
                  16, 20,
                ] as unknown as maplibregl.ExpressionSpecification,
                "line-opacity": 0.1,
                "line-blur": 6,
              },
            },
            beforeId,
          );
        }

        // 2. Glow — middle warm layer
        if (!map.getLayer(SHAPES_GLOW_LAYER)) {
          map.addLayer(
            {
              id: SHAPES_GLOW_LAYER,
              type: "line",
              source: SHAPES_SOURCE,
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": "#FFC107",
                "line-width": [
                  "interpolate", ["linear"], ["zoom"],
                  8, 4,
                  16, 10,
                ] as unknown as maplibregl.ExpressionSpecification,
                "line-opacity": 0.25,
                "line-blur": 2,
              },
            },
            beforeId,
          );
        }

        // 3. Core — solid bright gold
        if (!map.getLayer(SHAPES_CORE)) {
          map.addLayer(
            {
              id: SHAPES_CORE,
              type: "line",
              source: SHAPES_SOURCE,
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": "#FFD700",
                "line-width": [
                  "interpolate", ["linear"], ["zoom"],
                  8, 1.5,
                  16, 4,
                ] as unknown as maplibregl.ExpressionSpecification,
                "line-opacity": 0.75,
              },
            },
            beforeId,
          );
        }

        // Start progressive draw animation
        animateDrawing(map, geojson, drawFrameRef, drawCompleteRef);

        // Start pulse animation (~2s period sine wave on opacity)
        const t0 = performance.now();
        const pulse = () => {
          if (!map.getStyle()) {
            pulseFrameRef.current = 0;
            return;
          }
          const t = (performance.now() - t0) / 1000;
          const p = (Math.sin(t * Math.PI) + 1) / 2; // 0→1, ~2s period

          if (map.getLayer(SHAPES_CASING)) {
            map.setPaintProperty(SHAPES_CASING, "line-opacity", 0.06 + p * 0.1);
          }
          if (map.getLayer(SHAPES_GLOW_LAYER)) {
            map.setPaintProperty(SHAPES_GLOW_LAYER, "line-opacity", 0.15 + p * 0.2);
          }
          if (map.getLayer(SHAPES_CORE)) {
            map.setPaintProperty(SHAPES_CORE, "line-opacity", 0.6 + p * 0.3);
          }

          pulseFrameRef.current = requestAnimationFrame(pulse);
        };

        pulseFrameRef.current = requestAnimationFrame(pulse);
      })
      .catch((err) => {
        console.error("[Transit Shapes] Fetch failed:", err);
      });

    return cleanup;
  }, [map, active]);

  return null;
}
