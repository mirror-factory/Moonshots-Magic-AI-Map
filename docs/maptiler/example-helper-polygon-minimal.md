# Polygon layer (polygon helper)

This example shows the process of incorporating a layer of polygons onto the map by utilizing the polygon layer helper and its default settings. Download the [Swiss sample data](https://docs.maptiler.com/sdk-js/assets/switzerland.geojson).

In this particular case, the color is assigned at random from a predetermined list of colors. This is the default behavior taken when a specific color is not designated.

Polygon helper

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Polygon helper</title>
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
        zoom: 6.62,
        center: [8.224, 46.823],
        style: maptilersdk.MapStyle.STREETS.LIGHT
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addPolygon(map, {
        data: 'YOUR_MAPTILER_DATASET_ID_HERE',
        fillOpacity: 0.5,
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
    zoom: 6.62,
    center: [8.224, 46.823],
    style: MapStyle.STREETS.LIGHT
});

map.on('load', async function () {
  await helpers.addPolygon(map, {
    data: 'YOUR_MAPTILER_DATASET_ID_HERE',
    fillOpacity: 0.5,
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
  <title>Polygon helper</title>
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

[![Polygon fill pattern (polygon helper)](https://docs.maptiler.com/assets/img/example-card.png)**Polygon fill pattern (polygon helper)** Example\\
This example shows how to add a polygon layer with a fill pattern to the map using the polygon layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polygon-pattern/)

[![Polygon color ramp symbol (polygon helper)](https://docs.maptiler.com/assets/img/example-card.png)**Polygon color ramp symbol (polygon helper)** Example\\
This example shows how to add a polygon layer with a color ramp symbol that changes the fill color based on the map's zoom level using the polygon layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polygon-ramped-style/)

[![Show polygon data from GeoJSON on the map](https://docs.maptiler.com/assets/img/example-card.png)**GeoJSON polygon layer** Example\\
This tutorial shows how to add a GeoJSON polygon overlay to the map.](https://docs.maptiler.com/sdk-js/examples/geojson-polygon/)

[![Show polygon information on click](https://docs.maptiler.com/assets/img/example-card.png)**Show polygon information on click** Example\\
When a user clicks a polygon, display a popup containing more information.](https://docs.maptiler.com/sdk-js/examples/polygon-popup-on-click/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/helper-polygon-minimal/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Polygon layer (polygon helper)

Polygon layer (polygon helper)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)