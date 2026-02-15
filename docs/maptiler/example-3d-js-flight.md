# Animate a 3D plane flight

Use the [MapTiler 3D JS module](https://docs.maptiler.com/sdk-js/modules/3d/) to simulate and animate a plane flight between two cities. Thanks to the 3D JS module we can track the flight position of a airplane.

This demonstration showcases a compact control interface that allows us to animate the plane flight and track the position.

Add a 3D model

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-flight/#fn:1)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Add a 3D model</title>
<script src="https://cdn.jsdelivr.net/npm/lil-gui@0.19"></script>
<script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
<link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
<!-- Importing MapTiler 3D js -->
<script src="https://cdn.maptiler.com/maptiler-3d/v3.1.0/maptiler-3d.umd.min.js"></script>
<style>
  body {margin: 0; padding: 0;}
  #map {position: absolute; top: 0; bottom: 0; width: 100%;}
  .lil-gui.autoPlace {
    right: inherit;
    left: 15px;
  }
</style>
</head>
<body>
<div id="map"></div>
<script>
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

  //const newYorkCity = [-73.98918779556983, 40.74072950731568];
  //const capeTown = [18.428021658130994, -33.913973526198134];
  //const melbourne = [144.84097472271193, -37.94589718135184];
  const paris = [2.3120283730734648, 48.8556923989924];
  const ankara = [32.866609260522345, 39.959329480757354];

  const map = new maptilersdk.Map({
    container: document.getElementById('map'),
    style: maptilersdk.MapStyle.STREETS.DARK,
    zoom: 9,
    center: paris,
    maxPitch: 85,
    terrainControl: true,
    terrain: true,
    maptilerLogo: true,
  });

  (async () => {
    await map.onReadyAsync();

    map.setSky({
      "sky-color": "#0C2E4B",
      "horizon-color": "#09112F",
      "fog-color": "#09112F",
      "fog-ground-blend": 0.5,
      "horizon-fog-blend": 0.1,
      "sky-horizon-blend": 1.0,
      "atmosphere-blend": 0.5,
    })

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
        heading: 12,
        scale: 5,
        altitude: 5000,
        altitudeReference: maptiler3d.AltitudeReference.MEAN_SEA_LEVEL,
      }
    );

    const guiObj = {
      play: false,
      trackFlight: true,
      speed: 0.0001,
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

      const position = maptilersdk.math.haversineIntermediateWgs84(paris, ankara, progress);
      mesh.modify({lngLat: position});

      if (guiObj.trackFlight) {
        map.setCenter(position);
        // map.setBearing(360 * progress * 2);
      }

      if (guiObj.play) {
        requestAnimationFrame(playAnimation);
      }
    }

  })()

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

//const newYorkCity = [-73.98918779556983, 40.74072950731568];
//const capeTown = [18.428021658130994, -33.913973526198134];
//const melbourne = [144.84097472271193, -37.94589718135184];
const paris = [2.3120283730734648, 48.8556923989924];
const ankara = [32.866609260522345, 39.959329480757354];

const map = new Map({
  container: document.getElementById('map'),
  style: MapStyle.STREETS.DARK,
  zoom: 9,
  center: paris,
  maxPitch: 85,
  terrainControl: true,
  terrain: true,
  maptilerLogo: true,
});

(async () => {
  await map.onReadyAsync();

  map.setSky({
    "sky-color": "#0C2E4B",
    "horizon-color": "#09112F",
    "fog-color": "#09112F",
    "fog-ground-blend": 0.5,
    "horizon-fog-blend": 0.1,
    "sky-horizon-blend": 1.0,
    "atmosphere-blend": 0.5,
  })

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
      heading: 12,
      scale: 5,
      altitude: 5000,
      altitudeReference: AltitudeReference.MEAN_SEA_LEVEL,
    }
  );

  const guiObj = {
    play: false,
    trackFlight: true,
    speed: 0.0001,
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

    const position = maptilersdk.math.haversineIntermediateWgs84(paris, ankara, progress);
    mesh.modify({lngLat: position});

    if (guiObj.trackFlight) {
      map.setCenter(position);
      // map.setBearing(360 * progress * 2);
    }

    if (guiObj.play) {
      requestAnimationFrame(playAnimation);
    }
  }

})()
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Add a 3D model</title>
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

[plane a340](https://skfb.ly/oJWGw) by mamont nikita is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/) [↩](https://docs.maptiler.com/sdk-js/examples/3d-js-flight/#fnref:1)

## Related examples

[![Add a 3D model with babylon.js](https://docs.maptiler.com/assets/img/example-card.png)**Add a 3D model with babylon.js** Example\\
Use a custom style layer with babylon.js to add a 3D model to the map.](https://docs.maptiler.com/sdk-js/examples/add-3d-model-babylon/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![Add a airplane 3D model](https://docs.maptiler.com/assets/img/example-card.png)**Add a plane 3D model** Example\\
Use the MapTiler 3D JS module to add a airplane model to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-plane/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-flight/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Animate a 3D plane flight

Animate a 3D plane flight

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)