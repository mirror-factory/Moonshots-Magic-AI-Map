# Sync Events Pipeline

Multi-source event data pipeline that fetches, normalizes, deduplicates, and writes events to `src/data/events.json`.

## How to Run

```bash
npx tsx --env-file=.env.local scripts/sync-events/index.ts
```

## Required Environment Variables

| Variable | Source | Required |
|----------|--------|----------|
| `TICKETMASTER_API_KEY` | [Ticketmaster Developer](https://developer.ticketmaster.com/) | Yes |
| `EVENTBRITE_PRIVATE_TOKEN` | [Eventbrite API](https://www.eventbrite.com/platform/api) | Yes |
| `SERPAPI_KEY` | [SerpApi](https://serpapi.com/) | Yes |
| `FIRECRAWL_API_KEY` | [Firecrawl](https://firecrawl.dev/) | Optional (future) |

## Pipeline Architecture

```
index.ts (orchestrator)
  ├── fetchers/           ← 7 source adapters
  │   ├── ticketmaster.ts     Discovery API, 50mi radius, 7-month window
  │   ├── eventbrite.ts       2-phase: discovery + venue enrichment
  │   ├── serpapi.ts           Google Events via SerpApi, 50+ queries
  │   ├── tkx.ts               tkx.events calendar scraper
  │   ├── orlando-weekly.ts    Orlando Weekly community events
  │   ├── city-of-orlando.ts   orlando.gov events page
  │   └── visit-orlando.ts     visitorlando.com events
  ├── normalizers/        ← Shape converters → EventEntry
  │   ├── ticketmaster-normalizer.ts
  │   └── scraper-normalizer.ts     (shared by all scrapers)
  └── utils/
      ├── dedup.ts              Priority-based deduplication
      ├── category-mapper.ts    TM classification + text inference
      ├── rate-limiter.ts       Per-source rate limiting
      ├── registry-writer.ts    Read/write events.json
      └── logger.ts             Colored console output
```

## Pipeline Flow

1. Read existing `events.json`
2. Run all 7 fetchers sequentially (failures are resilient — one failing doesn't block others)
3. Deduplicate by normalized `title|venue|date` key
4. Write merged results to `src/data/events.json` with metadata

## Dedup Priority (lower wins)

1. **Ticketmaster** — authoritative venue data, coordinates, images
2. **Eventbrite** — enriched venue + pricing
3. **SerpAPI (Google Events)** — broad coverage, good descriptions
4. **Scrapers** (TKX, OW, CoO, VO) — supplementary local events
5. **Overpass / PredictHQ** — fallback sources

Dedup normalizes titles (strips year prefixes, package suffixes like "VIP/Suite", orders vs-matchups alphabetically).

## Source Quality

| Source | URLs | Coords | Descriptions | Prices | Images |
|--------|------|--------|-------------|--------|--------|
| Ticketmaster | ~60% native, 100% with fallback | Yes | Good | Yes | Yes |
| Eventbrite | Yes | Yes (enriched) | Good | Yes | Yes |
| SerpAPI | Yes | Via venue lookup | Good | Rare | Sometimes |
| TKX | Yes | Via venue lookup | From detail pages | No | Yes |
| Orlando Weekly | Sometimes | Via venue lookup | Short | No | Sometimes |
| City of Orlando | Sometimes | Via venue lookup | Short | No | Rare |
| Visit Orlando | Sometimes | Via venue lookup | Short | No | Sometimes |

## Adding a New Source

1. Create `scripts/sync-events/fetchers/my-source.ts`
2. Export an `async function fetchMySourceEvents(): Promise<EventEntry[]>`
3. Use `createRateLimitedFetch()` for HTTP calls
4. Normalize via `buildScrapedEvent()` (scrapers) or a custom normalizer
5. Add the fetcher to the `fetchers` array in `scripts/sync-events/index.ts`
6. Add the source type to `dedup.ts` SOURCE_PRIORITY map
7. Add a display label to `SOURCE_LABELS` in the UI components:
   - `src/components/map/event-detail-panel-dropdown.tsx`
   - `src/components/map/events-dropdown.tsx`
   - `src/components/chat/event-card.tsx`

## Testing

```bash
pnpm vitest run tests/unit/sync-events/
```

Test files:
- `tests/unit/sync-events/dedup.test.ts` — dedup key building + priority
- `tests/unit/sync-events/category-mapper.test.ts` — TM + text category inference
- `tests/unit/sync-events/ticketmaster-normalizer.test.ts` — TM → EventEntry
- `tests/unit/sync-events/scraper-normalizer.test.ts` — scraper → EventEntry

## URL Validation

Spot-check that event URLs still resolve to real event pages.

### 1. Generate Manifest

```bash
npx tsx scripts/sync-events/validate-urls.ts --out /tmp/url-manifest.json
```

Samples 10 random events per source type (only events with URLs). Manifest shape:

```json
{
  "generatedAt": "...",
  "sources": {
    "ticketmaster": { "totalEvents": 980, "samples": [{ "id", "title", "venue", "url", "sourceType" }] },
    "eventbrite": { "totalEvents": 531, "samples": [...] }
  }
}
```

### 2. Chrome-Based Validation (Claude Code)

Using `mcp__claude-in-chrome__*` tools, for each sampled URL:

1. Open a new tab → navigate to the URL
2. Extract page text
3. Score the result:
   - **PASS** — page loads, event title or venue appears in page text
   - **PARTIAL** — page loads but title/venue not found (redirect, renamed, etc.)
   - **FAIL** — 404, domain error, blocked, or page doesn't load

### 3. When to Run

- After a sync run, before deploying updated `events.json`
- When investigating broken links reported by users
- Periodic health check (monthly recommended)

### 4. Interpreting Results

- **>80% PASS per source** — healthy
- **50–80%** — source adapter may need URL logic updates
- **<50%** — source is likely broken or URLs have expired; investigate the fetcher

## Output

`src/data/events.json` — JSON with:
- `version`: "1.0.0"
- `lastSynced`: ISO timestamp
- `metadata`: totalEvents, activeEvents, categories, regions
- `events`: EventEntry[]
