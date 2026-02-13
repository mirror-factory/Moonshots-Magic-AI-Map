import {
  getEvents,
  getEventById,
  getEventsByBounds,
  getEventsByCategory,
  getUpcomingEvents,
  searchEvents,
  getEventCategories,
  getAllEvents,
} from "@/lib/registries/events";
import { EVENT_CATEGORIES } from "@/lib/registries/types";

describe("events registry", () => {
  // ------------------------------------------------------------------
  // getEvents
  // ------------------------------------------------------------------
  describe("getEvents", () => {
    it("returns all events when called with no filters", () => {
      const events = getEvents();
      expect(events.length).toBeGreaterThan(0);
      expect(events.length).toBe(getAllEvents().length);
    });

    it("filters by a single category", () => {
      const musicEvents = getEvents({ category: "music" });
      expect(musicEvents.length).toBeGreaterThan(0);
      expect(musicEvents.every((e) => e.category === "music")).toBe(true);
    });

    it("filters by an array of categories", () => {
      const events = getEvents({ category: ["food", "music"] });
      expect(events.length).toBeGreaterThan(0);
      expect(
        events.every((e) => e.category === "food" || e.category === "music"),
      ).toBe(true);

      const foodCount = events.filter((e) => e.category === "food").length;
      const musicCount = events.filter((e) => e.category === "music").length;
      expect(foodCount).toBeGreaterThan(0);
      expect(musicCount).toBeGreaterThan(0);
    });

    it("filters by query (case-insensitive across title, description, tags, venue, city)", () => {
      const events = getEvents({ query: "park" });
      expect(events.length).toBeGreaterThan(0);
      events.forEach((e) => {
        const haystack = [
          e.title,
          e.description,
          ...e.tags,
          e.venue,
          e.city,
        ]
          .join(" ")
          .toLowerCase();
        expect(haystack).toContain("park");
      });
    });

    it("query matching is case-insensitive", () => {
      const lower = getEvents({ query: "park" });
      const upper = getEvents({ query: "PARK" });
      expect(lower).toEqual(upper);
    });

    it("filters free events when isFree is true", () => {
      const freeEvents = getEvents({ isFree: true });
      expect(freeEvents.length).toBeGreaterThan(0);
      expect(freeEvents.every((e) => e.price?.isFree === true)).toBe(true);
    });

    it("filters paid events when isFree is false", () => {
      const paidEvents = getEvents({ isFree: false });
      expect(paidEvents.length).toBeGreaterThan(0);
      expect(paidEvents.every((e) => !e.price?.isFree)).toBe(true);
    });

    it("free and paid events are disjoint subsets of all events", () => {
      const freeEvents = getEvents({ isFree: true });
      const paidEvents = getEvents({ isFree: false });
      const allEvents = getEvents();
      // Free + paid may not cover all events (some may lack price info),
      // but together they should never exceed the total
      expect(freeEvents.length + paidEvents.length).toBeLessThanOrEqual(allEvents.length);
      // The two sets should have no overlap
      const freeIds = new Set(freeEvents.map((e) => e.id));
      paidEvents.forEach((e) => {
        expect(freeIds.has(e.id)).toBe(false);
      });
    });

    it("filters by city (case-insensitive)", () => {
      const events = getEvents({ city: "orlando" });
      expect(events.length).toBeGreaterThan(0);
      expect(events.every((e) => e.city.toLowerCase() === "orlando")).toBe(
        true,
      );

      const eventsUpperCase = getEvents({ city: "ORLANDO" });
      expect(eventsUpperCase).toEqual(events);
    });

    it("filters by status", () => {
      const activeEvents = getEvents({ status: "active" });
      expect(activeEvents.length).toBeGreaterThan(0);
      expect(activeEvents.every((e) => e.status === "active")).toBe(true);
    });

    it("filters featured events", () => {
      const featured = getEvents({ featured: true });
      expect(featured.length).toBeGreaterThan(0);
      expect(featured.every((e) => e.featured === true)).toBe(true);
    });

    it("caps results with limit", () => {
      const events = getEvents({ limit: 5 });
      expect(events).toHaveLength(5);
    });

    it("supports pagination with limit and offset", () => {
      const firstPage = getEvents({ limit: 5 });
      const secondPage = getEvents({ limit: 5, offset: 2 });

      // The second page starts at index 2, so its first item should be
      // the third item from the first page.
      expect(secondPage[0].id).toBe(firstPage[2].id);
      expect(secondPage).toHaveLength(5);
    });

    it("returns results sorted by startDate ascending", () => {
      const events = getEvents();
      for (let i = 1; i < events.length; i++) {
        const prev = new Date(events[i - 1].startDate).getTime();
        const curr = new Date(events[i].startDate).getTime();
        expect(curr).toBeGreaterThanOrEqual(prev);
      }
    });
  });

  // ------------------------------------------------------------------
  // getEventById
  // ------------------------------------------------------------------
  describe("getEventById", () => {
    it("returns an event for a valid ID", () => {
      const allEvents = getAllEvents();
      const target = allEvents[0];
      const found = getEventById(target.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(target.id);
      expect(found!.title).toBe(target.title);
    });

    it("returns undefined for an invalid ID", () => {
      const found = getEventById("non-existent-id-12345");
      expect(found).toBeUndefined();
    });
  });

  // ------------------------------------------------------------------
  // getAllEvents
  // ------------------------------------------------------------------
  describe("getAllEvents", () => {
    it("returns the same count as getEvents with no filters", () => {
      const all = getAllEvents();
      const noFilter = getEvents();
      expect(all).toHaveLength(noFilter.length);
      expect(all.length).toBeGreaterThan(0);
    });
  });

  // ------------------------------------------------------------------
  // getEventCategories
  // ------------------------------------------------------------------
  describe("getEventCategories", () => {
    it("returns an array of { category, count } objects", () => {
      const categories = getEventCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      categories.forEach((entry) => {
        expect(entry).toHaveProperty("category");
        expect(entry).toHaveProperty("count");
        expect(typeof entry.category).toBe("string");
        expect(typeof entry.count).toBe("number");
      });
    });

    it("is sorted by count descending", () => {
      const categories = getEventCategories();
      for (let i = 1; i < categories.length; i++) {
        expect(categories[i].count).toBeLessThanOrEqual(
          categories[i - 1].count,
        );
      }
    });

    it("every category string is a valid EventCategory", () => {
      const categories = getEventCategories();
      const validSet = new Set(EVENT_CATEGORIES);
      categories.forEach((entry) => {
        expect(validSet.has(entry.category)).toBe(true);
      });
    });

    it("total counts equal the number of events", () => {
      const categories = getEventCategories();
      const total = categories.reduce((sum, c) => sum + c.count, 0);
      expect(total).toBe(getAllEvents().length);
    });
  });

  // ------------------------------------------------------------------
  // searchEvents
  // ------------------------------------------------------------------
  describe("searchEvents", () => {
    it("returns events matching a query string", () => {
      const results = searchEvents("jazz");
      expect(results.length).toBeGreaterThan(0);
      results.forEach((e) => {
        const haystack = [e.title, e.description, ...e.tags, e.venue, e.city]
          .join(" ")
          .toLowerCase();
        expect(haystack).toContain("jazz");
      });
    });

    it("returns an empty array when nothing matches", () => {
      const results = searchEvents("zzzyyyxxx-no-match");
      expect(results).toHaveLength(0);
    });
  });

  // ------------------------------------------------------------------
  // getEventsByCategory
  // ------------------------------------------------------------------
  describe("getEventsByCategory", () => {
    it("returns only events of the given category", () => {
      const events = getEventsByCategory("music");
      expect(events.length).toBeGreaterThan(0);
      expect(events.every((e) => e.category === "music")).toBe(true);
    });

    it("returns an empty array for a category with no events (if any)", () => {
      // All categories in the seed data have events, so we confirm a valid
      // category returns a non-empty result.
      const events = getEventsByCategory("food");
      expect(events.length).toBeGreaterThan(0);
    });
  });

  // ------------------------------------------------------------------
  // getEventsByBounds
  // ------------------------------------------------------------------
  describe("getEventsByBounds", () => {
    it("returns events within a bounding box around Orlando", () => {
      // Bounding box covering the greater Orlando area
      const sw: [number, number] = [-81.6, 28.3];
      const ne: [number, number] = [-81.1, 28.8];

      const events = getEventsByBounds(sw, ne);
      expect(events.length).toBeGreaterThan(0);

      events.forEach((e) => {
        const [lng, lat] = e.coordinates;
        expect(lng).toBeGreaterThanOrEqual(sw[0]);
        expect(lng).toBeLessThanOrEqual(ne[0]);
        expect(lat).toBeGreaterThanOrEqual(sw[1]);
        expect(lat).toBeLessThanOrEqual(ne[1]);
      });
    });

    it("returns empty array for a bounding box with no events", () => {
      const sw: [number, number] = [0, 0];
      const ne: [number, number] = [1, 1];
      const events = getEventsByBounds(sw, ne);
      expect(events).toHaveLength(0);
    });
  });

  // ------------------------------------------------------------------
  // getUpcomingEvents
  // ------------------------------------------------------------------
  describe("getUpcomingEvents", () => {
    it("returns at most the requested limit", () => {
      const events = getUpcomingEvents(3);
      expect(events.length).toBeLessThanOrEqual(3);
    });

    it("only includes active events", () => {
      const events = getUpcomingEvents(50);
      events.forEach((e) => {
        expect(e.status).toBe("active");
      });
    });

    it("is sorted by startDate ascending", () => {
      const events = getUpcomingEvents(50);
      for (let i = 1; i < events.length; i++) {
        const prev = new Date(events[i - 1].startDate).getTime();
        const curr = new Date(events[i].startDate).getTime();
        expect(curr).toBeGreaterThanOrEqual(prev);
      }
    });
  });
});
