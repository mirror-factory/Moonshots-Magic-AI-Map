# Composite AI Feature Development

## When to Use

Any feature touching agents, tools, chat UI, AI Elements, or AI Gateway. This skill orchestrates the other AI skills — read them first.

## Prerequisite Skills

1. **ai-sdk** — `.claude/skills/ai-sdk/SKILL.md` (ToolLoopAgent, tools, streaming)
2. **ai-elements** — `.claude/skills/ai-elements/SKILL.md` (chat UI components)

Read both BEFORE writing code.

## Project Architecture

### Agent

- **File**: `src/lib/agents/event-agent.ts`
- **Type**: `ToolLoopAgent` with `stepCountIs(10)`
- **Model**: Configurable via `DEFAULT_MODEL` from `src/lib/settings.ts`

### API Route

- **File**: `src/app/api/chat/route.ts`
- **Pattern**: `createAgentUIStreamResponse`

### Client

- **File**: `src/components/chat/chat-panel.tsx`
- **Pattern**: `useChat` + tool rendering via `MapAction`, `EventCard`, `NewsletterCard`

### Tool Inventory

| Tool | Type | File | Description |
|------|------|------|-------------|
| `searchEvents` | Server | `src/lib/agents/tools/search-events.ts` | Full-text search over events registry |
| `getEventDetails` | Server | `src/lib/agents/tools/get-event-details.ts` | Fetch single event by ID |
| `searchNewsletters` | Server | `src/lib/agents/tools/search-newsletters.ts` | Search newsletter articles |
| `rankEvents` | Server | `src/lib/agents/tools/rank-events.ts` | AI-powered event ranking |
| `mapNavigate` | Client | `src/lib/agents/tools/map-navigate.ts` | Map flyTo/highlight/fitBounds |
| `getUserProfile` | Client | `src/lib/agents/tools/get-user-profile.ts` | Read user preferences |
| `updateUserProfile` | Client | `src/lib/agents/tools/update-user-profile.ts` | Save user preferences |
| `startFlyover` | Client | `src/lib/agents/tools/start-flyover.ts` | Launch flyover tour |

### AI Elements

9 components in `src/components/ai-elements/`:
`conversation`, `message`, `prompt-input`, `suggestion`, `sources`, `tool`, `code-block`, `reasoning`, `shimmer`

## Adding a New Server Tool

1. Create tool file in `src/lib/agents/tools/your-tool.ts`
2. Define Zod schema for parameters and implement `execute` function
3. Register in `src/lib/agents/event-agent.ts` tools object
4. Add tool rendering in `src/components/chat/chat-panel.tsx` if it has visual output
5. Write tests in `tests/unit/agents/tools/your-tool.test.ts`

## Adding a New Client Tool

1. Create tool file in `src/lib/agents/tools/your-tool.ts` (Zod schema only, NO `execute`)
2. Register in `src/lib/agents/event-agent.ts` tools object
3. Handle tool call in `chat-panel.tsx` via `onToolCall` or component rendering
4. Write tests: schema validation in `tests/unit/agents/tools/`, component test in `tests/component/chat/`

## Agent Team Spawn Pattern

For AI features, spawn 4 parallel agents:

```
Agent A — Tool & Agent Logic
  Scope: src/lib/agents/, src/app/api/chat/
  Skills: ai-sdk

Agent B — Chat UI & Components
  Scope: src/components/chat/, src/components/ai-elements/
  Skills: ai-elements, brand-guide

Agent C — Tests
  Scope: tests/unit/agents/, tests/component/chat/
  Skills: test-suite

Agent D — Documentation
  Scope: ARCHITECTURE.md, TSDoc, pnpm docs
  Skills: docs-maintenance, commit-docs
```

### Coordination

- **A and B**: Run in parallel (no dependencies)
- **C**: Start in parallel — scaffold test structure early, fill assertions after A completes
- **D**: Runs after A and B complete (needs final exports for TSDoc)

### Pre-Merge Gate

All agents must pass before merging:
```bash
pnpm lint && pnpm run typecheck && pnpm test && pnpm docs
```

## Quick Reference

| Resource | Path |
|----------|------|
| AI SDK docs | `docs/ai-sdk/` |
| AI Gateway docs | `docs/ai-gateway/` |
| AI Elements docs | `docs/ai-elements/` |
| AI SDK skill | `.claude/skills/ai-sdk/SKILL.md` |
| AI Elements skill | `.claude/skills/ai-elements/SKILL.md` |
| Test suite skill | `.claude/skills/test-suite/SKILL.md` |
| Brand guide | `.claude/skills/brand-guide/SKILL.md` |
