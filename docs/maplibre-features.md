# MapLibre GL JS Feature Reference

> Planning reference for the Moonshots & Magic Orlando Event Map.
> MapLibre GL JS **v5.17.0** | OpenFreeMap Liberty tiles | Next.js App Router

---

## Table of Contents

1. [Current Setup](#1-current-setup)
2. [3D Buildings](#2-3d-buildings)
3. [Terrain & Elevation](#3-terrain--elevation)
4. [Sky & Atmosphere](#4-sky--atmosphere)
5. [Camera Controls](#5-camera-controls)
6. [Custom 3D Layers](#6-custom-3d-layers)
7. [Map Styling](#7-map-styling)
8. [Tile Sources](#8-tile-sources)
9. [Interactive Features](#9-interactive-features)
10. [Performance](#10-performance)

---

## 1. Current Setup

### What we use today

| Capability | Implementation | File |
|---|---|---|
| Tile provider | OpenFreeMap Liberty (free, no API key) | `src/lib/map/config.ts` |
| 3D buildings | `fill-extrusion` layer from `openmaptiles` vector source | `src/components/map/map-container.tsx` |
| Camera animations | `flyTo()` / `easeTo()` for flyover tours | `src/lib/flyover/camera-animator.ts` |
| Dark mode | CSS `filter` on `.maplibregl-canvas` (brightness, saturation, contrast) | `src/app/globals.css` |
| Event markers | GeoJSON `circle` layers with data-driven category colors | `src/components/map/map-markers.tsx` |
| Heatmap | `heatmap` layer for event density visualization | `src/components/map/map-hotspots.tsx` |
| Popups | `maplibregl.Popup` with click handlers on the events layer | `src/components/map/map-popups.tsx` |
| Map context | React context providing the `Map` instance to child components | `src/components/map/use-map.ts` |
| Venue highlight | Dynamic GeoJSON `circle` layers during flyover tours | `src/components/map/map-container.tsx` |

### Style architecture

Both light and dark themes use the same Liberty style URL. Dark mode is achieved through CSS filters rather than switching styles, because only Liberty contains the `render_height` property needed for 3D building extrusion.

```css
/* Light mode */
.maplibregl-canvas {
  filter: saturate(0.85) contrast(1.05);
}

/* Dark mode */
.dark .maplibregl-canvas {
  filter: brightness(0.55) saturate(0.55) contrast(1.15);
}
```

### Map initialization

```typescript
const instance = new maplibregl.Map({
  container: containerRef.current,
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [-81.3792, 28.5383], // Orlando
  zoom: 10,
  pitch: 0,
  bearing: 0,
  attributionControl: {},
});
```

---

## 2. 3D Buildings

### What it does

The `fill-extrusion` layer type renders 2D polygon geometries as 3D extruded shapes. Each building footprint is lifted vertically based on its height data, producing a cityscape effect.

### Key properties

| Paint property | Type | Description |
|---|---|---|
| `fill-extrusion-height` | number / expression | Top of the extrusion in meters |
| `fill-extrusion-base` | number / expression | Bottom of the extrusion in meters |
| `fill-extrusion-color` | color / expression | Fill color of the extruded shape |
| `fill-extrusion-opacity` | number (0-1) | Overall layer opacity |
| `fill-extrusion-translate` | [x, y] | Offset in pixels |
| `fill-extrusion-pattern` | string | Name of image in sprite to use as fill pattern |

### Lighting

MapLibre applies a built-in directional light to `fill-extrusion` layers. The light is configured at the style root level:

```typescript
// Style-level light configuration
const style = {
  version: 8,
  light: {
    anchor: "viewport",        // "viewport" or "map"
    color: "#ffffff",
    intensity: 0.5,            // 0 to 1
    position: [1.15, 210, 30], // [radial, azimuth, polar]
  },
  // ...sources, layers
};
```

- `anchor: "viewport"` -- light rotates with the camera (good for UI consistency).
- `anchor: "map"` -- light is fixed to map north (good for realism, sun simulation).

### Data-driven styling (current implementation)

The project uses `interpolate` expressions to color buildings by height:

```typescript
map.addLayer({
  id: "3d-buildings",
  source: "openmaptiles",
  "source-layer": "building",
  type: "fill-extrusion",
  minzoom: 13,
  paint: {
    "fill-extrusion-color": isDark
      ? [
          "interpolate", ["linear"],
          ["coalesce", ["get", "render_height"], ["get", "height"], 10],
          0, "#1e1e3a",
          50, "#2e2e5a",
          100, "#4040a0",
          200, "#5858c0",
        ]
      : [
          "interpolate", ["linear"],
          ["coalesce", ["get", "render_height"], ["get", "height"], 10],
          0, "#9090a0",
          50, "#7070a0",
          100, "#5050a0",
          200, "#3030a0",
        ],
    "fill-extrusion-height": [
      "interpolate", ["linear"], ["zoom"],
      13, 0,
      14.5, ["coalesce", ["get", "render_height"], ["get", "height"], 10],
    ],
    "fill-extrusion-base": ["get", "render_min_height"],
    "fill-extrusion-opacity": 0.85,
  },
});
```

### Considerations / gotchas

- **Height data availability**: Only the Liberty style from OpenFreeMap includes `render_height`. Positron, Dark, and Bright styles do not.
- **minzoom**: Buildings should only render at zoom 13+ to avoid visual clutter and performance issues at lower zooms.
- **Label ordering**: Pass a `beforeId` to `addLayer()` to render buildings below text labels. Find the first `symbol` layer with `text-field` and insert the extrusion layer before it.
- **Style reloads**: When calling `setStyle()` (e.g., on theme change), all custom layers are removed. Re-add the 3D layer in the `style.load` event handler.
- **Opacity interaction**: `fill-extrusion-opacity` applies to the entire layer, not individual features. Per-feature opacity requires `fill-extrusion-color` with an alpha channel via expressions.

### Relevance to this project

Currently implemented. The 3D toggle in the status bar adds/removes the `fill-extrusion` layer and animates the camera pitch to 50 degrees. During flyovers, pitch reaches 60 degrees with zoom 17.5 for dramatic building views.

---

## 3. Terrain & Elevation

### What it does

Raster DEM (Digital Elevation Model) sources provide per-pixel elevation data that MapLibre uses to warp the entire map surface into 3D terrain. Unlike `fill-extrusion` (which only extrudes vector polygons), terrain deforms everything: raster tiles, vector features, labels, and even custom layers.

### Key API methods

```typescript
// Add a raster-dem source
map.addSource("terrain-dem", {
  type: "raster-dem",
  url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
  tileSize: 256,
});

// Enable 3D terrain
map.setTerrain({
  source: "terrain-dem",
  exaggeration: 1.5, // multiplier for elevation (1 = real scale)
});

// Disable terrain
map.setTerrain(null);

// Query terrain elevation at a point
const elevation = map.queryTerrainElevation(lngLat);
```

### Terrain control widget

```typescript
map.addControl(
  new maplibregl.TerrainControl({
    source: "terrain-dem",
    exaggeration: 1,
  })
);
```

### Hillshade layer

Hillshade provides shaded relief visualization independent of (or combined with) 3D terrain:

```typescript
map.addSource("hillshade-source", {
  type: "raster-dem",
  url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
  tileSize: 256,
});

map.addLayer({
  id: "hillshade-layer",
  type: "hillshade",
  source: "hillshade-source",
  paint: {
    "hillshade-shadow-color": "#473B24",
    "hillshade-highlight-color": "#ffffff",
    "hillshade-accent-color": "#000000",
    "hillshade-illumination-direction": 315, // degrees, NW default
    "hillshade-illumination-anchor": "viewport", // or "map"
    "hillshade-exaggeration": 0.5, // 0 to 1
  },
});
```

### Free DEM tile providers

| Provider | URL | Notes |
|---|---|---|
| MapLibre Demo Tiles | `https://demotiles.maplibre.org/terrain-tiles/tiles.json` | Low resolution, demo only |
| MapTiler | `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=KEY` | Requires API key, free tier available |
| AWS Terrain Tiles | `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png` | Terrarium encoding, free |

### Considerations / gotchas

- **Terrain + fill-extrusion**: 3D buildings sit on top of 3D terrain, which can look impressive for hilly cities but is redundant for flat areas like Orlando.
- **Performance**: Terrain rendering requires decoding DEM tiles on the GPU. Adds ~10-20% overhead to rendering time.
- **maxPitch**: With terrain enabled, `maxPitch` can go up to 85 degrees (default 60 without terrain).
- **Hillshade + terrain interaction**: When both hillshade layers and `setTerrain()` are active, the hillshade relighting can produce visual artifacts. Use separate DEM sources for hillshade vs. terrain if needed.
- **Label placement**: Labels and symbols are automatically draped onto terrain, but their collision detection may behave differently on sloped surfaces.
- **exaggeration**: Values above 2 produce dramatic but unrealistic effects. For Orlando's flat terrain, values of 1.5-3 would be needed to see any visible difference.

### Relevance to this project

Orlando is flat (elevation ~30m), so terrain would have minimal visual impact on the event map itself. However, terrain could enhance flyover tours of nearby areas (e.g., scenic routes to the coast) or serve as a "wow factor" feature toggle. The bigger win would be combining terrain with the sky layer for atmosphere during flyovers.

---

## 4. Sky & Atmosphere

### What it does

The `sky` layer type renders a gradient sky dome above the map, creating atmosphere effects visible when the camera is pitched. Combined with terrain and fog, it produces realistic outdoor scenes. The sky definition is still marked as experimental in the MapLibre style spec.

### Sky properties

| Property | Type | Default | Description |
|---|---|---|---|
| `sky-color` | color | `#88C6FC` | Base color of the sky at zenith |
| `horizon-color` | color | `#ffffff` | Color at the horizon line |
| `fog-color` | color | `#ffffff` | Fog color over 3D terrain (requires terrain) |
| `fog-ground-blend` | number (0-1) | `0.5` | How far fog extends from center (0) to horizon (1) |
| `horizon-fog-blend` | number (0-1) | `0.8` | Blend between horizon and fog color |
| `sky-horizon-blend` | number (0-1) | `0.8` | Blend between sky and horizon (1 = blend at mid-sky) |
| `atmosphere-blend` | number (0-1) | `0.8` | Overall atmosphere visibility (1 = visible, 0 = hidden) |

All properties support `interpolate` expressions and are transitionable.

### Setting up sky in the style

```typescript
// Sky can be set in the style object
const style = {
  version: 8,
  sky: {
    "sky-color": "#1a0a2e",        // Deep purple for night feel
    "horizon-color": "#2d1b69",    // Brand purple at horizon
    "fog-color": "#0a0a1a",
    "atmosphere-blend": 0.8,
    "sky-horizon-blend": 0.5,
  },
  // ...
};

// Or set dynamically after style loads
map.setSky({
  "sky-color": "#88C6FC",
  "horizon-color": "#ffffff",
  "atmosphere-blend": 0.8,
});
```

### Light configuration (affects sky appearance)

The sky uses the style's `light` property to determine sun position and atmospheric scattering:

```typescript
map.setLight({
  anchor: "map",
  color: "#ffd700",
  intensity: 0.4,
  position: [1.5, 180, 45], // [radial, azimuth (degrees), polar (degrees)]
});
```

### Globe projection with atmosphere

MapLibre v5+ supports globe projection with an atmosphere effect:

```typescript
map.on("style.load", () => {
  map.setProjection({ type: "globe" });

  map.setSky({
    "sky-color": "#88C6FC",
    "atmosphere-blend": 0.9,
  });
});
```

### Fog (separate from sky)

MapLibre also supports a `fog` configuration on the style for depth-based fading:

```typescript
map.setFog({
  range: [0.5, 10],          // [near, far] in multiples of map height
  color: "rgba(255,255,255,0.5)",
  "horizon-blend": 0.1,
});
```

### Considerations / gotchas

- **Experimental**: The sky spec is under active development. API may change between MapLibre versions.
- **Requires pitch**: Sky is only visible when the camera is pitched. At pitch 0, the sky is not in view.
- **CSS filter interaction**: Our CSS filter-based dark mode (`brightness`, `invert`, etc.) will also affect the sky rendering. May need to adjust sky colors to compensate, or switch to a native theming approach when sky is enabled.
- **Globe projection**: `setProjection({ type: "globe" })` must be called after `style.load`. Produces a 3D globe at low zoom levels. Not compatible with all layer types.
- **Performance**: Sky rendering adds minimal overhead. Fog with terrain adds moderate overhead.

### Relevance to this project

Sky and atmosphere would dramatically enhance the flyover tour experience. When the camera pitches to 60 degrees during flyover, a branded sky gradient (deep purple to gold matching Moonshots & Magic colors) would create an immersive cinematic feel. This pairs naturally with the existing 3D buildings and could be toggled on during flyover mode.

---

## 5. Camera Controls

### What it does

MapLibre provides multiple methods for programmatic camera movement, from instant jumps to smooth cinematic animations. The camera is defined by center, zoom, pitch, bearing, and roll.

### Camera state methods

```typescript
// Read current state
const center = map.getCenter();   // LngLat
const zoom = map.getZoom();       // number
const pitch = map.getPitch();     // degrees (0-85)
const bearing = map.getBearing(); // degrees (0-360)
const bounds = map.getBounds();   // LngLatBounds

// Set state instantly
map.setCenter([-81.3792, 28.5383]);
map.setZoom(14);
map.setPitch(45);
map.setBearing(90);

// Jump to a full camera state (no animation)
map.jumpTo({
  center: [-81.3792, 28.5383],
  zoom: 14,
  pitch: 45,
  bearing: 90,
});
```

### Animated transitions

#### `flyTo(options)`

Sigmoid-curve animation that zooms out, pans, and zooms in. Best for large distance transitions.

```typescript
map.flyTo({
  center: [-81.3730, 28.5431],   // Lake Eola
  zoom: 15,
  pitch: 50,
  bearing: -20,
  duration: 5000,                // ms
  curve: 1.42,                   // zoom curve factor (default 1.42)
  speed: 1.2,                    // screenfulls/second
  maxDuration: 8000,             // cap animation length
  essential: true,               // bypass prefers-reduced-motion
  padding: { top: 100 },         // viewport padding
  easing: (t) => t,              // custom easing function
});
```

#### `easeTo(options)`

Linear interpolation animation. Best for small adjustments (pitch change, slight pan).

```typescript
map.easeTo({
  center: [-81.3730, 28.5431],
  zoom: 15,
  pitch: 50,
  bearing: -20,
  duration: 1000,
  easing: (t) => t * (2 - t),   // ease-out quadratic
  padding: { left: 300 },
});
```

#### `rotateTo(bearing, options)`

Rotates to a specific bearing with animation.

```typescript
map.rotateTo(90, {
  duration: 2000,
  easing: (t) => t,
});
```

#### `fitBounds(bounds, options)`

Adjusts the camera to fit geographic bounds in the viewport.

```typescript
map.fitBounds(
  [[-81.5, 28.4], [-81.2, 28.7]], // SW and NE corners
  {
    padding: { top: 50, bottom: 50, left: 50, right: 50 },
    maxZoom: 15,
    duration: 2000,
  }
);
```

### FreeCameraAPI

For advanced camera control, MapLibre exposes physical camera properties:

```typescript
const camera = map.getFreeCameraOptions();

// Set camera position in 3D space
camera.position = maplibregl.MercatorCoordinate.fromLngLat(
  [-81.3792, 28.5383],
  1000 // altitude in meters
);

// Point camera at a location
camera.lookAtPoint([-81.3730, 28.5431]);

// Apply
map.setFreeCameraOptions(camera);
```

### Animation events

```typescript
map.on("movestart", () => { /* animation began */ });
map.on("move", () => { /* each frame */ });
map.on("moveend", () => { /* animation complete */ });

// Also: zoomstart/zoom/zoomend, pitchstart/pitch/pitchend,
//        rotatestart/rotate/rotateend
```

### Considerations / gotchas

- **`essential: true`**: By default, MapLibre respects `prefers-reduced-motion` and skips animations. Set `essential: true` to always animate (use sparingly, respect accessibility).
- **Event stacking**: Calling `flyTo()` while another `flyTo()` is in progress cancels the first. The `moveend` event fires for the cancelled animation, which can cause race conditions. The current project handles this by listening for `moveend` and using an abort ref.
- **Padding**: The `padding` option shifts the effective center of the viewport. Useful when a sidebar covers part of the map. Values are in pixels: `{ top, bottom, left, right }`.
- **maxPitch**: Default is 60 degrees (85 with terrain). Going beyond 60 without terrain causes rendering artifacts.
- **`curve` parameter**: The default 1.42 is based on user perception research. Lower values (< 1) make `flyTo` behave more like `easeTo`. Higher values produce more dramatic zoom-out-then-in arcs.
- **Duration cap**: For very long distances, `flyTo` duration can be excessively long. Use `maxDuration` or `speed` to cap it.

### Relevance to this project

Camera animation is the backbone of the flyover tour system. The current implementation uses `flyTo()` with `curve: 1.42` for waypoint transitions and `easeTo()` for pitch/bearing adjustments. The `FreeCameraAPI` could enable more advanced cinematic sequences like orbital camera paths around venues or smooth altitude transitions.

---

## 6. Custom 3D Layers

### What it does

The `CustomLayerInterface` lets you inject raw WebGL rendering into the MapLibre pipeline. This enables placing arbitrary 3D models (GLTF, OBJ), particle systems, or custom WebGL effects at geographic coordinates on the map.

### CustomLayerInterface

```typescript
interface CustomLayerInterface {
  id: string;                    // Unique layer ID
  type: "custom";                // Must be "custom"
  renderingMode?: "2d" | "3d";  // "3d" enables depth buffer sharing

  onAdd?(map: Map, gl: WebGLRenderingContext | WebGL2RenderingContext): void;
  onRemove?(map: Map, gl: WebGLRenderingContext | WebGL2RenderingContext): void;
  prerender?(gl: WebGLRenderingContext, matrix: number[]): void;
  render(gl: WebGLRenderingContext, matrix: number[]): void;
}
```

### three.js integration

The most common use case is rendering three.js scenes inside MapLibre:

```typescript
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import maplibregl from "maplibre-gl";

const modelOrigin: [number, number] = [-81.3730, 28.5431]; // Lake Eola
const modelAltitude = 0;

const modelAsMercator = maplibregl.MercatorCoordinate.fromLngLat(
  modelOrigin,
  modelAltitude
);

// Scale factor: meters to Mercator units at this latitude
const modelScale = modelAsMercator.meterInMercatorCoordinateUnits();

const customLayer: maplibregl.CustomLayerInterface = {
  id: "3d-model",
  type: "custom",
  renderingMode: "3d",

  onAdd(map, gl) {
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, -70, 100).normalize();
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load("/models/venue-marker.glb", (gltf) => {
      this.scene.add(gltf.scene);
    });

    // Renderer using MapLibre's canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl as WebGLRenderingContext,
      antialias: true,
    });
    this.renderer.autoClear = false;

    this.map = map;
  },

  render(gl, matrix) {
    // Build transformation matrix
    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      Math.PI / 2
    );
    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      Math.PI
    );

    const m = new THREE.Matrix4().fromArray(matrix);
    const translate = new THREE.Matrix4().makeTranslation(
      modelAsMercator.x,
      modelAsMercator.y,
      modelAsMercator.z!
    );
    const scale = new THREE.Matrix4().makeScale(
      modelScale,
      -modelScale,
      modelScale
    );

    this.camera.projectionMatrix = m
      .multiply(translate)
      .multiply(scale)
      .multiply(rotationX)
      .multiply(rotationZ);

    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  },
};

map.on("style.load", () => {
  map.addLayer(customLayer);
});
```

### Using `getMatrixForModel` (recommended for globe compatibility)

```typescript
// Simpler approach that works with globe projection too
const matrix = map.getMatrixForModel(
  modelOrigin,   // [lng, lat]
  modelAltitude  // meters
);
```

### Community plugins

- **maplibre-three-plugin**: Bridge plugin connecting MapLibre with three.js. Simplifies the matrix math and provides a higher-level API for adding three.js objects.
- **deck.gl**: Works as a custom layer with MapLibre for advanced 3D data visualization (point clouds, hex grids, arc layers).

### Considerations / gotchas

- **`renderingMode: "3d"`**: Required for proper depth buffer interaction with other 3D layers (buildings, terrain). Without it, custom objects may render in wrong z-order.
- **`triggerRepaint()`**: Must be called in `render()` if the scene has animations. Otherwise the map only repaints on user interaction.
- **WebGL context sharing**: The three.js renderer shares MapLibre's WebGL context. Call `renderer.resetState()` before rendering to avoid state conflicts.
- **`autoClear: false`**: Critical. Prevents three.js from clearing MapLibre's framebuffer.
- **Bundle size**: three.js adds ~150KB gzipped. Consider dynamic imports (`import("three")`) to keep initial load fast.
- **Style reload**: Custom layers must be re-added after `setStyle()`. Listen for `style.load`.
- **Coordinate system**: MapLibre uses Mercator coordinates internally. Use `MercatorCoordinate.fromLngLat()` to convert geographic coordinates.

### Relevance to this project

Custom 3D layers could enable placing 3D venue models or animated event markers at event locations. For example, a glowing 3D crystal at featured event sites, or animated 3D icons representing event categories. The trade-off is bundle size (three.js) and complexity. A phased approach would be to start with simple WebGL shaders for effects (particle bursts, glow rings) before adding full three.js GLTF models.

---

## 7. Map Styling

### What it does

MapLibre provides extensive runtime style manipulation. Every visual aspect of the map (colors, widths, opacity, visibility, text) can be changed programmatically without reloading tiles.

### Runtime style methods

```typescript
// Change paint properties (visual appearance)
map.setPaintProperty("events-layer", "circle-color", "#ff0000");
map.setPaintProperty("events-layer", "circle-radius", 10);
map.setPaintProperty("3d-buildings", "fill-extrusion-opacity", 0.5);

// Change layout properties (structural)
map.setLayoutProperty("labels", "text-size", 14);
map.setLayoutProperty("buildings", "visibility", "none");

// Read current values
const color = map.getPaintProperty("events-layer", "circle-color");
const visibility = map.getLayoutProperty("buildings", "visibility");

// Get full style
const style = map.getStyle();
```

### Layer management

```typescript
// Add a new layer
map.addLayer({
  id: "route-line",
  type: "line",
  source: "route",
  paint: {
    "line-color": "#ff6b6b",
    "line-width": 4,
    "line-opacity": 0.8,
  },
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
});

// Add layer below another layer
map.addLayer(layerConfig, "labels-layer-id");

// Remove a layer
map.removeLayer("route-line");

// Check if layer exists
if (map.getLayer("3d-buildings")) { /* ... */ }

// Get all layer IDs
const layerIds = map.getStyle().layers.map((l) => l.id);
```

### Filter expressions

```typescript
// Show only specific categories
map.setFilter("events-layer", [
  "in",
  ["get", "category"],
  ["literal", ["music", "arts", "tech"]],
]);

// Complex filter
map.setFilter("events-layer", [
  "all",
  ["==", ["get", "featured"], true],
  [">=", ["get", "startDate"], "2025-01-01"],
]);

// Remove filter
map.setFilter("events-layer", null);
```

### Data-driven expressions

MapLibre's expression language enables styling based on feature properties and zoom:

```typescript
// Interpolation by zoom
["interpolate", ["linear"], ["zoom"],
  8, 5,    // at zoom 8, radius 5
  16, 14,  // at zoom 16, radius 14
]

// Match by category
["match", ["get", "category"],
  "music", "#ff6b6b",
  "arts", "#b197fc",
  "tech", "#69db7c",
  "#888888",  // fallback
]

// Conditional (case)
["case",
  ["==", ["get", "featured"], true], 20,
  10, // default
]

// Coalesce (first non-null value)
["coalesce", ["get", "render_height"], ["get", "height"], 10]

// Step (discrete ranges)
["step", ["get", "attendees"],
  "#ccc",     // < 50
  50, "#ff0",  // 50-200
  200, "#f00", // 200+
]
```

### Sprite and glyph customization

```typescript
// Load custom icon sprites
map.addImage("event-pin", imageElement);
map.addImage("star-icon", imageElement, { sdf: true }); // SDF for color tinting

// Use in symbol layer
map.addLayer({
  id: "event-icons",
  type: "symbol",
  source: "events",
  layout: {
    "icon-image": "event-pin",
    "icon-size": 0.5,
    "icon-allow-overlap": true,
  },
});

// Custom fonts/glyphs
// Set in style: glyphs: "https://fonts.example.com/{fontstack}/{range}.pbf"
```

### Batched updates

Style changes are batched within a single frame. Multiple `setPaintProperty` calls in sequence execute in one render pass:

```typescript
// These all apply in the same frame (no intermediate renders)
map.setPaintProperty("layer-a", "circle-color", "#ff0000");
map.setPaintProperty("layer-b", "line-width", 3);
map.setLayoutProperty("layer-c", "visibility", "none");
```

### Considerations / gotchas

- **`setPaintProperty` vs `setStyle`**: Individual property changes are much cheaper than full style reloads. Prefer `setPaintProperty`/`setLayoutProperty` for runtime changes.
- **`setStyle` clears everything**: Calling `setStyle()` removes all custom layers, sources, and state. Must re-add in `style.load` handler.
- **CSS variables in MapLibre**: MapLibre paint properties cannot use CSS custom properties. Colors must be literal hex/rgb values. The project passes `isDark` to components that compute MapLibre-compatible colors.
- **Expression performance**: Complex nested expressions evaluate per-feature per-frame. Keep expressions simple for large datasets.
- **SDF icons**: Using `sdf: true` when adding images enables color tinting via `icon-color`, useful for theme-aware icons.
- **`getStyle()` serialization caveat**: Paint properties changed via `setPaintProperty` may not be immediately reflected in `getStyle().layers` due to serialization timing. Use `getPaintProperty()` for reading current values.

### Relevance to this project

Runtime styling is extensively used. Event markers use data-driven `match` expressions for category colors, `interpolate` for zoom-responsive sizing, and `setFilter` for category visibility. The 3D buildings use `interpolate` for height-based coloring. Adding more dynamic styling (time-of-day color shifts, highlight animations, brand-themed layers) would build on these same APIs.

---

## 8. Tile Sources

### What it does

MapLibre supports multiple source types for loading map data. Sources provide the raw data that layers render.

### Source types

| Type | Description | Use case |
|---|---|---|
| `vector` | Protocol Buffer encoded vector tiles | Base map, buildings, roads |
| `raster` | Image tiles (PNG/JPG) | Satellite imagery, raster basemaps |
| `raster-dem` | Elevation data tiles | 3D terrain, hillshade |
| `geojson` | GeoJSON feature collections | Custom points, lines, polygons |
| `image` | Single georeferenced image | Overlays, floor plans |
| `video` | Georeferenced video | Live feeds, timelapse |

### Vector tiles

```typescript
map.addSource("openmaptiles", {
  type: "vector",
  url: "https://tiles.openfreemap.org/styles/liberty", // TileJSON URL
  // OR explicit tiles:
  tiles: ["https://tiles.example.com/{z}/{x}/{y}.pbf"],
  minzoom: 0,
  maxzoom: 14,
});
```

### GeoJSON source (current usage)

```typescript
map.addSource("events", {
  type: "geojson",
  data: geojsonFeatureCollection,
  cluster: false,
});

// Update data dynamically
(map.getSource("events") as maplibregl.GeoJSONSource).setData(newData);
```

### GeoJSON with clustering

```typescript
map.addSource("events-clustered", {
  type: "geojson",
  data: geojsonFeatureCollection,
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50,
  clusterProperties: {
    // Aggregate properties within clusters
    totalEvents: ["+", ["case", ["has", "point_count"], ["get", "point_count"], 1]],
  },
});

// Access cluster methods
const source = map.getSource("events-clustered") as maplibregl.GeoJSONSource;
source.getClusterExpansionZoom(clusterId);
source.getClusterChildren(clusterId);
source.getClusterLeaves(clusterId, limit, offset);
```

### Image source

```typescript
map.addSource("venue-overlay", {
  type: "image",
  url: "/images/venue-floorplan.png",
  coordinates: [
    [-81.3740, 28.5440], // top-left [lng, lat]
    [-81.3720, 28.5440], // top-right
    [-81.3720, 28.5420], // bottom-right
    [-81.3740, 28.5420], // bottom-left
  ],
});
```

### Video source

```typescript
map.addSource("live-cam", {
  type: "video",
  urls: ["/video/webcam.mp4", "/video/webcam.webm"],
  coordinates: [
    [-81.3740, 28.5440],
    [-81.3720, 28.5440],
    [-81.3720, 28.5420],
    [-81.3740, 28.5420],
  ],
});
```

### Free tile providers

| Provider | Free tier | API key | Styles | Notes |
|---|---|---|---|---|
| **OpenFreeMap** | Unlimited | None | Liberty, Positron, Bright | Current provider. Only Liberty has building heights |
| **MapTiler** | 100K tiles/month | Required | Many styles + terrain DEM | Best for terrain. Has satellite imagery |
| **Stadia Maps** | 200K tiles/month | Required | Alidade, Stamen styles | Good Stamen replacements |
| **Protomaps** | Self-hosted via PMTiles | None (self-host) | OSM-based | Single-file tile archives |
| **AWS Open Data** | Free (S3 egress costs) | None | Terrain tiles only | Good DEM source |

### Considerations / gotchas

- **CORS**: Tile servers must serve appropriate CORS headers. OpenFreeMap handles this automatically.
- **Attribution**: Most free providers require attribution. MapLibre's `attributionControl` handles this when configured in the style's source metadata.
- **GeoJSON size**: For datasets over ~5000 features, consider converting to vector tiles or using clustering. Raw GeoJSON is parsed on the main thread.
- **Tile caching**: MapLibre caches tiles in memory. The `maxTileCacheSize` option controls how many tiles are kept (default varies by device).
- **Mixed sources**: You can use different providers for different layers (e.g., OpenFreeMap for base map, MapTiler for terrain DEM).

### Relevance to this project

The project uses OpenFreeMap Liberty for the base map and GeoJSON sources for event markers and heatmap. Future enhancements could add: (1) MapTiler terrain DEM for 3D terrain during flyovers, (2) image sources for venue floor plans at high zoom, (3) clustering for the event markers when the dataset grows beyond 100-200 events.

---

## 9. Interactive Features

### What it does

MapLibre provides a rich event system for user interaction with map features, plus mechanisms for highlighting, popups, custom markers, and dynamic visual state.

### Click and hover events

```typescript
// Layer-specific click
map.on("click", "events-layer", (e: maplibregl.MapLayerMouseEvent) => {
  const feature = e.features?.[0];
  if (!feature) return;

  const props = feature.properties;
  const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

  // Show popup, open panel, etc.
});

// Layer-specific hover
map.on("mouseenter", "events-layer", () => {
  map.getCanvas().style.cursor = "pointer";
});

map.on("mouseleave", "events-layer", () => {
  map.getCanvas().style.cursor = "";
});

// General map click (not on any specific layer)
map.on("click", (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ["events-layer", "venues-layer"],
  });
});
```

### Feature state

Feature state attaches per-feature visual state without modifying the source data. Useful for hover highlights:

```typescript
// Set feature state
map.setFeatureState(
  { source: "events", id: featureId },
  { hover: true, selected: false }
);

// Remove feature state
map.removeFeatureState({ source: "events", id: featureId });

// Use in paint expressions
map.addLayer({
  id: "events-hover",
  type: "circle",
  source: "events",
  paint: {
    "circle-radius": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      16,  // hovered
      10,  // default
    ],
    "circle-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      "#FFD700",  // selected
      ["get", "color"],  // default
    ],
  },
});
```

**Important**: Feature state requires that GeoJSON features have a top-level `id` property (not just inside `properties`), or that the source uses `promoteId`:

```typescript
map.addSource("events", {
  type: "geojson",
  data: geojson,
  promoteId: "id", // promotes properties.id to feature ID
});
```

### Popups

```typescript
const popup = new maplibregl.Popup({
  closeOnClick: true,
  maxWidth: "320px",
  offset: [0, -10],
  className: "custom-popup",
  anchor: "bottom",
})
  .setLngLat(coordinates)
  .setHTML("<h3>Event Title</h3><p>Details...</p>")
  .addTo(map);

// Or with a DOM element
popup.setDOMContent(domElement);

// Remove
popup.remove();

// Events
popup.on("close", () => { /* cleanup */ });
```

### Custom markers (DOM-based)

```typescript
const el = document.createElement("div");
el.className = "custom-marker";
el.innerHTML = `<img src="/icons/pin.svg" />`;

const marker = new maplibregl.Marker({
  element: el,
  anchor: "bottom",
  offset: [0, -5],
  draggable: false,
  rotation: 45,
  pitchAlignment: "map",      // "map" = flat on surface, "viewport" = always upright
  rotationAlignment: "map",
})
  .setLngLat([-81.3730, 28.5431])
  .setPopup(popup)
  .addTo(map);

// Update position
marker.setLngLat(newCoords);

// Remove
marker.remove();
```

### Clusters

```typescript
// Cluster circles (count-based sizing)
map.addLayer({
  id: "clusters",
  type: "circle",
  source: "events-clustered",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step", ["get", "point_count"],
      "#51bbd6",   // < 10
      10, "#f1f075", // 10-50
      50, "#f28cb1", // 50+
    ],
    "circle-radius": [
      "step", ["get", "point_count"],
      20,          // < 10
      10, 30,      // 10-50
      50, 40,      // 50+
    ],
  },
});

// Cluster count labels
map.addLayer({
  id: "cluster-count",
  type: "symbol",
  source: "events-clustered",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-size": 12,
  },
});

// Click to zoom into cluster
map.on("click", "clusters", async (e) => {
  const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
  const clusterId = features[0].properties.cluster_id;
  const source = map.getSource("events-clustered") as maplibregl.GeoJSONSource;
  const zoom = await source.getClusterExpansionZoom(clusterId);
  map.easeTo({ center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number], zoom });
});
```

### Heatmap (current usage)

```typescript
map.addLayer({
  id: "events-heatmap",
  type: "heatmap",
  source: "events-heatmap",
  paint: {
    "heatmap-weight": ["interpolate", ["linear"], ["get", "featured"], 0, 0.5, 1, 1],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 8, 0.3, 14, 1],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 8, 15, 14, 60],
    "heatmap-opacity": 0.3,
    "heatmap-color": [
      "interpolate", ["linear"], ["heatmap-density"],
      0, "rgba(0, 0, 0, 0)",
      0.2, "rgba(53, 96, 255, 0.3)",
      0.6, "rgba(100, 140, 255, 0.6)",
      1, "rgba(255, 255, 255, 0.9)",
    ],
  },
});
```

### queryRenderedFeatures / querySourceFeatures

```typescript
// Query features visible in the viewport
const visibleEvents = map.queryRenderedFeatures(undefined, {
  layers: ["events-layer"],
});

// Query at a specific point (pixel coordinates)
const featuresAtPoint = map.queryRenderedFeatures(e.point, {
  layers: ["events-layer", "3d-buildings"],
});

// Query all features in a source (not just visible)
const allEvents = map.querySourceFeatures("events");
```

### Considerations / gotchas

- **Feature state requires IDs**: GeoJSON features must have numeric or string `id` at the top level (not in properties) for `setFeatureState` to work. Use `promoteId` on the source if IDs are only in properties.
- **DOM markers vs layers**: DOM markers (`maplibregl.Marker`) are rendered in HTML/CSS above the canvas. They do not interact with WebGL layers. For many markers (100+), use circle/symbol layers instead (GPU-rendered).
- **Click event order**: Layer click events fire before general map click events. Use `e.originalEvent.stopPropagation()` carefully.
- **`queryRenderedFeatures` limitations**: Only returns features that are currently rendered in the viewport. Clustered points return cluster features, not individual points.
- **Popup positioning**: Popups auto-flip to stay within the viewport. The `anchor` option is a hint, not a guarantee.
- **Cluster feature IDs**: Clustered features get auto-generated IDs (`cluster_id`). The original feature IDs are accessible via `getClusterLeaves()`.

### Relevance to this project

The project already uses layer click events for popups, cursor changes for hover, and heatmap for event density. Upcoming improvements could include: (1) feature state for hover highlights (glow/enlarge on hover without separate layers), (2) clustering when the event dataset grows, (3) `queryRenderedFeatures` for a "what's visible" event list that updates as the user pans.

---

## 10. Performance

### What it does

MapLibre renders everything via WebGL on the GPU, but performance degrades with excessive layers, large datasets, complex expressions, and heavy overdraw. Understanding the rendering pipeline helps avoid bottlenecks.

### Layer count and types

| Layer type | Relative cost | Notes |
|---|---|---|
| `background` | Minimal | Single full-screen quad |
| `fill` | Low | Simple polygon fill |
| `line` | Low-Medium | Anti-aliased line rendering |
| `circle` | Low | Instanced rendering, very efficient |
| `symbol` | High | Collision detection, glyph rendering, layout calculations |
| `heatmap` | Medium | Framebuffer-based, zoom-dependent |
| `fill-extrusion` | Medium-High | 3D geometry, lighting calculations |
| `hillshade` | Medium | DEM decoding, shading calculations |
| `raster` | Low | Simple texture sampling |
| `custom` | Varies | Depends on your WebGL code |

### Symbol / icon optimization

Symbols are the most expensive layer type due to collision detection:

```typescript
// Disable collision detection for better performance
map.addLayer({
  id: "event-labels",
  type: "symbol",
  source: "events",
  layout: {
    "text-field": ["get", "title"],
    "icon-image": "event-pin",
    "icon-allow-overlap": true,   // Skip collision detection
    "text-allow-overlap": true,   // Skip collision detection
    "text-optional": true,        // Drop text if icon can show
    "symbol-sort-key": ["get", "priority"], // Render important first
  },
});
```

### GeoJSON optimization

```typescript
// Enable clustering to reduce rendered feature count
map.addSource("events", {
  type: "geojson",
  data: geojson,
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50,
  buffer: 128,        // Tile buffer in pixels (default 128)
  tolerance: 0.375,   // Simplification tolerance (default 0.375)
  generateId: true,    // Auto-generate feature IDs
});
```

For datasets over 5000-10000 features, convert to vector tiles (tippecanoe, tilemaker) instead of using raw GeoJSON.

### Viewport culling

MapLibre automatically culls tiles and features outside the viewport:

- **Tile culling**: The `coveringTiles` algorithm calculates which tiles to load based on zoom, pitch, and bearing.
- **Feature culling**: Features outside tile boundaries are not rendered.
- **Frustum culling** (globe): Additional culling for globe projection.
- **minzoom / maxzoom**: Use per-layer `minzoom` and `maxzoom` to avoid rendering at inappropriate zoom levels:

```typescript
map.addLayer({
  id: "detailed-buildings",
  type: "fill-extrusion",
  source: "openmaptiles",
  "source-layer": "building",
  minzoom: 13, // Only render when zoomed in close enough
  maxzoom: 22,
  // ...
});
```

### Reducing overdraw

- **Layer ordering**: Place opaque layers below transparent layers. Avoid stacking multiple semi-transparent layers.
- **Opacity vs. visibility**: Use `setLayoutProperty(layer, "visibility", "none")` to fully skip rendering, rather than `setPaintProperty(layer, "*-opacity", 0)` which still renders at 0 opacity.
- **Conditional layers**: Use `filter` to limit rendered features rather than rendering all features and relying on opacity/color to hide them.

### Tile cache management

```typescript
const map = new maplibregl.Map({
  // ...
  maxTileCacheSize: 100,   // Max tiles in memory cache
  maxTileCacheZoomLevels: 5, // How many zoom levels to cache
});
```

### Measuring performance

```typescript
// Frame timing
map.on("render", () => {
  // Called every frame
  performance.mark("frame-end");
});

// Enable debug info
map.showTileBoundaries = true;
map.showCollisionBoxes = true;
map.showOverdrawInspector = true;

// Repaint tracking
map.repaint = true; // Force continuous repaint for profiling
```

### Practical limits (approximate)

| Metric | Comfortable range | Performance concern |
|---|---|---|
| Total layers | < 50 | > 100 |
| Symbol layers | < 10 | > 20 |
| GeoJSON features | < 5,000 | > 10,000 |
| fill-extrusion features visible | < 10,000 | > 50,000 |
| Custom layers | < 5 | > 10 |
| Tile requests in flight | < 20 | > 50 |

### Considerations / gotchas

- **Symbol collision**: The single biggest performance killer for dense point maps. Disable collision detection (`*-allow-overlap: true`) when visual overlap is acceptable.
- **Style complexity**: Every additional layer adds to the render loop. Combine similar layers where possible (use data-driven styling instead of separate layers per category).
- **3D mode overhead**: Enabling `fill-extrusion` and/or terrain adds 20-40% rendering overhead. The project wisely makes 3D a toggle rather than always-on.
- **GeoJSON parsing**: Large GeoJSON datasets block the main thread during parsing. Use `worker: true` (default) to parse in a web worker.
- **CSS filters**: The CSS filter approach for dark mode adds a compositing pass. This is cheaper than maintaining separate style layers but still has some cost.
- **Mobile**: Mobile GPUs have significantly less headroom. Test performance on real devices, especially with terrain + fill-extrusion + heatmap combined.
- **Memory**: Each source loads tiles into GPU memory. A single vector tile source at zoom 14 can load 50-100 tiles. Monitor memory usage with `performance.memory` (Chrome only).

### Relevance to this project

With ~50 events, the current dataset is well within performance limits. The main performance considerations are: (1) the 3D buildings layer at high zoom (thousands of extruded polygons), (2) the heatmap + glow + marker layer stack (3 circle layers + 1 heatmap), and (3) flyover animations which continuously trigger repaints. As the event dataset grows toward hundreds of events, adding clustering would be the first optimization to consider. For the flyover tour, reducing visible layers during animation (hiding heatmap, simplifying markers) would improve frame rates.

---

## Appendix: Feature Priority Matrix

Features ranked by impact and effort for the Orlando event map:

| Feature | Impact | Effort | Depends on |
|---|---|---|---|
| Sky/atmosphere during flyover | High | Low | Existing 3D + flyover |
| Feature state hover highlights | Medium | Low | Existing markers |
| Marker clustering | Medium | Low | Growing dataset |
| Terrain + hillshade | Low | Medium | MapTiler API key for good DEM |
| Custom 3D venue markers | High | High | three.js integration |
| Globe projection intro | Medium | Low | Just `setProjection` call |
| `fitBounds` for search results | Medium | Low | Existing search |
| Image overlay for venues | Low | Medium | Venue floor plan assets |
| Fog for depth during flyover | Medium | Low | Existing flyover |
| FreeCameraAPI orbital tours | High | Medium | Camera math |
