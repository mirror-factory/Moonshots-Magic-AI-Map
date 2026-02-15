# Creates an animated map to fly between different locations

Using SDK JS, this example showcases the ability to navigate between various locations and present the distribution of schools in the United States through a heatmap layer at lower zoom levels. Additionally, a circle layer with a data-driven style is employed to provide more detailed information on school frequencies as the zoom level increases.

Create and style clusters

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Create and style clusters</title>
<script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
<link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
<style>
  body {margin: 0; padding: 0;}
  #map {position: absolute; top: 0; bottom: 0; width: 100%;}
</style>
</head>
<body>
<div id="map"></div>

<script>
  let lastLocationIndex = 0;

  const locations = {
    usa: {zoom: 3.9, center: [-97.04, 38.17]},
    nyc: {zoom: 11.37, center: [-73.9757, 40.7684]},
    boston: {zoom: 11.82, center: [-71.07515, 42.37131]},
    chicago: {zoom: 11.48, center: [-87.6922, 41.8699]},
    houston: {zoom: 11.15, center: [-95.3843, 29.75]},
    sfBay: {zoom: 10.3, center: [-122.3634, 37.6689]},
    seattle: {zoom: 10.62, center: [-122.3241, 47.6127]},
  }

  const locationSequences = [\
    locations.nyc,\
    locations.boston,\
    locations.chicago,\
    locations.usa,\
    locations.seattle,\
    locations.sfBay,\
    locations.houston,\
    locations.usa,\
  ]

  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

  const map = new maptilersdk.Map({
    container: 'map',
    zoom: locationSequences[0].zoom,
    center: locationSequences[0].center,
    style: maptilersdk.MapStyle.DATAVIZ.DARK, //learn more about map styles: https://docs.maptiler.com/sdk-js/api/map-styles/
    geolocateControl: false, //learn more about controls: https://docs.maptiler.com/sdk-js/api/controls/
    hash: true //add zoom, center latitude, center longitude, bearing, and pitch as hash fragment to URL
  });

  function sleepAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function flyToAsync(map, options) {
    return new Promise(function(myResolve, myReject) {
      map.once("moveend", () => {
        myResolve(true);
      });

      map.once("touchstart", () => {
        myResolve(false);
      });

      map.once("mousedown", () => {
        myResolve(false);
      });

      map.flyTo(options);
    });
  }

  async function animateMap() {
    if (!map) return;

    let counter = 0;

    while(true) {
      lastLocationIndex = (lastLocationIndex + counter) % locationSequences.length;
      const reachedEnd = await flyToAsync(map, {
        ...locationSequences[lastLocationIndex],
        speed: 0.7,
      });
      await sleepAsync(850);

      counter ++;
    }
  }

  //add custom data and call animateMap() function
  map.on('load', async () => {
    // add a clustered GeoJSON source for a sample set of earthquakes
    map.addSource('school_source', {
      'type': 'geojson',
      'data': 'https://docs.maptiler.com/sdk-js/assets/Public_School_Characteristics_2020-21_no_prop.geojson',
    });

    map.addLayer({
      id: 'school_heat',
      type: 'heatmap',
      source: 'school_source',
      maxzoom: 14,
      paint: {

        // Increase the heatmap weight based on frequency and property magnitude
        'heatmap-weight': [\
          'interpolate',\
          ['linear'],\
          ['get', 'students'],\
          0,\
          0,\
          20000, // 20k students to reach the max of colormap\
          1\
        ],

        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': [\
          'interpolate',\
          ['linear'],\
          ['zoom'],\
          0,\
          1,\
          12,\
          3\
        ],

        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        'heatmap-color': [\
          'interpolate',\
          ['linear'],\
          ['heatmap-density'],\
          0, "rgba(68, 1, 84, 0)",\
          0.01, "rgba(68, 1, 84, 0.2)",\
          0.13, "rgba(71, 44, 122, 1)",\
          0.25, "rgba(59, 81, 139, 1)",\
          0.38, "rgba(44, 113, 142, 1)",\
          0.5, "rgba(33, 144, 141, 1)",\
          0.63, "rgba(39, 173, 129, 1)",\
          0.75, "rgba(92, 200, 99, 1)",\
          0.88, "rgba(170, 220, 50, 1)",\
          1, "rgba(253, 231, 37, 1)",\
        ],

        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [\
          'interpolate',\
          ['linear'],\
          ['zoom'],\
          0,\
          2,\
          9,\
          20\
        ],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': [\
          'interpolate',\
          ['linear'],\
          ['zoom'],\
          7,\
          1,\
          18,\
          0\
        ]
      }
    });

    map.addLayer({
      'id': 'school_point',
      'type': 'circle',
      'source': 'school_source',
      'minzoom': 8,
      'paint': {
        'circle-pitch-alignment': "map",
        // Size circle radius by earthquake magnitude and zoom level
        'circle-radius': [\
          'interpolate',\
          ['linear'],\
          ['zoom'],\
          9,\
          ['interpolate', ['linear'], ['get', 'students'], 10, 0.1 * 5, 4000, 2 * 2.5],\
          16,\
          ['interpolate', ['linear'], ['get', 'students'], 10, 1 * 5, 4000, 20 * 2.5]\
        ],
        // Color circle by earthquake magnitude
        'circle-color': [\
          'interpolate',\
          ['linear'],\
          ['get', 'students'],\
          2000 * 0, "rgba(68, 1, 84, 0)",\
          2000 * 0.01, "rgba(68, 1, 84, 20)",\
          2000 * 0.13, "rgba(71, 44, 122, 100)",\
          2000 * 0.25, "rgba(59, 81, 139, 100)",\
          2000 * 0.38, "rgba(44, 113, 142, 100)",\
          2000 * 0.5, "rgba(33, 144, 141, 100)",\
          2000 * 0.63, "rgba(39, 173, 129, 100)",\
          2000 * 0.75, "rgba(92, 200, 99, 100)",\
          2000 * 0.88, "rgba(170, 220, 50, 100)",\
          2000 * 1, "rgba(253, 231, 37, 100)",\
        ],
        // 'circle-stroke-color': 'white',
        'circle-stroke-width': 0,
        // Transition from heatmap to circle layer by zoom level
        'circle-opacity': [\
          'interpolate',\
          ['linear'],\
          ['zoom'],\
          8,\
          0,\
          12,\
          0.8\
        ]
      }
    });

    await sleepAsync(1000);
    animateMap(); // call custom animation function that will start animating through the locations
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

let lastLocationIndex = 0;

const locations = {
  usa: {zoom: 3.9, center: [-97.04, 38.17]},
  nyc: {zoom: 11.37, center: [-73.9757, 40.7684]},
  boston: {zoom: 11.82, center: [-71.07515, 42.37131]},
  chicago: {zoom: 11.48, center: [-87.6922, 41.8699]},
  houston: {zoom: 11.15, center: [-95.3843, 29.75]},
  sfBay: {zoom: 10.3, center: [-122.3634, 37.6689]},
  seattle: {zoom: 10.62, center: [-122.3241, 47.6127]},
}

const locationSequences = [\
  locations.nyc,\
  locations.boston,\
  locations.chicago,\
  locations.usa,\
  locations.seattle,\
  locations.sfBay,\
  locations.houston,\
  locations.usa,\
]

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

const map = new Map({
  container: 'map',
  zoom: locationSequences[0].zoom,
  center: locationSequences[0].center,
  style: MapStyle.DATAVIZ.DARK, //learn more about map styles: https://docs.maptiler.com/sdk-js/api/map-styles/
  geolocateControl: false, //learn more about controls: https://docs.maptiler.com/sdk-js/api/controls/
  hash: true //add zoom, center latitude, center longitude, bearing, and pitch as hash fragment to URL
});

function sleepAsync(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function flyToAsync(map, options) {
  return new Promise(function(myResolve, myReject) {
    map.once("moveend", () => {
      myResolve(true);
    });

    map.once("touchstart", () => {
      myResolve(false);
    });

    map.once("mousedown", () => {
      myResolve(false);
    });

    map.flyTo(options);
  });
}

async function animateMap() {
  if (!map) return;

  let counter = 0;

  while(true) {
    lastLocationIndex = (lastLocationIndex + counter) % locationSequences.length;
    const reachedEnd = await flyToAsync(map, {
      ...locationSequences[lastLocationIndex],
      speed: 0.7,
    });
    await sleepAsync(850);

    counter ++;
  }
}

//add custom data and call animateMap() function
map.on('load', async () => {
  // add a clustered GeoJSON source for a sample set of earthquakes
  map.addSource('school_source', {
    'type': 'geojson',
    'data': 'https://docs.maptiler.com/sdk-js/assets/Public_School_Characteristics_2020-21_no_prop.geojson',
  });

  map.addLayer({
    id: 'school_heat',
    type: 'heatmap',
    source: 'school_source',
    maxzoom: 14,
    paint: {

      // Increase the heatmap weight based on frequency and property magnitude
      'heatmap-weight': [\
        'interpolate',\
        ['linear'],\
        ['get', 'students'],\
        0,\
        0,\
        20000, // 20k students to reach the max of colormap\
        1\
      ],

      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        0,\
        1,\
        12,\
        3\
      ],

      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': [\
        'interpolate',\
        ['linear'],\
        ['heatmap-density'],\
        0, "rgba(68, 1, 84, 0)",\
        0.01, "rgba(68, 1, 84, 0.2)",\
        0.13, "rgba(71, 44, 122, 1)",\
        0.25, "rgba(59, 81, 139, 1)",\
        0.38, "rgba(44, 113, 142, 1)",\
        0.5, "rgba(33, 144, 141, 1)",\
        0.63, "rgba(39, 173, 129, 1)",\
        0.75, "rgba(92, 200, 99, 1)",\
        0.88, "rgba(170, 220, 50, 1)",\
        1, "rgba(253, 231, 37, 1)",\
      ],

      // Adjust the heatmap radius by zoom level
      'heatmap-radius': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        0,\
        2,\
        9,\
        20\
      ],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        7,\
        1,\
        18,\
        0\
      ]
    }
  });

  map.addLayer({
    'id': 'school_point',
    'type': 'circle',
    'source': 'school_source',
    'minzoom': 8,
    'paint': {
      'circle-pitch-alignment': "map",
      // Size circle radius by earthquake magnitude and zoom level
      'circle-radius': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        9,\
        ['interpolate', ['linear'], ['get', 'students'], 10, 0.1 * 5, 4000, 2 * 2.5],\
        16,\
        ['interpolate', ['linear'], ['get', 'students'], 10, 1 * 5, 4000, 20 * 2.5]\
      ],
      // Color circle by earthquake magnitude
      'circle-color': [\
        'interpolate',\
        ['linear'],\
        ['get', 'students'],\
        2000 * 0, "rgba(68, 1, 84, 0)",\
        2000 * 0.01, "rgba(68, 1, 84, 20)",\
        2000 * 0.13, "rgba(71, 44, 122, 100)",\
        2000 * 0.25, "rgba(59, 81, 139, 100)",\
        2000 * 0.38, "rgba(44, 113, 142, 100)",\
        2000 * 0.5, "rgba(33, 144, 141, 100)",\
        2000 * 0.63, "rgba(39, 173, 129, 100)",\
        2000 * 0.75, "rgba(92, 200, 99, 100)",\
        2000 * 0.88, "rgba(170, 220, 50, 100)",\
        2000 * 1, "rgba(253, 231, 37, 100)",\
      ],
      // 'circle-stroke-color': 'white',
      'circle-stroke-width': 0,
      // Transition from heatmap to circle layer by zoom level
      'circle-opacity': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        8,\
        0,\
        12,\
        0.8\
      ]
    }
  });

  await sleepAsync(1000);
  animateMap(); // call custom animation function that will start animating through the locations
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
  <title>Create and style clusters</title>
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

[![Display HTML clusters with custom properties](https://docs.maptiler.com/assets/img/example-card.png)**HTML clusters with custom properties** Example\\
Extend clustering with HTML markers and custom property expressions.](https://docs.maptiler.com/sdk-js/examples/cluster-html/)

[![Point layer cluster (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer cluster (point helper)** Example\\
This example shows how to add a point layer cluster to the map using the point layer helper with the default values.](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/)

[![Heatmap layer (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer (heatmap helper)** Example\\
This example shows how to add a heatmap layer to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-minimal/)

[![Fly to a location](https://docs.maptiler.com/assets/img/example-card.png)**Fly to a location** Example\\
Use flyTo to smoothly interpolate between locations.](https://docs.maptiler.com/sdk-js/examples/flyto/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/heatmap-animated/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Creates an animated map to fly between different locations

Creates an animated map to fly between different locations

reCAPTCHA