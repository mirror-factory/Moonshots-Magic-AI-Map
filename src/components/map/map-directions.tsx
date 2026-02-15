/**
 * @module components/map/map-directions
 * Renders a route line and origin/destination markers on the map
 * using GeoJSON source and layers. Manages layer lifecycle with cleanup.
 * The glow layers pulse with a smooth sine-wave animation.
 * After fitting bounds, a cinematic orbit rotates the view ~60° over 20s.
 */

"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "./use-map";
import type { DirectionsResult } from "@/lib/map/routing";

/** Source and layer IDs for the route overlay. */
const ROUTE_SOURCE = "directions-route";
const ROUTE_LINE = "directions-route-line";
const ROUTE_LINE_GLOW = "directions-route-glow";
const ROUTE_LINE_CASING = "directions-route-casing";
const ROUTE_ORIGIN = "directions-origin";
const ROUTE_DEST = "directions-destination";
const MARKERS_SOURCE = "directions-markers";
const STEP_SOURCE = "directions-step";
const STEP_DOT = "directions-step-dot";
const STEP_DOT_GLOW = "directions-step-glow";

/** Orbit animation configuration. */
const ORBIT_DEGREES = 60;
const ORBIT_DURATION_MS = 20_000;

/** Route drawing animation duration in ms. */
const DRAW_DURATION_MS = 2_000;

/** Props for {@link MapDirections}. */
interface MapDirectionsProps {
  /** Route result to render, or null to clear. */
  route: DirectionsResult | null;
  /** Origin coordinates [lng, lat]. */
  origin: [number, number] | null;
  /** Destination coordinates [lng, lat]. */
  destination: [number, number] | null;
  /** Current step coordinate [lng, lat] for the green navigation dot. */
  stepCoordinate?: [number, number] | null;
}

/** Renders a route line with origin/destination markers on the map. */
export function MapDirections({ route, origin, destination, stepCoordinate }: MapDirectionsProps) {
  const map = useMap();
  const animFrameRef = useRef<number>(0);
  const drawFrameRef = useRef<number>(0);
  const drawCompleteRef = useRef(false);
  const orbitFrameRef = useRef<number>(0);
  const orbitStoppedRef = useRef(false);

  // Pulsating glow animation
  useEffect(() => {
    if (!map || !route) return;

    const animate = () => {
      const t = Date.now() / 1000;
      // Sine wave oscillating between 0 and 1, period ~2s
      const pulse = (Math.sin(t * Math.PI) + 1) / 2;

      // Outer casing: opacity pulses 0.08 → 0.25
      if (map.getLayer(ROUTE_LINE_CASING)) {
        map.setPaintProperty(ROUTE_LINE_CASING, "line-opacity", 0.08 + pulse * 0.17);
      }
      // Middle glow: opacity pulses 0.2 → 0.5
      if (map.getLayer(ROUTE_LINE_GLOW)) {
        map.setPaintProperty(ROUTE_LINE_GLOW, "line-opacity", 0.2 + pulse * 0.3);
      }
      // Core line: opacity pulses 0.7 → 1.0
      if (map.getLayer(ROUTE_LINE)) {
        map.setPaintProperty(ROUTE_LINE, "line-opacity", 0.7 + pulse * 0.3);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [map, route]);

  // Cinematic orbit after route loads — slow 60° rotation over 20s
  useEffect(() => {
    if (!map || !route || !route.bbox) return;

    orbitStoppedRef.current = false;

    /** Stops the orbit on any user interaction. */
    const stopOrbit = () => {
      orbitStoppedRef.current = true;
      cancelAnimationFrame(orbitFrameRef.current);
    };

    // Wait for fitBounds to finish (~1200ms), then start orbit
    const timeout = setTimeout(() => {
      if (orbitStoppedRef.current) return;

      const startBearing = map.getBearing();
      const startTime = performance.now();

      const orbit = (now: number) => {
        if (orbitStoppedRef.current) return;

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / ORBIT_DURATION_MS, 1);
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const bearing = startBearing + ORBIT_DEGREES * eased;

        map.easeTo({ bearing, duration: 0, animate: false });

        if (progress < 1) {
          orbitFrameRef.current = requestAnimationFrame(orbit);
        }
      };

      orbitFrameRef.current = requestAnimationFrame(orbit);

      // Stop orbit on user interaction
      map.on("mousedown", stopOrbit);
      map.on("touchstart", stopOrbit);
      map.on("wheel", stopOrbit);
    }, 1400);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(orbitFrameRef.current);
      orbitStoppedRef.current = true;
      if (map) {
        map.off("mousedown", stopOrbit);
        map.off("touchstart", stopOrbit);
        map.off("wheel", stopOrbit);
      }
    };
  }, [map, route]);

  useEffect(() => {
    if (!map) return;

    const cleanup = () => {
      cancelAnimationFrame(animFrameRef.current);
      cancelAnimationFrame(drawFrameRef.current);
      cancelAnimationFrame(orbitFrameRef.current);
      drawCompleteRef.current = true;
      orbitStoppedRef.current = true;
      for (const id of [ROUTE_LINE, ROUTE_LINE_GLOW, ROUTE_LINE_CASING, ROUTE_ORIGIN, ROUTE_DEST, STEP_DOT, STEP_DOT_GLOW]) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);
      if (map.getSource(MARKERS_SOURCE)) map.removeSource(MARKERS_SOURCE);
      if (map.getSource(STEP_SOURCE)) map.removeSource(STEP_SOURCE);
    };

    if (!route || !origin || !destination) {
      cleanup();
      return;
    }

    // Start with empty line for drawing animation
    const fullCoords = route.geometry.coordinates as [number, number][];
    const emptyLine: GeoJSON.Feature = {
      type: "Feature",
      geometry: { type: "LineString", coordinates: fullCoords.length > 0 ? [fullCoords[0]] : [] },
      properties: {},
    };

    if (!map.getSource(ROUTE_SOURCE)) {
      map.addSource(ROUTE_SOURCE, { type: "geojson", data: emptyLine });
    } else {
      (map.getSource(ROUTE_SOURCE) as maplibregl.GeoJSONSource).setData(emptyLine);
    }

    // Animate route drawing progressively
    drawCompleteRef.current = false;
    const drawStart = performance.now();

    const animateDraw = (now: number) => {
      if (drawCompleteRef.current) return;

      const elapsed = now - drawStart;
      const progress = Math.min(elapsed / DRAW_DURATION_MS, 1);
      // Ease-out for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 2);
      const pointCount = Math.max(2, Math.floor(eased * fullCoords.length));

      const source = map.getSource(ROUTE_SOURCE) as maplibregl.GeoJSONSource | undefined;
      if (source) {
        source.setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: fullCoords.slice(0, pointCount) },
          properties: {},
        });
      }

      if (progress < 1) {
        drawFrameRef.current = requestAnimationFrame(animateDraw);
      } else {
        drawCompleteRef.current = true;
      }
    };

    drawFrameRef.current = requestAnimationFrame(animateDraw);

    // Route casing — outer ambient glow (soft white)
    if (!map.getLayer(ROUTE_LINE_CASING)) {
      map.addLayer({
        id: ROUTE_LINE_CASING,
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ffffff",
          "line-width": 18,
          "line-opacity": 0.12,
          "line-blur": 8,
        },
      });
    }

    // Route middle glow (warm white)
    if (!map.getLayer(ROUTE_LINE_GLOW)) {
      map.addLayer({
        id: ROUTE_LINE_GLOW,
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#e8f0ff",
          "line-width": 10,
          "line-opacity": 0.3,
          "line-blur": 3,
        },
      });
    }

    // Route core — solid bright white
    if (!map.getLayer(ROUTE_LINE)) {
      map.addLayer({
        id: ROUTE_LINE,
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ffffff",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });
    }

    // Origin + destination markers
    const markersData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [
        { type: "Feature", geometry: { type: "Point", coordinates: origin }, properties: { type: "origin" } },
        { type: "Feature", geometry: { type: "Point", coordinates: destination }, properties: { type: "destination" } },
      ],
    };

    if (!map.getSource(MARKERS_SOURCE)) {
      map.addSource(MARKERS_SOURCE, { type: "geojson", data: markersData });
    } else {
      (map.getSource(MARKERS_SOURCE) as maplibregl.GeoJSONSource).setData(markersData);
    }

    // Origin marker (blue circle)
    if (!map.getLayer(ROUTE_ORIGIN)) {
      map.addLayer({
        id: ROUTE_ORIGIN,
        type: "circle",
        source: MARKERS_SOURCE,
        filter: ["==", ["get", "type"], "origin"],
        paint: {
          "circle-radius": 8,
          "circle-color": "#3b82f6",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    // Destination marker (red circle)
    if (!map.getLayer(ROUTE_DEST)) {
      map.addLayer({
        id: ROUTE_DEST,
        type: "circle",
        source: MARKERS_SOURCE,
        filter: ["==", ["get", "type"], "destination"],
        paint: {
          "circle-radius": 8,
          "circle-color": "#ef4444",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    // Fit map to route bounds — zoom in close so the route fills the view
    if (route.bbox) {
      map.fitBounds(
        [
          [route.bbox[0], route.bbox[1]],
          [route.bbox[2], route.bbox[3]],
        ],
        { padding: { top: 140, bottom: 160, left: 320, right: 60 }, maxZoom: 16, duration: 1200 },
      );
    }

    return cleanup;
  }, [map, route, origin, destination]);

  // Green navigation dot — moves to the current step coordinate
  useEffect(() => {
    if (!map) return;

    if (!stepCoordinate) {
      // Remove step layers when no step is active
      if (map.getLayer(STEP_DOT_GLOW)) map.removeLayer(STEP_DOT_GLOW);
      if (map.getLayer(STEP_DOT)) map.removeLayer(STEP_DOT);
      if (map.getSource(STEP_SOURCE)) map.removeSource(STEP_SOURCE);
      return;
    }

    const pointData: GeoJSON.Feature = {
      type: "Feature",
      geometry: { type: "Point", coordinates: stepCoordinate },
      properties: {},
    };

    if (!map.getSource(STEP_SOURCE)) {
      map.addSource(STEP_SOURCE, { type: "geojson", data: pointData });
    } else {
      (map.getSource(STEP_SOURCE) as maplibregl.GeoJSONSource).setData(pointData);
    }

    // Outer glow ring
    if (!map.getLayer(STEP_DOT_GLOW)) {
      map.addLayer({
        id: STEP_DOT_GLOW,
        type: "circle",
        source: STEP_SOURCE,
        paint: {
          "circle-radius": 18,
          "circle-color": "#22c55e",
          "circle-opacity": 0.25,
          "circle-blur": 0.6,
        },
      });
    }

    // Core green dot
    if (!map.getLayer(STEP_DOT)) {
      map.addLayer({
        id: STEP_DOT,
        type: "circle",
        source: STEP_SOURCE,
        paint: {
          "circle-radius": 8,
          "circle-color": "#22c55e",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });
    }
  }, [map, stepCoordinate]);

  return null;
}
