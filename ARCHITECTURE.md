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
│  │  │ mapNavigate* │ │ (* = client-side only)  │  │   │
│  │  └──────┬───────┘ └──────────┬──────────────┘  │   │
│  └─────────┼────────────────────┼─────────────────┘   │
│            ▼                    ▼                      │
│  ┌──────────────────────────────────────────┐         │
│  │          Registry Layer (in-memory)       │         │
│  │  events.ts ◄── events.json               │         │
│  │  newsletters.ts ◄── newsletters.json     │         │
│  └──────────────────────────────────────────┘         │
│                                                      │
│  REST endpoints:                                     │
│    GET /api/events       GET /api/newsletters         │
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
│   │   └── newsletters/route.ts   # GET  — Newsletter query REST API
│   ├── globals.css                # CSS variables, category colors, theme
│   ├── layout.tsx                 # Root layout with fonts
│   ├── map-with-chat.tsx          # Client shell: map + chat composition
│   └── page.tsx                   # Home page (RSC, loads events)
│
├── components/
│   ├── ai-elements/               # Vendored AI Elements UI primitives
│   ├── chat/
│   │   ├── chat-panel.tsx         # Main chat interface
│   │   ├── chat-trigger.tsx       # FAB to open chat
│   │   ├── event-card.tsx         # Single event display card
│   │   ├── event-list.tsx         # Vertical event list (optional ranking)
│   │   ├── map-action.tsx         # Client-side map tool executor
│   │   └── newsletter-card.tsx    # Newsletter search result card
│   ├── map/
│   │   ├── map-container.tsx      # MapLibre GL initialization + context
│   │   ├── map-controls.tsx       # Category filters + quick nav
│   │   ├── map-markers.tsx        # GeoJSON circle layer management
│   │   ├── map-popups.tsx         # Click-to-popup with "Ask about this"
│   │   ├── map-status-bar.tsx     # Viewport coordinate display
│   │   └── use-map.ts            # MapContext + useMap hook
│   └── ui/                        # shadcn/ui primitives
│
├── data/
│   ├── events.json                # Static event registry data
│   └── newsletters.json           # Static newsletter registry data
│
├── instrumentation.ts             # AI Gateway provider registration
│
└── lib/
    ├── agents/
    │   ├── event-agent.ts         # ToolLoopAgent configuration
    │   └── tools/
    │       ├── get-event-details.ts
    │       ├── map-navigate.ts     # Client-side only (no execute)
    │       ├── rank-events.ts
    │       ├── search-events.ts
    │       └── search-newsletters.ts
    ├── map/
    │   ├── config.ts              # Styles, defaults, colors, labels
    │   └── geojson.ts             # EventEntry → GeoJSON conversion
    └── registries/
        ├── events.ts              # Event query functions
        ├── newsletters.ts         # Newsletter query functions
        └── types.ts               # Shared type definitions
```

## Key Conventions

### CSS Variable System
All theme colors are defined as CSS custom properties in `globals.css`:
- `--brand-primary`, `--surface`, `--text`, `--border-color`, etc.
- `--category-{name}` variables for each event category color.

### MapLibre Color Sync
MapLibre GL cannot use CSS variables in expressions. The `CATEGORY_COLORS` map in `config.ts` contains literal hex values that **must** stay synchronized with the `--category-*` CSS variables. If you change a color in one place, update the other.

### Client-Side Tools
The `mapNavigate` tool has no `execute` function. It's a schema-only tool whose invocation is streamed to the client and rendered by the `MapAction` component. This pattern allows the LLM to control the map without server-side map access.

### Registry-First Data Access
All data queries go through the registry functions in `src/lib/registries/`. The JSON files are loaded once at import time and queried in-memory. There is no database; data is static.

## Component Architecture

### Map Layer
- **MapContainer** → provides `MapContext` (the MapLibre instance)
  - **MapMarkers** → manages the GeoJSON source and circle layer
  - **MapPopups** → click handler, popup rendering, "Ask about this" bridge
  - **MapControls** → category toggles, preset location navigation, legend
  - **MapStatusBar** → live viewport coordinates

### Chat Layer
- **ChatPanel** → `useChat` hook, message rendering, tool output routing
  - **EventCard** / **EventList** → display search and ranking results
  - **NewsletterCard** → display newsletter search results
  - **MapAction** → execute client-side map commands
  - **ChatTrigger** → FAB shown when chat is closed

### Bridge
`MapWithChat` manages the `chatInput` state that connects popup "Ask about this" clicks to the chat panel's input.

## Adding New Features

### New Event Category
1. Add the category string to `EVENT_CATEGORIES` in `src/lib/registries/types.ts`
2. Add hex color to `CATEGORY_COLORS` in `src/lib/map/config.ts`
3. Add matching `--category-{name}` CSS variable in `globals.css`
4. Add display label to `CATEGORY_LABELS` in `src/lib/map/config.ts`

### New Agent Tool
1. Create a new file in `src/lib/agents/tools/`
2. Define the tool with `tool()` from `ai` (include `inputSchema` and `execute`)
3. Register it in `eventAgent.tools` in `src/lib/agents/event-agent.ts`
4. If it returns structured output, add a rendering branch in `ChatPanel`

### New Map Layer
1. Create a new component in `src/components/map/`
2. Use `useMap()` to access the MapLibre instance
3. Add the layer in a `useEffect` keyed to `[map]`
4. Render the component inside `MapContainer`

## Generated Documentation

Run `pnpm docs` to generate TypeDoc API reference to `docs/generated/`.
The generated docs are git-ignored and should be rebuilt locally as needed.
