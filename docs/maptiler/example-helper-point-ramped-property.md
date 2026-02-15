# Point layer scaled radius by property (point helper)

This example shows how to add a point layer to the map, where the size and color of each point are adjusted based on a specific attribute. The point layer helper is utilized to achieve this. To access the sample data, download the [USA school’s sample data](https://docs.maptiler.com/sdk-js/assets/schools.geojson).

In this particular example, the size of the points is scaled proportionately to the number of students in each school. We aim to employ an ease-out resampling technique, albeit one that is not as rapidly increasing as the exponential method. Instead, we opt for the square-root approach, which proves to be quite effective.

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
        zoom: 11.6,
        center: [-119.807, 36.7828],
        style: maptilersdk.MapStyle.DATAVIZ.LIGHT
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addPoint(map, {
        data: 'schools.geojson',
        property: "students",
        pointColor: maptilersdk.ColorRampCollection.PORTLAND.scale(300, 4000).resample("ease-out-sqrt"),
        pointOpacity: 0.7,
        minPointRadius: 1,
        maxPointRadius: 100,
        showLabel: true,
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
    zoom: 11.6,
    center: [-119.807, 36.7828],
    style: MapStyle.DATAVIZ.LIGHT
});

map.on('load', async function () {
  await helpers.addPoint(map, {
    data: 'schools.geojson',
    property: "students",
    pointColor: ColorRampCollection.PORTLAND.scale(300, 4000).resample("ease-out-sqrt"),
    pointOpacity: 0.7,
    minPointRadius: 1,
    maxPointRadius: 100,
    showLabel: true,
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

[![Scale point radius based on the zoom level (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer scaled radius (point helper)** Example\\
This example shows how to scale the radius of a point layer based on the map zoom level using the point layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-point-ramped-radius/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/helper-point-ramped-property/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Point layer scaled radius by property (point helper)

Point layer scaled radius by property (point helper)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)