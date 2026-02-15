# Add a 3D model to globe using MapTiler 3D JS

This example shows how to add a 3D model to globe using [MapTiler 3D JS module](https://docs.maptiler.com/sdk-js/modules/3d/). The 3D JS module enables you to integrate multiple 3D objects onto the globe surface. You can adjust model sizes, create duplicates, position models at specific elevations above sea level, and more. This offers complete flexibility in manipulating your 3D models.

MapTiler Globe projection

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

[Model credit](https://docs.maptiler.com/sdk-js/examples/globe-3d-model/#fn:1)

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
   <!-- Importing MapTiler 3D js -->
<script src="https://cdn.maptiler.com/maptiler-3d/v3.1.0/maptiler-3d.umd.min.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; background: #000; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style:  maptilersdk.MapStyle.SATELLITE,
        center: [-15.45, -21.27], // starting position [lng, lat]
        zoom: 0.75, // starting zoom
        projection: 'globe' //enable globe projection
      });

      (async () => {
        await map.onReadyAsync();

        const layer3D = new maptiler3d.Layer3D("custom-3D-layer");
        map.addLayer(layer3D);

        // Increasing the intensity of the ambient light
        layer3D.setAmbientLight({intensity: 2});

        // Adding a point light
        layer3D.addPointLight("point-light", {intensity: 30});

        const originalPlaneID = "plane";
        await layer3D.addMeshFromURL(
          originalPlaneID,
          "https://docs-media.maptiler.com/docs/models/plane_a340.glb",
          {
            scale: 1000,
            altitude: 1000000,
            heading: 55,
            altitudeReference: maptiler3d.AltitudeReference.MEAN_SEA_LEVEL,
            lngLat: [-2.548828,42.617791]
          }
        );

        const originalDuckID = "duck";
        await layer3D.addMeshFromURL(
          originalDuckID,
          "https://docs-media.maptiler.com/docs/models/duck.glb",
          {
            scale: 1000000,
            heading: 155,
            lngLat: [-43.857422,24.447150]
          }
        );

        layer3D.cloneMesh(originalDuckID, `${originalDuckID}_1`, {lngLat: [-26.298828,28.226970], scale: 400000});

      })();
  </script>
</body>
</html>
```

HTML

Copy

```bash
npm install --save @maptiler/sdk @maptiler/3d
```

Bash

Copy

main.js

```javascript
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Layer3D, AltitudeReference } from '@maptiler/3d';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
  container: 'map', // container's id or the HTML element to render the map
  style:  MapStyle.SATELLITE,
  center: [-15.45, -21.27], // starting position [lng, lat]
  zoom: 0.75, // starting zoom
  projection: 'globe' //enable globe projection
});

(async () => {
  await map.onReadyAsync();

  const layer3D = new Layer3D("custom-3D-layer");
  map.addLayer(layer3D);

  // Increasing the intensity of the ambient light
  layer3D.setAmbientLight({intensity: 2});

  // Adding a point light
  layer3D.addPointLight("point-light", {intensity: 30});

  const originalPlaneID = "plane";
  await layer3D.addMeshFromURL(
    originalPlaneID,
    "https://docs-media.maptiler.com/docs/models/plane_a340.glb",
    {
      scale: 1000,
      altitude: 1000000,
      heading: 55,
      altitudeReference: AltitudeReference.MEAN_SEA_LEVEL,
      lngLat: [-2.548828,42.617791]
    }
  );

  const originalDuckID = "duck";
  await layer3D.addMeshFromURL(
    originalDuckID,
    "https://docs-media.maptiler.com/docs/models/duck.glb",
    {
      scale: 1000000,
      heading: 155,
      lngLat: [-43.857422,24.447150]
    }
  );

  layer3D.cloneMesh(originalDuckID, `${originalDuckID}_1`, {lngLat: [-26.298828,28.226970], scale: 400000});

})();
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

- [plane a340](https://skfb.ly/oJWGw) by mamont nikita is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/)
- [COLLADA duck](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main) One texture Credit: © 2006, Sony. [SCEA Shared Source License, Version 1.0](https://spdx.org/licenses/SCEA.html)

[↩](https://docs.maptiler.com/sdk-js/examples/globe-3d-model/#fnref:1)

## Related examples

[![Projection control how to toggle the map between mercator and globe projection](https://docs.maptiler.com/assets/img/example-card.png)**Projection control (globe)** Example\\
This tutorial shows how to add the projection control that toggles the map between "mercator" and "globe" projection.](https://docs.maptiler.com/sdk-js/examples/globe-control/)

[![Create a globe map with ocean bathymetry terrain elevation](https://docs.maptiler.com/assets/img/example-card.png)**Globe with ocean bathymetry** Example\\
Create a globe map with ocean bathymetry terrain elevation.](https://docs.maptiler.com/sdk-js/examples/globe-bathymetry/)

[![Add multiple 3D models to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add multiple 3D models** Example\\
Use the MapTiler 3D JS module to add multiple 3D models to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/)

[![Animate a 3D plane flight in a globe using MapTiler 3D JS](https://docs.maptiler.com/assets/img/example-card.png)**Animate a 3D plane flight in a globe** Example\\
This example shows how to simulate and animate a airplane flight in a globe using MapTiler 3D JS module.](https://docs.maptiler.com/sdk-js/examples/globe-3d-model-animated/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/globe-3d-model/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add a 3D model to globe using MapTiler 3D JS

Add a 3D model to globe using MapTiler 3D JS

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)