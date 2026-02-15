# 3D model set the pitch and roll

Use the [MapTiler 3D JS module](https://docs.maptiler.com/sdk-js/modules/3d/) to rotate a 3D model, setting the pitch and roll propertie. Thanks to the 3D JS module we can add 3D models to the map and configure it as we want, rotating it, animating it, scaling it, etc.

Add a 3D model

[MapTiler logo](https://www.maptiler.com/)

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-roll-pitch/#fn:1)

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
</style>
</head>
<body>
<div id="map"></div>
<script>
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

  const center = [2.3416, 48.9548];

  const map = new maptilersdk.Map({
    container: document.getElementById('map'),
    hash: true,
    style: maptilersdk.MapStyle.SATELLITE,
    zoom: 10,
    center: center,
    pitch: 65,
    maxPitch: 85,
    terrainControl: true,
    terrain: true,
    maptilerLogo: true,
  });

  (async () => {
    await map.onReadyAsync();

    const layer3D = new maptiler3d.Layer3D("custom-3D-layer");
    map.addLayer(layer3D);

    const LNGLAT_OFFSET = 0.25;
    const PLANE_BASE_ALT = 6200;

    // Adding a point light
    layer3D.addPointLight("point-light", {
      intensity: 20,
      color: "#ffffff",
      lngLat: center.map(num => num + 0.0001),
      altitude: 2000,
      altitudeReference: maptiler3d.AltitudeReference.GROUND,
    });

    // Adding a mesh of a plane.
    const originalPlaneID = "biplaneOne";
    const biplaneOne = await layer3D.addMeshFromURL(
      originalPlaneID,
      "https://docs-media.maptiler.com/docs/models/low_poly_biplane.glb",
      {
        lngLat: center,
        heading: 0,
        scale: 300,
        altitude: PLANE_BASE_ALT,
        altitudeReference: maptiler3d.AltitudeReference.GROUND,
        transform: {
          rotation: {
            y: Math.PI / 2,
          },
        }
      }
    );

    layer3D.cloneMesh("biplaneOne", "biplaneTwo");
    const biplaneTwo = layer3D.getItem3D("biplaneTwo");

    let progress = 0;
    let speed = 0.001;

    const startLngLat = maptilersdk.LngLat.convert(center.map(num => num - LNGLAT_OFFSET));
    const endLngLat = maptilersdk.LngLat.convert(center.map(num => num + LNGLAT_OFFSET));

    function updateBiPlaneOne() {
      const position = lerpLngLat(startLngLat, endLngLat, progress);
      const nextPosition = lerpLngLat(startLngLat, endLngLat, progress + 0.01);

      const currentAltitude = 2000 * Math.sin(progress * 8) + PLANE_BASE_ALT;
      const nextAltitude = 2000 * Math.sin(progress * 8 + 0.1) + PLANE_BASE_ALT;

      const pitchInRadians = getPitch(currentAltitude, nextAltitude, position.distanceTo(nextPosition));
      const pitch = radiansToDegrees(pitchInRadians);
      biplaneOne.setPitch(pitch);
      biplaneOne.setAltitude(currentAltitude);

      biplaneOne.setLngLat(position);

      biplaneOne.setHeading(radiansToDegrees(getHeading(startLngLat, endLngLat)));
      biplaneOne.setRoll(radiansToDegrees(50 * progress));
    }

    function updateBiPlaneTwo() {
      const position = orbitCenter(center, progress, 0.05);
      const nextPosition = orbitCenter(center, progress + 0.01, 0.05);

      biplaneTwo.setLngLat(position);
      biplaneTwo.setHeading(getHeading(position, nextPosition) * 180 / Math.PI);
      biplaneTwo.setRoll(45);

      const currentAltitude = 2000 * Math.sin(progress * Math.PI * 2) + PLANE_BASE_ALT;
      const nextAltitude = 2000 * Math.sin(progress * Math.PI * 2 + 0.1) + PLANE_BASE_ALT;
      const pitchInRadians = getPitch(currentAltitude, nextAltitude, position.distanceTo(nextPosition));
      const pitch = pitchInRadians * 180 / Math.PI;
      biplaneTwo.setPitch(pitch);
      biplaneTwo.setAltitude(currentAltitude);
    }

    function loop() {
      requestAnimationFrame(loop);

      updateBiPlaneOne();
      updateBiPlaneTwo();

      progress += 0.001;
      if (progress > 1) {
        progress = 0;
      }
    }

    loop();

  })()

  function orbitCenter(center, progress, radius) {
    return new maptilersdk.LngLat(
      center[0] + radius * Math.cos(progress * 2 * Math.PI),
      center[1] + radius * Math.sin(progress * 2 * Math.PI),
    );
  }

  function lerpLngLat(startLngLat, endLngLat, progress) {
    return new maptilersdk.LngLat(
      startLngLat.lng + (endLngLat.lng - startLngLat.lng) * progress,
      startLngLat.lat + (endLngLat.lat - startLngLat.lat) * progress,
    );
  }

  function getPitch(startAltitude, endAltitude, distance) {
    return Math.asin((endAltitude - startAltitude) / distance);
  }

  function getHeading(startLngLat, endLngLat) {
    return Math.atan2(endLngLat.lng - startLngLat.lng, endLngLat.lat - startLngLat.lat);
  }

  function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
  }
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

const center = [2.3416, 48.9548];

const map = new Map({
  container: document.getElementById('map'),
  hash: true,
  style: MapStyle.SATELLITE,
  zoom: 10,
  center: center,
  pitch: 65,
  maxPitch: 85,
  terrainControl: true,
  terrain: true,
  maptilerLogo: true,
});

(async () => {
  await map.onReadyAsync();

  const layer3D = new Layer3D("custom-3D-layer");
  map.addLayer(layer3D);

  const LNGLAT_OFFSET = 0.25;
  const PLANE_BASE_ALT = 6200;

  // Adding a point light
  layer3D.addPointLight("point-light", {
    intensity: 20,
    color: "#ffffff",
    lngLat: center.map(num => num + 0.0001),
    altitude: 2000,
    altitudeReference: AltitudeReference.GROUND,
  });

  // Adding a mesh of a plane.
  const originalPlaneID = "biplaneOne";
  const biplaneOne = await layer3D.addMeshFromURL(
    originalPlaneID,
    "https://docs-media.maptiler.com/docs/models/low_poly_biplane.glb",
    {
      lngLat: center,
      heading: 0,
      scale: 300,
      altitude: PLANE_BASE_ALT,
      altitudeReference: AltitudeReference.GROUND,
      transform: {
        rotation: {
          y: Math.PI / 2,
        },
      }
    }
  );

  layer3D.cloneMesh("biplaneOne", "biplaneTwo");
  const biplaneTwo = layer3D.getItem3D("biplaneTwo");

  let progress = 0;
  let speed = 0.001;

  const startLngLat = maptilersdk.LngLat.convert(center.map(num => num - LNGLAT_OFFSET));
  const endLngLat = maptilersdk.LngLat.convert(center.map(num => num + LNGLAT_OFFSET));

  function updateBiPlaneOne() {
    const position = lerpLngLat(startLngLat, endLngLat, progress);
    const nextPosition = lerpLngLat(startLngLat, endLngLat, progress + 0.01);

    const currentAltitude = 2000 * Math.sin(progress * 8) + PLANE_BASE_ALT;
    const nextAltitude = 2000 * Math.sin(progress * 8 + 0.1) + PLANE_BASE_ALT;

    const pitchInRadians = getPitch(currentAltitude, nextAltitude, position.distanceTo(nextPosition));
    const pitch = radiansToDegrees(pitchInRadians);
    biplaneOne.setPitch(pitch);
    biplaneOne.setAltitude(currentAltitude);

    biplaneOne.setLngLat(position);

    biplaneOne.setHeading(radiansToDegrees(getHeading(startLngLat, endLngLat)));
    biplaneOne.setRoll(radiansToDegrees(50 * progress));
  }

  function updateBiPlaneTwo() {
    const position = orbitCenter(center, progress, 0.05);
    const nextPosition = orbitCenter(center, progress + 0.01, 0.05);

    biplaneTwo.setLngLat(position);
    biplaneTwo.setHeading(getHeading(position, nextPosition) * 180 / Math.PI);
    biplaneTwo.setRoll(45);

    const currentAltitude = 2000 * Math.sin(progress * Math.PI * 2) + PLANE_BASE_ALT;
    const nextAltitude = 2000 * Math.sin(progress * Math.PI * 2 + 0.1) + PLANE_BASE_ALT;
    const pitchInRadians = getPitch(currentAltitude, nextAltitude, position.distanceTo(nextPosition));
    const pitch = pitchInRadians * 180 / Math.PI;
    biplaneTwo.setPitch(pitch);
    biplaneTwo.setAltitude(currentAltitude);
  }

  function loop() {
    requestAnimationFrame(loop);

    updateBiPlaneOne();
    updateBiPlaneTwo();

    progress += 0.001;
    if (progress > 1) {
      progress = 0;
    }
  }

  loop();

})()

function orbitCenter(center, progress, radius) {
  return new maptilersdk.LngLat(
    center[0] + radius * Math.cos(progress * 2 * Math.PI),
    center[1] + radius * Math.sin(progress * 2 * Math.PI),
  );
}

function lerpLngLat(startLngLat, endLngLat, progress) {
  return new maptilersdk.LngLat(
    startLngLat.lng + (endLngLat.lng - startLngLat.lng) * progress,
    startLngLat.lat + (endLngLat.lat - startLngLat.lat) * progress,
  );
}

function getPitch(startAltitude, endAltitude, distance) {
  return Math.asin((endAltitude - startAltitude) / distance);
}

function getHeading(startLngLat, endLngLat) {
  return Math.atan2(endLngLat.lng - startLngLat.lng, endLngLat.lat - startLngLat.lat);
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}
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

[Low-Poly Biplane](https://skfb.ly/oG9qS) by ElectrikGoat0395 is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/) [↩](https://docs.maptiler.com/sdk-js/examples/3d-js-roll-pitch/#fnref:1)

## Related examples

[![Add a airplane 3D model](https://docs.maptiler.com/assets/img/example-card.png)**Add a plane 3D model** Example\\
Use the MapTiler 3D JS module to add a airplane model to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-plane/)

[![Add events on 3D models](https://docs.maptiler.com/assets/img/example-card.png)**3D model events** Example\\
Use the MapTiler 3D JS module to listen for mouse events on 3D models.](https://docs.maptiler.com/sdk-js/examples/3d-js-events/)

[![3D model set the roll](https://docs.maptiler.com/assets/img/example-card.png)**3D model roll** Example\\
Use the MapTiler 3D JS module to rotate a 3D model, setting the roll property.](https://docs.maptiler.com/sdk-js/examples/3d-js-roll/)

[![3D model set the pitch or tilt](https://docs.maptiler.com/assets/img/example-card.png)**3D model pitch** Example\\
Use the MapTiler 3D JS module to rotate a 3D model, setting the pitch property.](https://docs.maptiler.com/sdk-js/examples/3d-js-pitch/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-roll-pitch/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


3D model set the pitch and roll

3D model pitch and roll

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)