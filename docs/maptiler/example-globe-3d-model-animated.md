# Animate a 3D plane flight in a globe using MapTiler 3D JS

This example shows how to simulate and animate a airplane flight in a globe using [MapTiler 3D JS module](https://docs.maptiler.com/sdk-js/modules/3d/). Thanks to the 3D JS module we can track the flight position of a 3D model.

This demonstration showcases a compact control interface that allows us to animate the plane flight and track the position.

Add a 3D model

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

[Model credit](https://docs.maptiler.com/sdk-js/examples/globe-3d-model-animated/#fn:1)

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
  <script src="https://cdn.jsdelivr.net/npm/lil-gui@0.19"></script>
<!-- Importing MapTiler 3D js -->
<script src="https://cdn.maptiler.com/maptiler-3d/v3.1.0/maptiler-3d.umd.min.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; background: #15181c; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

      const paris = [2.3120283730734648, 48.8556923989924];
      const sydney = [151.174622,-33.940619];

      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS.DARK,
        zoom: 2,
        center: paris,
        maptilerLogo: true,
        maxPitch: 85,
        pitch: 71,
        hash: false,
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

    // Adding a mesh of a plane.
    const originalPlaneID = "plane";
    const mesh = await layer3D.addMeshFromURL(
      originalPlaneID,
      "https://docs-media.maptiler.com/docs/models/plane_a340.glb",
      {
        lngLat: paris,
        heading: 45,
        scale: 1000,
        altitude: 0,
        altitudeReference: maptiler3d.AltitudeReference.MEAN_SEA_LEVEL,
      }
    );

    const guiObj = {
      play: false,
      trackFlight: true,
      speed: 0.0005,
    }

    const gui = new lil.GUI({ width: 200 });

    gui.add( guiObj, 'trackFlight')

    gui.add( guiObj, 'play')
    .onChange((play) => {
      if (play) {
        playAnimation();
      }
    });

    gui.add( guiObj, 'speed', 0, 0.001);

    let progress = 0;

    function playAnimation() {
      progress += guiObj.speed;

      if (progress > 1) {
        progress = 0;
      }

      const position = maptilersdk.math.haversineIntermediateWgs84(paris, sydney, progress);
      if (progress < 0.2) { //taking off
        mesh.modify({lngLat: position, altitude: progress*5000000});
      } else if (progress > 0.8) { //landing
        mesh.modify({lngLat: position, altitude: 1000000 - ((progress - 0.80) * 5000000)});
      } else {
        mesh.modify({lngLat: position, altitude: 1000000});
      }

      if (guiObj.trackFlight) {
        map.flyTo({
          center: position,
          pitch: 71,
        });
      }

      if (guiObj.play) {
        requestAnimationFrame(playAnimation);
      }
    }

  })();
  </script>
</body>
</html>
```

HTML

Copy

```bash
npm install --save @maptiler/sdk @maptiler/3d lil-gui
```

Bash

Copy

main.js

```javascript
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Layer3D, AltitudeReference } from '@maptiler/3d';
import { GUI } from 'lil-gui';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

    const paris = [2.3120283730734648, 48.8556923989924];
    const sydney = [151.174622,-33.940619];

    const map = new Map({
      container: 'map', // container's id or the HTML element to render the map
      style: MapStyle.STREETS.DARK,
      zoom: 2,
      center: paris,
      maptilerLogo: true,
      maxPitch: 85,
      pitch: 71,
      hash: false,
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

  // Adding a mesh of a plane.
  const originalPlaneID = "plane";
  const mesh = await layer3D.addMeshFromURL(
    originalPlaneID,
    "https://docs-media.maptiler.com/docs/models/plane_a340.glb",
    {
      lngLat: paris,
      heading: 45,
      scale: 1000,
      altitude: 0,
      altitudeReference: AltitudeReference.MEAN_SEA_LEVEL,
    }
  );

  const guiObj = {
    play: false,
    trackFlight: true,
    speed: 0.0005,
  }

  const gui = new GUI({ width: 200 });

  gui.add( guiObj, 'trackFlight')

  gui.add( guiObj, 'play')
  .onChange((play) => {
    if (play) {
      playAnimation();
    }
  });

  gui.add( guiObj, 'speed', 0, 0.001);

  let progress = 0;

  function playAnimation() {
    progress += guiObj.speed;

    if (progress > 1) {
      progress = 0;
    }

    const position = maptilersdk.math.haversineIntermediateWgs84(paris, sydney, progress);
    if (progress < 0.2) { //taking off
      mesh.modify({lngLat: position, altitude: progress*5000000});
    } else if (progress > 0.8) { //landing
      mesh.modify({lngLat: position, altitude: 1000000 - ((progress - 0.80) * 5000000)});
    } else {
      mesh.modify({lngLat: position, altitude: 1000000});
    }

    if (guiObj.trackFlight) {
      map.flyTo({
        center: position,
        pitch: 71,
      });
    }

    if (guiObj.play) {
      requestAnimationFrame(playAnimation);
    }
  }

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
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy

[plane a340](https://skfb.ly/oJWGw) by mamont nikita is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/) [↩](https://docs.maptiler.com/sdk-js/examples/globe-3d-model-animated/#fnref:1)

## Related examples

[![Projection control how to toggle the map between mercator and globe projection](https://docs.maptiler.com/assets/img/example-card.png)**Projection control (globe)** Example\\
This tutorial shows how to add the projection control that toggles the map between "mercator" and "globe" projection.](https://docs.maptiler.com/sdk-js/examples/globe-control/)

[![Create a globe map with 3D terrain elevation](https://docs.maptiler.com/assets/img/example-card.png)**Globe with elevation terrain** Example\\
Create a globe map with 3D terrain elevation.](https://docs.maptiler.com/sdk-js/examples/globe-terrain/)

[![Add a 3D model to globe using MapTiler 3D JS](https://docs.maptiler.com/assets/img/example-card.png)**Add a 3D model to globe using MapTiler 3D JS** Example\\
Add a 3D model to globe using MapTiler 3D JS module.](https://docs.maptiler.com/sdk-js/examples/globe-3d-model/)

[![Add multiple 3D models to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add multiple 3D models** Example\\
Use the MapTiler 3D JS module to add multiple 3D models to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/globe-3d-model-animated/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Animate a 3D plane flight in a globe using MapTiler 3D JS

Animate a 3D plane flight in a globe

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)