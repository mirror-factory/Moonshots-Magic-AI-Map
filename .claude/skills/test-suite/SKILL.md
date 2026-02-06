# Test Suite Skill

Automated testing infrastructure for Moonshots & Magic. Vitest for unit/component tests, Playwright for E2E.

## Quick Commands

| Command | What it does |
|---------|-------------|
| `pnpm test` | Run all unit + component tests once |
| `pnpm test:watch` | Watch mode — re-runs on file changes |
| `pnpm test:coverage` | Run with v8 coverage (60% line threshold) |
| `pnpm test:unit` | Unit tests only (`tests/unit/`) |
| `pnpm test:component` | Component tests only (`tests/component/`) |
| `pnpm test:e2e` | Playwright E2E (requires `playwright install chromium`) |
| `pnpm test:all` | Full pipeline: vitest + playwright |

## Test File Placement

| Test type | Directory | Naming | When to use |
|-----------|-----------|--------|-------------|
| Pure logic | `tests/unit/<domain>/` | `*.test.ts` | Registry functions, utilities, data transforms, agent tools |
| Components | `tests/component/<domain>/` | `*.test.tsx` | React components with rendering assertions |
| API routes | `tests/integration/api/` | `*-route.test.ts` | Next.js route handlers (GET/POST) |
| User flows | `e2e/` | `*.spec.ts` | Full browser journeys with Playwright |

## Fixture Factories

All fixtures are in `tests/fixtures/`. Import and use `overrides` for customization:

```ts
import { createTestEvent } from "@/../../tests/fixtures/events";
import { createTestNewsletter } from "@/../../tests/fixtures/newsletters";
import { createTestProfile } from "@/../../tests/fixtures/profiles";

// Default event
const event = createTestEvent();

// Override specific fields
const freeEvent = createTestEvent({ isFree: true, price: "Free" });

// Full diverse set (6 events across categories)
import { createTestEventSet } from "@/../../tests/fixtures/events";
const events = createTestEventSet();
```

## AI SDK Testing Patterns

### Server-side tools (have `execute`)

```ts
import { searchEvents } from "@/lib/agents/tools/search-events";

const result = await searchEvents.execute({ query: "music", limit: 5 }, {
  toolCallId: "test", messages: [], abortSignal: new AbortController().signal,
});
expect(result.events).toHaveLength(5);
```

### Client-side tools (no `execute` — mapNavigate, getUserProfile, etc.)

```ts
import { mapNavigate } from "@/lib/agents/tools/map-navigate";

// Test via JSON schema shape inspection
expect(mapNavigate.inputSchema).toBeDefined();

// Or use underlying Zod schema with safeParse
import { z } from "zod";
const schema = z.object({ action: z.string(), coordinates: z.array(z.number()) });
expect(schema.safeParse({ action: "flyTo", coordinates: [-81.37, 28.54] }).success).toBe(true);
```

### ToolLoopAgent testing

```ts
import { createEventAgent } from "@/lib/agents/event-agent";

const agent = createEventAgent();
// Properties live on agent.settings (NOT directly on agent)
expect(agent.settings.instructions).toContain("event discovery");
expect(agent.settings.stopWhen).toBeDefined();
// Tools accessible via prototype getter
expect(Object.keys(agent.tools)).toHaveLength(8);
```

### MockLanguageModelV3 (optional, for full agent execution tests)

```ts
import { MockLanguageModelV3 } from "ai/test";

const mockModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    text: "Here are events near you",
    toolCalls: [],
    finishReason: "stop",
    usage: { promptTokens: 10, completionTokens: 20 },
  }),
});
```

## Component Test Mocking

Common mocks needed for jsdom environment:

```tsx
// Mock motion/react (framer-motion)
vi.mock("motion/react", () => ({
  motion: { div: "div", span: "span", button: "button" },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock UI components from shadcn
vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));
```

## E2E Patterns

Seed localStorage before each test to skip intro modal:

```ts
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("moonshots_intro_seen", "true");
  });
});
```

## Coverage Gate

The coverage threshold is enforced at 60% line coverage for included files:
- `src/lib/**` — all library code
- `src/components/chat/event-card.tsx`, `chat-trigger.tsx`, `map-action.tsx` — tested chat components
- `src/components/effects/sparkle.tsx` — tested effect

Excluded from coverage (require browser APIs or are orchestrating components):
- `src/components/ui/**`, `src/components/ai-elements/**` — third-party/generated
- `src/components/map/**` — requires MapLibre GL
- `src/lib/voice/**` — requires Web Speech API
- `src/lib/flyover/camera-animator.ts`, `flyover-audio.ts` — require MapLibre/Audio APIs
- `src/components/chat/chat-panel.tsx` — orchestrating component (590 lines)

## Pre-commit Integration

`lint-staged` runs `vitest related --run` on changed `src/**/*.{ts,tsx}` files. This only executes tests that import the changed files, keeping commits fast.

## CI Workflow

`.github/workflows/test.yml` runs on push/PR to main:
1. **Unit job**: `pnpm test:coverage` — uploads coverage artifact
2. **E2E job**: builds app, installs Playwright, runs `pnpm test:e2e` — uploads report artifact
