import { describe, it, expect } from "vitest";
import {
  lookupVenueCoords,
  generateScrapedId,
  buildScrapedEvent,
} from "../../../scripts/sync-events/normalizers/scraper-normalizer";

describe("lookupVenueCoords", () => {
  it("finds known venues", () => {
    expect(lookupVenueCoords("Dr. Phillips Center")).toEqual([-81.3792, 28.5383]);
    expect(lookupVenueCoords("Amway Center")).toEqual([-81.3839, 28.5392]);
    expect(lookupVenueCoords("Lake Eola Park")).toEqual([-81.373, 28.5431]);
  });

  it("matches partial venue names (case-insensitive)", () => {
    expect(lookupVenueCoords("Event at Lake Eola")).toEqual([-81.373, 28.5431]);
    expect(lookupVenueCoords("THE SOCIAL")).toEqual([-81.3787, 28.542]);
  });

  it("returns default coordinates for unknown venues", () => {
    expect(lookupVenueCoords("Random Unknown Place")).toEqual([-81.3792, 28.5383]);
  });
});

describe("generateScrapedId", () => {
  it("generates an 8-char hex string", () => {
    const id = generateScrapedId("Jazz Night", "2026-03-15");
    expect(id).toMatch(/^[0-9a-f]{8}$/);
  });

  it("is deterministic (same input = same output)", () => {
    const a = generateScrapedId("Jazz Night", "2026-03-15");
    const b = generateScrapedId("Jazz Night", "2026-03-15");
    expect(a).toBe(b);
  });

  it("produces different IDs for different inputs", () => {
    const a = generateScrapedId("Jazz Night", "2026-03-15");
    const b = generateScrapedId("Rock Show", "2026-03-15");
    expect(a).not.toBe(b);
  });
});

describe("buildScrapedEvent", () => {
  it("creates a valid EventEntry with prefixed ID", () => {
    const event = buildScrapedEvent(
      {
        title: "Art Walk",
        description: "Monthly art walk in downtown Orlando",
        startDate: "2026-03-01T18:00:00Z",
        venue: "Mills 50",
      },
      "ow",
      "community.orlandoweekly.com",
    );

    expect(event.id).toMatch(/^ow-[0-9a-f]{8}$/);
    expect(event.title).toBe("Art Walk");
    expect(event.source.type).toBe("scraper");
    if (event.source.type === "scraper") {
      expect(event.source.site).toBe("community.orlandoweekly.com");
    }
    expect(event.status).toBe("active");
    expect(event.timezone).toBe("America/New_York");
  });

  it("infers category from text", () => {
    const event = buildScrapedEvent(
      {
        title: "Live Jazz Concert",
        description: "Enjoy live jazz",
        startDate: "2026-03-01T20:00:00Z",
        venue: "The Social",
      },
      "ow",
      "orlandoweekly.com",
    );
    expect(event.category).toBe("music");
  });

  it("uses venue lookup for coordinates", () => {
    const event = buildScrapedEvent(
      {
        title: "Comedy at Wall Street",
        description: "Stand-up comedy",
        startDate: "2026-04-01T21:00:00Z",
        venue: "Wall Street Plaza",
      },
      "co",
      "orlando.gov",
    );
    expect(event.coordinates).toEqual([-81.3785, 28.5418]);
  });

  it("defaults to Orlando coords for unknown venue", () => {
    const event = buildScrapedEvent(
      {
        title: "Mystery Event",
        description: "Who knows",
        startDate: "2026-05-01T12:00:00Z",
        venue: "Some Random Place",
      },
      "vo",
      "visitorlando.com",
    );
    expect(event.coordinates).toEqual([-81.3792, 28.5383]);
  });
});
