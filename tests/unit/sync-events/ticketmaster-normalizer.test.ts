import { describe, it, expect } from "vitest";
import {
  normalizeTmEvent,
  type TmEvent,
} from "../../../scripts/sync-events/normalizers/ticketmaster-normalizer";

function makeTmEvent(overrides: Partial<TmEvent> = {}): TmEvent {
  return {
    id: "G5v0Z9gHcK7dP",
    name: "Test Concert",
    url: "https://ticketmaster.com/event/G5v0Z9gHcK7dP",
    dates: {
      start: { dateTime: "2026-03-15T20:00:00Z" },
      end: { dateTime: "2026-03-15T23:00:00Z" },
      timezone: "America/New_York",
    },
    info: "A great concert in downtown Orlando.",
    classifications: [
      {
        segment: { name: "Music" },
        genre: { name: "Rock" },
        subGenre: { name: "Alternative" },
      },
    ],
    images: [
      { url: "https://img.tm.com/small.jpg", width: 100, ratio: "16_9" },
      { url: "https://img.tm.com/large.jpg", width: 1024, ratio: "16_9" },
    ],
    priceRanges: [{ min: 25, max: 75, currency: "USD" }],
    _embedded: {
      venues: [
        {
          name: "The Social",
          address: { line1: "54 N Orange Ave" },
          city: { name: "Orlando" },
          state: { name: "Florida", stateCode: "FL" },
          location: { longitude: "-81.3787", latitude: "28.5420" },
          timezone: "America/New_York",
        },
      ],
    },
    ...overrides,
  };
}

describe("normalizeTmEvent", () => {
  it("produces a valid EventEntry with tm- prefixed id", async () => {
    const result = await normalizeTmEvent(makeTmEvent());
    expect(result.id).toBe("tm-G5v0Z9gHcK7dP");
    expect(result.title).toBe("Test Concert");
    expect(result.source.type).toBe("ticketmaster");
  });

  it("maps coordinates from venue location", async () => {
    const result = await normalizeTmEvent(makeTmEvent());
    expect(result.coordinates).toEqual([-81.3787, 28.542]);
  });

  it("maps category from segment and genre", async () => {
    const result = await normalizeTmEvent(makeTmEvent());
    expect(result.category).toBe("music");
  });

  it("picks largest 16_9 image", async () => {
    const result = await normalizeTmEvent(makeTmEvent());
    expect(result.imageUrl).toBe("https://img.tm.com/large.jpg");
  });

  it("does not include price field", async () => {
    const result = await normalizeTmEvent(makeTmEvent());
    expect(result).not.toHaveProperty("price");
  });

  it("defaults coordinates when venue has no location", async () => {
    const result = await normalizeTmEvent(
      makeTmEvent({
        _embedded: {
          venues: [
            {
              name: "Unknown Place",
              city: { name: "Orlando" },
              state: { stateCode: "FL" },
            },
          ],
        },
      }),
    );
    expect(result.coordinates).toEqual([-81.3792, 28.5383]);
  });

  it("generates tags from genre and subGenre", async () => {
    const result = await normalizeTmEvent(makeTmEvent());
    expect(result.tags).toContain("rock");
    expect(result.tags).toContain("alternative");
  });

  it("infers region from city name", async () => {
    const result = await normalizeTmEvent(makeTmEvent());
    expect(result.region).toBe("Downtown Orlando");
  });

  it("infers region for Winter Park", async () => {
    const result = await normalizeTmEvent(
      makeTmEvent({
        _embedded: {
          venues: [
            {
              name: "Enzian Theater",
              city: { name: "Winter Park" },
              state: { stateCode: "FL" },
              location: { longitude: "-81.35", latitude: "28.60" },
            },
          ],
        },
      }),
    );
    expect(result.region).toBe("Winter Park");
  });

  it("preserves API-provided URL (ticketweb, universe, etc.)", async () => {
    const result = await normalizeTmEvent(
      makeTmEvent({ url: "https://www.ticketweb.com/some-event" }),
    );
    expect(result.url).toBe("https://www.ticketweb.com/some-event");
  });

  it("falls back to canonical URL when API provides no URL", async () => {
    const result = await normalizeTmEvent(
      makeTmEvent({ id: "Z7r9jZ1A7jsbp", url: undefined }),
    );
    expect(result.url).toBe("https://www.ticketmaster.com/event/Z7r9jZ1A7jsbp");
  });

  it("preserves universe.com URL for resale events", async () => {
    const result = await normalizeTmEvent(
      makeTmEvent({
        id: "Za5ju3rKuqZDdItOqg6-sAB_vvfjeNwwDM",
        url: "https://universe.com/events/some-event",
      }),
    );
    expect(result.url).toBe("https://universe.com/events/some-event");
  });

  it("uses API slug URL over constructed canonical URL", async () => {
    const result = await normalizeTmEvent(
      makeTmEvent({
        id: "G5v0Z9gHcK7dP",
        url: "https://www.ticketmaster.com/test-concert-orlando-florida-03-15-2026/event/22006433E4867433",
      }),
    );
    expect(result.url).toBe(
      "https://www.ticketmaster.com/test-concert-orlando-florida-03-15-2026/event/22006433E4867433",
    );
  });

  it("falls back to localDate when dateTime missing", async () => {
    const result = await normalizeTmEvent(
      makeTmEvent({
        dates: {
          start: { localDate: "2026-04-01", localTime: "19:00:00" },
          timezone: "America/New_York",
        },
      }),
    );
    expect(result.startDate).toBe("2026-04-01T19:00:00");
  });
});
