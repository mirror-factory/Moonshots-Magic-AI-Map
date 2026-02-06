import { GET } from "@/app/api/events/route";
import { NextRequest } from "next/server";

describe("GET /api/events", () => {
  it("returns all events when called with no params", async () => {
    const req = new NextRequest("http://localhost:3000/api/events");
    const res = await GET(req);
    const data = await res.json();

    expect(data).toHaveProperty("count");
    expect(data).toHaveProperty("events");
    expect(Array.isArray(data.events)).toBe(true);
    expect(data.count).toBe(data.events.length);
    expect(data.count).toBeGreaterThan(0);
  });

  it("filters by text search with ?query=music", async () => {
    const req = new NextRequest("http://localhost:3000/api/events?query=music");
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(data.events)).toBe(true);
    data.events.forEach((event: any) => {
      const haystack = [
        event.title,
        event.description,
        ...(event.tags ?? []),
        event.venue,
        event.city,
      ]
        .join(" ")
        .toLowerCase();
      expect(haystack).toContain("music");
    });
  });

  it("filters by category with ?category=food", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/events?category=food",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(data.events)).toBe(true);
    data.events.forEach((event: any) => {
      expect(event.category).toBe("food");
    });
  });

  it("handles CSV categories with ?category=food,music", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/events?category=food,music",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(data.events)).toBe(true);
    data.events.forEach((event: any) => {
      expect(["food", "music"]).toContain(event.category);
    });
  });

  it("filters for free events with ?isFree=true", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/events?isFree=true",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(data.events)).toBe(true);
    data.events.forEach((event: any) => {
      expect(event.price?.isFree).toBe(true);
    });
  });

  it("caps results with ?limit=5", async () => {
    const req = new NextRequest("http://localhost:3000/api/events?limit=5");
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeLessThanOrEqual(5);
    expect(data.events.length).toBeLessThanOrEqual(5);
  });

  it("handles pagination with ?limit=5&offset=2", async () => {
    const allReq = new NextRequest("http://localhost:3000/api/events");
    const allRes = await GET(allReq);
    const allData = await allRes.json();

    const req = new NextRequest(
      "http://localhost:3000/api/events?limit=5&offset=2",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeLessThanOrEqual(5);
    expect(Array.isArray(data.events)).toBe(true);

    // The first event of offset=2 should match the third event of the full list
    if (allData.events.length > 2 && data.events.length > 0) {
      expect(data.events[0].id).toBe(allData.events[2].id);
    }
  });

  it("response is valid JSON with count and events array", async () => {
    const req = new NextRequest("http://localhost:3000/api/events");
    const res = await GET(req);

    expect(res.headers.get("content-type")).toContain("application/json");

    const data = await res.json();
    expect(typeof data.count).toBe("number");
    expect(Array.isArray(data.events)).toBe(true);
  });
});
