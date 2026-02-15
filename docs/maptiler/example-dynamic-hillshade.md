# Add dynamic hillshading

Changes in lightning of hills and mountains can easily simulate the movement of the sun during the day. You can achieve this by changing the [paint properties](https://docs.maptiler.com/gl-style-specification/layers/#hillshade) of the “Hillshade” layer from [MapTiler Terrain RGB](https://docs.maptiler.com/guides/map-tiling-hosting/data-hosting/rgb-terrain-by-maptiler/), which is included in Outdoor map style. Here is an [example how to add a hillshading layer](https://docs.maptiler.com/sdk-js/api/layers/#hillshade) to any map style.

If you do not need dynamic lighting, you can add and [set hillshading values](https://docs.maptiler.com/guides/map-design/layer-styling/#raster-styling) directly in the MapTiler Map Designer tool.

Create dynamic hillshade

Direction:

Exaggeration:

B&W:

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create dynamic hillshade</title>
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

    /* Style for the map options control panel */
    .map-options {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 5px 10px;
      font-size: 12px;
      z-index: 85;
      background: #fff;
      border-radius: 4px;
      opacity: 0.9;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
      white-space: nowrap;
    }
  </style>
</head>

<body>
  <!-- Control panel for hillshade options -->
  <div class="map-options">
    Direction: <br>
    <!-- Slider to control illumination direction -->
    <input type="range" min="0" max="359" value="335" oninput="update()" id="dir" /> <br>
    Exaggeration: <br>
    <!-- Slider to control hillshade exaggeration -->
    <input type="range" min="0" max="1" value="0.4" step="0.05" oninput="update()" id="exa" /> <br>
    <!-- Checkbox to toggle black & white mode -->
    B&amp;W: <input type="checkbox" onchange="update()" id="bw" /> <br>
  </div>
  <!-- Map container -->
  <div id="map"></div>
  <script>
    // Function to update hillshade layer properties based on UI controls
    const update = function () {
      const bw = document.getElementById('bw').checked;
      const paint = {
        // Get values from sliders and checkbox
        "hillshade-illumination-direction": parseFloat(document.getElementById('dir').value),
        "hillshade-exaggeration": parseFloat(document.getElementById('exa').value),
        // Set colors based on B&W checkbox
        "hillshade-highlight-color": bw ? '#FFFFFF' : 'hsla(141, 35%, 47%, 0.75)',
        "hillshade-shadow-color": bw ? '#000000' : 'hsla(130, 43%, 11%, 0.9)',
        "hillshade-accent-color": bw ? '#000000' : '#dcf193'
      };

      // Apply paint properties to the 'Hillshade' layer
      Object.keys(paint).forEach(function (key) {
        map.setPaintProperty('Hillshade', key, paint[key]);
      });
    };

    const mapId = maptilersdk.MapStyle.OUTDOOR;
    // Set MapTiler API key
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    // Initialize the map
    const map = new maptilersdk.Map({
      container: 'map',
      zoom: 8,
      center: [9.0144, 46.5664],
      style: mapId
    });

    // Update hillshade layer once the map style is loaded
    map.once('styledata', function () {
      update();
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

// Function to update hillshade layer properties based on UI controls
const update = function () {
  const bw = document.getElementById('bw').checked;
  const paint = {
    // Get values from sliders and checkbox
    "hillshade-illumination-direction": parseFloat(document.getElementById('dir').value),
    "hillshade-exaggeration": parseFloat(document.getElementById('exa').value),
    // Set colors based on B&W checkbox
    "hillshade-highlight-color": bw ? '#FFFFFF' : 'hsla(141, 35%, 47%, 0.75)',
    "hillshade-shadow-color": bw ? '#000000' : 'hsla(130, 43%, 11%, 0.9)',
    "hillshade-accent-color": bw ? '#000000' : '#dcf193'
  };

  // Apply paint properties to the 'Hillshade' layer
  Object.keys(paint).forEach(function (key) {
    map.setPaintProperty('Hillshade', key, paint[key]);
  });
};

const mapId = MapStyle.OUTDOOR;
// Set MapTiler API key
config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
// Initialize the map
const map = new Map({
  container: 'map',
  zoom: 8,
  center: [9.0144, 46.5664],
  style: mapId
});

// Update hillshade layer once the map style is loaded
map.once('styledata', function () {
  update();
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
  <title>Create dynamic hillshade</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <!-- Control panel for hillshade options -->
  <div class="map-options">
    Direction: <br>
    <!-- Slider to control illumination direction -->
    <input type="range" min="0" max="359" value="335" oninput="update()" id="dir" /> <br>
    Exaggeration: <br>
    <!-- Slider to control hillshade exaggeration -->
    <input type="range" min="0" max="1" value="0.4" step="0.05" oninput="update()" id="exa" /> <br>
    <!-- Checkbox to toggle black & white mode -->
    B&amp;W: <input type="checkbox" onchange="update()" id="bw" /> <br>
  </div>
  <!-- Map container -->
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

[![Add hillshading](https://docs.maptiler.com/assets/img/example-card.png)**Add hillshading** Example\\
This example adds raster hillshading to a map by adding the MapTiler Terrain-DEM raster tileset as a raster-dem source with a hillshade layer.](https://docs.maptiler.com/sdk-js/examples/hillshade/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)

[![Show raster image on the map](https://docs.maptiler.com/assets/img/example-card.png)**Raster layer** Example\\
This tutorial shows how to add a raster image overlay to the map.](https://docs.maptiler.com/sdk-js/examples/raster-layer/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/dynamic-hillshade/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add dynamic hillshading

Add dynamic hillshading

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)