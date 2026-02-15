import { rankEvents } from "@/lib/agents/tools/rank-events";
import { getAllEvents } from "@/lib/registries/events";

describe("rankEvents tool", () => {
  it("has an execute function", () => {
    expect(typeof rankEvents.execute).toBe("function");
  });

  it("has a description", () => {
    expect(rankEvents.description).toBeDefined();
    expect(rankEvents.description.length).toBeGreaterThan(0);
  });

  it("has an inputSchema", () => {
    expect(rankEvents.inputSchema).toBeDefined();
  });

  describe("execute", () => {
    it("returns { events, criteria, requestedLimit } for valid IDs", async () => {
      const allEvents = getAllEvents();
      const ids = allEvents.slice(0, 3).map((e) => e.id);

      const result = await rankEvents.execute!({
        eventIds: ids,
        criteria: "best for families",
        limit: 5,
      });

      expect(result).toHaveProperty("events");
      expect(result).toHaveProperty("criteria", "best for families");
      expect(result).toHaveProperty("requestedLimit", 5);
      expect(Array.isArray(result.events)).toBe(true);
      expect(result.events.length).toBe(3);
    });

    it("filters out invalid event IDs", async () => {
      const allEvents = getAllEvents();
      const validId = allEvents[0].id;
      const invalidId = "nonexistent-uuid-999";

      const result = await rankEvents.execute!({
        eventIds: [validId, invalidId],
        criteria: "date night",
        limit: 5,
      });

      expect(result.events.length).toBe(1);
      expect(result.events[0].id).toBe(validId);
      // Ensure no undefined entries sneaked through
      result.events.forEach((event) => {
        expect(event).toBeDefined();
        expect(event.id).toBeDefined();
      });
    });

    it("returns empty events array when all IDs are invalid", async () => {
      const result = await rankEvents.execute!({
        eventIds: ["bad-id-1", "bad-id-2"],
        criteria: "anything",
        limit: 5,
      });

      expect(result.events).toEqual([]);
      expect(result.criteria).toBe("anything");
      expect(result.requestedLimit).toBe(5);
    });

    it("caps results at the requested limit", async () => {
      const allEvents = getAllEvents();
      const ids = allEvents.slice(0, 10).map((e) => e.id);

      const result = await rankEvents.execute!({
        eventIds: ids,
        criteria: "top picks",
        limit: 3,
      });

      expect(result.events.length).toBeLessThanOrEqual(3);
      expect(result.requestedLimit).toBe(3);
    });

    it("returns events with expected shape", async () => {
      const allEvents = getAllEvents();
      const ids = allEvents.slice(0, 2).map((e) => e.id);

      const result = await rankEvents.execute!({
        eventIds: ids,
        criteria: "outdoor fun",
        limit: 5,
      });

      result.events.forEach((event) => {
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
        expect(typeof event.category).toBe("string");
        expect(Array.isArray(event.tags)).toBe(true);
        expect(Array.isArray(event.coordinates)).toBe(true);
        expect(event.coordinates).toHaveLength(2);
      });
    });

    it("preserves criteria string verbatim", async () => {
      const allEvents = getAllEvents();
      const criteria = "romantic evening with live music and waterfront views";

      const result = await rankEvents.execute!({
        eventIds: [allEvents[0].id],
        criteria,
        limit: 5,
      });

      expect(result.criteria).toBe(criteria);
    });
  });

  describe("inputSchema validation", () => {
    it("accepts valid input with eventIds, criteria, and limit", () => {
      const result = rankEvents.inputSchema.safeParse({
        eventIds: ["id-1", "id-2"],
        criteria: "best for kids",
        limit: 3,
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing eventIds", () => {
      const result = rankEvents.inputSchema.safeParse({
        criteria: "fun",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing criteria", () => {
      const result = rankEvents.inputSchema.safeParse({
        eventIds: ["id-1"],
      });
      expect(result.success).toBe(false);
    });

    it("uses default limit when not provided", () => {
      const result = rankEvents.inputSchema.safeParse({
        eventIds: ["id-1"],
        criteria: "fun",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(5);
      }
    });
  });
});
