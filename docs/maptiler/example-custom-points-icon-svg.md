# How to add a custom icon (SVG) to a point layer

This example illustrates how to make a map with pins to display a point layer from a [MapTiler Tileset](https://cloud.maptiler.com/tiles/) using a custom SVG icon.

Add custom icon (SVG) to a point layer

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Add custom icon (SVG) to a point layer</title>
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
    style: maptilersdk.MapStyle.BASIC,
    center: [-73.9066, 40.7314], // starting position [lng, lat]
    zoom: 10.21, // starting zoom
  });

  // Create an image from SVG
  const svgImage = new Image(35, 42);
  svgImage.onload = () => {
      map.addImage('svg', svgImage)
  }
  function svgStringToImageSrc (svgString) {
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)
  }

  const pin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 85" fill="#0000ff">
    <path stroke-width="4" d="M 5,33.103579 C 5,17.607779 18.457,5 35,5 C 51.543,5 65,17.607779 65,33.103579 C 65,56.388679 40.4668,76.048179 36.6112,79.137779 C 36.3714,79.329879 36.2116,79.457979 36.1427,79.518879 C 35.8203,79.800879 35.4102,79.942779 35,79.942779 C 34.5899,79.942779 34.1797,79.800879 33.8575,79.518879 C 33.7886,79.457979 33.6289,79.330079 33.3893,79.138079 C 29.5346,76.049279 5,56.389379 5,33.103579 Z M 35.0001,49.386379 C 43.1917,49.386379 49.8323,42.646079 49.8323,34.331379 C 49.8323,26.016779 43.1917,19.276479 35.0001,19.276479 C 26.8085,19.276479 20.1679,26.016779 20.1679,34.331379 C 20.1679,42.646079 26.8085,49.386379 35.0001,49.386379 Z"></path>
  </svg>`;

  svgImage.src = svgStringToImageSrc(pin);

  map.on('load', function() {

    map.addSource('points', {
      type: 'vector',
      url: "https://api.maptiler.com/tiles/YOUR_MAPTILER_TILESET_ID_HERE/tiles.json"
    });

    map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'points',
      'source-layer': 'YOUR_TILESET_LAYER_HERE',
      'layout': {
        'icon-image': 'svg',
        'icon-size': 1.0,
      },
      'paint': {}
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
  style: MapStyle.BASIC,
  center: [-73.9066, 40.7314], // starting position [lng, lat]
  zoom: 10.21, // starting zoom
});

// Create an image from SVG
const svgImage = new Image(35, 42);
svgImage.onload = () => {
    map.addImage('svg', svgImage)
}
function svgStringToImageSrc (svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)
}

const pin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 85" fill="#0000ff">
  <path stroke-width="4" d="M 5,33.103579 C 5,17.607779 18.457,5 35,5 C 51.543,5 65,17.607779 65,33.103579 C 65,56.388679 40.4668,76.048179 36.6112,79.137779 C 36.3714,79.329879 36.2116,79.457979 36.1427,79.518879 C 35.8203,79.800879 35.4102,79.942779 35,79.942779 C 34.5899,79.942779 34.1797,79.800879 33.8575,79.518879 C 33.7886,79.457979 33.6289,79.330079 33.3893,79.138079 C 29.5346,76.049279 5,56.389379 5,33.103579 Z M 35.0001,49.386379 C 43.1917,49.386379 49.8323,42.646079 49.8323,34.331379 C 49.8323,26.016779 43.1917,19.276479 35.0001,19.276479 C 26.8085,19.276479 20.1679,26.016779 20.1679,34.331379 C 20.1679,42.646079 26.8085,49.386379 35.0001,49.386379 Z"></path>
</svg>`;

svgImage.src = svgStringToImageSrc(pin);

map.on('load', function() {

  map.addSource('points', {
    type: 'vector',
    url: "https://api.maptiler.com/tiles/YOUR_MAPTILER_TILESET_ID_HERE/tiles.json"
  });

  map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'points',
    'source-layer': 'YOUR_TILESET_LAYER_HERE',
    'layout': {
      'icon-image': 'svg',
      'icon-size': 1.0,
    },
    'paint': {}
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
  <title>Add custom icon (SVG) to a point layer</title>
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

Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

Replace `YOUR_MAPTILER_TILESET_ID_HERE` with your actual [MapTiler Tileset ID](https://cloud.maptiler.com/tiles/).

Replace `YOUR_TILESET_LAYER_HERE` with your actual **Layer ID**. [How to get the Layer ID](https://docs.maptiler.com/guides/general/how-to-get-tileset-layer-id/).

## Related examples

[![How to add a custom icon (PNG) to a point layer](https://docs.maptiler.com/assets/img/example-card.png)**Add custom icon (PNG) to a point layer** Example\\
This example shows how to make a map with pins to display a point layer from a MapTiler Tileset using a custom PNG icon.](https://docs.maptiler.com/sdk-js/examples/custom-points-icon-png/)

[![Add custom icons with markers](https://docs.maptiler.com/assets/img/example-card.png)**Add custom icons with markers** Example\\
Add custom marker icons to your map.](https://docs.maptiler.com/sdk-js/examples/custom-marker-icons/)

[![Show point data from GeoJSON on the map](https://docs.maptiler.com/assets/img/example-card.png)**GeoJSON point layer** Example\\
This tutorial shows how to add a GeoJSON point overlay to the map.](https://docs.maptiler.com/sdk-js/examples/geojson-point/)

[![Add an icon to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add an icon to the map** Example\\
Add an icon to the map from an external URL and use it in a symbol layer.](https://docs.maptiler.com/sdk-js/examples/add-image/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/custom-points-icon-svg/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to add a custom icon (SVG) to a point layer

Add custom icon (SVG) to a point layer

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)