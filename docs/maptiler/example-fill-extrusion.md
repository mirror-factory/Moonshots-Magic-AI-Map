# Create a 3D choropleth map of Europe with countries extruded

This map of Europe presents a 3D choropleth map representation, where countries are visually extruded based on data provided by an external dataset. The fill-extrusion-height paint property is employed to assign data-driven values to the polygons of different countries within the fill-extrusion layer.

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
        zoom: 3,
        center: [19.43, 49.49],
        pitch: 60,
        style: maptilersdk.MapStyle.BASIC,
        hash: false
    });

      map.on('load', function () {
        map.addSource('countries', {
          'type': 'geojson',
          'data': 'https://docs.maptiler.com/sdk-js/assets/Mean_age_of_women_at_first_marriage_in_2019.geojson',
        });

        map.addLayer(
          {
            'id': 'eu-countries',
            'source': 'countries',
            'type': 'fill-extrusion',
            'paint': {
              'fill-extrusion-color': [\
                'interpolate',\
                ['linear'],\
                ['get', 'age'],\
                23.0,\
                '#fff5eb',\
                24.0,\
                '#fee6ce',\
                25.0,\
                '#fdd0a2',\
                26.0,\
                '#fdae6b',\
                27.0,\
                '#fd8d3c',\
                28.0,\
                '#f16913',\
                29.0,\
                '#d94801',\
                30.0,\
                '#8c2d04'\
              ],
              'fill-extrusion-opacity': 1,
              'fill-extrusion-height': ['*', ['get', 'age'], 5000]
            }
          }, 'Airport labels'
        );

        //Hide country borders for better visualization
        map.setLayoutProperty('Other border', 'visibility', 'none');
        map.setLayoutProperty('Disputed border', 'visibility', 'none');
        map.setLayoutProperty('Country border', 'visibility', 'none');

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
    zoom: 3,
    center: [19.43, 49.49],
    pitch: 60,
    style: MapStyle.BASIC,
    hash: false
});

  map.on('load', function () {
    map.addSource('countries', {
      'type': 'geojson',
      'data': 'https://docs.maptiler.com/sdk-js/assets/Mean_age_of_women_at_first_marriage_in_2019.geojson',
    });

    map.addLayer(
      {
        'id': 'eu-countries',
        'source': 'countries',
        'type': 'fill-extrusion',
        'paint': {
          'fill-extrusion-color': [\
            'interpolate',\
            ['linear'],\
            ['get', 'age'],\
            23.0,\
            '#fff5eb',\
            24.0,\
            '#fee6ce',\
            25.0,\
            '#fdd0a2',\
            26.0,\
            '#fdae6b',\
            27.0,\
            '#fd8d3c',\
            28.0,\
            '#f16913',\
            29.0,\
            '#d94801',\
            30.0,\
            '#8c2d04'\
          ],
          'fill-extrusion-opacity': 1,
          'fill-extrusion-height': ['*', ['get', 'age'], 5000]
        }
      }, 'Airport labels'
    );

    //Hide country borders for better visualization
    map.setLayoutProperty('Other border', 'visibility', 'none');
    map.setLayoutProperty('Disputed border', 'visibility', 'none');
    map.setLayoutProperty('Country border', 'visibility', 'none');

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

[![Polygon layer (polygon helper)](https://docs.maptiler.com/assets/img/example-card.png)**Polygon layer (polygon helper)** Example\\
This example shows how to add a polygon layer to the map using the polygon layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polygon-minimal/)

[![How to create a choropleth Map from GeoJSON](https://docs.maptiler.com/assets/img/example-card.png)**Choropleth GeoJSON** Example\\
This tutorial shows how to add a styled GeoJSON overlay to the map, display a popup on click, and create a map legend.](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/)

[![How to display an interactive choropleth map legend control](https://docs.maptiler.com/assets/img/example-card.png)**Choropleth legend** Example\\
This tutorial shows how to display an interactive choropleth map legend control.](https://docs.maptiler.com/sdk-js/examples/control-legend-choropleth/)

[![Show multiGeometry data from GeoJSON on the map](https://docs.maptiler.com/assets/img/example-card.png)**GeoJSON multiGeometry layer** Example\\
This tutorial shows how to add a GeoJSON MultiGeometry overlay to the map.](https://docs.maptiler.com/sdk-js/examples/geojson-multigeometry/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/fill-extrusion/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Create a 3D choropleth map of Europe with countries extruded

Create a 3D choropleth map of Europe with countries extruded

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)