/**
 * @module lib/profile
 * User profile type definitions for personalization features.
 * Stores user preferences, interests, and interaction history.
 */

import type { EventCategory } from "@/lib/registries/types";

/** Vibe descriptors for event preferences. */
export type Vibe = "chill" | "energetic" | "adventurous" | "romantic" | "family-friendly";

/** Price range preference. */
export type PriceRange = "free" | "budget" | "moderate" | "premium" | "any";

/** Preferred days for events. */
export type DayPreference = "weekday" | "weekend";

/** Preferred times for events. */
export type TimePreference = "morning" | "afternoon" | "evening" | "night";

/**
 * User profile schema for personalization.
 * Stored in localStorage and used by AI tools.
 */
export interface UserProfile {
  /** Unique profile identifier. */
  id: string;
  /** ISO 8601 timestamp when profile was created. */
  createdAt: string;
  /** ISO 8601 timestamp when profile was last updated. */
  updatedAt: string;
  /** User's display name (optional). */
  name?: string;

  /** User's event interests and preferences. */
  interests: {
    /** Preferred event categories. */
    categories: EventCategory[];
    /** Preferred event vibes/atmospheres. */
    vibes: Vibe[];
    /** Budget preference for events. */
    priceRange: PriceRange;
  };

  /** Availability and scheduling preferences. */
  availability: {
    /** Preferred days for attending events. */
    preferredDays: DayPreference[];
    /** Preferred times for attending events. */
    preferredTimes: TimePreference[];
    /** Maximum travel radius in miles. */
    travelRadius: number;
  };

  /** Personal context for better recommendations. */
  context: {
    /** Whether user has children. */
    hasKids: boolean;
    /** Whether user has pets. */
    hasPets: boolean;
  };

  /** User's goals or reasons for attending events. */
  goals: string[];

  /** Interaction history for learning preferences. */
  interactions: {
    /** Event IDs the user has liked/saved. */
    likedEventIds: string[];
    /** Event IDs the user has dismissed/disliked. */
    dislikedEventIds: string[];
  };
}

/**
 * Creates a new empty user profile with defaults.
 * @returns A fresh UserProfile with sensible defaults.
 */
export function createEmptyProfile(): UserProfile {
  const now = new Date().toISOString();
  return {
    id: `profile_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    interests: {
      categories: [],
      vibes: [],
      priceRange: "any",
    },
    availability: {
      preferredDays: [],
      preferredTimes: [],
      travelRadius: 25,
    },
    context: {
      hasKids: false,
      hasPets: false,
    },
    goals: [],
    interactions: {
      likedEventIds: [],
      dislikedEventIds: [],
    },
  };
}
