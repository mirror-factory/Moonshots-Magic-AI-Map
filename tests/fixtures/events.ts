import type { EventEntry } from "@/lib/registries/types";

/**
 * Factory for creating test EventEntry objects with sensible defaults.
 * Override any field via the `overrides` parameter.
 */
export function createTestEvent(
  overrides: Partial<EventEntry> = {},
): EventEntry {
  return {
    id: "evt-test-001",
    title: "Jazz in the Park",
    description: "Live jazz every Friday evening at Lake Eola.",
    category: "music",
    coordinates: [-81.373, 28.5431],
    venue: "Lake Eola Amphitheater",
    address: "512 E Washington St",
    city: "Orlando",
    region: "Central Florida",
    startDate: "2026-03-15T19:00:00Z",
    timezone: "America/New_York",
    tags: ["jazz", "live-music", "outdoor"],
    source: { type: "manual", addedBy: "admin" },
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    status: "active",
    ...overrides,
  };
}

/**
 * Creates a set of diverse test events covering multiple categories,
 * price ranges, and statuses.
 */
export function createTestEventSet(): EventEntry[] {
  return [
    createTestEvent({
      id: "evt-001",
      title: "Jazz in the Park",
      category: "music",
      city: "Orlando",
      startDate: "2026-03-15T19:00:00Z",
      price: { min: 0, max: 0, currency: "USD", isFree: true },
      featured: true,
      tags: ["jazz", "live-music", "outdoor"],
    }),
    createTestEvent({
      id: "evt-002",
      title: "Art Walk Downtown",
      category: "arts",
      city: "Orlando",
      startDate: "2026-03-16T18:00:00Z",
      price: { min: 10, max: 25, currency: "USD", isFree: false },
      tags: ["art", "gallery", "downtown"],
    }),
    createTestEvent({
      id: "evt-003",
      title: "Taco Festival",
      category: "food",
      city: "Kissimmee",
      startDate: "2026-03-17T12:00:00Z",
      price: { min: 15, max: 15, currency: "USD", isFree: false },
      tags: ["food", "festival", "tacos"],
    }),
    createTestEvent({
      id: "evt-004",
      title: "Tech Meetup: AI & ML",
      category: "tech",
      city: "Orlando",
      startDate: "2026-03-14T18:30:00Z",
      price: { min: 0, max: 0, currency: "USD", isFree: true },
      tags: ["tech", "ai", "meetup"],
    }),
    createTestEvent({
      id: "evt-005",
      title: "Cancelled Concert",
      category: "music",
      city: "Orlando",
      startDate: "2026-03-20T20:00:00Z",
      status: "cancelled",
      tags: ["concert", "cancelled"],
    }),
    createTestEvent({
      id: "evt-006",
      title: "Kids Fun Day",
      category: "family",
      city: "Winter Park",
      startDate: "2026-03-18T10:00:00Z",
      price: { min: 5, max: 10, currency: "USD", isFree: false },
      featured: true,
      tags: ["family", "kids", "fun"],
    }),
  ];
}
