# Slowly fly to a location

Use [`flyTo`](https://docs.maptiler.com/sdk-js/api/map/#map#flyto) with flyOptions to slowly zoom to a location.

Slowly fly to a location

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Fly

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slowly fly to a location</title>
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

    #fly {
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
  <button id="fly">Fly</button>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const start = [-74.5, 40];
    const end = [74.5, 40];
    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.STREETS,
      center: start,
      zoom: 9
    });

    let isAtStart = true;

    document.getElementById('fly').addEventListener('click', function () {
      // depending on whether we're currently at point a or b, aim for
      // point a or b
      const target = isAtStart ? end : start;

      // and now we're at the opposite point
      isAtStart = !isAtStart;

      map.flyTo({
        // These options control the ending camera position: centered at
        // the target, at zoom level 9, and north up.
        center: target,
        zoom: 9,
        bearing: 0,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 0.2, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: function (t) {
          return t;
        },

        // this animation is considered essential with respect to prefers-reduced-motion
        essential: true
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
const start = [-74.5, 40];
const end = [74.5, 40];
const map = new Map({
    container: 'map',
    style: MapStyle.STREETS,
    center: start,
    zoom: 9
});

let isAtStart = true;

document.getElementById('fly').addEventListener('click', function () {
    // depending on whether we're currently at point a or b, aim for
    // point a or b
    const target = isAtStart ? end : start;

    // and now we're at the opposite point
    isAtStart = !isAtStart;

    map.flyTo({
        // These options control the ending camera position: centered at
        // the target, at zoom level 9, and north up.
        center: target,
        zoom: 9,
        bearing: 0,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 0.2, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: function (t) {
            return t;
        },

        // this animation is considered essential with respect to prefers-reduced-motion
        essential: true
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
  <title>Slowly fly to a location</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <style>
  #fly {
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
  <button id="fly">Fly</button>
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

[![Fit a map to a bounding box](https://docs.maptiler.com/assets/img/example-card.png)**Fit a map to a bounding box** Example\\
Fit the map to a specific area, regardless of the pixel size of the map.](https://docs.maptiler.com/sdk-js/examples/fitbounds/)

[![Jump to a series of locations](https://docs.maptiler.com/assets/img/example-card.png)**Jump to a series of locations** Example\\
Use the jumpTo function to showcase multiple locations.](https://docs.maptiler.com/sdk-js/examples/jump-to/)

[![Create a story map, fly to a location based on the scroll position](https://docs.maptiler.com/assets/img/example-card.png)**Fly to a location based on the scroll position** Example\\
Scroll down through the story and the map will fly to the chapter's location.](https://docs.maptiler.com/sdk-js/examples/scroll-fly-to/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/flyto-options/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Slowly fly to a location

Slowly fly to a location

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)