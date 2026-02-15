# Add a pattern to a polygon

Use the [`fill-pattern`](https://docs.maptiler.com/gl-style-specification/layers/#paint-fill-fill-pattern) feature to draw a polygon by employing a repeating image pattern. This technique allows for the creation of visually appealing shapes by using a repeated image as a fill. To implement this, refer to the layer ⇾ fill ⇾ [fill-pattern](https://docs.maptiler.com/gl-style-specification/layers/#fill-pattern) section in the GL Style Specification.

Add a pattern to a polygon

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Add a pattern to a polygon</title>
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
        zoom: 1
    });

    map.on('load', async function () {
        // Add GeoJSON data
        map.addSource('source', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [\
                        [\
                            [-30, -25],\
                            [-30, 35],\
                            [30, 35],\
                            [30, -25],\
                            [-30, -25]\
                        ]\
                    ]
                }
            }
        });

        // Load an image to use as the pattern
        const image = await map.loadImage(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/64px-Cat_silhouette.svg.png');

        // Declare the image
        map.addImage('pattern', image.data);

        // Use it
        map.addLayer({
            'id': 'pattern-layer',
            'type': 'fill',
            'source': 'source',
            'paint': {
                'fill-pattern': 'pattern'
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
    center: [0, 0],
    zoom: 1
});

map.on('load', async function () {
    // Add GeoJSON data
    map.addSource('source', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Polygon',
                'coordinates': [\
                    [\
                        [-30, -25],\
                        [-30, 35],\
                        [30, 35],\
                        [30, -25],\
                        [-30, -25]\
                    ]\
                ]
            }
        }
    });

    // Load an image to use as the pattern
    const image = await map.loadImage(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/64px-Cat_silhouette.svg.png');

    // Declare the image
    map.addImage('pattern', image.data);

    // Use it
    map.addLayer({
        'id': 'pattern-layer',
        'type': 'fill',
        'source': 'source',
        'paint': {
            'fill-pattern': 'pattern'
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
  <title>Add a pattern to a polygon</title>
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

[![Show polygon data from GeoJSON on the map](https://docs.maptiler.com/assets/img/example-card.png)**GeoJSON polygon layer** Example\\
This tutorial shows how to add a GeoJSON polygon overlay to the map.](https://docs.maptiler.com/sdk-js/examples/geojson-polygon/)

[![Polygon fill pattern (polygon helper)](https://docs.maptiler.com/assets/img/example-card.png)**Polygon fill pattern (polygon helper)** Example\\
This example shows how to add a polygon layer with a fill pattern to the map using the polygon layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polygon-pattern/)

[![Polygon color ramp symbol (polygon helper)](https://docs.maptiler.com/assets/img/example-card.png)**Polygon color ramp symbol (polygon helper)** Example\\
This example shows how to add a polygon layer with a color ramp symbol that changes the fill color based on the map's zoom level using the polygon layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polygon-ramped-style/)

[![Show polygon information on click](https://docs.maptiler.com/assets/img/example-card.png)**Show polygon information on click** Example\\
When a user clicks a polygon, display a popup containing more information.](https://docs.maptiler.com/sdk-js/examples/polygon-popup-on-click/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/fill-pattern/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Polygon add pattern fill

Polygon pattern fill

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)