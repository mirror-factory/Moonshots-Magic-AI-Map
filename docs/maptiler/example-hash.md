# How to keep the map view with the URL hash

To maintain the map view in the URL hash, you can utilize the `hash:true` option in the map constructor. This feature is particularly valuable for sharing links that lead to a specific map view or loading the map with a predetermined view other than the default.

By implementing this functionality, the map’s position, including zoom level, center latitude, center longitude, bearing, and pitch (`#zoom/latitude/longitude/bearing/pitch`), will be synchronized with the hash fragment in the URL of the page. For instance, you can have a URL like: `http://path/to/my/page.html#15.21/46.234453/6.055004/23.2/57`.

This allows users to share and retrieve a particular map view by simply copying and pasting the URL. Whether it’s for sharing, bookmarking, or customizing default map views, leveraging the URL hash feature is an excellent way to enhance the user experience and improve map navigation.

Display a map with URL hash

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Display a map with URL hash</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
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
  </style>
</head>

<body>
  <div id="map"></div>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.STREETS,
      center: [16.62662018, 49.2125578], // starting position [lng, lat]
      zoom: 14, // starting zoom
      hash: true //keep the map view with the URL hash
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
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: MapStyle.STREETS,
  center: [16.62662018, 49.2125578], // starting position [lng, lat]
  zoom: 14, // starting zoom
  hash: true //keep the map view with the URL hash
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
  <title>Display a map with URL hash</title>
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

[![Hide map navigation controls](https://docs.maptiler.com/assets/img/example-card.png)**Hide map navigation controls** Example\\
This tutorial shows how to hide the navigation control (zoom and rotation controls to the map).](https://docs.maptiler.com/sdk-js/examples/navigation/)

[![Geolocate control how to get the user's location using the GPS](https://docs.maptiler.com/assets/img/example-card.png)**Geolocate control (GPS)** Example\\
This tutorial shows how to disable the geolocate control to show the user's location using the GPS or the browser location.](https://docs.maptiler.com/sdk-js/examples/geolocate-control/)

[![Get coordinates of the mouse pointer](https://docs.maptiler.com/assets/img/example-card.png)**Get coordinates of the mouse pointer** Example\\
Show mouse position on hover with pixel and latitude and longitude coordinates.](https://docs.maptiler.com/sdk-js/examples/mouse-position/)

[![How to use the MapTiler SDK JS](https://docs.maptiler.com/assets/img/example-card.png)**Learn the basics** Example\\
This tutorial shows how to create a map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/how-to-use/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/hash/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to keep the map view with the URL hash

Map view URL hash

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)