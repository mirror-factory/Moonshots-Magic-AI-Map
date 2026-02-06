/**
 * @module lib/profile-storage
 * LocalStorage utilities for persisting user profiles.
 * Provides CRUD operations for profile management.
 */

import { type UserProfile, createEmptyProfile } from "./profile";

const PROFILE_STORAGE_KEY = "moonshots_user_profile";

/**
 * Retrieves the stored user profile from localStorage.
 * @returns The stored profile, or a new empty profile if none exists.
 */
export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    return createEmptyProfile();
  }

  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserProfile;
    }
  } catch (error) {
    console.warn("Failed to parse stored profile:", error);
  }

  return createEmptyProfile();
}

/**
 * Saves a user profile to localStorage.
 * @param profile - The profile to save.
 */
export function setProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;

  try {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save profile:", error);
  }
}

/**
 * Updates specific fields of the user profile.
 * Performs a deep merge with the existing profile.
 * @param partial - Partial profile data to merge.
 * @returns The updated profile.
 */
export function updateProfile(partial: Partial<UserProfile>): UserProfile {
  const current = getProfile();
  const updated: UserProfile = {
    ...current,
    ...partial,
    interests: {
      ...current.interests,
      ...(partial.interests || {}),
    },
    availability: {
      ...current.availability,
      ...(partial.availability || {}),
    },
    context: {
      ...current.context,
      ...(partial.context || {}),
    },
    interactions: {
      ...current.interactions,
      ...(partial.interactions || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  setProfile(updated);
  return updated;
}

/**
 * Clears the stored user profile from localStorage.
 */
export function clearProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

/**
 * Checks if a user profile exists in storage.
 * @returns True if a profile is stored.
 */
export function hasProfile(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PROFILE_STORAGE_KEY) !== null;
}

/**
 * Adds an event ID to the liked events list.
 * @param eventId - The event ID to like.
 * @returns The updated profile.
 */
export function likeEvent(eventId: string): UserProfile {
  const profile = getProfile();
  if (!profile.interactions.likedEventIds.includes(eventId)) {
    profile.interactions.likedEventIds.push(eventId);
    // Remove from disliked if present
    profile.interactions.dislikedEventIds = profile.interactions.dislikedEventIds.filter(
      (id) => id !== eventId
    );
    setProfile(profile);
  }
  return profile;
}

/**
 * Adds an event ID to the disliked events list.
 * @param eventId - The event ID to dislike.
 * @returns The updated profile.
 */
export function dislikeEvent(eventId: string): UserProfile {
  const profile = getProfile();
  if (!profile.interactions.dislikedEventIds.includes(eventId)) {
    profile.interactions.dislikedEventIds.push(eventId);
    // Remove from liked if present
    profile.interactions.likedEventIds = profile.interactions.likedEventIds.filter(
      (id) => id !== eventId
    );
    setProfile(profile);
  }
  return profile;
}
