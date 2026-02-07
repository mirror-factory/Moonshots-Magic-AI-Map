/**
 * @module tests/unit/supabase/event-source-adapter
 * Tests for the EventSourceAdapter pattern — StaticAdapter,
 * EventbriteAdapter, and CompositeEventSource.
 */

import { vi, beforeEach, afterEach } from "vitest";

// Mock fetch for Eventbrite adapter
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("EventSourceAdapter", () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("StaticAdapter", () => {
    it("is always available", async () => {
      const { StaticAdapter } = await import(
        "@/lib/registries/event-source-adapter"
      );
      const adapter = new StaticAdapter();
      expect(adapter.isAvailable()).toBe(true);
    });

    it("has name 'static'", async () => {
      const { StaticAdapter } = await import(
        "@/lib/registries/event-source-adapter"
      );
      const adapter = new StaticAdapter();
      expect(adapter.name).toBe("static");
    });

    it("fetchEvents returns an array of events", async () => {
      const { StaticAdapter } = await import(
        "@/lib/registries/event-source-adapter"
      );
      const adapter = new StaticAdapter();
      const events = await adapter.fetchEvents({ status: "active" });
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it("fetchEvents with category filter returns matching events", async () => {
      const { StaticAdapter } = await import(
        "@/lib/registries/event-source-adapter"
      );
      const adapter = new StaticAdapter();
      const events = await adapter.fetchEvents({ category: "music" });
      events.forEach((e) => expect(e.category).toBe("music"));
    });
  });

  describe("EventbriteAdapter", () => {
    it("is not available without env var", async () => {
      vi.stubEnv("EVENTBRITE_PRIVATE_TOKEN", "");
      const { EventbriteAdapter } = await import(
        "@/lib/registries/event-source-adapter"
      );
      const adapter = new EventbriteAdapter();
      expect(adapter.isAvailable()).toBe(false);
    });

    it("has name 'eventbrite'", async () => {
      const { EventbriteAdapter } = await import(
        "@/lib/registries/event-source-adapter"
      );
      const adapter = new EventbriteAdapter();
      expect(adapter.name).toBe("eventbrite");
    });
  });

  describe("CompositeEventSource", () => {
    it("includes at least the static adapter", async () => {
      const { defaultEventSource } = await import(
        "@/lib/registries/event-source-adapter"
      );
      expect(defaultEventSource).toBeDefined();
      expect(typeof defaultEventSource.fetchEvents).toBe("function");
    });

    it("fetchEvents returns events from static adapter", async () => {
      const { defaultEventSource } = await import(
        "@/lib/registries/event-source-adapter"
      );
      const events = await defaultEventSource.fetchEvents({
        status: "active",
      });
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it("deduplicates events by ID", async () => {
      const { defaultEventSource } = await import(
        "@/lib/registries/event-source-adapter"
      );
      const events = await defaultEventSource.fetchEvents({
        status: "active",
      });
      const ids = events.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
