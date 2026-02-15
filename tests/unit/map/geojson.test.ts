import { eventsToGeoJSON } from "@/lib/map/geojson";
import { CATEGORY_COLORS } from "@/lib/map/config";
import { createTestEvent, createTestEventSet } from "../../fixtures/events";

describe("eventsToGeoJSON", () => {
  it("returns an empty FeatureCollection for an empty array", () => {
    const result = eventsToGeoJSON([]);
    expect(result.type).toBe("FeatureCollection");
    expect(result.features).toHaveLength(0);
  });

  it("returns correct Point geometry for a single event", () => {
    const event = createTestEvent({
      coordinates: [-81.373, 28.5431],
    });
    const result = eventsToGeoJSON([event]);

    expect(result.features).toHaveLength(1);
    const feature = result.features[0];
    expect(feature.type).toBe("Feature");
    expect(feature.geometry.type).toBe("Point");
    expect(feature.geometry.coordinates).toEqual([-81.373, 28.5431]);
  });

  it("feature properties include id, title, category, color, venue, startDate", () => {
    const event = createTestEvent({
      id: "test-prop-id",
      title: "Test Event",
      category: "music",
      venue: "Test Venue",
      startDate: "2026-04-01T20:00:00Z",
    });
    const result = eventsToGeoJSON([event]);
    const props = result.features[0].properties;

    expect(props.id).toBe("test-prop-id");
    expect(props.title).toBe("Test Event");
    expect(props.category).toBe("music");
    expect(props.color).toBe(CATEGORY_COLORS.music);
    expect(props.venue).toBe("Test Venue");
    expect(props.startDate).toBe("2026-04-01T20:00:00Z");
  });

  it("featured defaults to false when undefined", () => {
    const event = createTestEvent();
    // The default createTestEvent has no featured field
    delete (event as Record<string, unknown>).featured;

    const result = eventsToGeoJSON([event]);
    expect(result.features[0].properties.featured).toBe(false);
  });

  it("featured is true when event.featured is true", () => {
    const event = createTestEvent({ featured: true });
    const result = eventsToGeoJSON([event]);
    expect(result.features[0].properties.featured).toBe(true);
  });

  it("color matches CATEGORY_COLORS for the event category", () => {
    const categories = ["music", "arts", "food", "tech", "sports"] as const;
    categories.forEach((cat) => {
      const event = createTestEvent({ category: cat });
      const result = eventsToGeoJSON([event]);
      expect(result.features[0].properties.color).toBe(CATEGORY_COLORS[cat]);
    });
  });

  it("multiple events produce multiple features", () => {
    const events = createTestEventSet();
    const result = eventsToGeoJSON(events);

    expect(result.type).toBe("FeatureCollection");
    expect(result.features).toHaveLength(events.length);

    const ids = result.features.map((f) => f.properties.id);
    const expectedIds = events.map((e) => e.id);
    expect(ids).toEqual(expectedIds);
  });
});
