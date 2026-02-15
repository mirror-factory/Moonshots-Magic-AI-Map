# Create a globe map with 3D terrain elevation

Show a detailed 3D (three-dimensional) globe map with terrain elevation. Creating a 3D terrain globe view of your map requires only two lines of code. Simply include the projection and the terrain option within the map constructor.

Enhance the authenticity of your web mapping applications and data by using the globe projection and incorporating terrain relief into your maps. This will provide a greater sense of realism and depth to your visuals.

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
        center: [-115.54098, 51.2018],
        zoom: 14,
        pitch: 83,
        bearing: 37.1,
        projection: 'globe', //enable globe projection
        terrain: true, //add terrain elevation
        terrainExageration: 1.5
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
  center: [-115.54098, 51.2018],
  zoom: 14,
  pitch: 83,
  bearing: 37.1,
  projection: 'globe', //enable globe projection
  terrain: true, //add terrain elevation
  terrainExageration: 1.5
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

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)

[![Create a globe map with ocean bathymetry terrain elevation](https://docs.maptiler.com/assets/img/example-card.png)**Globe with ocean bathymetry** Example\\
Create a globe map with ocean bathymetry terrain elevation.](https://docs.maptiler.com/sdk-js/examples/globe-bathymetry/)

[![Animate a 3D plane flight in a globe using MapTiler 3D JS](https://docs.maptiler.com/assets/img/example-card.png)**Animate a 3D plane flight in a globe** Example\\
This example shows how to simulate and animate a airplane flight in a globe using MapTiler 3D JS module.](https://docs.maptiler.com/sdk-js/examples/globe-3d-model-animated/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/globe-terrain/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Terrain Elevation: 3D globe map

Terrain 3D globe map

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)