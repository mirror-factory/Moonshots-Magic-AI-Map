# Extrude polygons for 3D indoor mapping

Create a 3D indoor map with the [`fill-extrude-height`](https://docs.maptiler.com/gl-style-specification/layers/#paint-fill-extrusion-fill-extrusion-height) paint property.

Extrude polygons for 3D indoor mapping

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Extrude polygons for 3D indoor mapping</title>
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
        center: [-87.61694, 41.86625],
        zoom: 15.99,
        pitch: 40,
        bearing: 20,
        antialias: true
    });

    map.on('load', function() {
        map.addSource('floorplan', {
            // GeoJSON Data source used in vector tiles, documented at
            // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
            'type': 'geojson',
            'data': 'https://docs.maptiler.com/sdk-js/assets/indoor-3d-map.geojson'
        });
        map.addLayer({
            'id': 'room-extrusion',
            'type': 'fill-extrusion',
            'source': 'floorplan',
            'paint': {
                // See the Style Specification for details on data expressions.
                // https://docs.maptiler.com/gl-style-specification/expressions/

                // Get the fill-extrusion-color from the source 'color' property.
                'fill-extrusion-color': ['get', 'color'],

                // Get fill-extrusion-height from the source 'height' property.
                'fill-extrusion-height': ['get', 'height'],

                // Get fill-extrusion-base from the source 'base_height' property.
                'fill-extrusion-base': ['get', 'base_height'],

                // Make extrusions slightly opaque for see through indoor walls.
                'fill-extrusion-opacity': 0.5
            }
        });
    });
</script></body>
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
    center: [-87.61694, 41.86625],
    zoom: 15.99,
    pitch: 40,
    bearing: 20,
    antialias: true
});

map.on('load', function() {
    map.addSource('floorplan', {
        // GeoJSON Data source used in vector tiles, documented at
        // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
        'type': 'geojson',
        'data': 'https://docs.maptiler.com/sdk-js/assets/indoor-3d-map.geojson'
    });
    map.addLayer({
        'id': 'room-extrusion',
        'type': 'fill-extrusion',
        'source': 'floorplan',
        'paint': {
            // See the Style Specification for details on data expressions.
            // https://docs.maptiler.com/gl-style-specification/expressions/

            // Get the fill-extrusion-color from the source 'color' property.
            'fill-extrusion-color': ['get', 'color'],

            // Get fill-extrusion-height from the source 'height' property.
            'fill-extrusion-height': ['get', 'height'],

            // Get fill-extrusion-base from the source 'base_height' property.
            'fill-extrusion-base': ['get', 'base_height'],

            // Make extrusions slightly opaque for see through indoor walls.
            'fill-extrusion-opacity': 0.5
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
  <title>Extrude polygons for 3D indoor mapping</title>
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

[![Display buildings in 3D](https://docs.maptiler.com/assets/img/example-card.png)**Display buildings in 3D** Example\\
Use extrusions to display buildings' height in 3D.](https://docs.maptiler.com/sdk-js/examples/3d-buildings/)

[![Add a 3D model with three.js](https://docs.maptiler.com/assets/img/example-card.png)**Add a 3D model with three.js** Example\\
Use a custom style layer with three.js to add a 3D model to the map.](https://docs.maptiler.com/sdk-js/examples/add-3d-model/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-extrusion-floorplan/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Extrude polygons for 3D indoor mapping

Extrude polygons for 3D indoor mapping

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)