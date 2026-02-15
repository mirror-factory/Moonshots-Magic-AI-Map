# Display a 3D terrain map

This tutorial demonstrates how to create a 3D (three-dimensional) terrain map and display it on a web page using MapTiler.

Enhance the authenticity of your applications and data by incorporating terrain relief into your maps. This will provide a greater sense of realism and depth to your visuals.

Display a 3D Map

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

1. Copy the following code, paste it into your favorite text editor, and save it as a `.html` file.



```html

```





HTML



Copy


1. Install the npm package.



```bash
npm install --save @maptiler/sdk
```





Bash



Copy

2. Include the CSS file.

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/3d-map/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/3d-map/#) in the head of the document via the CDN



```js
import "@maptiler/sdk/dist/maptiler-sdk.css";
```





JavaScript



Copy







```html
<link href='https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css' rel='stylesheet' />
```





HTML



Copy

3. Include the following code in your JavaScript file (Example: app.js).



```js

```





JavaScript



Copy


4. Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

5. The next is up to you. You can center your map wherever you desire (modifying the `starting position`) and set an appropriate zoom level (modifying the `starting zoom`) to match your users’ needs. Additionally, you can change the map’s look (by updating the `source URL`); choose from a range of visually appealing map styles from our extensive [MapTiler standard maps](https://cloud.maptiler.com/maps/), or create your own to truly differentiate your application.


6. Add options to the map to load the terrain elevation to the map.



```js

```





JavaScript



Copy

7. Add options to the map to load the terrain control to the map. The `terrainControl` shows a button to enable/disable the 3D terrain (does not tilt the map).



```js

```





JavaScript



Copy

8. Add options to the map to load the map with a 3D view.



```js

```





JavaScript



Copy


View complete source code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Display a 3D Map</title>
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
        style: maptilersdk.MapStyle.OUTDOOR,
        center: [8.94738, 45.97812], // starting position [lng, lat]
        zoom: 14, // starting zoom
        pitch: 70,
        bearing: -100.86,
        maxPitch: 85,
        maxZoom: 14,
        terrain: true,
        terrainControl: true
      });
  </script>
</body>
</html>
```

HTML

Copy

## Related examples

[![Ocean bathymetry 3D](https://docs.maptiler.com/assets/img/example-card.png)**Ocean bathymetry 3D** Example\\
Show a detailed 3D map of the ocean seafloor and bathymetry.](https://docs.maptiler.com/sdk-js/examples/ocean-bathymetry/)

[![Getting started with AR maps: Display an AR control on your maps](https://docs.maptiler.com/assets/img/example-card.png)**Start with AR maps** Example\\
Getting started with AR maps: The Augmented reality (AR) control adds a button on your map to create a 3D model of the viewport, including 3D terrain and any layer you have put on top. Compatible with WebXR or Apple Quick Look.](https://docs.maptiler.com/sdk-js/examples/ar-control/)

[![Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Add elevation profile control** Example\\
The elevation profile control for MapTiler SDK is a super easy way to show the elevation profile of any GeoJSON trace, with elevation data fueled by MapTiler.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/)

[![Enable/disable map terrain](https://docs.maptiler.com/assets/img/example-card.png)**Enable/disable map terrain\** Example\\
This tutorial demonstrates how to enable/disable the 3D terrain map programmatically using SDK functions.](https://docs.maptiler.com/sdk-js/examples/map-terrain/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/3d-map/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Terrain 3D map

Terrain 3D map

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)