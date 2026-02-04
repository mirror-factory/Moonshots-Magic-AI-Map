/**
 * @module map/geojson
 * Converts {@link EventEntry} arrays into GeoJSON FeatureCollections
 * for rendering as MapLibre GL source data.
 */

import type { EventEntry } from "@/lib/registries/types";
import { CATEGORY_COLORS } from "./config";

/** Properties attached to each GeoJSON Point feature on the map. */
export interface EventFeatureProperties {
  id: string;
  title: string;
  category: string;
  color: string;
  venue: string;
  startDate: string;
  isFree: boolean;
  featured: boolean;
}

/**
 * Transform an array of events into a GeoJSON FeatureCollection of Points.
 * Each feature carries {@link EventFeatureProperties} for popup rendering
 * and data-driven styling.
 *
 * @param events - Events to convert.
 * @returns GeoJSON FeatureCollection ready for MapLibre `addSource`.
 */
export function eventsToGeoJSON(
  events: EventEntry[],
): GeoJSON.FeatureCollection<GeoJSON.Point, EventFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: events.map((event) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: event.coordinates,
      },
      properties: {
        id: event.id,
        title: event.title,
        category: event.category,
        color: CATEGORY_COLORS[event.category],
        venue: event.venue,
        startDate: event.startDate,
        isFree: event.price?.isFree ?? false,
        featured: event.featured ?? false,
      },
    })),
  };
}
