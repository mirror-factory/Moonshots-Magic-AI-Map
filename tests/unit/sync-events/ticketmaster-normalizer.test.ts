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
  it("produces a valid EventEntry with tm- prefixed id", () => {
    const result = normalizeTmEvent(makeTmEvent());
    expect(result.id).toBe("tm-G5v0Z9gHcK7dP");
    expect(result.title).toBe("Test Concert");
    expect(result.source.type).toBe("ticketmaster");
  });

  it("maps coordinates from venue location", () => {
    const result = normalizeTmEvent(makeTmEvent());
    expect(result.coordinates).toEqual([-81.3787, 28.542]);
  });

  it("maps category from segment and genre", () => {
    const result = normalizeTmEvent(makeTmEvent());
    expect(result.category).toBe("music");
  });

  it("picks largest 16_9 image", () => {
    const result = normalizeTmEvent(makeTmEvent());
    expect(result.imageUrl).toBe("https://img.tm.com/large.jpg");
  });

  it("maps price range correctly", () => {
    const result = normalizeTmEvent(makeTmEvent());
    expect(result.price).toEqual({
      min: 25,
      max: 75,
      currency: "USD",
      isFree: false,
    });
  });

  it("handles free events (no price range)", () => {
    const result = normalizeTmEvent(makeTmEvent({ priceRanges: undefined }));
    expect(result.price).toBeUndefined();
  });

  it("defaults coordinates when venue has no location", () => {
    const result = normalizeTmEvent(
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

  it("generates tags from genre and subGenre", () => {
    const result = normalizeTmEvent(makeTmEvent());
    expect(result.tags).toContain("rock");
    expect(result.tags).toContain("alternative");
  });

  it("infers region from city name", () => {
    const result = normalizeTmEvent(makeTmEvent());
    expect(result.region).toBe("Downtown Orlando");
  });

  it("infers region for Winter Park", () => {
    const result = normalizeTmEvent(
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

  it("uses API url when present", () => {
    const result = normalizeTmEvent(
      makeTmEvent({ url: "https://www.ticketmaster.com/custom/event-page" }),
    );
    expect(result.url).toBe("https://www.ticketmaster.com/custom/event-page");
  });

  it("constructs fallback URL for standard TM IDs", () => {
    const result = normalizeTmEvent(
      makeTmEvent({ id: "Z7r9jZ1A7jsbp", url: undefined }),
    );
    expect(result.url).toBe("https://www.ticketmaster.com/event/Z7r9jZ1A7jsbp");
  });

  it("omits URL for non-standard Za5ju3rKuq resale IDs without API url", () => {
    const result = normalizeTmEvent(
      makeTmEvent({ id: "Za5ju3rKuqZDdItOqg6-sAB_vvfjeNwwDM", url: undefined }),
    );
    expect(result.url).toBeUndefined();
  });

  it("keeps API url even for non-standard IDs when API provides one", () => {
    const result = normalizeTmEvent(
      makeTmEvent({
        id: "Za5ju3rKuqZDdItOqg6-sAB_vvfjeNwwDM",
        url: "https://universe.com/events/some-event",
      }),
    );
    expect(result.url).toBe("https://universe.com/events/some-event");
  });

  it("falls back to localDate when dateTime missing", () => {
    const result = normalizeTmEvent(
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
