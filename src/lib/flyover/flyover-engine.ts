/**
 * @module lib/flyover/flyover-engine
 * State machine for orchestrating narrated flyover tours of events.
 * Manages the flyover lifecycle: idle -> preparing -> flying -> narrating -> complete.
 */

import type { EventEntry } from "@/lib/registries/types";

/** Possible states of the flyover engine. */
export type FlyoverState = "idle" | "preparing" | "flying" | "narrating" | "paused" | "complete";

/** Waypoint configuration for a single stop in the flyover tour. */
export interface FlyoverWaypoint {
  /** ID of the event at this waypoint. */
  eventId: string;
  /** Event data for display. */
  event: EventEntry;
  /** Map center coordinates [lng, lat]. */
  center: [number, number];
  /** Camera zoom level. */
  zoom: number;
  /** Camera pitch angle in degrees (0-60). */
  pitch: number;
  /** Camera bearing/heading in degrees (0-360). */
  bearing: number;
  /** Duration of camera animation in milliseconds. */
  duration: number;
  /** Narration text for this waypoint. */
  narrative: string;
  /** Pre-generated audio buffer for this waypoint (optional). */
  audioBuffer?: ArrayBuffer;
}

/** Configuration options for a flyover tour. */
export interface FlyoverConfig {
  /** Events to include in the tour. */
  events: EventEntry[];
  /** Optional theme or focus for the tour. */
  theme?: string;
  /** Duration between waypoints in milliseconds. */
  pauseDuration?: number;
  /** Whether to enable voice narration. */
  enableVoice?: boolean;
}

/** Current state of an active flyover. */
export interface FlyoverProgress {
  /** Current state of the flyover. */
  state: FlyoverState;
  /** All waypoints in the tour. */
  waypoints: FlyoverWaypoint[];
  /** Index of the current waypoint. */
  currentIndex: number;
  /** Progress through current waypoint (0-1). */
  waypointProgress: number;
  /** Current narration text being displayed. */
  currentNarrative: string;
  /** Whether the flyover is currently paused. */
  isPaused: boolean;
  /** Whether audio is preloaded and ready. */
  audioReady: boolean;
}

/**
 * Generates a fallback narrative description for an event.
 * This is used when AI-generated narratives are unavailable.
 * @param event - The event to narrate.
 * @param theme - Optional theme to incorporate.
 * @returns A brief narrative string.
 */
function generateNarrative(event: EventEntry, theme?: string): string {
  const dayName = new Date(event.startDate).toLocaleDateString("en-US", { weekday: "long" });

  // Check if venue is already in the title to avoid repetition
  const venueInTitle = event.title.toLowerCase().includes(event.venue.toLowerCase().split(" ")[0]);
  const location = venueInTitle ? "" : ` at ${event.venue}`;

  // Extract first sentence of description for context
  const firstSentence = event.description.split(/[.!?]/)[0].trim();
  const shortDesc = firstSentence.length > 80 ? firstSentence.substring(0, 80) + "..." : firstSentence;

  const priceNote = event.price?.isFree ? " And it's free!" : "";
  const themeNote = theme ? ` Part of our ${theme} tour.` : "";

  return `${event.title}${location} this ${dayName}. ${shortDesc}.${priceNote}${themeNote}`;
}

/**
 * Calculates an optimal camera bearing for a sequence of events.
 * Creates a sweeping visual effect as the tour progresses.
 * @param index - Current waypoint index.
 * @param total - Total number of waypoints.
 * @returns Bearing in degrees (0-360).
 */
function calculateBearing(index: number, total: number): number {
  // Sweep from west to east across the tour
  return (index / Math.max(1, total - 1)) * 90 - 45; // -45 to 45 degrees
}

/**
 * Generates waypoints from a list of events.
 * @param events - Events to create waypoints for.
 * @param theme - Optional theme for narratives.
 * @returns Array of flyover waypoints.
 */
export function generateWaypoints(events: EventEntry[], theme?: string): FlyoverWaypoint[] {
  return events.map((event, index) => ({
    eventId: event.id,
    event,
    center: event.coordinates,
    zoom: 17.5,       // Close enough to see buildings clearly
    pitch: 60,        // Steeper angle for dramatic building views
    bearing: calculateBearing(index, events.length),
    duration: 5000,   // 5 seconds per transition for appreciation
    narrative: generateNarrative(event, theme),
  }));
}

/**
 * Creates an initial flyover progress state.
 * @param config - Flyover configuration.
 * @returns Initial progress state.
 */
export function createFlyoverProgress(config: FlyoverConfig): FlyoverProgress {
  const waypoints = generateWaypoints(config.events, config.theme);

  return {
    state: "idle",
    waypoints,
    currentIndex: 0,
    waypointProgress: 0,
    currentNarrative: "",
    isPaused: false,
    audioReady: false,
  };
}

/**
 * Updates waypoints with pre-generated narratives and audio buffers.
 * @param progress - Current progress state.
 * @param updates - Array of {index, narrative, audioBuffer} updates.
 * @returns Updated progress state.
 */
export function updateWaypointAudio(
  progress: FlyoverProgress,
  updates: Array<{ index: number; narrative?: string; audioBuffer?: ArrayBuffer }>,
): FlyoverProgress {
  const newWaypoints = [...progress.waypoints];

  for (const update of updates) {
    if (update.index >= 0 && update.index < newWaypoints.length) {
      newWaypoints[update.index] = {
        ...newWaypoints[update.index],
        ...(update.narrative && { narrative: update.narrative }),
        ...(update.audioBuffer && { audioBuffer: update.audioBuffer }),
      };
    }
  }

  const allAudioReady = newWaypoints.every((w) => w.audioBuffer !== undefined);

  return {
    ...progress,
    waypoints: newWaypoints,
    audioReady: allAudioReady,
  };
}

/**
 * Advances the flyover to the next waypoint.
 * @param progress - Current progress state.
 * @returns Updated progress state.
 */
export function nextWaypoint(progress: FlyoverProgress): FlyoverProgress {
  const nextIndex = progress.currentIndex + 1;

  if (nextIndex >= progress.waypoints.length) {
    return {
      ...progress,
      state: "complete",
      currentIndex: progress.waypoints.length - 1,
      waypointProgress: 1,
    };
  }

  return {
    ...progress,
    state: "flying",
    currentIndex: nextIndex,
    waypointProgress: 0,
    currentNarrative: progress.waypoints[nextIndex].narrative,
  };
}

/**
 * Pauses or resumes the flyover.
 * @param progress - Current progress state.
 * @returns Updated progress state.
 */
export function togglePause(progress: FlyoverProgress): FlyoverProgress {
  if (progress.state === "complete" || progress.state === "idle") {
    return progress;
  }

  return {
    ...progress,
    state: progress.isPaused ? "flying" : "paused",
    isPaused: !progress.isPaused,
  };
}

/**
 * Stops the flyover and resets to idle.
 * @param progress - Current progress state.
 * @returns Reset progress state.
 */
export function stopFlyover(progress: FlyoverProgress): FlyoverProgress {
  return {
    ...progress,
    state: "idle",
    currentIndex: 0,
    waypointProgress: 0,
    currentNarrative: "",
    isPaused: false,
  };
}

/**
 * Starts the flyover from the beginning.
 * @param progress - Current progress state.
 * @returns Started progress state.
 */
export function startFlyover(progress: FlyoverProgress): FlyoverProgress {
  if (progress.waypoints.length === 0) {
    return progress;
  }

  return {
    ...progress,
    state: "preparing",
    currentIndex: 0,
    waypointProgress: 0,
    currentNarrative: progress.waypoints[0].narrative,
    isPaused: false,
  };
}
