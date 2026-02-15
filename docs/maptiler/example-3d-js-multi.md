# Add multiple 3D models to the map

Use the [MapTiler 3D JS module](https://docs.maptiler.com/sdk-js/modules/3d/) to incorporate multiple 3D models into your map. The 3D JS module enables you to integrate multiple 3D objects onto the map surface. You can adjust model sizes, create duplicates, position models at specific elevations above sea level, and more. This offers complete flexibility in manipulating your 3D models.

This demonstration showcases a compact control interface that allows us to select diferents models and modify various model parameters and observe their immediate impact on the model’s behavior.

Add a 3D model

[MapTiler logo](https://www.maptiler.com/)

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Controls

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/#fn:1)

To add a model to the map, select a model from the list in the control panel and then click on the map.

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
    To add a model to the map, select a model from the list in the control panel and then click on the map.
  </p>
</div>
<script>
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

  const map = new maptilersdk.Map({
    container: document.getElementById('map'),
    hash: true,
    style: maptilersdk.MapStyle.OUTDOOR,
    zoom: 18,
    center: [2.340862, 48.8565787],
    pitch: 60,
    maxPitch: 85,
    terrainControl: true,
    terrain: true,
    maptilerLogo: true,
  });

  (async () => {
    await map.onReadyAsync();

    const layer3D = new maptiler3d.Layer3D("custom-3D-layer");
    map.addLayer(layer3D);

    // Increasing the intensity of the ambient light
    layer3D.setAmbientLight({intensity: 2});

    // Adding a point light
    layer3D.addPointLight("point-light", {intensity: 30});

    const gui = new lil.GUI({ width: 200 });

    // Adding a mesh of a lantern.
    // We make this first mesh invisible because we will only use it to be cloned
    const originalLanternID = "lantern";
    await layer3D.addMeshFromURL(
      originalLanternID,
      "https://docs-media.maptiler.com/docs/models/lantern.glb",
      {
        scale: 1,
        visible: true,
        heading: 215,
        lngLat: [2.34090194106102, 48.856414043180365]
      }
    );

    const originalDuckID = "duck";
    await layer3D.addMeshFromURL(
      originalDuckID,
      "https://docs-media.maptiler.com/docs/models/duck.glb",
      {
        scale: 10,
        visible: true,
        heading: 155,
        lngLat: [2.341223806142807, 48.85620756643411]
      }
    );

    const originalPlaneID = "plane";
    await layer3D.addMeshFromURL(
      originalPlaneID,
      "https://docs-media.maptiler.com/docs/models/plane_a340.glb",
      {
        scale: 1,
        visible: false,
        altitude: 0,
        altitudeReference: maptiler3d.AltitudeReference.MEAN_SEA_LEVEL,
      }
    );

    const originalDragonID = "dragon";
    await layer3D.addMeshFromURL(
      originalDragonID,
      "https://docs-media.maptiler.com/docs/models/stanford_dragon_pbr.glb",
      {
        scale: 0.20,
        visible: true,
        heading: 215.7,
        lngLat: [2.340295761823654, 48.85677758136464]
      }
    );

    const guiObj = {
      model: originalLanternID,
      heading: 0,
      scale: 1,
      altitude: 0,
    }

    let meshCounter = 0;
    let latestMeshID = originalLanternID

    // Clones of this mesh will be added as we click on the map.
    // The lantern model that is used for the clone is the latest mesh added,
    // so that we can benefit from the latest heading we defined
    map.on("click", (e) => {
      meshCounter += 1;
      const newCloneID = `${originalLanternID}_${meshCounter}`;
      console.log(e.lngLat);
      layer3D.cloneMesh(guiObj.model, newCloneID, {lngLat: e.lngLat, visible: true, heading: guiObj.heading, scale: guiObj.scale})
      latestMeshID = newCloneID;
    })

    gui.add(guiObj, "model", [originalLanternID, originalDuckID, originalPlaneID, originalDragonID])

    // We can change the heading of the latest mesh added
    gui.add( guiObj, 'heading', 0, 360, 0.1 )
    .onChange((heading) => {
      const mesh = layer3D.getItem3D(latestMeshID);
      mesh.modify({heading});
    });

    gui.add( guiObj, 'scale', 0.01, 10, 0.01 )
    .onChange((scale) => {
      const mesh = layer3D.getItem3D(latestMeshID);
      mesh.modify({scale});
    })

    gui.add( guiObj, 'altitude', -100, 1000, 1 )
    .onChange((altitude) => {
      const mesh = layer3D.getItem3D(latestMeshID);
      mesh.modify({altitude});
    })

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
  style: MapStyle.OUTDOOR,
  zoom: 18,
  center: [2.340862, 48.8565787],
  pitch: 60,
  maxPitch: 85,
  terrainControl: true,
  terrain: true,
  maptilerLogo: true,
});

(async () => {
  await map.onReadyAsync();

  const layer3D = new Layer3D("custom-3D-layer");
  map.addLayer(layer3D);

  // Increasing the intensity of the ambient light
  layer3D.setAmbientLight({intensity: 2});

  // Adding a point light
  layer3D.addPointLight("point-light", {intensity: 30});

  const gui = new GUI({ width: 200 });

  // Adding a mesh of a lantern.
  // We make this first mesh invisible because we will only use it to be cloned
  const originalLanternID = "lantern";
  await layer3D.addMeshFromURL(
    originalLanternID,
    "https://docs-media.maptiler.com/docs/models/lantern.glb",
    {
      scale: 1,
      visible: true,
      heading: 215,
      lngLat: [2.34090194106102, 48.856414043180365]
    }
  );

  const originalDuckID = "duck";
  await layer3D.addMeshFromURL(
    originalDuckID,
    "https://docs-media.maptiler.com/docs/models/duck.glb",
    {
      scale: 10,
      visible: true,
      heading: 155,
      lngLat: [2.341223806142807, 48.85620756643411]
    }
  );

  const originalPlaneID = "plane";
  await layer3D.addMeshFromURL(
    originalPlaneID,
    "https://docs-media.maptiler.com/docs/models/plane_a340.glb",
    {
      scale: 1,
      visible: false,
      altitude: 0,
      altitudeReference: AltitudeReference.MEAN_SEA_LEVEL,
    }
  );

  const originalDragonID = "dragon";
  await layer3D.addMeshFromURL(
    originalDragonID,
    "https://docs-media.maptiler.com/docs/models/stanford_dragon_pbr.glb",
    {
      scale: 0.20,
      visible: true,
      heading: 215.7,
      lngLat: [2.340295761823654, 48.85677758136464]
    }
  );

  const guiObj = {
    model: originalLanternID,
    heading: 0,
    scale: 1,
    altitude: 0,
  }

  let meshCounter = 0;
  let latestMeshID = originalLanternID

  // Clones of this mesh will be added as we click on the map.
  // The lantern model that is used for the clone is the latest mesh added,
  // so that we can benefit from the latest heading we defined
  map.on("click", (e) => {
    meshCounter += 1;
    const newCloneID = `${originalLanternID}_${meshCounter}`;
    console.log(e.lngLat);
    layer3D.cloneMesh(guiObj.model, newCloneID, {lngLat: e.lngLat, visible: true, heading: guiObj.heading, scale: guiObj.scale})
    latestMeshID = newCloneID;
  })

  gui.add(guiObj, "model", [originalLanternID, originalDuckID, originalPlaneID, originalDragonID])

  // We can change the heading of the latest mesh added
  gui.add( guiObj, 'heading', 0, 360, 0.1 )
  .onChange((heading) => {
    const mesh = layer3D.getItem3D(latestMeshID);
    mesh.modify({heading});
  });

  gui.add( guiObj, 'scale', 0.01, 10, 0.01 )
  .onChange((scale) => {
    const mesh = layer3D.getItem3D(latestMeshID);
    mesh.modify({scale});
  })

  gui.add( guiObj, 'altitude', -100, 1000, 1 )
  .onChange((altitude) => {
    const mesh = layer3D.getItem3D(latestMeshID);
    mesh.modify({altitude});
  })

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
    To add a model to the map, select a model from the list in the control panel and then click on the map.
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
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy

- [plane a340](https://skfb.ly/oJWGw) by mamont nikita is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/)
- [COLLADA duck](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main) One texture Credit: © 2006, Sony. [SCEA Shared Source License, Version 1.0](https://spdx.org/licenses/SCEA.html)
- [Old wooden street light](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main) © 2018, Frank Galligan. [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
- [Stanford Dragon PBR](https://skfb.ly/otyzN) by hackmans is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/)

[↩](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/#fnref:1)

## Related examples

[![Display a LIDAR data 3D city model](https://docs.maptiler.com/assets/img/example-card.png)**Display a LIDAR data 3D city model** Example\\
Use the MapTiler 3D JS module to display a LIDAR data 3D city model on a map.](https://docs.maptiler.com/sdk-js/examples/3d-js-point-cloud-lidar/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![Add a airplane 3D model](https://docs.maptiler.com/assets/img/example-card.png)**Add a plane 3D model** Example\\
Use the MapTiler 3D JS module to add a airplane model to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-plane/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add multiple 3D models to the map

Add multiple 3D models

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)