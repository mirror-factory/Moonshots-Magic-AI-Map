# Draw GeoJSON points

Draw points from a GeoJSON collection to a map. In this example, we show the points with a custom image and display a label that shows the value of a property of the GeoJSON data.

Draw GeoJSON points

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Draw GeoJSON points</title>
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
        style: maptilersdk.MapStyle.BASIC.LIGHT,
        center: [0, 0],
        zoom: 1
    });

    map.on('load', async function () {
        // Add an image to use as a custom marker
        const image = await map.loadImage(
            'https://docs.maptiler.com/sdk-js/assets/osgeo-logo.png');

        map.addImage('custom-marker', image.data);
        // Add a GeoJSON source with 15 points
        map.addSource('conferences', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [100.4933, 13.7551]\
                        },\
                        'properties': { 'year': '2004' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [6.6523, 46.5535]\
                        },\
                        'properties': { 'year': '2006' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [-123.3596, 48.4268]\
                        },\
                        'properties': { 'year': '2007' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [18.4264, -33.9224]\
                        },\
                        'properties': { 'year': '2008' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [151.195, -33.8552]\
                        },\
                        'properties': { 'year': '2009' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [2.1404, 41.3925]\
                        },\
                        'properties': { 'year': '2010' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [-104.8548, 39.7644]\
                        },\
                        'properties': { 'year': '2011' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [-1.1665, 52.9539]\
                        },\
                        'properties': { 'year': '2013' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [-122.6544, 45.5428]\
                        },\
                        'properties': { 'year': '2014' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [126.974, 37.5651]\
                        },\
                        'properties': { 'year': '2015' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [7.1112, 50.7255]\
                        },\
                        'properties': { 'year': '2016' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [-71.0314, 42.3539]\
                        },\
                        'properties': { 'year': '2017' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [39.2794, -6.8173]\
                        },\
                        'properties': { 'year': '2018' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [26.0961, 44.4379]\
                        },\
                        'properties': { 'year': '2019' }\
                    },\
                    {\
                        'type': 'Feature',\
                        'geometry': {\
                            'type': 'Point',\
                            'coordinates': [-114.0879, 51.0279]\
                        },\
                        'properties': { 'year': '2020' }\
                    }\
                ]
            }
        });

        // Add a symbol layer
        map.addLayer({
            'id': 'conferences',
            'type': 'symbol',
            'source': 'conferences',
            'layout': {
                'icon-image': 'custom-marker',
                // get the year from the source's "year" property
                'text-field': ['get', 'year'],
                'text-font': [\
                    'Open Sans Semibold',\
                    'Arial Unicode MS Bold'\
                ],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
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
    style: MapStyle.BASIC.LIGHT,
    center: [0, 0],
    zoom: 1
});

map.on('load', async function () {
    // Add an image to use as a custom marker
    const image = await map.loadImage(
        'https://docs.maptiler.com/sdk-js/assets/osgeo-logo.png');

    map.addImage('custom-marker', image.data);
    // Add a GeoJSON source with 15 points
    map.addSource('conferences', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [100.4933, 13.7551]\
                    },\
                    'properties': { 'year': '2004' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [6.6523, 46.5535]\
                    },\
                    'properties': { 'year': '2006' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [-123.3596, 48.4268]\
                    },\
                    'properties': { 'year': '2007' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [18.4264, -33.9224]\
                    },\
                    'properties': { 'year': '2008' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [151.195, -33.8552]\
                    },\
                    'properties': { 'year': '2009' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [2.1404, 41.3925]\
                    },\
                    'properties': { 'year': '2010' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [-104.8548, 39.7644]\
                    },\
                    'properties': { 'year': '2011' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [-1.1665, 52.9539]\
                    },\
                    'properties': { 'year': '2013' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [-122.6544, 45.5428]\
                    },\
                    'properties': { 'year': '2014' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [126.974, 37.5651]\
                    },\
                    'properties': { 'year': '2015' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [7.1112, 50.7255]\
                    },\
                    'properties': { 'year': '2016' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [-71.0314, 42.3539]\
                    },\
                    'properties': { 'year': '2017' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [39.2794, -6.8173]\
                    },\
                    'properties': { 'year': '2018' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [26.0961, 44.4379]\
                    },\
                    'properties': { 'year': '2019' }\
                },\
                {\
                    'type': 'Feature',\
                    'geometry': {\
                        'type': 'Point',\
                        'coordinates': [-114.0879, 51.0279]\
                    },\
                    'properties': { 'year': '2020' }\
                }\
            ]
        }
    });

    // Add a symbol layer
    map.addLayer({
        'id': 'conferences',
        'type': 'symbol',
        'source': 'conferences',
        'layout': {
            'icon-image': 'custom-marker',
            // get the year from the source's "year" property
            'text-field': ['get', 'year'],
            'text-font': [\
                'Open Sans Semibold',\
                'Arial Unicode MS Bold'\
            ],
            'text-offset': [0, 1.25],
            'text-anchor': 'top'
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
  <title>Draw GeoJSON points</title>
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
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy

## Related examples

[![How to add a custom icon (SVG) to a point layer](https://docs.maptiler.com/assets/img/example-card.png)**Add custom icon (SVG) to a point layer** Example\\
This example shows how to make a map with pins to display a point layer from a MapTiler Tileset using a custom SVG icon.](https://docs.maptiler.com/sdk-js/examples/custom-points-icon-svg/)

[![Point layer (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer (point helper)** Example\\
This example shows how to add a point layer to the map using the point layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-point-minimal/)

[![Point filtering by property](https://docs.maptiler.com/assets/img/example-card.png)**Point filtering by property** Example\\
Filter thousands of features in real time to quickly and easily find those with a property that meets your search criteria.](https://docs.maptiler.com/sdk-js/examples/point-filtering/)

[![Create and style clusters](https://docs.maptiler.com/assets/img/example-card.png)**Create and style clusters** Example\\
Use SDK JS built-in functions to visualize points as clusters.](https://docs.maptiler.com/sdk-js/examples/cluster/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/geojson-markers/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Draw GeoJSON points

Draw GeoJSON points

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)