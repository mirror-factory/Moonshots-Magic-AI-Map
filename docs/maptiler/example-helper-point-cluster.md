# Point layer cluster (point helper)

This example showcases how to generate a cluster map using the point layer helper with its default configurations. To replicate
this example, download the [US schools sample data](https://docs.maptiler.com/sdk-js/assets/schools.geojson).

If your map contains a layer with a significant number of points, you have the option to configure clustering, which aids in visually extracting valuable information from your data. This is where a **cluster map**, also referred to as a bubble map, proves to be beneficial.

When you activate clustering, point features that are a certain distance apart on the screen are grouped into a cluster. The size of the cluster or bubble corresponds to the number of markers it contains. By zooming in closer on your map, you can view the individual points and interact with them.

Cluster maps are an excellent tool for determining the quantity of data points located within a specific region. If you need to measure density, a [heat map](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-minimal/) is also highly effective and can incorporate your numeric values.

By default, the label is displayed, indicating the number of elements contained within each cluster.

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
        zoom: 3.2,
        center: [-98.84, 38.28],
        style: maptilersdk.MapStyle.DATAVIZ.LIGHT
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addPoint(map, {
        data: 'schools.geojson',
        cluster: true,
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
    zoom: 3.2,
    center: [-98.84, 38.28],
    style: MapStyle.DATAVIZ.LIGHT
});

map.on('load', async function () {
  await helpers.addPoint(map, {
    data: 'schools.geojson',
    cluster: true,
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

[![Display HTML clusters with custom properties](https://docs.maptiler.com/assets/img/example-card.png)**HTML clusters with custom properties** Example\\
Extend clustering with HTML markers and custom property expressions.](https://docs.maptiler.com/sdk-js/examples/cluster-html/)

[![Point layer (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer (point helper)** Example\\
This example shows how to add a point layer to the map using the point layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-point-minimal/)

[![Heatmap layer (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer (heatmap helper)** Example\\
This example shows how to add a heatmap layer to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-minimal/)

[![Point filtering by property](https://docs.maptiler.com/assets/img/example-card.png)**Point filtering by property** Example\\
Filter thousands of features in real time to quickly and easily find those with a property that meets your search criteria.](https://docs.maptiler.com/sdk-js/examples/point-filtering/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Point layer cluster (point helper)

Point layer cluster (point helper)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)