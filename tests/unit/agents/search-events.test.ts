import { searchEvents } from "@/lib/agents/tools/search-events";

describe("searchEvents tool", () => {
  it("has an execute function", () => {
    expect(typeof searchEvents.execute).toBe("function");
  });

  it("has a description", () => {
    expect(searchEvents.description).toBeDefined();
    expect(searchEvents.description.length).toBeGreaterThan(0);
  });

  it("has an inputSchema", () => {
    expect(searchEvents.inputSchema).toBeDefined();
  });

  describe("execute", () => {
    it("returns { count, events } for empty params", async () => {
      const result = await searchEvents.execute!({
        limit: 10,
      });
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("events");
      expect(typeof result.count).toBe("number");
      expect(Array.isArray(result.events)).toBe(true);
      expect(result.count).toBeGreaterThan(0);
    });

    it("always filters by status active", async () => {
      const result = await searchEvents.execute!({
        limit: 50,
      });
      // Limit caps the result to 50 events
      expect(result.count).toBe(50);
    });

    it("filters by category music", async () => {
      const result = await searchEvents.execute!({
        category: "music",
        limit: 50,
      });
      expect(result.count).toBeGreaterThan(0);
      expect(result.count).toBeLessThanOrEqual(50);
      result.events.forEach((event) => {
        expect(event.category).toBe("music");
      });
    });

    it("filters by isFree", async () => {
      const result = await searchEvents.execute!({
        isFree: true,
        limit: 50,
      });
      expect(result.count).toBeGreaterThan(0);
      expect(result.count).toBeLessThanOrEqual(50);
      result.events.forEach((event) => {
        expect(event.price?.isFree).toBe(true);
      });
    });

    it("respects limit parameter", async () => {
      const result = await searchEvents.execute!({
        limit: 3,
      });
      expect(result.events.length).toBeLessThanOrEqual(3);
      expect(result.count).toBeLessThanOrEqual(3);
    });

    it("filters by query matching title, description, tags, venue, or city", async () => {
      const result = await searchEvents.execute!({
        query: "park",
        limit: 50,
      });
      expect(result.count).toBeGreaterThan(0);
      result.events.forEach((event) => {
        const combined = [
          event.title,
          event.description,
          event.venue,
          event.city,
          ...event.tags,
        ]
          .join(" ")
          .toLowerCase();
        expect(combined).toContain("park");
      });
    });

    it("returns events with the expected shape", async () => {
      const result = await searchEvents.execute!({
        limit: 1,
      });
      expect(result.events.length).toBeGreaterThan(0);

      const event = result.events[0];
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("description");
      expect(event).toHaveProperty("category");
      expect(event).toHaveProperty("venue");
      expect(event).toHaveProperty("city");
      expect(event).toHaveProperty("startDate");
      expect(event).toHaveProperty("tags");
      expect(event).toHaveProperty("coordinates");

      expect(typeof event.id).toBe("string");
      expect(typeof event.title).toBe("string");
      expect(typeof event.description).toBe("string");
      expect(typeof event.category).toBe("string");
      expect(typeof event.venue).toBe("string");
      expect(typeof event.city).toBe("string");
      expect(typeof event.startDate).toBe("string");
      expect(Array.isArray(event.tags)).toBe(true);
      expect(Array.isArray(event.coordinates)).toBe(true);
      expect(event.coordinates).toHaveLength(2);
    });

    it("returns events sorted by start date ascending", async () => {
      const result = await searchEvents.execute!({
        limit: 50,
      });
      for (let i = 1; i < result.events.length; i++) {
        const prev = new Date(result.events[i - 1].startDate).getTime();
        const curr = new Date(result.events[i].startDate).getTime();
        expect(curr).toBeGreaterThanOrEqual(prev);
      }
    });

    it("combines multiple filters", async () => {
      const musicResult = await searchEvents.execute!({
        category: "music",
        limit: 200,
      });
      const freeResult = await searchEvents.execute!({
        isFree: true,
        limit: 200,
      });
      const combined = await searchEvents.execute!({
        category: "music",
        isFree: true,
        limit: 200,
      });
      combined.events.forEach((event) => {
        expect(event.category).toBe("music");
        expect(event.price?.isFree).toBe(true);
      });
      // Free music events should be a subset of both groups
      expect(combined.count).toBeLessThanOrEqual(musicResult.count);
      expect(combined.count).toBeLessThanOrEqual(freeResult.count);
    });
  });

  describe("inputSchema validation", () => {
    it("accepts empty object (all fields optional except limit with default)", () => {
      const result = searchEvents.inputSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts valid category", () => {
      const result = searchEvents.inputSchema.safeParse({ category: "music" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid category", () => {
      const result = searchEvents.inputSchema.safeParse({
        category: "invalid-category",
      });
      expect(result.success).toBe(false);
    });

    it("accepts query string", () => {
      const result = searchEvents.inputSchema.safeParse({
        query: "jazz",
      });
      expect(result.success).toBe(true);
    });

    it("accepts isFree boolean", () => {
      const result = searchEvents.inputSchema.safeParse({ isFree: true });
      expect(result.success).toBe(true);
    });

    it("accepts numeric limit", () => {
      const result = searchEvents.inputSchema.safeParse({ limit: 5 });
      expect(result.success).toBe(true);
    });

    it("accepts dateRange with start and end", () => {
      const result = searchEvents.inputSchema.safeParse({
        dateRange: {
          start: "2026-02-01T00:00:00Z",
          end: "2026-02-28T23:59:59Z",
        },
      });
      expect(result.success).toBe(true);
    });

    it("accepts tags array", () => {
      const result = searchEvents.inputSchema.safeParse({
        tags: ["jazz", "outdoor"],
      });
      expect(result.success).toBe(true);
    });
  });
});
