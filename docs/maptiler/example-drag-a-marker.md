# Create a draggable marker

Drag the [`Marker`](https://docs.maptiler.com/sdk-js/api/markers/#marker) to a new location on a map and populate its coordinates in a display.

Create a draggable Marker

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

```

```

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create a draggable Marker</title>
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

    .coordinates {
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      position: absolute;
      bottom: 40px;
      left: 10px;
      padding: 5px 10px;
      margin: 0;
      font-size: 11px;
      line-height: 18px;
      border-radius: 3px;
      display: none;
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <pre id="coordinates" class="coordinates"></pre>

  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const coordinates = document.getElementById('coordinates');
    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.STREETS,
      center: [0, 0],
      zoom: 2
    });

    const marker = new maptilersdk.Marker({
      draggable: true
    })
      .setLngLat([0, 0])
      .addTo(map);

    function onDragEnd() {
      const lngLat = marker.getLngLat();
      coordinates.style.display = 'block';
      coordinates.innerHTML =
        'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
    }

    marker.on('dragend', onDragEnd);
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
const coordinates = document.getElementById('coordinates');
const map = new Map({
    container: 'map',
    style: MapStyle.STREETS,
    center: [0, 0],
    zoom: 2
});

const marker = new maptilersdk.Marker({
    draggable: true
})
    .setLngLat([0, 0])
    .addTo(map);

function onDragEnd() {
    const lngLat = marker.getLngLat();
    coordinates.style.display = 'block';
    coordinates.innerHTML =
        'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
}

marker.on('dragend', onDragEnd);
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Create a draggable Marker</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <style>
  .coordinates {
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      position: absolute;
      bottom: 40px;
      left: 10px;
      padding: 5px 10px;
      margin: 0;
      font-size: 11px;
      line-height: 18px;
      border-radius: 3px;
      display: none;
  }
  </style>

  <div id="map"></div>
  <pre id="coordinates" class="coordinates"></pre>
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

[![Create a draggable point](https://docs.maptiler.com/assets/img/example-card.png)**Create a draggable point** Example\\
Drag the point to a new location on a map and populate its coordinates in a display.](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

[![Animate a point along a route](https://docs.maptiler.com/assets/img/example-card.png)**Animate a point along a route** Example\\
Use Turf to smoothly animate a point along the distance of a line.](https://docs.maptiler.com/sdk-js/examples/animate-point-along-route/)

[![Animate a point](https://docs.maptiler.com/assets/img/example-card.png)**Animate a point** Example\\
Animate the position of a point by updating a GeoJSON source on each frame.](https://docs.maptiler.com/sdk-js/examples/animate-point-along-line/)

[![Display a popup on click](https://docs.maptiler.com/assets/img/example-card.png)**Display a popup on click** Example\\
When a user clicks a symbol, show a popup containing more information.](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/drag-a-marker/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Create a draggable marker

Create a draggable marker

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)