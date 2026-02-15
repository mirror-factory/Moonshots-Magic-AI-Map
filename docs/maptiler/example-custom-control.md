# Add custom zoom control

The custom zoom control in this example shows the exact current zoom level on a map. It helps set up [zoom-based style rules](https://docs.maptiler.com/guides/map-design/style-by-the-zoom-range/) or understand data resolution.

Adding [custom controls](https://docs.maptiler.com/sdk-js/api/controls/#icontrol) can make your application stand out. Before you start making your controls, check out the premade [MapTiler SDK controls](https://docs.maptiler.com/sdk-js/api/controls/) ( [Geolocate](https://docs.maptiler.com/sdk-js/api/controls/#maptilergeolocatecontrol), [Scale](https://docs.maptiler.com/sdk-js/api/controls/#scalecontrol), [terrain](https://docs.maptiler.com/sdk-js/api/controls/#maptilerterraincontrol), …).

Add custom zoom control

1.00

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MapTiler Custom Zoom Control</title>
  <!-- Load MapTiler SDK JS and CSS -->
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

    /* Custom control styling */
    .custom-map-control {
      background-color: rgba(255, 255, 255, 1);
      border-radius: 3px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-weight: bold;
      width: 33px;
      height: 33px;
      font-size: 10px;
      color: #333;
      display: flex;
      justify-content: center;
      /* Centers items horizontally */
      align-items: center;
      /* Ensure it's above the map but part of the map's control flow */
      z-index: 1;
      pointer-events: auto;
      /* Allow interaction with the control */
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <script>
    // Initialize MapTiler SDK
    maptilersdk.config.apiKey = "YOUR_MAPTILER_API_KEY_HERE";

    // Initialize the map
    const map = new maptilersdk.Map({
      container: 'map', // The ID of the HTML element where the map will be rendered
    });

    // --- Custom Map Control Implementation ---

    // This class will define how your custom control behaves and looks
    // Read more about Icontrol https://docs.maptiler.com/sdk-js/api/controls/#icontrol
    class ZoomControl {
      onAdd(map) {
        this._map = map;
        this._container = document.createElement('div'); // Create a new div element
        this._container.className = 'maplibregl-ctrl custom-map-control'; // Add SDK's control class and your custom class

        this._updateZoomHandler = () => {
          this._container.innerHTML = `${map.getZoom().toFixed(2)}`;
        };
        // Initial text with current zoom
        this._updateZoomHandler();
        // Add event listener for zoom changes
        map.on('zoomend', this._updateZoomHandler);
        return this._container;
      }

      onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
      }
    }

    map.addControl(new ZoomControl(), 'top-right');
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
import { Map, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

// Initialize MapTiler SDK
config.apiKey = "YOUR_MAPTILER_API_KEY_HERE";

// Initialize the map
const map = new Map({
  container: 'map', // The ID of the HTML element where the map will be rendered
});

// --- Custom Map Control Implementation ---

// This class will define how your custom control behaves and looks
// Read more about Icontrol https://docs.maptiler.com/sdk-js/api/controls/#icontrol
class ZoomControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div'); // Create a new div element
    this._container.className = 'maplibregl-ctrl custom-map-control'; // Add SDK's control class and your custom class

    this._updateZoomHandler = () => {
      this._container.innerHTML = `${map.getZoom().toFixed(2)}`;
    };
    // Initial text with current zoom
    this._updateZoomHandler();
    // Add event listener for zoom changes
    map.on('zoomend', this._updateZoomHandler);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

map.addControl(new ZoomControl(), 'top-right');
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MapTiler Custom Zoom Control</title>
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

[![Geocoding: Add place search to map](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding control** Example\\
This tutorial shows how to search for places using the geocoding control.](https://docs.maptiler.com/sdk-js/examples/geocoder-component/)

[![How to display a minimap or overview map control to aid the map navigation](https://docs.maptiler.com/assets/img/example-card.png)**Minimap control** Example\\
This tutorial shows how to display a minimap or overview map control in MapTiler SDK JS to aid the map navigation.](https://docs.maptiler.com/sdk-js/examples/control-minimap/)

[![Add a custom control programmatically](https://docs.maptiler.com/assets/img/example-card.png)**Custom control programmatically** Example\\
How to add a custom control programmatically. Ideal for applications that require dynamic logic, event-driven behaviour, or a deeper integration with a framework like React](https://docs.maptiler.com/sdk-js/examples/custom-controls-programmatic/)

[![Scale control display](https://docs.maptiler.com/assets/img/example-card.png)**Scale control** Example\\
This tutorial shows how to add and display a scale control on the map.](https://docs.maptiler.com/sdk-js/examples/control-scale/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/custom-control/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Zoom level custom control

Zoom level custom control

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)