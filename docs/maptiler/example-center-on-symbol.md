# Center the map on a clicked symbol

Use events and [`flyTo`](https://docs.maptiler.com/sdk-js/api/map/#map#flyto) to center the map on a [`symbol`](https://docs.maptiler.com/gl-style-specification/layers/#symbol).

Center the map on a clicked symbol

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Center the map on a clicked symbol</title>
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
        center: [-90.96, -0.47],
        zoom: 7.5
    });

    map.on('load', async function () {
        // Add an image to use as a custom marker
        const image = await map.loadImage(
            'https://docs.maptiler.com/sdk-js/assets/custom_marker.png');
        map.addImage('custom-marker', image.data);
        // Add a GeoJSON source with 3 points.
        map.addSource('points', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [\
                    {\
                        'type': 'Feature',\
                        'properties': {},\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [\
                                -91.395263671875,\
                                -0.9145729757782163\
                            ]\
                        }\
                    },\
                    {\
                        'type': 'Feature',\
                        'properties': {},\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [\
                                -90.32958984375,\
                                -0.6344474832838974\
                            ]\
                        }\
                    },\
                    {\
                        'type': 'Feature',\
                        'properties': {},\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [\
                                -91.34033203125,\
                                0.01647949196029245\
                            ]\
                        }\
                    }\
                ]
            }
        });

        // Add a symbol layer
        map.addLayer({
            'id': 'symbols',
            'type': 'symbol',
            'source': 'points',
            'layout': {
                'icon-image': 'custom-marker'
            }
        });

        // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
        map.on('click', 'symbols', function (e) {
            map.flyTo({
                center: e.features[0].geometry.coordinates
            });
        });

        // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
        map.on('mouseenter', 'symbols', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'symbols', function () {
            map.getCanvas().style.cursor = '';
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
    center: [-90.96, -0.47],
    zoom: 7.5
});

map.on('load', async function () {
    // Add an image to use as a custom marker
    const image = await map.loadImage(
        'https://docs.maptiler.com/sdk-js/assets/custom_marker.png');
    map.addImage('custom-marker', image.data);
    // Add a GeoJSON source with 3 points.
    map.addSource('points', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [\
                {\
                    'type': 'Feature',\
                    'properties': {},\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [\
                            -91.395263671875,\
                            -0.9145729757782163\
                        ]\
                    }\
                },\
                {\
                    'type': 'Feature',\
                    'properties': {},\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [\
                            -90.32958984375,\
                            -0.6344474832838974\
                        ]\
                    }\
                },\
                {\
                    'type': 'Feature',\
                    'properties': {},\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [\
                            -91.34033203125,\
                            0.01647949196029245\
                        ]\
                    }\
                }\
            ]
        }
    });

    // Add a symbol layer
    map.addLayer({
        'id': 'symbols',
        'type': 'symbol',
        'source': 'points',
        'layout': {
            'icon-image': 'custom-marker'
        }
    });

    // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
    map.on('click', 'symbols', function (e) {
        map.flyTo({
            center: e.features[0].geometry.coordinates
        });
    });

    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.on('mouseenter', 'symbols', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'symbols', function () {
        map.getCanvas().style.cursor = '';
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
  <title>Center the map on a clicked symbol</title>
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

## Related examples

[![Display a popup on click](https://docs.maptiler.com/assets/img/example-card.png)**Display a popup on click** Example\\
When a user clicks a symbol, show a popup containing more information.](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)

[![Create a story map, fly to a location based on the scroll position](https://docs.maptiler.com/assets/img/example-card.png)**Fly to a location based on the scroll position** Example\\
Scroll down through the story and the map will fly to the chapter's location.](https://docs.maptiler.com/sdk-js/examples/scroll-fly-to/)

[![Fit to the bounds of a lineString](https://docs.maptiler.com/assets/img/example-card.png)**Fit to the bounds of a lineString** Example\\
Get the bounds of a lineString.](https://docs.maptiler.com/sdk-js/examples/zoomto-linestring/)

[![Fly to a location](https://docs.maptiler.com/assets/img/example-card.png)**Fly to a location** Example\\
Use flyTo to smoothly interpolate between locations.](https://docs.maptiler.com/sdk-js/examples/flyto/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/center-on-symbol/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Center the map on a clicked symbol

Center the map on a clicked symbol

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)