/**
 * @module sync-events
 * Orchestrator: runs all event fetchers, deduplicates, validates coordinates
 * and schema, and writes the unified events.json.
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
  writeRegistry,
} from "./utils/registry-writer";
import { logger } from "./utils/logger";
import { validateCoordinates } from "./validators/coordinate-validator";
import { validateSchema } from "./validators/schema-validator";
import { printQualityReport, type RejectionStats } from "./report/quality-report";

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

  // 1. Read existing registry (manual/seed events are no longer preserved)
  logger.info("Reading existing events.json...");
  readExistingRegistry(); // Validates file exists

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
  const deduped = deduplicateEvents(fetchedEvents);
  const dupsMerged = fetchedEvents.length - deduped.length;
  logger.info(`After dedup: ${deduped.length} unique events (${dupsMerged} duplicates merged)`);

  // 4. Validate coordinates and schema
  logger.section("Validation");
  const rejections: RejectionStats = {
    outOfBounds: 0,
    missingCoords: 0,
    downtownFallback: 0,
    schemaInvalid: 0,
  };

  const validated = deduped.filter((event) => {
    // Schema validation
    const schemaResult = validateSchema(event);
    if (!schemaResult.valid) {
      rejections.schemaInvalid++;
      logger.debug(`Schema rejected "${event.title}": ${schemaResult.reasons.join(", ")}`);
      return false;
    }

    // Coordinate validation
    const [lng, lat] = event.coordinates;
    const coordResult = validateCoordinates(lat, lng);
    if (!coordResult.valid) {
      if (coordResult.reason?.includes("outside")) rejections.outOfBounds++;
      else if (coordResult.reason?.includes("fallback")) rejections.downtownFallback++;
      else rejections.missingCoords++;
      logger.debug(`Coord rejected "${event.title}": ${coordResult.reason}`);
      return false;
    }

    return true;
  });

  const totalRejected =
    rejections.outOfBounds +
    rejections.missingCoords +
    rejections.downtownFallback +
    rejections.schemaInvalid;
  logger.info(`Validated: ${validated.length} accepted, ${totalRejected} rejected`);

  // 5. Write the registry
  logger.section("Writing Output");
  writeRegistry(validated);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  logger.success(`Pipeline complete in ${elapsed}s`);

  // 6. Quality report
  printQualityReport(validated, rejections, dupsMerged);
}

main().catch((err) => {
  logger.error(`Fatal: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
