---
name: brand-guide
description: Moonshots & Magic brand identity — colors, typography, animations, textures, logo specs, and image generation prompts.
---

## When to Use

- Any UI/styling work
- Generating images or visual content
- Creating new pages or components
- Reviewing designs for brand compliance
- Writing copy or marketing content

## Brand Identity

- **Name:** MOONSHOTS & MAGIC
- **Tagline:** mirror factory
- **Aesthetic:** 70s-80s retro sci-fi, NASA archival quality
- **Copyright:** Mirror Factory, 2026

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Text | `#FFFFFF` | All crisp text and UI elements |
| Accent / Glow | `#3560FF` | Core accent, glow effects, motion trails |
| Background | `#000000` | All backgrounds, space ambiance |

### Blue Gradient (blur layers, deepest to nearest)

`#1830dd` -> `#2545ee` -> `#3560ff` -> `#4575ff` -> `#6090ff`

### Usage Guidelines

- White for primary text — maximum contrast, minimum 7:1 ratio for accessibility
- Electric blue reserved for glow effects, motion trails, accent elements
- Black backgrounds create the space-like atmosphere essential to the brand

## Typography

- **Typeface:** Oswald (Google Fonts)
- **Weights:** 400 (body), 700 (headlines)
- **Style:** UPPERCASE, `tracking-wider` or `tracking-[0.3em]`
- **Line height:** `leading-[0.85]` for stacked logo lockup

### Next.js Font Import

```ts
import { Oswald } from "next/font/google"
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] })
```

## Logo Specifications

### Standard Lockup (with blur)

"MOONSHOTS" / "& MAGIC" stacked, `leading-[0.85]`, 5-layer blur stack behind (`#1830dd` -> `#6090ff`).

### Clean Version

White text, no effects. Use when effects reduce legibility (small sizes, print).

### With Tagline

Standard lockup + "MIRROR FACTORY" subtitle (`text-sm`, `tracking-[0.3em]`, `uppercase`, `text-white/70`).

### Rules

- **Min width:** 200px (with effects)
- **Clear space:** Height of one letter on all sides
- **Background:** Black or >=80% black

## Signature Animations

### Hero Effect (Multi-Layer Blur Stack)

5 blur layers + main crisp text, all doing bottom-up reveal (`translateY(100%)` -> `translateY(0)`):

| Layer | Color | Blur | ScaleY | TranslateY | Duration | Delay | Opacity |
|-------|-------|------|--------|------------|----------|-------|---------|
| 1 (deepest) | `#1830dd` | 50px | 4.5 | 45% | 1500ms | 0ms | 0.7 |
| 2 | `#2545ee` | 35px | 3.2 | 32% | 1300ms | 50ms | 0.8 |
| 3 | `#3560ff` | 20px | 2.2 | 22% | 1100ms | 100ms | 0.85 |
| 4 | `#4575ff` | 12px | 1.5 | 10% | 900ms | 150ms | 0.9 |
| 5 (nearest) | `#6090ff` | 6px | 1.0 | 0% | 700ms | 200ms | 0.95 |
| Text | `#FFFFFF` | 0 | 1.0 | 0% | 600ms | 250ms | 1.0 |

**Text-shadow when active:** `0 0 10px rgba(255,255,255,0.5), 0 0 30px rgba(100,150,255,0.4)`

**Staging:** Blue ambient glow scales in first (1000ms), then text layers reveal with stagger.

### Pulsing Glow

3-layer blur, opacity cycling:

| Layer | Color | Blur | ScaleY | TranslateY | Delay |
|-------|-------|------|--------|------------|-------|
| 1 | `#1830dd` | 40px | 3.5 | 35% | 0s |
| 2 | `#2545ee` | 25px | 2.5 | 25% | 0.1s |
| 3 | `#3560ff` | 12px | 1.5 | 12% | 0.2s |

Animation: `2s ease-in-out infinite` on each layer.

### Bottom-Up Reveal

Elements rise from bottom (`translateY(150%)` -> `translateY(0)`), 1s duration, 1.2s stagger between background and text.

### Animation Principles

- **Duration:** 1-2s for major reveals, 3-4s for ambient loops
- **Easing:** `ease-out` for entrances, `ease-in-out` for loops
- **Staging:** Layer reveals with 100-200ms delays for depth
- **Blur layers:** 5 layers minimum (50px, 35px, 20px, 12px, 6px)

## Texture & Effects

### Film Grain (Canvas-Based)

- Canvas-based animated noise at 2x device pixel ratio
- RGBA per pixel: R=G=B=random(0-255), Alpha=random(40-120)
- Opacity: 35-50%
- Blend: `mix-blend-overlay`
- Runs via `requestAnimationFrame`

### SVG Static Grain

```
fractalNoise: baseFrequency="0.85", numOctaves=4, stitchTiles="stitch"
backgroundSize: 150px 150px, opacity: 0.4
```

### Static Stars

150+ white dots, varying sizes (0.5-2.5px) and opacities (0.2-0.8), scattered across viewport.

### Z-Index Stack

1. Background: pure black (`#000000`)
2. Blue radial glow (`z-5`)
3. Content: text and UI (`z-10`)
4. Static stars (`z-20`)
5. Vignette: radial gradient darkening edges (`z-30`)
6. SVG grain (`z-40`, 40% opacity)
7. Animated grain canvas (`z-50`, 35% opacity, `mix-blend-overlay`)

## Image Generation

### Mandatory Suffix

Append to ALL image prompts:

```
, monochromatic black and white, NO COLOR, heavy visible film grain texture throughout entire image, high ISO noise, scratched aged film stock, deep pure blacks (#000000), bright stark whites, extreme contrast ratio, 1970s-1980s analog photography aesthetic, vintage NASA archival quality, visible dust particles and scratches, halftone dot pattern subtly visible, matte finish not glossy, desaturated completely, photographic paper texture
```

### Asset Treatment

- Images use `mix-blend-screen` for dark background integration
- High contrast, matte finish
- 70s-80s analog photography look
- Always apply film grain overlay (35-50% opacity)
- Desaturate — let blue glow provide accent color
- Add subtle vignetting to focus attention on center

See `references/image-prompts.md` for specific subject prompts.
See `references/animations.md` for exact CSS/JS implementation code.
