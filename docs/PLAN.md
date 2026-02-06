# Moonshots & Magic — Development Plan

**Last Updated:** 2026-02-05

## Status Overview

| Category | Status |
|----------|--------|
| Core Features | ✅ 33/33 Complete |
| QA Tests | ✅ All Passing |
| Build | ✅ No Errors |
| TypeScript | ✅ Strict Mode |

---

## Recent Improvements (2026-02-05)

### 1. Flyover Narration Quality
**Files:** `src/app/api/flyover/narrate/route.ts`

Improved Haiku prompt for richer narratives:
- Expanded from 15-word max to 25-35 words (2 sentences)
- Added event description context and category info
- Included engaging example narratives in prompt
- Better position indicators ("First up", "Next up", "And for our final stop")

### 2. Flyover Audio Speed
**Files:** `src/lib/voice/cartesia-tts.ts`

Optimized Cartesia Sonic for faster generation:
- Added `fast` parameter using `__experimental_controls`
- Added timing logging for performance monitoring
- Future opportunity: WebSocket for 40ms time-to-first-audio

### 3. Flyover UI Positioning
**Files:** `src/components/map/flyover-overlay.tsx`

Repositioned overlay elements for better visibility:
- Event card now centered at bottom of viewport
- Controls bar centered as pill at top of screen
- Caption bar centered below event card
- Dark glassmorphism styling (85% opacity)

### 4. Flyover Audio & Controls (2026-02-05)
**Files:** `src/components/map/map-container.tsx`, `src/components/map/flyover-overlay.tsx`

Fixed audio playback and added user controls:
- **Back button**: Added ArrowLeft button to exit the flyover tour
- **Audio sequencing**: Intro audio now completes before waypoint audio starts (prevents cutoff)
- **Clickable progress**: Progress dots are now clickable to jump to any waypoint
- **Tooltips**: Hover over progress dots to see event titles
- All waypoint audio generates in parallel while intro plays

---

## Remaining Tasks

### Priority 1: Critical UX Issues

#### Fix "Ask Ditto" Button Bug
**Status:** ✅ Fixed (2026-02-05)
**Files:**
- `src/components/chat/chat-panel.tsx` — Fixed race condition with useRef

**Fix:** Added `lastProcessedInputRef` to track processed inputs and prevent duplicate sends when `sendMessage` identity changes from `useChat`. Also added reset logic when input is cleared to allow subsequent "Ask Ditto" requests.

#### Verify Flyover End-to-End
**Status:** ✅ Fixed (2026-02-05)
**Test:** Ask "Give me a tour of music events" — should animate map with narration

**Fixes Applied:**
1. ✅ Back button added to flyover controls bar
2. ✅ Audio sequencing fixed — intro audio completes before waypoint audio starts
3. ✅ Clickable progress dots to jump between waypoints
4. ✅ Pre-generated intro audio stored in `public/audio/flyover-intro.wav`
5. ✅ Waypoint audio buffers cached in session (reused when navigating)

**Verification:**
1. AI calls `startFlyover` tool
2. `flyoverProgress` state becomes non-null
3. Animation loop triggers in useEffect
4. TTS narration plays at each waypoint (without cutting off)
5. Overlay UI shows event cards and captions

### Priority 2: Missing UI Entry Points

#### Add Personalization Entry Points
**Status:** ✅ Complete (2026-02-05)
**Files:**
- `src/components/chat/chat-panel.tsx` — "Personalize my experience" chip already in SUGGESTIONS
- `src/components/settings/settings-modal.tsx` — Added "Personalization" section with button

**Implementation:**
1. ✅ Chat suggestion chip already exists ("Personalize my experience")
2. ✅ Added "Personalization" section in Settings modal with "Start Interview" button
3. ✅ Settings button closes modal and opens chat with personalization message

---

## Future Opportunities

### Performance
| Feature | Description | Difficulty |
|---------|-------------|------------|
| Marker Clustering | Use Supercluster for low zoom levels | Medium |
| Suspense Boundaries | Better loading states for map | Low |
| ISR for Events | Database with incremental regeneration | High |
| WebSocket TTS | Cartesia WebSocket for 40ms latency | Medium |

### Features
| Feature | Description | Difficulty |
|---------|-------------|------------|
| Event Favoriting | Save favorites to localStorage/Supabase | Low |
| URL Sharing | Deep links (`/event/:id`, `/?view=downtown`) | Medium |
| Mobile Responsive | Touch-optimized layout | Medium |
| Newsletter Data | Add newsletter entries to registry | Low |

### Developer Experience
| Feature | Description | Difficulty |
|---------|-------------|------------|
| Storybook | Component development/documentation | Medium |
| Playwright E2E | End-to-end tests for critical flows | Medium |
| Agent Tool Tests | Automated test coverage for tools | Medium |

### Architecture
| Feature | Description | Difficulty |
|---------|-------------|------------|
| Custom Hooks | Extract `useMapControls`, `useMapMarkers` | Low |
| State Management | Zustand for cross-component state | Medium |
| OpenTelemetry | Tracing for AI tool calls | Medium |

---

## Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| Voice Input requires HTTPS | 🟢 Low | Production only |
| No newsletter data | 🟢 Low | Registry exists, needs content |
| Color duplication | 🟡 Medium | CSS vars + JS config must sync |

---

## Verification Checklist

### Before Shipping

- [x] "Ask Ditto" button works from all entry points — Fixed race condition
- [x] Flyover tour completes with narration — Fixed audio sequencing, added controls
- [x] Personalization has UI entry points — Chat chip + Settings button
- [x] `pnpm build` passes — Verified 2026-02-05
- [x] All 33 features still passing in FEATURES.md — Verified 2026-02-05

### Testing Commands

```bash
# Build verification
pnpm build

# Type checking
pnpm tsc --noEmit

# Lint
pnpm lint

# Generate docs
pnpm docs
```

---

## File Reference

| Area | Key Files |
|------|-----------|
| Flyover | `src/lib/flyover/`, `src/components/map/flyover-overlay.tsx` |
| TTS | `src/lib/voice/cartesia-tts.ts` |
| Narration API | `src/app/api/flyover/narrate/route.ts` |
| Chat | `src/components/chat/chat-panel.tsx` |
| Map | `src/components/map/map-container.tsx` |
| Agent | `src/lib/agents/event-agent.ts` |
| Profile | `src/lib/profile.ts`, `src/lib/profile-storage.ts` |
| Settings | `src/components/settings/settings-modal.tsx` |

See **[FEATURES.md](./FEATURES.md)** for complete feature registry and test results.
See **[../ARCHITECTURE.md](../ARCHITECTURE.md)** for system overview and directory map.
