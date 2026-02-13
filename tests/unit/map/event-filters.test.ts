/**
 * @module tests/unit/map/event-filters
 * Tests for date-range filter utilities.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isSameDay,
  isThisWeekend,
  isThisWeek,
  isThisMonth,
  isInDateRange,
  getEventsForPreset,
  getEventsForFilters,
  DATE_PRESET_LABELS,
} from "@/lib/map/event-filters";
import type { EventEntry } from "@/lib/registries/types";

/** Create a minimal event with a given start date. */
function makeEvent(id: string, startDate: string, category = "music" as EventEntry["category"]): EventEntry {
  return {
    id,
    title: `Event ${id}`,
    description: "",
    category,
    coordinates: [-81.38, 28.54],
    venue: "Test Venue",
    address: "123 Test St",
    city: "Orlando",
    region: "Central Florida",
    startDate,
    timezone: "America/New_York",
    tags: [],
    source: { type: "manual", fetchedAt: new Date().toISOString() },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
  };
}

describe("event-filters", () => {
  describe("DATE_PRESET_LABELS", () => {
    it("has labels for all presets", () => {
      expect(DATE_PRESET_LABELS.all).toBe("All");
      expect(DATE_PRESET_LABELS.today).toBe("Today");
      expect(DATE_PRESET_LABELS.weekend).toBe("Weekend");
      expect(DATE_PRESET_LABELS.week).toBe("This Week");
      expect(DATE_PRESET_LABELS.month).toBe("This Month");
    });
  });

  describe("isSameDay", () => {
    it("returns true for the same day", () => {
      const a = new Date(2026, 1, 12, 10, 0);
      const b = new Date(2026, 1, 12, 22, 30);
      expect(isSameDay(a, b)).toBe(true);
    });

    it("returns false for different days", () => {
      const a = new Date(2026, 1, 12);
      const b = new Date(2026, 1, 13);
      expect(isSameDay(a, b)).toBe(false);
    });

    it("returns false for same day different month", () => {
      const a = new Date(2026, 1, 12);
      const b = new Date(2026, 2, 12);
      expect(isSameDay(a, b)).toBe(false);
    });
  });

  describe("isThisWeekend", () => {
    beforeEach(() => {
      // Mock to Wednesday Feb 12, 2026
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 12, 12, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns true for Saturday of current week", () => {
      const sat = new Date(2026, 1, 14, 20, 0); // Sat Feb 14
      expect(isThisWeekend(sat)).toBe(true);
    });

    it("returns true for Sunday of current week", () => {
      const sun = new Date(2026, 1, 15, 10, 0); // Sun Feb 15
      expect(isThisWeekend(sun)).toBe(true);
    });

    it("returns false for a weekday", () => {
      const wed = new Date(2026, 1, 12, 12, 0);
      expect(isThisWeekend(wed)).toBe(false);
    });

    it("returns false for next weekend", () => {
      const nextSat = new Date(2026, 1, 21, 12, 0);
      expect(isThisWeekend(nextSat)).toBe(false);
    });
  });

  describe("isThisWeek", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 12, 12, 0)); // Thursday Feb 12
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns true for a day in the current Mon-Sun week", () => {
      const mon = new Date(2026, 1, 9, 12, 0); // Mon Feb 9
      expect(isThisWeek(mon)).toBe(true);
    });

    it("returns true for Sunday of current week", () => {
      const sun = new Date(2026, 1, 15, 23, 0); // Sun Feb 15
      expect(isThisWeek(sun)).toBe(true);
    });

    it("returns false for last week", () => {
      const lastWeek = new Date(2026, 1, 7, 12, 0); // Fri Feb 7
      expect(isThisWeek(lastWeek)).toBe(false);
    });

    it("returns false for next week", () => {
      const nextWeek = new Date(2026, 1, 16, 12, 0); // Mon Feb 16
      expect(isThisWeek(nextWeek)).toBe(false);
    });
  });

  describe("isThisMonth", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 12));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns true for a date in the same month", () => {
      expect(isThisMonth(new Date(2026, 1, 28))).toBe(true);
    });

    it("returns false for a different month", () => {
      expect(isThisMonth(new Date(2026, 2, 1))).toBe(false);
    });
  });

  describe("isInDateRange", () => {
    it("returns true for date within range", () => {
      const date = new Date(2026, 1, 15);
      const start = new Date(2026, 1, 10);
      const end = new Date(2026, 1, 20);
      expect(isInDateRange(date, start, end)).toBe(true);
    });

    it("returns true for date at start of range", () => {
      const start = new Date(2026, 1, 10);
      expect(isInDateRange(start, start, new Date(2026, 1, 20))).toBe(true);
    });

    it("returns true for date at end of range", () => {
      const end = new Date(2026, 1, 20);
      expect(isInDateRange(end, new Date(2026, 1, 10), end)).toBe(true);
    });

    it("returns false for date outside range", () => {
      const date = new Date(2026, 1, 25);
      expect(isInDateRange(date, new Date(2026, 1, 10), new Date(2026, 1, 20))).toBe(false);
    });
  });

  describe("getEventsForPreset", () => {
    const events = [
      makeEvent("1", "2026-02-12T10:00:00Z"),
      makeEvent("2", "2026-02-14T20:00:00Z"), // Saturday
      makeEvent("3", "2026-03-01T10:00:00Z"),
    ];

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 12, 12, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns all event IDs for 'all' preset", () => {
      expect(getEventsForPreset(events, "all")).toEqual(["1", "2", "3"]);
    });

    it("returns only today's events for 'today' preset", () => {
      const ids = getEventsForPreset(events, "today");
      expect(ids).toContain("1");
      expect(ids).not.toContain("3");
    });

    it("returns this month's events for 'month' preset", () => {
      const ids = getEventsForPreset(events, "month");
      expect(ids).toContain("1");
      expect(ids).toContain("2");
      expect(ids).not.toContain("3");
    });
  });

  describe("getEventsForFilters", () => {
    const events = [
      makeEvent("1", "2026-02-12T10:00:00Z", "music"),
      makeEvent("2", "2026-02-14T20:00:00Z", "food"),
      makeEvent("3", "2026-03-01T10:00:00Z", "music"),
    ];

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 12, 12, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("filters by category", () => {
      const ids = getEventsForFilters(events, { category: "music" });
      expect(ids).toEqual(["1", "3"]);
    });

    it("filters by custom date range", () => {
      const ids = getEventsForFilters(events, {
        dateRange: {
          start: new Date(2026, 1, 13),
          end: new Date(2026, 2, 5),
        },
      });
      expect(ids).toEqual(["2", "3"]);
    });

    it("combines category and date range", () => {
      const ids = getEventsForFilters(events, {
        category: "music",
        dateRange: {
          start: new Date(2026, 1, 13),
          end: new Date(2026, 2, 5),
        },
      });
      expect(ids).toEqual(["3"]);
    });

    it("uses preset when no date range", () => {
      const ids = getEventsForFilters(events, { preset: "month" });
      expect(ids).toContain("1");
      expect(ids).toContain("2");
      expect(ids).not.toContain("3");
    });
  });
});
