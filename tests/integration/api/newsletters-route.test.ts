import { GET } from "@/app/api/newsletters/route";
import { NextRequest } from "next/server";

describe("GET /api/newsletters", () => {
  it("returns all entries when called with no params", async () => {
    const req = new NextRequest("http://localhost:3000/api/newsletters");
    const res = await GET(req);
    const data = await res.json();

    expect(data).toHaveProperty("count");
    expect(data).toHaveProperty("entries");
    expect(Array.isArray(data.entries)).toBe(true);
    expect(data.count).toBe(data.entries.length);
    expect(data.count).toBeGreaterThan(0);
  });

  it("filters by text search with ?query=orlando", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/newsletters?query=orlando",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(data.entries)).toBe(true);
    data.entries.forEach((entry: any) => {
      const haystack = [
        entry.title,
        entry.summary,
        entry.content,
        ...(entry.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      expect(haystack).toContain("orlando");
    });
  });

  it("filters by category with ?category=food", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/newsletters?category=food",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(data.entries)).toBe(true);
    data.entries.forEach((entry: any) => {
      expect(entry.category).toBe("food");
    });
  });

  it("caps results with ?limit=3", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/newsletters?limit=3",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(data.count).toBeLessThanOrEqual(3);
    expect(data.entries.length).toBeLessThanOrEqual(3);
  });

  it("response has count and entries array", async () => {
    const req = new NextRequest("http://localhost:3000/api/newsletters");
    const res = await GET(req);

    expect(res.headers.get("content-type")).toContain("application/json");

    const data = await res.json();
    expect(typeof data.count).toBe("number");
    expect(Array.isArray(data.entries)).toBe(true);
  });
});
