# Include a QR code to access your augmented reality (AR) maps on a mobile device

To enhance the user experience, it is possible to incorporate a QR code picture alongside the three-dimensional model. This will enable users to effortlessly access the augmented reality model on their mobile device or AR viewer.

The [Augmented reality (AR) control](https://docs.maptiler.com/sdk-js/modules/ar/) adds a button on your map that enables the creation of a 3D representation of the current view, complete with 3D terrain and any additional layers you have applied. This functionality is compatible with **WebXR** or **Apple Quick Look**.

In this example, we employed the `qrcode-generator` library to produce the QR code. However, you have the flexibility to utilize your preferred approach for generating the QR code image.

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

    <!-- Importing QR code library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

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

      .qr-code {
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 20px;
        height: 120px;
        border: 2px white solid;
        border-radius: 5px;
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

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      function generateQRCode() {
        // https://github.com/kazuhikoarase/qrcode-generator/tree/master/js
        const qr = qrcode(0, "M");
        qr.addData(location.href);
        qr.make();
        return qr.createDataURL(10, 10);
      }

      // Creating a map
      const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.OUTDOOR,
        zoom: 12,
        center: [-116.22335, 51.4117],
        hash: true,
      });

      // Waiting for the map to be ready
      map.on("load", (e) => {
        const qrCodeOptions = isMobile ? {activateAR: true} : {
          logo: generateQRCode(),
          logoClass: "qr-code",
          activateAR: true
        }

        const arControl = new maptilerarcontrol.MaptilerARControl(qrCodeOptions);

        arControl.on("computeStart", (e) => {
          overlay.style.display = "inherit";

          if (!isMobile) {
            arControl.updateLogo(generateQRCode())
          }
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

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function generateQRCode() {
  // https://github.com/kazuhikoarase/qrcode-generator/tree/master/js
  const qr = qrcode(0, "M");
  qr.addData(location.href);
  qr.make();
  return qr.createDataURL(10, 10);
}

// Creating a map
const map = new Map({
  container: 'map',
  style: MapStyle.OUTDOOR,
  zoom: 12,
  center: [-116.22335, 51.4117],
  hash: true,
});

// Waiting for the map to be ready
map.on("load", (e) => {
  const qrCodeOptions = isMobile ? {activateAR: true} : {
    logo: generateQRCode(),
    logoClass: "qr-code",
    activateAR: true
  }

  const arControl = new MaptilerARControl(qrCodeOptions);

  arControl.on("computeStart", (e) => {
    overlay.style.display = "inherit";

    if (!isMobile) {
      arControl.updateLogo(generateQRCode())
    }
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
✖ Error: File does not exist or is empty
```

CSS

Copy

## Related examples

[![Customize the AR experience.](https://docs.maptiler.com/assets/img/example-card.png)**Custom AR experience** Example\\
Customize the AR experience: The Augmented reality (AR) control accepts an option object to customize the look and feel. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control-custom/)

[![Add GeoJSON to AR maps](https://docs.maptiler.com/assets/img/example-card.png)**Add GeoJSON to AR maps** Example\\
Add a GeoJSON line to Augmented reality (AR) map, to create a biking or hiking route 3D model. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control-geojson-line/)

[![How to trigger actions in the AR control](https://docs.maptiler.com/assets/img/example-card.png)**Trigger AR control actions** Example\\
How to trigger actions in the AR control: Display the Augmented reality (AR) control using the keyboard to create a 3D viewport model, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control-no-button/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS AR control to create a 3D model of the viewport, including 3D terrain and any layer you have put on top.](https://docs.maptiler.com/assets/img/ar-logo-icon.svg)](https://docs.maptiler.com/sdk-js/modules/ar/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/ar-control-qr/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Include a QR code to access your augmented reality (AR) maps on a mobile device

QR code to access AR maps

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)