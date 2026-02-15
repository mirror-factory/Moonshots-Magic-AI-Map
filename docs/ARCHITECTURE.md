# Architecture

**Moonshots & Magic** — An AI-powered event discovery app for Orlando & Central Florida, built with Next.js, MapLibre GL, and the Vercel AI SDK.

## System Overview

The application is a single-page map interface with a floating AI chat panel. Users discover events by browsing the interactive map or by conversing with an AI agent that can search events, recommend activities, and navigate the map.

```
┌──────────────────────────────────────────────────────┐
│                    Browser (Client)                   │
│                                                      │
│  ┌─────────────────────┐  ┌───────────────────────┐  │
│  │     MapContainer     │  │      ChatPanel        │  │
│  │  ┌───────────────┐   │  │  ┌─────────────────┐  │  │
│  │  │  MapMarkers    │   │  │  │  useChat hook   │  │  │
│  │  │  MapPopups     │   │  │  │  Tool cards     │  │  │
│  │  │  MapControls   │   │  │  │  MapAction      │  │  │
│  │  │  MapStatusBar  │   │  │  └────────┬────────┘  │  │
│  │  └───────────────┘   │  │           │            │  │
│  └──────────┬──────────┘  └───────────┼────────────┘  │
│             │  MapContext              │               │
│             └──────────────────────────┘               │
└────────────────────────┬─────────────────────────────┘
                         │ POST /api/chat
                         ▼
┌──────────────────────────────────────────────────────┐
│                   Server (Next.js)                    │
│                                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │               eventAgent (ToolLoopAgent)       │   │
│  │  ┌─────────────┐ ┌─────────────────────────┐  │   │
│  │  │ searchEvents │ │ getEventDetails         │  │   │
│  │  │ rankEvents   │ │ searchNewsletters       │  │   │
│  │  │ mapNavigate* │ │ getUserProfile*         │  │   │
│  │  │ startFlyover*│ │ updateUserProfile*      │  │   │
│  │  │              │ │ (* = client-side only)  │  │   │
│  │  └──────┬───────┘ └──────────┬──────────────┘  │   │
│  └─────────┼────────────────────┼─────────────────┘   │
│            ▼                    ▼                      │
│  ┌──────────────────────────────────────────┐         │
│  │    CompositeEventSource (adapter pattern) │         │
│  │  StaticAdapter ◄── events.json            │         │
│  │  EventbriteAdapter ◄── /api/eventbrite    │         │
│  │  newsletters.ts ◄── newsletters.json      │         │
│  └──────────────────────────────────────────┘         │
│                                                      │
│  REST endpoints:                                     │
│    GET /api/events       GET /api/newsletters         │
│    GET /api/events/live  (merged multi-source)        │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                  Supabase (PostgreSQL)                │
│                                                      │
│  Tables: profiles, events, user_interactions,        │
│          chat_sessions                                │
│  RLS:    All tables with row-level security           │
│  FTS:    Full-text search via tsvector triggers       │
└──────────────────────────────────────────────────────┘
```

## Data Flow

1. **Build time**: `page.tsx` (RSC) calls `getAllEvents()` and passes events to the client.
2. **Map rendering**: `MapContainer` initializes MapLibre GL. `MapMarkers` converts events to GeoJSON and adds a circle layer. `MapPopups` attaches click handlers.
3. **Chat flow**: User sends a message via `ChatPanel` → `POST /api/chat` → `eventAgent` runs tools → stream returned to client → tool outputs rendered as cards.
4. **Map ↔ Chat bridge**: Clicking "Ask about this" in a popup sets `chatInput` state in `MapWithChat`, which prefills and opens the chat. The `mapNavigate` tool (client-side) renders `MapAction`, which calls `map.flyTo()`.

## Directory Map

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # POST — AI chat streaming endpoint
│   │   ├── events/route.ts        # GET  — Event query REST API
│   │   ├── events/live/route.ts   # GET  — Merged multi-source events
│   │   └── newsletters/route.ts   # GET  — Newsletter query REST API
│   ├── docs/ai/                   # AI capabilities documentation
│   │   ├── layout.tsx             # Docs layout with sidebar
│   │   ├── page.tsx               # Docs index page
│   │   └── [slug]/page.tsx        # Dynamic capability detail pages
│   ├── roadmap/page.tsx           # Project roadmap page
│   ├── globals.css                # CSS variables, light/dark theme
│   ├── layout.tsx                 # Root layout with forced dark ThemeProvider
│   ├── map-with-chat.tsx          # Client shell: map + chat + event detail bridge
│   └── page.tsx                   # Home page (RSC, loads events)
│
├── components/
│   ├── ai-elements/               # Vendored AI Elements UI primitives (9 components)
│   ├── calendar/
│   │   └── add-to-calendar-button.tsx  # "Add to Calendar" (Google, Apple, ICS)
│   ├── chat/
│   │   ├── center-chat.tsx        # Center-stage chat panel (context-aware)
│   │   ├── chat-panel.tsx         # Main chat interface
│   │   ├── chat-trigger.tsx       # FAB to open chat
│   │   ├── ditto-avatar.tsx       # Ditto avatar with 5 expression states
│   │   ├── ditto-personality.ts   # Contextual greetings and subtitles
│   │   ├── suggestion-tiles.tsx   # Context-aware 2x3 suggestion grid
│   │   ├── event-card.tsx         # Single event display card
│   │   ├── event-list.tsx         # Vertical event list (optional ranking)
│   │   ├── map-action.tsx         # Client-side map tool executor
│   │   ├── newsletter-card.tsx    # Newsletter search result card
│   │   └── voice-input-button.tsx # Voice input toggle for chat
│   ├── effects/                   # Dark mode visual effects (brand aesthetic)
│   │   ├── ambient-particles.tsx  # Floating particles over map (dark mode)
│   │   ├── blurred-stars.tsx      # Animated blurred stars (intro modal)
│   │   ├── sparkle.tsx            # Animated sparkle effect (thinking indicator)
│   │   └── static-stars.tsx       # Star field overlay
│   ├── intro/
│   │   └── intro-modal.tsx        # First-visit intro modal
│   ├── map/
│   │   ├── directions-panel.tsx   # Turn-by-turn directions panel
│   │   ├── event-detail.tsx       # Event detail panel (sidebar)
│   │   ├── event-list-item.tsx    # Event row in sidebar list
│   │   ├── event-sidebar.tsx      # Collapsible event sidebar
│   │   ├── events-dropdown.tsx    # Logo-triggered dropdown with event list
│   │   ├── flyover-overlay.tsx    # Flyover tour HUD overlay
│   │   ├── map-container.tsx      # MapLibre GL + 3D terrain/buildings
│   │   ├── map-controls.tsx       # Logo dropdown + slide-out sidebar
│   │   ├── map-directions.tsx     # Route line rendering layer
│   │   ├── map-hotspots.tsx       # Heatmap layer from event coordinates
│   │   ├── map-isochrone.tsx      # Travel time zone rendering layer
│   │   ├── map-markers.tsx        # GeoJSON neon orb circle layer + clustering
│   │   ├── map-popups.tsx         # Canvas card hover/click + persistent selection
│   │   ├── map-search-bar.tsx     # Geocoding search with autocomplete (MapTiler)
│   │   ├── map-status-bar.tsx     # Filter chips, toolbar, coordinates
│   │   ├── map-style-switcher.tsx # Style toggle (Streets/Satellite/Outdoor/Dark)
│   │   ├── map-weather.tsx        # Weather radar overlay toggle (MapTiler)
│   │   └── use-map.ts             # MapContext + useMap hook
│   ├── settings/
│   │   ├── model-selector.tsx     # AI model picker dropdown
│   │   └── settings-modal.tsx     # User settings dialog
│   ├── onboarding/
│   │   ├── onboarding-flow.tsx    # 5-card conversational onboarding
│   │   └── vibe-tile-large.tsx    # Large category selection tiles
│   ├── presentation/
│   │   └── presentation-panel.tsx # Cinematic presentation mode overlay
│   └── ui/                        # shadcn/ui primitives
│
├── data/
│   ├── changelog.json             # Version history (feat/fix/chore items)
│   ├── events.json                # Static event registry data (50 events)
│   ├── newsletters.json           # Static newsletter registry data
│   ├── presentation-landmarks.ts  # Landmark data for presentation mode
│   └── roadmap.json               # Project roadmap items
│
├── instrumentation.ts             # AI Gateway provider registration
│
└── lib/
    ├── agents/
    │   ├── event-agent.ts         # ToolLoopAgent configuration (8 tools, context-aware)
    │   └── tools/
    │       ├── get-directions-tool.ts # Client-side (no execute)
    │       ├── get-event-details.ts
    │       ├── get-user-profile.ts    # Client-side (no execute)
    │       ├── highlight-events.ts    # Client-side (no execute)
    │       ├── map-navigate.ts        # Client-side (no execute)
    │       ├── rank-events.ts
    │       ├── search-events.ts
    │       ├── search-newsletters.ts
    │       ├── start-flyover.ts       # Client-side (no execute)
    │       ├── start-presentation.ts  # Client-side (no execute)
    │       └── update-user-profile.ts # Client-side (no execute)
    ├── calendar/
    │   ├── calendar-links.ts      # Google/Apple/Outlook calendar URL builders
    │   └── ics-generator.ts       # ICS file generation
    ├── docs/
    │   └── ai-capabilities.ts     # Docs registry utility
    ├── flyover/
    │   ├── camera-animator.ts     # MapLibre camera animation curves
    │   ├── flyover-audio.ts       # Ambient audio during flyover
    │   └── flyover-engine.ts      # Flyover state machine (idle→preparing→flying→paused→complete)
    ├── audio/
    │   └── background-music.ts    # Ambient background music (flyover + showcase)
    ├── map/
    │   ├── camera-utils.ts        # Unified camera navigation (flyToPoint, fitBoundsToPoints)
    │   ├── config.ts              # Styles, 3D terrain, colors, labels, style variants
    │   ├── event-filters.ts       # Date preset filters (today, weekend, week, month)
    │   ├── geocoding.ts           # MapTiler Geocoding API client
    │   ├── geojson.ts             # EventEntry → GeoJSON conversion
    │   ├── isochrone.ts           # Travel time isochrone API client
    │   ├── routing.ts             # Directions API (OpenRouteService)
    │   ├── three-layer.ts         # Three.js 3D marker layer
    │   ├── venue-highlight.ts     # Shared canvas card + golden pulse system
    │   └── weather.ts             # MapTiler Weather API client
    ├── profile.ts                 # User profile types and helpers
    ├── profile-storage.ts         # localStorage profile persistence
    ├── context/
    │   └── ambient-context.ts     # Time/weather/location context engine
    ├── registries/
    │   ├── event-source-adapter.ts # Multi-source adapter pattern
    │   ├── events.ts              # Event query functions
    │   ├── newsletters.ts         # Newsletter query functions
    │   └── types.ts               # Shared type definitions
    ├── settings.ts                # User settings (model selection, defaults)
    ├── supabase/
    │   ├── client.ts              # Browser Supabase client (SSR)
    │   ├── middleware.ts           # Auth session refresh middleware
    │   ├── server.ts              # Server Supabase client (SSR)
    │   └── types.ts               # Generated database types
    ├── utils.ts                   # Shared utility functions (cn, etc.)
    └── voice/
        ├── cartesia-tts.ts        # Text-to-speech via Cartesia API
        └── speech-to-text.ts      # Browser speech recognition

tests/
├── setup.ts                       # Test setup (mocks for motion, shadcn, useMap)
├── fixtures/
│   ├── events.ts                  # createTestEvent() factory
│   ├── newsletters.ts            # createTestNewsletter() factory
│   └── profiles.ts               # createTestProfile() factory
├── unit/
│   ├── agents/                    # Tool + agent unit tests (7 files)
│   ├── calendar/                  # Calendar link + ICS tests (2 files)
│   ├── context/                   # Ambient context tests (1 file)
│   ├── flyover/                   # Flyover engine tests (1 file)
│   ├── map/                       # Config + GeoJSON tests (2 files)
│   ├── profile/                   # Profile + storage tests (2 files)
│   ├── registries/                # Event + newsletter query tests (2 files)
│   ├── settings/                  # Settings tests (1 file)
│   └── supabase/                  # Supabase types + client + adapter tests (3 files)
├── component/
│   ├── chat/                      # EventCard, MapAction, ChatTrigger tests (3 files)
│   └── effects/                   # Sparkle test (1 file)
└── integration/
    └── api/                       # Route handler tests (3 files)

e2e/                               # Playwright end-to-end tests
├── app-load.spec.ts
├── chat-flow.spec.ts
├── event-search.spec.ts
├── map-navigate.spec.ts
└── theme-toggle.spec.ts

docs/
├── ai-capabilities/               # AI tool documentation (markdown)
├── FEATURES.md                    # Complete feature registry (35 features)
├── MAP-ARCHITECTURE.md            # Map system deep-dive
├── PLAN.md                        # Project roadmap and planning
└── TEAM-INFRASTRUCTURE.md         # Hooks, skills, Storybook, CI setup

scripts/
├── check-stories.sh               # Story coverage check (warning, not blocker)
├── download-presentation-images.ts # Download images for presentation mode
├── generate-presentation-audio.ts  # Generate TTS audio for presentations
└── sync-events/                    # Multi-source event sync pipeline
    ├── index.ts                    # Sync orchestrator
    ├── fetchers/                   # Source fetchers (Ticketmaster, Eventbrite, etc.)
    ├── normalizers/                # Data normalizers
    └── utils/                      # Category mapper, dedup, rate limiter

.storybook/
├── main.ts                        # Stories glob, react-vite framework, addons
└── preview.ts                     # Global CSS, theme decorator, toolbar switcher

.husky/
├── commit-msg                     # Conventional commit message enforcement
├── pre-commit                     # ESLint + related tests on staged files
├── pre-push                       # Typecheck + coverage + docs build
└── post-merge                     # Auto-install deps on lock file change

.github/
└── workflows/
    ├── docs.yml                   # CI for doc generation on push to main
    └── test.yml                   # CI for unit tests + E2E tests
```

## Key Conventions

### CSS Variable System
All theme colors are defined as CSS custom properties in `globals.css`:
- `--brand-primary`, `--surface`, `--text`, `--border-color`, etc.
- `--category-{name}` variables for each event category color.

### MapLibre Color Sync
MapLibre GL cannot use CSS variables in expressions. The `CATEGORY_COLORS` map in `config.ts` contains literal hex values that **must** stay synchronized with the `--category-*` CSS variables. If you change a color in one place, update the other.

### Client-Side Tools
Seven tools have no `execute` function — they are schema-only, streamed to the client:
- `mapNavigate` → rendered by `MapAction` (map flyTo/highlight/fitBounds)
- `getUserProfile` → reads user preferences from localStorage
- `updateUserProfile` → saves user preferences to localStorage
- `startFlyover` → launches a flyover tour via the flyover engine
- `getDirections` → triggers route line display between two points
- `highlightEvents` → highlights specific events on the map by ID
- `startPresentation` → launches a cinematic presentation mode

This pattern allows the LLM to control browser-side features without server access.

### Registry-First Data Access
All data queries go through the registry functions in `src/lib/registries/`. The JSON files are loaded once at import time and queried in-memory. Live data is merged via the adapter pattern in `event-source-adapter.ts`.

### Supabase Database
PostgreSQL via Supabase with 4 tables: `profiles`, `events`, `user_interactions`, `chat_sessions`. All tables have Row-Level Security (RLS) enabled. The `events` table has full-text search via a tsvector trigger. Database types are auto-generated in `src/lib/supabase/types.ts`. Client utilities use `@supabase/ssr` for cookie-based auth in both browser and server contexts.

### Ambient Context
The `AmbientContext` engine (`src/lib/context/ambient-context.ts`) gathers time, weather (Open-Meteo API), and geolocation at runtime. It caches results in localStorage with a 30-min TTL. Context flows to: onboarding (category ordering), suggestion tiles (priority), Ditto greetings, and the AI agent system prompt (delight triggers).

## Component Architecture

### Map Layer
- **MapContainer** → provides `MapContext` (the MapLibre instance), 3D terrain/buildings
  - **MapMarkers** → GeoJSON source + neon orb circle layer + Supercluster clustering
  - **MapPopups** → canvas card hover/click with persistent selection + golden pulse orbit
  - **MapControls** → logo dropdown + search bar + slide-out sidebar
  - **MapSearchBar** → MapTiler Geocoding autocomplete with debounced input
  - **MapStatusBar** → filter chips (Today/Weekend/Week), toolbar, coordinates
  - **MapStyleSwitcher** → Streets/Satellite/Outdoor/Dark style toggle
  - **MapWeather** → MapTiler precipitation radar overlay toggle
  - **MapDirections** → animated route line rendering from OpenRouteService
  - **MapIsochrone** → travel time zone polygon rendering
  - **MapHotspots** → heatmap layer from event coordinates

### Chat Layer
- **CenterChat** → center-stage chat panel with context-aware suggestions
  - **EventCard** / **EventList** → carousel display with blurred image backgrounds
  - **NewsletterCard** → newsletter search result card
  - **MapAction** → execute client-side map commands
  - **SuggestionTiles** → 2×3 context-aware suggestion grid

### Bridge
`MapWithChat` manages `chatInput` (popup → chat prefill), `highlightedEventIds` (AI → map filter), and `openDetailHandler` (chat "Learn More" → events dropdown detail view).

## Adding New Features

### New Event Category
1. Add the category string to `EVENT_CATEGORIES` in `src/lib/registries/types.ts`
2. Add hex color to `CATEGORY_COLORS` in `src/lib/map/config.ts`
3. Add matching `--category-{name}` CSS variable in `globals.css`
4. Add display label to `CATEGORY_LABELS` in `src/lib/map/config.ts`

### New Agent Tool
1. Create a new file in `src/lib/agents/tools/`
2. Define the tool with `tool()` from `ai` (include `inputSchema` and `execute` for server tools; schema only for client tools)
3. Register it in `eventAgent.tools` in `src/lib/agents/event-agent.ts`
4. If it returns structured output, add a rendering branch in `ChatPanel`
5. Write tests in `tests/unit/agents/tools/`
6. Read `.claude/skills/ai-team/SKILL.md` for the full recipe

### New Map Layer
1. Create a new component in `src/components/map/`
2. Use `useMap()` to access the MapLibre instance
3. Add the layer in a `useEffect` keyed to `[map]`
4. Render the component inside `MapContainer`

### New Component (any)
1. Create the component in the appropriate `src/components/` directory
2. Add TSDoc comments on all exports
3. Write a `.stories.tsx` file next to it with all prop variants
4. Write tests in `tests/component/`
5. The pre-push hook enforces typecheck, coverage, and docs build

## Generated Documentation

Run `pnpm docs` to generate TypeDoc API reference to `docs/generated/`.
The generated docs are git-ignored and should be rebuilt locally as needed.

## Feature Registry

See **[docs/FEATURES.md](docs/FEATURES.md)** for a complete registry of all 35 features including:
- Map & Navigation (8 features)
- Chat & AI (10 features)
- User Experience (6 features)
- Voice & Audio (3 features)
- Personalization (4 features)
- Visual Effects (4 features)

## Current Issues

- **Auth not wired**: Supabase schema and RLS are in place but auth flows are not yet connected to the UI
- **Color duplication**: Category colors are duplicated in CSS variables (`globals.css`) and JavaScript (`config.ts`) — MapLibre requires hex literals
- ~~No marker clustering~~ ✅ (Implemented — MapLibre native clustering via GeoJSON source)
- **Story coverage**: 6/24 components have Storybook stories (run `pnpm check-stories` for details)

## Completed Milestones

1. ~~Theme system (forced dark mode)~~ ✅
2. ~~3D map with terrain and buildings~~ ✅
3. ~~AI capabilities documentation page at `/docs/ai`~~ ✅
4. ~~GitHub Action for automated doc generation~~ ✅
5. ~~Test suite (406 tests, Vitest + Playwright)~~ ✅
6. ~~Storybook foundation (6 stories, 18 variants)~~ ✅
7. ~~Git hooks (commitlint, pre-push typecheck + coverage + docs)~~ ✅
8. ~~Claude skills (ai-team, feature-testing, commit-docs)~~ ✅
9. ~~Voice input (speech-to-text + Cartesia TTS)~~ ✅
10. ~~Flyover tours (camera animation state machine)~~ ✅
11. ~~User personalization (profile storage + preferences)~~ ✅
12. ~~Conversational onboarding (5-card flow with context-aware ordering)~~ ✅
13. ~~Ambient context engine (time/weather/location for personalization)~~ ✅
14. ~~Ditto personality system (greetings, state machine, expression states)~~ ✅
15. ~~Map hotspots heatmap layer~~ ✅
16. ~~Live data adapter pattern (static + Eventbrite multi-source)~~ ✅
17. ~~Supabase database (4 tables, RLS, full-text search)~~ ✅
18. ~~Canvas card popups (hover + click with persistent selection + golden pulse)~~ ✅
19. ~~Venue highlight system (shared module for flyover + popups)~~ ✅
20. ~~Directions + isochrone layers (OpenRouteService integration)~~ ✅
21. ~~Date filter chips (Today / Weekend / This Week)~~ ✅
22. ~~Events dropdown with detail view + sidebar~~ ✅
23. ~~Chat event card redesign (blurred image backgrounds, "Learn More" → detail)~~ ✅
24. ~~Unified camera navigation system (`camera-utils.ts`)~~ ✅
25. ~~Chat + presentation coexistence (no more mutual exclusion)~~ ✅
26. ~~Background audio for flyover + showcase~~ ✅
27. ~~Smart marker clustering (MapLibre native)~~ ✅
28. ~~Geocoding search bar with autocomplete (MapTiler)~~ ✅
29. ~~Map style switcher (Streets/Satellite/Outdoor/Dark)~~ ✅
30. ~~Live weather radar overlay (MapTiler)~~ ✅
31. ~~Animated route drawing (progressive reveal)~~ ✅
32. ~~Dynamic hillshading (time-of-day illumination)~~ ✅
33. ~~Events dropdown outside-click prevention~~ ✅
34. ~~Directions chat loading state + turn-by-turn steps~~ ✅
35. ~~Google Maps / Apple Maps deep links from directions~~ ✅
36. ~~Cinematic route orbit animation (60° over 20s)~~ ✅
37. ~~MapTiler Streets v2 tile upgrade (rich POI labels)~~ ✅
38. ~~fitBounds implementation for map-action tool~~ ✅

## Quality Infrastructure

See **[docs/TEAM-INFRASTRUCTURE.md](docs/TEAM-INFRASTRUCTURE.md)** for full details.

| Gate | Hook | What it enforces |
|------|------|-----------------|
| TSDoc on exports | pre-commit | ESLint `jsdoc/require-jsdoc` |
| Conventional commits | commit-msg | commitlint |
| TypeScript correctness | pre-push | `tsc --noEmit` (source + tests) |
| Test coverage ≥60% | pre-push | `vitest --coverage` |
| TypeDoc builds | pre-push | `pnpm docs` |
| Dependency sync | post-merge | Auto `pnpm install` on lock change |

## Map Tile Provider

The app uses **MapTiler Streets v2** for rich POI labels, building names, and restaurant names. Falls back to CartoDB Positron/Dark Matter when no MapTiler API key is configured.

| Theme | Provider | Style |
|-------|----------|-------|
| Light | MapTiler Streets v2 | `streets-v2/style.json` |
| Dark | MapTiler Streets v2 Dark | `streets-v2-dark/style.json` |
| Fallback Light | CartoDB Positron GL | `positron-gl-style/style.json` |
| Fallback Dark | CartoDB Dark Matter GL | `dark-matter-gl-style/style.json` |

Both providers use the **OpenMapTiles schema**, so `source-layer: "building"`, `render_height`, and all custom layers continue to work regardless of which provider is active.

**Environment variable**: `NEXT_PUBLIC_MAPTILER_KEY` — also used for 3D terrain DEM tiles.

## Directions System

Full routing flow from chat to map:

```
User asks for directions
  → AI calls getDirectionsTool (client-side, no execute)
  → Chat shows loading indicator ("Locating you and finding route...")
  → MapAction resolves tool on client
  → Browser geolocation API provides origin
  → OpenRouteService Directions API (POST) returns route
  → MapDirections renders route line + markers
  → DirectionsPanel shows ETA, distance, travel mode selector
  → Cinematic 60° orbit starts after fitBounds
```

### Turn-by-Turn Steps

The ORS API returns `segments[].steps[]` with `instruction`, `distance`, and `duration`. The `DirectionsPanel` renders these as a collapsible list with directional icons (turn left/right, bear left/right, straight, arrive).

### External Map Deep Links

The panel provides "Open in Google Maps" and "Open in Apple Maps" buttons:
- Google Maps: `https://www.google.com/maps/dir/?api=1&origin={lat},{lng}&destination={lat},{lng}&travelmode={mode}`
- Apple Maps: `https://maps.apple.com/?saddr={lat},{lng}&daddr={lat},{lng}&dirflg={flag}`
- Platform detection: Apple Maps shown first on iOS/macOS, Google Maps first elsewhere

### Route Orbit Animation

After `fitBounds()` completes (~1.2s), the camera slowly rotates 60° over 20 seconds using an ease-out cubic curve. The orbit stops immediately on any user interaction (mousedown, touchstart, wheel).

## Chat UI Patterns

### Tool Loading States

Each AI tool has a chat feedback pattern:
- **`input-streaming` / `input-available`**: Show a loading spinner with contextual text
- **`output-available`**: Show the result summary
- Tools without visible output return `null`

### Event Carousel

Event search results render as horizontally scrollable `EventList` cards inside chat messages. Each card shows event image (blurred background), title, date, venue, and category badge.

**Planned**: Sticky carousel — when scrolling past event carousels in chat, a compact version sticks to the top of the chat area with `backdrop-blur-md`.

### Directions Feedback

The `getDirectionsTool` shows two states:
1. **Loading**: Spinner + "Locating you and finding route..."
2. **Complete**: Navigation icon + "Getting directions to {destination}..."

## Events Dropdown

The logo-anchored `Popover` (Radix UI) is configured to:
- **Stay open on outside clicks** — `onInteractOutside` and `onPointerDownOutside` prevent dismiss when clicking the map
- **Close only via X button** — explicit close handler resets all filters and selection
- **Virtualized list** — renders only visible rows (76px height, 5-row overscan) for smooth scrolling with 200+ events
- **Multi-layer filters** — category, source, venue, and custom date range, all composable

## Flyover & Showcase Navigation System

The flyover engine and Orlando showcase both fly the camera to event/landmark coordinates. However, they currently use **separate navigation paths** instead of a unified system:

### Navigation Paths (unified via camera-utils)

| System | Coordinate Source | Navigation Call | File |
|--------|------------------|----------------|------|
| Flyover | `event.coordinates` → `FlyoverWaypoint.center` | `animateToWaypoint()` | `flyover-engine.ts` |
| Presentation (Orlando Showcase) | Hardcoded `coordinates` in landmarks | `flyToPoint()` | `presentation-panel.tsx` |
| Chat mapNavigate | LLM-provided coordinates | `flyToPoint()` / `fitBoundsToPoints()` | `map-action.tsx` |
| Chat startFlyover | Event IDs → lookup → `event.coordinates` | `animateToWaypoint()` | `map-container.tsx` |
| Show on map | `event.coordinates` | `flyToPoint()` | `map-container.tsx` |
| Highlighted events | AI-returned event IDs | `fitBoundsToPoints()` | `map-container.tsx` |

All navigation now flows through `src/lib/map/camera-utils.ts` which provides:
- `flyToPoint()` — single entry point for all flyTo operations with timeout fallback
- `fitBoundsToPoints()` — fits bounds to multiple coordinates, falls back to flyTo for single point
- `isValidCoordinates()` — validates [lng, lat] pairs before navigation
- `calculateCenter()` — centroid calculation for coordinate arrays

### Bug Fixes (completed)

1. ~~Events don't fly to correct coordinates~~ ✅ — Unified via `camera-utils.ts` with coordinate validation
2. ~~Orlando showcase doesn't move to starting destination~~ ✅ — Now uses `flyToPoint()` with proper Promise resolution
3. ~~Chat disappears during showcase~~ ✅ — `AnimatePresence mode="wait"` removed; chat always renders alongside presentation
4. **Silent failure on missing event IDs** — Still open. `events.find((e) => e.id === id)` returns undefined for stale IDs.
5. ~~fitBounds unimplemented~~ ✅ — Fully implemented in `camera-utils.ts` with bounds calculation

### Background Audio (implemented)

| Context | Audio File | Behavior |
|---------|-----------|----------|
| General flyover tours | `public/audio/liosound_Lofi_loop-01.mp3` | Fade-in on flyover start, fade-out on stop/complete |
| Orlando showcase | `public/audio/Real Estate 03.mp3` | Fade-in on showcase start, fade-out on exit |
| Waypoint narration | Cartesia TTS (dynamic) | Per-waypoint narration overlaid on background audio |

Audio managed by `src/lib/audio/background-music.ts` — singleton controller with 1.5s fade transitions, loop support, and mode-specific default volumes (flyover: 15%, showcase: 20%).

## Additional MapLibre Capabilities

### Implemented

| Capability | Status | Description | File |
|-----------|--------|-------------|------|
| Marker clustering | ✅ | MapLibre native clustering via GeoJSON source (clusterMaxZoom: 13, radius: 50) | `map-markers.tsx` |
| Geocoding search bar | ✅ | MapTiler Geocoding API with autocomplete, proximity bias, debounced input | `map-search-bar.tsx`, `geocoding.ts` |
| Style switcher | ✅ | Streets / Satellite / Outdoor / Dark toggle with camera preservation | `map-style-switcher.tsx` |
| Weather overlay | ✅ | MapTiler precipitation radar as semi-transparent raster tiles | `map-weather.tsx`, `weather.ts` |
| Animated route drawing | ✅ | Progressive coordinate reveal over 2s with ease-out deceleration | `map-directions.tsx` |
| Dynamic hillshading | ✅ | Time-of-day illumination direction (east→west, 6am–6pm) | `config.ts` |
| Unified camera navigation | ✅ | Single `flyToPoint()` / `fitBoundsToPoints()` used by all systems | `camera-utils.ts` |
| Background audio | ✅ | Lofi for flyovers, ambient for showcase with fade transitions | `background-music.ts` |

### Planned

| Capability | Difficulty | Description |
|-----------|-----------|-------------|
| Street-level navigation | Hard | Mapillary integration for street imagery |
| Indoor maps | Hard | Venue floor plans for convention centers, malls |
| Transit directions | Medium | ORS public-transport profile (bus/rail routes) |
| Measure distance tool | Easy | Click two points to measure distance (Turf.js) |
| Draw/annotate on map | Medium | MapLibre Draw plugin for user annotations |
| Export/print map | Easy | `map.getCanvas().toDataURL()` for screenshots |
| Route alternatives | Medium | ORS `alternative_routes` parameter — show 2-3 route options |
| Waypoints/multi-stop routing | Medium | Allow adding intermediate stops to directions |
| Live traffic layer | Hard | Requires traffic data provider (TomTom/HERE) |
| Geofencing alerts | Medium | Notify when user enters/exits event area (Turf.js `booleanPointInPolygon`) |
| Time-based animation | Medium | Animate event markers by date (show events appearing/disappearing over time) |
| Nearby discovery radius | Easy | Draw circle around user location showing events within X miles |
| Elevation profile | Medium | Show elevation chart along a route (ORS elevation API) |
| Offline map support | Hard | MapLibre offline tile caching (service worker) |
| AR view | Hard | WebXR integration for placing events in camera view |
| Globe zoom intro | Medium | MapTiler globe projection for cinematic entry zoom |
| 3D venue models | Hard | GLTF/GLB models placed at venue coordinates via Three.js layer |
| Timeline scrubber | Medium | Slider to filter events by date with animated marker visibility |

## Opportunities for Improvement

### Performance
- ~~Marker clustering~~ ✅ — Implemented via MapLibre native clustering
- **Suspense boundaries**: Add React Suspense around map components for better loading states
- **ISR for events**: Move from static JSON to database with ISR (Incremental Static Regeneration)

### Features
- **Event favoriting**: Allow users to save favorite events (localStorage or Supabase)
- **URL sharing**: Deep links to specific events or map views (e.g., `/event/:id`, `/?view=downtown`)

### Developer Experience
- **Story coverage**: Expand from 6/24 to full component coverage (run `pnpm check-stories`)
- **Component docs**: Auto-generate component documentation from TSDoc

### Architecture
- **Custom hooks**: Extract map logic into `useMapControls`, `useMapMarkers`, `useMapTerrain`
- **State management**: Consider Zustand for cross-component state (selected event, filters)
- **OpenTelemetry**: Add tracing for AI agent tool calls and map interactions
