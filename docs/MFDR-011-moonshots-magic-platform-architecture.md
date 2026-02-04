# MFDR-011: Moonshots & Magic Platform Architecture

**Status:** Proposed
**Date:** 2026-02-04
**Owner:** Alfonso
**Phase:** Feasibility

---

## Context

There is no centralized, AI-powered tool for discovering tech events, news, and companies in the Central Florida region. Event data is scattered across Meetup, Eventbrite, Luma, university calendars, coworking space pages, and social media. A local newsletter writer is already covering the tech scene editorially, but the content lives in a newsletter silo with no structured, searchable, or geographic representation.

**Moonshots & Magic** aims to fill this gap: a map-first, AI-powered discovery platform for Central Florida's tech community. The platform will aggregate event data from multiple sources, ingest newsletter content as structured news, and provide conversational AI search so users can ask things like "what tech meetups are near me this week?"

This MFDR documents the full platform architecture — frontend, data sourcing, AI layer, and newsletter integration — as a single cohesive decision, since these components are tightly interdependent.

---

## Decision Drivers

- **Free/open source stack:** The project is bootstrapped by a solo developer. Recurring costs must stay under ~$50/month at MVP, ideally $0 to start. No vendor lock-in on core infrastructure.
- **Solo developer feasibility:** The architecture must be buildable and maintainable by one person. Complexity must be justified by clear value.
- **Reliable event data sourcing:** The platform is only as good as its data. The sourcing strategy must be sustainable, cover the Central Florida tech scene broadly, and not depend on a single provider.
- **AI-powered discovery:** Conversational search, smart recommendations, and automated content processing are core differentiators — not bolt-on features.
- **Community value first:** Monetization is TBD. The architecture should prioritize community utility and not lock the project into a specific business model prematurely.

---

## Options Considered

### Option A: Full-Stack AI Platform (Recommended)

**Description:** Next.js + MapLibre + Supabase (Postgres + pgvector) + Vercel AI SDK for user-facing AI + Ollama for background processing. Multi-source event ingestion via RSS feeds, iCal aggregation, targeted scraping, and community submission. Newsletter content ingested via RSS/API and processed by AI into structured data.

**Tech Stack:**

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js + react-maplibre + Tailwind | Free |
| Map Tiles | OpenFreeMap (start) → Protomaps PMTiles (scale) | Free |
| Database + Vector | Supabase (Postgres + pgvector) | Free tier → $25/mo |
| User-Facing AI | Vercel AI SDK + GPT-4o-mini | ~$38/mo at 500 DAU |
| Background AI | Ollama (Llama 3.3 / Qwen3) on Hustle Server | Free (local) |
| Embeddings | Ollama nomic-embed-text | Free (local) |
| Hosting | Vercel (frontend) + Hustle Server (Ollama, cron) | Free tier |
| Geocoding | Nominatim (OpenStreetMap) | Free |

**Data Sourcing Strategy (tiered):**

| Tier | Source | Method | Cost | Maintenance |
|------|--------|--------|------|-------------|
| Primary | Meetup groups | RSS feed polling | Free | Low |
| Primary | Org calendars | iCal/Google Calendar aggregation | Free | Low |
| Primary | Community | Web form / GitHub Issues | Free | Low |
| Secondary | Eventbrite | Web scraping | Free | Medium |
| Secondary | Luma | Web scraping | Free | Medium |
| Secondary | Newsletter | RSS/API + AI extraction | Free | Low |
| Avoid | Meetup API | GraphQL (requires $30+/mo Pro) | $30+/mo | — |
| Avoid | Luma API | REST (requires $59/mo Plus) | $59/mo | — |
| Avoid | PredictHQ | Enterprise aggregator | $500+/yr | — |

**AI Architecture:**

```
User Query ("tech meetups near me this week")
  → Vercel AI SDK streamText
    → Tool call: searchEvents({ query, location, dateRange })
    → pgvector similarity search (RAG)
    → Return matching events
  → AI formats natural language response with event cards

Background Processing (Ollama, local):
  → Newsletter HTML → structured event/company/people extraction
  → Scraped event data → categorization, deduplication
  → Event descriptions → vector embeddings for search
```

**Newsletter Ingestion Pipeline:**

```
Newsletter Source (RSS/API)
  → Raw HTML stored in Supabase
  → Ollama extracts events, companies, people (structured output via Zod)
  → Nominatim geocodes addresses
  → pgvector deduplicates against existing events
  → Events table (with embeddings) ready for search
```

**Pros:**
- Full AI integration across discovery, recommendations, and data processing
- Multi-source data pipeline prevents single-point-of-failure
- Supabase handles relational data AND vector search in one service
- Ollama on Hustle Server means zero AI cost for background processing
- MapLibre + OpenFreeMap = zero recurring map costs
- Community submission creates a flywheel effect
- Architecture supports future monetization without restructuring

**Cons:**
- Most complex option — multiple systems to integrate
- Ollama requires Hustle Server to be running reliably
- Scraper maintenance when source sites change HTML
- Initial setup effort is significant

**Effort:** High

---

### Option B: Lightweight Static Aggregator

**Description:** Astro or static Next.js site that aggregates events from RSS/iCal feeds into a simple map view. No AI, no conversational search, no background processing. Events displayed on MapLibre with basic filtering (date, category, location radius).

**Tech Stack:**

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Astro or Next.js (static export) | Free |
| Map | MapLibre + OpenFreeMap | Free |
| Data | JSON files generated by cron scripts | Free |
| Hosting | Vercel or Cloudflare Pages | Free |
| Search | Client-side filtering (Fuse.js) | Free |

**Pros:**
- Simplest possible architecture — can ship in days
- Zero recurring costs
- No server infrastructure needed
- Easy to maintain

**Cons:**
- No AI — users must browse/filter manually
- No conversational search (the core differentiator is gone)
- No newsletter content processing
- No smart recommendations
- Limited data sources (only RSS/iCal, no scraping pipeline)
- Difficult to differentiate from existing event listing sites
- Adding AI later requires significant rearchitecting

**Effort:** Low

---

### Option C: API-Dependent Platform

**Description:** Build primarily on top of Eventbrite, Meetup, and Luma's official APIs. Next.js frontend with MapLibre. Rely on these platforms as the source of truth.

**Pros:**
- Structured, well-documented data
- Real-time updates from source platforms
- Less data processing needed

**Cons:**
- **Eventbrite search API was deprecated in 2020** — cannot discover events, only fetch by known IDs
- **Meetup API requires $30+/month Pro subscription** with no guarantee of approval
- **Luma API requires $59/month Plus subscription** and only manages your own events
- Combined API costs: $89+/month minimum before you write a line of code
- Complete dependency on third-party platform decisions
- Any API deprecation or pricing change breaks the platform
- Does not cover events not listed on these platforms (university events, coworking space events, community gatherings)
- No newsletter integration path

**Effort:** Medium

---

## Decision

**We will:** Build the Full-Stack AI Platform (Option A), implemented in phases.

**Because:** The core value proposition of Moonshots & Magic is AI-powered discovery — taking scattered event data and making it conversationally searchable on a map. Option B strips out this differentiator, making it just another event listing site. Option C is both expensive ($89+/month in API fees alone) and fragile (Eventbrite already deprecated their search API; Meetup locked theirs behind a paywall). Option A costs less than Option C at scale while delivering significantly more capability.

The multi-source data strategy (RSS + iCal + scraping + community) is more resilient than depending on any single platform's API. Running Ollama locally on Hustle Server eliminates the largest variable cost (background AI processing). The Vercel AI SDK + Supabase pgvector combination is well-documented, has official templates, and fits the Next.js stack naturally.

**Phased Implementation:**

| Phase | Scope | Dependencies |
|-------|-------|--------------|
| **Phase 1: Map + Static Data** | Next.js + MapLibre + OpenFreeMap. Manual seed data. Basic event display with filtering. | None |
| **Phase 2: Data Pipeline** | RSS/iCal ingestion. Meetup RSS feeds for Central FL tech groups. Community submission form. Supabase database. | Phase 1 |
| **Phase 3: AI Layer** | Vercel AI SDK conversational search. Ollama background processing. pgvector RAG. Newsletter ingestion. | Phase 2 |
| **Phase 4: Recommendations + Scale** | User interest profiles. Smart recommendations. Additional scrapers. Protomaps migration if needed. | Phase 3 |

---

## Consequences

### What this enables:
- A genuinely differentiated product — no other Central FL tool combines map-first display, AI search, and multi-source event aggregation
- The newsletter collaboration becomes a structured data pipeline, not just cross-promotion
- Community submission creates a participation flywheel — organizers list events, attendees discover them, organizers see value and list more
- The pluggable source adapter architecture lets the community contribute new data sources via PRs
- Future monetization options remain open (sponsored listings, premium features, API access)

### What this limits or defers:
- Mobile app (web-first, responsive design serves mobile initially)
- Real-time event updates (polling-based, not webhook-driven)
- User accounts / personalization (deferred to Phase 4)
- Monetization implementation (intentionally deferred)

### What we'll need to watch:
- **Ollama reliability on Hustle Server** — if the server goes down, background processing stops. Need monitoring and alerts.
- **Scraper breakage** — Eventbrite and Luma HTML changes will break scrapers. Need to detect failures (empty results) and alert.
- **Event data freshness** — stale or cancelled events erode trust. Need a freshness policy (auto-hide events older than their end date, flag events not refreshed in 7+ days).
- **Supabase free tier limits** — 500MB database. At ~1KB per event, that's ~500K events before needing to upgrade. Should be sufficient for Central FL for years, but monitor.
- **GPT-4o-mini cost at scale** — at 500 DAU with 4 queries/user/day, ~$38/month. If usage spikes, consider caching common queries or switching to a cheaper model for simple lookups.

---

## Connection to Direction

**Mission alignment:** Moonshots & Magic enables human agency by surfacing context that is currently fragmented and inaccessible. People cannot attend events they don't know about. By aggregating scattered data and making it conversationally searchable, the platform removes friction between "I want to connect with my local tech community" and actually doing it.

**KPI impact:**
- Community engagement: Number of events discovered and attended through the platform
- Data coverage: Percentage of Central FL tech events captured vs. total known events
- AI utility: Percentage of user queries that return relevant results

**Phase transition:** This MFDR moves Moonshots & Magic from Concept to Feasibility. Completing Phase 1 (map + static data) would validate the core UX. Completing Phase 2 (data pipeline) would validate the sourcing strategy. Phase 3 (AI layer) validates the full differentiator.

---

## Key Technical Decisions (Detail)

### MapLibre Integration
- **Library:** react-maplibre (purpose-built for MapLibre, maintained by vis.gl team)
- **Tiles:** OpenFreeMap (no API key, no registration, handles 100K+ req/sec)
- **Clustering:** MapLibre built-in clustering initially, Supercluster if custom cluster rendering needed
- **SSR:** Dynamic import with `ssr: false` (MapLibre requires browser APIs)
- **Reference project:** [maplibre-nextjs-ts-starter](https://github.com/richard-unterberg/maplibre-nextjs-ts-starter)

### Event Data Schema (Common Format)
All source adapters normalize to this schema:

```typescript
interface Event {
  id: string;
  source: 'meetup_rss' | 'ical' | 'eventbrite_scrape' | 'luma_scrape' | 'community' | 'newsletter';
  name: string;
  description: string;
  startDate: string; // ISO 8601
  endDate?: string;
  venue?: string;
  address?: string;
  lat?: number;
  lng?: number;
  category: 'meetup' | 'conference' | 'workshop' | 'hackathon' | 'networking' | 'other';
  url?: string;
  price?: string;
  organizer?: string;
  embedding?: number[]; // pgvector
  lastRefreshed: string;
}
```

### Central Florida Seed Sources
Initial Meetup RSS feeds to configure:

| Group | Members | RSS URL |
|-------|---------|---------|
| Orlando Tech | 6,000+ | `meetup.com/orlando-tech/events/rss/` |
| Orlando Devs | 4,000+ | `meetup.com/orlando-devs/events/rss/` |
| Orlando Python | — | `meetup.com/orlando-python/events/rss/` |
| Orlando JS | — | `meetup.com/orlandojs/events/rss/` |
| GDG Central Florida | — | `meetup.com/gdg-central-florida/events/rss/` |

Additional sources: UCF events calendar, Full Sail events, StarterStudio, Canvs Orlando, Orlando Tech Association.

### Cost Projections

| Stage | Monthly Cost |
|-------|-------------|
| MVP (Phase 1-2) | $0 |
| AI Enabled (Phase 3, <100 DAU) | ~$10-15 |
| Growing (500 DAU) | ~$63 |
| Scaling (2,000 DAU) | ~$150 |

---

## Follow-up

- [ ] Create project repository (moonshots-magic or similar)
- [ ] Set up Next.js + MapLibre + OpenFreeMap proof of concept (Phase 1)
- [ ] Research and compile full list of Central Florida tech Meetup groups and their RSS URLs
- [ ] Identify iCal feeds from UCF, Full Sail, coworking spaces, and local orgs
- [ ] Confirm newsletter platform the writer uses (Substack, Beehiiv, Ghost, Buttondown) and test ingestion path
- [ ] Design the common event schema and Supabase table structure
- [ ] Test Ollama structured output for newsletter content extraction on Hustle Server
- [ ] Build first source adapter (Meetup RSS) as the reference implementation

---

## Research Sources

### Event Data Sourcing
- [Eventbrite API Reference](https://www.eventbrite.com/platform/api) — search API deprecated Feb 2020
- [Meetup GraphQL API](https://www.meetup.com/graphql/) — requires $30+/mo Pro
- [Meetup RSS feeds](https://openrss.org/blog/meetup-rss-feeds) — free, reliable alternative
- [Luma API](https://docs.luma.com/reference/getting-started-with-your-api) — requires $59/mo Plus
- [PredictHQ](https://www.predicthq.com/pricing) — $500+/yr, enterprise-focused
- [SeatGeek API](https://publicapi.dev/seat-geek-api) — free, ticketed entertainment focus
- [dev.events Florida](https://dev.events/NA/US/FL/tech) — community-curated tech events
- [Web scraping legality (2026)](https://www.datashake.com/blog/is-web-scraping-legal-what-you-need-to-know-in-2026)
- [confs.tech](https://confs.tech/api) — GitHub-based community event submissions

### Map Technology
- [react-maplibre](https://visgl.github.io/react-maplibre/) — purpose-built MapLibre React wrapper
- [OpenFreeMap](https://openfreemap.org/) — free tiles, no API key, survived 100K req/sec
- [Protomaps PMTiles](https://github.com/protomaps/PMTiles) — self-hosted tile archive format
- [MapLibre clustering](https://docs.stadiamaps.com/tutorials/clustering-styling-points-with-maplibre/)
- [maplibre-nextjs-ts-starter](https://github.com/richard-unterberg/maplibre-nextjs-ts-starter)

### AI Architecture
- [Vercel AI SDK v6](https://ai-sdk.dev/docs/introduction) — streamText, tool calling, structured output
- [Vercel AI SDK RAG template](https://vercel.com/templates/next.js/ai-sdk-rag) — Supabase pgvector + Drizzle
- [Supabase pgvector](https://supabase.com/modules/vector) — vector search in Postgres
- [pgvector vs Pinecone](https://supabase.com/blog/pgvector-vs-pinecone) — cost and performance comparison
- [Ollama structured outputs](https://ollama.com/blog/structured-outputs) — JSON schema enforcement
- [GPT-4o-mini pricing](https://skywork.ai/blog/claude-haiku-4-5-vs-gpt4o-mini-vs-gemini-flash-vs-mistral-small-vs-llama-comparison/)

### Newsletter Ingestion
- [Beehiiv API](https://developers.beehiiv.com/welcome/getting-started) — full content access, requires Scale plan
- [Ghost Content API](https://docs.ghost.org/content-api) — free self-hosted, excellent API
- [Substack](https://github.com/rohit1901/substack-feed-api) — no official API, RSS only for free posts
- [Buttondown API](https://docs.buttondown.com/api-introduction) — REST API, $9/mo for access

---

*Mirror Factory Decision Record • MFDR-011 • v1.0*
