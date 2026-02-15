# Add a GPX Line layer (polyline helper)

Learn how to incorporate a GPX line layer into your map by utilizing the polyline layer helper in this illustrative example. To replicate this example, download the [GPX run sample data](https://docs.maptiler.com/sdk-js/examples/helper-polyline-gpx/run.gpx).

Polyline helper

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Polyline helper</title>
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
        zoom: 14.5,
        center: [-77.01801, 38.92368],
        style: maptilersdk.MapStyle.DATAVIZ.DARK
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addPolyline(map, {
        data: 'https://docs.maptiler.com/sdk-js/examples/helper-polyline-gpx/run.gpx',
        outline: true
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
import { Map, MapStyle, config, helpers } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
    container: 'map',
    zoom: 14.5,
    center: [-77.01801, 38.92368],
    style: MapStyle.DATAVIZ.DARK
});

map.on('load', async function () {
  await helpers.addPolyline(map, {
    data: 'https://docs.maptiler.com/sdk-js/examples/helper-polyline-gpx/run.gpx',
    outline: true
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
  <title>Polyline helper</title>
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

[![Line layer (polyline helper)](https://docs.maptiler.com/assets/img/example-card.png)**Line layer (polyline helper)** Example\\
This example shows how to add a line layer to the map using the polyline layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polyline-minimal/)

[![Add a KML Line layer (polyline helper)](https://docs.maptiler.com/assets/img/example-card.png)**Add a KML Line layer (polyline helper)** Example\\
This example shows how to add and a KML line layer to the map using the polyline layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polyline-kml/)

[![Line dash pattern symbol (polyline helper)](https://docs.maptiler.com/assets/img/example-card.png)**Line dash pattern symbol (polyline helper)** Example\\
This example shows how to add a line layer with a dash pattern symbol to the map using the polyline layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polyline-dash-array/)

[![Show line data from GeoJSON on the map](https://docs.maptiler.com/assets/img/example-card.png)**GeoJSON line layer** Example\\
This tutorial shows how to add a GeoJSON line overlay to the map.](https://docs.maptiler.com/sdk-js/examples/geojson-line/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/helper-polyline-gpx/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add a GPX Line layer (polyline helper)

Add a GPX Line layer (polyline helper)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)