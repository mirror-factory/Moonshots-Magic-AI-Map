/**
 * @module sync-events/utils/registry-writer
 * Reads existing events.json, preserves manual events, writes merged output.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  EventEntry,
  EventRegistry,
  EventCategory,
} from "../../../src/lib/registries/types";
import { logger } from "./logger";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_PATH = resolve(
  __dirname,
  "../../../src/data/events.json",
);

/**
 * Read and parse the existing events.json file.
 * @returns Parsed EventRegistry.
 */
export function readExistingRegistry(): EventRegistry {
  const raw = readFileSync(EVENTS_PATH, "utf-8");
  return JSON.parse(raw) as EventRegistry;
}

/**
 * Extract manual (seed) events from the registry.
 * @param registry - Existing registry.
 * @returns Array of manual events.
 */
export function extractManualEvents(registry: EventRegistry): EventEntry[] {
  return registry.events.filter((e) => e.source.type === "manual");
}

/**
 * Build category counts from an event list.
 * @param events - All events.
 * @returns Category count record.
 */
function buildCategoryCounts(
  events: EventEntry[],
): Partial<Record<EventCategory, number>> {
  const counts: Partial<Record<EventCategory, number>> = {};
  for (const event of events) {
    counts[event.category] = (counts[event.category] ?? 0) + 1;
  }
  return counts;
}

/**
 * Collect unique regions from an event list.
 * @param events - All events.
 * @returns Sorted array of unique regions.
 */
function collectRegions(events: EventEntry[]): string[] {
  const regions = new Set<string>();
  for (const event of events) {
    if (event.region) regions.add(event.region);
  }
  return [...regions].sort();
}

/**
 * Write the merged events to events.json with updated metadata.
 * @param events - Final merged event list.
 */
export function writeRegistry(events: EventEntry[]): void {
  const activeEvents = events.filter((e) => e.status === "active");

  const registry: EventRegistry = {
    version: "1.0.0",
    lastSynced: new Date().toISOString(),
    metadata: {
      totalEvents: events.length,
      activeEvents: activeEvents.length,
      categories: buildCategoryCounts(events),
      regions: collectRegions(events),
    },
    events,
  };

  writeFileSync(EVENTS_PATH, JSON.stringify(registry, null, 2) + "\n", "utf-8");
  logger.success(
    `Wrote ${events.length} events (${activeEvents.length} active) to events.json`,
  );
}
