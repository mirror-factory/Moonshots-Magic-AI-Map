/**
 * @module scripts/sync-events/validate-urls
 * Generates a URL validation manifest by sampling events from each source type.
 * Reads events.json, picks 10 random events per source, and writes a JSON manifest.
 *
 * @example
 * ```bash
 * npx tsx scripts/sync-events/validate-urls.ts --out /tmp/url-manifest.json
 * ```
 */

import { readFileSync, writeFileSync } from "node:fs";
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

/** Fisher-Yates shuffle, returns a new array. */
function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Parse CLI args for --out flag. */
function parseArgs(): string {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  if (outIdx !== -1 && args[outIdx + 1]) {
    return args[outIdx + 1];
  }
  return resolve("/tmp/url-manifest.json");
}

function main() {
  const outPath = parseArgs();
  const eventsPath = resolve(__dirname, "../../src/data/events.json");
  const raw = JSON.parse(readFileSync(eventsPath, "utf-8"));
  const events: Array<{
    id: string;
    title: string;
    venue: string;
    url?: string;
    source: { type: string };
  }> = raw.events;

  // Group by source type
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
    // Only sample events that have a URL
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

  // Summary
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

main();
