import { describe, it, expect } from "vitest";
import {
  deduplicateEvents,
  buildDedupKey,
} from "../../../scripts/sync-events/utils/dedup";
import type { EventEntry } from "../../../src/lib/registries/types";

function makeEvent(overrides: Partial<EventEntry>): EventEntry {
  return {
    id: "test-1",
    title: "Test Event",
    description: "A test event",
    category: "other",
    coordinates: [-81.3792, 28.5383],
    venue: "Test Venue",
    address: "123 Test St",
    city: "Orlando",
    region: "Central Florida",
    startDate: "2026-03-01T19:00:00Z",
    timezone: "America/New_York",
    tags: [],
    source: { type: "manual", addedBy: "seed" },
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    status: "active",
    ...overrides,
  };
}

describe("buildDedupKey", () => {
  it("normalizes title, venue, and date into a key", () => {
    const event = makeEvent({
      title: "Live Jazz Night!",
      venue: "Lake Eola Park",
      startDate: "2026-03-15T20:00:00Z",
    });
    const key = buildDedupKey(event);
    expect(key).toBe("live jazz night|lake eola park|2026-03-15");
  });

  it("strips special characters from title/venue", () => {
    const event = makeEvent({
      title: "Music & Arts (2026)",
      venue: "Dr. Phillips Center!",
      startDate: "2026-04-01T19:00:00Z",
    });
    const key = buildDedupKey(event);
    expect(key).toBe("music arts 2026|dr phillips center|2026-04-01");
  });

  it("produces same key for differently cased inputs", () => {
    const a = makeEvent({ title: "JAZZ NIGHT", venue: "PARK AVENUE", startDate: "2026-05-01T00:00:00Z" });
    const b = makeEvent({ title: "jazz night", venue: "Park Avenue", startDate: "2026-05-01T12:00:00Z" });
    expect(buildDedupKey(a)).toBe(buildDedupKey(b));
  });
});

describe("deduplicateEvents", () => {
  it("removes exact duplicate IDs", () => {
    const events = [
      makeEvent({ id: "a1" }),
      makeEvent({ id: "a1" }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(1);
  });

  it("removes events with same title+venue+date", () => {
    const events = [
      makeEvent({
        id: "tm-123",
        title: "Jazz Night",
        venue: "Lake Eola",
        startDate: "2026-03-15T20:00:00Z",
        source: { type: "ticketmaster", fetchedAt: "2026-01-01" },
      }),
      makeEvent({
        id: "eb-456",
        title: "Jazz Night",
        venue: "Lake Eola",
        startDate: "2026-03-15T18:00:00Z", // same day, different time
        source: { type: "eventbrite", fetchedAt: "2026-01-01" },
      }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(1);
  });

  it("keeps manual events over fetched duplicates", () => {
    const events = [
      makeEvent({
        id: "tm-123",
        title: "Jazz Night",
        venue: "Lake Eola",
        startDate: "2026-03-15T20:00:00Z",
        source: { type: "ticketmaster", fetchedAt: "2026-01-01" },
      }),
      makeEvent({
        id: "manual-1",
        title: "Jazz Night",
        venue: "Lake Eola",
        startDate: "2026-03-15T19:00:00Z",
        source: { type: "manual", addedBy: "seed" },
      }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("manual-1");
  });

  it("prefers ticketmaster over eventbrite", () => {
    const events = [
      makeEvent({
        id: "eb-456",
        title: "Concert",
        venue: "Amway",
        startDate: "2026-06-01T20:00:00Z",
        source: { type: "eventbrite", fetchedAt: "2026-01-01" },
      }),
      makeEvent({
        id: "tm-789",
        title: "Concert",
        venue: "Amway",
        startDate: "2026-06-01T20:00:00Z",
        source: { type: "ticketmaster", fetchedAt: "2026-01-01" },
      }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("tm-789");
  });

  it("prefers ticketmaster over scrapers", () => {
    const events = [
      makeEvent({
        id: "ow-abc",
        title: "Festival",
        venue: "Downtown",
        startDate: "2026-07-04T12:00:00Z",
        source: { type: "scraper", site: "orlandoweekly.com", fetchedAt: "2026-01-01" },
      }),
      makeEvent({
        id: "tm-def",
        title: "Festival",
        venue: "Downtown",
        startDate: "2026-07-04T12:00:00Z",
        source: { type: "ticketmaster", fetchedAt: "2026-01-01" },
      }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("tm-def");
  });

  it("keeps events with different titles as unique", () => {
    const events = [
      makeEvent({ id: "a1", title: "Event A" }),
      makeEvent({ id: "b1", title: "Event B" }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(2);
  });

  it("keeps events on different dates as unique", () => {
    const events = [
      makeEvent({ id: "a1", startDate: "2026-03-01T19:00:00Z" }),
      makeEvent({ id: "b1", startDate: "2026-03-02T19:00:00Z" }),
    ];
    const result = deduplicateEvents(events);
    expect(result).toHaveLength(2);
  });
});
