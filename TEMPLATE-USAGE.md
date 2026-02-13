# Documentation Template Usage Guide

This directory contains reusable templates for setting up AI SDK documentation across projects.

## Files

- **CLAUDE.template.md** - Full-featured project instructions with documentation registry
- **AGENTS.template.md** - Compressed documentation index for AI agents

## Quick Start

### 1. Copy Templates to New Project

```bash
# In your new project root
cp /path/to/CLAUDE.template.md ./CLAUDE.md
cp /path/to/AGENTS.template.md ./AGENTS.md
```

### 2. Copy Documentation Files

Ensure your new project has the AI SDK docs in the same structure:

```bash
# Copy the entire docs directory structure
cp -r /path/to/docs ./docs
```

Your new project should have:
```
your-new-project/
├── CLAUDE.md           # Copied from template
├── AGENTS.md           # Copied from template
└── docs/
    ├── ai-sdk/         # AI SDK documentation
    ├── ai-gateway/     # AI Gateway documentation
    └── ai-elements/    # AI Elements documentation
```

### 3. Customize Project-Specific Sections

Open `CLAUDE.md` and customize sections marked with `<!-- 🔧 CUSTOMIZE -->`:

#### A. Project Instructions
```markdown
## Project Instructions

- **Stack**: Next.js 15, React 19, TypeScript, Supabase
- **Package manager**: pnpm
- **Patterns**: Server Components, composable architecture
- **Code style**: Functional programming, strict TypeScript
- **Testing**: Vitest + Playwright, test before push
- **Commit hygiene**: Small commits, conventional messages
- **Security**: Validate at boundaries, OWASP compliance
```

#### B. Skills Registry
```markdown
## Skills

[Skills Index]

### Tier 1 — Core

|my-core-skill|.claude/skills/my-core-skill
|  desc: Core functionality for this project
|  contains: SKILL.md
|  size: ~8KB (1 file)
```

#### C. Documentation Rules
```markdown
## Documentation Rules

- Every exported function MUST have TSDoc
- Run `pnpm docs` after adding new exports
- Pre-commit hook validates documentation
```

### 4. Customize AGENTS.md

Update the compressed version with your project specifics:

```markdown
## Quick Reference

**Stack**: Next.js 15, React 19, TypeScript, Supabase
**Package Manager**: pnpm
**Test Command**: pnpm test
**Build Command**: pnpm build
```

## What's Preserved (Don't Change)

These sections contain the AI SDK documentation registry and should **NOT** be modified:

### In CLAUDE.md:
- `## Vercel AI SDK Docs` - Complete AI SDK index
- `## AI Gateway Docs` - AI Gateway index
- `## AI Elements Docs` - AI Elements components index

### In AGENTS.md:
- `### AI SDK Docs` - AI SDK index
- `### AI Gateway Docs` - AI Gateway index
- `### AI Elements Docs` - AI Elements index

## Documentation Structure

The templates expect this standard structure:

```
docs/
├── ai-sdk/
│   ├── 00-introduction/
│   ├── 02-foundations/
│   ├── 02-getting-started/
│   ├── 03-agents/
│   ├── 03-ai-sdk-core/
│   ├── 04-ai-sdk-ui/
│   ├── 05-ai-sdk-rsc/
│   ├── 06-advanced/
│   ├── 07-reference/
│   ├── 08-migration-guides/
│   └── 09-troubleshooting/
├── ai-gateway/
│   ├── 01-getting-started.md
│   ├── 02-models-and-providers.md
│   ├── 03-provider-options.md
│   └── 04-model-fallbacks.md
└── ai-elements/
    ├── index.mdx
    ├── usage.mdx
    ├── troubleshooting.mdx
    ├── components/
    │   ├── chatbot/
    │   ├── code/
    │   ├── utilities/
    │   ├── voice/
    │   └── workflow/
    └── examples/
```

## Benefits

1. **Retrieval-led reasoning** - AI agents consult local docs before relying on pre-training
2. **Consistency** - Same documentation structure across all projects
3. **Up-to-date** - Local docs reflect the exact SDK version you're using
4. **Compressed indexes** - AI agents can quickly navigate large documentation sets
5. **Reusable** - Drop templates into any new project using AI SDK

## Maintenance

### Updating Documentation
When AI SDK releases new versions:

1. Update docs in `docs/ai-sdk/`
2. Update the registry index if file structure changes
3. Propagate changes to other projects using the templates

### Adding New Sections
To add new documentation sections:

1. Add files to `docs/your-section/`
2. Add a new registry section in both templates:
   ```markdown
   ## Your New Docs

   [Your Docs Index]
   |root: ./docs/your-section
   |{file1.mdx,file2.mdx,file3.mdx}
   ```

## Example Projects

Projects using this template structure:

- **Moonshots & Magic** - AI event discovery map
- [Add your projects here]

## Tips

1. **Keep docs synced** - When you update AI SDK, update docs across all projects
2. **Use symbolic links** - Consider symlinking `docs/` across projects if they share the same SDK version
3. **Version control** - Commit templates to version control for easy updates
4. **Skills directory** - Create `.claude/skills/` for project-specific skills
5. **Test coverage** - Add test documentation to the registry as your test suite grows

## Questions?

See `.claude/skills/agents-md-generator/SKILL.md` for advanced registry patterns.
