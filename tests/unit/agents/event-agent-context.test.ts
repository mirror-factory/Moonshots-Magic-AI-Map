/**
 * @module tests/unit/agents/event-agent-context
 * Tests for ambient context injection into the event agent.
 */

import { createEventAgent } from "@/lib/agents/event-agent";

describe("createEventAgent with ambient context", () => {
  it("includes CURRENT CONTEXT block when context is provided", () => {
    const agent = createEventAgent("test-model", {
      timeOfDay: "evening",
      hour: 19,
      weather: { temp: 78, condition: "Clear sky" },
      location: { lat: 28.5383, lng: -81.3792 },
      dayOfWeek: "Saturday",
      isWeekend: true,
    });

    expect(agent.settings.instructions).toContain("CURRENT CONTEXT:");
    expect(agent.settings.instructions).toContain("evening");
    expect(agent.settings.instructions).toContain("7:00 PM");
    expect(agent.settings.instructions).toContain("Saturday");
    expect(agent.settings.instructions).toContain("(weekend)");
    expect(agent.settings.instructions).toContain("78°F");
    expect(agent.settings.instructions).toContain("Clear sky");
  });

  it("includes DELIGHT TRIGGERS when context is provided", () => {
    const agent = createEventAgent("test-model", {
      timeOfDay: "morning",
      hour: 9,
      dayOfWeek: "Monday",
      isWeekend: false,
    });

    expect(agent.settings.instructions).toContain("DELIGHT TRIGGERS");
    expect(agent.settings.instructions).toContain("mention urgency");
    expect(agent.settings.instructions).toContain("spark discovery");
  });

  it("does NOT include context block when context is null", () => {
    const agent = createEventAgent("test-model", null);

    expect(agent.settings.instructions).not.toContain("CURRENT CONTEXT:");
    expect(agent.settings.instructions).not.toContain("DELIGHT TRIGGERS");
  });

  it("does NOT include context block when context is undefined", () => {
    const agent = createEventAgent("test-model");

    expect(agent.settings.instructions).not.toContain("CURRENT CONTEXT:");
  });

  it("handles partial context (time only, no weather/location)", () => {
    const agent = createEventAgent("test-model", {
      timeOfDay: "afternoon",
      hour: 14,
      dayOfWeek: "Wednesday",
      isWeekend: false,
    });

    expect(agent.settings.instructions).toContain("afternoon");
    expect(agent.settings.instructions).toContain("2:00 PM");
    expect(agent.settings.instructions).not.toContain("Weather:");
  });

  it("handles weekday context correctly (no weekend marker)", () => {
    const agent = createEventAgent("test-model", {
      timeOfDay: "morning",
      hour: 10,
      dayOfWeek: "Tuesday",
      isWeekend: false,
    });

    expect(agent.settings.instructions).toContain("Tuesday");
    expect(agent.settings.instructions).not.toContain("(weekend)");
  });
});
