import { describe, it, expect } from "vitest";
import {
  lookupScraperVenueCoords,
  generateScrapedId,
  buildScrapedEvent,
} from "../../../scripts/sync-events/normalizers/scraper-normalizer";

describe("lookupScraperVenueCoords", () => {
  it("finds known venues from canonical registry", () => {
    expect(lookupScraperVenueCoords("Dr. Phillips Center")).toEqual([-81.3762, 28.5386]);
    expect(lookupScraperVenueCoords("Amway Center")).toEqual([-81.3839, 28.5392]);
    expect(lookupScraperVenueCoords("Lake Eola Park")).toEqual([-81.3734, 28.5432]);
  });

  it("matches partial venue names (case-insensitive)", () => {
    expect(lookupScraperVenueCoords("Event at Lake Eola")).toEqual([-81.3734, 28.5432]);
    expect(lookupScraperVenueCoords("THE SOCIAL")).toEqual([-81.3787, 28.542]);
  });

  it("returns default coordinates for unknown venues", () => {
    expect(lookupScraperVenueCoords("Random Unknown Place")).toEqual([-81.3792, 28.5383]);
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
  it("creates a valid EventEntry with prefixed ID", async () => {
    const event = await buildScrapedEvent(
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

  it("infers category from text", async () => {
    const event = await buildScrapedEvent(
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

  it("uses canonical venue lookup for coordinates", async () => {
    const event = await buildScrapedEvent(
      {
        title: "Comedy at Wall Street",
        description: "Stand-up comedy",
        startDate: "2026-04-01T21:00:00Z",
        venue: "Wall Street Plaza",
      },
      "co",
      "orlando.gov",
    );
    expect(event.coordinates).toEqual([-81.3789, 28.5418]);
  });

  it("defaults to Orlando coords for unknown venue", async () => {
    const event = await buildScrapedEvent(
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
