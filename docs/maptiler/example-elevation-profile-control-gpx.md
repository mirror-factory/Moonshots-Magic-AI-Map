# How to display GPX track elevation profile

The elevation profile control for MapTiler SDK is a super easy way to show the elevation profile of any GPX (GPS) trace or GeoJSON. By utilizing elevation data from MapTiler, this feature allows you to effortlessly showcase the elevation profile of your hiking routes, bicycle routes, trail runs, and more.

Following this step-by-step example, you can easily view the profile of various activities.

Elevation profile control

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

**Drag and drop** a GPX file onto the map to view your track profile.

01. Install the npm package.



    ```bash
    npm install --save @maptiler/sdk @maptiler/elevation-profile-control
    ```





    Bash



    Copy

02. Create the map style. Add the map style to your stylesheet. The div must have a non-zero height.



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

04. Create a `<div>` element with a certain id where you want your control to be.

    Add `<div>` tag into your page. This div will be the container where the control will be loaded.



    ```html
    <div id="profileContainer"></div>
    ```





    HTML



    Copy

05. Include the CSS file.

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

06. Load the map with the style. Include the following code in your JavaScript.



    ```js
    import { config, Map, helpers, MapStyle } from '@maptiler/sdk';

    config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new Map({
        container: 'map', // container's id or the HTML element in which SDK will render the map
        style: MapStyle.OUTDOOR,
        center: [7.6011, 45.9078], // starting position [lng, lat]
        zoom: 11.39 // starting zoom
    });
    ```





    JavaScript



    Copy

07. Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

08. We are going to define some variables that we will use later in the tutorial.



    ```js
    let polyline, epc, marker;
    ```





    JavaScript



    Copy

09. Add a GPX trace to the map. You can use a GPX directly from a URL or upload your GPX to the MapTiler. Check out the [How to edit your data in MapTiler](https://docs.maptiler.com/guides/map-tiling-hosting/data-hosting/how-to-edit-your-vector-data-in-maptiler-cloud) tutorial. Download the [Cervinia Valtournenche mountain bike sample data](https://docs.maptiler.com/sdk-js/assets/cervinia-valtournenche.gpx)



    ```js
    map.on('load', async () => {

      polyline = await helpers.addPolyline(map, {
        data: 'https://docs.maptiler.com/sdk-js/assets/cervinia-valtournenche.gpx', //from a URL or a MapTiler Data UUID
        lineColor: '#66f',
        lineWidth: 4,
        outline: true,
        outlineWidth: 2
      });

    });
    ```





    JavaScript



    Copy

10. Add the `Marker` object to the `@maptiler/sdk` import.



    ```js
    import { config, Map, helpers, MapStyle, Marker } from '@maptiler/sdk';
    ```





    JavaScript



    Copy

11. Create a marker and add it to the map. We will use this marker to display the location of the elevation profile cursor with the position of the marker on the map.



    ```js
    map.on('load', async () => {

      polyline = await helpers.addPolyline(map, {
        data: 'https://docs.maptiler.com/sdk-js/assets/cervinia-valtournenche.gpx', //from a URL or a MapTiler Data UUID
        lineColor: '#66f',
        lineWidth: 4,
        outline: true,
        outlineWidth: 2
      });

      marker = new Marker()
        .setLngLat([0, 0])
        .addTo(map);

    });
    ```





    JavaScript



    Copy

12. Import the MapTiler elevation profile control



    ```js
    import { ElevationProfileControl } from "@maptiler/elevation-profile-control";
    ```





    JavaScript



    Copy

13. Instantiate the control and add it to a `Map` instance, most likely inside a _map_`"load"` event callback



    ```js
    map.on('load', async () => {

      polyline = await helpers.addPolyline(map, {
        data: 'https://docs.maptiler.com/sdk-js/assets/cervinia-valtournenche.gpx', //from a URL or a MapTiler Data UUID
        lineColor: '#66f',
        lineWidth: 4,
        outline: true,
        outlineWidth: 2
      });

      marker = new Marker()
        .setLngLat([0, 0])
        .addTo(map);

      // Create an instance
      epc = new ElevationProfileControl({
        container: "profileContainer",
        visible: true,
        showButton: false,
        profileLineColor: "#66f",
        profileBackgroundColor: "#a103fc11",
        displayTooltip: true,
        onMove: (data) => {
          marker.setLngLat(data.position)
        },
      });

      // Add it to your map
      map.addControl(epc);

      // Add some data (from a URL or a MapTiler Data UUID)
      const sourceObject = map.getSource(polyline.polylineSourceId);
      epc.setData(sourceObject._data);

      moveMarkerToGPXStart(sourceObject._data);

    });
    ```





    JavaScript



    Copy

14. Move the Marker to the GPX start point



    ```js
    function moveMarkerToGPXStart(data) {
      marker.setLngLat(data.features[0].geometry.coordinates[0])
    }
    ```





    JavaScript



    Copy

15. Let’s add some styling to the profile control to see the track profile on the map along with your GPS track.



    ```css
    #profileContainer {
      background:#fff;
      width: 50vw;
      height: 200px;
      margin-top: 20px;
      position: absolute;
      bottom: 10px;
      opacity: 0.9;
    }
    ```





    CSS



    Copy

16. With these steps, you have your map where the GPX track is shown with its elevation profile. In the following steps, we will see how to add the functionality of dragging and dropping a GPX file on the map to view the new track along with its profile.

17. Use the [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) to drag a file onto our map.



    ```js
    document.getElementById('map').addEventListener('drop', function(ev) {
      ev.preventDefault();

      if (ev.dataTransfer.files) {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file, i) => {
          readGPXFile(file);
        });
      } else {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            const file = item.getAsFile();
            readGPXFile(file);
          }
        });
      }
    });
    document.getElementById('map').addEventListener('dragover', function(ev) {
      ev.preventDefault();
    });
    ```





    JavaScript



    Copy

18. Add the `gpx` function and the `LngLatBounds` object to the `@maptiler/sdk` import.



    ```js
    import { config, Map, helpers, MapStyle, Marker, gpx, LngLatBounds } from '@maptiler/sdk';
    ```





    JavaScript



    Copy

19. Read the GPX file data. To read the content of the file in the browser without having to upload it to any server, we will use the [FileReader object](https://developer.mozilla.org/en-US/docs/Web/API/FileReader).



    ```js
    function readGPXFile(file){
      if (file.name.split('.').pop().toLowerCase() !== 'gpx') {
        return;
      }
      const reader = new FileReader();
      reader.onload = function (event) {
        const sourceObject = map.getSource(polyline.polylineSourceId);
        sourceObject.setData(gpx(event.target.result));

        epc.setData(sourceObject._data);
        fitToDataBounds(sourceObject._data);
      };
      reader.readAsText(file, 'UTF-8');
    }
    ```





    JavaScript



    Copy

20. Adjust the map view to the newly loaded track and move the marker to the track start point.



    ```js
    function fitToDataBounds(data) {
      // Geographic coordinates of the LineString
      const coordinates = data.features[0].geometry.coordinates;

      // Pass the first coordinates in the LineString to `lngLatBounds` &
      // wrap each coordinate pair in `extend` to include them in the bounds
      // result. A variation of this technique could be applied to zooming
      // to the bounds of multiple Points or Polygon geomteries - it just
      // requires wrapping all the coordinates with the extend method.
      const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord);
      }, new LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, {
        padding: 20
      });
      moveMarkerToGPXStart(data);
    }
    ```





    JavaScript



    Copy


View complete source code

```javascript
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { config, Map, helpers, MapStyle, Marker, gpx, LngLatBounds } from '@maptiler/sdk';
import { ElevationProfileControl } from "@maptiler/elevation-profile-control";

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

let polyline, epc, marker;

const map = new Map({
  container: 'map', // container's id or the HTML element in which SDK will render the map
  center: [7.6011,45.9078], // starting position [lng, lat]
  zoom: 11.39, // starting zoom
  style: MapStyle.OUTDOOR
});

map.on('load', async () => {

  polyline = await helpers.addPolyline(map, {
    data: 'YOUR_MAPTILER_DATASET_ID_HERE',
    lineColor: '#66f',
    lineWidth: 4,
    outline: true,
    outlineWidth: 2
  });

  marker = new Marker()
    .setLngLat([0, 0])
    .addTo(map);

  // Create an instance (with no options)
  epc = new ElevationProfileControl({
    container: "profileContainer",
    visible: true,
    showButton: false,
    profileLineColor: "#66f",
    profileBackgroundColor: "#a103fc11",
    displayTooltip: true,
    onMove: (data) => {
      marker.setLngLat(data.position)
    },
  });

  // Add it to your map
  map.addControl(epc);

  // Add some data (from a URL or a MapTiler Data UUID)
  const sourceObject = map.getSource(polyline.polylineSourceId);
  epc.setData(sourceObject._data);

  moveMarkerToGPXStart(sourceObject._data);

});

function fitToDataBounds(data) {
  // Geographic coordinates of the LineString
  const coordinates = data.features[0].geometry.coordinates;

  // Pass the first coordinates in the LineString to `lngLatBounds` &
  // wrap each coordinate pair in `extend` to include them in the bounds
  // result. A variation of this technique could be applied to zooming
  // to the bounds of multiple Points or Polygon geomteries - it just
  // requires wrapping all the coordinates with the extend method.
  const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord);
  }, new LngLatBounds(coordinates[0], coordinates[0]));

  map.fitBounds(bounds, {
    padding: 20
  });
  moveMarkerToGPXStart(data);
}

function moveMarkerToGPXStart(data) {
  marker.setLngLat(data.features[0].geometry.coordinates[0])
}

function readGPXFile(file){
  if (file.name.split('.').pop().toLowerCase() !== 'gpx') {
    return;
  }
  const reader = new FileReader();
  reader.onload = function (event) {
    const sourceObject = map.getSource(polyline.polylineSourceId);
    sourceObject.setData(gpx(event.target.result));

    epc.setData(sourceObject._data);
    fitToDataBounds(sourceObject._data);
  };
  reader.readAsText(file, 'UTF-8');
}
```

JavaScript

Copy

## Learn more

You can also use elevation control via CDN. See the [Elevation profile control](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-simple/) example to use it as a **CDN** instead of an NPM module.

## Related examples

[![Add a GPX Line layer (polyline helper)](https://docs.maptiler.com/assets/img/example-card.png)**Add a GPX Line layer (polyline helper)** Example\\
This example shows how to add and a GPX line layer to the map using the polyline layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polyline-gpx/)

[![Show the trace position with Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Show trace position Elevation profile control** Example\\
With the onMove event of the elevation profile control for MapTiler SDK, we can show a marker moving on top of the trace on the map. This way, we can synchronize the position of the elevation profile cursor with the position of the map.](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-marker/)

[![Customize Elevation profile control](https://docs.maptiler.com/assets/img/example-card.png)**Customize Elevation profile control** Example\\
The elevation profile control for MapTiler SDK, can be customized in many ways and is compatible with both metric and imperial units. It has many built-in defaults and does not need much to look nice!](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-customized/)

[![Display a 3D terrain map](https://docs.maptiler.com/assets/img/example-card.png)**3D terrain map** Example\\
This tutorial demonstrates how to create a 3D terrain map and display it on a web page using MapTiler.](https://docs.maptiler.com/sdk-js/examples/3d-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-gpx/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/elevation-profile-control-gpx/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Elevation profile from GPX tracks: how to display it

GPX elevation profile

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)