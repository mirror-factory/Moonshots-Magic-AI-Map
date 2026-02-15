# How to display a map legend control to toggle layers visualization

This tutorial demonstrates the process of presenting a map legend control that allows for the toggling of layer visualization.

By following this guide, users will learn how to display a control panel that showcases the various layers of a map and enables them to easily turn on or off specific layers as needed. This functionality provides a convenient way for users to customize their map viewing experience, allowing them to focus on specific layers of interest while hiding others.

Display a map legend control to toggle layers visualization

xLegend

Only rendered

|     |     |     |
| --- | --- | --- |
|  | ![Airport](<Base64-Image-Removed>) | Airport |
|  |  | Building |
|  |  | Water |
|  |  | Residential |

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/control-legend/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/control-legend/#) in the head of the document via the CDN



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


6. Include the `maplibre-gl-legend` JavaScript and CSS files in the `<head>` of your HTML file. To create the legend we will use the [maplibre-gl-legend](https://github.com/watergis/maplibre-gl-legend) plugin.



```html
<link href='https://www.unpkg.com/@watergis/maplibre-gl-legend@latest/dist/maplibre-gl-legend.css' rel='stylesheet' />
<script src="https://www.unpkg.com/@watergis/maplibre-gl-legend@latest/dist/maplibre-gl-legend.umd.js"></script>
```





HTML



Copy

7. Add event handler for map `load` event. You will add code to create a vector source and a vector layer in this handler.



```js

```





JavaScript



Copy

8. Create the list of layers that we want to show in the legend. For each layer we must create a key:value pair where the key is the ID of the layer in the map style and the value is text that is displayed in the legend.



```js

```





JavaScript



Copy

9. Add the `maplibre-gl-legend` control to the map.



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
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Display a map legend control to toggle layers visualization</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <link href='https://www.unpkg.com/@watergis/maplibre-gl-legend@latest/dist/maplibre-gl-legend.css' rel='stylesheet' />
  <script src="https://www.unpkg.com/@watergis/maplibre-gl-legend@latest/dist/maplibre-gl-legend.umd.js"></script>
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
      });
      map.on('load', () => {
        const targets = {
          Residential: "Residential",
          Water: "Water",
          Building: "Building",
          Airport: "Airport",
          "Other POI": "Pois",
        };
        const options = {
          showDefault: true,
          showCheckbox: true,
          onlyRendered: false,
          reverseOrder: true
        };
        map.addControl(new MaplibreLegendControl.MaplibreLegendControl(targets, options), "bottom-left");
      });

  </script>
</body>
</html>
```

HTML

Copy

## Learn more

Check out the [MapTiler Planet schema](https://docs.maptiler.com/schema/planet/) to know how it is organized into different thematic layers and which attribute and values each layer contains.

Visit the [JavaScript Maps API reference](https://docs.maptiler.com/sdk-js/api/controls/) to learn how to create your custom control.

## Related examples

[![How to display a minimap or overview map control to aid the map navigation](https://docs.maptiler.com/assets/img/example-card.png)**Minimap control** Example\\
This tutorial shows how to display a minimap or overview map control in MapTiler SDK JS to aid the map navigation.](https://docs.maptiler.com/sdk-js/examples/control-minimap/)

[![Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Add elevation profile control** Example\\
The elevation profile control for MapTiler SDK is a super easy way to show the elevation profile of any GeoJSON trace, with elevation data fueled by MapTiler.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/)

[![How to display an interactive choropleth map legend control](https://docs.maptiler.com/assets/img/example-card.png)**Choropleth legend** Example\\
This tutorial shows how to display an interactive choropleth map legend control.](https://docs.maptiler.com/sdk-js/examples/control-legend-choropleth/)

[![Change the default position for attribution](https://docs.maptiler.com/assets/img/example-card.png)**Change attribution default position** Example\\
Place attribution in the top-left position when initializing a map.](https://docs.maptiler.com/sdk-js/examples/attribution-position/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/control-legend/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/control-legend/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to display a map legend control to toggle layers visualization

Legend control

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)