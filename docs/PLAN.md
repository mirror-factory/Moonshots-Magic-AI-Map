# Moonshots & Magic - Complete Architecture Plan

## Table of Contents
1. [Overview](#overview)
2. [Skill References](#skills)
3. [Project Structure](#structure)
4. [Dynamic Theming System](#theming)
5. [Central JSON Registries](#registries)
6. [Map Component Architecture](#map)
7. [AI Chat Architecture](#chat)
8. [Agentic Architecture](#agents)
9. [Data Pipeline](#data)
10. [Dependencies](#deps)
11. [Implementation Phases](#phases)
12. [Key Files](#files)
13. [Verification Plan](#verify)

---

<a id="overview"></a>
## 1. Overview

Transform the existing Next.js 16 boilerplate + MapLibre HTML prototype into **Moonshots & Magic** -- a full-stack events discovery platform for Orlando & Central Florida with:

- **Interactive Map** (MapLibre GL) showing events from a central JSON registry
- **AI Chat** (AI Elements + AI SDK) with agentic workflows for event discovery
- **Newsletter Registry** for news/content with AI-searchable interface
- **Dynamic Theming** via CSS custom properties in `globals.css` for future rebranding
- **Single Source of Truth** -- all data flows from JSON registries, not scattered files

### Design Principles
- All UI components from **shadcn/ui + AI Elements** (no custom component libraries)
- All branding/colors/typography controlled via **CSS custom properties in globals.css**
- All event/newsletter data lives in **JSON registries** (`data/events.json`, `data/newsletters.json`)
- AI chat uses **ToolLoopAgent** with tools that read from registries
- **React Server Components** by default; `'use client'` only where needed (map, chat)
- **Functional programming** patterns throughout

---

<a id="skills"></a>
## 2. Skill References

These skills MUST be consulted before writing code in their respective areas:

| Skill | Path | Use When |
|-------|------|----------|
| **ai-elements** | `.claude/skills/ai-elements/SKILL.md` | Building ANY chat UI component |
| **ai-sdk** | `.claude/skills/ai-sdk/SKILL.md` | Any AI SDK function (agents, tools, streaming, useChat) |
| **next-best-practices** | `.claude/skills/next-best-practices/SKILL.md` | File conventions, RSC boundaries, data patterns, async APIs |
| **next-cache-components** | `.claude/skills/next-cache-components/SKILL.md` | PPR, caching, `use cache` directive |
| **vercel-react-best-practices** | `.claude/skills/vercel-react-best-practices/SKILL.md` | React component performance, data fetching, bundle optimization |
| **vercel-composition-patterns** | `.claude/skills/vercel-composition-patterns/SKILL.md` | Component composition, compound components, context providers |
| **web-design-guidelines** | `.claude/skills/web-design-guidelines/SKILL.md` | UI review, accessibility, design audit |

### Documentation References
- **AI SDK Docs**: `docs/ai-sdk/` (agents, core, UI, RSC, reference)
- **AI Gateway Docs**: `docs/ai-gateway/` (providers, models, fallbacks)
- **AI Elements Docs**: `docs/ai-elements/` (components, examples, usage)

---

<a id="structure"></a>
## 3. Project Structure

```
src/
  app/
    page.tsx                           # Main layout: map + chat overlay
    layout.tsx                         # Root layout (metadata, fonts, theme provider)
    globals.css                        # ALL theming: CSS custom properties, Tailwind v4
    api/
      chat/
        route.ts                       # AI SDK chat endpoint (ToolLoopAgent-backed)
      events/
        route.ts                       # GET events from registry (with filters)
      newsletters/
        route.ts                       # GET newsletters from registry
  components/
    map/
      map-container.tsx                # MapLibre GL wrapper (client component)
      map-controls.tsx                 # Control panel sidebar (filters, toggles)
      map-markers.tsx                  # Event markers GeoJSON layer
      map-popups.tsx                   # Event detail popups on click
      map-layers.tsx                   # Heatmap, clusters, category layers
      map-status-bar.tsx               # Coordinates, zoom, pitch display
      use-map.ts                       # Map context hook (share map instance)
    chat/
      chat-panel.tsx                   # Full chat panel (AI Elements composition)
      chat-trigger.tsx                 # Floating button (bottom-right)
      chat-provider.tsx                # Chat state context provider
      event-card.tsx                   # Generative UI: event card (tool render)
      event-list.tsx                   # Generative UI: ranked event list (tool render)
      newsletter-card.tsx              # Generative UI: newsletter item (tool render)
      map-action.tsx                   # Generative UI: map navigation action (tool render)
    ui/                                # shadcn/ui base components
      button.tsx
      dialog.tsx
      sheet.tsx
      scroll-area.tsx
      badge.tsx
      separator.tsx
      collapsible.tsx
      toggle.tsx
      slider.tsx
      select.tsx
    ai-elements/                       # AI Elements components (installed via CLI)
      conversation.tsx
      message.tsx
      prompt-input.tsx
      suggestion.tsx
      tool.tsx
      reasoning.tsx
      sources.tsx
      loader.tsx
      shimmer.tsx
  lib/
    registries/
      events.ts                        # Event registry: read, filter, search
      newsletters.ts                   # Newsletter registry: read, filter, search
      types.ts                         # All TypeScript types for registries
    agents/
      event-agent.ts                   # Main ToolLoopAgent definition
      tools/
        search-events.ts               # Tool: search event registry
        get-event-details.ts           # Tool: get event by ID
        search-newsletters.ts          # Tool: search newsletter registry
        rank-events.ts                 # Tool: rank events by criteria (sub-agent)
        map-navigate.ts                # Tool: client-side map action (no execute)
        fetch-live-events.ts           # Tool: fetch from external APIs (Phase 4)
    map/
      config.ts                        # Map styles, locations, colors (reads from CSS vars)
      geojson.ts                       # GeoJSON helpers (Turf.js wrappers)
  data/
    events.json                        # THE event registry (single source of truth)
    newsletters.json                   # THE newsletter registry
```

---

<a id="theming"></a>
## 4. Dynamic Theming System (globals.css)

Everything visual is controlled through CSS custom properties. To rebrand, you change `globals.css` only.

### globals.css Structure

```css
@import "tailwindcss";
@import "maplibre-gl/dist/maplibre-gl.css";

/* ============================================
   MOONSHOTS & MAGIC - BRAND TOKENS
   Change these to rebrand the entire app
   ============================================ */

:root {
  /* Brand Colors */
  --brand-primary: #00ffcc;
  --brand-primary-dim: rgba(0, 255, 204, 0.2);
  --brand-primary-foreground: #000000;

  /* Surfaces */
  --bg: #0a0a0f;
  --surface: #12121a;
  --surface-2: #1a1a24;
  --surface-3: #22222e;
  --border: rgba(255, 255, 255, 0.08);

  /* Text */
  --text: #ffffff;
  --text-dim: #888888;
  --text-muted: #666666;

  /* Category Colors (for map markers + UI badges) */
  --category-music: #ff6b6b;
  --category-arts: #b197fc;
  --category-sports: #74c0fc;
  --category-food: #ffa94d;
  --category-tech: #69db7c;
  --category-community: #ffd43b;
  --category-family: #f783ac;
  --category-nightlife: #b197fc;
  --category-outdoor: #69db7c;
  --category-education: #74c0fc;
  --category-festival: #ff6b6b;
  --category-market: #ffa94d;
  --category-other: #888888;

  /* Semantic Colors */
  --success: #69db7c;
  --warning: #ffa94d;
  --error: #ff6b6b;
  --info: #74c0fc;

  /* Typography */
  --font-sans: var(--font-geist-sans), -apple-system, sans-serif;
  --font-mono: var(--font-geist-mono), 'JetBrains Mono', monospace;

  /* Spacing */
  --panel-width: 340px;
  --chat-width: 400px;
  --status-bar-height: 48px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Map */
  --map-popup-bg: var(--surface);
  --map-popup-border: var(--border);
  --map-marker-shadow: rgba(0, 255, 204, 0.4);

  /* Chat */
  --chat-bg: rgba(18, 18, 26, 0.85);
  --chat-backdrop-blur: 16px;

  /* shadcn/ui integration (map to their expected vars) */
  --background: var(--bg);
  --foreground: var(--text);
  --card: var(--surface);
  --card-foreground: var(--text);
  --popover: var(--surface);
  --popover-foreground: var(--text);
  --primary: var(--brand-primary);
  --primary-foreground: var(--brand-primary-foreground);
  --secondary: var(--surface-2);
  --secondary-foreground: var(--text);
  --muted: var(--surface-3);
  --muted-foreground: var(--text-dim);
  --accent: var(--brand-primary-dim);
  --accent-foreground: var(--brand-primary);
  --destructive: var(--error);
  --destructive-foreground: var(--text);
  --border: var(--border);
  --input: var(--surface-3);
  --ring: var(--brand-primary);
  --radius: var(--radius-md);
}

/* Light mode override (future) */
[data-theme="light"] {
  --bg: #ffffff;
  --surface: #f8f9fa;
  --surface-2: #f1f3f5;
  --surface-3: #e9ecef;
  --border: rgba(0, 0, 0, 0.1);
  --text: #1a1a2e;
  --text-dim: #666666;
  --chat-bg: rgba(248, 249, 250, 0.9);
}

/* AI Elements streamdown styles */
@source "../node_modules/streamdown/dist/*.js";

/* MapLibre dark theme overrides */
.maplibregl-ctrl-group { ... }
.maplibregl-popup-content { ... }

/* Custom marker styles */
.event-marker { ... }
.event-marker--music { background: var(--category-music); }
.event-marker--arts { background: var(--category-arts); }
/* ... one per category ... */
```

### How Components Use Theme Tokens

All components reference CSS variables, never hard-coded colors:

```tsx
// Example: Badge component uses category color
<Badge style={{ backgroundColor: `var(--category-${event.category})` }}>
  {event.category}
</Badge>

// Example: Chat panel uses chat-specific tokens
<div className="bg-[var(--chat-bg)] backdrop-blur-[var(--chat-backdrop-blur)]">

// Example: Map config reads from CSS
const CATEGORY_COLORS: Record<EventCategory, string> = {
  music: 'var(--category-music)',  // resolved at runtime for MapLibre
  // ...
};
```

### Category Color Map (for MapLibre)

MapLibre requires actual hex values (not CSS vars). We maintain a parallel config that reads from the same source of truth:

```typescript
// lib/map/config.ts
export const CATEGORY_COLORS: Record<EventCategory, string> = {
  music: '#ff6b6b',
  arts: '#b197fc',
  sports: '#74c0fc',
  food: '#ffa94d',
  tech: '#69db7c',
  community: '#ffd43b',
  family: '#f783ac',
  nightlife: '#b197fc',
  outdoor: '#69db7c',
  education: '#74c0fc',
  festival: '#ff6b6b',
  market: '#ffa94d',
  other: '#888888',
};
// These MUST match the --category-* vars in globals.css
```

---

<a id="registries"></a>
## 5. Central JSON Registries

### Event Registry Schema (`data/events.json`)

```typescript
// lib/registries/types.ts

export interface EventEntry {
  id: string;                          // crypto.randomUUID()
  title: string;
  description: string;
  category: EventCategory;
  subcategory?: string;

  // Location (required for map placement)
  coordinates: [number, number];       // [longitude, latitude] for MapLibre/GeoJSON
  venue: string;
  address: string;
  city: string;
  region: string;                      // "Orlando" | "Tampa" | "Kissimmee" | etc.

  // Time
  startDate: string;                   // ISO 8601 (e.g., "2026-02-14T19:00:00-05:00")
  endDate?: string;                    // ISO 8601
  allDay?: boolean;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval?: number;
    endDate?: string;
  };
  timezone: string;                    // "America/New_York"

  // Details
  price?: {
    min: number;
    max: number;
    currency: string;                  // "USD"
    isFree: boolean;
  };
  url?: string;                        // Link to event page
  imageUrl?: string;                   // Event image
  tags: string[];                      // Searchable tags

  // Source tracking
  source: EventSource;
  sourceId?: string;                   // Original ID from external source

  // Meta
  createdAt: string;                   // ISO 8601
  updatedAt: string;                   // ISO 8601
  expiresAt?: string;                  // Auto-remove after this date
  status: "active" | "cancelled" | "postponed" | "past";
  featured?: boolean;                  // Highlighted events
}

export type EventCategory =
  | "music" | "arts" | "sports" | "food"
  | "tech" | "community" | "family"
  | "nightlife" | "outdoor" | "education"
  | "festival" | "market" | "other";

export type EventSource =
  | { type: "manual"; addedBy: string }
  | { type: "ticketmaster"; fetchedAt: string }
  | { type: "overpass"; fetchedAt: string }
  | { type: "scraper"; site: string; fetchedAt: string }
  | { type: "predicthq"; fetchedAt: string };

export interface EventRegistry {
  version: "1.0.0";
  lastSynced: string;
  metadata: {
    totalEvents: number;
    activeEvents: number;
    categories: Record<EventCategory, number>;
    regions: string[];
  };
  events: EventEntry[];
}
```

### Newsletter Registry Schema (`data/newsletters.json`)

```typescript
export interface NewsletterEntry {
  id: string;
  title: string;
  summary: string;                     // Short description
  content: string;                     // Full text (markdown)
  category: NewsletterCategory;

  // Optional location (some aren't location-specific)
  coordinates?: [number, number];
  venue?: string;
  address?: string;

  // Time
  publishedAt: string;                 // When the newsletter was published
  eventDate?: string;                  // If about a specific event

  // Meta
  source: string;                      // Newsletter name / publication
  author?: string;
  url?: string;                        // Original link
  imageUrl?: string;
  tags: string[];
}

export type NewsletterCategory =
  | "events" | "news" | "culture"
  | "food" | "tech" | "community"
  | "arts" | "outdoor" | "nightlife";

export interface NewsletterRegistry {
  version: "1.0.0";
  lastUpdated: string;
  metadata: {
    totalEntries: number;
    sources: string[];
  };
  entries: NewsletterEntry[];
}
```

### Registry Access Functions

```typescript
// lib/registries/events.ts
export function getEvents(filters?: EventFilters): EventEntry[]
export function getEventById(id: string): EventEntry | undefined
export function getEventsByBounds(sw: [number,number], ne: [number,number]): EventEntry[]
export function getEventsByCategory(category: EventCategory): EventEntry[]
export function getUpcomingEvents(limit?: number): EventEntry[]
export function searchEvents(query: string): EventEntry[]  // full-text search on title+description+tags
export function getEventCategories(): { category: EventCategory; count: number }[]
export function eventsToGeoJSON(events: EventEntry[]): GeoJSON.FeatureCollection

// lib/registries/newsletters.ts
export function getNewsletters(filters?: NewsletterFilters): NewsletterEntry[]
export function getNewsletterById(id: string): NewsletterEntry | undefined
export function searchNewsletters(query: string): NewsletterEntry[]
export function getRecentNewsletters(limit?: number): NewsletterEntry[]
```

### Filters Type

```typescript
export interface EventFilters {
  query?: string;
  category?: EventCategory | EventCategory[];
  dateRange?: { start: string; end: string };
  city?: string;
  region?: string;
  tags?: string[];
  status?: EventEntry["status"];
  isFree?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface NewsletterFilters {
  query?: string;
  category?: NewsletterCategory;
  dateRange?: { start: string; end: string };
  source?: string;
  tags?: string[];
  limit?: number;
}
```

---

<a id="map"></a>
## 6. Map Component Architecture

### Approach
Convert `map.html` to React components using MapLibre GL JS directly. Reference `map.html` (lines 771-1462) for all the JavaScript patterns.

### Component Breakdown

**`map-container.tsx`** (client component)
- `useRef` for MapLibre Map instance
- `useEffect` for init/cleanup lifecycle
- `MapProvider` context to share map instance with children
- Loads CARTO Dark Matter style by default
- Centered on Orlando `[-81.3792, 28.5383]`, zoom 10
- Navigation + Scale controls

**`map-controls.tsx`** (client component)
- Collapsible sidebar (340px, from map.html pattern)
- Sections: Category Filters, Map Style, Camera, Data Viz
- All toggles/sliders use shadcn/ui components (not custom)
- State drives which GeoJSON layers are visible

**`map-markers.tsx`** (client component)
- Reads events from registry via API route
- Converts to GeoJSON FeatureCollection
- Adds as MapLibre source + circle layer
- Color-coded by `category` using `CATEGORY_COLORS`
- Click handler opens popup with event details

**`map-popups.tsx`** (client component)
- MapLibre Popup on marker click
- Shows: title, category badge, date, venue, price
- "Ask about this" button prefills chat input

**`map-status-bar.tsx`** (client component)
- Bottom bar: LAT, LNG, ZOOM, PITCH (from map.html)
- Updates on map `move` event

**`use-map.ts`** (hook)
```typescript
const MapContext = createContext<maplibregl.Map | null>(null);
export const useMap = () => useContext(MapContext);
```

### Map-Chat Integration

The chat can trigger map actions via the `mapNavigate` tool:

```typescript
// In chat-panel.tsx, when rendering tool-mapNavigate parts:
const { action, coordinates, eventIds, zoom } = part.input;

// Use the map context to execute:
if (action === 'flyTo') map.flyTo({ center: coordinates, zoom });
if (action === 'highlight') highlightEvents(eventIds);
if (action === 'fitBounds') fitToEvents(eventIds);
```

---

<a id="chat"></a>
## 7. AI Chat Architecture

### Stack
- **AI Gateway**: `AI_GATEWAY_API_KEY` already in `.env.local`
- **AI SDK**: `useChat` from `@ai-sdk/react` + `ToolLoopAgent` + `createAgentUIStreamResponse`
- **AI Elements**: ALL chat UI from the installed AI Elements library
- **Model**: `anthropic/claude-sonnet-4.5` via AI Gateway (with fallbacks)

### Chat Panel Design

Floating button (bottom-right) opens a transparent overlay panel. Full map always visible behind.

```
+----------------------------------------------+
|                                              |
|                    MAP                       |
|                                              |
|                           +----------------+ |
|                           |  CHAT PANEL    | |
|                           |  (glass/blur)  | |
|                           |                | |
|                           |  messages...   | |
|                           |                | |
|                           |  [input___]    | |
|                           +----------------+ |
|                                         [C]  |  <-- trigger button
|  [status bar]                                |
+----------------------------------------------+
```

### Chat Component Tree (AI Elements)

```
chat-panel.tsx (client component)
|
+-- <Conversation>
|   +-- <ConversationContent>
|   |   +-- <ConversationEmptyState
|   |   |     title="Moonshots & Magic"
|   |   |     description="Ask me about events in Orlando & Central Florida" />
|   |   |
|   |   +-- {messages.map(message =>
|   |   |     <Message from={message.role}>
|   |   |       <MessageContent>
|   |   |         {message.parts.map(part => switch(part.type) {
|   |   |           case 'text':
|   |   |             <MessageResponse>{part.text}</MessageResponse>
|   |   |
|   |   |           case 'reasoning':
|   |   |             <Reasoning isStreaming={...}>
|   |   |               <ReasoningTrigger />
|   |   |               <ReasoningContent>{part.text}</ReasoningContent>
|   |   |             </Reasoning>
|   |   |
|   |   |           case 'tool-searchEvents':
|   |   |             <EventListCard events={part.output} state={part.state} />
|   |   |
|   |   |           case 'tool-getEventDetails':
|   |   |             <EventCard event={part.output} state={part.state} />
|   |   |
|   |   |           case 'tool-searchNewsletters':
|   |   |             <NewsletterCard items={part.output} state={part.state} />
|   |   |
|   |   |           case 'tool-mapNavigate':
|   |   |             <MapAction action={part.input} />  // Client-side execution
|   |   |
|   |   |           case 'tool-rankEvents':
|   |   |             <EventListCard events={part.output} ranked={true} />
|   |   |         })}
|   |   |       </MessageContent>
|   |   |       <MessageActions>
|   |   |         <MessageAction tooltip="Copy" />
|   |   |         <MessageAction tooltip="Retry" onClick={regenerate} />
|   |   |       </MessageActions>
|   |   |     </Message>
|   |   |   )}
|   |   |
|   |   +-- {status === 'submitted' && <Loader />}
|   |
|   +-- <ConversationScrollButton />
|
+-- <Suggestions suggestions={[
|     "What's happening this weekend?",
|     "Find live music near downtown Orlando",
|     "Top 5 family-friendly events this month",
|     "Any food festivals coming up?",
|   ]} />
|
+-- <PromptInput onSubmit={handleSend}>
      <PromptInputTextarea placeholder="Ask about Orlando events..." />
      <PromptInputFooter>
        <PromptInputSubmit status={chatStatus} />
      </PromptInputFooter>
    </PromptInput>
```

### useChat Integration

```typescript
// chat-provider.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export function useChatInstance() {
  const [input, setInput] = useState('');

  const chat = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: ({ message }) => {
      // Handle map navigation tools (client-side execution)
      for (const part of message.parts) {
        if (part.type === 'tool-mapNavigate' && part.state === 'output-available') {
          executeMapAction(part.input);
        }
      }
    },
  });

  return { ...chat, input, setInput };
}
```

### API Route

```typescript
// app/api/chat/route.ts
import { createAgentUIStreamResponse } from 'ai';
import { eventAgent } from '@/lib/agents/event-agent';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createAgentUIStreamResponse({
    agent: eventAgent,
    uiMessages: messages,
  });
}
```

---

<a id="agents"></a>
## 8. Agentic Architecture

### Main Agent: Event Discovery Agent

```typescript
// lib/agents/event-agent.ts
import { ToolLoopAgent, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { getEvents, getEventById, searchEvents } from '@/lib/registries/events';
import { searchNewsletters } from '@/lib/registries/newsletters';
import { EVENT_CATEGORIES } from '@/lib/registries/types';

export const eventAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',

  instructions: `You are the Moonshots & Magic AI assistant for Orlando & Central Florida.
You help users discover events, get personalized recommendations, explore the interactive map,
and learn about what's happening in the region.

GUIDELINES:
- When recommending events, explain WHY each one matches the user's criteria
- When showing events, always include date, venue, and category
- Use the mapNavigate tool to show events on the map when relevant
- Search newsletters for additional context and recent news
- Be enthusiastic about Orlando's vibrant event scene
- If no events match, suggest broadening the search criteria
- For "top N" requests, use rankEvents to provide reasoned rankings`,

  tools: {
    searchEvents: tool({
      description: 'Search the event registry by criteria. Use this to find events matching user preferences.',
      inputSchema: z.object({
        query: z.string().optional().describe('Text search on title, description, tags'),
        category: z.enum(EVENT_CATEGORIES).optional(),
        dateRange: z.object({
          start: z.string().describe('ISO 8601 start date'),
          end: z.string().describe('ISO 8601 end date'),
        }).optional(),
        city: z.string().optional(),
        isFree: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        limit: z.number().default(10),
      }),
      execute: async (params) => {
        const events = getEvents(params);
        return { count: events.length, events };
      },
    }),

    getEventDetails: tool({
      description: 'Get full details for a specific event by its ID',
      inputSchema: z.object({
        eventId: z.string().describe('The event UUID'),
      }),
      execute: async ({ eventId }) => {
        const event = getEventById(eventId);
        if (!event) return { error: 'Event not found' };
        return event;
      },
    }),

    rankEvents: tool({
      description: 'Rank and score a set of events based on user preferences. Use this for "top N" or "best" requests.',
      inputSchema: z.object({
        eventIds: z.array(z.string()).describe('Event IDs to rank'),
        criteria: z.string().describe('What to optimize for (e.g., "romantic date night", "family outdoor fun")'),
        limit: z.number().default(5),
      }),
      execute: async ({ eventIds, criteria, limit }) => {
        const events = eventIds
          .map(id => getEventById(id))
          .filter(Boolean);
        // Return events for the agent to rank in its response
        return { events, criteria, requestedLimit: limit };
      },
    }),

    searchNewsletters: tool({
      description: 'Search newsletter content for information about events, news, culture, and local happenings',
      inputSchema: z.object({
        query: z.string().describe('Search query'),
        category: z.string().optional(),
        limit: z.number().default(5),
      }),
      execute: async (params) => {
        const results = searchNewsletters(params.query);
        return { count: results.length, newsletters: results.slice(0, params.limit) };
      },
    }),

    mapNavigate: tool({
      description: 'Control the interactive map. Use this to show events on the map, fly to locations, or highlight clusters.',
      inputSchema: z.object({
        action: z.enum(['flyTo', 'highlight', 'fitBounds']).describe('Map action to perform'),
        coordinates: z.tuple([z.number(), z.number()]).optional().describe('[longitude, latitude]'),
        eventIds: z.array(z.string()).optional().describe('Event IDs to highlight on map'),
        zoom: z.number().optional().describe('Zoom level (1-20)'),
      }),
      // No execute function -- this is a CLIENT-SIDE tool
      // The chat UI renders a MapAction component that executes via useMap()
    }),
  },

  stopWhen: stepCountIs(10),
});
```

### Agentic Workflow Examples

**"Top 5 events this weekend for a date night":**
1. Agent calls `searchEvents({ dateRange: thisWeekend, category: relevant })`
2. Agent calls `rankEvents({ eventIds: [...], criteria: "romantic date night" })`
3. Agent calls `mapNavigate({ action: 'fitBounds', eventIds: topFive })`
4. Agent generates response with ranked list and reasoning

**"Any food festivals coming up?":**
1. Agent calls `searchEvents({ category: 'food', tags: ['festival'] })`
2. Agent calls `searchNewsletters({ query: 'food festival' })`
3. Agent synthesizes results from both registries
4. Agent calls `mapNavigate` to show results on map

**"Tell me about that music event downtown":**
1. Agent calls `searchEvents({ query: 'music', city: 'Orlando' })`
2. Agent calls `getEventDetails({ eventId: bestMatch })`
3. Agent calls `mapNavigate({ action: 'flyTo', coordinates: event.coordinates, zoom: 15 })`

---

<a id="data"></a>
## 9. Data Pipeline

### Phase 1: Seed Data Only

No external APIs. Hand-curated events covering:

- **~50 events** across all categories
- Mix of real Orlando venues (Amway Center, Dr. Phillips Center, Wall St. Plaza, Lake Eola Park, etc.)
- Range of dates (upcoming weeks/months)
- Various price points including free events
- Coordinates for all venues

- **~10 newsletter entries** as sample content
- Mix of event announcements, culture pieces, food reviews
- Some with locations, some without

### Phase 4: External APIs (Future)

| Source | Status | Notes |
|--------|--------|-------|
| **Ticketmaster Discovery API** | Deferred | Need API key; search by city/state |
| **Overpass API** | Deferred | Can reuse pattern from map.html |
| **Newsletter Import** | Deferred | User will provide source URL |
| **PredictHQ** | Future | Premium API; best for aggregate data |

### Deduplication Strategy (Phase 4)
- Match by `sourceId` + `source.type` for exact duplicates
- Fuzzy match by `title` + `startDate` + `venue` for cross-source dedup
- Newer data wins on conflict
- Manual entries never auto-overwritten

---

<a id="deps"></a>
## 10. Dependencies to Install

### Core
```bash
pnpm add ai @ai-sdk/react @ai-sdk/gateway zod
```

### Map
```bash
pnpm add maplibre-gl @turf/turf
pnpm add -D @types/maplibre-gl
```

### shadcn/ui Setup
```bash
npx shadcn@latest init
npx shadcn@latest add button dialog sheet scroll-area badge separator collapsible toggle slider select
```

### AI Elements Setup
```bash
npx ai-elements@latest
# Install needed components:
# conversation, message, prompt-input, suggestion, tool, reasoning, sources, loader, shimmer
```

### Additional
```bash
pnpm add uuid
pnpm add -D @types/uuid
```

---

<a id="phases"></a>
## 11. Implementation Phases

### Phase 1: Foundation
1. Install all dependencies (AI SDK, MapLibre, Turf.js, shadcn/ui)
2. Configure shadcn/ui with dark theme
3. Install AI Elements components
4. Set up `globals.css` with full dynamic theming system (CSS custom properties)
5. Create all TypeScript types (`lib/registries/types.ts`)
6. Seed `data/events.json` with ~50 hand-curated Orlando events
7. Seed `data/newsletters.json` with ~10 sample entries
8. Create registry access functions (`lib/registries/events.ts`, `newsletters.ts`)
9. Create events API route (`app/api/events/route.ts`)

### Phase 2: Map
1. Create MapLibre React wrapper (`map-container.tsx`) with `MapProvider`
2. Port dark theme from map.html to `globals.css` MapLibre overrides
3. Create map controls sidebar with shadcn/ui components
4. Render events from registry as GeoJSON circle/symbol layers
5. Implement category-colored markers
6. Implement event popups on marker click
7. Add category filter toggles
8. Add status bar (coordinates, zoom)
9. Replace `src/app/page.tsx` with map layout

### Phase 3: AI Chat
1. **Read AI Elements SKILL.md** and AI SDK SKILL.md before writing any code
2. Create the `ToolLoopAgent` (`lib/agents/event-agent.ts`)
3. Create all agent tools (`lib/agents/tools/*.ts`)
4. Create chat API route (`app/api/chat/route.ts`)
5. Create chat trigger button (floating, bottom-right)
6. Create chat panel with AI Elements (glass/blur overlay)
7. Wire up `useChat` hook with `DefaultChatTransport`
8. Implement generative UI components (EventCard, EventList, NewsletterCard)
9. Implement `mapNavigate` client-side tool execution
10. Add suggestions for common queries

### Phase 4: Data Pipeline (Deferred)
1. Connect external event sources (Ticketmaster, etc.)
2. Connect newsletter import from user's source
3. Implement deduplication
4. Create sync cron route

### Phase 5: Polish
1. Mobile responsive layout
2. Loading states (Shimmer, Loader from AI Elements)
3. Error handling (AI SDK error patterns)
4. Map-chat bidirectional: click event on map -> prefill chat
5. Accessibility audit (per web-design-guidelines skill)

---

<a id="files"></a>
## 12. Key Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/app/globals.css` | **Rewrite** | Full dynamic theming system |
| `src/app/page.tsx` | **Replace** | Main layout: full-bleed map + chat overlay |
| `src/app/layout.tsx` | **Update** | Metadata ("Moonshots & Magic"), theme provider |
| `src/app/api/chat/route.ts` | **Create** | AI SDK agent endpoint |
| `src/app/api/events/route.ts` | **Create** | Events registry API |
| `src/app/api/newsletters/route.ts` | **Create** | Newsletter registry API |
| `src/lib/registries/types.ts` | **Create** | All TypeScript types |
| `src/lib/registries/events.ts` | **Create** | Event registry access |
| `src/lib/registries/newsletters.ts` | **Create** | Newsletter registry access |
| `src/lib/agents/event-agent.ts` | **Create** | ToolLoopAgent definition |
| `src/lib/agents/tools/*.ts` | **Create** | Agent tools (5 files) |
| `src/lib/map/config.ts` | **Create** | Map styles, colors, locations |
| `src/lib/map/geojson.ts` | **Create** | GeoJSON helpers |
| `src/components/map/*.tsx` | **Create** | Map React components (6 files) |
| `src/components/chat/*.tsx` | **Create** | Chat React components (7 files) |
| `src/data/events.json` | **Create** | Seeded event registry |
| `src/data/newsletters.json` | **Create** | Seeded newsletter registry |
| `package.json` | **Update** | Add dependencies |
| `.env.local` | **Keep** | Already has `AI_GATEWAY_API_KEY` |

---

<a id="verify"></a>
## 13. Verification Plan

### Phase 1 Verification
- [ ] `pnpm dev` runs without errors
- [ ] shadcn/ui components render correctly
- [ ] AI Elements components installed in `src/components/ai-elements/`
- [ ] `data/events.json` loads with ~50 events
- [ ] `GET /api/events` returns filtered events
- [ ] All CSS custom properties defined in globals.css

### Phase 2 Verification
- [ ] MapLibre renders at localhost:3000 with dark theme
- [ ] Centered on Orlando, zoom 10
- [ ] Event markers appear color-coded by category
- [ ] Clicking marker shows popup with event details
- [ ] Category filters toggle marker visibility
- [ ] Status bar updates on map movement

### Phase 3 Verification
- [ ] Chat trigger button visible bottom-right
- [ ] Clicking opens transparent chat panel (map visible behind)
- [ ] Send "What events are happening this weekend?" -> agent returns results
- [ ] Event cards render in chat with generative UI
- [ ] "Show me these on the map" -> map navigates to events
- [ ] Suggestions work as quick-start prompts
- [ ] Newsletter search returns results
- [ ] Streaming works (see tokens appear progressively)

### End-to-End Test
```
1. Open localhost:3000
2. See dark-themed map of Orlando with colored event markers
3. Click a marker -> popup with event info
4. Click chat button -> glass panel opens
5. Type "Top 5 events for a date night this weekend"
6. Agent searches -> ranks -> shows event cards -> highlights on map
7. Type "Tell me more about the first one"
8. Agent shows full details -> map flies to that event
9. Close chat -> floating button returns
```
