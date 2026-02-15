# Custom night satellite image in a goble with space background

Use a custom map of the Earth’s satellite image at night and display it on a globe with a space background.

In this example, we’ll use a custom map (night satellite) along with the `halo` and `space` options to create the effect of the Earth seen from space. Additionally, we’ll rotate the Earth and shift the central view of the map so that the Earth appears in the lower left corner of the map area.

Globe with halo

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

To make the custom map download the images from [Earth at Night](https://earthobservatory.nasa.gov/features/NightLights/page3.php) and generat the tiles using the [MapTiler Engine](https://www.maptiler.com/engine/)

- NPM module
- Basic JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Globe with halo</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }

    #map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: 'YOUR_CUSTOM_MAP_ID',
      projection: "globe",
      center: [115.0293, 32.6789], // starting position [lng, lat]
      zoom: 2, // starting zoom
      geolocateControl: false,
      navigationControl: false,
      terrain: true,
        space: {
        preset: 'milkyway'
      },
      halo: true,
    });

    map.easeTo({
      padding: {
        right: 500, // push the visual center to the left
        top: 300, // push the globe down
      }
    });

    function loop() {
      requestAnimationFrame(loop);
      const currentCenter = map.getCenter();

      map.flyTo({ // create globe rotation animation
        center:[\
          currentCenter.lng - 0.05,\
          currentCenter.lat\
        ]
      });
    }

    map.on('ready', async () => {

      map.setSky({
        "sky-color": "#87CEEB",
        "fog-color": "#87CEEB",
        "horizon-color": "#FFFFFF",
        "atmosphere-blend": 0.7
      });

      // polygon used to add haze / opacity to the night side of the globe
      map.addSource('world-cover', {
        'type': 'geojson',
        'data': {
          'type': 'Polygon',
          'coordinates': [\
            [\
              [-180, -90],\
              [180, -90],\
              [180, 90],\
              [-180, 90],\
              [-180, -90]\
            ]\
          ]
        }
      });

      map.addLayer({
        'id': 'global-atmosphere-tint',
        'type': 'fill',
        'source': 'world-cover', // Use the existing full-globe polygon source
        'paint': {
          // A semi-transparent atmospheric blue color
          'fill-color': 'rgba(135, 206, 235, 1)',
          // Ensure it's always visible
          'fill-opacity': [\
            'interpolate',\
            ['linear'],\
            ['zoom'],\
            1, 0.15, // At zoom 1, opacity is 15%\
            5, 0.0   // By zoom 4, opacity is 0% (fully transparent)\
          ]
        }
      });

      loop();
    });
  </script>
</body>

</html>
```

HTML

Copy

```bash
npm install --save @maptiler/sdk
```

Bash

Copy

main.js

```javascript
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: 'YOUR_CUSTOM_MAP_ID',
  projection: "globe",
  center: [115.0293, 32.6789], // starting position [lng, lat]
  zoom: 2, // starting zoom
  geolocateControl: false,
  navigationControl: false,
  terrain: true,
    space: {
    preset: 'milkyway'
  },
  halo: true,
});

map.easeTo({
  padding: {
    right: 500, // push the visual center to the left
    top: 300, // push the globe down
  }
});

function loop() {
  requestAnimationFrame(loop);
  const currentCenter = map.getCenter();

  map.flyTo({ // create globe rotation animation
    center:[\
      currentCenter.lng - 0.05,\
      currentCenter.lat\
    ]
  });
}

map.on('ready', async () => {

  map.setSky({
    "sky-color": "#87CEEB",
    "fog-color": "#87CEEB",
    "horizon-color": "#FFFFFF",
    "atmosphere-blend": 0.7
  });

  // polygon used to add haze / opacity to the night side of the globe
  map.addSource('world-cover', {
    'type': 'geojson',
    'data': {
      'type': 'Polygon',
      'coordinates': [\
        [\
          [-180, -90],\
          [180, -90],\
          [180, 90],\
          [-180, 90],\
          [-180, -90]\
        ]\
      ]
    }
  });

  map.addLayer({
    'id': 'global-atmosphere-tint',
    'type': 'fill',
    'source': 'world-cover', // Use the existing full-globe polygon source
    'paint': {
      // A semi-transparent atmospheric blue color
      'fill-color': 'rgba(135, 206, 235, 1)',
      // Ensure it's always visible
      'fill-opacity': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        1, 0.15, // At zoom 1, opacity is 15%\
        5, 0.0   // By zoom 4, opacity is 0% (fully transparent)\
      ]
    }
  });

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
  <title>Globe with halo</title>
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

## Learn more

For halo customization, check the [RadialGradientLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/#RadialGradientLayerConstructorOptions).

## Related examples

[![Add an atmospheric glow (halo) around the globe](https://docs.maptiler.com/assets/img/example-card.png)**Globe with halo** Example\\
Adds an atmospheric glow around the globe, simulating the visual effect of Earth's atmosphere when viewed from space.](https://docs.maptiler.com/sdk-js/examples/halo-simple/)

[![Add a milkyway and stars background to the globe](https://docs.maptiler.com/assets/img/example-card.png)**Globe with milkyway and stars** Example\\
Add a milkyway and stars background to the globe.](https://docs.maptiler.com/sdk-js/examples/space-milkyway/)

[![Add a custom milkyway, stars and halo background to the globe](https://docs.maptiler.com/assets/img/example-card.png)**Globe with milkyway and halo** Example\\
Customize the map background to create a red Milky Way effect and create a halo around the Earth.](https://docs.maptiler.com/sdk-js/examples/space-milkyway-halo/)

[![How to turn on the globe projection](https://docs.maptiler.com/assets/img/example-card.png)**Globe projection** Example\\
Specify the map projection to view the map in a 3D globe.](https://docs.maptiler.com/sdk-js/examples/globe-projection/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/halo-space-night/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/halo-space-night/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Custom night satellite image in a goble with space background

Night globe in space

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)