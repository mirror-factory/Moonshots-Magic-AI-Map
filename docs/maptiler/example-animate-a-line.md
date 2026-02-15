# Animate a line

Animate a line by updating a GeoJSON source on each frame.

Animate a line

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Animate a line</title>
<script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
<link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
<style>
  body {margin: 0; padding: 0;}
  #map {position: absolute; top: 0; bottom: 0; width: 100%;}
  button {
    position: absolute;
    margin: 20px;
  }

  #pause::after {
    content: 'Pause';
  }

  #pause.pause::after {
    content: 'Play';
  }
</style>
</head>
<body>
<div id="map"></div>
<button id="pause"></button>
<script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.STREETS,
        center: [0, 0],
        zoom: 0.5
    });

    // Create a GeoJSON source with an empty lineString.
    const geojson = {
        'type': 'FeatureCollection',
        'features': [\
            {\
                'type': 'Feature',\
                'geometry': {\
                    'type': 'LineString',\
                    'coordinates': [[0, 0]]\
                }\
            }\
        ]
    };

    const speedFactor = 30; // number of frames per longitude degree
    let animation; // to store and cancel the animation
    let startTime = 0;
    let progress = 0; // progress = timestamp - startTime
    let resetTime = false; // indicator of whether time reset is needed for the animation
    const pauseButton = document.getElementById('pause');

    map.on('load', function () {
        map.addSource('line', {
            'type': 'geojson',
            'data': geojson
        });

        // add the line which will be modified in the animation
        map.addLayer({
            'id': 'line-animation',
            'type': 'line',
            'source': 'line',
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#ed6498',
                'line-width': 5,
                'line-opacity': 0.8
            }
        });

        startTime = performance.now();

        animateLine();

        // click the button to pause or play
        pauseButton.addEventListener('click', function () {
            pauseButton.classList.toggle('pause');
            if (pauseButton.classList.contains('pause')) {
                cancelAnimationFrame(animation);
            } else {
                resetTime = true;
                animateLine();
            }
        });

        // reset startTime and progress once the tab loses or gains focus
        // requestAnimationFrame also pauses on hidden tabs by default
        document.addEventListener('visibilitychange', function () {
            resetTime = true;
        });

        // animated in a circle as a sine wave along the map.
        function animateLine(timestamp) {
            if (resetTime) {
                // resume previous progress
                startTime = performance.now() - progress;
                resetTime = false;
            } else {
                progress = timestamp - startTime;
            }

            // restart if it finishes a loop
            if (progress > speedFactor * 360) {
                startTime = timestamp;
                geojson.features[0].geometry.coordinates = [];
            } else {
                const  x = progress / speedFactor;
                // draw a sine wave with some math.
                const  y = Math.sin((x * Math.PI) / 90) * 40;
                // append new coordinates to the lineString
                geojson.features[0].geometry.coordinates.push([x, y]);
                // then update the map
                map.getSource('line').setData(geojson);
            }
            // Request the next frame of the animation.
            animation = requestAnimationFrame(animateLine);
        }
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
    center: [0, 0],
    zoom: 0.5
});

// Create a GeoJSON source with an empty lineString.
const geojson = {
    'type': 'FeatureCollection',
    'features': [\
        {\
            'type': 'Feature',\
            'geometry': {\
                'type': 'LineString',\
                'coordinates': [[0, 0]]\
            }\
        }\
    ]
};

const speedFactor = 30; // number of frames per longitude degree
let animation; // to store and cancel the animation
let startTime = 0;
let progress = 0; // progress = timestamp - startTime
let resetTime = false; // indicator of whether time reset is needed for the animation
const pauseButton = document.getElementById('pause');

map.on('load', function () {
    map.addSource('line', {
        'type': 'geojson',
        'data': geojson
    });

    // add the line which will be modified in the animation
    map.addLayer({
        'id': 'line-animation',
        'type': 'line',
        'source': 'line',
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#ed6498',
            'line-width': 5,
            'line-opacity': 0.8
        }
    });

    startTime = performance.now();

    animateLine();

    // click the button to pause or play
    pauseButton.addEventListener('click', function () {
        pauseButton.classList.toggle('pause');
        if (pauseButton.classList.contains('pause')) {
            cancelAnimationFrame(animation);
        } else {
            resetTime = true;
            animateLine();
        }
    });

    // reset startTime and progress once the tab loses or gains focus
    // requestAnimationFrame also pauses on hidden tabs by default
    document.addEventListener('visibilitychange', function () {
        resetTime = true;
    });

    // animated in a circle as a sine wave along the map.
    function animateLine(timestamp) {
        if (resetTime) {
            // resume previous progress
            startTime = performance.now() - progress;
            resetTime = false;
        } else {
            progress = timestamp - startTime;
        }

        // restart if it finishes a loop
        if (progress > speedFactor * 360) {
            startTime = timestamp;
            geojson.features[0].geometry.coordinates = [];
        } else {
            const  x = progress / speedFactor;
            // draw a sine wave with some math.
            const  y = Math.sin((x * Math.PI) / 90) * 40;
            // append new coordinates to the lineString
            geojson.features[0].geometry.coordinates.push([x, y]);
            // then update the map
            map.getSource('line').setData(geojson);
        }
        // Request the next frame of the animation.
        animation = requestAnimationFrame(animateLine);
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
  <title>Animate a line</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div id="map"></div>
  <button id="pause"></button>
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

## Related examples

[![Update a feature in realtime](https://docs.maptiler.com/assets/img/example-card.png)**Update a feature in realtime** Example\\
Change an existing feature on your map in real-time by updating its data.](https://docs.maptiler.com/sdk-js/examples/live-update-feature/)

[![Show line data from GeoJSON on the map](https://docs.maptiler.com/assets/img/example-card.png)**GeoJSON line layer** Example\\
This tutorial shows how to add a GeoJSON line overlay to the map.](https://docs.maptiler.com/sdk-js/examples/geojson-line/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/animate-a-line/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Animate a line

Animate a line

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)