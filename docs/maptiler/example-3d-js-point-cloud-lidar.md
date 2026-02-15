# Display a LIDAR data 3D city model

Utilize the [MapTiler 3D JS module](https://docs.maptiler.com/sdk-js/modules/3d/) to render LIDAR-based 3D urban visualizations on maps. The 3D JS module enables exploration of LIDAR point cloud data and detailed model examination. Users can view existing city structures and visualize proposed urban development concepts through interactive modeling.

This demonstration showcases a small control interface that allows to adjust various model parameters and instantly see their effects on the model’s behavior.

Add a 3D model

[MapTiler logo](https://www.maptiler.com/)

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Controls

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-point-cloud-lidar/#fn:1)

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

  const map = new maptilersdk.Map({
    container: document.getElementById('map'),
    style: maptilersdk.MapStyle.STREETS,
    zoom: 15.5,
    center: [-74.076273, 40.58592],
    pitch: 60,
    maxPitch: 85,
    terrainControl: true,
    terrain: true,
    maptilerLogo: true,
  });

  (async () => {
    await map.onReadyAsync();

    map.setSky({
      "sky-color": "#b2ddfa",
      "horizon-color": "#FFFFFF",
      "fog-color": "#FFFFFF",
      "fog-ground-blend": 0.8,
      "horizon-fog-blend": 0.1,
      "sky-horizon-blend": 0.6,
      "atmosphere-blend": 0.5,
    })

    const layer3D = new maptiler3d.Layer3D("custom-3D-layer");
    map.addLayer(layer3D);

    // Increasing the intensity of the ambient light
    layer3D.setAmbientLight({intensity: 2});

    // Adding a point light
    layer3D.addPointLight("point-light", {intensity: 30});

    const gui = new lil.GUI({ width: 200 });

    const meshId = "some-mesh";
    const mesh = await layer3D.addMeshFromURL(
      meshId,
      "https://docs-media.maptiler.com/docs/models/parque_copan_design_proposal.glb",
      {
        lngLat: [-74.0839886924465, 40.5804232016599],
        scale: 1,
        visible: true,
        altitude: -752,
        altitudeReference: maptiler3d.AltitudeReference.GROUND,
      }
    );

    const guiObj = {
      opacity: 1,
      pointSize: 1,
    }

    gui.add( guiObj, 'opacity', 0, 1)
    .onChange((opacity) => {
      mesh.modify({opacity});
    });

    gui.add( guiObj, 'pointSize', 0, 20, 0.1 )
    .onChange((pointSize) => {
      mesh.modify({pointSize});
    });

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
  style: MapStyle.STREETS,
  zoom: 15.5,
  center: [-74.076273, 40.58592],
  pitch: 60,
  maxPitch: 85,
  terrainControl: true,
  terrain: true,
  maptilerLogo: true,
});

(async () => {
  await map.onReadyAsync();

  map.setSky({
    "sky-color": "#b2ddfa",
    "horizon-color": "#FFFFFF",
    "fog-color": "#FFFFFF",
    "fog-ground-blend": 0.8,
    "horizon-fog-blend": 0.1,
    "sky-horizon-blend": 0.6,
    "atmosphere-blend": 0.5,
  })

  const layer3D = new Layer3D("custom-3D-layer");
  map.addLayer(layer3D);

  // Increasing the intensity of the ambient light
  layer3D.setAmbientLight({intensity: 2});

  // Adding a point light
  layer3D.addPointLight("point-light", {intensity: 30});

  const gui = new GUI({ width: 200 });

  const meshId = "some-mesh";
  const mesh = await layer3D.addMeshFromURL(
    meshId,
    "https://docs-media.maptiler.com/docs/models/parque_copan_design_proposal.glb",
    {
      lngLat: [-74.0839886924465, 40.5804232016599],
      scale: 1,
      visible: true,
      altitude: -752,
      altitudeReference: AltitudeReference.GROUND,
    }
  );

  const guiObj = {
    opacity: 1,
    pointSize: 1,
  }

  gui.add( guiObj, 'opacity', 0, 1)
  .onChange((opacity) => {
    mesh.modify({opacity});
  });

  gui.add( guiObj, 'pointSize', 0, 20, 0.1 )
  .onChange((pointSize) => {
    mesh.modify({pointSize});
  });

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

[Parque Copan (design proposal)](https://skfb.ly/o8qrG) by Philipp Urech (Topostudio) is licensed under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/) [↩](https://docs.maptiler.com/sdk-js/examples/3d-js-point-cloud-lidar/#fnref:1)

## Related examples

[![Display a 3D building model generated with photogrammetry software](https://docs.maptiler.com/assets/img/example-card.png)**Display a 3D photogrammetry building model** Example\\
Use the MapTiler 3D JS module to display a 3D building model generated with photogrammetry software processing thousands images on a map.](https://docs.maptiler.com/sdk-js/examples/3d-js-point-cloud-dundee/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![Animate a 3D plane flight](https://docs.maptiler.com/assets/img/example-card.png)**Animate a 3D plane flight** Example\\
Use the MapTiler 3D JS module to simulate and animate a plane flight between two cities.](https://docs.maptiler.com/sdk-js/examples/3d-js-flight/)

[![Display a building model based on point cloud data on a map.](https://docs.maptiler.com/assets/img/example-card.png)**Display a building model** Example\\
Use the MapTiler 3D JS module to display the wireframe of a building 3D model based on point cloud data on a map.](https://docs.maptiler.com/sdk-js/examples/3d-js-point-cad/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-point-cloud-lidar/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Display a LIDAR data 3D city model

Display a LIDAR data 3D city model

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)