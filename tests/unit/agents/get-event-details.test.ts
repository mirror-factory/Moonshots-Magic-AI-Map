import { getEventDetails } from "@/lib/agents/tools/get-event-details";
import { getAllEvents } from "@/lib/registries/events";

describe("getEventDetails tool", () => {
  it("has an execute function", () => {
    expect(typeof getEventDetails.execute).toBe("function");
  });

  it("has a description", () => {
    expect(getEventDetails.description).toBeDefined();
    expect(getEventDetails.description.length).toBeGreaterThan(0);
  });

  it("has an inputSchema", () => {
    expect(getEventDetails.inputSchema).toBeDefined();
  });

  describe("execute", () => {
    it("returns full event for a valid event ID", async () => {
      const allEvents = getAllEvents();
      expect(allEvents.length).toBeGreaterThan(0);

      const targetId = allEvents[0].id;
      const result = await getEventDetails.execute!({ eventId: targetId });

      expect(result).not.toHaveProperty("error");
      expect(result).toHaveProperty("id", targetId);
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("category");
      expect(result).toHaveProperty("coordinates");
      expect(result).toHaveProperty("venue");
      expect(result).toHaveProperty("city");
      expect(result).toHaveProperty("startDate");
      expect(result).toHaveProperty("tags");
      expect(result).toHaveProperty("status");
    });

    it("returns error object for an invalid event ID", async () => {
      const result = await getEventDetails.execute!({
        eventId: "nonexistent-uuid-000",
      });
      expect(result).toEqual({ error: "Event not found" });
    });

    it("returns the complete event object with all fields", async () => {
      const allEvents = getAllEvents();
      const targetId = allEvents[0].id;
      const result = await getEventDetails.execute!({ eventId: targetId });

      // The result should be the full EventEntry, not a slim projection
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("category");
      expect(result).toHaveProperty("coordinates");
      expect(result).toHaveProperty("venue");
      expect(result).toHaveProperty("address");
      expect(result).toHaveProperty("city");
      expect(result).toHaveProperty("region");
      expect(result).toHaveProperty("startDate");
      expect(result).toHaveProperty("timezone");
      expect(result).toHaveProperty("tags");
      expect(result).toHaveProperty("source");
      expect(result).toHaveProperty("createdAt");
      expect(result).toHaveProperty("updatedAt");
      expect(result).toHaveProperty("status");
    });

    it("returns matching data for a known event", async () => {
      const allEvents = getAllEvents();
      const expected = allEvents[0];
      const result = await getEventDetails.execute!({
        eventId: expected.id,
      });

      expect(result).toHaveProperty("title", expected.title);
      expect(result).toHaveProperty("category", expected.category);
      expect(result).toHaveProperty("venue", expected.venue);
      expect(result).toHaveProperty("city", expected.city);
    });

    it("returns different results for different valid IDs", async () => {
      const allEvents = getAllEvents();
      expect(allEvents.length).toBeGreaterThanOrEqual(2);

      const result1 = await getEventDetails.execute!({
        eventId: allEvents[0].id,
      });
      const result2 = await getEventDetails.execute!({
        eventId: allEvents[1].id,
      });

      expect(result1).toHaveProperty("id", allEvents[0].id);
      expect(result2).toHaveProperty("id", allEvents[1].id);
      expect((result1 as { id: string }).id).not.toBe(
        (result2 as { id: string }).id,
      );
    });
  });

  describe("inputSchema validation", () => {
    it("accepts valid eventId", () => {
      const result = getEventDetails.inputSchema.safeParse({
        eventId: "some-uuid-here",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing eventId", () => {
      const result = getEventDetails.inputSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("rejects non-string eventId", () => {
      const result = getEventDetails.inputSchema.safeParse({ eventId: 123 });
      expect(result.success).toBe(false);
    });
  });
});
