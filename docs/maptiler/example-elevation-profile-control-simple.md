# Elevation profile control

The [Elevation Profile control](https://docs.maptiler.com/sdk-js/modules/elevation-profile/) for MapTiler SDK is a super easy way to show the elevation profile of any GeoJSON or GPX (GPS) trace. By utilizing elevation data from MapTiler, this feature allows you to effortlessly showcase the elevation profile of your selected data source.

Following this step-by-step example, you can easily view the profile of various activities such as hiking routes, bicycle routes, trail runs, and more.

Elevation profile control

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/#) in the head of the document via the CDN



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


1. Include the MapTiler Elevation profile control JS file in the `<head>` of your HTML file.



```html

```





HTML



Copy

2. Add a GeoJSON trace to the map. Check out the [How to Upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud#PrepareGeoJSONwithattributesforchoroplethmapanduploadGeoJSONtoMapTilerCloud-UploadGeoJSONtoMapTilerCloud) tutorial. Download the [Maupas Peak hiking sample data](https://docs.maptiler.com/sdk-js/assets/my_trace.geojson)



```js

```





JavaScript



Copy

3. Instantiate the control and add it to a `Map` instance, most likely inside a _map_`"ready"` event callback



```js

```





JavaScript



Copy


View complete source code

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Display a map</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <script src="https://cdn.maptiler.com/maptiler-elevation-profile-control/v3.0.1/maptiler-elevation-profile-control.umd.min.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>

<body>
  <div id="map"></div>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.OUTDOOR,
      center: [0.57705, 42.68311], // starting position [lng, lat]
      zoom: 12.22, // starting zoom
    });

    map.on('ready', () => {
      maptilersdk.helpers.addPolyline(map, {
        data: 'YOUR_MAPTILER_DATASET_ID_HERE', //from a URL or a MapTiler Data UUID
        lineColor: '#66f',
        lineWidth: 4,
        outline: true,
        outlineWidth: 2
      });

      // Create an instance
      const epc = new maptilerelevationprofilecontrol.ElevationProfileControl({
        visible: true
      });

      // Add it to your map
      map.addControl(epc);

      // Add some data (from a URL or a MapTiler Data UUID)
      epc.setData('YOUR_MAPTILER_DATASET_ID_HERE');
    });
  </script>
</body>

</html>
```

HTML

Copy

6. Install the elevation-profile-control npm package.



```bash
npm install --save @maptiler/elevation-profile-control
```





Bash



Copy

7. Import the MapTiler elevation profile control


```js

```

JavaScript

Copy

8. Instantiate the control and add it to a `Map` instance, most likely inside a _map_`"ready"` event callback



```js

```





JavaScript



Copy


View complete source code

```bash
npm install --save @maptiler/sdk @maptiler/elevation-profile-control
```

Bash

Copy

main.js

```javascript
import { Map, MapStyle, config, helpers } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { ElevationProfileControl } from '@maptiler/elevation-profile-control';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: MapStyle.OUTDOOR,
  center: [0.57705, 42.68311], // starting position [lng, lat]
  zoom: 12.22, // starting zoom
});

map.on('ready', () => {
  helpers.addPolyline(map, {
    data: 'YOUR_MAPTILER_DATASET_ID_HERE', //from a URL or a MapTiler Data UUID
    lineColor: '#66f',
    lineWidth: 4,
    outline: true,
    outlineWidth: 2
  });

  // Create an instance
  const epc = new ElevationProfileControl({
    visible: true
  });

  // Add it to your map
  map.addControl(epc);

  // Add some data (from a URL or a MapTiler Data UUID)
  epc.setData('YOUR_MAPTILER_DATASET_ID_HERE');
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
  <title>Display a map</title>
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

You can also use elevation control via npm. See the [How to display GPX track elevation profile](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-gpx/) example to use it as an **npm module** instead of from a CDN.

## Related examples

[![Show zoomed section in Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Zoomed section Elevation profile control** Example\\
With the onChangeView event of the elevation profile control for MapTiler SDK, we have access to a GeoJSON LineString corresponding to the zoomed section. This way, we can display the section on top of the full-length route.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-zoomed-section/)

[![Show the trace position with Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Show trace position Elevation profile control** Example\\
With the onMove event of the elevation profile control for MapTiler SDK, we can show a marker moving on top of the trace on the map. This way, we can synchronize the position of the elevation profile cursor with the position of the map.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-marker/)

[![Customize Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Customize Elevation profile control** Example\\
The elevation profile control for MapTiler SDK, can be customized in many ways and is compatible with both metric and imperial units. It has many built-in defaults and does not need much to look nice!](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-customized/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Elevation profile control

Add elevation profile control

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)