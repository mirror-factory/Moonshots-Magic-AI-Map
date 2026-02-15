# Create a globe map with ocean bathymetry terrain elevation

Show a detailed 3D globe map of the ocean’s seafloor and its bathymetry.

Increase the authenticity of your web mapping applications and data by using the globe projection and incorporating ocean relief into your maps. This will provide a greater sense of realism and depth to your visuals.

MapTiler Globe projection

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MapTiler Globe projection</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style:  'ocean',
        maxPitch: 85,
        center: [165.9043, 54.7078], // starting position [lng, lat]
        zoom: 10.04, // starting zoom
        bearing: -33.2,
        pitch: 72,
        projection: 'globe' //enable globe projection
      });

      map.on('load', function() {
        map.addSource("bathymetry", {
          type: 'raster-dem',
          url: 'https://api.maptiler.com/tiles/ocean-rgb/tiles.json',
        });
        map.setTerrain({ source: 'bathymetry', exaggeration: 1.5 });
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
  container: 'map', // container's id or the HTML element to render the map
  style:  'ocean',
  maxPitch: 85,
  center: [165.9043, 54.7078], // starting position [lng, lat]
  zoom: 10.04, // starting zoom
  bearing: -33.2,
  pitch: 72,
  projection: 'globe' //enable globe projection
});

map.on('load', function() {
  map.addSource("bathymetry", {
    type: 'raster-dem',
    url: 'https://api.maptiler.com/tiles/ocean-rgb/tiles.json',
  });
  map.setTerrain({ source: 'bathymetry', exaggeration: 1.5 });
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
  <title>MapTiler Globe projection</title>
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

[![Projection control how to toggle the map between mercator and globe projection](https://docs.maptiler.com/assets/img/example-card.png)**Projection control (globe)** Example\\
This tutorial shows how to add the projection control that toggles the map between "mercator" and "globe" projection.](https://docs.maptiler.com/sdk-js/examples/globe-control/)

[![Create a globe map with 3D terrain elevation](https://docs.maptiler.com/assets/img/example-card.png)**Globe with elevation terrain** Example\\
Create a globe map with 3D terrain elevation.](https://docs.maptiler.com/sdk-js/examples/globe-terrain/)

[![How to switch map projection programmatically](https://docs.maptiler.com/assets/img/example-card.png)**Switch between “mercator” and “globe”** Example\\
This example shows how to switch between “mercator” and “globe” map projection programmatically.](https://docs.maptiler.com/sdk-js/examples/globe-projection-switch/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/globe-bathymetry/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Create a globe map with ocean bathymetry terrain elevation

Globe with ocean bathymetry

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)