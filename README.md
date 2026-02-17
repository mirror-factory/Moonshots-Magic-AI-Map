# Moonshots & Magic — AI Map

> **A narrative-driven, AI-powered discovery platform telling the story of Central Florida through its events, landmarks, and cultural moments.**

Built by [Mirror Factory](https://github.com/mirror-factory) • [Live Demo](https://moonshots-magic-ai-map.vercel.app)

---

## 🌟 Overview

Central Florida is a region built on impossible ambitions — from sending humans to the Moon to building worlds of magic. **Moonshots & Magic** is an interactive map that celebrates this legacy while solving a real problem: the region's tech and cultural events are scattered across dozens of platforms with no centralized discovery tool.

This platform aggregates events from Ticketmaster, Eventbrite, SerpAPI, and custom scrapers, then presents them through:
- 🗺️ **Interactive map** with real-time filtering and clustering
- 🤖 **AI-powered chat** for conversational event search
- ✈️ **Cinematic flyover tours** with AI-generated narration
- 🎨 **Brand guide** showcasing the region's visual identity

---

## ✨ Features

### Hero Animations
- **Ken Burns zoom effects** on homepage hero images
- **Sequential lighting** — images light up one by one
- **Star-filled atmosphere** with CSS-optimized animations

### Interactive Map
- **1,791 curated events** across Central Florida
- **Real-time filtering** by category, date, and location
- **Smart clustering** for dense event areas
- **Directions & routing** with OpenRouteService

### AI Chat Agent
- **Event search** — "Find tech meetups near UCF this weekend"
- **Event ranking** — "What are the best space events in March?"
- **Map navigation** — "Show me theme parks in Orlando"
- **Flyover tours** — Cinematic camera animations with AI narration

### Data Layers *(Optional)*
- Traffic (TomTom)
- Air Quality (AirNow)
- EV Chargers (NREL)
- Transit routes
- City/county data

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **UI** | React 19, Tailwind CSS, shadcn/ui |
| **Map** | MapLibre GL + MapTiler |
| **Routing** | OpenRouteService |
| **AI Chat** | Vercel AI SDK v6 (ToolLoopAgent) |
| **Database** | Supabase (Postgres + pgvector) |
| **Voice/TTS** | Cartesia |
| **Hosting** | Vercel |
| **Testing** | Vitest (407 tests), Playwright (E2E) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/mirror-factory/Moonshots-Magic-AI-Map.git
cd Moonshots-Magic-AI-Map

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see Environment Variables below)

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

**Required:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Provider (choose one)
ANTHROPIC_API_KEY=your_anthropic_key
# OR
OPENAI_API_KEY=your_openai_key
```

**Optional (Enhanced Features):**
```bash
# Map & Routing
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key
NEXT_PUBLIC_ORS_API_KEY=your_ors_key

# Voice/TTS
NEXT_PUBLIC_CARTESIA_API_KEY=your_cartesia_key

# Data Layers
NEXT_PUBLIC_TOMTOM_API_KEY=your_tomtom_key
NEXT_PUBLIC_NREL_API_KEY=your_nrel_key
NEXT_PUBLIC_AIRNOW_API_KEY=your_airnow_key
```

See [.env.example](.env.example) for the complete list.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint (includes TSDoc checks) |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm docs` | Generate TypeDoc API reference |

---

## 🏗️ Architecture

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — System overview, data flow, directory conventions
- **[MFDR-011](docs/MFDR-011-moonshots-magic-platform-architecture.md)** — Platform architecture decision record

### Directory Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── map/            # Map-related components
│   ├── chat/           # AI chat interface
│   └── effects/        # Visual effects (stars, sparkles)
├── lib/                # Core libraries
│   ├── agents/         # AI agent tools
│   ├── map/            # Map utilities
│   └── registries/     # Event data registries
└── data/               # Static data (events, newsletters)
```

---

## 🧪 Development Approach

This project uses a **skills-based development workflow** through Claude Code. The `.claude/` directory contains structured skill references — compressed documentation indexes for AI SDK, Next.js best practices, React composition patterns, and more.

**Key conventions:**
- ✅ **TSDoc enforcement** — Every export requires documentation
- ✅ **Strict TypeScript** — No implicit `any`
- ✅ **Pre-commit hooks** — ESLint + related tests via `lint-staged`
- ✅ **Pre-push hooks** — TypeCheck + full test suite + coverage gates
- ✅ **407 unit tests** with ~87% coverage on included files

---

## 📊 Current Status

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Map + static event data, filtering, clustering | ✅ **Complete** |
| **Phase 2** | AI chat agent, event search, flyover tours | ✅ **Complete** |
| **Phase 3** | Data layers, traffic, air quality, transit | ✅ **Complete** |
| **Phase 4** | User profiles, preferences, recommendations | 🚧 **In Progress** |

**Latest:** 1,791 events • 407 passing tests • Hero animations • Brand guide

---

## 🎯 Why This Exists

Central Florida sent humans to the Moon and built worlds of magic. Today, it's a hub for aerospace, theme parks, simulation tech, and AI. But the region's events are fragmented across Meetup, Eventbrite, university calendars, and social media.

**Moonshots & Magic** centralizes this data and makes it discoverable through AI-powered conversational search — helping residents, visitors, and businesses understand what's happening in the region.

---

## 📝 License

This project is maintained by [Mirror Factory](https://github.com/mirror-factory).

---

**Questions?** Open an [issue](https://github.com/mirror-factory/Moonshots-Magic-AI-Map/issues) or reach out to the Mirror Factory team.
