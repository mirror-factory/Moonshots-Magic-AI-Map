# Import and play GLTF animations from GLTF files

Use the MapTiler 3D JS module to play animations in a GLTF model and move the models to simulate a flight over the map

This demonstration showcases how to add a animated 3D model in a map and moved it acroos the map.

Add an animated 3D model

Model by [Mirada](https://mirada.com/) for [3 Dreams of Black](https://experiments.withgoogle.com/3-dreams-of-black) \| [© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

[Model credit](https://docs.maptiler.com/sdk-js/examples/3d-js-animated-flight/#fn:1)

- NPM module
- Basic JavaScript

```html
<html>
  <head>
    <title>Add an animated 3D model</title>
    <style>
      body {margin: 0; padding: 0;}
      #map {position: absolute; top: 0; bottom: 0; width: 100%;}
      .lil-gui.autoPlace {
        right: inherit;
        left: 15px;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/lil-gui@0.19"></script>
    <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
    <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
    <script src="https://cdn.maptiler.com/maptiler-3d/v3.1.0/maptiler-3d.umd.min.js"></script>

  </head>

  <body>
    <div id="map"></div>
    <script>
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

      const lakeNatron = [36.01695746068115, -2.3536069164210653];
      const makadikadi = [25.5527055978211, -20.78468929963636];

      function calculateHeading(lat1, lon1, lat2, lon2) {
        const φ1 = maptilersdk.math.toRadians(lat1);
        const φ2 = maptilersdk.math.toRadians(lat2);
        const Δλ = maptilersdk.math.toRadians(lon2 - lon1);

        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

        let θ = Math.atan2(y, x);
        θ = maptilersdk.math.toDegrees(θ);
        return ((θ + 360) % 360) + 90; // Normalize to 0–360 and add 90 degrees
      }

      const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.AQUARELLE.VIVID,
        center: lakeNatron, // starting position [lng, lat]
        zoom: 10, // starting zoom
        hash: true,
        bearing: 0,
        pitch: 45,
        attributionControl: {
          customAttribution: "Model by <a href='https://mirada.com/' target='_blank'>Mirada</a> for <a href='https://experiments.withgoogle.com/3-dreams-of-black' target='_blank'>3 Dreams of Black</a>",
        }
      });

      // Waiting for the map to be ready
      map.on('ready', async () => {

        map.setSky({
          "sky-color": "#0C2E4B",
          "horizon-color": "#09112F",
          "fog-color": "#09112F",
          "fog-ground-blend": 0.5,
          "horizon-fog-blend": 0.1,
          "sky-horizon-blend": 1.0,
          "atmosphere-blend": 0.5,
        });

        // Create a Layer3D and add it
        const layer3D = new maptiler3d.Layer3D("custom-3D-layer");
        map.addLayer(layer3D);

         // Increasing the intensity of the ambient light
        layer3D.setAmbientLight({ intensity: 2 });

        // Adding a point light
        layer3D.addPointLight("point-light", { intensity: 30 });

        const flamingoIDOne = "flamingo";
        const flamingoIDTwo = "flamingo-clone";

        // The call can be awaited for the whole download of the mesh to complete
        await layer3D.addMeshFromURL(
          // ID to give to this mesh, unique within this Layer3D instance
          flamingoIDOne,

          // The URL of the mesh
          "https://docs-media.maptiler.com/docs/models/flamingo.glb",

          // A set of options, these can be modified later
          {
            lngLat: lakeNatron,
            heading: 12,
            scale: 100,
            animationMode: "continuous",
            altitudeReference: maptiler3d.AltitudeReference.MEAN_SEA_LEVEL,
            transform: {
              rotation: {
                x: 0,
                y: Math.PI / 2,
                z: 0,
              },
              offset: {
                x: 0,
                y: 0,
                z: -150,
              },
            },
          }
        );

        const fly = "fly!";
        const migrate = "migrate with the flamingo";
        const speed = "migration speed";

        const guiObj = {
          [fly]: true,
          [migrate]: true,
          [speed]: 0.0005,
        };

        const gui = new lil.GUI({ width: 250 });

        gui.add(guiObj, migrate);

        gui.add(guiObj, fly).onChange((play) => {
          if (play) {
            playAnimation();
          }
        });

        gui.add(guiObj, speed, 0, 0.001);

        const mesh = layer3D.getItem3D("flamingo");

        let progress = 0;

        const animationNames = mesh?.getAnimationNames();

        const animationName = animationNames?.[0];

        if (!animationName) {
          throw new Error(`No animation found with name '${animationName}'`);
        }

        layer3D.cloneMesh(flamingoIDOne, flamingoIDTwo, {
          animationMode: "manual",
          transform: {
            offset: {
              x: 0,
              y: 0,
              z: 300,
            },
          },
        });

        layer3D.getItem3D(flamingoIDOne)?.playAnimation(
          animationName,
          "loop",
        );

        layer3D.getItem3D(flamingoIDTwo)?.playAnimation(
          animationName,
          "loop",
        );

        const distance = maptilersdk.math.haversineDistanceWgs84(lakeNatron, makadikadi);

        const initialHeading = calculateHeading(makadikadi[1], makadikadi[0], lakeNatron[1], lakeNatron[0]);

        const flamingoOneMesh = layer3D.getItem3D(flamingoIDOne);
        const flamingoTwoMesh = layer3D.getItem3D(flamingoIDTwo);

        flamingoOneMesh.modify({ heading: initialHeading });
        flamingoTwoMesh.modify({ heading: initialHeading });

        function playAnimation() {
          progress += guiObj[speed];

          if (progress > 1) {
            progress = 0;
          }

          const nextPosition = maptilersdk.math.haversineIntermediateWgs84(lakeNatron, makadikadi, progress - (guiObj[speed] === 0 ? 0.001 : guiObj[speed]));
          const position = maptilersdk.math.haversineIntermediateWgs84(lakeNatron, makadikadi, progress);

          const roughHeading = calculateHeading(position[1], position[0], nextPosition[1], nextPosition[0]);

          // `updateAnimation` is only needed if you want to control the animation manually
          // to automatically play the animation independently of map updates, set the item
          // animationMode: "continuous"

          flamingoTwoMesh.updateAnimation(guiObj[speed] * 50);

          const distanceFromStart = maptilersdk.math.haversineDistanceWgs84(lakeNatron, [position[0], position[1]]);
          const progressPercentage = distanceFromStart / distance;

          flamingoOneMesh.modify({ lngLat: position, heading: roughHeading });
          flamingoTwoMesh.modify({ lngLat: position, heading: roughHeading });

          if (guiObj[migrate]) {
            map.setCenter(position);
            map.setZoom(10 - Math.sin(progressPercentage * Math.PI) * 2);
            map.setBearing(progressPercentage * -45);
          }

          if (guiObj[fly]) {
            requestAnimationFrame(playAnimation);
          }
        }

        if (guiObj[fly]) {
          playAnimation()
        }

      });

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
import { Map, MapStyle, config, math } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Layer3D, AltitudeReference } from '@maptiler/3d';
import { GUI } from 'lil-gui';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

const lakeNatron = [36.01695746068115, -2.3536069164210653];
const makadikadi = [25.5527055978211, -20.78468929963636];

function calculateHeading(lat1, lon1, lat2, lon2) {
  const φ1 = math.toRadians(lat1);
  const φ2 = math.toRadians(lat2);
  const Δλ = math.toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let θ = Math.atan2(y, x);
  θ = math.toDegrees(θ);
  return ((θ + 360) % 360) + 90; // Normalize to 0–360 and add 90 degrees
}

const map = new Map({
  container: 'map',
  style: MapStyle.AQUARELLE.VIVID,
  center: lakeNatron, // starting position [lng, lat]
  zoom: 10, // starting zoom
  hash: true,
  bearing: 0,
  pitch: 45,
  attributionControl: {
    customAttribution: "Model by <a href='https://mirada.com/' target='_blank'>Mirada</a> for <a href='https://experiments.withgoogle.com/3-dreams-of-black' target='_blank'>3 Dreams of Black</a>",
  }
});

// Waiting for the map to be ready
map.on('ready', async () => {

  map.setSky({
    "sky-color": "#0C2E4B",
    "horizon-color": "#09112F",
    "fog-color": "#09112F",
    "fog-ground-blend": 0.5,
    "horizon-fog-blend": 0.1,
    "sky-horizon-blend": 1.0,
    "atmosphere-blend": 0.5,
  });

  // Create a Layer3D and add it
  const layer3D = new Layer3D("custom-3D-layer");
  map.addLayer(layer3D);

   // Increasing the intensity of the ambient light
  layer3D.setAmbientLight({ intensity: 2 });

  // Adding a point light
  layer3D.addPointLight("point-light", { intensity: 30 });

  const flamingoIDOne = "flamingo";
  const flamingoIDTwo = "flamingo-clone";

  // The call can be awaited for the whole download of the mesh to complete
  await layer3D.addMeshFromURL(
    // ID to give to this mesh, unique within this Layer3D instance
    flamingoIDOne,

    // The URL of the mesh
    "https://docs-media.maptiler.com/docs/models/flamingo.glb",

    // A set of options, these can be modified later
    {
      lngLat: lakeNatron,
      heading: 12,
      scale: 100,
      animationMode: "continuous",
      altitudeReference: AltitudeReference.MEAN_SEA_LEVEL,
      transform: {
        rotation: {
          x: 0,
          y: Math.PI / 2,
          z: 0,
        },
        offset: {
          x: 0,
          y: 0,
          z: -150,
        },
      },
    }
  );

  const fly = "fly!";
  const migrate = "migrate with the flamingo";
  const speed = "migration speed";

  const guiObj = {
    [fly]: true,
    [migrate]: true,
    [speed]: 0.0005,
  };

  const gui = new GUI({ width: 500 });

  gui.add(guiObj, migrate);

  gui.add(guiObj, fly).onChange((play) => {
    if (play) {
      playAnimation();
    }
  });

  gui.add(guiObj, speed, 0, 0.001);

  const mesh = layer3D.getItem3D("flamingo");

  let progress = 0;

  const animationNames = mesh?.getAnimationNames();

  const animationName = animationNames?.[0];

  if (!animationName) {
    throw new Error(`No animation found with name '${animationName}'`);
  }

  layer3D.cloneMesh(flamingoIDOne, flamingoIDTwo, {
    animationMode: "manual",
    transform: {
      offset: {
        x: 0,
        y: 0,
        z: 300,
      },
    },
  });

  layer3D.getItem3D(flamingoIDOne)?.playAnimation(
    animationName,
    "loop",
  );

  layer3D.getItem3D(flamingoIDTwo)?.playAnimation(
    animationName,
    "loop",
  );

  const distance = math.haversineDistanceWgs84(lakeNatron, makadikadi);

  const initialHeading = calculateHeading(makadikadi[1], makadikadi[0], lakeNatron[1], lakeNatron[0]);

  const flamingoOneMesh = layer3D.getItem3D(flamingoIDOne);
  const flamingoTwoMesh = layer3D.getItem3D(flamingoIDTwo);

  flamingoOneMesh.modify({ heading: initialHeading });
  flamingoTwoMesh.modify({ heading: initialHeading });

  function playAnimation() {
    progress += guiObj[speed];

    if (progress > 1) {
      progress = 0;
    }

    const nextPosition = math.haversineIntermediateWgs84(lakeNatron, makadikadi, progress - (guiObj[speed] === 0 ? 0.001 : guiObj[speed]));
    const position = math.haversineIntermediateWgs84(lakeNatron, makadikadi, progress);

    const roughHeading = calculateHeading(position[1], position[0], nextPosition[1], nextPosition[0]);

    // `updateAnimation` is only needed if you want to control the animation manually
    // to automatically play the animation independently of map updates, set the item
    // animationMode: "continuous"

    flamingoTwoMesh.updateAnimation(guiObj[speed] * 50);

    const distanceFromStart = math.haversineDistanceWgs84(lakeNatron, [position[0], position[1]]);
    const progressPercentage = distanceFromStart / distance;

    flamingoOneMesh.modify({ lngLat: position, heading: roughHeading });
    flamingoTwoMesh.modify({ lngLat: position, heading: roughHeading });

    if (guiObj[migrate]) {
      map.setCenter(position);
      map.setZoom(10 - Math.sin(progressPercentage * Math.PI) * 2);
      map.setBearing(progressPercentage * -45);
    }

    if (guiObj[fly]) {
      requestAnimationFrame(playAnimation);
    }
  }

  if (guiObj[fly]) {
    playAnimation()
  }

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
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy

Model by [Mirada](https://mirada.com/) for [3 Dreams of Black](https://experiments.withgoogle.com/3-dreams-of-black) [↩](https://docs.maptiler.com/sdk-js/examples/3d-js-animated-flight/#fnref:1)

## Related examples

[![Display an animated 3D model](https://docs.maptiler.com/assets/img/example-card.png)**Animate a 3D model** Example\\
With animation, your 3D models take on a whole new dimension. You can bring them to life and display them on a map](https://docs.maptiler.com/sdk-js/examples/3d-js-animated/)

[![Add events on 3D models](https://docs.maptiler.com/assets/img/example-card.png)**3D model events** Example\\
Use the MapTiler 3D JS module to listen for mouse events on 3D models.](https://docs.maptiler.com/sdk-js/examples/3d-js-events/)

[![Add a airplane 3D model](https://docs.maptiler.com/assets/img/example-card.png)**Add a plane 3D model** Example\\
Use the MapTiler 3D JS module to add a airplane model to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-plane/)

[![Add multiple 3D models to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add multiple 3D models** Example\\
Use the MapTiler 3D JS module to add multiple 3D models to the map.](https://docs.maptiler.com/sdk-js/examples/3d-js-multi/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS 3D objects/models module.](https://docs.maptiler.com/assets/img/maptiler-3d-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/3d/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-js-animated-flight/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Import and play GLTF animations from GLTF files

Play GLTF animations

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)