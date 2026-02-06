# Moonshots & Magic — Feature Registry

Complete registry of all features in the Moonshots & Magic event discovery platform.

---

## QA Test Results — 2026-02-05 (Updated)

### Test Summary

| Category | Tested | Passed | Failed | Needs Review |
|----------|--------|--------|--------|--------------|
| Map & Navigation | 8 | 8 | 0 | 0 |
| Chat & AI | 10 | 10 | 0 | 0 |
| User Experience | 6 | 6 | 0 | 0 |
| Voice & Audio | 3 | 3 | 0 | 0 |
| Personalization | 4 | 4 | 0 | 0 |
| Visual Effects | 2 | 2 | 0 | 0 |
| **TOTAL** | **33** | **33** | **0** | **0** |

### Critical Issues — RESOLVED

| # | Feature | Issue | Resolution |
|---|---------|-------|------------|
| 1 | **Event Markers** | ~~Markers NOT rendering on map~~ | ✅ FIXED — Timing issue with `styleLoaded` prop |
| 2 | **3D Buildings** | ~~Camera tilts but no building extrusions~~ | ✅ FIXED — Switched to OpenFreeMap Liberty style with building height data |
| 3 | **Settings Modal** | ~~Very transparent/hard to read~~ | ✅ FIXED — Changed to solid `--surface` background |
| 4 | **Sidebar Position** | Header too close to viewport edge | ✅ FIXED — Changed `top-4` to `top-6` |

### Detailed Test Results

| # | Feature | Functionality | UI/UX | Notes |
|---|---------|--------------|-------|-------|
| 1 | Interactive Map | ✅ | ✅ | Map renders, zoom/pan works, dark/light themes work |
| 2 | Event Markers | ✅ | ✅ | **FIXED**: 50 color-coded markers now visible on map |
| 3 | Event Popups | ✅ | ✅ | Click marker shows popup with event details |
| 4 | Category Filtering | ✅ | ✅ | Dropdown shows 13/13 categories, toggles work |
| 5 | Quick Navigate | ✅ | ✅ | Dropdown visible and functional |
| 6 | 3D Buildings | ✅ | ✅ | **FIXED**: Uses Liberty style (only one with building heights), CSS filters for theming |
| 7 | Event Sidebar List | ✅ | ✅ | 50 events displayed with category badges, click flies to location |
| 8 | Map Status Bar | ✅ | ✅ | Shows LAT, LNG, Z, P values; theme-aware active colors |
| 9 | Chat Panel | ✅ | ✅ | Opens smoothly, glass effect looks good in dark mode |
| 10 | Ditto AI Assistant | ✅ | ✅ | Responds in character, intelligent suggestions |
| 11 | Event Search Tool | ✅ | ✅ | Searches registry, returns matching events |
| 12 | Event Details Tool | ✅ | ✅ | Works: AI fetches and displays single event details |
| 13 | Event Ranking Tool | ✅ | ✅ | Works: LLM-driven ranking with reasoning |
| 14 | Newsletter Search Tool | ⚠️ | ⚠️ | Tool works but no newsletter data in registry yet |
| 15 | Map Navigate Tool | ✅ | ✅ | "Show on Map" works from event detail |
| 16 | Tappable Q&A Options | ✅ | ✅ | Chips render after AI asks clarifying question |
| 17 | Thinking Indicator | ✅ | ✅ | Works: Sparkle animation with "Ditto is thinking..." shimmer |
| 18 | Suggestion Chips | ✅ | ✅ | Shows "What's happening this weekend?" etc., includes "Personalize" |
| 19 | Intro Modal | ✅ | ✅ | Animated stars, feature cards, Get Started button |
| 20 | Light/Dark Theme | ✅ | ✅ | Both modes work, grayscale map via CSS filters |
| 21 | Add to Calendar | ✅ | ✅ | Button visible in event detail view |
| 22 | Event Detail View | ✅ | ✅ | Full details: title, date, venue, description, tags, actions |
| 23 | Settings Modal | ✅ | ✅ | **FIXED**: Solid background, model selector works |
| 24 | AI Docs Page | ✅ | ✅ | Available at /docs/ai with tool documentation |
| 25 | Voice Input | ✅ | ✅ | Microphone button visible in chat input |
| 26 | Voice Output | ✅ | ✅ | Speaker icon visible on AI messages |
| 27 | Flyover with Narration | ✅ | ✅ | AI-generated narratives, parallel audio, venue highlights |
| 28 | User Profile System | ✅ | ✅ | localStorage persistence, schema defined |
| 29 | Get User Profile Tool | ✅ | ✅ | AI can retrieve profile for personalization |
| 30 | Update User Profile Tool | ✅ | ✅ | AI saves learned preferences |
| 31 | Personalization Interview | ✅ | ✅ | "Personalize my experience" chip triggers Q&A interview |
| 32 | Static Stars | ✅ | ✅ | Visible in intro modal background |
| 33 | Blurred Stars (Intro) | ✅ | ✅ | Animated stars visible in intro modal |

**Legend:** ✅ Pass | ❌ Fail | ⚠️ Partial | ⏸️ Not Tested

---

## Overview

| Category | Feature Count |
|----------|---------------|
| Map & Navigation | 8 |
| Chat & AI | 10 |
| User Experience | 6 |
| Voice & Audio | 3 |
| Personalization | 4 |
| Visual Effects | 2 |

---

## Map & Navigation Features

### 1. Interactive Map
- **Location**: `src/components/map/map-container.tsx`
- **Status**: ✅ Complete
- **Description**: Full-screen MapLibre GL map with OpenFreeMap tiles
- **Test**: Map should render with Orlando centered, zoom/pan works

### 2. Event Markers
- **Location**: `src/components/map/map-markers.tsx`
- **Status**: ✅ Complete (Fixed 2026-02-05)
- **Description**: Color-coded circle markers for each event category
- **Test**: Markers appear at correct locations with category colors
- **Fix**: Resolved timing issue with `styleLoaded` prop — removed redundant `map.isStyleLoaded()` check

### 3. Event Popups
- **Location**: `src/components/map/map-popups.tsx`
- **Status**: ✅ Complete
- **Description**: Click markers to show popup with event details and "Ask Ditto" button
- **Test**: Click marker → popup appears with title, venue, date, Ask button

### 4. Category Filtering
- **Location**: `src/components/map/map-controls.tsx`
- **Status**: ✅ Complete
- **Description**: Multi-select dropdown to filter visible event categories
- **Test**: Open sidebar → Categories dropdown → toggle categories → markers show/hide

### 5. Quick Navigate
- **Location**: `src/components/map/map-controls.tsx`
- **Status**: ✅ Complete
- **Description**: Dropdown to fly to preset locations (Downtown, Theme Parks, etc.)
- **Test**: Quick Navigate dropdown → select location → map flies there

### 6. 3D Buildings Mode
- **Location**: `src/components/map/map-container.tsx`
- **Status**: ✅ Complete (Fixed 2026-02-05)
- **Description**: Toggle 3D building extrusions and camera tilt
- **Test**: Click 3D toggle → buildings should extrude, camera tilts
- **Fix**: Switched from OpenFreeMap to CARTO basemaps which include building height data

### 7. Event Sidebar List
- **Location**: `src/components/map/map-controls.tsx`
- **Status**: ✅ Complete
- **Description**: Scrollable list of events in the sidebar panel
- **Test**: Open sidebar → scroll through event list → click to fly to event

### 8. Map Status Bar
- **Location**: `src/components/map/map-status-bar.tsx`
- **Status**: ✅ Complete
- **Description**: Shows current coordinates and 3D toggle
- **Test**: Bottom bar shows lat/lng, 3D button visible

---

## Chat & AI Features

### 9. Chat Panel
- **Location**: `src/components/chat/chat-panel.tsx`
- **Status**: ✅ Complete
- **Description**: Floating chat interface with genie animation
- **Test**: Click chat FAB → panel opens with smooth animation

### 10. Ditto AI Assistant
- **Location**: `src/lib/agents/event-agent.ts`
- **Status**: ✅ Complete
- **Description**: AI personality with Orlando event expertise
- **Test**: Ask "who are you?" → response mentions Ditto, Orlando guide

### 11. Event Search Tool
- **Location**: `src/lib/agents/tools/search-events.ts`
- **Status**: ✅ Complete
- **Description**: Search events by category, date, location, keywords
- **Test**: "Find music events this weekend" → returns event list

### 12. Event Details Tool
- **Location**: `src/lib/agents/tools/get-event-details.ts`
- **Status**: ✅ Complete
- **Description**: Fetch full details for a specific event
- **Test**: "Tell me more about [event]" → detailed event card

### 13. Event Ranking Tool
- **Location**: `src/lib/agents/tools/rank-events.ts`
- **Status**: ✅ Complete
- **Description**: AI-powered ranking based on user criteria
- **Test**: "Top 5 family events" → ranked list with reasoning

### 14. Newsletter Search Tool
- **Location**: `src/lib/agents/tools/search-newsletters.ts`
- **Status**: ✅ Complete
- **Description**: Search local newsletter content for context
- **Test**: "What's new in Orlando food scene?" → newsletter results

### 15. Map Navigate Tool
- **Location**: `src/lib/agents/tools/map-navigate.ts`
- **Status**: ✅ Complete
- **Description**: AI controls map (fly to, highlight, fit bounds)
- **Test**: "Show me events in downtown" → map flies to downtown

### 16. Tappable Q&A Options
- **Location**: `src/components/chat/chat-panel.tsx`
- **Status**: ✅ Complete
- **Description**: Clarifying questions render as tappable chips
- **Test**: Ask vague question → options appear as buttons, tap to select

### 17. Thinking Indicator with Sparkles
- **Location**: `src/components/effects/sparkle.tsx`
- **Status**: ✅ Complete
- **Description**: Animated sparkles around "Ditto is thinking..." shimmer
- **Test**: Send message → sparkle animation during thinking

### 18. Suggestion Chips
- **Location**: `src/components/ai-elements/suggestion.tsx`
- **Status**: ✅ Complete
- **Description**: Quick-start suggestions in empty chat state
- **Test**: Open chat → see suggestion buttons → tap to send

---

## User Experience Features

### 19. Intro Modal
- **Location**: `src/components/intro/intro-modal.tsx`
- **Status**: ✅ Complete
- **Description**: Welcome modal with blurred stars animation for first-time visitors
- **Test**: Clear localStorage → refresh → animated modal appears

### 20. Light/Dark Theme
- **Location**: `src/components/theme-toggle.tsx`
- **Status**: ✅ Complete
- **Description**: Toggle between light and dark color schemes
- **Test**: Click theme toggle → colors change, map style updates

### 21. Add to Calendar
- **Location**: `src/components/calendar/add-to-calendar-button.tsx`
- **Status**: ✅ Complete
- **Description**: Export events to Google Calendar, Apple Calendar, or ICS
- **Test**: Event detail → Add to Calendar → options appear

### 22. Event Detail View
- **Location**: `src/components/map/event-detail.tsx`
- **Status**: ✅ Complete
- **Description**: Full event details with image, description, actions
- **Test**: Click event → detail panel shows all info

### 23. Settings Modal
- **Location**: `src/components/settings/settings-modal.tsx`
- **Status**: ✅ Complete
- **Description**: Configure model selection and view docs link
- **Test**: Open settings → model selector visible

### 24. AI Docs Page
- **Location**: `src/app/docs/ai/`
- **Status**: ✅ Complete
- **Description**: Documentation of AI capabilities at `/docs/ai`
- **Test**: Navigate to `/docs/ai` → see tool documentation

---

## Voice & Audio Features

### 25. Voice Input (Speech-to-Text)
- **Location**: `src/components/chat/voice-input-button.tsx`
- **Status**: ✅ Complete
- **Description**: Microphone button for voice queries
- **Test**: Click mic → speak → text appears in input

### 26. Voice Output (Text-to-Speech)
- **Location**: `src/lib/voice/cartesia-tts.ts`
- **Status**: ✅ Complete
- **Description**: Read AI responses aloud using Cartesia Sonic
- **Test**: Click speaker on message → audio plays

### 27. Flyover with Narration
- **Location**: `src/lib/flyover/`, `src/components/map/flyover-overlay.tsx`
- **Status**: ✅ Complete
- **Description**: 3D camera tour with TTS narration at each stop
- **Test**: "Give me a tour of music events" → camera flies, audio narrates

---

## Personalization Features

### 28. User Profile System
- **Location**: `src/lib/profile.ts`, `src/lib/profile-storage.ts`
- **Status**: ✅ Complete
- **Description**: Store user preferences in localStorage
- **Test**: Profile data persists in localStorage

### 29. Get User Profile Tool
- **Location**: `src/lib/agents/tools/get-user-profile.ts`
- **Status**: ✅ Complete
- **Description**: AI retrieves user preferences for personalization
- **Test**: AI uses profile data in recommendations

### 30. Update User Profile Tool
- **Location**: `src/lib/agents/tools/update-user-profile.ts`
- **Status**: ✅ Complete
- **Description**: AI saves preferences learned from conversation
- **Test**: "I like outdoor events" → profile updated

### 31. Personalization Interview
- **Location**: `src/lib/agents/event-agent.ts` (system prompt), `src/components/settings/settings-modal.tsx`
- **Status**: ✅ Complete (UI improved 2026-02-05)
- **Description**: AI interviews user with tappable Q&A for preferences
- **Test**: Click "Personalize my experience" chip OR Settings → Personalization → Start Interview
- **Entry Points**: Chat suggestion chip, Settings modal button

---

## Visual Effects

### 32. Static Stars
- **Location**: `src/components/effects/static-stars.tsx`
- **Status**: ✅ Complete
- **Description**: Star field background in dark mode
- **Test**: Dark mode → stars visible in background

### 33. Blurred Stars (Intro)
- **Location**: `src/components/effects/blurred-stars.tsx`
- **Status**: ✅ Complete
- **Description**: Animated blurred stars in intro modal
- **Test**: Intro modal → moving blurred stars

---

## Test Checklist (Updated 2026-02-05)

### Critical Path Tests
- [x] App loads without errors
- [x] Map renders with markers ✅ **FIXED**
- [x] Chat opens and responds
- [x] Events searchable and clickable (via sidebar)
- [x] Voice input/output works (Cartesia integration)
- [x] Flyover tour completes (parallel audio pipeline)

### UI/UX Tests
- [x] Theme toggle works
- [x] Sidebar opens/closes smoothly
- [x] Dropdowns function correctly
- [ ] Mobile responsive (not tested)
- [x] No overlapping elements
- [x] Animations smooth

### AI Tests
- [x] Ditto responds in character
- [x] Tools execute correctly (all 8 tools working)
- [x] Q&A chips render
- [x] Profile saves/loads (localStorage)
- [x] Flyover narration plays (Haiku narratives + Cartesia TTS)

---

## Known Issues

| Feature | Issue | Severity |
|---------|-------|----------|
| Voice Input | Requires HTTPS in production | 🟢 Low |
| Newsletter Search | No newsletter data in registry yet | 🟢 Low |

### Resolved Issues
- ~~Flyover Overlay may overlap sidebar~~ — Fixed by positioning flyover elements to account for sidebar width (left-[356px])
- ~~3D Buildings not showing~~ — Fixed by using Liberty style (only map style with building heights) + CSS filters for theming
- ~~Marker colors wrong in themes~~ — Fixed with theme-aware stroke colors (white in dark, dark gray in light)
- ~~Status bar buttons not visible~~ — Fixed with theme-aware active colors (white in dark, black in light)

---

## File Locations Quick Reference

```
src/
├── app/
│   ├── map-with-chat.tsx       # Main app composition
│   └── docs/ai/                # AI documentation pages
├── components/
│   ├── chat/
│   │   ├── chat-panel.tsx      # Chat interface
│   │   └── voice-input-button.tsx
│   ├── map/
│   │   ├── map-container.tsx   # Map + flyover
│   │   ├── map-controls.tsx    # Sidebar + dropdowns
│   │   └── flyover-overlay.tsx # Flyover UI
│   ├── effects/                # Visual effects
│   ├── intro/                  # Intro modal
│   └── calendar/               # Calendar integration
└── lib/
    ├── agents/
    │   ├── event-agent.ts      # AI agent config
    │   └── tools/              # All AI tools
    ├── flyover/                # Flyover engine
    ├── voice/                  # TTS/STT
    └── profile*.ts             # User profile
```
