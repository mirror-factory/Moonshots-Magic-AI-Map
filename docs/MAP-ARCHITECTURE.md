# Map Architecture

**CRITICAL**: This document explains how the map system works. Read this before making ANY changes to map styles, themes, or 3D functionality.

## Overview

The map uses **MapLibre GL** with **OpenFreeMap** tiles. The setup involves:
1. A base map style (Liberty) that provides vector tiles WITH building height data
2. CSS filters for grayscale/dark effects
3. 3D building extrusion layer added on top

## Why This Architecture?

### The Problem with Different Styles

OpenFreeMap offers several styles:
- **Liberty** - Full-featured, includes building heights (`render_height`)
- **Positron** - Clean grayscale, but NO building height data
- **Dark** - Dark theme, but NO building height data
- **Bright** - Colorful, but NO building height data

**IMPORTANT**: Only Liberty has the `render_height` property needed for 3D buildings!

### The Solution: CSS Filters

Instead of switching between styles (which breaks 3D), we:
1. Always use Liberty style (has building data)
2. Apply CSS filters to achieve grayscale/dark effects

```css
/* Light mode: grayscale */
.maplibregl-canvas {
  filter: grayscale(100%) contrast(1.1);
}

/* Dark mode: grayscale + invert */
.dark .maplibregl-canvas {
  filter: grayscale(100%) invert(1) contrast(0.9) brightness(0.9);
}
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/map/config.ts` | Map style URLs, default viewport, category colors |
| `src/app/globals.css` | CSS filters for grayscale/dark effects |
| `src/components/map/map-container.tsx` | MapLibre initialization, 3D layer management |
| `src/components/map/map-markers.tsx` | Event markers layer with theme-aware colors |

## Configuration

### Style URLs (`config.ts`)

```typescript
export const MAP_STYLES_BY_THEME = {
  light: "https://tiles.openfreemap.org/styles/liberty",
  dark: "https://tiles.openfreemap.org/styles/liberty",  // SAME! Don't change!
} as const;
```

**DO NOT** change these to positron/dark styles - they lack building height data!

### CSS Filters (`globals.css`)

Located in the "MAPLIBRE THEME OVERRIDES" section:

```css
/* Grayscale map in light mode */
.maplibregl-canvas {
  filter: grayscale(100%) contrast(1.1);
}

/* Dark grayscale map in dark mode */
.dark .maplibregl-canvas {
  filter: grayscale(100%) invert(1) contrast(0.9) brightness(0.9);
}
```

## 3D Buildings

### How It Works

The 3D buildings layer is added dynamically in `map-container.tsx`:

1. **Source**: Uses the vector tile source from Liberty style (`openmaptiles`)
2. **Source Layer**: `building` (contains polygon footprints + heights)
3. **Layer Type**: `fill-extrusion` (3D polygons)
4. **Height Data**: `render_height` and `render_min_height` properties

### Key Code (`add3DLayers` function)

```typescript
map.addLayer({
  id: "3d-buildings",
  source: buildingSource,      // From Liberty style
  "source-layer": "building",  // Building footprints
  type: "fill-extrusion",
  minzoom: 13,
  paint: {
    "fill-extrusion-height": ["get", "render_height"],
    "fill-extrusion-base": ["get", "render_min_height"],
    // ... color expressions for theme
  },
});
```

### Why Liberty Style is Required

The `render_height` property only exists in certain styles:
- **Liberty**: YES (modified from Maputnik, has heights)
- **Positron**: NO (focused on clean look, removed 3D data)
- **Dark**: NO (fork of OpenMapTiles without height processing)

## Marker Colors

Marker stroke colors are theme-aware:
- **Dark mode**: White stroke (`rgba(255, 255, 255, 0.9)`)
- **Light mode**: Dark gray stroke (`rgba(50, 50, 50, 0.8)`)

This is controlled in `map-markers.tsx` via the `isDark` prop.

## Status Bar Colors

Active elements in the status bar:
- **Dark mode**: White (`#ffffff`)
- **Light mode**: Black (`#1a1a1a`)

## Common Mistakes to Avoid

### 1. Changing Map Styles for Theming
**WRONG:**
```typescript
export const MAP_STYLES_BY_THEME = {
  light: ".../positron",  // BREAKS 3D!
  dark: ".../dark",       // BREAKS 3D!
};
```

**RIGHT:**
```typescript
export const MAP_STYLES_BY_THEME = {
  light: ".../liberty",
  dark: ".../liberty",    // Same style, CSS handles theming
};
```

### 2. Removing CSS Filters
The CSS filters in `globals.css` are essential for the grayscale look. Don't remove them!

### 3. Hardcoding Theme Colors
Always use theme-aware colors:
- Pass `isDark` prop to components that need it
- Use CSS variables where possible
- For MapLibre (which can't use CSS vars), pass color values as props

## Troubleshooting

### 3D Buildings Not Showing

1. Check that Liberty style is being used
2. Verify zoom level is > 13 (buildings only render at higher zooms)
3. Check browser console for "3D" log messages
4. Ensure 3D mode is toggled on in the status bar

### Wrong Colors in Theme

1. CSS filters not applying? Check `globals.css` is loaded
2. Marker colors wrong? Check `isDark` prop is passed to MapMarkers
3. Status bar colors wrong? Check `activeColor` variable in MapStatusBar

### Style Not Loading

1. Check network tab for tile requests
2. Verify OpenFreeMap is accessible
3. Check for CORS errors

## Testing Changes

Before committing map changes:

1. Test light mode with 3D buildings ON
2. Test dark mode with 3D buildings ON
3. Toggle theme while 3D is active
4. Verify marker colors change with theme
5. Verify status bar colors change with theme
