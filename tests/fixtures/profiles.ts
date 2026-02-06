import type { UserProfile } from "@/lib/profile";

/**
 * Factory for creating test UserProfile objects with sensible defaults.
 * Override any field via the `overrides` parameter.
 */
export function createTestProfile(
  overrides: Partial<UserProfile> = {},
): UserProfile {
  return {
    id: "profile_test_001",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    name: "Test User",
    interests: {
      categories: ["music", "food"],
      vibes: ["chill", "adventurous"],
      priceRange: "moderate",
    },
    availability: {
      preferredDays: ["weekend"],
      preferredTimes: ["evening"],
      travelRadius: 25,
    },
    context: {
      hasKids: false,
      hasPets: false,
    },
    goals: ["Discover new events", "Meet people"],
    interactions: {
      likedEventIds: [],
      dislikedEventIds: [],
    },
    ...overrides,
  };
}
