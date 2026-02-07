/**
 * @module tests/unit/context/ambient-context
 * Tests for the ambient context engine — time, weather, location gathering.
 */

import { vi, beforeEach, afterEach } from "vitest";

// Mock fetch for weather API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};
Object.defineProperty(global, "navigator", {
  value: { geolocation: mockGeolocation },
  writable: true,
});

describe("getAmbientContext", () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
    localStorageMock.clear();
    mockGeolocation.getCurrentPosition.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an object with timeOfDay", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error({
          code: 1,
          message: "denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        }),
    );

    const { getAmbientContext } = await import(
      "@/lib/context/ambient-context"
    );
    const ctx = await getAmbientContext();

    expect(ctx).toHaveProperty("timeOfDay");
    expect(["morning", "afternoon", "evening", "night"]).toContain(
      ctx.timeOfDay,
    );
  });

  it("returns hour as a number 0-23", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error({
          code: 1,
          message: "denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        }),
    );

    const { getAmbientContext } = await import(
      "@/lib/context/ambient-context"
    );
    const ctx = await getAmbientContext();

    expect(typeof ctx.hour).toBe("number");
    expect(ctx.hour).toBeGreaterThanOrEqual(0);
    expect(ctx.hour).toBeLessThanOrEqual(23);
  });

  it("returns dayOfWeek as a string", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error({
          code: 1,
          message: "denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        }),
    );

    const { getAmbientContext } = await import(
      "@/lib/context/ambient-context"
    );
    const ctx = await getAmbientContext();

    expect(typeof ctx.dayOfWeek).toBe("string");
    expect([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]).toContain(ctx.dayOfWeek);
  });

  it("returns isWeekend as a boolean", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error({
          code: 1,
          message: "denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        }),
    );

    const { getAmbientContext } = await import(
      "@/lib/context/ambient-context"
    );
    const ctx = await getAmbientContext();

    expect(typeof ctx.isWeekend).toBe("boolean");
  });

  it("returns weather as null when API fails", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error({
          code: 1,
          message: "denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        }),
    );

    const { getAmbientContext } = await import(
      "@/lib/context/ambient-context"
    );
    const ctx = await getAmbientContext();

    expect(ctx.weather).toBeNull();
  });

  it("returns weather data when API succeeds", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 78,
          weather_code: 0,
        },
      }),
    });
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error({
          code: 1,
          message: "denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        }),
    );

    const { getAmbientContext } = await import(
      "@/lib/context/ambient-context"
    );
    const ctx = await getAmbientContext();

    expect(ctx.weather).not.toBeNull();
    expect(ctx.weather?.temp).toBe(78);
    expect(ctx.weather?.condition).toBe("Clear");
  });

  it("falls back to Orlando coordinates when geolocation fails", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    mockGeolocation.getCurrentPosition.mockImplementation(
      (_success: PositionCallback, error: PositionErrorCallback) =>
        error({
          code: 1,
          message: "denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        }),
    );

    const { getAmbientContext } = await import(
      "@/lib/context/ambient-context"
    );
    const ctx = await getAmbientContext();

    // Should still return a valid context even without geolocation
    expect(ctx).toHaveProperty("timeOfDay");
    expect(ctx.location).toBeNull();
  });
});
