/**
 * @module validate-events
 * Local event data validation — schema integrity + URL health checks.
 *
 * Usage:
 *   pnpm validate-events              # full validation (data + URLs)
 *   pnpm validate-events --no-urls    # data integrity only
 *   pnpm validate-events --sample 10  # custom URL sample size per source
 *   pnpm validate-events --json /tmp/report.json  # save JSON report
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ── Constants ────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  "music", "arts", "sports", "food", "tech", "community",
  "family", "nightlife", "outdoor", "education", "festival", "market", "other",
] as const;

const VALID_SOURCE_TYPES = [
  "ticketmaster", "eventbrite", "serpapi", "scraper",
  "predicthq", "overpass", "manual",
] as const;

/** Central Florida bounding box. */
const BOUNDS = { lngMin: -83.5, lngMax: -79.5, latMin: 27.0, latMax: 30.0 };

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
} as const;

const URL_TIMEOUT_MS = 8_000;
const RATE_LIMIT_MS = 500;
const DEFAULT_SAMPLE_SIZE = 5;

/**
 * Domains that use aggressive bot protection (Akamai, Cloudflare challenges, etc.)
 * and will always return 401/403 to server-side fetch. URLs from these domains are
 * valid — they work fine in a browser — but can't be verified without a headless browser.
 */
const BOT_PROTECTED_DOMAINS = [
  "www.ticketmaster.com",
  "ticketmaster.com",
  "www.livenation.com",
  "livenation.com",
] as const;

// ── Types ────────────────────────────────────────────────────────────────────

interface EventEntry {
  id: string;
  title: string;
  venue: string;
  address: string;
  city: string;
  coordinates: [number, number];
  startDate: string;
  endDate?: string;
  category: string;
  url?: string;
  imageUrl?: string;
  status: string;
  source: { type: string; [key: string]: unknown };
  price?: { min: number; max: number; currency: string; isFree: boolean };
  [key: string]: unknown;
}

interface EventRegistry {
  events: EventEntry[];
  [key: string]: unknown;
}

interface Issue {
  severity: "error" | "warning";
  check: string;
  message: string;
  eventId?: string;
  eventTitle?: string;
}

interface IntegrityResult {
  totalEvents: number;
  errors: Issue[];
  warnings: Issue[];
}

type UrlStatus = "pass" | "partial" | "fail" | "skipped";

interface UrlCheckResult {
  eventId: string;
  title: string;
  sourceType: string;
  url: string;
  status: UrlStatus;
  httpStatus?: number;
  reason?: string;
}

interface UrlHealthResult {
  totalSampled: number;
  results: UrlCheckResult[];
  bySource: Record<string, { sampled: number; pass: number; partial: number; fail: number; skipped: number }>;
}

interface CliArgs {
  noUrls: boolean;
  sample: number;
  jsonPath: string | null;
}

// ── CLI Parsing ──────────────────────────────────────────────────────────────

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = { noUrls: false, sample: DEFAULT_SAMPLE_SIZE, jsonPath: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--no-urls") {
      result.noUrls = true;
    } else if (args[i] === "--sample" && args[i + 1]) {
      const n = parseInt(args[i + 1], 10);
      if (isNaN(n) || n < 1) {
        console.error(`${COLORS.red}Invalid --sample value: ${args[i + 1]}${COLORS.reset}`);
        process.exit(1);
      }
      result.sample = n;
      i++;
    } else if (args[i] === "--json" && args[i + 1]) {
      result.jsonPath = args[i + 1];
      i++;
    }
  }

  return result;
}

// ── Data Loading ─────────────────────────────────────────────────────────────

function loadEvents(): EventEntry[] {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const filePath = resolve(scriptDir, "../src/data/events.json");
  const raw = readFileSync(filePath, "utf-8");
  const registry: EventRegistry = JSON.parse(raw);
  return registry.events;
}

// ── Phase 1: Data Integrity ──────────────────────────────────────────────────

function checkDataIntegrity(events: EventEntry[]): IntegrityResult {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const seenIds = new Set<string>();

  for (const evt of events) {
    const ctx = { eventId: evt.id, eventTitle: evt.title };

    // Duplicate IDs
    if (seenIds.has(evt.id)) {
      errors.push({ severity: "error", check: "duplicate-id", message: `Duplicate event ID: ${evt.id}`, ...ctx });
    }
    seenIds.add(evt.id);

    // Required fields
    const requiredFields = ["title", "venue", "address", "city", "startDate"] as const;
    for (const field of requiredFields) {
      if (!evt[field] || (typeof evt[field] === "string" && (evt[field] as string).trim() === "")) {
        errors.push({ severity: "error", check: "required-field", message: `Missing or empty required field: ${field}`, ...ctx });
      }
    }

    // Coordinates
    if (!evt.coordinates || !Array.isArray(evt.coordinates) || evt.coordinates.length !== 2) {
      errors.push({ severity: "error", check: "required-field", message: "Missing or invalid coordinates", ...ctx });
    } else {
      const [lng, lat] = evt.coordinates;
      if (lng < BOUNDS.lngMin || lng > BOUNDS.lngMax || lat < BOUNDS.latMin || lat > BOUNDS.latMax) {
        warnings.push({
          severity: "warning", check: "coordinate-bounds",
          message: `Coordinates [${lng}, ${lat}] outside Central FL bounds`, ...ctx,
        });
      }
    }

    // Source type
    if (!evt.source?.type) {
      errors.push({ severity: "error", check: "required-field", message: "Missing source.type", ...ctx });
    } else if (!(VALID_SOURCE_TYPES as readonly string[]).includes(evt.source.type)) {
      warnings.push({ severity: "warning", check: "source-type", message: `Unrecognized source type: ${evt.source.type}`, ...ctx });
    }

    // Category
    if (!(VALID_CATEGORIES as readonly string[]).includes(evt.category)) {
      errors.push({ severity: "error", check: "category", message: `Invalid category: ${evt.category}`, ...ctx });
    }

    // Date validity
    if (evt.startDate) {
      const d = new Date(evt.startDate);
      if (isNaN(d.getTime())) {
        errors.push({ severity: "error", check: "date-validity", message: `Invalid startDate: ${evt.startDate}`, ...ctx });
      } else {
        // Past events check
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        if (d < ninetyDaysAgo && evt.status === "active") {
          warnings.push({
            severity: "warning", check: "past-event",
            message: `Active event with startDate >90 days past (${evt.startDate})`, ...ctx,
          });
        }
      }
    }

    // URL syntax
    if (evt.url) {
      try {
        new URL(evt.url);
      } catch {
        errors.push({ severity: "error", check: "url-syntax", message: `Invalid URL: ${evt.url}`, ...ctx });
      }
    }

    // Image URL syntax
    if (evt.imageUrl) {
      try {
        new URL(evt.imageUrl);
      } catch {
        warnings.push({ severity: "warning", check: "image-url-syntax", message: `Invalid imageUrl: ${evt.imageUrl}`, ...ctx });
      }
    }

    // Price logic
    if (evt.price) {
      if (typeof evt.price.min === "number" && typeof evt.price.max === "number" && evt.price.min > evt.price.max) {
        warnings.push({ severity: "warning", check: "price-logic", message: `Price min (${evt.price.min}) > max (${evt.price.max})`, ...ctx });
      }
      if (evt.price.currency && typeof evt.price.currency !== "string") {
        warnings.push({ severity: "warning", check: "price-logic", message: "Price currency is not a string", ...ctx });
      }
    }
  }

  return { totalEvents: events.length, errors, warnings };
}

// ── Phase 2: URL Health ──────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "MoonshotsMagic-EventValidator/1.0" },
    });
  } finally {
    clearTimeout(timer);
  }
}

function isBotProtected(url: string): boolean {
  const domain = getDomain(url);
  return (BOT_PROTECTED_DOMAINS as readonly string[]).includes(domain);
}

async function checkSingleUrl(evt: EventEntry): Promise<UrlCheckResult> {
  const base = { eventId: evt.id, title: evt.title, sourceType: evt.source.type, url: evt.url! };

  // Skip domains with known bot protection (Akamai WAF) — URLs are valid but
  // always return 401/403 to server-side fetch. Only a real browser can load them.
  if (isBotProtected(evt.url!)) {
    return { ...base, status: "skipped", reason: "Bot-protected domain (Akamai WAF)" };
  }

  try {
    const res = await fetchWithTimeout(evt.url!, URL_TIMEOUT_MS);
    const httpStatus = res.status;

    if (httpStatus < 200 || httpStatus >= 300) {
      return { ...base, status: "fail", httpStatus, reason: `HTTP ${httpStatus}` };
    }

    // Read first 50KB of body for content matching
    const reader = res.body?.getReader();
    if (!reader) {
      return { ...base, status: "partial", httpStatus, reason: "No response body" };
    }

    let bodyText = "";
    const maxBytes = 50 * 1024;
    let bytesRead = 0;

    while (bytesRead < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      bodyText += new TextDecoder().decode(value, { stream: true });
      bytesRead += value.byteLength;
    }
    reader.cancel().catch(() => {});

    const lower = bodyText.toLowerCase();
    const titleWords = evt.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const venueWords = evt.venue.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    const titleMatch = titleWords.some(w => lower.includes(w));
    const venueMatch = venueWords.some(w => lower.includes(w));

    if (titleMatch || venueMatch) {
      return { ...base, status: "pass", httpStatus };
    }
    return { ...base, status: "partial", httpStatus, reason: "Title/venue not found in page body" };
  } catch (err) {
    const reason = err instanceof Error && err.name === "AbortError"
      ? `Timeout (${URL_TIMEOUT_MS / 1000}s)`
      : err instanceof Error ? err.message : "Network error";
    return { ...base, status: "fail", reason };
  }
}

async function checkUrlHealth(events: EventEntry[], sampleSize: number): Promise<UrlHealthResult> {
  const eventsWithUrl = events.filter(e => e.url);

  // Group by source type
  const bySource: Record<string, EventEntry[]> = {};
  for (const evt of eventsWithUrl) {
    const type = evt.source.type;
    if (!bySource[type]) bySource[type] = [];
    bySource[type].push(evt);
  }

  // Sample from each source
  const sampled: EventEntry[] = [];
  for (const [, group] of Object.entries(bySource)) {
    const shuffled = shuffle(group);
    sampled.push(...shuffled.slice(0, sampleSize));
  }

  const results: UrlCheckResult[] = [];
  const lastRequestByDomain: Record<string, number> = {};

  for (const evt of sampled) {
    const domain = getDomain(evt.url!);

    // Rate limiting per domain
    const lastReq = lastRequestByDomain[domain] ?? 0;
    const elapsed = Date.now() - lastReq;
    if (elapsed < RATE_LIMIT_MS) {
      await new Promise(r => setTimeout(r, RATE_LIMIT_MS - elapsed));
    }

    process.stdout.write(`${COLORS.gray}  Checking: ${evt.title.slice(0, 50)}...${COLORS.reset}\r`);
    lastRequestByDomain[domain] = Date.now();

    const result = await checkSingleUrl(evt);
    results.push(result);
  }

  // Clear the progress line
  process.stdout.write("\r" + " ".repeat(80) + "\r");

  // Aggregate by source
  const sourceStats: UrlHealthResult["bySource"] = {};
  for (const r of results) {
    if (!sourceStats[r.sourceType]) {
      sourceStats[r.sourceType] = { sampled: 0, pass: 0, partial: 0, fail: 0, skipped: 0 };
    }
    sourceStats[r.sourceType].sampled++;
    sourceStats[r.sourceType][r.status]++;
  }

  return { totalSampled: results.length, results, bySource: sourceStats };
}

// ── Report Printing ──────────────────────────────────────────────────────────

function printReport(integrity: IntegrityResult, urlHealth: UrlHealthResult | null): void {
  const { bold, reset, green, red, yellow, cyan, gray, magenta } = COLORS;

  console.log("");
  console.log(`${bold}${cyan}${"═".repeat(50)}${reset}`);
  console.log(`${bold}${cyan}       Event Validation Report${reset}`);
  console.log(`${bold}${cyan}${"═".repeat(50)}${reset}`);

  // Phase 1
  console.log(`\n${bold}${magenta}  DATA INTEGRITY${reset}`);
  console.log(`${green}  ${integrity.totalEvents.toLocaleString()} events loaded${reset}`);

  // Count unique IDs
  const dupCount = integrity.errors.filter(e => e.check === "duplicate-id").length;
  const dupLine = dupCount === 0
    ? `${green}  0 duplicate IDs${reset}`
    : `${red}  ${dupCount} duplicate IDs${reset}`;
  console.log(dupLine);

  // Category check
  const catErrors = integrity.errors.filter(e => e.check === "category").length;
  const validCats = integrity.totalEvents - catErrors;
  console.log(catErrors === 0
    ? `${green}  ${validCats.toLocaleString()} valid categories${reset}`
    : `${red}  ${catErrors} invalid categories${reset}`);

  // Coordinate bounds
  const coordWarns = integrity.warnings.filter(w => w.check === "coordinate-bounds").length;
  if (coordWarns > 0) {
    console.log(`${yellow}  ${coordWarns} events with coordinates outside Central FL${reset}`);
  } else {
    console.log(`${green}  All coordinates within Central FL bounds${reset}`);
  }

  // Past events
  const pastWarns = integrity.warnings.filter(w => w.check === "past-event").length;
  if (pastWarns > 0) {
    console.log(`${yellow}  ${pastWarns} active events with start dates >90 days past${reset}`);
  }

  // URL syntax
  const urlSyntaxErrors = integrity.errors.filter(e => e.check === "url-syntax").length;
  if (urlSyntaxErrors > 0) {
    console.log(`${red}  ${urlSyntaxErrors} events with invalid URL syntax${reset}`);
  }

  // Required field errors
  const reqFieldErrors = integrity.errors.filter(e => e.check === "required-field").length;
  if (reqFieldErrors > 0) {
    console.log(`${red}  ${reqFieldErrors} missing required fields${reset}`);
  }

  // Source type warnings
  const srcWarns = integrity.warnings.filter(w => w.check === "source-type").length;
  if (srcWarns > 0) {
    console.log(`${yellow}  ${srcWarns} unrecognized source types${reset}`);
  }

  // Price logic
  const priceWarns = integrity.warnings.filter(w => w.check === "price-logic").length;
  if (priceWarns > 0) {
    console.log(`${yellow}  ${priceWarns} price logic issues${reset}`);
  }

  console.log(`\n  ${red}Errors: ${integrity.errors.length}${reset}  ${yellow}Warnings: ${integrity.warnings.length}${reset}`);

  // Show first few errors/warnings for context
  if (integrity.errors.length > 0) {
    console.log(`\n${red}  ERRORS (showing first 5):${reset}`);
    for (const e of integrity.errors.slice(0, 5)) {
      console.log(`${gray}    [${e.check}]${reset} ${e.message}`);
      if (e.eventTitle) console.log(`${gray}      Event: "${e.eventTitle}"${reset}`);
    }
    if (integrity.errors.length > 5) {
      console.log(`${gray}    ... and ${integrity.errors.length - 5} more${reset}`);
    }
  }

  // Phase 2: URL Health
  if (urlHealth) {
    console.log(`\n${bold}${magenta}  URL HEALTH (${urlHealth.totalSampled} sampled)${reset}`);

    // Table header
    const pad = (s: string, n: number) => s.padEnd(n);
    console.log(`  ${gray}${pad("Source", 16)} ${pad("Sampled", 9)} ${pad("Pass", 8)} ${pad("Partial", 9)} ${pad("Fail", 8)} ${pad("Skipped", 7)}${reset}`);
    console.log(`  ${gray}${"─".repeat(57)}${reset}`);

    for (const [source, stats] of Object.entries(urlHealth.bySource).sort(([a], [b]) => a.localeCompare(b))) {
      const passColor = stats.fail === 0 ? green : reset;
      console.log(
        `  ${passColor}${pad(source, 16)} ${pad(String(stats.sampled), 9)} ${pad(String(stats.pass), 8)} ${pad(String(stats.partial), 9)} ${pad(String(stats.fail), 8)} ${pad(String(stats.skipped), 7)}${reset}`,
      );
    }

    const checked = urlHealth.results.filter(r => r.status !== "skipped");
    const totalPass = checked.filter(r => r.status === "pass").length;
    const totalSkipped = urlHealth.results.filter(r => r.status === "skipped").length;
    const pct = checked.length > 0 ? Math.round((totalPass / checked.length) * 100) : 0;
    console.log(`\n  Overall: ${totalPass}/${checked.length} pass (${pct}%)` +
      (totalSkipped > 0 ? `  ${gray}(${totalSkipped} skipped — bot-protected domains)${reset}` : ""));

    // Show failures (real ones, not skipped)
    const failures = urlHealth.results.filter(r => r.status === "fail");
    if (failures.length > 0) {
      console.log(`\n${red}  FAILED URLs:${reset}`);
      for (const f of failures) {
        console.log(`${red}  [${f.sourceType}]${reset} "${f.title}" — ${f.reason}`);
        console.log(`${gray}    ${f.url}${reset}`);
      }
    }

    // Show partials
    const partials = urlHealth.results.filter(r => r.status === "partial");
    if (partials.length > 0) {
      console.log(`\n${yellow}  PARTIAL URLs (200 OK but title/venue not found):${reset}`);
      for (const p of partials) {
        console.log(`${yellow}  [${p.sourceType}]${reset} "${p.title}"`);
        console.log(`${gray}    ${p.url}${reset}`);
      }
    }

    // Show skipped
    if (totalSkipped > 0) {
      console.log(`\n${gray}  SKIPPED (bot-protected, valid in browser):${reset}`);
      for (const s of urlHealth.results.filter(r => r.status === "skipped")) {
        console.log(`${gray}  [${s.sourceType}] "${s.title}"${reset}`);
      }
    }
  }

  console.log("");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startTime = Date.now();
  const args = parseArgs();

  const events = loadEvents();

  // Phase 1
  const integrity = checkDataIntegrity(events);

  // Phase 2
  let urlHealth: UrlHealthResult | null = null;
  if (!args.noUrls) {
    urlHealth = await checkUrlHealth(events, args.sample);
  }

  // Print report
  printReport(integrity, urlHealth);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`${COLORS.gray}Done in ${elapsed}s${COLORS.reset}\n`);

  // Save JSON report if requested
  if (args.jsonPath) {
    const report = { integrity, urlHealth, generatedAt: new Date().toISOString() };
    writeFileSync(args.jsonPath, JSON.stringify(report, null, 2));
    console.log(`${COLORS.green}Report saved to ${args.jsonPath}${COLORS.reset}\n`);
  }

  // Exit with error code if there are errors
  if (integrity.errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`${COLORS.red}Fatal error: ${err instanceof Error ? err.message : err}${COLORS.reset}`);
  process.exit(2);
});
