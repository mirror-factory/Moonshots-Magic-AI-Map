# Fit a map to a bounding box

Use [`fitBounds`](https://docs.maptiler.com/sdk-js/api/map/#map#fitbounds) to show a specific area of the map in view, regardless of the pixel size of the map.

Fit a map to a bounding box

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Fit to Kenya

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fit a map to a bounding box</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }

    #map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }

    #fit {
      display: block;
      position: relative;
      margin: 0px auto;
      width: 50%;
      height: 40px;
      padding: 10px;
      border: none;
      border-radius: 3px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #ee8a65;
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <br />
  <button id="fit">Fit to Kenya</button>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.STREETS,
      center: [-74.5, 40],
      zoom: 9
    });

    document.getElementById('fit').addEventListener('click', function () {
      map.fitBounds([\
        [32.958984, -5.353521],\
        [43.50585, 5.615985]\
      ]);
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
    style: MapStyle.STREETS,
    center: [-74.5, 40],
    zoom: 9
});

document.getElementById('fit').addEventListener('click', function () {
    map.fitBounds([\
        [32.958984, -5.353521],\
        [43.50585, 5.615985]\
    ]);
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
  <title>Fit a map to a bounding box</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <style>
  #fit {
      display: block;
      position: relative;
      margin: 0px auto;
      width: 50%;
      height: 40px;
      padding: 10px;
      border: none;
      border-radius: 3px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #ee8a65;
  }
  </style>
  <div id="map"></div>
  <br />
  <button id="fit">Fit to Kenya</button>
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

[![Fit to the bounds of a lineString](https://docs.maptiler.com/assets/img/example-card.png)**Fit to the bounds of a lineString** Example\\
Get the bounds of a lineString.](https://docs.maptiler.com/sdk-js/examples/zoomto-linestring/)

[![Restrict map panning to an area](https://docs.maptiler.com/assets/img/example-card.png)**Restrict map panning to an area** Example\\
Prevent a map from being panned to a different place by setting maxBounds.](https://docs.maptiler.com/sdk-js/examples/restrict-bounds/)

[![Fly to a location](https://docs.maptiler.com/assets/img/example-card.png)**Fly to a location** Example\\
Use flyTo to smoothly interpolate between locations.](https://docs.maptiler.com/sdk-js/examples/flyto/)

[![How to center map based on visitor’s country bounds](https://docs.maptiler.com/assets/img/example-card.png)**Center map by visitor’s country IP** Example\\
This tutorial shows how to center map based on the visitor’s country bounds using the MapTiler Geolocation API.](https://docs.maptiler.com/sdk-js/examples/ip-country-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/fitbounds/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Fit a map to a bounding box

Fit a map to a bounding box

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)