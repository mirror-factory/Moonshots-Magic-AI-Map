/**
 * @module tests/integration/api/live-events-route
 * Tests for the `GET /api/events/live` endpoint.
 */

import { GET } from "@/app/api/events/live/route";

describe("GET /api/events/live", () => {
  it("returns a JSON response with events array", async () => {
    const res = await GET();
    const data = await res.json();

    expect(data).toHaveProperty("events");
    expect(data).toHaveProperty("count");
    expect(data).toHaveProperty("timestamp");
    expect(Array.isArray(data.events)).toBe(true);
  });

  it("returns a count matching events array length", async () => {
    const res = await GET();
    const data = await res.json();

    expect(data.count).toBe(data.events.length);
  });

  it("returns events with required fields", async () => {
    const res = await GET();
    const data = await res.json();

    if (data.events.length > 0) {
      const event = data.events[0];
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("category");
      expect(event).toHaveProperty("coordinates");
      expect(event).toHaveProperty("venue");
    }
  });

  it("has Cache-Control header for 5-minute caching", async () => {
    const res = await GET();
    const cacheControl = res.headers.get("Cache-Control");

    expect(cacheControl).toContain("max-age=300");
    expect(cacheControl).toContain("stale-while-revalidate=60");
  });

  it("returns a valid ISO timestamp", async () => {
    const res = await GET();
    const data = await res.json();

    const parsed = new Date(data.timestamp);
    expect(parsed.toISOString()).toBe(data.timestamp);
  });

  it("returns no duplicate event IDs", async () => {
    const res = await GET();
    const data = await res.json();

    const ids = data.events.map((e: { id: string }) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
