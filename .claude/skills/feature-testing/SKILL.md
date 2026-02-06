# Feature Development with Test Coverage

## When to Use

Any new user-facing feature, component, tool, or page.

## When to Spawn Team vs Single Agent

- **Team (2+ directories affected)**: New feature, new page, new tool with UI
- **Single agent**: Bug fix, config change, single-file refactor

## Team Structure

```
Agent A — Implementation
  Scope: src/ files
  Standards: TypeScript strict, TSDoc on all exports, @module blocks on new files

Agent B — Unit & Component Tests
  Scope: tests/unit/, tests/component/
  Standards: Fixture factories, mock patterns from tests/setup.ts

Agent C — Visual / Storybook Tests
  Scope: src/**/*.stories.tsx
  Standards: Light + dark variants, all prop combinations, Chrome MCP visual QA

Agent D — Documentation
  Scope: ARCHITECTURE.md, CLAUDE.md skill index, TSDoc, pnpm docs
  Standards: Directory map sync, skill size updates
```

## Coordination Protocol

1. **A + B**: Start in parallel. B scaffolds test files and writes happy-path tests immediately; fills edge cases after A stabilizes the API
2. **C**: Starts after A completes (needs rendered components)
3. **D**: Starts after A + B complete (needs final exports and test results)

## Pre-Completion Gate

Every feature must pass before being considered done:

```bash
pnpm lint && pnpm run typecheck && pnpm test && pnpm docs
```

## Coverage Expectations

| Feature Type | Unit Tests | Component Tests | Stories | Docs |
|-------------|-----------|----------------|---------|------|
| Tool (server) | Input validation, execute logic, edge cases | N/A | N/A | TSDoc, ARCHITECTURE.md |
| Tool (client) | Schema shape, Zod safeParse | Tool rendering component | Tool result story | TSDoc, ARCHITECTURE.md |
| Component | Props, callbacks, conditional rendering | User interaction, accessibility | All variants (light/dark) | TSDoc, @module block |
| Page/Route | N/A | N/A | N/A | ARCHITECTURE.md route map |
| Lib/Utility | Pure function I/O, edge cases | N/A | N/A | TSDoc, @example |
| Full feature | All of the above | All of the above | All of the above | All of the above |

## Prerequisite Skills

- **test-suite** — `.claude/skills/test-suite/SKILL.md` (test commands, fixtures, mocks)
- **ai-team** — `.claude/skills/ai-team/SKILL.md` (if AI feature)
- **docs-maintenance** — `.claude/skills/docs-maintenance/SKILL.md` (TSDoc enforcement)
- **commit-docs** — `.claude/skills/commit-docs/SKILL.md` (commit standards)

## Testing Patterns Reference

- **Fixture factories**: `tests/fixtures/` — `createTestEvent()`, `createTestNewsletter()`, `createTestProfile()`
- **Mock motion/react**: Simple div/span/button passthrough (see `tests/setup.ts`)
- **Mock shadcn components**: HTML element passthrough
- **Mock useMap**: Return null for map-dependent components
- **Mock AI SDK**: `MockLanguageModelV3` from `ai/test`
- **E2E**: Playwright with Chromium, localStorage seed for intro skip
