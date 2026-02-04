---
title: AI Capabilities Registry
description: Complete list of AI agent tools and features for Moonshots & Magic
---

# AI Capabilities

The Moonshots & Magic AI assistant uses **Claude Sonnet 4.5** with 5 specialized tools to help users discover events in Orlando & Central Florida.

## Agent Overview

The `eventAgent` is a `ToolLoopAgent` that can execute up to 10 tool calls per conversation turn. It combines semantic search, AI-powered ranking, and interactive map control to provide a comprehensive event discovery experience.

## Available Tools

| Tool | Type | Description |
|------|------|-------------|
| [searchEvents](/docs/ai/search-events) | Server | Search events by category, date, location, price, and keywords |
| [getEventDetails](/docs/ai/get-event-details) | Server | Fetch full details for a single event by ID |
| [rankEvents](/docs/ai/rank-events) | Server | AI-powered ranking based on user preferences |
| [mapNavigate](/docs/ai/map-navigate) | Client | Control the interactive map (fly to, highlight, fit bounds) |
| [searchNewsletters](/docs/ai/search-newsletters) | Server | Search newsletter content for local news and context |

## Architecture

```
User Message → eventAgent → Tool Calls → Tool Results → AI Response
                   │
                   ├── searchEvents (server)
                   ├── getEventDetails (server)
                   ├── rankEvents (server)
                   ├── searchNewsletters (server)
                   └── mapNavigate (client-side, rendered in chat)
```

## Example Queries

- "What's happening this weekend in Orlando?"
- "Find me outdoor events near Lake Eola"
- "What are the top 5 family-friendly events next month?"
- "Show me all music festivals in Central Florida"
- "What food events are free to attend?"

## System Prompt

The agent is configured with guidelines to:
- Explain WHY each event matches the user's criteria
- Always include date, venue, and category in recommendations
- Use the map to visualize event locations
- Search newsletters for additional context
- Suggest broadening search criteria when no matches are found
