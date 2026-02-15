# Custom color ramp (color ramp)

This example shows how to create a custom color ramp and use it to visualize a point layer. Download the sample data [here](https://docs.maptiler.com/sdk-js/assets/schools.geojson).

Color ramp

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Color ramp</title>
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
        style: maptilersdk.MapStyle.DATAVIZ.DARK
    });

    const myCustomRamp = new maptilersdk.ColorRamp({
      stops: [\
        { value: 100, color: [252, 222, 156] },\
        { value: 500, color: [250, 164, 118] },\
        { value: 1000, color: [240, 116, 110] },\
        { value: 1500, color: [227, 79, 111] },\
        { value: 2000, color: [220, 57, 119] },\
        { value: 3000, color: [185, 37, 122] },\
        { value: 4000, color: [124, 29, 111] },\
      ]
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addPoint(map, {
        data: 'schools.geojson',
        property: "students",
        pointColor: myCustomRamp,
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
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
    container: 'map',
    zoom: 11.6,
    center: [-119.807, 36.7828],
    style: MapStyle.DATAVIZ.DARK
});

const myCustomRamp = new maptilersdk.ColorRamp({
  stops: [\
    { value: 100, color: [252, 222, 156] },\
    { value: 500, color: [250, 164, 118] },\
    { value: 1000, color: [240, 116, 110] },\
    { value: 1500, color: [227, 79, 111] },\
    { value: 2000, color: [220, 57, 119] },\
    { value: 3000, color: [185, 37, 122] },\
    { value: 4000, color: [124, 29, 111] },\
  ]
});

map.on('load', async function () {
  await maptilersdk.helpers.addPoint(map, {
    data: 'schools.geojson',
    property: "students",
    pointColor: myCustomRamp,
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
  <title>Color ramp</title>
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

[![Color ramp resampling (color ramp)](https://docs.maptiler.com/assets/img/example-card.png)**Color ramp resampling (color ramp)** Example\\
This example shows how to resample a color ramp and use it to visualize a point layer.](https://docs.maptiler.com/sdk-js/examples/color-ramp-resample/)

[![Polygon color ramp symbol (polygon helper)](https://docs.maptiler.com/assets/img/example-card.png)**Polygon color ramp symbol (polygon helper)** Example\\
This example shows how to add a polygon layer with a color ramp symbol that changes the fill color based on the map's zoom level using the polygon layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polygon-ramped-style/)

[![Line color ramp symbol (polyline helper)](https://docs.maptiler.com/assets/img/example-card.png)**Line color ramp symbol (polyline helper)** Example\\
This example shows how to add a line layer with a color ramp symbol that changes the line color based on the map zoom level using the polyline layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polyline-ramped-style/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/color-ramp-custom/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Custom color ramp (color ramp)

Custom color ramp (color ramp)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)