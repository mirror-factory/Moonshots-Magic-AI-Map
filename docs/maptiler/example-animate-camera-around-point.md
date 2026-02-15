# Animate map camera around a point

Animate the map camera around a point.

Animate map camera around a point

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Animate map camera around a point</title>
<script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
<link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
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
        container: 'map',
        style: maptilersdk.MapStyle.STREETS,
        center: [-87.62712, 41.89033],
        zoom: 15.5,
        pitch: 45
    });

    function rotateCamera(timestamp) {
        // clamp the rotation between 0 -360 degrees
        // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
        map.rotateTo((timestamp / 100) % 360, { duration: 0 });
        // Request the next frame of the animation.
        requestAnimationFrame(rotateCamera);
    }

    map.on('load', function () {
        // Start the animation.
        rotateCamera(0);

        // Add 3d buildings and remove label layers to enhance the map
        const layers = map.getStyle().layers;
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                // remove text labels
                map.removeLayer(layers[i].id);
            }
        }

        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [\
                    'interpolate',\
                    ['linear'],\
                    ['zoom'],\
                    15,\
                    0,\
                    15.05,\
                    ['get', 'height']\
                ],
                'fill-extrusion-base': [\
                    'interpolate',\
                    ['linear'],\
                    ['zoom'],\
                    15,\
                    0,\
                    15.05,\
                    ['get', 'min_height']\
                ],
                'fill-extrusion-opacity': 0.6
            }
        });
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
    container: 'map',
    style: MapStyle.STREETS,
    center: [-87.62712, 41.89033],
    zoom: 15.5,
    pitch: 45
});

function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 100) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
}

map.on('load', function () {
    // Start the animation.
    rotateCamera(0);

    // Add 3d buildings and remove label layers to enhance the map
    const layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            // remove text labels
            map.removeLayer(layers[i].id);
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [\
                'interpolate',\
                ['linear'],\
                ['zoom'],\
                15,\
                0,\
                15.05,\
                ['get', 'height']\
            ],
            'fill-extrusion-base': [\
                'interpolate',\
                ['linear'],\
                ['zoom'],\
                15,\
                0,\
                15.05,\
                ['get', 'min_height']\
            ],
            'fill-extrusion-opacity': 0.6
        }
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
  <title>Animate map camera around a point</title>
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

## Related examples

[![Navigate the map with game-like controls](https://docs.maptiler.com/assets/img/example-card.png)**Navigate the map with game-like controls** Example\\
Use the keyboard's arrow keys to move around the map with game-like controls.](https://docs.maptiler.com/sdk-js/examples/game-controls/)

[![Creates an animated map to fly between different locations](https://docs.maptiler.com/assets/img/example-card.png)**Creates an animated map to fly between different locations** Example\\
This example uses SDK JS to fly between different locations and visualize the frequency of US schools by location using a heatmap layer with low zoom levels and a styled circles layer with a data-driven property for zoom levels in more detail.](https://docs.maptiler.com/sdk-js/examples/heatmap-animated/)

[![Create a story map, fly to a location based on the scroll position](https://docs.maptiler.com/assets/img/example-card.png)**Fly to a location based on the scroll position** Example\\
Scroll down through the story and the map will fly to the chapter's location.](https://docs.maptiler.com/sdk-js/examples/scroll-fly-to/)

[![Customize camera animations](https://docs.maptiler.com/assets/img/example-card.png)**Customize camera animations** Example\\
Customize camera animations using AnimationOptions.](https://docs.maptiler.com/sdk-js/examples/camera-animation/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/animate-camera-around-point/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Animate map camera around a point

Animate map camera around a point

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)