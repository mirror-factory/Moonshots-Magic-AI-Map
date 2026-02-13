# Roadmap — UI/UX Fixes & Enhancements

## Flyover & Map Markers

- [x] **F1** — Redesign flyover floating card: image on left, title/venue/date/source/price on right (replace current image-only card above orb)
- [x] **F2** — Fix flyover audio: all events generate audio in parallel immediately, cap flyover at 5 events max
- [ ] **F3** — Handle Cartesia "too many concurrent requests" — add retry/queue for TTS
- [ ] **F4** — Fix flyover sometimes stuck on keyhole and not moving to events
- [x] **F5** — Make flyover card above dot bigger overall with text info
- [ ] **F6** — Remove bottom flyover card (keep only floating card above orb)
- [ ] **F7** — Lock map during flyover: disable pan/rotate, allow zoom only, continuous rotation until complete
- [ ] **F8** — Fix flyover exit button — make it clearer/more intentional (not accidental)

## Filters & Top Bar

- [x] **T1** — Add venue filter dropdown (multi-select with checkmarks, like categories)
- [ ] **T2** — Redesign top bar into segmented filter groups: Dates (All/Today/Weekend/Week/Month/Custom) | Event Types | Venues | Distance radius
- [ ] **T3** — Quick actions as carousel: one at a time, left/right arrows, "Get a tour of Orlando" first, blue boxes
- [x] **T4** — Replace emojis with Lucide icons in Quick Actions menu (still showing emojis)
- [x] **T5** — Move toolbar (3D/theme/play/etc.) to bottom-left, vertical layout, add location button, tooltips on hover
- [ ] **T6** — Explain/improve clock icon (isochrone) — currently confusing UI
- [x] **T7** — Location button turns blue when active/permissioned
- [ ] **T8** — Add search bar inside category and venue filter dropdowns
- [ ] **T9** — Filters should show ALL events by default, not just timeline-filtered ones
- [ ] **T10** — Fix source/resources labels: Google Events, Ticketmaster, Eventbrite, TKX (not "Web Scraper")

## Logo & Branding

- [ ] **L1** — Replace light mode logo with proper one from public/logos (current has blue in the O's)
- [ ] **L2** — Add backdrop blur around logo and dropdown area so always visible over map
- [ ] **L3** — Improve Ditto avatar: higher quality, sparkle effect instead of just pulsing

## Chat & Events UI

- [ ] **E1** — Event cards in chat as carousel: show count, scroll horizontally, not stacked vertically
- [ ] **E2** — Move resources/options button to bottom-left of chat next to pin icon

## Location & Privacy

- [ ] **LP1** — "You Are Here" toggle should disable location AND remove it from AI chat context when off

## Data Quality & Links

- [ ] **D1** — Fix event links: should go to actual event pages (Ticketmaster, Eventbrite, TKX purchase pages), not just venue locations
- [ ] **D2** — Fix pricing accuracy: some events show "Free" but actually cost money (e.g., Matt Koep $25 on TicketWeb shows as Free)
- [x] **D3** — Investigate coordinate accuracy systematically — see findings below
- [ ] **D4** — Scrape additional data from TKX: door open times, start times, actual ticket prices

### D3 Investigation Findings

**1,280 events analyzed. Key issues:**

- **84% missing price data** (1,079 events) — most sources don't provide structured pricing
- **24% missing URLs** (303 events) — scraper/manual events lack ticket links
- **Coordinate duplication**: 46 coordinate pairs shared by multiple events. Worst offenders:
  - Daytona cluster (157 events) — multiple ticket tiers for same NASCAR events
  - Downtown Orlando mixing — "Orlando | The Beacham | 08:00 pm" style titles indicate scraper data extraction errors
  - Dr. Phillips Center — 3 slightly different coordinates (geocoding inconsistency)
- **Source breakdown**: Ticketmaster 64%, SerpApi 27%, TKX 4%, Manual 4%, orlando.gov 1%
- **All 69 "Free" events** appear legitimately free (community events, library programs, indie venue shows)
- **Fix strategy**: Standardize venue geocoding, deduplicate Daytona ticket tiers, clean scraper title pollution

## Presentation Mode

- [x] **P1** — Add "Ask Ditto" blue button in presentation bottom bar (next to audio controls, before X), chat maintains slide context
- [ ] **P2** — Add more text to presentation slides (~1.5 extra paragraphs), allow scroll if content overflows
- [ ] **P3** — Feed all previous slides' context into chat for personalized Q&A

## Personalization & Context

- [x] **C1** — Feed user location into chat context when location permission is active; remove when off
- [ ] **C2** — Research additional personalization opportunities (AI agents, UI, question flows, display customization)

## Onboarding

- [x] **O1** — Replace all emojis with Lucide icons in onboarding flow
- [x] **O2** — Preserve pre-existing context (name, preferences) when reopening onboarding
- [x] **O3** — Add "Clear Preferences" button below "Let's Go" with confirmation modal
- [x] **O4** — Add X button in top-right corner to skip/close onboarding
