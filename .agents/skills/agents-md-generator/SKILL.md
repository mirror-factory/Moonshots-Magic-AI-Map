---
name: agents-md-generator
description: Generate AGENTS.md or CLAUDE.md files with compressed documentation indexes and skill maps for AI coding agents. Use when asked to create, update, or optimize an AGENTS.md or CLAUDE.md file, when setting up passive context for coding agents, when compressing skills or documentation into agent-readable indexes, when integrating Firecrawl output into agent context files, or when optimizing how AI agents access framework/library documentation. Triggers on "create AGENTS.md", "generate CLAUDE.md", "compress docs for agents", "set up agent context", "index my skills", "Firecrawl to AGENTS.md", "agent documentation setup", or any request to make AI coding agents more effective at using project-specific knowledge.
---

# AGENTS.md Generator

Generate compressed context files (AGENTS.md / CLAUDE.md) that give AI coding agents persistent access to skills, documentation, and project knowledge.

## Why This Exists

Vercel's research found that passive context (AGENTS.md) achieves 100% eval pass rate vs 79% for skills with explicit instructions vs 53% for skills alone. Agents fail to invoke skills 56% of the time. Embedding a compressed docs index eliminates the decision point entirely.

**Key principle:** Prefer retrieval-led reasoning over pre-training-led reasoning. The agent consults local docs instead of relying on potentially outdated training data.

## Core Workflow

### Step 1: Identify Sources

Gather what needs to be indexed:
- **Skills directories** — Extract name, description, file structure from each SKILL.md
- **Documentation directories** — From Firecrawl crawls, manual downloads, or framework doc repos
- **Project instructions** — Coding standards, architecture rules, conventions

### Step 2: Generate the File

Use `scripts/generate_agents_md.py`:

```bash
python scripts/generate_agents_md.py \
    --skills-dir /path/to/skills \
    --docs-dir /path/to/docs "Label for Docs" \
    --instruction "Use TypeScript strict mode" \
    --output AGENTS.md
```

Key flags:
- `--skills-dir` (repeatable): Directories containing skills to index
- `--docs-dir PATH LABEL` (repeatable): Docs directory + label
- `--instruction` (repeatable): Project-level instructions
- `--format agents|claude`: Output format (AGENTS.md or CLAUDE.md)
- `--append`: Add to existing file instead of overwriting

### Step 3: Crawl Documentation (Optional)

Use Firecrawl to crawl any docs site, then compress:

```bash
# Crawl and organize
python scripts/crawl_docs.py https://sdk.vercel.ai/docs \
    --output ./.ai-sdk-docs \
    --label "Vercel AI SDK" \
    --max-pages 200

# Or crawl + compress in one step
python scripts/crawl_docs.py https://sdk.vercel.ai/docs \
    --output ./.ai-sdk-docs \
    --compress
```

Supports `--from-json` to use existing Firecrawl JSON output.

### Step 4: Compress Standalone Docs

Use `scripts/compress_docs.py` for standalone compression:

```bash
python scripts/compress_docs.py ./docs "My Docs" --output index.md --extract-titles
```

`--extract-titles` reads markdown frontmatter/headings for richer indexes.
`--dry-run` shows compression stats without writing.

## Compression Format

The pipe-delimited format achieves ~80% compression while maintaining 100% pass rate:

```
[Label]|root: ./path
|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any [topic] tasks.
|subdir:{file1.md,file2.md}
```

Target: **under 10KB per framework index**. Multiple indexes coexist in one file.

## When to Generate

- Setting up a new project with AI-assisted development
- Adding a new framework/library to the stack
- After crawling updated documentation with Firecrawl
- When skills aren't being picked up reliably by agents
- When agents generate code using outdated APIs

## Key Design Decisions

1. **Always include** the retrieval-led reasoning instruction — without it, agents ignore the index
2. **Skills and AGENTS.md are complementary** — AGENTS.md provides the map, skills provide deep procedural knowledge
3. **Compress aggressively** — An index pointing to files works as well as full content in context
4. **Version-match docs** — Download docs matching your project's framework version, not latest

For detailed compression patterns and examples, see `references/compression-patterns.md`.
