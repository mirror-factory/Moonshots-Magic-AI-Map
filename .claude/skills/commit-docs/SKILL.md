# Commit Documentation Standards

## When to Trigger

Every commit that touches `src/` files. This skill is the commit-time checkpoint; `docs-maintenance` is the broader task-level standard.

## Pre-Commit Documentation Checklist

Before committing, verify ALL of the following:

1. **TSDoc on all new/modified exports** — every exported function, type, component, and interface must have a TSDoc comment with `@param`, `@returns`, and `@example` where applicable
2. **`@module` block on new files** — every new `src/` file starts with a `@module` TSDoc block describing the file's purpose
3. **ARCHITECTURE.md directory map** — if files were added or removed, update the directory map in `ARCHITECTURE.md`
4. **TypeDoc builds clean** — run `pnpm docs` and verify no errors
5. **Conventional commit message** — follow the format below
6. **Commit body describes WHY** — not just what changed

## Commit Message Format

```
type(scope): concise subject (imperative mood, <100 chars)

- What changed and why
- Any breaking changes or migration notes

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types

| Type | Use When |
|------|----------|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `docs` | Documentation only (TSDoc, ARCHITECTURE.md, README) |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructure (no behavior change) |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI/CD pipeline changes |
| `chore` | Maintenance (config, tooling) |
| `revert` | Reverting a previous commit |

### Scope Examples

`feat(chat)`, `fix(agents)`, `docs(architecture)`, `test(flyover)`, `build(deps)`

## Good vs Bad Examples

**Good:**
```
feat(chat): add tappable option buttons for clarifying questions

- Renders QUESTION/OPTIONS format as interactive buttons
- Buttons send selected option as user message
- Styled with brand-primary color and hover states
```

**Bad:**
```
update chat stuff
```
```
fix things
```
```
WIP
```

## Enforcement

- **Pre-commit hook**: `lint-staged` runs `eslint --max-warnings 0` on staged `src/**/*.{ts,tsx}` — catches missing TSDoc via `eslint-plugin-jsdoc`
- **Commit-msg hook**: `commitlint` rejects non-conventional messages
- **Pre-push hook**: Full `typecheck` + `test` suite

## Relationship to Other Skills

- **docs-maintenance**: Broader documentation standards for any task touching `src/`
- **test-suite**: Testing standards — run `pnpm test` before committing
- **ai-team**: If committing AI feature work, follow the agent team coordination protocol
