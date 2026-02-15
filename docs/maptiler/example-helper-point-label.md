# Point layer labels (point helper)

This example shows how to add a point layer with accompanying labels onto the map using the point layer. If you wish download the [earthquake sample data](https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson).

In this case, we utilize the magnitude attribute as the designated label for the points.

Point helper

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Point helper</title>
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
        zoom: 7.28,
        center: [-97.793, 36.504],
        style: maptilersdk.MapStyle.DATAVIZ.DARK
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addPoint(map, {
        data: 'YOUR_MAPTILER_DATASET_ID_HERE',
        property: "mag",
        pointColor: maptilersdk.ColorRampCollection.VIRIDIS.scale(1, 5),
        minPointRadius: 2,
        maxPointRadius: 100,
        pointOpacity: 0.7,
        showLabel: true
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
import { Map, MapStyle, config, ColorRampCollection, helpers } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
    container: 'map',
    zoom: 7.28,
    center: [-97.793, 36.504],
    style: MapStyle.DATAVIZ.DARK
});

map.on('load', async function () {
  await helpers.addPoint(map, {
    data: 'YOUR_MAPTILER_DATASET_ID_HERE',
    property: "mag",
    pointColor: ColorRampCollection.VIRIDIS.scale(1, 5),
    minPointRadius: 2,
    maxPointRadius: 100,
    pointOpacity: 0.7,
    showLabel: true
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
  <title>Point helper</title>
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

[![Point layer cluster (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer cluster (point helper)** Example\\
This example shows how to add a point layer cluster to the map using the point layer helper with the default values.](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/)

[![Heatmap layer (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer (heatmap helper)** Example\\
This example shows how to add a heatmap layer to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-minimal/)

[![Point layer (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer (point helper)** Example\\
This example shows how to add a point layer to the map using the point layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-point-minimal/)

[![Point layer modify min and max size. Apply transparency (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer min and max size (point helper)** Example\\
This example shows how to modify the default point size values of a point layer with a bit of transparency using the point layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-point-min-max-radius/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/helper-point-label/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Point layer labels (point helper)

Point layer labels (point helper)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)