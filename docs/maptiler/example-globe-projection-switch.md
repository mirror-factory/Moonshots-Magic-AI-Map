# How to switch map projection programmatically

This example shows how to switch between “mercator” and “globe” map projection programmatically.

The choice between Mercator and Globe can be done at different levels and moments in the lifecycle of the map, yet, unless stated otherwise, **Mercator remains the default**.

MapTiler Globe projectionSwitch map projection

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
    #projection {
      display: block;
      position: relative;
      margin: 0px auto;
      width: 50%;
      height: 40px;
      padding: 10px;
      border: none;
      border-radius: 3px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #ee8a65;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <button id="projection">Switch map projection</button>
  <script>
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style:  maptilersdk.MapStyle.SATELLITE,
        center: [-70.8, 0], // starting position [lng, lat]
        zoom: 1, // starting zoom
        projection: 'globe' //enable globe projection
      });

      document.getElementById('projection').addEventListener('click', function () {
        const projection = map.getProjection()
        if (projection.type === 'globe') {
          map.enableMercatorProjection();
        } else {
          map.enableGlobeProjection();
        }
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
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
  container: 'map', // container's id or the HTML element to render the map
  style:  MapStyle.SATELLITE,
  center: [-70.8, 0], // starting position [lng, lat]
  zoom: 1, // starting zoom
  projection: 'globe' //enable globe projection
});

document.getElementById('projection').addEventListener('click', function () {
  const projection = map.getProjection()
  if (projection.type === 'globe') {
    map.enableMercatorProjection();
  } else {
    map.enableGlobeProjection();
  }
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
  <button id="projection">Switch map projection</button>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

HTML

Copy

style.css

```css
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy

## Related examples

[![Projection control how to toggle the map between mercator and globe projection](https://docs.maptiler.com/assets/img/example-card.png)**Projection control (globe)** Example\\
This tutorial shows how to add the projection control that toggles the map between "mercator" and "globe" projection.](https://docs.maptiler.com/sdk-js/examples/globe-control/)

[![How to turn on the globe projection](https://docs.maptiler.com/assets/img/example-card.png)**Globe projection** Example\\
Specify the map projection to view the map in a 3D globe.](https://docs.maptiler.com/sdk-js/examples/globe-projection/)

[![Add a 3D model to globe using MapTiler 3D JS](https://docs.maptiler.com/assets/img/example-card.png)**Add a 3D model to globe using MapTiler 3D JS** Example\\
Add a 3D model to globe using MapTiler 3D JS module.](https://docs.maptiler.com/sdk-js/examples/globe-3d-model/)

[![Create a globe map with 3D terrain elevation](https://docs.maptiler.com/assets/img/example-card.png)**Globe with elevation terrain** Example\\
Create a globe map with 3D terrain elevation.](https://docs.maptiler.com/sdk-js/examples/globe-terrain/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/globe-projection-switch/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to switch map projection programmatically

Switch between “mercator” and “globe”

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)