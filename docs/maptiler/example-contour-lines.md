# Add Contour Lines.

This example shows how to add contour lines to your map from a raster-dem source. In this particular case, the contour lines are generated dynamically on the client side, specifically in the browser, through the utilization of the maplibre-contour plugin.

If you require accurate and precise contour lines, it is advisable to utilize the data derived from the [Global Contours offered by MapTiler](https://cloud.maptiler.com/tiles/contours/).

The Global Contours, created by MapTiler, contains contour lines for locations all around the globe in two widely used unit systems: meters and feet. With its global coverage, MapTiler’s contour lines can be utilized for various purposes, such as outdoor recreation planning, landscape analysis, and cartographic visualization.

Add Contour Lines

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Add Contour Lines</title>
<script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
<link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
<script src="https://unpkg.com/maplibre-contour@0.0.5/dist/index.min.js"></script>
<style>
  body {margin: 0; padding: 0;}
  #map {position: absolute; top: 0; bottom: 0; width: 100%;}
</style>
</head>
<body>
<div id="map"></div>

<script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

    const map = new maptilersdk.Map({
      container: 'map',
      style: DATAVIZ.LIGHT,
      zoom: 13.42,
      center: [-148.63567, 62.03381],
    });

    const demSource = new mlcontour.DemSource({
      url: `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${maptilersdk.config.apiKey}`,
      encoding: 'mapbox',
      maxzoom: 12,
      // offload contour line computation to a web worker
      worker: true
    });

    // calls maplibregl.addProtocol to register a dynamic vector tile provider that
    // downloads raster-dem tiles, computes contour lines, and encodes as a vector
    // tile for each tile request from maplibre
    demSource.setupMaplibre(maptilersdk);

    map.on('load', function () {
      map.addSource("hillshadeSource", {
        "type": "raster-dem",
        // share cached raster-dem tiles with the contour source
        tiles: [demSource.sharedDemProtocolUrl],
        maxzoom: 14
      });

      map.addSource("contourSourceFeet", {
        type: 'vector',
        tiles: [\
          demSource.contourProtocolUrl({\
            // meters to feet\
            multiplier: 3.28084,\
            overzoom: 1,\
            thresholds: {\
              // zoom: [minor, major]\
              11: [200, 1000],\
              12: [100, 500],\
              13: [100, 500],\
              14: [50, 200],\
              15: [20, 100]\
            },\
            elevationKey: 'ele',\
            levelKey: 'level',\
            contourLayer: 'contours'\
          })\
        ],
        maxzoom: 15
      });

      map.addLayer({
        id: 'hills',
        type: 'hillshade',
        source: 'hillshadeSource',
        layout: { visibility: 'visible' },
        paint: { 'hillshade-exaggeration': 0.25 }
      });

      map.addLayer({
        id: 'contours',
        type: 'line',
        source: 'contourSourceFeet',
        'source-layer': 'contours',
        paint: {
          'line-opacity': 0.5,
          // "major" contours have level=1, "minor" have level=0
          'line-width': ['match', ['get', 'level'], 1, 1, 0.5]
        }
      });

      map.addLayer({
        id: 'contour-text',
        type: 'symbol',
        source: 'contourSourceFeet',
        'source-layer': 'contours',
        filter: ['>', ['get', 'level'], 0],
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 1
        },
        layout: {
          'symbol-placement': 'line',
          'text-size': 10,
          'text-field': [\
            'concat',\
            ['number-format', ['get', 'ele'], {}],\
            '\''\
          ],
          'text-font': ['Noto Sans Bold']
        }
      });

    });

</script>
</body>
</html>
```

HTML

Copy

```bash
npm install --save @maptiler/sdk
```

Bash

Copy

main.js

```javascript
import { Map, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

const map = new Map({
  container: 'map',
  style: DATAVIZ.LIGHT,
  zoom: 13.42,
  center: [-148.63567, 62.03381],
});

const demSource = new mlcontour.DemSource({
  url: `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${config.apiKey}`,
  encoding: 'mapbox',
  maxzoom: 12,
  // offload contour line computation to a web worker
  worker: true
});

// calls maplibregl.addProtocol to register a dynamic vector tile provider that
// downloads raster-dem tiles, computes contour lines, and encodes as a vector
// tile for each tile request from maplibre
demSource.setupMaplibre(maptilersdk);

map.on('load', function () {
  map.addSource("hillshadeSource", {
    "type": "raster-dem",
    // share cached raster-dem tiles with the contour source
    tiles: [demSource.sharedDemProtocolUrl],
    maxzoom: 14
  });

  map.addSource("contourSourceFeet", {
    type: 'vector',
    tiles: [\
      demSource.contourProtocolUrl({\
        // meters to feet\
        multiplier: 3.28084,\
        overzoom: 1,\
        thresholds: {\
          // zoom: [minor, major]\
          11: [200, 1000],\
          12: [100, 500],\
          13: [100, 500],\
          14: [50, 200],\
          15: [20, 100]\
        },\
        elevationKey: 'ele',\
        levelKey: 'level',\
        contourLayer: 'contours'\
      })\
    ],
    maxzoom: 15
  });

  map.addLayer({
    id: 'hills',
    type: 'hillshade',
    source: 'hillshadeSource',
    layout: { visibility: 'visible' },
    paint: { 'hillshade-exaggeration': 0.25 }
  });

  map.addLayer({
    id: 'contours',
    type: 'line',
    source: 'contourSourceFeet',
    'source-layer': 'contours',
    paint: {
      'line-opacity': 0.5,
      // "major" contours have level=1, "minor" have level=0
      'line-width': ['match', ['get', 'level'], 1, 1, 0.5]
    }
  });

  map.addLayer({
    id: 'contour-text',
    type: 'symbol',
    source: 'contourSourceFeet',
    'source-layer': 'contours',
    filter: ['>', ['get', 'level'], 0],
    paint: {
      'text-halo-color': 'white',
      'text-halo-width': 1
    },
    layout: {
      'symbol-placement': 'line',
      'text-size': 10,
      'text-field': [\
        'concat',\
        ['number-format', ['get', 'ele'], {}],\
        '\''\
      ],
      'text-font': ['Noto Sans Bold']
    }
  });

});
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Add Contour Lines</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div id="map"></div>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

HTML

Copy

style.css

```css
✖ Error: File does not exist or is empty
```

CSS

Copy

## Related examples

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![Switch between contour lines heights in meters and feet.](https://docs.maptiler.com/assets/img/example-card.png)**Switch between contour lines heights in meters and feet** Example\\
Change the units for the altitude of the contour lines, converting from meters to feet. The Global Contours schema, created by MapTiler, contains contour lines in both common unit systems meters and feet.](https://docs.maptiler.com/sdk-js/examples/contour-meter-feet/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/contour-lines/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add Contour Lines.

Add Contour Lines

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)