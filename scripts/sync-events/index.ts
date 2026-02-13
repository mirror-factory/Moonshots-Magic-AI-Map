/**
 * @module sync-events
 * Orchestrator: runs all event fetchers, deduplicates, preserves manual
 * events, and writes the unified events.json.
 *
 * Usage: pnpm sync-events
 */

import { fetchTicketmasterEvents } from "./fetchers/ticketmaster";
import { fetchEventbriteEvents } from "./fetchers/eventbrite";
import { fetchOrlandoWeeklyEvents } from "./fetchers/orlando-weekly";
import { fetchCityOfOrlandoEvents } from "./fetchers/city-of-orlando";
import { fetchVisitOrlandoEvents } from "./fetchers/visit-orlando";
import { fetchSerpApiEvents } from "./fetchers/serpapi";
import { fetchTkxEvents } from "./fetchers/tkx";
import { deduplicateEvents } from "./utils/dedup";
import {
  readExistingRegistry,
  extractManualEvents,
  writeRegistry,
} from "./utils/registry-writer";
import { logger } from "./utils/logger";

/** Fetcher definition for the pipeline. */
interface FetcherDef {
  name: string;
  fn: () => Promise<import("../../src/lib/registries/types").EventEntry[]>;
}

const FETCHERS: FetcherDef[] = [
  { name: "Ticketmaster", fn: fetchTicketmasterEvents },
  { name: "Eventbrite", fn: fetchEventbriteEvents },
  { name: "Orlando Weekly", fn: fetchOrlandoWeeklyEvents },
  { name: "City of Orlando", fn: fetchCityOfOrlandoEvents },
  { name: "Visit Orlando", fn: fetchVisitOrlandoEvents },
  { name: "SerpApi Google Events", fn: fetchSerpApiEvents },
  { name: "TKX Events", fn: fetchTkxEvents },
];

/** Run the full sync pipeline. */
async function main(): Promise<void> {
  const startTime = Date.now();
  logger.section("Moonshots & Magic — Event Sync Pipeline");
  logger.info(`Started at ${new Date().toLocaleString()}`);

  // 1. Read existing registry and extract manual events
  logger.info("Reading existing events.json...");
  const existingRegistry = readExistingRegistry();
  const manualEvents = extractManualEvents(existingRegistry);
  logger.info(`Found ${manualEvents.length} manual (seed) events to preserve`);

  // 2. Run all fetchers (resilient — failures don't stop others)
  const fetchedEvents: import("../../src/lib/registries/types").EventEntry[] = [];

  for (const fetcher of FETCHERS) {
    try {
      const events = await fetcher.fn();
      fetchedEvents.push(...events);
    } catch (err) {
      logger.error(
        `${fetcher.name} failed entirely: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  logger.section("Deduplication & Merge");
  logger.info(`Total fetched events (pre-dedup): ${fetchedEvents.length}`);

  // 3. Deduplicate fetched events
  const dedupedFetched = deduplicateEvents(fetchedEvents);
  logger.info(`After dedup: ${dedupedFetched.length} unique fetched events`);

  // 4. Merge: manual events always win, then deduped fetched
  const allEvents = deduplicateEvents([...manualEvents, ...dedupedFetched]);
  logger.info(`Total merged events: ${allEvents.length}`);

  // 5. Write the registry
  logger.section("Writing Output");
  writeRegistry(allEvents);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  logger.success(`Pipeline complete in ${elapsed}s`);

  // Summary
  logger.section("Summary");
  const sourceCounts = new Map<string, number>();
  for (const event of allEvents) {
    const key = event.source.type;
    sourceCounts.set(key, (sourceCounts.get(key) ?? 0) + 1);
  }
  for (const [source, count] of sourceCounts) {
    logger.info(`  ${source}: ${count} events`);
  }
}

main().catch((err) => {
  logger.error(`Fatal: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
