---
title: AI Capabilities Registry
description: Complete list of AI agent tools and features for Moonshots & Magic
---

# AI Capabilities

The Moonshots & Magic AI assistant **Ditto** uses **Claude** with 12 specialized tools to help users discover events in Orlando & Central Florida.

## Agent Overview

The `eventAgent` is a `ToolLoopAgent` that can execute up to 10 tool calls per conversation turn. It combines semantic search, AI-powered ranking, interactive map control, cinematic flyovers, directions, and personalization to provide a comprehensive event discovery experience.

## Current Model

| Setting | Value |
|---------|-------|
| Provider | Anthropic (via AI Gateway) |
| Model | `claude-haiku` (configurable) |
| Max Steps | 10 tool calls per turn |

> **Note:** Model selection is configurable via Settings. Haiku provides fast, cost-effective responses for event discovery tasks.

## Available Tools

### Server-Side Tools (execute on server)

| Tool | Description |
|------|-------------|
| [searchEvents](/docs/ai/search-events) | Search events by category, date, location, price, and keywords |
| [getEventDetails](/docs/ai/get-event-details) | Fetch full details for a single event by ID |
| [rankEvents](/docs/ai/rank-events) | AI-powered ranking based on user preferences |
| [searchNewsletters](/docs/ai/search-newsletters) | Search newsletter content for local news and context |

### Client-Side Tools (render in chat UI)

| Tool | Description |
|------|-------------|
| [mapNavigate](/docs/ai/map-navigate) | Control the interactive map (fly to, highlight, fit bounds) |
| startFlyover | Launch cinematic 3D flyover tour of selected events |
| getDirections | Get walking/driving directions to an event on the map |
| highlightEvents | Glow and highlight specific events on the map |
| getUserProfile | Read user preferences from local storage |
| updateUserProfile | Save learned preferences from conversation |
| changeEventFilter | Change map date preset and category filter |
| startPresentation | Launch narrated Orlando landmarks tour |

## Quick Actions Menu

Users can access Ditto's key features without typing via the Quick Actions dropdown (sparkle icon in chat header):

| Action | Description |
|--------|-------------|
| Find Events | Search by date, category, or vibe |
| Personalize | Set interests, availability, travel radius |
| Flyover Tour | 3D cinematic event tour |
| Get Directions | Walking or driving routes |
| Orlando Tour | Narrated landmarks presentation |
| Recommendations | Personalized event picks |
| Free Events | No-cost things to do |
| Family Friendly | Kid-friendly activities |

## Architecture

```
User Message → eventAgent → Tool Calls → Tool Results → AI Response
                   │
                   ├── searchEvents (server)
                   ├── getEventDetails (server)
                   ├── rankEvents (server)
                   ├── searchNewsletters (server)
                   ├── mapNavigate (client — map control)
                   ├── startFlyover (client — 3D tour)
                   ├── getDirections (client — routing)
                   ├── highlightEvents (client — markers)
                   ├── getUserProfile (client — read prefs)
                   ├── updateUserProfile (client — save prefs)
                   ├── changeEventFilter (client — filter chips)
                   └── startPresentation (client — landmarks tour)
```

## Data Sources

Events are aggregated from multiple APIs and scrapers:

| Source | Type | Coverage |
|--------|------|----------|
| Ticketmaster | API (free) | 7 months ahead |
| SerpApi (Google Events) | API (credits) | Current + future months |
| TKX Events | Web scraper | Calendar through December |
| Eventbrite | API | Current + future events |

Total: 1200+ unique events across Central Florida.

## Example Queries

- "What's happening this weekend in Orlando?"
- "Find me outdoor events near Lake Eola"
- "What are the top 5 family-friendly events next month?"
- "Show me all music festivals in Central Florida"
- "What food events are free to attend?"
- "Take me on a flyover of tonight's best events"
- "Get directions to the Jazz Festival"
- "Show me events near me"
- "Personalize my experience"

## System Prompt

The agent is configured with guidelines to:
- Explain WHY each event matches the user's criteria
- Always include date, venue, and category in recommendations
- Use the map to visualize event locations
- Search newsletters for additional context
- Suggest broadening search criteria when no matches are found
- Learn and remember user preferences across conversations

---

## Upcoming Features

### Human-in-the-Loop Confirmations

**Status:** Planned

Tool approval workflow for sensitive operations using the `Confirmation` component:

- **Booking confirmations** — Confirm before redirecting to ticket purchases
- **Sharing confirmations** — Approve before sharing event details externally

### Sub-Agent Architecture

**Status:** Research

Specialized sub-agents for complex multi-step workflows:

- **PlannerAgent** — Creates itineraries combining multiple events
- **ComparisonAgent** — Side-by-side event comparison with pros/cons
- **NotificationAgent** — Schedules reminders for upcoming events

### Inline Citations

**Status:** Planned

Using the `InlineCitation` component for source attribution:

- Link to original event listings
- Reference newsletter articles
- Cite venue information sources
