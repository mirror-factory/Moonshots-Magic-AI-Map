# Add a 3D model on a map

Use the MapTiler SDK 3D JS module to add 3D objects to your map from glTF/glb files! These can be meshes, groups of meshes, point clouds, or a mix of all these.

MapTiler AR Control

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-get-started/#fn:1)

- NPM module
- Basic JavaScript

1. Since the 3D model is going to be added to a Map, let’s instantiate a map first. Copy the following code, paste it into your favorite text editor, and save it as a `.html` file.



```html

```





HTML



Copy

2. Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

3. Waiting for the map to be ready to add the 3D layer. An instance of `Layer3D` is a custom type of layer that contain a 3D scene, where multiple 3D meshes and lights can be added. Like any other layer in MapTiler SDK JS, it must have an ID and then be added to a `Map` instance.



```js

```





JavaScript



Copy


1. Install the npm package.



```bash
npm install --save @maptiler/sdk @maptiler/3d
```





Bash



Copy

2. Include the CSS file.

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/3d-js-get-started/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/3d-js-get-started/#) in the head of the document via the CDN



```js
import "@maptiler/sdk/dist/maptiler-sdk.css";
```





JavaScript



Copy







```html
<link href='https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css' rel='stylesheet' />
```





HTML



Copy

3. Include the following code in your JavaScript file (Example: app.js).



```js

```





JavaScript



Copy

4. Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

5. Waiting for the map to be ready to add the 3D layer. An instance of `Layer3D` is a custom type of layer that contain a 3D scene, where multiple 3D meshes and lights can be added. Like any other layer in MapTiler SDK JS, it must have an ID and then be added to a `Map` instance.



```js

```





JavaScript



Copy


6. Once created and added, a mesh can be added. In this version any glTF and their binary counterpart glb files can be added. Add a mesh to the layer. In this example we will use the model [The COLLADA duck. One texture. Credit: © 2006, Sony. SCEA Shared Source License, Version 1.0](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main)



```js

```





JavaScript



Copy


View complete source code

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MapTiler AR Control</title>
    <!-- Importing MapTiler SDK -->
    <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
    <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />

    <!-- Importing MapTiler 3D js -->
    <script src="https://cdn.maptiler.com/maptiler-3d/v3.1.0/maptiler-3d.umd.min.js"></script>

    <style>
      body { margin: 0; padding: 0; }
      #map { position: absolute; top: 0; bottom: 0; width: 100%; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

      // Creating a map
      const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.DATAVIZ,
        center: [-3.0615632, 56.4547039], // starting position [lng, lat]
        zoom: 18, // starting zoom
      });

      // Waiting for the map to be ready
      map.on('ready', async () => {
        // Create a Layer3D and add it
        const layer3D = new maptiler3d.Layer3D("custom-3D-layer");
        map.addLayer(layer3D);

        // Increasing the intensity of the ambient light
        layer3D.setAmbientLight({intensity: 2});

        // Adding a point light
        layer3D.addPointLight("point-light", {intensity: 30});

        /*
        "Duck, © 2006, Sony. SCEA Shared Source License, Version 1.0 - https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main
        */

        // The call can be awaited for the whole download of the mesh to complete
        await layer3D.addMeshFromURL(
          // ID to give to this mesh, unique within this Layer3D instance
          "duck",

          // The URL of the mesh
          "https://docs-media.maptiler.com/docs/models/duck.glb",

          // A set of options, these can be modified later
          {
            lngLat: [-3.0615632, 56.4547039],
            heading: 150,
            scale: 10
          }
        );

        layer3D.cloneMesh("duck", "duck-baby", {
          lngLat: [-3.0617744, 56.4545475],
          heading: 45,
          scale: 3,
        });

        layer3D.cloneMesh("duck", "duck-baby-1", {
          lngLat: [-3.0613331, 56.4546995],
          heading: 180,
          scale: 4,
        });

        layer3D.cloneMesh("duck", "duck-baby-2", {
          lngLat: [-3.0611772, 56.4546843],
          heading: 190,
          scale: 3,
        });

      });

    </script>
  </body>
</html>
```

HTML

Copy

View complete source code

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

// Creating a map
const map = new Map({
  container: 'map',
  style: MapStyle.DATAVIZ,
  center: [-3.0615632, 56.4547039], // starting position [lng, lat]
  zoom: 18, // starting zoom
});

// Waiting for the map to be ready
map.on('ready', async () => {
  // Create a Layer3D and add it
  const layer3D = new Layer3D("custom-3D-layer");
  map.addLayer(layer3D);

  // Increasing the intensity of the ambient light
  layer3D.setAmbientLight({intensity: 2});

  // Adding a point light
  layer3D.addPointLight("point-light", {intensity: 30});

  /*
  "Duck, © 2006, Sony. SCEA Shared Source License, Version 1.0 - https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main
  */

  // The call can be awaited for the whole download of the mesh to complete
  await layer3D.addMeshFromURL(
    // ID to give to this mesh, unique within this Layer3D instance
    "duck",

    // The URL of the mesh
    "https://docs-media.maptiler.com/docs/models/duck.glb",

    // A set of options, these can be modified later
    {
      lngLat: [-3.0615632, 56.4547039],
      heading: 150,
      scale: 10
    }
  );

  layer3D.cloneMesh("duck", "duck-baby", {
    lngLat: [-3.0617744, 56.4545475],
    heading: 45,
    scale: 3,
  });

  layer3D.cloneMesh("duck", "duck-baby-1", {
    lngLat: [-3.0613331, 56.4546995],
    heading: 180,
    scale: 4,
  });

  layer3D.cloneMesh("duck", "duck-baby-2", {
    lngLat: [-3.0611772, 56.4546843],
    heading: 190,
    scale: 3,
  });

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
  <title>MapTiler AR Control</title>
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

[COLLADA duck](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main) One texture Credit: © 2006, Sony. [SCEA Shared Source License, Version 1.0](https://spdx.org/licenses/SCEA.html) [↩](https://docs.maptiler.com/sdk-js/examples/3d-js-get-started/#fnref:1)

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

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-get-started/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add a 3D model on a map

Add a 3D model on a map

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)