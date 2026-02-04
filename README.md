# Moonshots & Magic — AI Map

A map-first, AI-powered discovery platform for Central Florida's tech community. Built by [Mirror Factory](https://github.com/mirror-factory).

Central Florida's tech scene is fragmented. Events live across Meetup, Eventbrite, Luma, university calendars, coworking spaces, and social media. There is no centralized, searchable place to find what's happening. Moonshots & Magic exists to change that — aggregating event data from multiple sources, processing newsletter content into structured data, and letting users ask things like "what tech meetups are near me this week?" through conversational AI search on an interactive map.

This project is actively evolving. Architecture decisions are documented in [MFDR-011](docs/MFDR-011-moonshots-magic-platform-architecture.md), a Mirror Factory Decision Record that captures the rationale, trade-offs, and phased implementation plan.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 19, Tailwind CSS, Radix UI |
| Map | MapLibre GL + OpenFreeMap |
| AI (user-facing) | Vercel AI SDK + AI Gateway |
| AI (background) | Ollama (local, on Hustle Server) |
| Database + Vector | Supabase (Postgres + pgvector) |
| Embeddings | Ollama nomic-embed-text |
| Geocoding | Nominatim (OpenStreetMap) |
| Hosting | Vercel |

## Development Approach

This project uses a **skills-based development workflow** through Claude Code. The `.claude/` directory contains structured skill references — compressed documentation indexes for AI SDK, Next.js best practices, React composition patterns, and more. These skills give the AI coding agent deep, retrieval-backed context instead of relying on stale training data.

Key conventions enforced in the codebase:

- **TSDoc enforcement** — Every exported function, type, and component requires a TSDoc comment. Enforced by `eslint-plugin-jsdoc` and blocked at commit time via `husky` + `lint-staged`.
- **Frequent small commits** — Pre-commit hooks catch documentation gaps early while context is fresh.
- **Auto-generated API docs** — TypeDoc generates documentation from TypeScript types and TSDoc comments into `docs/generated/`.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint (includes TSDoc checks) |
| `pnpm docs` | Generate TypeDoc API reference |
| `pnpm docs:watch` | Regenerate docs on file changes |
| `pnpm docs:serve` | Serve generated docs locally |

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the system overview, data flow, and directory conventions.

See [MFDR-011](docs/MFDR-011-moonshots-magic-platform-architecture.md) for the full platform architecture decision record — including data sourcing strategy, AI architecture, cost projections, and phased implementation plan. This document is evolving as the platform matures through each phase.

## Phased Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 1 | Map + static seed data, basic event display and filtering | In progress |
| Phase 2 | RSS/iCal ingestion, Supabase database, community submissions | Planned |
| Phase 3 | AI conversational search, Ollama background processing, newsletter ingestion | Planned |
| Phase 4 | User profiles, smart recommendations, additional scrapers | Planned |

## Why This Exists

Central Florida has a growing tech community with no centralized way to find and understand it. Events, companies, and people are scattered across dozens of platforms with no single view. Moonshots & Magic was made as a reflection of that gap — and an attempt to close it with the tools available today.

## License

This project is maintained by Mirror Factory.
