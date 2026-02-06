# Team Infrastructure

How quality is enforced in this project — git hooks, Claude skills, Storybook, and CI.

---

## Git Hooks

All hooks live in `.husky/` and run automatically via [Husky](https://typicode.github.io/husky/). No setup needed — `pnpm install` enables them via the `prepare` script.

Every hook gives a clear failure message explaining what went wrong and how to fix it.

### pre-commit

**Runs on**: Every `git commit`
**What it does**: Runs `lint-staged` on staged `src/**/*.{ts,tsx}` files

| Check | Tool | What it catches |
|-------|------|-----------------|
| ESLint | `eslint --max-warnings 0` | Missing TSDoc, code quality issues |
| Related tests | `vitest related --run` | Tests broken by your staged changes |

**If it fails**: You'll see `COMMIT BLOCKED: lint-staged failed` with instructions to run `pnpm lint` or `pnpm test`.

### commit-msg

**Runs on**: Every `git commit`
**What it does**: Validates commit message format via [commitlint](https://commitlint.js.org/)

**Required format**:
```
type(scope): description
```

**Valid types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**If it fails**: You'll see `COMMIT BLOCKED: Bad commit message` with the valid types and examples.

**Config**: `commitlint.config.mjs` — 100-char header max, conventional types only.

### pre-push

**Runs on**: Every `git push`
**What it does**: Three sequential checks

| Step | Command | What it catches |
|------|---------|-----------------|
| 1/3 | `pnpm run typecheck` | TypeScript errors in source AND test files |
| 2/3 | `pnpm test:coverage` | Failing tests, coverage below 60% lines |
| 3/3 | `pnpm docs` | TypeDoc build failures (missing TSDoc on exports) |

**If it fails**: You'll see exactly which step failed (`PUSH BLOCKED: TypeScript errors` / `Tests failed or coverage too low` / `TypeDoc build failed`) with the fix command.

**Why coverage is in pre-push**: This prevents shipping new code without tests. If you add 100 lines and 0 tests, coverage drops, push is blocked.

### post-merge

**Runs on**: After `git pull` or `git merge`
**What it does**: Detects if `pnpm-lock.yaml` changed and auto-runs `pnpm install --frozen-lockfile`

**Why**: Prevents "it works on my machine" issues from stale dependencies.

---

## TypeScript Configuration

Two separate tsconfig files prevent test-specific types from leaking into source code.

| File | Scope | Types |
|------|-------|-------|
| `tsconfig.json` | Source code (`src/`, `next-env.d.ts`) | Default (DOM, ESNext) |
| `tsconfig.test.json` | Test files (`tests/`) | Adds `vitest/globals`, `@testing-library/jest-dom` |

The `typecheck` script runs both: `tsc --noEmit && tsc --noEmit -p tsconfig.test.json`

---

## Claude Skills

Skills are `.md` instruction files that teach Claude how to work on this project. They live in `.claude/skills/` and are indexed in `CLAUDE.md`.

Skills are **guidance, not enforcement**. Claude reads them when relevant tasks come up. The git hooks handle enforcement.

### Skill inventory

| Skill | Path | Purpose |
|-------|------|---------|
| **commit-docs** | `.claude/skills/commit-docs/SKILL.md` | Pre-commit documentation checklist, conventional message format, examples |
| **ai-team** | `.claude/skills/ai-team/SKILL.md` | AI feature development — architecture map, tool inventory, 4-agent spawn pattern |
| **feature-testing** | `.claude/skills/feature-testing/SKILL.md` | Feature development with parallel test agents, coverage expectations |
| **test-suite** | `.claude/skills/test-suite/SKILL.md` | Test commands, fixtures, mock patterns, coverage gates |
| **docs-maintenance** | `.claude/skills/docs-maintenance/SKILL.md` | TSDoc enforcement, ARCHITECTURE.md sync |

### How skills work with hooks

```
Claude reads skill  -->  Writes code following standards
                              |
                         git commit
                              |
                    pre-commit hook enforces ESLint/TSDoc
                    commit-msg hook enforces message format
                              |
                          git push
                              |
                    pre-push hook enforces typecheck + coverage + docs
```

The skills tell Claude **what** to do. The hooks ensure it **actually happened**.

### AI team spawn pattern

When building AI features, the ai-team skill tells Claude to spawn 4 parallel agents:

| Agent | Scope | Runs when |
|-------|-------|-----------|
| A — Tool & Agent Logic | `src/lib/agents/`, `src/app/api/chat/` | Immediately |
| B — Chat UI & Components | `src/components/chat/`, `src/components/ai-elements/` | Immediately (parallel with A) |
| C — Tests | `tests/unit/agents/`, `tests/component/chat/` | Immediately (scaffolds early, fills after A) |
| D — Documentation | `ARCHITECTURE.md`, TSDoc, `pnpm docs` | After A and B complete |

---

## Storybook

Visual component testing in isolation. Renders components outside the app with different props, states, and themes.

### Commands

| Command | What it does |
|---------|-------------|
| `pnpm storybook` | Start dev server on `localhost:6006` |
| `pnpm build-storybook` | Build static site to `storybook-static/` |
| `pnpm check-stories` | List components missing stories (warning, not blocker) |

### Config

| File | Purpose |
|------|---------|
| `.storybook/main.ts` | Stories glob, react-vite framework, `@/` path alias, addons |
| `.storybook/preview.ts` | Global CSS, dark/light theme decorator, toolbar theme switcher |

### Current coverage

6/24 components have stories. Run `pnpm check-stories` to see which are missing.

### Existing stories

| Story file | Component | Variants |
|-----------|-----------|----------|
| `src/components/chat/event-card.stories.tsx` | EventCard | Default, free, featured, tech, food, sports |
| `src/components/chat/chat-trigger.stories.tsx` | ChatTrigger | Open, closed |
| `src/components/chat/map-action.stories.tsx` | MapAction | flyTo, highlight, fitBounds |
| `src/components/effects/sparkle.stories.tsx` | Sparkle | Active, inactive, custom count |
| `src/components/chat/newsletter-card.stories.tsx` | NewsletterCard | Default, multiple items, empty |
| `src/components/theme-toggle.stories.tsx` | ThemeToggle | Default (dark) |

### Writing a new story

Create a `.stories.tsx` file next to the component:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MyComponent } from "./my-component";

const meta: Meta<typeof MyComponent> = {
  title: "Category/MyComponent",
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: { /* props */ },
};
```

For components that need context (map, theme), use decorators:

```tsx
decorators: [
  (Story) => (
    <SomeProvider>
      <Story />
    </SomeProvider>
  ),
],
```

---

## What's Enforced vs Guidance

| Standard | Enforced? | How |
|----------|-----------|-----|
| TSDoc on exports | Yes | ESLint `jsdoc/require-jsdoc` rule, pre-commit hook |
| Conventional commit messages | Yes | Commitlint, commit-msg hook |
| TypeScript correctness | Yes | `tsc --noEmit`, pre-push hook |
| Tests pass | Yes | `vitest run`, pre-push hook |
| Coverage above 60% | Yes | `vitest --coverage`, pre-push hook |
| TypeDoc builds | Yes | `pnpm docs`, pre-push hook |
| Dependencies stay in sync | Yes | post-merge hook |
| ARCHITECTURE.md updates | No | commit-docs skill (guidance) |
| Writing tests for new features | Partially | Coverage threshold catches big gaps; skill guides the rest |
| Writing stories for components | No | `check-stories` script (warning only) |
| Agent team coordination | No | ai-team / feature-testing skills (guidance) |
| Push frequency | No | CLAUDE.md reminders (guidance) |

---

## Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start Next.js dev server |
| `build` | `next build` | Production build |
| `lint` | `eslint` | Run ESLint |
| `typecheck` | `tsc --noEmit && tsc --noEmit -p tsconfig.test.json` | TypeScript check (source + tests) |
| `test` | `vitest run` | Run all tests |
| `test:coverage` | `vitest run --coverage` | Tests with coverage report |
| `test:unit` | `vitest run tests/unit` | Unit tests only |
| `test:component` | `vitest run tests/component` | Component tests only |
| `test:e2e` | `playwright test` | End-to-end tests |
| `test:all` | `vitest run && playwright test` | Unit + E2E |
| `docs` | `typedoc` | Build API documentation |
| `storybook` | `storybook dev -p 6006` | Start Storybook |
| `build-storybook` | `storybook build` | Build static Storybook |
| `check-stories` | `sh scripts/check-stories.sh` | List components missing stories |

---

## Extending This Setup

### To add a new enforced check

1. Add the check command to the appropriate hook in `.husky/`
2. Wrap it with an `if [ $? -ne 0 ]` block that prints a clear failure message
3. Include "How to fix" instructions in the message
4. Document it in this file

### To add a new skill

1. Create `.claude/skills/your-skill/SKILL.md`
2. Add the entry to `CLAUDE.md` under the appropriate tier
3. Document it in this file
