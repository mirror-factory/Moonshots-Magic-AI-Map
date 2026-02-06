import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRESET_LOCATIONS,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_PITCH,
  DEFAULT_BEARING,
} from "@/lib/map/config";
import { EVENT_CATEGORIES } from "@/lib/registries/types";

describe("map config", () => {
  // ------------------------------------------------------------------
  // CATEGORY_COLORS
  // ------------------------------------------------------------------
  describe("CATEGORY_COLORS", () => {
    it("has a matching entry for every EVENT_CATEGORIES value", () => {
      EVENT_CATEGORIES.forEach((cat) => {
        expect(CATEGORY_COLORS).toHaveProperty(cat);
      });
    });

    it("all values are valid hex color strings (#rrggbb)", () => {
      const hexPattern = /^#[0-9a-fA-F]{6}$/;
      Object.values(CATEGORY_COLORS).forEach((color) => {
        expect(color).toMatch(hexPattern);
      });
    });
  });

  // ------------------------------------------------------------------
  // CATEGORY_LABELS
  // ------------------------------------------------------------------
  describe("CATEGORY_LABELS", () => {
    it("has a matching entry for every EVENT_CATEGORIES value", () => {
      EVENT_CATEGORIES.forEach((cat) => {
        expect(CATEGORY_LABELS).toHaveProperty(cat);
      });
    });

    it("all label values are non-empty strings", () => {
      Object.values(CATEGORY_LABELS).forEach((label) => {
        expect(typeof label).toBe("string");
        expect(label.length).toBeGreaterThan(0);
      });
    });
  });

  // ------------------------------------------------------------------
  // PRESET_LOCATIONS
  // ------------------------------------------------------------------
  describe("PRESET_LOCATIONS", () => {
    const expectedKeys = [
      "orlando",
      "downtown",
      "kissimmee",
      "tampa",
      "winterPark",
      "lakeEola",
    ];

    it("has all expected keys", () => {
      expectedKeys.forEach((key) => {
        expect(PRESET_LOCATIONS).toHaveProperty(key);
      });
    });

    it("each entry has center as [number, number]", () => {
      Object.values(PRESET_LOCATIONS).forEach((loc) => {
        expect(Array.isArray(loc.center)).toBe(true);
        expect(loc.center).toHaveLength(2);
        expect(typeof loc.center[0]).toBe("number");
        expect(typeof loc.center[1]).toBe("number");
      });
    });

    it("each entry has a numeric zoom level", () => {
      Object.values(PRESET_LOCATIONS).forEach((loc) => {
        expect(typeof loc.zoom).toBe("number");
        expect(loc.zoom).toBeGreaterThan(0);
      });
    });

    it("center coordinates are in plausible Florida ranges", () => {
      Object.values(PRESET_LOCATIONS).forEach((loc) => {
        const [lng, lat] = loc.center;
        // Florida longitude roughly -88 to -80, latitude roughly 24 to 31
        expect(lng).toBeGreaterThanOrEqual(-88);
        expect(lng).toBeLessThanOrEqual(-79);
        expect(lat).toBeGreaterThanOrEqual(24);
        expect(lat).toBeLessThanOrEqual(31);
      });
    });
  });

  // ------------------------------------------------------------------
  // Default viewport constants
  // ------------------------------------------------------------------
  describe("default viewport constants", () => {
    it("DEFAULT_CENTER is [number, number]", () => {
      expect(Array.isArray(DEFAULT_CENTER)).toBe(true);
      expect(DEFAULT_CENTER).toHaveLength(2);
      expect(typeof DEFAULT_CENTER[0]).toBe("number");
      expect(typeof DEFAULT_CENTER[1]).toBe("number");
    });

    it("DEFAULT_ZOOM is a number", () => {
      expect(typeof DEFAULT_ZOOM).toBe("number");
      expect(DEFAULT_ZOOM).toBeGreaterThan(0);
    });

    it("DEFAULT_PITCH is a number", () => {
      expect(typeof DEFAULT_PITCH).toBe("number");
    });

    it("DEFAULT_BEARING is a number", () => {
      expect(typeof DEFAULT_BEARING).toBe("number");
    });
  });
});
