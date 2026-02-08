/**
 * @module components/map/map-directions
 * Renders a route line and origin/destination markers on the map
 * using GeoJSON source and layers. Manages layer lifecycle with cleanup.
 */

"use client";

import { useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { useMap } from "./use-map";
import type { DirectionsResult } from "@/lib/map/routing";

/** Source and layer IDs for the route overlay. */
const ROUTE_SOURCE = "directions-route";
const ROUTE_LINE = "directions-route-line";
const ROUTE_LINE_CASING = "directions-route-casing";
const ROUTE_ORIGIN = "directions-origin";
const ROUTE_DEST = "directions-destination";
const MARKERS_SOURCE = "directions-markers";

interface MapDirectionsProps {
  /** Route result to render, or null to clear. */
  route: DirectionsResult | null;
  /** Origin coordinates [lng, lat]. */
  origin: [number, number] | null;
  /** Destination coordinates [lng, lat]. */
  destination: [number, number] | null;
}

/** Renders a route line with origin/destination markers on the map. */
export function MapDirections({ route, origin, destination }: MapDirectionsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const cleanup = () => {
      for (const id of [ROUTE_LINE, ROUTE_LINE_CASING, ROUTE_ORIGIN, ROUTE_DEST]) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);
      if (map.getSource(MARKERS_SOURCE)) map.removeSource(MARKERS_SOURCE);
    };

    if (!route || !origin || !destination) {
      cleanup();
      return;
    }

    // Add route line source + layers
    if (!map.getSource(ROUTE_SOURCE)) {
      map.addSource(ROUTE_SOURCE, {
        type: "geojson",
        data: { type: "Feature", geometry: route.geometry, properties: {} },
      });
    } else {
      (map.getSource(ROUTE_SOURCE) as maplibregl.GeoJSONSource).setData({
        type: "Feature",
        geometry: route.geometry,
        properties: {},
      });
    }

    // Route casing (dark outline)
    if (!map.getLayer(ROUTE_LINE_CASING)) {
      map.addLayer({
        id: ROUTE_LINE_CASING,
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#1a1a3e",
          "line-width": 8,
          "line-opacity": 0.5,
        },
      });
    }

    // Route line (brand-colored)
    if (!map.getLayer(ROUTE_LINE)) {
      map.addLayer({
        id: ROUTE_LINE,
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 5,
          "line-opacity": 0.9,
          "line-dasharray": [0, 2, 1],
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

    // Fit map to route bounds
    if (route.bbox) {
      map.fitBounds(
        [
          [route.bbox[0], route.bbox[1]],
          [route.bbox[2], route.bbox[3]],
        ],
        { padding: 80, duration: 1000 },
      );
    }

    return cleanup;
  }, [map, route, origin, destination]);

  return null;
}
