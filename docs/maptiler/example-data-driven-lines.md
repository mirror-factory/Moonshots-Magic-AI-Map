# Style lines with a data-driven property

Create a visualization with a data expression for [`line-color`](https://docs.maptiler.com/gl-style-specification/layers/#paint-line-line-color).

Style lines with a data-driven property

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Style lines with a data-driven property</title>
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
        style: maptilersdk.MapStyle.STREETS,
        center: [-122.48383155304096, 37.82882682974591],
        zoom: 16
    });

    map.on('load', function () {
        map.addSource('lines', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [\
                    {\
                        'type': 'Feature',\
                        'properties': {\
                            'color': '#F7455D' // red\
                        },\
                        'geometry': {\
                            'type': 'LineString',\
                            'coordinates': [\
                                [-122.4833858013153, 37.829607404976734],\
                                [-122.4830961227417, 37.82932776098012],\
                                [-122.4830746650696, 37.82932776098012],\
                                [-122.48218417167662, 37.82889558180985],\
                                [-122.48218417167662, 37.82890193740421],\
                                [-122.48221099376678, 37.82868372835086],\
                                [-122.4822163581848, 37.82868372835086],\
                                [-122.48205006122589, 37.82801003030873]\
                            ]\
                        }\
                    },\
                    {\
                        'type': 'Feature',\
                        'properties': {\
                            'color': '#33C9EB' // blue\
                        },\
                        'geometry': {\
                            'type': 'LineString',\
                            'coordinates': [\
                                [-122.48393028974533, 37.829471820141016],\
                                [-122.48395174741744, 37.82940826466351],\
                                [-122.48395174741744, 37.829412501697064],\
                                [-122.48423874378203, 37.829357420242125],\
                                [-122.48422533273697, 37.829361657278575],\
                                [-122.48459815979002, 37.8293425906126],\
                                [-122.48458743095398, 37.8293447091313],\
                                [-122.4847564101219, 37.82932776098012],\
                                [-122.48474299907684, 37.829331998018276],\
                                [-122.4849334359169, 37.829298101706186],\
                                [-122.48492807149889, 37.82930022022615],\
                                [-122.48509705066681, 37.82920488676767],\
                                [-122.48509168624878, 37.82920912381288],\
                                [-122.48520433902739, 37.82905870855876],\
                                [-122.48519897460936, 37.82905870855876],\
                                [-122.4854403734207, 37.828594749716714],\
                                [-122.48543500900269, 37.82860534241688],\
                                [-122.48571664094925, 37.82808206121068],\
                                [-122.48570591211319, 37.82809689109353],\
                                [-122.4858346581459, 37.82797189627337],\
                                [-122.48582661151886, 37.82797825194729],\
                                [-122.4859634041786, 37.82788503534145],\
                                [-122.48595803976059, 37.82788927246246],\
                                [-122.48605459928514, 37.82786596829394]\
                            ]\
                        }\
                    }\
                ]
            }
        });
        map.addLayer({
            'id': 'lines',
            'type': 'line',
            'source': 'lines',
            'paint': {
                'line-width': 3,
                // Use a get expression (https://docs.maptiler.com/gl-style-specification/expressions/#get)
                // to set the line-color to a feature property value.
                'line-color': ['get', 'color']
            }
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
    style: MapStyle.STREETS,
    center: [-122.48383155304096, 37.82882682974591],
    zoom: 16
});

map.on('load', function () {
    map.addSource('lines', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [\
                {\
                    'type': 'Feature',\
                    'properties': {\
                        'color': '#F7455D' // red\
                    },\
                    'geometry': {\
                        'type': 'LineString',\
                        'coordinates': [\
                            [-122.4833858013153, 37.829607404976734],\
                            [-122.4830961227417, 37.82932776098012],\
                            [-122.4830746650696, 37.82932776098012],\
                            [-122.48218417167662, 37.82889558180985],\
                            [-122.48218417167662, 37.82890193740421],\
                            [-122.48221099376678, 37.82868372835086],\
                            [-122.4822163581848, 37.82868372835086],\
                            [-122.48205006122589, 37.82801003030873]\
                        ]\
                    }\
                },\
                {\
                    'type': 'Feature',\
                    'properties': {\
                        'color': '#33C9EB' // blue\
                    },\
                    'geometry': {\
                        'type': 'LineString',\
                        'coordinates': [\
                            [-122.48393028974533, 37.829471820141016],\
                            [-122.48395174741744, 37.82940826466351],\
                            [-122.48395174741744, 37.829412501697064],\
                            [-122.48423874378203, 37.829357420242125],\
                            [-122.48422533273697, 37.829361657278575],\
                            [-122.48459815979002, 37.8293425906126],\
                            [-122.48458743095398, 37.8293447091313],\
                            [-122.4847564101219, 37.82932776098012],\
                            [-122.48474299907684, 37.829331998018276],\
                            [-122.4849334359169, 37.829298101706186],\
                            [-122.48492807149889, 37.82930022022615],\
                            [-122.48509705066681, 37.82920488676767],\
                            [-122.48509168624878, 37.82920912381288],\
                            [-122.48520433902739, 37.82905870855876],\
                            [-122.48519897460936, 37.82905870855876],\
                            [-122.4854403734207, 37.828594749716714],\
                            [-122.48543500900269, 37.82860534241688],\
                            [-122.48571664094925, 37.82808206121068],\
                            [-122.48570591211319, 37.82809689109353],\
                            [-122.4858346581459, 37.82797189627337],\
                            [-122.48582661151886, 37.82797825194729],\
                            [-122.4859634041786, 37.82788503534145],\
                            [-122.48595803976059, 37.82788927246246],\
                            [-122.48605459928514, 37.82786596829394]\
                        ]\
                    }\
                }\
            ]
        }
    });
    map.addLayer({
        'id': 'lines',
        'type': 'line',
        'source': 'lines',
        'paint': {
            'line-width': 3,
            // Use a get expression (https://docs.maptiler.com/gl-style-specification/expressions/#get)
            // to set the line-color to a feature property value.
            'line-color': ['get', 'color']
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
  <title>Style lines with a data-driven property</title>
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

[![Create a gradient line using an expression](https://docs.maptiler.com/assets/img/example-card.png)**Create a gradient line using an expression** Example\\
Use the line-gradient paint property and an expression to visualize distance from the starting point of a line.](https://docs.maptiler.com/sdk-js/examples/line-gradient/)

[![Line layer (polyline helper)](https://docs.maptiler.com/assets/img/example-card.png)**Line layer (polyline helper)** Example\\
This example shows how to add a line layer to the map using the polyline layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polyline-minimal/)

[![Style a GeoJSON Line layer (polyline helper)](https://docs.maptiler.com/assets/img/example-card.png)**Style a GeoJSON Line layer (polyline helper)** Example\\
This example shows how to add and style a GeoJSON line layer to the map using the polyline layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polyline-simple/)

[![Line color ramp symbol (polyline helper)](https://docs.maptiler.com/assets/img/example-card.png)**Line color ramp symbol (polyline helper)** Example\\
This example shows how to add a line layer with a color ramp symbol that changes the line color based on the map zoom level using the polyline layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polyline-ramped-style/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/data-driven-lines/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Style lines with a data-driven property

Style lines with a data-driven property

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)