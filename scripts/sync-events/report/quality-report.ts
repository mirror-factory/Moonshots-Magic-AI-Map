/**
 * @module sync-events/report/quality-report
 * Post-sync quality summary. Prints statistics about the sync run
 * so data issues are caught immediately.
 */

import type { EventEntry } from "../../../src/lib/registries/types";
import { logger } from "../utils/logger";

/** Rejection reason counts from validation. */
export interface RejectionStats {
  outOfBounds: number;
  missingCoords: number;
  downtownFallback: number;
  schemaInvalid: number;
}

/**
 * Print a quality report after the sync pipeline completes.
 * @param accepted - Events that passed validation and were written.
 * @param rejections - Rejection statistics from validation.
 * @param dupsMerged - Number of duplicates merged.
 */
export function printQualityReport(
  accepted: EventEntry[],
  rejections: RejectionStats,
  dupsMerged: number,
): void {
  logger.section("Quality Report");

  // Events by source
  const sourceCounts = new Map<string, number>();
  for (const event of accepted) {
    const key = event.source.type;
    sourceCounts.set(key, (sourceCounts.get(key) ?? 0) + 1);
  }

  logger.info("Events by source:");
  for (const [source, count] of [...sourceCounts.entries()].sort((a, b) => b[1] - a[1])) {
    logger.info(`  ${source.padEnd(15)} ${count}`);
  }
  logger.info(`  ${"TOTAL".padEnd(15)} ${accepted.length}`);

  // Rejections
  const totalRejected =
    rejections.outOfBounds +
    rejections.missingCoords +
    rejections.downtownFallback +
    rejections.schemaInvalid;

  if (totalRejected > 0) {
    logger.info("");
    logger.warn(`Rejected: ${totalRejected} events`);
    if (rejections.outOfBounds > 0)
      logger.warn(`  Out-of-bounds:      ${rejections.outOfBounds}`);
    if (rejections.missingCoords > 0)
      logger.warn(`  Missing coords:     ${rejections.missingCoords}`);
    if (rejections.downtownFallback > 0)
      logger.warn(`  Downtown fallback:  ${rejections.downtownFallback}`);
    if (rejections.schemaInvalid > 0)
      logger.warn(`  Schema invalid:     ${rejections.schemaInvalid}`);
  } else {
    logger.success("No events rejected");
  }

  // Missing descriptions
  const emptyDescriptions = accepted.filter(
    (e) => !e.description?.trim(),
  ).length;
  if (emptyDescriptions > 0) {
    logger.info("");
    logger.warn(`Events with empty descriptions: ${emptyDescriptions} (${((emptyDescriptions / accepted.length) * 100).toFixed(1)}%)`);
  }

  // Duplicates merged
  if (dupsMerged > 0) {
    logger.info(`Duplicates merged: ${dupsMerged}`);
  }
}
