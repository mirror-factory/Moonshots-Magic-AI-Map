# Search features by coordinates using the geocoding control

Activate the `enableReverse` option during geocoding control initialization to support coordinate-based searches.

Setting this option to `"always"` lets you locate features using names, addresses, and coordinate pairs. For example typing `41.874836, -87.628261` in the search box will display items that match those coordinates, addresses, regions, states, etc.

Geocoding (forward geocoding and reverse geocoding) is a technique for place identification - either by name or coordinates. See the [Geocoding page](https://www.maptiler.com/cloud/geocoding/) for more details.

MapTiler Geocoding control reverse geocoding

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Click on the map or type a coordinate in the search box to search for addresses

- NPM module
- Basic JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MapTiler Geocoding control reverse geocoding</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <script src="https://cdn.maptiler.com/maptiler-geocoding-control/v2.1.7/maptilersdk.umd.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-geocoding-control/v2.1.7/style.css" rel="stylesheet">
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
        style: maptilersdk.MapStyle.STREETS.LIGHT,
        geolocate: true
      });

      //set geocoding control search by coodinates (reverse geocoding)
      const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({
        enableReverse: "always",
      });

      map.addControl(gc, 'top-left');
  </script>
</body>
</html>
```

HTML

Copy

```bash
npm install --save @maptiler/sdk @maptiler/geocoding-control
```

Bash

Copy

main.js

```javascript
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { GeocodingControl } from '@maptiler/geocoding-control/maptilersdk';
import '@maptiler/geocoding-control/style.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

const map = new Map({
  container: 'map', // container id
  style: MapStyle.STREETS.LIGHT,
  geolocate: true
});

//set geocoding control search by coodinates (reverse geocoding)
const gc = new GeocodingControl({
  enableReverse: "always",
});

map.addControl(gc, 'top-left');
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MapTiler Geocoding control reverse geocoding</title>
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

Check the [MapTiler Geocoding control API reference](https://docs.maptiler.com/sdk-js/modules/geocoding/api/api-reference/) for all search options. For example specifying the language of the results, etc.

Do you want to see how the geocoder component is made? Check the [MapTiler Geocoding control repository](https://github.com/maptiler/maptiler-geocoding-control). You can also use it as inspiration to create your component.

Discover the process of integrating the geocoding control feature into your **React** ( [Geocoding React component repository](https://docs.maptiler.com/sdk-js/modules/geocoding/api/usage/react/)) or **Svelte** ( [Geocoding Svelte component](https://docs.maptiler.com/sdk-js/modules/geocoding/api/usage/svelte/)) applications. Additionally, you have the option to use the [VanillaJS version](https://docs.maptiler.com/sdk-js/modules/geocoding/api/usage/vanilla-js/) to customize it for any of your applications.

Are you currently using a different map library? No worries! Learn how to incorporate the geocoding control functionality with **Leaflet** ( [Leaflet Geocoding control](https://docs.maptiler.com/leaflet/examples/geocoding-control)), **OpenLayers** ( [OpenLayers Geocoding control](https://docs.maptiler.com/openlayers/examples/geocoding-control/)), or **MapLibre GL JS** ( [MapLibre GL JS Geocoding control](https://docs.maptiler.com/sdk-js/modules/geocoding/api/usage/maplibre-gl-js/)).

## Related examples

[![How to search places by coordinates (reverse geocoding)](https://docs.maptiler.com/assets/img/example-card.png)**Reverse geocoding** Example\\
This tutorial shows how to search places by coordinates (reverse geocoding).](https://docs.maptiler.com/sdk-js/examples/reverse-geocoding/)

[![Customize API request from geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**Customize API request (geocoding control)** Example\\
Use the adjustUrl option in the geocoding control constructor to modify the geocoding URL before the fetch. This capability enables complete control over the search control's functionality.](https://docs.maptiler.com/sdk-js/examples/geocoding-adjusturl/)

[![Geocoding: Show place search results](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding API** Example\\
This tutorial shows how to search places using the MapTiler Geocoding API.](https://docs.maptiler.com/sdk-js/examples/geocoding/)

[![Geocoding search results to specified country(ies)](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding search results to specified country(ies)** Example\\
Geocoding control limit search results to specified country(ies).](https://docs.maptiler.com/sdk-js/examples/geocoding-filter-country/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/geocoding-reverse/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/geocoding-reverse/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Search features by coordinates using the geocoding control

Geocoding control (reverse geocoding)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)