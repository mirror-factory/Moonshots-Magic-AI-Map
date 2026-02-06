import { createEmptyProfile } from "@/lib/profile";

describe("createEmptyProfile", () => {
  it("returns object with id starting with 'profile_'", () => {
    const profile = createEmptyProfile();
    expect(profile.id).toMatch(/^profile_/);
  });

  it("has createdAt as an ISO string", () => {
    const profile = createEmptyProfile();
    expect(() => new Date(profile.createdAt).toISOString()).not.toThrow();
    expect(new Date(profile.createdAt).toISOString()).toBe(profile.createdAt);
  });

  it("has updatedAt as an ISO string", () => {
    const profile = createEmptyProfile();
    expect(() => new Date(profile.updatedAt).toISOString()).not.toThrow();
    expect(new Date(profile.updatedAt).toISOString()).toBe(profile.updatedAt);
  });

  it("interests.categories is empty array", () => {
    const profile = createEmptyProfile();
    expect(profile.interests.categories).toEqual([]);
  });

  it("interests.vibes is empty array", () => {
    const profile = createEmptyProfile();
    expect(profile.interests.vibes).toEqual([]);
  });

  it('interests.priceRange is "any"', () => {
    const profile = createEmptyProfile();
    expect(profile.interests.priceRange).toBe("any");
  });

  it("availability.preferredDays is empty array", () => {
    const profile = createEmptyProfile();
    expect(profile.availability.preferredDays).toEqual([]);
  });

  it("availability.preferredTimes is empty array", () => {
    const profile = createEmptyProfile();
    expect(profile.availability.preferredTimes).toEqual([]);
  });

  it("availability.travelRadius is 25", () => {
    const profile = createEmptyProfile();
    expect(profile.availability.travelRadius).toBe(25);
  });

  it("context.hasKids is false", () => {
    const profile = createEmptyProfile();
    expect(profile.context.hasKids).toBe(false);
  });

  it("context.hasPets is false", () => {
    const profile = createEmptyProfile();
    expect(profile.context.hasPets).toBe(false);
  });

  it("goals is empty array", () => {
    const profile = createEmptyProfile();
    expect(profile.goals).toEqual([]);
  });

  it("interactions.likedEventIds is empty array", () => {
    const profile = createEmptyProfile();
    expect(profile.interactions.likedEventIds).toEqual([]);
  });

  it("interactions.dislikedEventIds is empty array", () => {
    const profile = createEmptyProfile();
    expect(profile.interactions.dislikedEventIds).toEqual([]);
  });
});
