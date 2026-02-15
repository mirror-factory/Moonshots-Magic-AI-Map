# Show elevation on click

How to get the elevation in meters from any location. MapTiler [SDK elevation](https://docs.maptiler.com/client-js/elevation/) functions provide convenient access to get the elevation in meters from any location. It’s possible to look up and compute the elevation from: a single location, provide a batch of points, a GeoJSON LineString or a GeoJSON MultiLineString.

Elevation at point

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Click on the map to get the elevation at this location

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Elevation at point</title>
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
        style: maptilersdk.MapStyle.HYBRID,
        center: [-70.02454, -33.81356],
        zoom: 12
    });

    map.on('load', function () {
        map.on('click', async function (ev) {
          const {lng, lat} = ev.lngLat;
          //get the elevation at a given position
          const elevatedPosition = await maptilersdk.elevation.at([lng, lat]);
          const popup = new maptilersdk.Popup()
            .setLngLat([lng, lat])
            .setHTML(`<h2>Elevation</h2>
            <h3>${elevatedPosition[2].toFixed(0)} mts</h3>`)
            .addTo(map);
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
    style: MapStyle.HYBRID,
    center: [-70.02454, -33.81356],
    zoom: 12
});

map.on('load', function () {
    map.on('click', async function (ev) {
      const {lng, lat} = ev.lngLat;
      //get the elevation at a given position
      const elevatedPosition = await maptilersdk.elevation.at([lng, lat]);
      const popup = new maptilersdk.Popup()
        .setLngLat([lng, lat])
        .setHTML(`<h2>Elevation</h2>
        <h3>${elevatedPosition[2].toFixed(0)} mts</h3>`)
        .addTo(map);
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
  <title>Elevation at point</title>
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

[![Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Add elevation profile control** Example\\
The elevation profile control for MapTiler SDK is a super easy way to show the elevation profile of any GeoJSON trace, with elevation data fueled by MapTiler.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)

[![Get POIs information on click](https://docs.maptiler.com/assets/img/example-card.png)**Get POIs information on click** Example\\
Get POI information from MapTiler, OpenStreetMap (OSM), and Wikidata data by clicking on the map.](https://docs.maptiler.com/sdk-js/examples/pois-info/)

[![Display a popup on click](https://docs.maptiler.com/assets/img/example-card.png)**Display a popup on click** Example\\
When a user clicks a symbol, show a popup containing more information.](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/elevation-at/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Show elevation on click

Elevation at point

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)