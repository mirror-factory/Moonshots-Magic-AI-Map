# 3D globe with custom marker overlays

Create custom non-colliding marker overlays on your 3D globe map using the [Marker Layout](https://docs.maptiler.com/sdk-js/modules/marker-layout/) on top of [MapTiler SDK JS](https://www.maptiler.com/sdk-javascript/).

This example shows how to display the information from the city and town label layers. In this example, we are using the `filter` function to only create markers in features of type `"country"`, `"city"`, `"village"` or `"town"`.

MapTiler Globe projection

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Chile


- **Name:** Chile
- **Class:** country
- **Rank:** 1

Peru


- **Name:** Perú
- **Class:** country
- **Rank:** 1

Spain


- **Name:** España
- **Class:** country
- **Rank:** 1

United States


- **Name:** United States of America
- **Class:** country
- **Rank:** 1

Sierra Leone


- **Name:** Sierra Leone
- **Class:** country
- **Rank:** 2

- NPM module
- Basic JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MapTiler Globe projection</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <!-- Importing MapTiler Marker Layout -->
  <script src="https://cdn.maptiler.com/maptiler-marker-layout/v2.0.1/maptiler-marker-layout.umd.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 5px;
    }

    #map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }

    .marker {
      position: absolute;
      pointer-events: none;
      color: #000;
      line-height: 12px;
      box-shadow: #00000040 0px 2px 10px;
    }

    .markerPointy {
      width: 12px;
      height: 12px;
      background-color: #e6e6e6;
      position: absolute;
      transform: rotate(45deg) translate(-70%);
      bottom: -12px;
      left: 0;
      right: -12px;
      margin: auto;
      box-shadow: #00000040 0px 2px 10px;
    }

    .markerBody {
      position: absolute;
      background: #e6e6e6;
      width: 100%;
      height: 100%;
      top: 0;
      border-radius: 2px;
    }

    .markerTop {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
      width: 100%;
      height: 20px;
      line-height: 20px;
      text-align: center;
      background: #4d4d4d;
      color: white;
      font-size: 15px;
      font-weight: 400;
    }

    .markerBottom {
      border-radius: inherit;
      width: 100%;
      height: calc(100% - 20px);
      display: flex;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .fade-in-animation {
      animation: fadeIn 0.5s ease forwards;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const appContainer = document.getElementById('map');
    const map = new maptilersdk.Map({
      container: appContainer, // container's id or the HTML element to render the map
      style:  maptilersdk.MapStyle.STREETS,
      center: [-70.8, 0], // starting position [lng, lat]
      zoom: 1.5, // starting zoom
      projection: 'globe' //enable globe projection
    });

    // Creating the div that will contain all the markers
    const markerContainer = document.createElement("div");
    appContainer.appendChild(markerContainer);

    (async () => {
      await map.onReadyAsync();

      const markerManager = new maptilermarkerlayout.MarkerLayout(map, {
        layers: ["Country labels", "Capital city labels", "City labels", "Place labels", "Town labels"],
        markerSize: [140, 80],
        markerAnchor: "top",
        offset: [0, -8], // so that the tip of the marker bottom pin lands on the city dot
        sortingProperty: "rank",

        // With `sortingProperty` option as a function, the following is equivalent to the above
        // sortingProperty: (feature) => {
        //   return feature.properties.rank;
        // },

        filter: ((feature) => {
          console.log(feature.properties);
          return ["country", "city", "village", "town"].includes(feature.properties.class)
        })
      });

      // This object contains the marker DIV so that they can be updated rather than fully recreated every time
      const markerLogicContainer = {};

      // This function will be used as the callback for some map events
      const updateMarkers = () => {
        const markerStatus = markerManager.update();

        if (!markerStatus) return;

        // Remove the div that corresponds to removed markers
        markerStatus.removed.forEach((abstractMarker) => {
          const markerDiv = markerLogicContainer[abstractMarker.id];
          delete markerLogicContainer[abstractMarker.id];
          markerContainer.removeChild(markerDiv);
        });

        // Update the div that corresponds to updated markers
        markerStatus.updated.forEach((abstractMarker) => {
          const markerDiv = markerLogicContainer[abstractMarker.id];
          updateMarkerDiv(abstractMarker, markerDiv);
        });

        // Create the div that corresponds to the new markers
        markerStatus.new.forEach((abstractMarker) => {
          const markerDiv = makeMarker(abstractMarker);
          markerLogicContainer[abstractMarker.id] = markerDiv;
          markerContainer.appendChild(markerDiv);
        });
      }

      // The "idle" event is triggered every second because of the particle layer being refreshed,
      // even though their is no new data loaded, so this approach proved to be the best for this scenario
      map.on("move", updateMarkers);

      map.on("moveend", () => {
        map.once("idle", updateMarkers);
      })

      updateMarkers();
    })()

    function makeMarker(abstractMarker) {

      const marker = document.createElement("div");
      marker.classList.add("marker");
      marker.classList.add('fade-in-animation');
      marker.style.setProperty("width", `${abstractMarker.size[0]}px`);
      marker.style.setProperty("height", `${abstractMarker.size[1]}px`);
      marker.style.setProperty("transform", `translate(${abstractMarker.position[0]}px, ${abstractMarker.position[1]}px)`);

      const feature = abstractMarker.features[0];

      marker.innerHTML = `
        <div class="markerPointy"></div>
        <div class="markerBody">

          <div class="markerTop">
            ${feature.properties["name:en"] || feature.properties["name"]}
          </div>

          <div class="markerBottom">
            <ul>
              <li><b>Name:</b> ${feature.properties.name}</li>
              <li><b>Class:</b> ${feature.properties.class}</li>
              <li><b>Rank:</b> ${feature.properties.rank}</li>
            </ul>
          </div>
        </div>
      `
      return marker;
    }

    function updateMarkerDiv(abstractMarker, marker) {
      marker.style.setProperty("width", `${abstractMarker.size[0]}px`);
      marker.style.setProperty("height", `${abstractMarker.size[1]}px`);
      marker.style.setProperty("transform", `translate(${abstractMarker.position[0]}px, ${abstractMarker.position[1]}px)`);
    }
  </script>
</body>
</html>
```

HTML

Copy

```bash
npm install --save @maptiler/sdk @maptiler/marker-layout
```

Bash

Copy

main.js

```javascript
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { MarkerLayout } from '@maptiler/marker-layout';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const appContainer = document.getElementById('map');
const map = new Map({
  container: appContainer, // container's id or the HTML element to render the map
  style:  MapStyle.STREETS,
  center: [-70.8, 0], // starting position [lng, lat]
  zoom: 1.5, // starting zoom
  projection: 'globe' //enable globe projection
});

// Creating the div that will contain all the markers
const markerContainer = document.createElement("div");
appContainer.appendChild(markerContainer);

(async () => {
  await map.onReadyAsync();

  const markerManager = new MarkerLayout(map, {
    layers: ["Country labels", "Capital city labels", "City labels", "Place labels", "Town labels"],
    markerSize: [140, 80],
    markerAnchor: "top",
    offset: [0, -8], // so that the tip of the marker bottom pin lands on the city dot
    sortingProperty: "rank",

    // With `sortingProperty` option as a function, the following is equivalent to the above
    // sortingProperty: (feature) => {
    //   return feature.properties.rank;
    // },

    filter: ((feature) => {
      console.log(feature.properties);
      return ["country", "city", "village", "town"].includes(feature.properties.class)
    })
  });

  // This object contains the marker DIV so that they can be updated rather than fully recreated every time
  const markerLogicContainer = {};

  // This function will be used as the callback for some map events
  const updateMarkers = () => {
    const markerStatus = markerManager.update();

    if (!markerStatus) return;

    // Remove the div that corresponds to removed markers
    markerStatus.removed.forEach((abstractMarker) => {
      const markerDiv = markerLogicContainer[abstractMarker.id];
      delete markerLogicContainer[abstractMarker.id];
      markerContainer.removeChild(markerDiv);
    });

    // Update the div that corresponds to updated markers
    markerStatus.updated.forEach((abstractMarker) => {
      const markerDiv = markerLogicContainer[abstractMarker.id];
      updateMarkerDiv(abstractMarker, markerDiv);
    });

    // Create the div that corresponds to the new markers
    markerStatus.new.forEach((abstractMarker) => {
      const markerDiv = makeMarker(abstractMarker);
      markerLogicContainer[abstractMarker.id] = markerDiv;
      markerContainer.appendChild(markerDiv);
    });
  }

  // The "idle" event is triggered every second because of the particle layer being refreshed,
  // even though their is no new data loaded, so this approach proved to be the best for this scenario
  map.on("move", updateMarkers);

  map.on("moveend", () => {
    map.once("idle", updateMarkers);
  })

  updateMarkers();
})()

function makeMarker(abstractMarker) {

  const marker = document.createElement("div");
  marker.classList.add("marker");
  marker.classList.add('fade-in-animation');
  marker.style.setProperty("width", `${abstractMarker.size[0]}px`);
  marker.style.setProperty("height", `${abstractMarker.size[1]}px`);
  marker.style.setProperty("transform", `translate(${abstractMarker.position[0]}px, ${abstractMarker.position[1]}px)`);

  const feature = abstractMarker.features[0];

  marker.innerHTML = `
    <div class="markerPointy"></div>
    <div class="markerBody">

      <div class="markerTop">
        ${feature.properties["name:en"] || feature.properties["name"]}
      </div>

      <div class="markerBottom">
        <ul>
          <li><b>Name:</b> ${feature.properties.name}</li>
          <li><b>Class:</b> ${feature.properties.class}</li>
          <li><b>Rank:</b> ${feature.properties.rank}</li>
        </ul>
      </div>
    </div>
  `
  return marker;
}

function updateMarkerDiv(abstractMarker, marker) {
  marker.style.setProperty("width", `${abstractMarker.size[0]}px`);
  marker.style.setProperty("height", `${abstractMarker.size[1]}px`);
  marker.style.setProperty("transform", `translate(${abstractMarker.position[0]}px, ${abstractMarker.position[1]}px)`);
}
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MapTiler Globe projection</title>
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

[![Projection control how to toggle the map between mercator and globe projection](https://docs.maptiler.com/assets/img/example-card.png)**Projection control (globe)** Example\\
This tutorial shows how to add the projection control that toggles the map between "mercator" and "globe" projection.](https://docs.maptiler.com/sdk-js/examples/globe-control/)

[![Add a 3D model to globe using MapTiler 3D JS](https://docs.maptiler.com/assets/img/example-card.png)**Add a 3D model to globe using MapTiler 3D JS** Example\\
Add a 3D model to globe using MapTiler 3D JS module.](https://docs.maptiler.com/sdk-js/examples/globe-3d-model/)

[![How to create non-colliding marker overlays](https://docs.maptiler.com/assets/img/example-card.png)**Filtered Marker Layout** Example\\
Create non-colliding marker overlays to display the information from the city and town label layers.](https://docs.maptiler.com/sdk-js/examples/marker-layout-basic/)

[![Weather map with custom icons, animated SVGs or Lotties via Marker Layout](https://docs.maptiler.com/assets/img/example-card.png)**Weather icons Marker Layout** Example\\
Create a weather map using the Marker Layout to show your custom weather markers icons, animated SVGs or Lotties.](https://docs.maptiler.com/sdk-js/examples/marker-layout-weather/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/globe-marker-layout/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


3D globe with custom marker overlays

3D globe with custom marker overlays

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)