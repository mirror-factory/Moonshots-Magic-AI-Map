# CLAUDE.md

IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning. Consult local docs and skill references before relying on training data.

> REMINDER: Push early, push often. Commit after each completed unit of work — every new function, test, or component. The pre-push hook runs typecheck + full test suite. Small pushes catch issues early and keep the CI pipeline validating every iteration.

## Project Instructions

- **Stack**: Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase, Vercel AI SDK
- **Package manager**: pnpm (npm fallback)
- **Patterns**: Functional programming, React Server Components by default, composable component architecture
- **Code style**: Self-documenting code, small focused functions, meaningful names, TypeScript strict mode
- **Testing**: Test locally before pushing, lint before commits
- **Commit hygiene**: Commit often and small — husky pre-commit hook runs lint-staged on every commit, catching missing TSDoc early
- **Security**: Validate inputs at system boundaries, escape outputs, follow OWASP top 10

## Skills

[Skills Index]
|IMPORTANT: When a skill is relevant, read its SKILL.md BEFORE writing code or creating files.

### Tier 1 — Core

|brand-guide|.claude/skills/brand-guide
|  desc: Moonshots & Magic brand identity — colors, typography, animations, textures, logo specs, image generation prompts.
|  contains: SKILL.md,references/
|  size: ~12KB (3 files)

|ai-sdk|.claude/skills/ai-sdk
|  desc: AI SDK functions (generateText, streamText, ToolLoopAgent, embed, useChat). Build agents, chatbots, RAG, structured output.
|  contains: SKILL.md,references/
|  size: 32KB (4 files)

|ai-elements|.claude/skills/ai-elements
|  desc: AI chat interface components — composable patterns, shadcn/ui integration, Vercel AI SDK conventions.
|  contains: SKILL.md,references/,scripts/
|  size: 1.1MB (130 files)

|ai-team|.claude/skills/ai-team
|  desc: Composite AI feature development — orchestrates AI SDK + AI Elements + AI Gateway. Agent team spawn patterns for parallel AI feature work.
|  contains: SKILL.md
|  size: ~8KB (1 file)

|next-best-practices|.claude/skills/next-best-practices
|  desc: Next.js file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling.
|  contains: SKILL.md,async-patterns.md,bundling.md,data-patterns.md,debug-tricks.md,directives.md,error-handling.md,file-conventions.md,font.md,functions.md,hydration-error.md,image.md,metadata.md,parallel-routes.md,route-handlers.md,rsc-boundaries.md,runtime-selection.md,scripts.md,self-hosting.md,suspense-boundaries.md
|  size: 120KB (20 files)

### Tier 2 — Architecture

|vercel-react-best-practices|.claude/skills/vercel-react-best-practices
|  desc: React/Next.js performance optimization from Vercel Engineering. Components, data fetching, bundle optimization.
|  contains: SKILL.md,AGENTS.md,rules/
|  size: 364KB (59 files)

|vercel-composition-patterns|.claude/skills/vercel-composition-patterns
|  desc: React composition patterns — compound components, render props, context providers. Refactoring boolean prop proliferation.
|  contains: SKILL.md,AGENTS.md,rules/
|  size: 64KB (10 files)

|next-cache-components|.claude/skills/next-cache-components
|  desc: Next.js 16 Cache Components — PPR, use cache directive, cacheLife, cacheTag, updateTag.
|  contains: SKILL.md
|  size: 8KB (1 file)

|sync-events|.claude/skills/sync-events
|  desc: Event sync pipeline — sources (Ticketmaster, Eventbrite, SerpAPI, scrapers), normalizers, dedup, output to events.json. URL validation via Chrome MCP tools with persistent results tracking.
|  contains: SKILL.md
|  size: ~6KB (1 file)

|test-suite|.claude/skills/test-suite
|  desc: Vitest + Playwright testing — commands, file placement, fixtures, AI SDK mock patterns, coverage gates.
|  contains: SKILL.md
|  size: 4KB (1 file)

|feature-testing|.claude/skills/feature-testing
|  desc: Feature development with parallel agent teams — implementation, unit tests, visual tests, documentation. Ensures every feature gets test coverage.
|  contains: SKILL.md
|  size: ~4KB (1 file)

### Tier 3 — Tooling

|turborepo|.claude/skills/turborepo
|  desc: Turborepo monorepo — turbo.json, task pipelines, dependsOn, caching, remote cache, --filter, --affected, CI optimization.
|  contains: SKILL.md,command/,references/
|  size: 168KB (26 files)

|agent-browser|.claude/skills/agent-browser
|  desc: Browser automation CLI — navigate pages, fill forms, click buttons, screenshots, extract data, test web apps.
|  contains: SKILL.md,references/,templates/
|  size: 68KB (10 files)

|vercel-react-native-skills|.claude/skills/vercel-react-native-skills
|  desc: React Native/Expo best practices — components, list performance, animations, native modules.
|  contains: SKILL.md,AGENTS.md,rules/
|  size: 292KB (38 files)

### Tier 4 — Reference

|web-design-guidelines|.claude/skills/web-design-guidelines
|  desc: Web Interface Guidelines compliance — UI review, accessibility, design audit, UX check.
|  contains: SKILL.md
|  size: 4KB (1 file)

|find-skills|.claude/skills/find-skills
|  desc: Discover and install agent skills. "How do I do X", "find a skill for X".
|  contains: SKILL.md
|  size: 8KB (1 file)

|agents-md-generator|.claude/skills/agents-md-generator
|  desc: Generate AGENTS.md/CLAUDE.md with compressed doc indexes and skill maps for AI coding agents.
|  contains: SKILL.md,references/,scripts/
|  size: 44KB (5 files)

### Tier 5 — Maintenance

|docs-maintenance|.claude/skills/docs-maintenance
|  desc: Documentation maintenance — TSDoc enforcement, ARCHITECTURE.md sync, TypeDoc verification. Triggered on any src/ file changes.
|  contains: SKILL.md
|  size: ~4KB (1 file)

|commit-docs|.claude/skills/commit-docs
|  desc: Commit documentation standards — TSDoc checklist, conventional commit messages, pre-commit verification.
|  contains: SKILL.md
|  size: ~4KB (1 file)

> REMINDER: Have you pushed recently? If you've completed a feature, test, or meaningful change — commit and push now. Don't batch work. The hooks will catch problems. Small, frequent pushes > large, infrequent ones.

## Architecture

- `ARCHITECTURE.md` — System overview, data flow, directory map, conventions
- `docs/generated/` — Auto-generated TypeDoc API reference (run `pnpm docs`)

## Documentation Rules

- Every exported function/type/component MUST have a TSDoc comment
- **Enforced by**: `eslint-plugin-jsdoc` (`jsdoc/require-jsdoc` rule) — errors on any exported function/type/interface missing a TSDoc comment
- **Pre-commit hook**: `husky` + `lint-staged` runs ESLint on staged `src/**/*.{ts,tsx}` files — commits are blocked if TSDoc is missing
- Read `.claude/skills/docs-maintenance/SKILL.md` before completing any code task
- Run `pnpm docs` after adding new exports
- Keep ARCHITECTURE.md directory map in sync when adding/removing files

## Vercel AI SDK Docs

[AI SDK Docs Index]|root: ./docs/ai-sdk
|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any AI SDK tasks.
|00-introduction:{index.mdx}
|02-foundations:{index.mdx,01-overview.mdx,02-providers-and-models.mdx,03-prompts.mdx,04-tools.mdx,05-streaming.mdx}
|02-getting-started:{index.mdx,00-choosing-a-provider.mdx,01-navigating-the-library.mdx,02-nextjs-app-router.mdx,03-nextjs-pages-router.mdx,04-svelte.mdx,05-nuxt.mdx,06-nodejs.mdx,07-expo.mdx,08-tanstack-start.mdx}
|03-agents:{index.mdx,01-overview.mdx,02-building-agents.mdx,03-workflows.mdx,04-loop-control.mdx,05-configuring-call-options.mdx}
|03-ai-sdk-core:{index.mdx,01-overview.mdx,05-generating-text.mdx,10-generating-structured-data.mdx,15-tools-and-tool-calling.mdx,16-mcp-tools.mdx,20-prompt-engineering.mdx,25-settings.mdx,30-embeddings.mdx,31-reranking.mdx,35-image-generation.mdx,36-transcription.mdx,37-speech.mdx,40-middleware.mdx,45-provider-management.mdx,50-error-handling.mdx,55-testing.mdx,60-telemetry.mdx,65-devtools.mdx}
|04-ai-sdk-ui:{index.mdx,01-overview.mdx,02-chatbot.mdx,03-chatbot-message-persistence.mdx,03-chatbot-resume-streams.mdx,03-chatbot-tool-usage.mdx,04-generative-user-interfaces.mdx,05-completion.mdx,08-object-generation.mdx,20-streaming-data.mdx,21-error-handling.mdx,21-transport.mdx,24-reading-ui-message-streams.mdx,25-message-metadata.mdx,50-stream-protocol.mdx}
|05-ai-sdk-rsc:{index.mdx,01-overview.mdx,02-streaming-react-components.mdx,03-generative-ui-state.mdx,03-saving-and-restoring-states.mdx,04-multistep-interfaces.mdx,05-streaming-values.mdx,06-loading-state.mdx,08-error-handling.mdx,09-authentication.mdx,10-migrating-to-ui.mdx}
|06-advanced:{index.mdx,01-prompt-engineering.mdx,02-stopping-streams.mdx,03-backpressure.mdx,04-caching.mdx,05-multiple-streamables.mdx,06-rate-limiting.mdx,07-rendering-ui-with-language-models.mdx,08-model-as-router.mdx,09-multistep-interfaces.mdx,09-sequential-generations.mdx,10-vercel-deployment-guide.mdx}
|07-reference/01-ai-sdk-core:{index.mdx,01-generate-text.mdx,02-stream-text.mdx,03-generate-object.mdx,04-stream-object.mdx,05-embed.mdx,06-embed-many.mdx,06-rerank.mdx,10-generate-image.mdx,11-transcribe.mdx,12-generate-speech.mdx,15-agent.mdx,16-tool-loop-agent.mdx,17-create-agent-ui-stream.mdx,18-create-agent-ui-stream-response.mdx,18-pipe-agent-ui-stream-to-response.mdx,20-tool.mdx,22-dynamic-tool.mdx,23-create-mcp-client.mdx,24-mcp-stdio-transport.mdx,25-json-schema.mdx,26-zod-schema.mdx,27-valibot-schema.mdx,28-output.mdx,30-model-message.mdx,31-ui-message.mdx,32-validate-ui-messages.mdx,33-safe-validate-ui-messages.mdx,40-provider-registry.mdx,42-custom-provider.mdx,50-cosine-similarity.mdx,60-wrap-language-model.mdx,61-wrap-image-model.mdx,65-language-model-v2-middleware.mdx,66-extract-reasoning-middleware.mdx,67-simulate-streaming-middleware.mdx,68-default-settings-middleware.mdx,69-add-tool-input-examples-middleware.mdx,70-extract-json-middleware.mdx,70-step-count-is.mdx,71-has-tool-call.mdx,75-simulate-readable-stream.mdx,80-smooth-stream.mdx,90-generate-id.mdx,91-create-id-generator.mdx}
|07-reference/02-ai-sdk-ui:{index.mdx,01-use-chat.mdx,02-use-completion.mdx,03-use-object.mdx,31-convert-to-model-messages.mdx,32-prune-messages.mdx,40-create-ui-message-stream.mdx,41-create-ui-message-stream-response.mdx,42-pipe-ui-message-stream-to-response.mdx,43-read-ui-message-stream.mdx,46-infer-ui-tools.mdx,47-infer-ui-tool.mdx,50-direct-chat-transport.mdx}
|07-reference/03-ai-sdk-rsc:{index.mdx,01-stream-ui.mdx,02-create-ai.mdx,03-create-streamable-ui.mdx,04-create-streamable-value.mdx,05-read-streamable-value.mdx,06-get-ai-state.mdx,07-get-mutable-ai-state.mdx,08-use-ai-state.mdx,09-use-actions.mdx,10-use-ui-state.mdx,11-use-streamable-value.mdx,20-render.mdx}
|07-reference/05-ai-sdk-errors:{index.mdx,ai-api-call-error.mdx,ai-download-error.mdx,ai-empty-response-body-error.mdx,ai-invalid-argument-error.mdx,ai-invalid-data-content-error.mdx,ai-invalid-message-role-error.mdx,ai-invalid-prompt-error.mdx,ai-invalid-response-data-error.mdx,ai-invalid-tool-approval-error.mdx,ai-invalid-tool-input-error.mdx,ai-json-parse-error.mdx,ai-load-api-key-error.mdx,ai-load-setting-error.mdx,ai-message-conversion-error.mdx,ai-no-content-generated-error.mdx,ai-no-image-generated-error.mdx,ai-no-object-generated-error.mdx,ai-no-output-generated-error.mdx,ai-no-speech-generated-error.mdx,ai-no-such-model-error.mdx,ai-no-such-provider-error.mdx,ai-no-such-tool-error.mdx,ai-no-transcript-generated-error.mdx,ai-retry-error.mdx,ai-too-many-embedding-values-for-call-error.mdx,ai-tool-call-not-found-for-approval-error.mdx,ai-tool-call-repair-error.mdx,ai-type-validation-error.mdx,ai-ui-message-stream-error.mdx,ai-unsupported-functionality-error.mdx}
|07-reference:{index.mdx}
|08-migration-guides:{index.mdx,00-versioning.mdx,24-migration-guide-6-0.mdx,25-migration-guide-5-0-data.mdx,26-migration-guide-5-0.mdx,27-migration-guide-4-2.mdx,28-migration-guide-4-1.mdx,29-migration-guide-4-0.mdx,36-migration-guide-3-4.mdx,37-migration-guide-3-3.mdx,38-migration-guide-3-2.mdx,39-migration-guide-3-1.mdx}
|09-troubleshooting:{index.mdx,01-azure-stream-slow.mdx,03-server-actions-in-client-components.mdx,04-strange-stream-output.mdx,05-streamable-ui-errors.mdx,05-tool-invocation-missing-result.mdx,06-streaming-not-working-when-deployed.mdx,06-streaming-not-working-when-proxied.mdx,06-timeout-on-vercel.mdx,07-unclosed-streams.mdx,08-use-chat-failed-to-parse-stream.mdx,09-client-stream-error.mdx,10-use-chat-tools-no-response.mdx,11-use-chat-custom-request-options.mdx,12-typescript-performance-zod.mdx,12-use-chat-an-error-occurred.mdx,13-repeated-assistant-messages.mdx,14-stream-abort-handling.mdx,14-tool-calling-with-structured-outputs.mdx,15-abort-breaks-resumable-streams.mdx,15-stream-text-not-working.mdx,16-streaming-status-delay.mdx,17-use-chat-stale-body-data.mdx,18-ontoolcall-type-narrowing.mdx,19-unsupported-model-version.mdx,20-no-object-generated-content-filter.mdx,21-missing-tool-results-error.mdx,30-model-is-not-assignable-to-type.mdx,40-typescript-cannot-find-namespace-jsx.mdx,50-react-maximum-update-depth-exceeded.mdx,60-jest-cannot-find-module-ai-rsc.mdx,70-high-memory-usage-with-images.mdx}

## AI Gateway Docs

[AI Gateway Docs Index]|root: ./docs/ai-gateway
|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any AI Gateway tasks.
|{01-getting-started.md,02-models-and-providers.md,03-provider-options.md,04-model-fallbacks.md}

## AI Elements Docs

[AI Elements Docs Index]|root: ./docs/ai-elements
|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any AI Elements tasks.
|{index.mdx,usage.mdx,troubleshooting.mdx}
|components/chatbot:{attachments.mdx,chain-of-thought.mdx,checkpoint.mdx,confirmation.mdx,context.mdx,conversation.mdx,inline-citation.mdx,message.mdx,model-selector.mdx,plan.mdx,prompt-input.mdx,queue.mdx,reasoning.mdx,shimmer.mdx,sources.mdx,suggestion.mdx,task.mdx,tool.mdx}
|components/code:{agent.mdx,artifact.mdx,code-block.mdx,commit.mdx,environment-variables.mdx,file-tree.mdx,package-info.mdx,sandbox.mdx,schema-display.mdx,snippet.mdx,stack-trace.mdx,terminal.mdx,test-results.mdx,web-preview.mdx}
|components/utilities:{image.mdx,loader.mdx,open-in-chat.mdx}
|components/voice:{audio-player.mdx,mic-selector.mdx,persona.mdx,speech-input.mdx,transcription.mdx,voice-selector.mdx}
|components/workflow:{canvas.mdx,connection.mdx,controls.mdx,edge.mdx,node.mdx,panel.mdx,toolbar.mdx}
|examples:{index.mdx,chatbot.mdx,v0.mdx,workflow.mdx}

> REMINDER: Before ending a session — commit and push all completed work. Every push triggers CI (tests + coverage + typecheck). Unpushed work is unvalidated work.
