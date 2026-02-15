# Display a satellite map

Display a satellite map in your web mapping application. Our built-in styles (streets, satellite, hybrid, outdoor, winter, dark, etc.) are designed to make it easier for you to create beautiful maps. No need for extra coding or worrying about outdated versions. Check out the available [list of built-in styles](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstylelist).

[MapTiler’s satellite](https://www.maptiler.com/maps/satellite/) map provides up-to-date satellite imagery for the whole world, high resolution detailed aerial imagery for many countries.

Display a satellite map

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Display a satellite map</title>
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
      container: 'map', // container id
      style: maptilersdk.MapStyle.SATELLITE,
      center: [17.100917, 48.142691], // starting position [lng, lat]
      zoom: 15.71// starting zoom
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
  container: 'map', // container id
  style: MapStyle.SATELLITE,
  center: [17.100917, 48.142691], // starting position [lng, lat]
  zoom: 15.71// starting zoom
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
  <title>Display a satellite map</title>
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

[![Built-in map styles](https://docs.maptiler.com/assets/img/example-card.png)**Built-in map styles** Example\\
Our built-in styles are designed to make it easier for you to create beautiful maps, without the need for extra coding or worrying about outdated versions.](https://docs.maptiler.com/sdk-js/examples/built-in-styles/)

[![Show raster image on the map](https://docs.maptiler.com/assets/img/example-card.png)**Raster layer** Example\\
This tutorial shows how to add a raster image overlay to the map.](https://docs.maptiler.com/sdk-js/examples/raster-layer/)

[![Add a raster tile source](https://docs.maptiler.com/assets/img/example-card.png)**Add a raster tile source** Example\\
Add a third-party raster source to the map.](https://docs.maptiler.com/sdk-js/examples/map-tiles/)

[![Add hillshading](https://docs.maptiler.com/assets/img/example-card.png)**Add hillshading** Example\\
This example adds raster hillshading to a map by adding the MapTiler Terrain-DEM raster tileset as a raster-dem source with a hillshade layer.](https://docs.maptiler.com/sdk-js/examples/hillshade/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/satellite-map/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Display a satellite map

Display a satellite map

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)