# Add a airplane 3D model

Use the [MapTiler 3D JS module](https://docs.maptiler.com/sdk-js/modules/3d/) to add a airplane model to the map. Thanks to the 3D JS module we can add 3D models to the map (flying) at the height above sea level that we want.

This demonstration showcases a compact control interface that allows us to modify various model parameters and observe their immediate impact on the model’s behavior.

Add a 3D model

Click on the map to move the plane. You can then click again to fix its position.


[MapTiler logo](https://www.maptiler.com/)

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Controls

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-plane/#fn:1)

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
  #info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: fit-content;
    height: fit-content;
    text-align: center;
    padding: 15px;
    color: white;
    background-color: #0009;
    border-radius: 5px;
    font-family: monospace;
    margin: auto;
    margin-bottom: 25px;
    z-index: 2;
    backdrop-filter: blur(10px);
  }
</style>
</head>
<body>
<div id="map"></div>
<div id="info">
  <p>
    Click on the map to move the plane. You can then click again to fix its position.
  </p>
</div>
<script>
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

  const map = new maptilersdk.Map({
    container: document.getElementById('map'),
    hash: true,
    style: maptilersdk.MapStyle.OUTDOOR.DARK,
    zoom: 11,
    center: [7.22, 46.18],
    pitch: 60,
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

    const gui = new lil.GUI({ width: 200 });

    // Adding a mesh of a plane.

    const guiObj = {
      heading: 0,
      scale: 1,
      altitude: 3000,
      opacity: 1,
      wireframe: false,
      altitudeReference: "MEAN_SEA_LEVEL",
      removePlane: () => {
        layer3D.removeMesh(originalPlaneID);
      }
    }

    const originalPlaneID = "plane";
    const mesh = await layer3D.addMeshFromURL(
      originalPlaneID,
      "https://docs-media.maptiler.com/docs/models/plane_a340.glb",
      {
        scale: guiObj.scale,
        altitude: guiObj.altitude,
        altitudeReference: maptiler3d.AltitudeReference.MEAN_SEA_LEVEL,
        wireframe: guiObj.wireframe,
        lngLat: [7.22, 46.18]
      }
    );

    let planeCanMove = false;

    // Adding mesh of a plane
    map.on("mousemove", (e) => {
      if (!planeCanMove) return;
      mesh.modify({lngLat: e.lngLat})
    });

    map.on("click", (e) => {
      planeCanMove = !planeCanMove;
    });

    gui.add( guiObj, 'heading', 0, 360, 0.1 )
    .onChange((heading) => {
      mesh.modify({heading});
    });

    gui.add( guiObj, 'scale', 0.01, 5, 0.01 )
    .onChange((scale) => {
      mesh.modify({scale});
    });

    gui.add( guiObj, 'altitude', 0, 10000, 1 )
    .onChange((altitude) => {
      mesh.modify({altitude});
    });

    gui.add( guiObj, 'opacity', 0, 1)
    .onChange((opacity) => {
      mesh.modify({opacity});
    });

    gui.add( guiObj, 'altitudeReference', ["MEAN_SEA_LEVEL", "GROUND"])
    .onChange((altRef) => {
      mesh.modify({altitudeReference: maptiler3d.AltitudeReference[altRef]});
    });

    gui.add( guiObj, "wireframe" )
    .onChange((wireframe) => {
      mesh.modify({wireframe});
    });

    gui.add( guiObj, "removePlane" );

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

const map = new Map({
  container: document.getElementById('map'),
  hash: true,
  style: MapStyle.OUTDOOR.DARK,
  zoom: 11,
  center: [7.22, 46.18],
  pitch: 60,
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

  const gui = new GUI({ width: 200 });

  // Adding a mesh of a plane.

  const guiObj = {
    heading: 0,
    scale: 1,
    altitude: 3000,
    opacity: 1,
    wireframe: false,
    altitudeReference: "MEAN_SEA_LEVEL",
    removePlane: () => {
      layer3D.removeMesh(originalPlaneID);
    }
  }

  const originalPlaneID = "plane";
  const mesh = await layer3D.addMeshFromURL(
    originalPlaneID,
    "https://docs-media.maptiler.com/docs/models/plane_a340.glb",
    {
      scale: guiObj.scale,
      altitude: guiObj.altitude,
      altitudeReference: AltitudeReference.MEAN_SEA_LEVEL,
      wireframe: guiObj.wireframe,
      lngLat: [7.22, 46.18]
    }
  );

  let planeCanMove = false;

  // Adding mesh of a plane
  map.on("mousemove", (e) => {
    if (!planeCanMove) return;
    mesh.modify({lngLat: e.lngLat})
  });

  map.on("click", (e) => {
    planeCanMove = !planeCanMove;
  });

  gui.add( guiObj, 'heading', 0, 360, 0.1 )
  .onChange((heading) => {
    mesh.modify({heading});
  });

  gui.add( guiObj, 'scale', 0.01, 5, 0.01 )
  .onChange((scale) => {
    mesh.modify({scale});
  });

  gui.add( guiObj, 'altitude', 0, 10000, 1 )
  .onChange((altitude) => {
    mesh.modify({altitude});
  });

  gui.add( guiObj, 'opacity', 0, 1)
  .onChange((opacity) => {
    mesh.modify({opacity});
  });

  gui.add( guiObj, 'altitudeReference', ["MEAN_SEA_LEVEL", "GROUND"])
  .onChange((altRef) => {
    mesh.modify({altitudeReference: maptiler3d.AltitudeReference[altRef]});
  });

  gui.add( guiObj, "wireframe" )
  .onChange((wireframe) => {
    mesh.modify({wireframe});
  });

  gui.add( guiObj, "removePlane" );

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
  <div id="info">
  <p>
    Click on the map to move the plane. You can then click again to fix its position.
  </p>
  </div>
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

[plane a340](https://skfb.ly/oJWGw) by mamont nikita is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/) [↩](https://docs.maptiler.com/sdk-js/examples/3d-js-plane/#fnref:1)

## Related examples

[![Add multiple 3D models to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add multiple 3D models** Example\\
Use the MapTiler 3D JS module to add multiple 3D models to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/)

[![Animate a 3D plane flight](https://docs.maptiler.com/assets/img/example-card.png)**Animate a 3D plane flight** Example\\
Use the MapTiler 3D JS module to simulate and animate a plane flight between two cities.](https://docs.maptiler.com/sdk-js/examples/3d-js-flight/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-plane/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add a airplane 3D model

Add a plane 3D model

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)