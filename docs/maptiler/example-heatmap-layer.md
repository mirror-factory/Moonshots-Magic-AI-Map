# Create a heatmap layer

This example uses SDK JS to visualize the frequency of US schools by location using a heatmap layer.

Create and style clusters

- NPM module
- Basic JavaScript

```html
Loading…
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

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
    container: 'map',
    zoom: 0.3,
    center: [0, 20],
    style: MapStyle.DATAVIZ.DARK
});

map.on('load', function () {
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

[![Point filtering by property](https://docs.maptiler.com/assets/img/example-card.png)**Point filtering by property** Example\\
Filter thousands of features in real time to quickly and easily find those with a property that meets your search criteria.](https://docs.maptiler.com/sdk-js/examples/point-filtering/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/heatmap-layer/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Heatmap layer creation

Heatmap layer

reCAPTCHA