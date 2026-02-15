# Animate a marker

Update the location of a [`Marker`](https://docs.maptiler.com/sdk-js/api/markers/#marker) on each frame to animate its position.

Animate a marker

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Animate a marker</title>
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
        center: [0, 0],
        zoom: 2
    });

    const marker = new maptilersdk.Marker();

    function animateMarker(timestamp) {
        const radius = 20;

        // Update the data to a new position based on the animation timestamp. The
        // divisor in the expression `timestamp / 1000` controls the animation speed.
        marker.setLngLat([\
            Math.cos(timestamp / 1000) * radius,\
            Math.sin(timestamp / 1000) * radius\
        ]);

        // Ensure it's added to the map. This is safe to call if it's already added.
        marker.addTo(map);

        // Request the next frame of the animation.
        requestAnimationFrame(animateMarker);
    }

    // Start the animation.
    requestAnimationFrame(animateMarker);
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
    zoom: 2
});

const marker = new maptilersdk.Marker();

function animateMarker(timestamp) {
    const radius = 20;

    // Update the data to a new position based on the animation timestamp. The
    // divisor in the expression `timestamp / 1000` controls the animation speed.
    marker.setLngLat([\
        Math.cos(timestamp / 1000) * radius,\
        Math.sin(timestamp / 1000) * radius\
    ]);

    // Ensure it's added to the map. This is safe to call if it's already added.
    marker.addTo(map);

    // Request the next frame of the animation.
    requestAnimationFrame(animateMarker);
}

// Start the animation.
requestAnimationFrame(animateMarker);
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Animate a marker</title>
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

[![Animate a line](https://docs.maptiler.com/assets/img/example-card.png)**Animate a line** Example\\
Animate a line by updating a GeoJSON source on each frame.](https://docs.maptiler.com/sdk-js/examples/animate-a-line/)

[![Add an animated icon to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add an animated icon to the map** Example\\
Add an animated icon to the map that was generated at runtime with the Canvas API.](https://docs.maptiler.com/sdk-js/examples/add-image-animated/)

[![Animate a point along a route](https://docs.maptiler.com/assets/img/example-card.png)**Animate a point along a route** Example\\
Use Turf to smoothly animate a point along the distance of a line.](https://docs.maptiler.com/sdk-js/examples/animate-point-along-route/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/animate-marker/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Animate a marker

Animate a marker

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)