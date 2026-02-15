# Show the trace position with Elevation profile control

In this step-by-step demonstration, we present a scenario where a marker moves along a specified route on the map. This allows us to synchronize the location of the elevation profile cursor with the marker’s position on the map. This synchronization is made possible through the utilization of the `onMove` event from the elevation profile control for MapTiler SDK.

Elevation profile control

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

01. Install the npm package.



    ```bash
    npm install --save @maptiler/sdk @maptiler/elevation-profile-control
    ```





    Bash



    Copy

02. Create the map style. Add the map style to your stylesheet. The div must have non-zero height.



    ```css
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
    ```





    CSS



    Copy

03. Create a `<div>` element with a certain id where you want your map to be.

    Add `<div>` tag into your page. This div will be the container where the map will be loaded.



    ```html
    <div id="map"></div>
    ```





    HTML



    Copy

04. Include the CSS file.

    If you have a bundler that can handle CSS, you can import the CSS from @maptiler/sdk/dist/maptiler-sdk.css.



    ```js
    import '@maptiler/sdk/dist/maptiler-sdk.css';
    ```





    JavaScript



    Copy






     Including the CSS file using a `<link>` in the head of the document via the CDN is the easiest way.






    ```html
    <link href='https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css' rel='stylesheet' />
    ```





    HTML



    Copy

05. Load the map with the style. Include the following code in your JavaScript.



    ```js
    import { config, Map, helpers, Marker, MapStyle } from '@maptiler/sdk';

    config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new Map({
        container: 'map', // container's id or the HTML element in which SDK will render the map
        style: MapStyle.OUTDOOR,
        center: [0.57705, 42.68311], // starting position [lng, lat]
        zoom: 12.22 // starting zoom
    });
    ```





    JavaScript



    Copy

06. Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

07. Add a GeoJSON trace to the map. Check out the [How to Upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud#PrepareGeoJSONwithattributesforchoroplethmapanduploadGeoJSONtoMapTilerCloud-UploadGeoJSONtoMapTilerCloud) tutorial. Download the [Maupas Peak hiking sample data](https://docs.maptiler.com/sdk-js/assets/my_trace.geojson)



    ```js
    map.on('load', () => {

      helpers.addPolyline(map, {
        data: YOUR_MAPTILER_DATASET_ID_HERE, //from a URL or a MapTiler Data UUID
        lineColor: '#66f',
        lineWidth: 4,
        outline: true,
        outlineWidth: 2
      });

    });
    ```





    JavaScript



    Copy

08. Create a marker and add it to the map.



    ```js
    map.on('load', () => {

      helpers.addPolyline(map, {
        data: YOUR_MAPTILER_DATASET_ID_HERE, //from a URL or a MapTiler Data UUID
        lineColor: '#66f',
        lineWidth: 4,
        outline: true,
        outlineWidth: 2
      });

      const marker = new Marker()
        .setLngLat([0, 0])
        .addTo(map);

    });
    ```





    JavaScript



    Copy

09. Import the MapTiler elevation profile control



    ```js
    import { ElevationProfileControl } from "@maptiler/elevation-profile-control";
    ```





    JavaScript



    Copy

10. Instantiate the control and add it to a `Map` instance, most likely inside a _map_`"load"` event callback



    ```js
    map.on('load', () => {

      helpers.addPolyline(map, {
        data: YOUR_MAPTILER_DATASET_ID_HERE,
        lineColor: '#66f',
        lineWidth: 4,
        outline: true,
        outlineWidth: 2
      });

      const marker = new Marker()
        .setLngLat([0, 0])
        .addTo(map);

      // Create an instance (with the onMove event listener)
      const epc = new ElevationProfileControl({
        onMove: (data) => {
          marker.setLngLat(data.position)
        },
      });

      // Add it to your map
      map.addControl(epc);

      // Add some data (from a URL or a MapTiler Data UUID)
      epc.setData('YOUR_MAPTILER_DATASET_ID_HERE');

    });
    ```





    JavaScript



    Copy


View complete source code

```javascript
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { config, Map, helpers, Marker, MapStyle } from '@maptiler/sdk';
import { ElevationProfileControl } from "@maptiler/elevation-profile-control";

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

const map = new Map({
  container: 'map', // container's id or the HTML element in which SDK will render the map
  center: [0.57705, 42.68311],
  zoom: 12.22,
  style: MapStyle.OUTDOOR
});

map.on('load', () => {

  helpers.addPolyline(map, {
    data: 'YOUR_MAPTILER_DATASET_ID_HERE',
    lineColor: '#66f',
    lineWidth: 4,
    outline: true,
    outlineWidth: 2
  });

  const marker = new Marker()
    .setLngLat([0, 0])
    .addTo(map);

  // Create an instance (with the onMove event listener)
  const epc = new ElevationProfileControl({
    visible: true,
    onMove: (data) => {
      marker.setLngLat(data.position)
    },
  });

  // Add it to your map
  map.addControl(epc);

  // Add some data (from a URL or a MapTiler Data UUID)
  epc.setData('YOUR_MAPTILER_DATASET_ID_HERE');

});
```

JavaScript

Copy

## Learn more

You can also use elevation control via CDN. See the [Elevation profile control](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/) example to use it as a **CDN** instead of an NPM module.

## Related examples

[![Show zoomed section in Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Zoomed section Elevation profile control** Example\\
With the onChangeView event of the elevation profile control for MapTiler SDK, we have access to a GeoJSON LineString corresponding to the zoomed section. This way, we can display the section on top of the full-length route.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-zoomed-section/)

[![Customize Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Customize Elevation profile control** Example\\
The elevation profile control for MapTiler SDK, can be customized in many ways and is compatible with both metric and imperial units. It has many built-in defaults and does not need much to look nice!](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-customized/)

[![Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Add elevation profile control** Example\\
The elevation profile control for MapTiler SDK is a super easy way to show the elevation profile of any GeoJSON trace, with elevation data fueled by MapTiler.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-marker/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-marker/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Show the trace position with Elevation profile control

Show trace position Elevation profile control

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)