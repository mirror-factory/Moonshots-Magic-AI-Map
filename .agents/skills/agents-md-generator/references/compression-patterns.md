# Compression Patterns & Best Practices

Based on Vercel's research: AGENTS.md with 8KB compressed index achieved 100% pass rate vs 79% for skills with explicit instructions vs 53% for skills with default behavior.

## Why Passive Context Beats Active Retrieval

1. **No decision point** — Agent never decides "should I look this up?" Information is already present.
2. **Consistent availability** — Present on every turn, no async loading.
3. **No ordering issues** — No sequencing decisions about when to read docs vs explore project.

Key stat: In 56% of eval cases, skills were never invoked even when available.

## Pipe-Delimited Compression Format

### Basic Structure

```
[Section Label]|root: ./path-to-docs
|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any [topic] tasks.
|subdir/path:{file1.md,file2.md,file3.mdx}
```

### With Titles (for larger doc sets)

```
|routing:{defining-routes.mdx:Defining Routes,dynamic-routes.mdx:Dynamic Routes}
```

### Skills Index Format

```
[Skills Index]
|IMPORTANT: When a skill is relevant, read its SKILL.md BEFORE writing code or creating files.

|skill-name|/path/to/skill
|  desc: Truncated description of what the skill does...
|  contains: scripts/,references/,assets/
|  size: 67KB (8 files)
```

## Compression Targets

From Vercel's research:
- **40KB → 8KB** (80% reduction) maintained 100% pass rate
- Target: Index should be **under 10KB** for a single framework's docs
- Multiple indexes can coexist (e.g., Next.js + Supabase + Vercel AI SDK)

## The Critical Instruction

Always include this line at the top and within each docs section:

```
IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning.
```

This instructs the agent to consult docs rather than rely on potentially outdated training data. Without this instruction, agents may ignore the index entirely.

## Multi-Framework Example

```markdown
# AGENTS.md

IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning.

## Project Instructions
- Use TypeScript strict mode
- All components use React Server Components by default
- Database queries go through Supabase client

## Skills
[Skills Index]
|IMPORTANT: When a skill is relevant, read its SKILL.md BEFORE writing code or creating files.

|vercel-ai-sdk-gateway|./skills/vercel-ai-sdk-gateway
|  desc: Build AI applications using Vercel AI SDK with AI Gateway...
|  contains: SKILL.md,references/,scripts/
|  size: 67KB (8 files)

|hubspot-form-styling|./skills/hubspot-form-styling
|  desc: Style HubSpot forms with proper CSS selectors...
|  contains: SKILL.md,references/
|  size: 39KB (3 files)

## Next.js 16 Docs
[Next.js Docs Index]|root: ./.next-docs
|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Next.js tasks.
|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx}
|01-app/02-building-your-application/01-routing:{01-defining-routes.mdx,02-pages.mdx}

## Vercel AI SDK Docs
[Vercel AI SDK Docs Index]|root: ./.ai-sdk-docs
|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Vercel AI SDK tasks.
|core:{generate-text.md,stream-text.md,generate-object.md}
|providers:{ai-gateway.md,anthropic.md,openai.md}
```

## Firecrawl → AGENTS.md Pipeline

```bash
# 1. Crawl docs
python crawl_docs.py https://sdk.vercel.ai/docs \
    --output ./.ai-sdk-docs \
    --label "Vercel AI SDK" \
    --max-pages 200

# 2. Generate AGENTS.md with skills + docs
python generate_agents_md.py \
    --skills-dir ./skills \
    --docs-dir ./.ai-sdk-docs "Vercel AI SDK" \
    --docs-dir ./.next-docs "Next.js 16" \
    --instruction "Use TypeScript strict mode" \
    --output AGENTS.md
```

## When to Use Skills vs AGENTS.md Index

| Use Case | Approach |
|---|---|
| General framework knowledge | AGENTS.md docs index |
| Specific migration/upgrade workflows | Skills |
| Version-matched API docs | AGENTS.md with version-matched docs |
| Complex multi-step tasks (e.g., "upgrade Next.js") | Skills |
| Code generation using current APIs | AGENTS.md docs index |
| Horizontal knowledge (applies to all tasks) | AGENTS.md |
| Vertical workflows (user-triggered actions) | Skills |

The two approaches are complementary. AGENTS.md ensures the agent always has a map of available knowledge. Skills provide deep, procedural expertise for specific workflows.
