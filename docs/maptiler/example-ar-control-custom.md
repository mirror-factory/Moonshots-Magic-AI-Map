# Customize the AR experience.

Enhance the AR experience: The [Augmented reality (AR) control](https://docs.maptiler.com/sdk-js/modules/ar/) accepts an option object to customize the look and feel. Compatible with both **WebXR** and **Apple Quick Look**.

Customize the AR control to deliver a personalized immersive experience. So why not give it a try and see the world from a different perspective?

MapTiler AR Control

computing model

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

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
        background: radial-gradient(circle, rgba(230,240,244,1) 1%, rgba(165,184,190,1) 73%, rgba(98,116,121,1) 100%);
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

      .maptiler-ar-enable-button {
        cursor: pointer;
        position: absolute;
        top: 0px;
        left: 0px;
        margin: 35px;
        width: fit-content;
        background: rgb(255 255 255 / 60%);
        border: none;
        border-radius: 5px;
        padding: 8px 10px;
        transition: all 0.2s;
      }

      .maptiler-ar-close-button {
        cursor: pointer;
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 0px;
        margin: 35px;
        width: fit-content;
        background: rgb(255 255 255 / 60%);
        border: none;
        border-radius: 5px;
        padding: 8px 10px;
        transition: all 0.2s;
      }

      .maptiler-ar-close-button:hover {
        background: rgb(255, 125, 65);
      }

      .maptiler-ar-enable-button:hover {
        background: rgb(65, 166, 255);
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
        style: maptilersdk.MapStyle.STREETS.DARK,
        zoom: 12,
        center: [-116.22335, 51.4117],
      });

      // Waiting for the map to be ready
      map.on("load", (e) => {
        const arControl = new maptilerarcontrol.MaptilerARControl({
          background: `radial-gradient(circle, rgba(230,240,244,1) 1%, rgba(165,184,190,1) 73%, rgba(98,116,121,1) 100%)`,
          edgeColor: "#456992",
          arButtonContent: `<img src="/sdk-js/assets/box-icon.svg"/>`,
          closeButtonContent: `<img src="/sdk-js/assets/close-icon.svg"/>`,
          arButtonClassName: "maptiler-ar-enable-button",
          closeButtonClassName: "maptiler-ar-close-button",
          activateAR: true //When the platform allows automatically activates the AR mode as soon as the data is ready
        });

        arControl.on("computeStart", (e) => {
          overlay.style.display = "inherit";
        })

        arControl.on("computeEnd", (e) => {
          overlay.style.display = "none";
        })

        map.addControl(arControl, "top-left");
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
  style: MapStyle.STREETS.DARK,
  zoom: 12,
  center: [-116.22335, 51.4117],
});

// Waiting for the map to be ready
map.on("load", (e) => {
  const arControl = new MaptilerARControl({
    background: `radial-gradient(circle, rgba(230,240,244,1) 1%, rgba(165,184,190,1) 73%, rgba(98,116,121,1) 100%)`,
    edgeColor: "#456992",
    arButtonContent: `<img src="/sdk-js/assets/box-icon.svg"/>`,
    closeButtonContent: `<img src="/sdk-js/assets/close-icon.svg"/>`,
    arButtonClassName: "maptiler-ar-enable-button",
    closeButtonClassName: "maptiler-ar-close-button",
    activateAR: true //When the platform allows automatically activates the AR mode as soon as the data is ready
  });

  arControl.on("computeStart", (e) => {
    overlay.style.display = "inherit";
  })

  arControl.on("computeEnd", (e) => {
    overlay.style.display = "none";
  })

  map.addControl(arControl, "top-left");
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
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy

## Related examples

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![Add GeoJSON to AR maps](https://docs.maptiler.com/assets/img/example-card.png)**Add GeoJSON to AR maps** Example\\
Add a GeoJSON line to Augmented reality (AR) map, to create a biking or hiking route 3D model. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control-geojson-line/)

[![Include a QR code to access your augmented reality (AR) maps on a mobile device](https://docs.maptiler.com/assets/img/example-card.png)**QR code to access AR maps** Example\\
Include a QR code to access your augmented reality (AR) maps on a mobile device. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control-qr/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS AR control to create a 3D model of the viewport, including 3D terrain and any layer you have put on top.](https://docs.maptiler.com/assets/img/ar-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/ar/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/ar-control-custom/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Customize the AR experience.

Custom AR experience

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)