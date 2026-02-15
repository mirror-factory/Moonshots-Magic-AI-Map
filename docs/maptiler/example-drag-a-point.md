# Create a draggable point

Drag the point to a new location on a map and populate its coordinates in a display.

Create a draggable point

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
  <title>Create a draggable point</title>
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

    const canvas = map.getCanvasContainer();

    const geojson = {
      'type': 'FeatureCollection',
      'features': [\
        {\
          'type': 'Feature',\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [0, 0]\
          }\
        }\
      ]
    };

    function onMove(e) {
      const coords = e.lngLat;

      // Set a UI indicator for dragging.
      canvas.style.cursor = 'grabbing';

      // Update the Point feature in `geojson` coordinates
      // and call setData to the source layer `point` on it.
      geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
      map.getSource('point').setData(geojson);
    }

    function onUp(e) {
      const coords = e.lngLat;

      // Print the coordinates of where the point had
      // finished being dragged to on the map.
      coordinates.style.display = 'block';
      coordinates.innerHTML =
        'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
      canvas.style.cursor = '';

      // Unbind mouse/touch events
      map.off('mousemove', onMove);
      map.off('touchmove', onMove);
    }

    map.on('load', function () {
      // Add a single point to the map
      map.addSource('point', {
        'type': 'geojson',
        'data': geojson
      });

      map.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': 'point',
        'paint': {
          'circle-radius': 10,
          'circle-color': '#3887be'
        }
      });

      // When the cursor enters a feature in the point layer, prepare for dragging.
      map.on('mouseenter', 'point', function () {
        map.setPaintProperty('point', 'circle-color', '#3bb2d0');
        canvas.style.cursor = 'move';
      });

      map.on('mouseleave', 'point', function () {
        map.setPaintProperty('point', 'circle-color', '#3887be');
        canvas.style.cursor = '';
      });

      map.on('mousedown', 'point', function (e) {
        // Prevent the default map drag behavior.
        e.preventDefault();

        canvas.style.cursor = 'grab';

        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
      });

      map.on('touchstart', 'point', function (e) {
        if (e.points.length !== 1) return;

        // Prevent the default map drag behavior.
        e.preventDefault();

        map.on('touchmove', onMove);
        map.once('touchend', onUp);
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
const coordinates = document.getElementById('coordinates');
const map = new Map({
    container: 'map',
    style: MapStyle.STREETS,
    center: [0, 0],
    zoom: 2
});

const canvas = map.getCanvasContainer();

const geojson = {
    'type': 'FeatureCollection',
    'features': [\
        {\
            'type': 'Feature',\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [0, 0]\
            }\
        }\
    ]
};

function onMove(e) {
    const coords = e.lngLat;

    // Set a UI indicator for dragging.
    canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource('point').setData(geojson);
}

function onUp(e) {
    const coords = e.lngLat;

    // Print the coordinates of where the point had
    // finished being dragged to on the map.
    coordinates.style.display = 'block';
    coordinates.innerHTML =
        'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
    canvas.style.cursor = '';

    // Unbind mouse/touch events
    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
}

map.on('load', function () {
    // Add a single point to the map
    map.addSource('point', {
        'type': 'geojson',
        'data': geojson
    });

    map.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': 'point',
        'paint': {
            'circle-radius': 10,
            'circle-color': '#3887be'
        }
    });

    // When the cursor enters a feature in the point layer, prepare for dragging.
    map.on('mouseenter', 'point', function () {
        map.setPaintProperty('point', 'circle-color', '#3bb2d0');
        canvas.style.cursor = 'move';
    });

    map.on('mouseleave', 'point', function () {
        map.setPaintProperty('point', 'circle-color', '#3887be');
        canvas.style.cursor = '';
    });

    map.on('mousedown', 'point', function (e) {
        // Prevent the default map drag behavior.
        e.preventDefault();

        canvas.style.cursor = 'grab';

        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
    });

    map.on('touchstart', 'point', function (e) {
        if (e.points.length !== 1) return;

        // Prevent the default map drag behavior.
        e.preventDefault();

        map.on('touchmove', onMove);
        map.once('touchend', onUp);
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
  <title>Create a draggable point</title>
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

[![Create a draggable marker](https://docs.maptiler.com/assets/img/example-card.png)**Create a draggable marker** Example\\
Drag the marker to a new location on a map and populate its coordinates in a display.](https://docs.maptiler.com/sdk-js/examples/drag-a-marker/)

[![Animate a point along a route](https://docs.maptiler.com/assets/img/example-card.png)**Animate a point along a route** Example\\
Use Turf to smoothly animate a point along the distance of a line.](https://docs.maptiler.com/sdk-js/examples/animate-point-along-route/)

[![Animate a point](https://docs.maptiler.com/assets/img/example-card.png)**Animate a point** Example\\
Animate the position of a point by updating a GeoJSON source on each frame.](https://docs.maptiler.com/sdk-js/examples/animate-point-along-line/)

[![Display a popup on click](https://docs.maptiler.com/assets/img/example-card.png)**Display a popup on click** Example\\
When a user clicks a symbol, show a popup containing more information.](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/drag-a-point/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Create a draggable point

Create a draggable point

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)