# Heatmap layer opacity (heatmap helper)

This example demonstrates the process of incorporating a heatmap layer onto the map while customizing its opacity. To accomplish this, the heatmap layer helper is employed. To replicate this example, download the [earthquake sample data](https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson).

In this particular instance, we modify the layer’s transparency based on the zoom level.

Heatmap helper

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Heatmap helper</title>
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
        zoom: 8.8,
        center: [-116.783, 33.5211],
        style: maptilersdk.MapStyle.DATAVIZ.DARK
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addHeatmap(map, {
        data: 'YOUR_MAPTILER_DATASET_ID_HERE',
        opacity: [\
          {zoom: 3, value: 0 }, // fade in\
          {zoom: 4, value: 1 }, // full opacity\
          {zoom: 5, value: 0.75 }, // 75% opacity\
          {zoom: 8, value: 0.50 }, // 50% opacity\
          {zoom: 11, value: 0 }, // fade out\
        ],
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
    zoom: 8.8,
    center: [-116.783, 33.5211],
    style: MapStyle.DATAVIZ.DARK
});

map.on('load', async function () {
  await helpers.addHeatmap(map, {
    data: 'YOUR_MAPTILER_DATASET_ID_HERE',
    opacity: [\
      {zoom: 3, value: 0 }, // fade in\
      {zoom: 4, value: 1 }, // full opacity\
      {zoom: 5, value: 0.75 }, // 75% opacity\
      {zoom: 8, value: 0.50 }, // 50% opacity\
      {zoom: 11, value: 0 }, // fade out\
    ],
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
  <title>Heatmap helper</title>
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

[![Heatmap layer (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer (heatmap helper)** Example\\
This example shows how to add a heatmap layer to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-minimal/)

[![Create a heatmap layer](https://docs.maptiler.com/assets/img/example-card.png)**Create a heatmap layer** Example\\
This example uses SDK JS to visualize the frequency of US schools by location using a heatmap layer.](https://docs.maptiler.com/sdk-js/examples/heatmap-layer/)

[![Heatmap layer min and max zoom (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer min and max zoom (heatmap helper)** Example\\
This example shows how set the min and max zoom of a heatmap layer using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-min-max-zoom/)

[![Point layer cluster (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer cluster (point helper)** Example\\
This example shows how to add a point layer cluster to the map using the point layer helper with the default values.](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-opacity/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Heatmap layer opacity (heatmap helper)

Heatmap layer opacity (heatmap helper)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)