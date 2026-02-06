import {
  getProfile,
  setProfile,
  updateProfile,
  clearProfile,
  hasProfile,
  likeEvent,
  dislikeEvent,
} from "@/lib/profile-storage";
import { createTestProfile } from "../../fixtures/profiles";

describe("profile-storage", () => {
  describe("getProfile", () => {
    it("returns empty profile when nothing stored", () => {
      const profile = getProfile();
      expect(profile).toBeDefined();
      expect(profile.id).toMatch(/^profile_/);
      expect(profile.interests.categories).toEqual([]);
    });
  });

  describe("setProfile / getProfile roundtrip", () => {
    it("preserves data through storage roundtrip", () => {
      const original = createTestProfile();
      setProfile(original);
      const retrieved = getProfile();

      expect(retrieved.id).toBe(original.id);
      expect(retrieved.name).toBe(original.name);
      expect(retrieved.interests.categories).toEqual(original.interests.categories);
      expect(retrieved.interests.vibes).toEqual(original.interests.vibes);
      expect(retrieved.interests.priceRange).toBe(original.interests.priceRange);
      expect(retrieved.availability.preferredDays).toEqual(original.availability.preferredDays);
      expect(retrieved.context.hasKids).toBe(original.context.hasKids);
      expect(retrieved.goals).toEqual(original.goals);
    });

    it("updates the updatedAt timestamp on setProfile", () => {
      const original = createTestProfile({ updatedAt: "2020-01-01T00:00:00Z" });
      setProfile(original);
      const retrieved = getProfile();

      expect(retrieved.updatedAt).not.toBe("2020-01-01T00:00:00Z");
      expect(new Date(retrieved.updatedAt).getTime()).toBeGreaterThan(
        new Date("2020-01-01T00:00:00Z").getTime(),
      );
    });
  });

  describe("updateProfile", () => {
    it("deep merges interests", () => {
      const original = createTestProfile();
      setProfile(original);

      const updated = updateProfile({ interests: { categories: ["tech"], vibes: ["energetic"], priceRange: "free" } });
      expect(updated.interests.categories).toEqual(["tech"]);
      expect(updated.interests.vibes).toEqual(["energetic"]);
      expect(updated.interests.priceRange).toBe("free");
    });

    it("deep merges availability", () => {
      const original = createTestProfile();
      setProfile(original);

      const updated = updateProfile({ availability: { travelRadius: 50, preferredDays: ["weekday"], preferredTimes: ["morning"] } });
      expect(updated.availability.travelRadius).toBe(50);
      expect(updated.availability.preferredDays).toEqual(["weekday"]);
      expect(updated.availability.preferredTimes).toEqual(["morning"]);
    });

    it("deep merges context", () => {
      const original = createTestProfile();
      setProfile(original);

      const updated = updateProfile({ context: { hasKids: true, hasPets: false } });
      expect(updated.context.hasKids).toBe(true);
      expect(updated.context.hasPets).toBe(false);
    });

    it("deep merges interactions", () => {
      const original = createTestProfile();
      setProfile(original);

      const updated = updateProfile({
        interactions: { likedEventIds: ["evt-1", "evt-2"], dislikedEventIds: ["evt-3"] },
      });
      expect(updated.interactions.likedEventIds).toEqual(["evt-1", "evt-2"]);
      expect(updated.interactions.dislikedEventIds).toEqual(["evt-3"]);
    });
  });

  describe("clearProfile", () => {
    it("removes stored profile", () => {
      setProfile(createTestProfile());
      expect(hasProfile()).toBe(true);

      clearProfile();
      expect(hasProfile()).toBe(false);
    });
  });

  describe("hasProfile", () => {
    it("returns false when empty", () => {
      expect(hasProfile()).toBe(false);
    });

    it("returns true after setProfile", () => {
      setProfile(createTestProfile());
      expect(hasProfile()).toBe(true);
    });
  });

  describe("likeEvent", () => {
    it("adds event ID to likedEventIds", () => {
      setProfile(createTestProfile());
      const result = likeEvent("evt-100");
      expect(result.interactions.likedEventIds).toContain("evt-100");
    });

    it("removes event from dislikedEventIds (mutual exclusion)", () => {
      setProfile(
        createTestProfile({
          interactions: { likedEventIds: [], dislikedEventIds: ["evt-100"] },
        }),
      );
      const result = likeEvent("evt-100");
      expect(result.interactions.likedEventIds).toContain("evt-100");
      expect(result.interactions.dislikedEventIds).not.toContain("evt-100");
    });

    it("is idempotent (no duplicates)", () => {
      setProfile(createTestProfile());
      likeEvent("evt-100");
      const result = likeEvent("evt-100");
      const count = result.interactions.likedEventIds.filter((id) => id === "evt-100").length;
      expect(count).toBe(1);
    });
  });

  describe("dislikeEvent", () => {
    it("adds event ID to dislikedEventIds", () => {
      setProfile(createTestProfile());
      const result = dislikeEvent("evt-200");
      expect(result.interactions.dislikedEventIds).toContain("evt-200");
    });

    it("removes event from likedEventIds (mutual exclusion)", () => {
      setProfile(
        createTestProfile({
          interactions: { likedEventIds: ["evt-200"], dislikedEventIds: [] },
        }),
      );
      const result = dislikeEvent("evt-200");
      expect(result.interactions.dislikedEventIds).toContain("evt-200");
      expect(result.interactions.likedEventIds).not.toContain("evt-200");
    });

    it("is idempotent (no duplicates)", () => {
      setProfile(createTestProfile());
      dislikeEvent("evt-200");
      const result = dislikeEvent("evt-200");
      const count = result.interactions.dislikedEventIds.filter((id) => id === "evt-200").length;
      expect(count).toBe(1);
    });
  });
});
