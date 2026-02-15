# Navigate the map with game-like controls

Use the keyboard’s arrow keys to move around the map with game-like controls.

Navigate the map with game-like controls

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Navigate the map with game-like controls</title>
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
        style: maptilersdk.MapStyle.TOPO,
        center: [-87.6298, 41.8781],
        zoom: 17,
        bearing: -12,
        pitch: 60,
        interactive: false
    });

    // pixels the map pans when the up or down arrow is clicked
    const deltaDistance = 100;

    // degrees the map rotates when the left or right arrow is clicked
    const deltaDegrees = 25;

    function easing(t) {
        return t * (2 - t);
    }

    map.on('load', function () {
        map.getCanvas().focus();

        map.getCanvas().addEventListener(
            'keydown',
            function (e) {
                e.preventDefault();
                if (e.which === 38) {
                    // up
                    map.panBy([0, -deltaDistance], {
                        easing: easing
                    });
                } else if (e.which === 40) {
                    // down
                    map.panBy([0, deltaDistance], {
                        easing: easing
                    });
                } else if (e.which === 37) {
                    // left
                    map.easeTo({
                        bearing: map.getBearing() - deltaDegrees,
                        easing: easing
                    });
                } else if (e.which === 39) {
                    // right
                    map.easeTo({
                        bearing: map.getBearing() + deltaDegrees,
                        easing: easing
                    });
                }
            },
            true
        );
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
    style: MapStyle.TOPO,
    center: [-87.6298, 41.8781],
    zoom: 17,
    bearing: -12,
    pitch: 60,
    interactive: false
});

// pixels the map pans when the up or down arrow is clicked
const deltaDistance = 100;

// degrees the map rotates when the left or right arrow is clicked
const deltaDegrees = 25;

function easing(t) {
    return t * (2 - t);
}

map.on('load', function () {
    map.getCanvas().focus();

    map.getCanvas().addEventListener(
        'keydown',
        function (e) {
            e.preventDefault();
            if (e.which === 38) {
                // up
                map.panBy([0, -deltaDistance], {
                    easing: easing
                });
            } else if (e.which === 40) {
                // down
                map.panBy([0, deltaDistance], {
                    easing: easing
                });
            } else if (e.which === 37) {
                // left
                map.easeTo({
                    bearing: map.getBearing() - deltaDegrees,
                    easing: easing
                });
            } else if (e.which === 39) {
                // right
                map.easeTo({
                    bearing: map.getBearing() + deltaDegrees,
                    easing: easing
                });
            }
        },
        true
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
  <title>Navigate the map with game-like controls</title>
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

[![Animate map camera around a point](https://docs.maptiler.com/assets/img/example-card.png)**Animate map camera around a point** Example\\
Animate the map camera around a point.](https://docs.maptiler.com/sdk-js/examples/animate-camera-around-point/)

[![Creates an animated map to fly between different locations](https://docs.maptiler.com/assets/img/example-card.png)**Creates an animated map to fly between different locations** Example\\
This example uses SDK JS to fly between different locations and visualize the frequency of US schools by location using a heatmap layer with low zoom levels and a styled circles layer with a data-driven property for zoom levels in more detail.](https://docs.maptiler.com/sdk-js/examples/heatmap-animated/)

[![Create a story map, fly to a location based on the scroll position](https://docs.maptiler.com/assets/img/example-card.png)**Fly to a location based on the scroll position** Example\\
Scroll down through the story and the map will fly to the chapter's location.](https://docs.maptiler.com/sdk-js/examples/scroll-fly-to/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/game-controls/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Navigate the map with game-like controls

Navigate the map with game-like controls

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)