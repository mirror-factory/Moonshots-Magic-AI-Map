# Create and style clusters

The following example utilizes the built-in functions of the SDK JS to generate a cluster map of points and visualize them.

Create and style clusters

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

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
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
        container: 'map',
        zoom: 0.3,
        center: [0, 20],
        style: maptilersdk.MapStyle.DATAVIZ.DARK
    });

      map.on('load', function () {
        // add a clustered GeoJSON source for a sample set of earthquakes
        map.addSource('earthquakes', {
          'type': 'geojson',
          'data': 'https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson',
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          paint: {
            // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [\
              'step',\
              ['get', 'point_count'],\
              '#51bbd6',\
              100,\
              '#f1f075',\
              750,\
              '#f28cb1'\
            ],
            'circle-radius': [\
              'step',\
              ['get', 'point_count'],\
              20,\
              100,\
              30,\
              750,\
              40\
            ]
          }
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'earthquakes',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        // inspect a cluster on click
        map.on('click', 'clusters', async function (e) {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          const clusterId = features[0].properties.cluster_id;
          const zoom = await map.getSource('earthquakes').getClusterExpansionZoom(clusterId);
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
          });
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', function (e) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const mag = e.features[0].properties.mag;
          let tsunami;

          if (e.features[0].properties.tsunami === 1) {
            tsunami = 'yes';
          } else {
            tsunami = 'no';
          }

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new maptilersdk.Popup()
            .setLngLat(coordinates)
            .setHTML(
              'magnitude: ' + mag + '<br>Was there a tsunami?: ' + tsunami
            )
            .addTo(map);
        });

        map.on('mouseenter', 'clusters', function () {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function () {
          map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'unclustered-point', function () {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'unclustered-point', function () {
          map.getCanvas().style.cursor = '';
        });
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

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
    container: 'map',
    zoom: 0.3,
    center: [0, 20],
    style: MapStyle.DATAVIZ.DARK
});

  map.on('load', function () {
    // add a clustered GeoJSON source for a sample set of earthquakes
    map.addSource('earthquakes', {
      'type': 'geojson',
      'data': 'https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson',
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'earthquakes',
      filter: ['has', 'point_count'],
      paint: {
        // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [\
          'step',\
          ['get', 'point_count'],\
          '#51bbd6',\
          100,\
          '#f1f075',\
          750,\
          '#f28cb1'\
        ],
        'circle-radius': [\
          'step',\
          ['get', 'point_count'],\
          20,\
          100,\
          30,\
          750,\
          40\
        ]
      }
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'earthquakes',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'earthquakes',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', async function (e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      const clusterId = features[0].properties.cluster_id;
      const zoom = await map.getSource('earthquakes').getClusterExpansionZoom(clusterId);
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom
      });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function (e) {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const mag = e.features[0].properties.mag;
      let tsunami;

      if (e.features[0].properties.tsunami === 1) {
        tsunami = 'yes';
      } else {
        tsunami = 'no';
      }

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new maptilersdk.Popup()
        .setLngLat(coordinates)
        .setHTML(
          'magnitude: ' + mag + '<br>Was there a tsunami?: ' + tsunami
        )
        .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
      map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', 'unclustered-point', function () {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', function () {
      map.getCanvas().style.cursor = '';
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

- [Related examples](https://docs.maptiler.com/sdk-js/examples/cluster/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Create and style clusters

Create and style clusters

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)