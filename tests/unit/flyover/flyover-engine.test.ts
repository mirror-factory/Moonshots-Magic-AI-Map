import {
  generateWaypoints,
  createFlyoverProgress,
  nextWaypoint,
  togglePause,
  stopFlyover,
  startFlyover,
  updateWaypointAudio,
} from "@/lib/flyover/flyover-engine";
import { createTestEvent, createTestEventSet } from "../../fixtures/events";

describe("generateWaypoints", () => {
  it("returns array same length as input events", () => {
    const events = createTestEventSet();
    const waypoints = generateWaypoints(events);
    expect(waypoints).toHaveLength(events.length);
  });

  it("each waypoint has center matching event coordinates", () => {
    const events = createTestEventSet();
    const waypoints = generateWaypoints(events);
    waypoints.forEach((wp, i) => {
      expect(wp.center).toEqual(events[i].coordinates);
    });
  });

  it("each waypoint has zoom 17.5, pitch 60", () => {
    const events = createTestEventSet();
    const waypoints = generateWaypoints(events);
    waypoints.forEach((wp) => {
      expect(wp.zoom).toBe(17.5);
      expect(wp.pitch).toBe(60);
    });
  });

  it("bearing sweeps from -45 to 45 degrees across waypoints", () => {
    const events = createTestEventSet();
    const waypoints = generateWaypoints(events);

    // First waypoint should be at -45
    expect(waypoints[0].bearing).toBeCloseTo(-45, 5);
    // Last waypoint should be at 45
    expect(waypoints[waypoints.length - 1].bearing).toBeCloseTo(45, 5);
  });
});

describe("createFlyoverProgress", () => {
  it('state starts as "idle"', () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    expect(progress.state).toBe("idle");
  });

  it("currentIndex is 0", () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    expect(progress.currentIndex).toBe(0);
  });

  it("isPaused is false", () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    expect(progress.isPaused).toBe(false);
  });
});

describe("startFlyover", () => {
  it('transitions to "preparing" state', () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    const started = startFlyover(progress);
    expect(started.state).toBe("preparing");
  });

  it("sets currentNarrative to first waypoint narrative", () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    const started = startFlyover(progress);
    expect(started.currentNarrative).toBe(progress.waypoints[0].narrative);
  });

  it("with empty waypoints returns same state", () => {
    const progress = createFlyoverProgress({ events: [] });
    const started = startFlyover(progress);
    expect(started).toBe(progress);
  });
});

describe("nextWaypoint", () => {
  it("increments currentIndex", () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    const started = startFlyover(progress);
    const next = nextWaypoint(started);
    expect(next.currentIndex).toBe(1);
  });

  it('sets state to "flying"', () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    const started = startFlyover(progress);
    const next = nextWaypoint(started);
    expect(next.state).toBe("flying");
  });

  it('at last waypoint transitions to "complete"', () => {
    const events = createTestEventSet();
    let progress = createFlyoverProgress({ events });
    progress = startFlyover(progress);

    // Advance to the last waypoint
    for (let i = 0; i < events.length - 1; i++) {
      progress = nextWaypoint(progress);
    }

    // One more should complete
    const completed = nextWaypoint(progress);
    expect(completed.state).toBe("complete");
  });
});

describe("togglePause", () => {
  it('from "flying" transitions to "paused"', () => {
    let progress = createFlyoverProgress({ events: createTestEventSet() });
    progress = startFlyover(progress);
    progress = nextWaypoint(progress); // state -> "flying"

    const paused = togglePause(progress);
    expect(paused.state).toBe("paused");
    expect(paused.isPaused).toBe(true);
  });

  it('from "paused" transitions to "flying"', () => {
    let progress = createFlyoverProgress({ events: createTestEventSet() });
    progress = startFlyover(progress);
    progress = nextWaypoint(progress); // state -> "flying"
    progress = togglePause(progress);  // state -> "paused"

    const resumed = togglePause(progress);
    expect(resumed.state).toBe("flying");
    expect(resumed.isPaused).toBe(false);
  });

  it('is no-op in "idle" state (returns same object)', () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    const result = togglePause(progress);
    expect(result).toBe(progress);
  });

  it('is no-op in "complete" state', () => {
    const events = [createTestEvent()];
    let progress = createFlyoverProgress({ events });
    progress = startFlyover(progress);
    progress = nextWaypoint(progress); // single event -> "complete"

    const result = togglePause(progress);
    expect(result).toBe(progress);
  });
});

describe("stopFlyover", () => {
  it("resets to idle with currentIndex 0", () => {
    let progress = createFlyoverProgress({ events: createTestEventSet() });
    progress = startFlyover(progress);
    progress = nextWaypoint(progress);
    progress = nextWaypoint(progress);

    const stopped = stopFlyover(progress);
    expect(stopped.state).toBe("idle");
    expect(stopped.currentIndex).toBe(0);
    expect(stopped.currentNarrative).toBe("");
    expect(stopped.isPaused).toBe(false);
  });
});

describe("updateWaypointAudio", () => {
  it("updates narrative and audio for specified index", () => {
    const progress = createFlyoverProgress({ events: createTestEventSet() });
    const audioBuffer = new ArrayBuffer(16);

    const updated = updateWaypointAudio(progress, [
      { index: 0, narrative: "Custom narrative", audioBuffer },
    ]);

    expect(updated.waypoints[0].narrative).toBe("Custom narrative");
    expect(updated.waypoints[0].audioBuffer).toBe(audioBuffer);
  });

  it("sets audioReady to true when all waypoints have audio", () => {
    const events = [createTestEvent({ id: "a" }), createTestEvent({ id: "b" })];
    const progress = createFlyoverProgress({ events });

    const buf1 = new ArrayBuffer(8);
    const buf2 = new ArrayBuffer(8);

    // Add audio to first waypoint only
    const partial = updateWaypointAudio(progress, [{ index: 0, audioBuffer: buf1 }]);
    expect(partial.audioReady).toBe(false);

    // Add audio to second waypoint
    const full = updateWaypointAudio(partial, [{ index: 1, audioBuffer: buf2 }]);
    expect(full.audioReady).toBe(true);
  });
});
