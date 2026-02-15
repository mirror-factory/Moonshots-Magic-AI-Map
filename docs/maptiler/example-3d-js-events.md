# Add events on 3D models

Add event listeners to your 3D models to improve interaction with objects added to your maps.

This demonstration showcases how to add user interactivity to 3D models, click, doubleclick, mouseenter, mouseleave.

Add events on 3D models

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Click or move the mouse over the 3D models to get to event information

- NPM module
- Basic JavaScript

```html
<html>
  <head>
    <title>Add events on 3D models</title>
    <style>
      body {margin: 0; padding: 0;}
      #map {position: absolute; top: 0; bottom: 0; width: 100%;}
      #event-info {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: #ffffff;
      }
    </style>

    <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
    <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
    <script src="https://cdn.maptiler.com/maptiler-3d/v3.1.0/maptiler-3d.umd.min.js"></script>
  </head>

  <body>
    <script type="importmap">
    {
      "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"
      }
    }
  </script>
    <div id="map"></div>
    <div id="event-info"></div>
    <script type="module">
      import * as THREE from 'three';

      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

      const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.SATELLITE,
        center: [-119.63553428649902, 37.728162793005595], // starting position [lng, lat]
        zoom: 12.5, // starting zoom
        hash: true,
        bearing: 0,
        pitch: 45,
        terrainControl: true,
        terrain: true,
      });

      const shapes = [\
        {\
          lngLat: [-119.65308666229248, 37.738277034695685],\
            mesh: (\
              new THREE.Mesh(\
                new THREE.BoxGeometry(10, 10, 10),\
                new THREE.MeshStandardMaterial({ color: "red", roughness: 0.5, metalness: 0.5 })\
              )\
          ),\
          name: "box",\
          altitude: 120,\
        },\
        {\
          lngLat: [-119.61553573, 37.723071209025974],\
          mesh: (\
            new THREE.Mesh(\
              new THREE.SphereGeometry(10),\
              new THREE.MeshStandardMaterial({ color: "blue", roughness: 0.5, metalness: 0.5 })\
            )\
          ),\
          name: "sphere",\
          altitude: 120,\
        },\
        {\
          lngLat: [-119.63008403778076, 37.735154664553534],\
          altitude: 260,\
          mesh: (\
              new THREE.Mesh(\
                new THREE.TorusGeometry(10, 5, 32, 32),\
                new THREE.MeshStandardMaterial({ color: "green", roughness: 0.5, metalness: 0.5 })\
              )\
          ),\
          name: "torus"\
        },\
        {\
          lngLat: [-119.65128421783447, 37.72208679574618],\
          altitude: 300,\
          mesh: (\
              new THREE.Mesh(\
                new THREE.TorusKnotGeometry(10, 2, 32, 32),\
                new THREE.MeshStandardMaterial({ color: "rebeccapurple", roughness: 0.5, metalness: 0.5 })\
              )\
          ),\
          name: "torusKnot"\
        },\
      ];

      const info = document.getElementById("event-info");

      function setInfo(text) {
        info.innerHTML = text;
      }

      // Waiting for the map to be ready
      map.on('ready', async () => {
        // Create a Layer3D and add it
        const layer3D = new maptiler3d.Layer3D("custom-3D-layer");
        map.addLayer(layer3D);

         // Increasing the intensity of the ambient light
        layer3D.setAmbientLight({ intensity: 2 });

        // Adding a point light
        layer3D.addPointLight("point-light", { intensity: 30 });

        shapes.forEach((shape) => {
          const initialScale = 20;

          layer3D.addMesh(shape.name, shape.mesh, {
            lngLat: new maptilersdk.LngLat(shape.lngLat[0], shape.lngLat[1]),
            heading: 0,
            scale: initialScale,
            altitude: shape.altitude,
          });
          const mesh = layer3D.getItem3D(shape.name);

          const threeMesh = mesh?.mesh;

          const originalMaterial = threeMesh?.material;
          const swapMaterial = new THREE.MeshBasicMaterial({ color: "dodgerblue" });

          mesh?.on("mouseenter", (event) => {
            const mesh = layer3D.getItem3D(shape.name);
            const threeMesh = mesh?.mesh;
            if (threeMesh && "material" in threeMesh) {
              threeMesh.material = swapMaterial;
            }
            setInfo(`mouseenter! \n
              name: ${shape.name}\n
              lng: ${shape.lngLat[0]} \n
              lat: ${shape.lngLat[1]} \n
              x, y: ${event.point.x}, ${event.point.y} \n
            `);
          });
          mesh?.on("mouseleave", (event) => {
            const mesh = layer3D.getItem3D(shape.name);
            const internalMesh = mesh?.mesh;
            if (internalMesh && "material" in internalMesh) {
              internalMesh.material = originalMaterial;
            }
            setInfo(`mouseleave! \n
              name: ${shape.name}\n
              lng: ${shape.lngLat[0]} \n
              lat: ${shape.lngLat[1]} \n
              x, y: ${event.point.x}, ${event.point.y} \n
            `);
          });

          mesh?.on("click", (event) => {
            if (mesh?.scale[0] === initialScale) {
              mesh?.setScale(initialScale * 1.5);
            } else {
              mesh?.setScale(initialScale);
            }
            setInfo(`click! \n
              name: ${shape.name}\n
              lng: ${shape.lngLat[0]} \n
              lat: ${shape.lngLat[1]} \n
              x, y: ${event.point.x}, ${event.point.y} \n
            `);
          });

          mesh?.on("dblclick", (event) => {
            setInfo(`dblclick! \n
              name: ${shape.name}\n
              lng: ${shape.lngLat[0]} \n
              lat: ${shape.lngLat[1]} \n
              x, y: ${event.point.x}, ${event.point.y} \n
            `);
          });
        });

        let heading = 0;

        function loop() {
          requestAnimationFrame(loop);
          for (const { name: meshName } of shapes) {
            layer3D.getItem3D(meshName)?.modify({
              heading: heading,
            });
          }
          heading += 0.5;
        }

        loop();
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

import * as THREE from 'three';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

const map = new Map({
  container: 'map',
  style: MapStyle.SATELLITE,
  center: [-119.63553428649902, 37.728162793005595], // starting position [lng, lat]
  zoom: 12.5, // starting zoom
  hash: true,
  bearing: 0,
  pitch: 45,
  terrainControl: true,
  terrain: true,
});

const shapes = [\
  {\
    lngLat: [-119.65308666229248, 37.738277034695685],\
      mesh: (\
        new THREE.Mesh(\
          new THREE.BoxGeometry(10, 10, 10),\
          new THREE.MeshStandardMaterial({ color: "red", roughness: 0.5, metalness: 0.5 })\
        )\
    ),\
    name: "box",\
    altitude: 120,\
  },\
  {\
    lngLat: [-119.61553573, 37.723071209025974],\
    mesh: (\
      new THREE.Mesh(\
        new THREE.SphereGeometry(10),\
        new THREE.MeshStandardMaterial({ color: "blue", roughness: 0.5, metalness: 0.5 })\
      )\
    ),\
    name: "sphere",\
    altitude: 120,\
  },\
  {\
    lngLat: [-119.63008403778076, 37.735154664553534],\
    altitude: 260,\
    mesh: (\
        new THREE.Mesh(\
          new THREE.TorusGeometry(10, 5, 32, 32),\
          new THREE.MeshStandardMaterial({ color: "green", roughness: 0.5, metalness: 0.5 })\
        )\
    ),\
    name: "torus"\
  },\
  {\
    lngLat: [-119.65128421783447, 37.72208679574618],\
    altitude: 300,\
    mesh: (\
        new THREE.Mesh(\
          new THREE.TorusKnotGeometry(10, 2, 32, 32),\
          new THREE.MeshStandardMaterial({ color: "rebeccapurple", roughness: 0.5, metalness: 0.5 })\
        )\
    ),\
    name: "torusKnot"\
  },\
];

const info = document.getElementById("event-info");

function setInfo(text) {
  info.innerHTML = text;
}

// Waiting for the map to be ready
map.on('ready', async () => {
  // Create a Layer3D and add it
  const layer3D = new Layer3D("custom-3D-layer");
  map.addLayer(layer3D);

   // Increasing the intensity of the ambient light
  layer3D.setAmbientLight({ intensity: 2 });

  // Adding a point light
  layer3D.addPointLight("point-light", { intensity: 30 });

  shapes.forEach((shape) => {
    const initialScale = 20;

    layer3D.addMesh(shape.name, shape.mesh, {
      lngLat: new maptilersdk.LngLat(shape.lngLat[0], shape.lngLat[1]),
      heading: 0,
      scale: initialScale,
      altitude: shape.altitude,
    });
    const mesh = layer3D.getItem3D(shape.name);

    const threeMesh = mesh?.mesh;

    const originalMaterial = threeMesh?.material;
    const swapMaterial = new THREE.MeshBasicMaterial({ color: "dodgerblue" });

    mesh?.on("mouseenter", (event) => {
      const mesh = layer3D.getItem3D(shape.name);
      const threeMesh = mesh?.mesh;
      if (threeMesh && "material" in threeMesh) {
        threeMesh.material = swapMaterial;
      }
      setInfo(`mouseenter! \n
        name: ${shape.name}\n
        lng: ${shape.lngLat[0]} \n
        lat: ${shape.lngLat[1]} \n
        x, y: ${event.point.x}, ${event.point.y} \n
      `);
    });
    mesh?.on("mouseleave", (event) => {
      const mesh = layer3D.getItem3D(shape.name);
      const internalMesh = mesh?.mesh;
      if (internalMesh && "material" in internalMesh) {
        internalMesh.material = originalMaterial;
      }
      setInfo(`mouseleave! \n
        name: ${shape.name}\n
        lng: ${shape.lngLat[0]} \n
        lat: ${shape.lngLat[1]} \n
        x, y: ${event.point.x}, ${event.point.y} \n
      `);
    });

    mesh?.on("click", (event) => {
      if (mesh?.scale[0] === initialScale) {
        mesh?.setScale(initialScale * 1.5);
      } else {
        mesh?.setScale(initialScale);
      }
      setInfo(`click! \n
        name: ${shape.name}\n
        lng: ${shape.lngLat[0]} \n
        lat: ${shape.lngLat[1]} \n
        x, y: ${event.point.x}, ${event.point.y} \n
      `);
    });

    mesh?.on("dblclick", (event) => {
      setInfo(`dblclick! \n
        name: ${shape.name}\n
        lng: ${shape.lngLat[0]} \n
        lat: ${shape.lngLat[1]} \n
        x, y: ${event.point.x}, ${event.point.y} \n
      `);
    });
  });

  let heading = 0;

  function loop() {
    requestAnimationFrame(loop);
    for (const { name: meshName } of shapes) {
      layer3D.getItem3D(meshName)?.modify({
        heading: heading,
      });
    }
    heading += 0.5;
  }

  loop();
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
  <title>Add events on 3D models</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div id="map"></div>
  <div id="event-info"></div>
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

## Related examples

[![Display an animated 3D model](https://docs.maptiler.com/assets/img/example-card.png)**Animate a 3D model** Example\\
With animation, your 3D models take on a whole new dimension. You can bring them to life and display them on a map](https://docs.maptiler.com/sdk-js/examples/3d-js-animated/)

[![Add a airplane 3D model](https://docs.maptiler.com/assets/img/example-card.png)**Add a plane 3D model** Example\\
Use the MapTiler 3D JS module to add a airplane model to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-plane/)

[![Add multiple 3D models to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add multiple 3D models** Example\\
Use the MapTiler 3D JS module to add multiple 3D models to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-events/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add events on 3D models

3D model events

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)