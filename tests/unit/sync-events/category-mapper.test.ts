import { describe, it, expect } from "vitest";
import {
  mapTicketmasterCategory,
  inferCategoryFromText,
} from "../../../scripts/sync-events/utils/category-mapper";

describe("mapTicketmasterCategory", () => {
  it("maps Music segment to music", () => {
    expect(mapTicketmasterCategory("Music")).toBe("music");
  });

  it("maps Sports segment to sports", () => {
    expect(mapTicketmasterCategory("Sports")).toBe("sports");
  });

  it("maps Arts & Theatre segment to arts", () => {
    expect(mapTicketmasterCategory("Arts & Theatre")).toBe("arts");
  });

  it("prefers genre over segment when both available", () => {
    expect(mapTicketmasterCategory("Music", "Comedy")).toBe("nightlife");
  });

  it("maps Children's Theatre genre to family", () => {
    expect(mapTicketmasterCategory("Arts & Theatre", "Children's Theatre")).toBe(
      "family",
    );
  });

  it("maps Festival genre to festival", () => {
    expect(mapTicketmasterCategory("Music", "Festival")).toBe("festival");
  });

  it("returns other for unknown segment/genre", () => {
    expect(mapTicketmasterCategory("Unknown", "Unknown")).toBe("other");
  });

  it("returns other when both undefined", () => {
    expect(mapTicketmasterCategory()).toBe("other");
  });

  it("falls back to segment when genre unknown", () => {
    expect(mapTicketmasterCategory("Sports", "UnknownGenre")).toBe("sports");
  });
});

describe("inferCategoryFromText", () => {
  it("detects music keywords", () => {
    expect(inferCategoryFromText("Live Concert at the Park")).toBe("music");
    expect(inferCategoryFromText("Jazz Night with DJ")).toBe("music");
  });

  it("detects arts keywords", () => {
    expect(inferCategoryFromText("Gallery Opening Night")).toBe("arts");
    expect(inferCategoryFromText("Art Walk on Park Avenue")).toBe("arts");
  });

  it("detects sports keywords", () => {
    expect(inferCategoryFromText("Basketball Tournament")).toBe("sports");
    expect(inferCategoryFromText("Soccer Match: Lions vs Tigers")).toBe(
      "sports",
    );
  });

  it("detects food keywords", () => {
    expect(inferCategoryFromText("Food Truck Rally")).toBe("food");
    expect(inferCategoryFromText("Wine Tasting Experience")).toBe("food");
  });

  it("detects tech keywords", () => {
    expect(inferCategoryFromText("AI Hackathon 2026")).toBe("tech");
    expect(inferCategoryFromText("Developer Meetup")).toBe("tech");
  });

  it("detects family keywords", () => {
    expect(inferCategoryFromText("Kids Puppet Show")).toBe("family");
    expect(inferCategoryFromText("Family Fun Day")).toBe("family");
  });

  it("detects nightlife keywords", () => {
    expect(inferCategoryFromText("Bar Crawl Downtown")).toBe("nightlife");
    expect(inferCategoryFromText("Stand-up Comedy Night")).toBe("nightlife");
  });

  it("detects outdoor keywords", () => {
    expect(inferCategoryFromText("Morning Hike")).toBe("outdoor");
    expect(inferCategoryFromText("5K Fun Run")).toBe("outdoor");
  });

  it("detects education keywords", () => {
    expect(inferCategoryFromText("Workshop on Photography")).toBe("education");
    expect(inferCategoryFromText("Business Conference")).toBe("education");
  });

  it("detects festival keywords", () => {
    expect(inferCategoryFromText("Orlando Film Festival")).toBe("festival");
    expect(inferCategoryFromText("Block Party on Mills")).toBe("festival");
  });

  it("detects market keywords", () => {
    expect(inferCategoryFromText("Farmers Market Saturday")).toBe("market");
    expect(inferCategoryFromText("Holiday Craft Fair")).toBe("market");
  });

  it("detects community keywords", () => {
    expect(inferCategoryFromText("Neighborhood Cleanup")).toBe("community");
    expect(inferCategoryFromText("Charity Fundraiser")).toBe("community");
  });

  it("returns other for unrecognized text", () => {
    expect(inferCategoryFromText("Something random happening")).toBe("other");
  });
});
