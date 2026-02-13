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
