/**
 * @module scripts/sync-events/validate-urls
 * Generates a URL validation manifest by sampling events from each source type.
 * Reads events.json, picks 10 random events per source, and writes a JSON manifest.
 *
 * @example Generate manifest only
 * ```bash
 * npx tsx scripts/sync-events/validate-urls.ts --out /tmp/url-manifest.json
 * ```
 *
 * @example Save validation results (after Chrome-based validation)
 * ```bash
 * npx tsx scripts/sync-events/validate-urls.ts --save-results /tmp/validation-run.json
 * ```
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** Shape of a sampled event in the manifest. */
interface ManifestSample {
  id: string;
  title: string;
  venue: string;
  url: string;
  sourceType: string;
}

/** Per-source summary in the manifest. */
interface SourceSummary {
  totalEvents: number;
  samples: ManifestSample[];
}

/** Top-level manifest shape. */
interface ValidationManifest {
  generatedAt: string;
  sources: Record<string, SourceSummary>;
}

/** Individual URL validation result. */
interface ValidationResult {
  id: string;
  title: string;
  venue: string;
  url: string;
  status: "pass" | "partial" | "fail";
  notes: string;
}

/** Per-source validation summary. */
interface SourceValidation {
  totalEvents: number;
  sampledWithUrls: number;
  pass: number;
  partial: number;
  fail: number;
  rate: number;
  results: ValidationResult[];
}

/** Issue found during validation. */
interface ValidationIssue {
  severity: "high" | "medium" | "low";
  source: string;
  issue: string;
  affected: number;
}

/** A single validation run. */
interface ValidationRun {
  runId: string;
  generatedAt: string;
  validatedAt: string;
  totalSampled: number;
  overall: { pass: number; partial: number; fail: number; rate: number };
  sources: Record<string, SourceValidation>;
  issues: ValidationIssue[];
}

/** Persistent validation results file. */
interface ValidationResultsFile {
  runs: ValidationRun[];
}

/** Path to persistent validation results. */
const RESULTS_PATH = resolve(__dirname, "validation-results.json");

/** Fisher-Yates shuffle, returns a new array. */
function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Parse CLI args. */
function parseArgs(): { mode: "manifest"; outPath: string } | { mode: "save"; runPath: string } {
  const args = process.argv.slice(2);

  const saveIdx = args.indexOf("--save-results");
  if (saveIdx !== -1 && args[saveIdx + 1]) {
    return { mode: "save", runPath: args[saveIdx + 1] };
  }

  const outIdx = args.indexOf("--out");
  const outPath = outIdx !== -1 && args[outIdx + 1]
    ? args[outIdx + 1]
    : resolve("/tmp/url-manifest.json");

  return { mode: "manifest", outPath };
}

/** Generate a URL validation manifest from events.json. */
function generateManifest(outPath: string): void {
  const eventsPath = resolve(__dirname, "../../src/data/events.json");
  const raw = JSON.parse(readFileSync(eventsPath, "utf-8"));
  const events: Array<{
    id: string;
    title: string;
    venue: string;
    url?: string;
    source: { type: string };
  }> = raw.events;

  const grouped = new Map<string, typeof events>();
  for (const event of events) {
    const sourceType = event.source.type;
    if (!grouped.has(sourceType)) {
      grouped.set(sourceType, []);
    }
    grouped.get(sourceType)!.push(event);
  }

  const manifest: ValidationManifest = {
    generatedAt: new Date().toISOString(),
    sources: {},
  };

  for (const [sourceType, sourceEvents] of grouped) {
    const withUrls = sourceEvents.filter((e) => e.url);
    const sampled = shuffle(withUrls).slice(0, 10);

    manifest.sources[sourceType] = {
      totalEvents: sourceEvents.length,
      samples: sampled.map((e) => ({
        id: e.id,
        title: e.title,
        venue: e.venue,
        url: e.url!,
        sourceType,
      })),
    };
  }

  writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf-8");

  console.log(`\nURL Validation Manifest generated → ${outPath}\n`);
  for (const [source, summary] of Object.entries(manifest.sources)) {
    const withUrls = events.filter(
      (e) => e.source.type === source && e.url,
    ).length;
    console.log(
      `  ${source}: ${summary.samples.length} sampled / ${withUrls} with URLs / ${summary.totalEvents} total`,
    );
  }
  console.log();
}

/** Merge a validation run into the persistent results file. */
function saveResults(runPath: string): void {
  const run: ValidationRun = JSON.parse(readFileSync(runPath, "utf-8"));

  let resultsFile: ValidationResultsFile = { runs: [] };
  if (existsSync(RESULTS_PATH)) {
    resultsFile = JSON.parse(readFileSync(RESULTS_PATH, "utf-8"));
  }

  // Replace existing run with same runId, or append
  const existingIdx = resultsFile.runs.findIndex((r) => r.runId === run.runId);
  if (existingIdx !== -1) {
    resultsFile.runs[existingIdx] = run;
    console.log(`\nUpdated existing run ${run.runId} in validation-results.json`);
  } else {
    resultsFile.runs.push(run);
    console.log(`\nAppended run ${run.runId} to validation-results.json`);
  }

  writeFileSync(RESULTS_PATH, JSON.stringify(resultsFile, null, 2), "utf-8");
  console.log(`  Total runs tracked: ${resultsFile.runs.length}`);
  console.log(`  Results path: ${RESULTS_PATH}\n`);
}

function main(): void {
  const config = parseArgs();

  if (config.mode === "save") {
    saveResults(config.runPath);
  } else {
    generateManifest(config.outPath);
  }
}

main();
