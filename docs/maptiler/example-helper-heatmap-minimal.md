# Heatmap layer (heatmap helper)

This example shows the process of adding a heatmap layer onto the map by using the heatmap layer helper with its default settings. To replicate this example, download the [earthquake sample data](https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson).

A **heatmap map** is a visual representation of data values using different colors to indicate their magnitude within a dataset. In certain scenarios, like crime analytics, the color in a heatmap is used to represent the density of data points rather than the specific value associated with each point.

In this particular example, the heatmap layer is designed to compensate for zooming, which means that the size of the blobs remains relatively consistent when we zoom in or out on a global scale. This behavior is the standard default setting.

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
        zoom: 6.56,
        center: [-119.715, 37.999],
        style: maptilersdk.MapStyle.DATAVIZ.LIGHT
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addHeatmap(map, {
        data: 'YOUR_MAPTILER_DATASET_ID_HERE',
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
    zoom: 6.56,
    center: [-119.715, 37.999],
    style: MapStyle.DATAVIZ.LIGHT
});

map.on('load', async function () {
  await helpers.addHeatmap(map, {
    data: 'YOUR_MAPTILER_DATASET_ID_HERE',
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

[![Heatmap layer custom radius by property (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer custom radius by property (heatmap helper)** Example\\
This example shows how to add a heatmap layer with a custom propertry-ramping radius to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-ramped-radius-property/)

[![Create a heatmap layer](https://docs.maptiler.com/assets/img/example-card.png)**Create a heatmap layer** Example\\
This example uses SDK JS to visualize the frequency of US schools by location using a heatmap layer.](https://docs.maptiler.com/sdk-js/examples/heatmap-layer/)

[![Heatmap layer opacity (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer opacity (heatmap helper)** Example\\
This example shows how to add a heatmap layer with a custom opacity to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-opacity/)

[![Point layer cluster (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer cluster (point helper)** Example\\
This example shows how to add a point layer cluster to the map using the point layer helper with the default values.](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-minimal/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Heatmap layer (heatmap helper)

Heatmap layer (heatmap helper)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)