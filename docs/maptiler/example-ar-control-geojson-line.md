# Add GeoJSON to AR maps

To create a three-dimensional (3D) representation of a cycling or hiking route on an augmented reality (AR) map, you have the option to add a GeoJSON, GPX, or KML line. Compatible with **WebXR** or **Apple Quick Look**.

In addition to lines, you can also incorporate various types of data, such as points and polygons, into your maps. These data can be viewed within the AR model.

If you’re using iOS (Quick Look), the activateAR option in the control allows for automatic activation of the AR model as soon as the data becomes available.

MapTiler AR Control

computing model

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Create GeoJSON source. Check out the [How to Upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud#PrepareGeoJSONwithattributesforchoroplethmapanduploadGeoJSONtoMapTilerCloud-UploadGeoJSONtoMapTilerCloud) tutorial. Publish the dataset and copy the geojson dataset ID. Download the sample data [here](https://docs.maptiler.com/sdk-js/examples/geojson-line/Line_GeoJSON_example.geojson).

- NPM module
- Basic JavaScript

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MapTiler AR Control</title>
    <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
    <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
    <script src="https://cdn.maptiler.com/maptiler-ar-control/v3.0.3/maptiler-ar-control.umd.min.js"></script>

    <style>
      html, body {
        margin: 0;
      }

      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }

      #overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background-color: #ffffff;
        z-index: 3;
        display: none;
      }

      #overlay div {
        color: rgb(71, 76, 87);
        position: absolute;
        width: fit-content;
        height: fit-content;
        right: 0;
        left: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        padding: 30px;
        font: 12px/20px Helvetica Neue,Arial,Helvetica,sans-serif;
      }

      .blink_me {
        animation: blinker 1s linear infinite;
      }

      @keyframes blinker {
        50% {
          opacity: 0.2;
        }
      }
    </style>
  </head>
  <body>
    <div id="overlay">
      <div class="blink_me">computing model</div>
    </div>

    <div id="map"></div>
    <script>
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

      // Creating a map
      const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.OUTDOOR,
        center: [-110.75954, 43.72874], // starting position [lng, lat]
        zoom: 13.5, // starting zoom
        bearing: -7.2,
        pitch: 45
      });

      // Waiting for the map to be ready
      map.on("load", async (e) => {
        const arControl = new maptilerarcontrol.MaptilerARControl({
          activateAR: true //When the platform allows automatically activates the AR mode as soon as the data is ready
        });

        arControl.on("computeStart", (e) => {
          overlay.style.display = "inherit";
        })

        arControl.on("computeEnd", (e) => {
          overlay.style.display = "none";
        })

        map.addControl(arControl, "top-left");

        const geojson = await maptilersdk.data.get('YOUR_MAPTILER_DATASET_ID_HERE');
        map.addSource('gps_tracks', {
          'type': 'geojson',
          'data': geojson
        });
        map.addLayer({
          'id': 'grand_teton',
          'type': 'line',
          'source': 'gps_tracks',
          'layout': {},
          'paint': {
            'line-color': '#e11',
            'line-width': 4
          }
        });
      })

    </script>
  </body>
</html>
```

HTML

Copy

```bash
npm install --save @maptiler/sdk @maptiler/ar-control
```

Bash

Copy

main.js

```javascript
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { MaptilerARControl } from '@maptiler/ar-control';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

// Creating a map
const map = new Map({
  container: 'map',
  style: MapStyle.OUTDOOR,
  center: [-110.75954, 43.72874], // starting position [lng, lat]
  zoom: 13.5, // starting zoom
  bearing: -7.2,
  pitch: 45
});

// Waiting for the map to be ready
map.on("load", async (e) => {
  const arControl = new MaptilerARControl({
    activateAR: true //When the platform allows automatically activates the AR mode as soon as the data is ready
  });

  arControl.on("computeStart", (e) => {
    overlay.style.display = "inherit";
  })

  arControl.on("computeEnd", (e) => {
    overlay.style.display = "none";
  })

  map.addControl(arControl, "top-left");

  const geojson = await maptilersdk.data.get('YOUR_MAPTILER_DATASET_ID_HERE');
  map.addSource('gps_tracks', {
    'type': 'geojson',
    'data': geojson
  });
  map.addLayer({
    'id': 'grand_teton',
    'type': 'line',
    'source': 'gps_tracks',
    'layout': {},
    'paint': {
      'line-color': '#e11',
      'line-width': 4
    }
  });
})
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MapTiler AR Control</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div id="overlay">
    <div class="blink_me">computing model</div>
  </div>

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

[![Customize the AR experience.](https://docs.maptiler.com/assets/img/example-card.png)**Custom AR experience** Example\\
Customize the AR experience: The Augmented reality (AR) control accepts an option object to customize the look and feel. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control-custom/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![How to trigger actions in the AR control](https://docs.maptiler.com/assets/img/example-card.png)**Trigger AR control actions** Example\\
How to trigger actions in the AR control: Display the Augmented reality (AR) control using the keyboard to create a 3D viewport model, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control-no-button/)

[![Include a QR code to access your augmented reality (AR) maps on a mobile device](https://docs.maptiler.com/assets/img/example-card.png)**QR code to access AR maps** Example\\
Include a QR code to access your augmented reality (AR) maps on a mobile device. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control-qr/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS AR control to create a 3D model of the viewport, including 3D terrain and any layer you have put on top.](https://docs.maptiler.com/assets/img/ar-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/ar/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/ar-control-geojson-line/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add GeoJSON to AR maps

Add GeoJSON to AR maps

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)