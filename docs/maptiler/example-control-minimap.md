---
title: "How to display a minimap or overview map control to aid the map navigation | JavaScript maps SDK | MapTiler SDK JS | MapTiler"
source: "https://docs.maptiler.com/sdk-js/examples/control-minimap"
description: "This tutorial shows how to display a minimap or overview map control in MapTiler SDK JS to aid the map navigation."
---

# How to display a minimap or overview map control to aid the map navigation

This tutorial shows how to display a minimap or overview map control in MapTiler SDK JS to aid map navigation.

By following this guide, users will learn how to integrate and display a minimap within their map interface using MapTiler SDK JS. The minimap provides users with a compact overview of the entire map, allowing them to easily navigate and explore different areas. With the help of MapTiler SDK JS, developers can effortlessly incorporate a minimap control into their web-based mapping applications, making it easier for users to interact with and navigate through their maps.

Display a minimap control to aid the map navigation

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Display a minimap control to aid the map navigation</title>
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
      container: 'map', // container id
      style: maptilersdk.MapStyle.STREETS,
      center: [16.62662018, 49.2125578], // starting position [lng, lat]
      zoom: 10, // starting zoom
      minimap: {
        containerStyle: {
          width: '200px',
          height: '150px'
        }
      }
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
  style: MapStyle.STREETS,
  center: [16.62662018, 49.2125578], // starting position [lng, lat]
  zoom: 10, // starting zoom
  minimap: {
    containerStyle: {
      width: '200px',
      height: '150px'
    }
  }
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
  <title>Display a minimap control to aid the map navigation</title>
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

## Learn more

By default, the control uses the same style as the map but we can use a different style on the `minimapControl`. Example of the control using the [Satellite Hybrid Map](https://cloud.maptiler.com/maps/hybrid/) and changing the size of the map.

```js

```

JavaScript

Copy

Visit the [JavaScript Maps API reference](https://docs.maptiler.com/sdk-js/api/controls/) to learn how to create your custom control.

## Related examples

[![Scale control display](https://docs.maptiler.com/assets/img/example-card.png)**Scale control** Example\\
This tutorial shows how to add and display a scale control on the map.](https://docs.maptiler.com/sdk-js/examples/control-scale/)

[![Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Add elevation profile control** Example\\
The elevation profile control for MapTiler SDK is a super easy way to show the elevation profile of any GeoJSON trace, with elevation data fueled by MapTiler.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/)

[![Distance measurement on map](https://docs.maptiler.com/assets/img/example-card.png)**Measure distances** Example\\
To calculate distances on the map, simply click on different points to create lines that will measure the distances using turf.length.](https://docs.maptiler.com/sdk-js/examples/measure/)

[![Change the default position for attribution](https://docs.maptiler.com/assets/img/example-card.png)**Change attribution default position** Example\\
Place attribution in the top-left position when initializing a map.](https://docs.maptiler.com/sdk-js/examples/attribution-position/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/control-minimap/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/control-minimap/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to display a minimap or overview map control to aid the map navigation

Minimap control

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)