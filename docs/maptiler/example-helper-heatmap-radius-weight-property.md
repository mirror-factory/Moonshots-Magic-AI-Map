# Heatmap layer radius and weight by property (heatmap helper)

This example shows how to add a heatmap layer to the map, simultaneously controlling the radius and weight based on a property using the heatmap layer helper. Download the sample data [here](https://docs.maptiler.com/sdk-js/assets/schools.geojson).

Since zoomCompensation is disabled in this example, it is recommended to view the map specifically on z12.

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
        zoom: 12,
        center: [-77.01162, 38.94189],
        style: maptilersdk.MapStyle.DATAVIZ.DARK
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addHeatmap(map, {
        data: 'schools.geojson',
        property: "students",
        radius: [\
          {propertyValue: 100, value: 15},\
          {propertyValue: 800, value: 50},\
        ],
        weight: [\
          {propertyValue: 100, value: 0.1},\
          {propertyValue: 800, value: 1},\
        ],
        colorRamp: maptilersdk.ColorRampCollection.MAGMA,
        zoomCompensation: false,
        opacity: 0.7,
        intensity: 1.2,
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
    zoom: 12,
    center: [-77.01162, 38.94189],
    style: MapStyle.DATAVIZ.DARK
});

map.on('load', async function () {
  await helpers.addHeatmap(map, {
    data: 'schools.geojson',
    property: "students",
    radius: [\
      {propertyValue: 100, value: 15},\
      {propertyValue: 800, value: 50},\
    ],
    weight: [\
      {propertyValue: 100, value: 0.1},\
      {propertyValue: 800, value: 1},\
    ],
    colorRamp: ColorRampCollection.MAGMA,
    zoomCompensation: false,
    opacity: 0.7,
    intensity: 1.2,
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
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy

## Related examples

[![Heatmap layer (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer (heatmap helper)** Example\\
This example shows how to add a heatmap layer to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-minimal/)

[![Create a heatmap layer](https://docs.maptiler.com/assets/img/example-card.png)**Create a heatmap layer** Example\\
This example uses SDK JS to visualize the frequency of US schools by location using a heatmap layer.](https://docs.maptiler.com/sdk-js/examples/heatmap-layer/)

[![Heatmap layer no zoom compensation (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer no zoom compensation (heatmap helper)** Example\\
This example shows how to add a heatmap layer without zoom compensation radius to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-no-zoom-compensation/)

[![Point layer cluster (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer cluster (point helper)** Example\\
This example shows how to add a point layer cluster to the map using the point layer helper with the default values.](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-radius-weight-property/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Heatmap helper radius and weight by property

Heatmap helper radius & weight

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)