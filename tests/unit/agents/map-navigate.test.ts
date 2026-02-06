import { mapNavigate } from "@/lib/agents/tools/map-navigate";

describe("mapNavigate tool", () => {
  it("does NOT have an execute function (client-side only)", () => {
    expect(mapNavigate.execute).toBeUndefined();
  });

  it("has a description", () => {
    expect(mapNavigate.description).toBeDefined();
    expect(mapNavigate.description.length).toBeGreaterThan(0);
  });

  it("has an inputSchema", () => {
    expect(mapNavigate.inputSchema).toBeDefined();
  });

  describe("inputSchema validation", () => {
    it("accepts flyTo with coordinates", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "flyTo",
        coordinates: [-81.37, 28.54],
      });
      expect(result.success).toBe(true);
    });

    it("accepts highlight with eventIds", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "highlight",
        eventIds: ["evt-1"],
      });
      expect(result.success).toBe(true);
    });

    it("accepts fitBounds with eventIds", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "fitBounds",
        eventIds: ["evt-1", "evt-2"],
      });
      expect(result.success).toBe(true);
    });

    it("accepts flyTo with coordinates and zoom", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "flyTo",
        coordinates: [-81.37, 28.54],
        zoom: 14,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid action value", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "invalid",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty object (action is required)", () => {
      const result = mapNavigate.inputSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("accepts action alone without optional fields", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "flyTo",
      });
      expect(result.success).toBe(true);
    });

    it("rejects coordinates with wrong tuple length", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "flyTo",
        coordinates: [-81.37],
      });
      expect(result.success).toBe(false);
    });

    it("rejects coordinates with non-number values", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "flyTo",
        coordinates: ["not", "numbers"],
      });
      expect(result.success).toBe(false);
    });

    it("accepts eventIds as empty array", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "highlight",
        eventIds: [],
      });
      expect(result.success).toBe(true);
    });

    it("accepts all three valid action types", () => {
      const actions = ["flyTo", "highlight", "fitBounds"] as const;
      actions.forEach((action) => {
        const result = mapNavigate.inputSchema.safeParse({ action });
        expect(result.success).toBe(true);
      });
    });

    it("rejects zoom with non-number value", () => {
      const result = mapNavigate.inputSchema.safeParse({
        action: "flyTo",
        zoom: "high",
      });
      expect(result.success).toBe(false);
    });
  });
});
