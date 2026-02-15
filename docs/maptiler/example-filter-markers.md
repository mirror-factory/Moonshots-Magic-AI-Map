# Filter symbols by toggling a list

Filter a set of [symbols](https://docs.maptiler.com/gl-style-specification/layers/#symbol) based on a property value in the data.

Filter symbols by toggling a list

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Filter symbols by toggling a list</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <style>
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

    .filter-group {
      font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1;
      border-radius: 3px;
      width: 120px;
      color: #fff;
    }

    .filter-group input[type='checkbox']:first-child+label {
      border-radius: 3px 3px 0 0;
    }

    .filter-group label:last-child {
      border-radius: 0 0 3px 3px;
      border: none;
    }

    .filter-group input[type='checkbox'] {
      display: none;
    }

    .filter-group input[type='checkbox']+label {
      background-color: #3386c0;
      display: block;
      cursor: pointer;
      padding: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    }

    .filter-group input[type='checkbox']+label {
      background-color: #3386c0;
      text-transform: capitalize;
    }

    .filter-group input[type='checkbox']+label:hover,
    .filter-group input[type='checkbox']:checked+label {
      background-color: #4ea0da;
    }

    .filter-group input[type='checkbox']:checked+label:before {
      content: '✔';
      margin-right: 5px;
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <nav id="filter-group" class="filter-group"></nav>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const places = {
      'type': 'FeatureCollection',
      'features': [\
        {\
          'type': 'Feature',\
          'properties': {\
            'icon': 'theatre'\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-77.038659, 38.931567]\
          }\
        },\
        {\
          'type': 'Feature',\
          'properties': {\
            'icon': 'theatre'\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-77.003168, 38.894651]\
          }\
        },\
        {\
          'type': 'Feature',\
          'properties': {\
            'icon': 'bar'\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-77.090372, 38.881189]\
          }\
        },\
        {\
          'type': 'Feature',\
          'properties': {\
            'icon': 'bicycle'\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-77.052477, 38.943951]\
          }\
        },\
        {\
          'type': 'Feature',\
          'properties': {\
            'icon': 'music'\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-77.031706, 38.914581]\
          }\
        },\
        {\
          'type': 'Feature',\
          'properties': {\
            'icon': 'music'\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-77.020945, 38.878241]\
          }\
        },\
        {\
          'type': 'Feature',\
          'properties': {\
            'icon': 'music'\
          },\
          'geometry': {\
            'type': 'Point',\
            'coordinates': [-77.007481, 38.876516]\
          }\
        }\
      ]
    };

    const filterGroup = document.getElementById('filter-group');
    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.STREETS,
      center: [-77.04, 38.907],
      zoom: 11.15
    });

    map.on('load', function () {
      // Add a GeoJSON source containing place coordinates and information.
      map.addSource('places', {
        'type': 'geojson',
        'data': places
      });

      places.features.forEach(function (feature) {
        const symbol = feature.properties['icon'];
        const layerID = 'poi-' + symbol;

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
          map.addLayer({
            'id': layerID,
            'type': 'symbol',
            'source': 'places',
            'layout': {
              'icon-image': symbol,
              'icon-overlap': 'always'
            },
            'filter': ['==', 'icon', symbol]
          });

          // Add checkbox and label elements for the layer.
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.id = layerID;
          input.checked = true;
          filterGroup.appendChild(input);

          const label = document.createElement('label');
          label.setAttribute('for', layerID);
          label.textContent = symbol;
          filterGroup.appendChild(label);

          // When the checkbox changes, update the visibility of the layer.
          input.addEventListener('change', function (e) {
            map.setLayoutProperty(
              layerID,
              'visibility',
              e.target.checked ? 'visible' : 'none'
            );
          });
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
const places = {
    'type': 'FeatureCollection',
    'features': [\
        {\
            'type': 'Feature',\
            'properties': {\
                'icon': 'theatre'\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-77.038659, 38.931567]\
            }\
        },\
        {\
            'type': 'Feature',\
            'properties': {\
                'icon': 'theatre'\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-77.003168, 38.894651]\
            }\
        },\
        {\
            'type': 'Feature',\
            'properties': {\
                'icon': 'bar'\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-77.090372, 38.881189]\
            }\
        },\
        {\
            'type': 'Feature',\
            'properties': {\
                'icon': 'bicycle'\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-77.052477, 38.943951]\
            }\
        },\
        {\
            'type': 'Feature',\
            'properties': {\
                'icon': 'music'\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-77.031706, 38.914581]\
            }\
        },\
        {\
            'type': 'Feature',\
            'properties': {\
                'icon': 'music'\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-77.020945, 38.878241]\
            }\
        },\
        {\
            'type': 'Feature',\
            'properties': {\
                'icon': 'music'\
            },\
            'geometry': {\
                'type': 'Point',\
                'coordinates': [-77.007481, 38.876516]\
            }\
        }\
    ]
};

const filterGroup = document.getElementById('filter-group');
const map = new Map({
    container: 'map',
    style: MapStyle.STREETS,
    center: [-77.04, 38.907],
    zoom: 11.15
});

map.on('load', function () {
    // Add a GeoJSON source containing place coordinates and information.
    map.addSource('places', {
        'type': 'geojson',
        'data': places
    });

    places.features.forEach(function (feature) {
        const symbol = feature.properties['icon'];
        const layerID = 'poi-' + symbol;

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                'id': layerID,
                'type': 'symbol',
                'source': 'places',
                'layout': {
                    'icon-image': symbol,
                    'icon-overlap': 'always'
                },
                'filter': ['==', 'icon', symbol]
            });

            // Add checkbox and label elements for the layer.
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);

            const label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = symbol;
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', function (e) {
                map.setLayoutProperty(
                    layerID,
                    'visibility',
                    e.target.checked ? 'visible' : 'none'
                );
            });
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
  <title>Filter symbols by toggling a list</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <style>
  .filter-group {
      font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1;
      border-radius: 3px;
      width: 120px;
      color: #fff;
  }

  .filter-group input[type='checkbox']:first-child + label {
      border-radius: 3px 3px 0 0;
  }

  .filter-group label:last-child {
      border-radius: 0 0 3px 3px;
      border: none;
  }

  .filter-group input[type='checkbox'] {
      display: none;
  }

  .filter-group input[type='checkbox'] + label {
      background-color: #3386c0;
      display: block;
      cursor: pointer;
      padding: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  }

  .filter-group input[type='checkbox'] + label {
      background-color: #3386c0;
      text-transform: capitalize;
  }

  .filter-group input[type='checkbox'] + label:hover,
  .filter-group input[type='checkbox']:checked + label {
      background-color: #4ea0da;
  }

  .filter-group input[type='checkbox']:checked + label:before {
      content: '✔';
      margin-right: 5px;
  }
  </style>
  <div id="map"></div>
  <nav id="filter-group" class="filter-group"></nav>
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

[![Filter symbols by text input](https://docs.maptiler.com/assets/img/example-card.png)**Filter symbols by text input** Example\\
Filter symbols by icon name by typing in a text input.](https://docs.maptiler.com/sdk-js/examples/filter-markers-by-input/)

[![Point filtering by property](https://docs.maptiler.com/assets/img/example-card.png)**Point filtering by property** Example\\
Filter thousands of features in real time to quickly and easily find those with a property that meets your search criteria.](https://docs.maptiler.com/sdk-js/examples/point-filtering/)

[![Geocoding search for POIs near the user's location](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding search for POIs near the user's location** Example\\
Geocoding control search results filter by type and given higher priority for the results near the user's location.](https://docs.maptiler.com/sdk-js/examples/geocoding-filter-types/)

[![How to use and filter data for MapTiler Countries](https://docs.maptiler.com/assets/img/example-card.png)**Countries filter** Example\\
This tutorial shows how to use and filter data for MapTiler Countries and make a choropleth map.](https://docs.maptiler.com/sdk-js/examples/countries-filter/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/filter-markers/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Filter symbols by toggling a list

Filter symbols by toggling a list

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)