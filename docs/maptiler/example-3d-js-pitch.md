# 3D model set the pitch or tilt

Use the [MapTiler 3D JS module](https://docs.maptiler.com/sdk-js/modules/3d/) to rotate a 3D model, setting the pitch property. Set the model’s tilt (pitch) in degrees, either positive or negative. Thanks to the 3D JS module we can add 3D models to the map and configure it as we want, rotating it, animating it, scaling it, etc.

Add a 3D model

[MapTiler logo](https://www.maptiler.com/)

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-pitch/#fn:1)

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

  const center = [2.3492790851936776, 48.85417501375531];

  const map = new maptilersdk.Map({
    container: document.getElementById('map'),
    hash: true,
    style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
    zoom: 11,
    center: [2.4444, 48.8785],
    pitch: 65,
    bearing: 44,
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
    const PLANE_BASE_ALT = 2200;

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
    layer3D.cloneMesh("biplaneOne", "biplaneThree");
    layer3D.cloneMesh("biplaneOne", "biplaneFour");
    layer3D.cloneMesh("biplaneOne", "biplaneFive");
    const biplaneTwo = layer3D.getItem3D("biplaneTwo");
    biplaneTwo.setLngLat([center[0]+0.05, center[1]]);
    biplaneTwo.setPitch(45);
    const biplaneThree = layer3D.getItem3D("biplaneThree");
    biplaneThree.setLngLat([center[0]+(0.05*2), center[1]]);
    biplaneThree.setPitch(120);
    const biplaneFour = layer3D.getItem3D("biplaneFour");
    biplaneFour.setLngLat([center[0]+(0.05*3), center[1]]);
    biplaneFour.setPitch(-45);
    const biplaneFive = layer3D.getItem3D("biplaneFive");
    biplaneFive.setLngLat([center[0]+(0.05*4), center[1]]);
    biplaneFive.setPitch(-90);

  })()
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

const center = [2.3492790851936776, 48.85417501375531];

const map = new Map({
  container: document.getElementById('map'),
  hash: true,
  style: MapStyle.DATAVIZ.LIGHT,
  zoom: 11,
  center: [2.4444, 48.8785],
  pitch: 65,
  bearing: 44,
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
  const PLANE_BASE_ALT = 2200;

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
  layer3D.cloneMesh("biplaneOne", "biplaneThree");
  layer3D.cloneMesh("biplaneOne", "biplaneFour");
  layer3D.cloneMesh("biplaneOne", "biplaneFive");
  const biplaneTwo = layer3D.getItem3D("biplaneTwo");
  biplaneTwo.setLngLat([center[0]+0.05, center[1]]);
  biplaneTwo.setPitch(45);
  const biplaneThree = layer3D.getItem3D("biplaneThree");
  biplaneThree.setLngLat([center[0]+(0.05*2), center[1]]);
  biplaneThree.setPitch(120);
  const biplaneFour = layer3D.getItem3D("biplaneFour");
  biplaneFour.setLngLat([center[0]+(0.05*3), center[1]]);
  biplaneFour.setPitch(-45);
  const biplaneFive = layer3D.getItem3D("biplaneFive");
  biplaneFive.setLngLat([center[0]+(0.05*4), center[1]]);
  biplaneFive.setPitch(-90);

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

[Low-Poly Biplane](https://skfb.ly/oG9qS) by ElectrikGoat0395 is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/) [↩](https://docs.maptiler.com/sdk-js/examples/3d-js-pitch/#fnref:1)

## Related examples

[![Display an animated 3D model](https://docs.maptiler.com/assets/img/example-card.png)**Animate a 3D model** Example\\
With animation, your 3D models take on a whole new dimension. You can bring them to life and display them on a map](https://docs.maptiler.com/sdk-js/examples/3d-js-animated/)

[![3D model set the pitch and roll](https://docs.maptiler.com/assets/img/example-card.png)**3D model pitch and roll** Example\\
Use the MapTiler 3D JS module to rotate a 3D model, setting the pitch and roll properties.](https://docs.maptiler.com/sdk-js/examples/3d-js-roll-pitch/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-pitch/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


3D model set the pitch or tilt

3D model pitch

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)