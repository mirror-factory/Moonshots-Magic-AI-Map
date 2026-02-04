# Documentation Maintenance Skill

Enforces documentation standards across the codebase. This skill should be consulted whenever files in `src/` are created or modified.

## When to Trigger

- Any time a file in `src/` is created, renamed, moved, or deleted
- When adding new exports (functions, types, interfaces, components, constants)
- When modifying the public API of an existing export
- When adding new skills or documentation sections

## TSDoc Rules

### Every Export Gets a Comment

Every exported function, type, interface, component, and constant **must** have a TSDoc comment.

### Module-Level Comments

Every file in `src/` must start with a `@module` TSDoc block describing the file's purpose:

```ts
/**
 * @module path/to/module
 * Brief description of what this module does.
 */
```

For `"use client"` files, place the TSDoc block **before** the directive.

### Function Documentation

Exported functions must include `@param` and `@returns` tags:

```ts
/**
 * Brief description of what the function does.
 *
 * @param name - Description of parameter.
 * @returns Description of return value.
 */
```

### Examples on Public API Functions

Registry query functions and other public API functions should include `@example` blocks:

```ts
/**
 * @example
 * ```ts
 * const events = getEvents({ category: "music", limit: 5 });
 * ```
 */
```

### Interface Fields

Interface fields that aren't self-explanatory should have inline `/** */` comments:

```ts
interface Example {
  /** ISO 8601 timestamp. */
  createdAt: string;
}
```

## ARCHITECTURE.md Sync

When files are added, removed, or renamed in `src/`:

1. Update the **Directory Map** section in `ARCHITECTURE.md`
2. Update the **Component Architecture** section if components change
3. Update **Adding New Features** if new patterns are introduced

## TypeDoc Verification

After making changes that add or modify exports:

1. Run `pnpm docs`
2. Fix any TypeDoc warnings (missing documentation, broken links)
3. Verify new exports appear in `docs/generated/`

## CLAUDE.md Sync

When adding new skills or documentation sections:

1. Add the skill entry to the Skills index in `CLAUDE.md`
2. Include: skill name, path, description, contents, and approximate size

## Pre-Completion Checklist

Before marking any code task as complete, verify:

- [ ] All new exports have TSDoc comments
- [ ] New files have `@module` TSDoc blocks
- [ ] ARCHITECTURE.md directory map is still accurate
- [ ] `pnpm docs` runs without errors
- [ ] Any new conventions are documented in ARCHITECTURE.md
- [ ] CLAUDE.md skills index is up to date (if skills changed)
