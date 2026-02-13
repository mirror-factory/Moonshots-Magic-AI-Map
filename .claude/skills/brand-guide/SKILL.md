---
name: brand-guide
description: Moonshots & Magic brand identity — colors, typography, animations, textures, logo specs, and image generation prompts.
version: 2.0.0
---

# Moonshots & Magic — Brand Guide

**Version:** 2.0.0
**Last Updated:** 2026-02-12

## Brand Essence

**MOONSHOTS & MAGIC** is the digital twin of Central Florida — a narrative-driven event discovery platform that tells the story of a region built on ambition and wonder. From rockets to castles, from Fort Gatlin to Artemis, we help people experience Orlando through the lens of its impossible, improbable transformation.

### Core Values

- **Narrative-Driven:** Every feature tells the Orlando story
- **Digital Twin:** Real data, real places, assistive AI
- **Movement & Wonder:** Heavy animation, cinematic experiences
- **Accessible Intelligence:** AI that helps you understand the city

---

## Brand Identity

### Name & Tagline

- **Primary:** MOONSHOTS & MAGIC
- **Tagline:** The Story of Central Florida
- **Copyright:** Mirror Factory, 2026

### The Orlando Narrative

**Moonshots:** Cape Canaveral, Kennedy Space Center, SpaceX, the engineering audacity that put humans on the Moon and continues to launch us into space.

**Magic:** Walt Disney World, Universal, EPCOT, the belief that wonder is engineered, not accidental.

**Together:** A region that marries ambition with imagination, where the impossible becomes routine.

**Timeline:**
- **1838** — Fort Gatlin: Where it all began
- **1875** — The Citrus Frontier
- **1950** — Cape Canaveral Established
- **1961** — Kennedy's Moonshot Speech
- **1969** — Apollo 11 Launches from Pad 39A
- **1971** — Walt Disney World Opens
- **1982** — EPCOT Center
- **1990** — Universal Studios Florida
- **2011** — Final Space Shuttle Flight
- **2020s** — Creative Village & Tech Corridor
- **Now** — The Digital Twin Era

---

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| **Brand Primary** | `#0063CD` | Accent color, ampersand, interactive elements, glows |
| **Text (Dark Mode)** | `#FFFFFF` | Primary text on dark backgrounds |
| **Text (Light Mode)** | `#0A0A0F` | Primary text on light backgrounds |
| **Background (Dark)** | `#050505` (Void)<br>`#121212` (Surface)<br>`#1A1A1A` (Surface-2)<br>`#2A2D35` (Surface-3) | Dark mode surfaces |
| **Background (Light)** | `#FFFFFF` (BG)<br>`#F8F9FA` (Surface)<br>`#F1F3F4` (Surface-2)<br>`#E8EAED` (Surface-3) | Light mode surfaces |

### Blue Gradient (for blur layers, glow effects)

```
#004A9A (Brand Primary Dark)
  ↓
#0063CD (Brand Primary)
  ↓
#3388E0 (Brand Primary Light)
  ↓
#66AAF0 (Brand Primary Soft)
```

### Category Colors (Event Types)

| Category | Hex |
|----------|-----|
| Music | `#FF6B6B` |
| Arts | `#B197FC` |
| Sports | `#74C0FC` |
| Food | `#FFA94D` |
| Tech | `#69DB7C` |
| Community | `#FFD43B` |
| Family | `#F783AC` |
| Nightlife | `#B197FC` |
| Outdoor | `#69DB7C` |
| Education | `#74C0FC` |
| Festival | `#FF6B6B` |
| Market | `#FFA94D` |
| Other | `#888888` |

### Semantic Colors

| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| Success | `#69DB7C` | `#69DB7C` |
| Warning | `#FFA94D` | `#FFA94D` |
| Error | `#DC2626` | `#DC2626` |
| Info | `#74C0FC` | `#74C0FC` |

### Usage Guidelines

- **Ampersand Rule:** The ampersand in "MOONSHOTS & MAGIC" is ALWAYS `#0063CD` (brand primary), whether in light or dark mode. This creates a signature accent that works across all contexts.
- **Contrast Requirements:** Maintain WCAG AAA (7:1) contrast ratio for primary text
- **Glass Surfaces:** Use translucent backgrounds with backdrop blur for panels and overlays
- **Borders:** Subtle, low-opacity borders (`rgba(255, 255, 255, 0.08)` dark, `rgba(0, 0, 0, 0.08)` light)

---

## Typography

### Font Families

- **Display/Headers:** Oswald (Google Fonts) — Weights: 400, 700
- **Brand Logo:** Oswald Bold, ALL CAPS
- **UI Text:** Inter (system fallback)
- **Data/Technical:** Rajdhani
- **Narrative Text:** Chakra Petch

### Oswald (Primary Display Font)

```ts
import { Oswald } from "next/font/google"
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] })
```

**Characteristics:**
- UPPERCASE
- Tall letterforms with short letter spacing (`tracking-[0.05em]` to `tracking-[0.15em]`)
- Condensed, bold, architectural feel
- Use for: Headings, brand lockup, timeline years, chapter titles

### Type Scale

| Element | Size | Weight | Tracking | Family |
|---------|------|--------|----------|--------|
| H1 (Page Title) | 72px | 700 | 0.05em | Oswald |
| H2 (Section) | 48px | 700 | 0.05em | Oswald |
| H3 (Card Title) | 24px | 700 | 0.05em | Oswald |
| Body (Large) | 16px | 400 | 0 | Inter |
| Body (Base) | 14px | 400 | 0 | Inter |
| Caption | 12px | 400 | 0.1em | Inter |
| Micro | 10px | 500 | 0.15em | Inter, ALL CAPS |

### Typography Rules

1. **Headers use Oswald, uppercase, tight tracking**
2. **Body text uses Inter for readability**
3. **Technical data (coordinates, timestamps) uses Rajdhani**
4. **Narrative storytelling uses Chakra Petch (line-height: 1.7)**

---

## Logo Specifications

### Primary Logo Lockup

```
MOONSHOTS
& MAGIC
```

**Format:**
- Two lines, stacked vertically
- Oswald Bold, ALL CAPS
- `leading-[0.85]` (tight line-height for compact lockup)
- Ampersand on its own line, centered
- Ampersand color: `#0063CD` (brand primary)
- Text color: `#FFFFFF` (dark mode) or `#0A0A0F` (light mode)

### Logo Variants

Seven variations designed for maximum flexibility across contexts:

| Variant | Description | Usage | File |
|---------|-------------|-------|------|
| **Blue & White** | MOONSHOTS in blue, MAGIC in white, blue ampersand | Primary dark mode logo | `/images/presentation/logos/M&M Logo - Blue & White.svg` |
| **Blue & Black** | MOONSHOTS in blue, MAGIC in black, blue ampersand | Primary light mode logo | `/images/presentation/logos/M&M Logo - Blue & Black.svg` |
| **White** | All white text and ampersand | Dark backgrounds, minimal variant | `/images/presentation/logos/M&M Logo - White.svg` |
| **Black** | All black text and ampersand | Light backgrounds, minimal variant | `/images/presentation/logos/M&M Logo - Black.svg` |
| **White & Blue** | MAGIC in blue, MOONSHOTS in white, blue ampersand | Inverted accent (dark mode) | `/images/presentation/logos/M&M Logo - White and Blue.svg` |
| **Dark** | Dark variant | Light backgrounds | `/images/presentation/logos/M&M Logo - Dark-1.svg` |
| **Dark Alt** | Alternative dark variant | Blue backgrounds | `/images/presentation/logos/M&M Logo - Dark.svg` |

**Usage Guidelines:**
- **Primary:** Use **Blue & White** for dark backgrounds, **Blue & Black** for light backgrounds
- **Minimum width:** 120px for legibility
- **Clear space:** Maintain padding equal to the height of the ampersand around the logo
- **Blue ampersand signature:** The `#0063CD` ampersand is our signature accent — preserve it when possible
- **Never:** Distort, rotate, or modify logo proportions

### Logo with Tagline

Standard lockup + subtitle below:

```
MOONSHOTS
& MAGIC

THE STORY OF CENTRAL FLORIDA
```

**Tagline styling:**
- `font-size: 10px`
- `tracking: 0.2em`
- `uppercase`
- `color: var(--text-dim)` (60-70% opacity)

### Clearspace & Sizing

- **Minimum width:** 180px (with effects), 120px (clean)
- **Clearspace:** Height of one letter "O" on all sides
- **Background:** Works on dark (`#000000` to `#1A1A1A`) or light (`#FFFFFF` to `#F8F9FA`)

---

## UI Patterns

### Frosted Glass (Signature Effect)

The defining visual signature of Moonshots & Magic is **frosted glass UI** — translucent panels with backdrop blur that overlay the map.

**Light Mode Glass:**
```css
background: rgba(248, 249, 250, 0.62);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(0, 0, 0, 0.1);
border-radius: 10px;
```

**Dark Mode Glass:**
```css
background: rgba(18, 18, 18, 0.55);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 10px;
```

**Usage:**
- Event detail panels
- Chat interfaces
- Presentation mode panels
- Dropdown menus
- Modals and overlays

### Border Radius Scale

| Size | Value | Usage |
|------|-------|-------|
| SM | `8px` | Chips, badges |
| MD | `10px` | Default (buttons, inputs) |
| LG | `12px` | Cards, panels |
| XL | `16px` | Large panels, popups |
| 2XL | `20px` | Hero elements |

**Rule:** Slightly rounded edges everywhere — never sharp 90° corners, never fully circular (except for specific elements like timeline dots).

### Elevation & Shadows

**Light Mode:**
```css
/* Subtle elevation */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

/* Medium elevation */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

/* High elevation */
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.16);
```

**Dark Mode:**
```css
/* Subtle elevation */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

/* Medium elevation */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);

/* High elevation + glow */
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6),
            0 0 30px rgba(0, 99, 205, 0.15);
```

### Texture: Film Grain

Subtle grain overlay on glass surfaces for analog warmth.

```css
.grain-texture::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.04; /* 0.06 in dark mode */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  border-radius: inherit;
}
```

---

## Animation & Movement

Movement is core to the Moonshots & Magic experience. From flyovers to pulsing markers to smooth panel transitions — the UI should feel alive.

### Animation Principles

- **Duration:** 300-800ms for UI interactions, 1-4s for cinematic transitions
- **Easing:** `ease-out` for entrances, `ease-in-out` for loops and pulses
- **Staging:** Stagger animations by 50-100ms for depth
- **Parallax:** Subtle depth cues on scroll/hover

### Signature Animations

#### 1. Pulsing Glow (Map Markers, Active Elements)

```css
@keyframes subtle-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 99, 205, 0.3);
    opacity: 0.8;
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 99, 205, 0.6);
    opacity: 1;
  }
}

.pulsing-marker {
  animation: subtle-pulse 2.5s ease-in-out infinite;
}
```

#### 2. Slide-In Panels (from right)

```tsx
<motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 40 }}
  transition={{ type: "spring", damping: 28, stiffness: 300 }}
>
  {/* Panel content */}
</motion.div>
```

#### 3. Fade + Scale (Cards, Images)

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
>
  {/* Card content */}
</motion.div>
```

#### 4. Flyover (Camera Animation)

**Orbital Sweep:**
- Fly to landmark (duration: 3-4s)
- Linger with slow orbital drift (10-15s)
- Varying pitch (45-60°) and bearing (-45° to +60°) for visual interest
- Smooth `curve: 1.42` for natural camera movement

**Implementation:** See `@/lib/flyover/camera-animator.ts`

---

## Image Treatment

All historical images and photography follow a consistent **black & white, high-contrast, slightly textured** aesthetic.

### Processing Pipeline

1. **Grayscale conversion:** `filter: grayscale(1)`
2. **Contrast boost:** `filter: contrast(1.1)`
3. **Brightness adjust:** `filter: brightness(0.9)` (slightly darker)
4. **Border radius:** 10-16px (rounded corners)
5. **Optional grain overlay:** 4-6% opacity film grain texture

### Example CSS

```css
.historical-image {
  filter: grayscale(1) contrast(1.1) brightness(0.9);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
```

### Historical Image Assets

Located in `/public/images/presentation/`:

- `fort-gatlin.jpg`
- `citrus-industry.jpg`
- `cape-canaveral-origins.jpg`
- `mercury-program.jpg`
- `apollo-11.jpg`
- `disney-world.jpg`
- `epcot.jpg`
- `universal-studios.jpg`
- `space-shuttle.jpg`
- `creative-village.jpg`
- `orlando-today.jpg`

**Treatment:** All images are black & white with rounded edges and subtle texture, matching the brand's archival aesthetic.

---

## AI Image Generation Prompts

When generating new images for Moonshots & Magic, append this suffix:

### Mandatory Suffix

```
, monochromatic black and white, NO COLOR, heavy visible film grain texture throughout entire image, high ISO noise, scratched aged film stock, deep pure blacks (#000000), bright stark whites, extreme contrast ratio, 1970s-1980s analog photography aesthetic, vintage NASA archival quality, visible dust particles and scratches, halftone dot pattern subtly visible, matte finish not glossy, desaturated completely, photographic paper texture, slightly rounded edges
```

### Subject-Specific Prompts

**Space/Rockets:**
```
Apollo-era rocket launch at Cape Canaveral, dramatic plume of smoke and fire, viewed from launchpad gantry, wide-angle perspective, [mandatory suffix]
```

**Theme Parks:**
```
Cinderella Castle at Magic Kingdom, early morning light, wide moat in foreground, visitors entering the park, [mandatory suffix]
```

**Orlando Cityscape:**
```
Downtown Orlando skyline at dusk, Lake Eola fountain in foreground, art deco architecture, palm trees silhouetted, [mandatory suffix]
```

**Historical Florida:**
```
Orange grove in Central Florida, workers harvesting citrus, railroad tracks in background, 1920s-era trucks, [mandatory suffix]
```

---

## Voice & Tone

### Voice Characteristics

- **Narrative-Driven:** Every feature tells a story
- **Ambitious:** We celebrate moonshots — audacious, improbable goals
- **Accessible:** Complex ideas explained simply
- **Warm but Technical:** Human + data-driven

### Writing Guidelines

**Do:**
- Use active voice and present tense
- Reference the Orlando timeline when relevant
- Connect events to the broader moonshots & magic narrative
- Balance technical precision with storytelling warmth

**Don't:**
- Use corporate jargon or buzzwords
- Oversimplify the science or engineering
- Ignore the human side of the story
- Be cynical or dismissive

### Example Microcopy

| Context | Copy |
|---------|------|
| Loading | "Preparing your journey..." |
| Empty State | "No events found. Try adjusting your filters or exploring a different date range." |
| Error | "We couldn't load this event. Please try again." |
| Flyover Start | "Starting your flyover tour across Orlando..." |
| Presentation End | "And that's the Moonshots & Magic story. Explore the map to discover what's happening today." |

---

## Component Patterns

### Event Cards

```tsx
<div className="grain-texture rounded-xl border border-border-color bg-surface p-4 shadow-md">
  {/* Event image: grayscale, rounded-lg */}
  {/* Title: Oswald, uppercase, brand-primary */}
  {/* Details: Inter, text-dim */}
  {/* Category badge: rounded-full, category color */}
</div>
```

### Filter Chips

```tsx
<button className="rounded-full border border-brand-primary bg-brand-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-primary transition-all hover:bg-brand-primary hover:text-white">
  Music
</button>
```

### Glass Panels

```tsx
<div
  className="grain-texture glow-border rounded-xl"
  style={{
    background: "var(--glass-bg)",
    backdropFilter: "blur(var(--glass-blur))",
    WebkitBackdropFilter: "blur(var(--glass-blur))",
    border: "1px solid var(--glass-border)",
  }}
>
  {/* Panel content */}
</div>
```

### Timeline Dots

```tsx
<div
  className="rounded-full transition-all duration-300"
  style={{
    width: isActive ? 12 : 8,
    height: isActive ? 12 : 8,
    background: isActive ? "#0063CD" : "rgba(0, 99, 205, 0.3)",
    boxShadow: isActive ? "0 0 12px rgba(0, 99, 205, 0.6)" : "none",
    border: isActive ? "2px solid #FFFFFF" : "none",
  }}
/>
```

---

## Accessibility

### Color Contrast

- **Text on light backgrounds:** `#0A0A0F` on `#FFFFFF` = 19.5:1 ✓
- **Text on dark backgrounds:** `#FFFFFF` on `#050505` = 20.4:1 ✓
- **Brand primary on light:** `#0063CD` on `#FFFFFF` = 8.2:1 ✓
- **Brand primary on dark:** `#0063CD` on `#050505` = 2.5:1 ✗ (use white text for primary on dark)

**Rule:** Always test brand primary against its background. Use white text when placing brand primary elements on dark surfaces.

### Motion & Animation

- Respect `prefers-reduced-motion` media query
- Provide pause controls for auto-advancing content (e.g., presentation mode)
- Keep animations under 5 seconds for screen reader compatibility

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}
```

---

## Platform-Specific Guidelines

### Web (Primary)

- Frosted glass works natively via `backdrop-filter`
- Test in Safari, Chrome, Firefox
- Ensure glass effect has fallback for unsupported browsers

### Mobile Considerations

- Increase touch targets to 44px minimum
- Reduce blur intensity on lower-end devices
- Simplify animations to maintain 60fps

### Print (Future)

- Convert frosted glass to solid surfaces
- Use grayscale palette
- Maintain rounded corners and grain texture

---

## Brand Applications

### Event Discovery Map

- **Map style:** Dark mode base (Maptiler, CARTO, or custom)
- **Markers:** Pulsing orbs with category colors
- **Popups:** Frosted glass with rounded corners
- **Panels:** Slide-in from right, grain texture

### Presentation Mode

- **Timeline:** Vertical progress bar with year dots
- **Chapters:** Large year display, Oswald bold
- **Narrative:** Chakra Petch, line-height 1.7
- **Images:** B&W historical photos, rounded-xl

### AI Chat Interface

- **Messages:** Frosted glass bubbles
- **Typography:** Inter for readability
- **Code blocks:** Rajdhani for technical content
- **Assistant icon:** Blue accent, consistent with brand primary

---

## File Naming Conventions

### Images

```
{subject}-{variant}.{ext}

Examples:
- apollo-11.jpg
- moonshots-magic-logo-dark.svg
- event-thumbnail-music-001.jpg
```

### Components

```
{category}-{name}.tsx

Examples:
- map-container.tsx
- presentation-panel.tsx
- event-card.tsx
```

### Utilities

```
{function}.ts

Examples:
- camera-animator.ts
- geojson.ts
- cartesia-tts.ts
```

---

## Brand Evolution

**v1.0** (Initial) — Retro sci-fi, NASA archival, `#3560FF` blue
**v2.0** (Current) — Digital twin, Orlando narrative, `#0063CD` blue, frosted glass UI

**Future Considerations:**
- Light mode optimization for daytime use
- Print-ready assets for physical events
- Motion graphics templates for social media
- Spatial audio integration for presentation mode

---

## Quick Reference

| Element | Value |
|---------|-------|
| **Primary Blue** | `#0063CD` |
| **Dark BG** | `#050505` |
| **Light BG** | `#FFFFFF` |
| **Font (Display)** | Oswald Bold, ALL CAPS |
| **Font (Body)** | Inter |
| **Border Radius** | 10-16px (default: 12px) |
| **Blur Amount** | 24px |
| **Animation Duration** | 300-800ms (UI), 1-4s (cinematic) |
| **Grain Opacity** | 4% (light), 6% (dark) |

---

## Contact & Resources

- **Design System:** See `src/app/globals.css` for CSS variables
- **Logo Assets:** `/public/moonshots-magic-logo-*.svg`
- **Historical Images:** `/public/images/presentation/`
- **Brand Story:** See `src/data/presentation-landmarks.ts`

**Maintained by:** Mirror Factory
**Last Updated:** 2026-02-12
**Version:** 2.0.0
