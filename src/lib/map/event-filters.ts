/**
 * @module lib/map/event-filters
 * Date-range filter utilities for map event markers.
 * Computes which events fall within preset time windows (today, this weekend, this week).
 */

import type { EventEntry } from "@/lib/registries/types";

/** Preset date-range filter options. "all" shows every event, "month" shows this month. */
export type DatePreset = "all" | "today" | "weekend" | "week" | "month";

/** Labels shown on filter chips for each preset. */
export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  all: "All",
  today: "Today",
  weekend: "Weekend",
  week: "This Week",
  month: "This Month",
};

/**
 * Returns true if two dates fall on the same calendar day.
 * @param date - Date to check.
 * @param target - Target date to compare against.
 */
export function isSameDay(date: Date, target: Date): boolean {
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

/**
 * Returns true if the given date is this Saturday or Sunday.
 * @param date - Date to check.
 */
export function isThisWeekend(date: Date): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat

  // Find the coming Saturday (or today if already Sat/Sun)
  const saturday = new Date(now);
  const daysUntilSat = (6 - day + 7) % 7;
  saturday.setDate(now.getDate() + (daysUntilSat === 0 && day === 6 ? 0 : daysUntilSat));
  saturday.setHours(0, 0, 0, 0);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);

  // If today is Sunday, the "weekend" is today
  if (day === 0) {
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    return date >= todayStart && date <= todayEnd;
  }

  return date >= saturday && date <= sunday;
}

/**
 * Returns true if the given date falls within the current Mon–Sun week.
 * @param date - Date to check.
 */
export function isThisWeek(date: Date): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat

  // Monday of this week
  const monday = new Date(now);
  const daysFromMonday = day === 0 ? 6 : day - 1;
  monday.setDate(now.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);

  // Sunday end of this week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return date >= monday && date <= sunday;
}

/**
 * Returns true if the given date falls within the current calendar month.
 * @param date - Date to check.
 */
export function isThisMonth(date: Date): boolean {
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

/**
 * Returns true if the given date falls within the specified date range (inclusive).
 * @param date - Date to check.
 * @param start - Start of range (inclusive).
 * @param end - End of range (inclusive, checked to end of day).
 */
export function isInDateRange(date: Date, start: Date, end: Date): boolean {
  const endOfDay = new Date(end);
  endOfDay.setHours(23, 59, 59, 999);
  return date >= start && date <= endOfDay;
}

/**
 * Returns event IDs whose startDate matches the given date preset.
 * @param events - All available events.
 * @param preset - The date preset to filter by.
 * @returns Array of matching event IDs.
 */
export function getEventsForPreset(events: EventEntry[], preset: DatePreset): string[] {
  if (preset === "all") return events.map((event) => event.id);

  const now = new Date();

  return events
    .filter((event) => {
      const eventDate = new Date(event.startDate);
      switch (preset) {
        case "today":
          return isSameDay(eventDate, now);
        case "weekend":
          return isThisWeekend(eventDate);
        case "week":
          return isThisWeek(eventDate);
        case "month":
          return isThisMonth(eventDate);
      }
    })
    .map((event) => event.id);
}

/** Distance preset options in miles. */
export type DistancePreset = 1 | 3 | 5 | 10 | null;

/** Labels for distance presets. */
export const DISTANCE_PRESET_LABELS: Record<number, string> = {
  1: "1 mi",
  3: "3 mi",
  5: "5 mi",
  10: "10 mi",
};

/**
 * Haversine distance between two points in miles.
 * @param lat1 - Latitude of point 1.
 * @param lng1 - Longitude of point 1.
 * @param lat2 - Latitude of point 2.
 * @param lng2 - Longitude of point 2.
 */
export function haversineDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Filters event IDs by distance from a center point.
 * @param eventIds - Event IDs to filter.
 * @param events - All events (for coordinate lookup).
 * @param center - [lng, lat] center point.
 * @param radiusMiles - Maximum distance in miles.
 */
export function filterEventsByDistance(
  eventIds: string[],
  events: EventEntry[],
  center: [number, number],
  radiusMiles: number,
): string[] {
  const eventMap = new Map(events.map((e) => [e.id, e]));
  return eventIds.filter((id) => {
    const event = eventMap.get(id);
    if (!event?.coordinates) return false;
    const [lng, lat] = event.coordinates as [number, number];
    return haversineDistanceMiles(center[1], center[0], lat, lng) <= radiusMiles;
  });
}

/**
 * Generates a GeoJSON circle polygon for rendering a radius on the map.
 * @param center - [lng, lat] center point.
 * @param radiusMiles - Radius in miles.
 * @param steps - Number of polygon vertices (default 64).
 */
export function createRadiusCircleGeoJSON(
  center: [number, number],
  radiusMiles: number,
  steps = 64,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const radiusKm = radiusMiles * 1.60934;
  const coords: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * Math.sin(angle);
    const lat = center[1] + (dy / 111.32);
    const lng = center[0] + (dx / (111.32 * Math.cos((center[1] * Math.PI) / 180)));
    coords.push([lng, lat]);
  }

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coords],
    },
    properties: {},
  };
}

/**
 * Returns event IDs filtered by category and/or custom date range.
 * @param events - All available events.
 * @param options - Filter options.
 * @returns Array of matching event IDs.
 */
export function getEventsForFilters(
  events: EventEntry[],
  options: {
    preset?: DatePreset;
    category?: string;
    dateRange?: { start: Date; end: Date };
  },
): string[] {
  const { preset = "all", category, dateRange } = options;
  const now = new Date();

  return events
    .filter((event) => {
      // Category filter
      if (category && event.category !== category) return false;

      // Custom date range takes precedence over preset
      if (dateRange) {
        const eventDate = new Date(event.startDate);
        return isInDateRange(eventDate, dateRange.start, dateRange.end);
      }

      // Date preset filter
      if (preset === "all") return true;
      const eventDate = new Date(event.startDate);
      switch (preset) {
        case "today":
          return isSameDay(eventDate, now);
        case "weekend":
          return isThisWeekend(eventDate);
        case "week":
          return isThisWeek(eventDate);
        case "month":
          return isThisMonth(eventDate);
      }
    })
    .map((event) => event.id);
}
