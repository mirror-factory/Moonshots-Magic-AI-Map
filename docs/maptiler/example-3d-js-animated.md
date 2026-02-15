# Display an animated 3D model

With animation, your 3D models take on a whole new dimension. You can bring them to life and display them on a map. If your 3D model has animations you can play these animations with the 3D JS module of the MapTiler SDK.

This demonstration showcases how to add a animated 3D model in a map.

Add an animated 3D model

Model by [Mirada](https://mirada.com/) for [3 Dreams of Black](https://experiments.withgoogle.com/3-dreams-of-black) \| [© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-animated/#fn:1)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Add an animated 3D model</title>
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

  const map = new maptilersdk.Map({
    container: document.getElementById('map'),
    style: maptilersdk.MapStyle.STREETS,
    center: [-3.0615632, 56.4547039], // starting position [lng, lat]
    zoom: 13, // starting zoom
    bearing: 90.1,
    pitch: 60,
    attributionControl: {
      customAttribution: "Model by <a href='https://mirada.com/' target='_blank'>Mirada</a> for <a href='https://experiments.withgoogle.com/3-dreams-of-black' target='_blank'>3 Dreams of Black</a>",
    }
  });

  // Waiting for the map to be ready
  map.on('ready', async () => {
    // Create a Layer3D and add it
    const layer3D = new maptiler3d.Layer3D("custom-3D-layer");
    map.addLayer(layer3D);

      // Increasing the intensity of the ambient light
    layer3D.setAmbientLight({ intensity: 2 });

    // Adding a point light
    layer3D.addPointLight("point-light", { intensity: 30 });

    // The call can be awaited for the whole download of the mesh to complete
    await layer3D.addMeshFromURL(
      // ID to give to this mesh, unique within this Layer3D instance
      "flamingo",

      // The URL of the mesh
      "https://docs-media.maptiler.com/docs/models/flamingo.glb",

      // A set of options, these can be modified later
      {
        lngLat: [-3.0615632, 56.4547039],
        heading: 150,
        scale: 10,
        animationMode: "continuous",
      }
    );

    const mesh = layer3D.getItem3D("flamingo");

    const animationNames = mesh?.getAnimationNames();

    const animationName = animationNames?.[0];

    if (!animationName) {
      throw new Error(`No animation found with name '${animationName}'`);
    }

    mesh?.playAnimation(
      animationName,
      "loop",
    );
  });

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
import { Layer3D } from '@maptiler/3d';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

const map = new Map({
  container: document.getElementById('map'),
  style: MapStyle.STREETS,
  center: [-3.0615632, 56.4547039], // starting position [lng, lat]
  zoom: 13, // starting zoom
  bearing: 90.1,
  pitch: 60,
  attributionControl: {
    customAttribution: "Model by <a href='https://mirada.com/' target='_blank'>Mirada</a> for <a href='https://experiments.withgoogle.com/3-dreams-of-black' target='_blank'>3 Dreams of Black</a>",
  }
});

// Waiting for the map to be ready
map.on('ready', async () => {
  // Create a Layer3D and add it
  const layer3D = new Layer3D("custom-3D-layer");
  map.addLayer(layer3D);

    // Increasing the intensity of the ambient light
  layer3D.setAmbientLight({ intensity: 2 });

  // Adding a point light
  layer3D.addPointLight("point-light", { intensity: 30 });

  // The call can be awaited for the whole download of the mesh to complete
  await layer3D.addMeshFromURL(
    // ID to give to this mesh, unique within this Layer3D instance
    "flamingo",

    // The URL of the mesh
    "https://docs-media.maptiler.com/docs/models/flamingo.glb",

    // A set of options, these can be modified later
    {
      lngLat: [-3.0615632, 56.4547039],
      heading: 150,
      scale: 10,
      animationMode: "continuous",
    }
  );

  const mesh = layer3D.getItem3D("flamingo");

  const animationNames = mesh?.getAnimationNames();

  const animationName = animationNames?.[0];

  if (!animationName) {
    throw new Error(`No animation found with name '${animationName}'`);
  }

  mesh?.playAnimation(
    animationName,
    "loop",
  );
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
  <title>Add an animated 3D model</title>
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

Model by [Mirada](https://mirada.com/) for [3 Dreams of Black](https://experiments.withgoogle.com/3-dreams-of-black) [↩](https://docs.maptiler.com/sdk-js/examples/3d-js-animated/#fnref:1)

## Related examples

[![Import and play GLTF animations from GLTF files](https://docs.maptiler.com/assets/img/example-card.png)**Play GLTF animations** Example\\
Use the MapTiler 3D JS module to play animations in a GLTF model and move the models to simulate a flight over the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-animated-flight/)

[![Add events on 3D models](https://docs.maptiler.com/assets/img/example-card.png)**3D model events** Example\\
Use the MapTiler 3D JS module to listen for mouse events on 3D models.](https://docs.maptiler.com/sdk-js/examples/3d-js-events/)

[![Animate a 3D plane flight](https://docs.maptiler.com/assets/img/example-card.png)**Animate a 3D plane flight** Example\\
Use the MapTiler 3D JS module to simulate and animate a plane flight between two cities.](https://docs.maptiler.com/sdk-js/examples/3d-js-flight/)

[![Add multiple 3D models to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add multiple 3D models** Example\\
Use the MapTiler 3D JS module to add multiple 3D models to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-animated/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Display an animated 3D model

Animate a 3D model

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)