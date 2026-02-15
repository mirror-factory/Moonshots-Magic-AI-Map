# Add custom icons with markers

Enhance your map by incorporating personalized icons using the [`Marker`](https://docs.maptiler.com/sdk-js/api/markers/#marker) feature. This functionality allows you to include custom icons that align with your specific preferences.

Add custom icons with Markers

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Add custom icons with Markers</title>
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

    .marker {
      display: block;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      padding: 0;
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const geojson = {
      'type': 'FeatureCollection',
      'features': [\
        {\
          'type': 'Feature',\
          'properties': {\
            'message': 'Foo',\
            'iconSize': [60, 60]\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-66.324462890625, -16.024695711685304]\
          }\
        },\
        {\
          'type': 'Feature',\
          'properties': {\
            'message': 'Bar',\
            'iconSize': [50, 50]\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-61.2158203125, -15.97189158092897]\
          }\
        },\
        {\
          'type': 'Feature',\
          'properties': {\
            'message': 'Baz',\
            'iconSize': [40, 40]\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-63.29223632812499, -18.28151823530889]\
          }\
        }\
      ]
    };

    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.STREETS,
      center: [-65.017, -16.457],
      zoom: 5
    });

    // add markers to map
    geojson.features.forEach(function (marker) {
      // create a DOM element for the marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage =
        `url(https://docs.maptiler.com/sdk-js/examples/custom-marker-icons/${marker.properties.iconSize[0]}.jpg)`;
      el.style.width = marker.properties.iconSize[0] + 'px';
      el.style.height = marker.properties.iconSize[1] + 'px';

      el.addEventListener('click', function () {
        window.alert(marker.properties.message);
      });

      // add marker to map
      new maptilersdk.Marker({ element: el })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
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
const geojson = {
    'type': 'FeatureCollection',
    'features': [\
        {\
            'type': 'Feature',\
            'properties': {\
                'message': 'Foo',\
                'iconSize': [60, 60]\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-66.324462890625, -16.024695711685304]\
            }\
        },\
        {\
            'type': 'Feature',\
            'properties': {\
                'message': 'Bar',\
                'iconSize': [50, 50]\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-61.2158203125, -15.97189158092897]\
            }\
        },\
        {\
            'type': 'Feature',\
            'properties': {\
                'message': 'Baz',\
                'iconSize': [40, 40]\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-63.29223632812499, -18.28151823530889]\
            }\
        }\
    ]
};

const map = new Map({
    container: 'map',
    style: MapStyle.STREETS,
    center: [-65.017, -16.457],
    zoom: 5
});

// add markers to map
geojson.features.forEach(function (marker) {
    // create a DOM element for the marker
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage =
        `url(https://docs.maptiler.com/sdk-js/examples/custom-marker-icons/${marker.properties.iconSize[0]}.jpg)`;
    el.style.width = marker.properties.iconSize[0] + 'px';
    el.style.height = marker.properties.iconSize[1] + 'px';

    el.addEventListener('click', function () {
        window.alert(marker.properties.message);
    });

    // add marker to map
    new maptilersdk.Marker({element: el})
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
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
  <title>Add custom icons with Markers</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <style>
  .marker {
      display: block;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      padding: 0;
  }
  </style>

  <div id="map"></div>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

HTML

Copy

style.css

```css
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy

## Related examples

[![Add an icon to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add an icon to the map** Example\\
Add an icon to the map from an external URL and use it in a symbol layer.](https://docs.maptiler.com/sdk-js/examples/add-image/)

[![How to add a custom icon (PNG) to a point layer](https://docs.maptiler.com/assets/img/example-card.png)**Add custom icon (PNG) to a point layer** Example\\
This example shows how to make a map with pins to display a point layer from a MapTiler Tileset using a custom PNG icon.](https://docs.maptiler.com/sdk-js/examples/custom-points-icon-png/)

[![How to add a custom icon (SVG) to a point layer](https://docs.maptiler.com/assets/img/example-card.png)**Add custom icon (SVG) to a point layer** Example\\
This example shows how to make a map with pins to display a point layer from a MapTiler Tileset using a custom SVG icon.](https://docs.maptiler.com/sdk-js/examples/custom-points-icon-svg/)

[![Show point data from GeoJSON on the map](https://docs.maptiler.com/assets/img/example-card.png)**GeoJSON point layer** Example\\
This tutorial shows how to add a GeoJSON point overlay to the map.](https://docs.maptiler.com/sdk-js/examples/geojson-point/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/custom-marker-icons/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Marker icons: Add custom icons to your markers

Marker icons

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)