# How to create a countries map with your own data

This tutorial demonstrates the process of merging your own personalized data with the [MapTiler Countries](https://www.maptiler.com/countries/) dataset, allowing you to create a [choropleth map](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/). The MapTiler Countries dataset primarily consists of information regarding the administrative divisions of countries and their territories around the world.

For this specific example, we will be creating a choropleth map that showcases the population of some European countries.

Display a countries choropleth map with your own data

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

1. Copy the following code, paste it into your favorite text editor, and save it as a `.html` file.



```html

```





HTML



Copy


1. Install the npm package.



```bash
npm install --save @maptiler/sdk
```





Bash



Copy

2. Include the CSS file.

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/countries-with-own-data/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/countries-with-own-data/#) in the head of the document via the CDN



```js
import "@maptiler/sdk/dist/maptiler-sdk.css";
```





JavaScript



Copy







```html
<link href='https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css' rel='stylesheet' />
```





HTML



Copy

3. Include the following code in your JavaScript file (Example: app.js).



```js

```





JavaScript



Copy


4. Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

5. The next is up to you. You can center your map wherever you desire (modifying the `starting position`) and set an appropriate zoom level (modifying the `starting zoom`) to match your users’ needs. Additionally, you can change the map’s look (by updating the `source URL`); choose from a range of visually appealing map styles from our extensive [MapTiler standard maps](https://cloud.maptiler.com/maps/), or create your own to truly differentiate your application.


06. Add event handler for map `load` event. You will add code to create a vector source and a vector layer in this handler.



    ```js

    ```





    JavaScript



    Copy

07. Create vector source. The following snippet creates vector source for the MapTiler Countries dataset.



    ```js

    ```





    JavaScript



    Copy

08. Get the id of the first symbol layer. We want to include the vector layer below the map labels. That means we need to know the id of the first symbol layer so we can include the vector layer before this layer.



    ```js

    ```





    JavaScript



    Copy

09. Add the vector layer. We need to include `firsSymbolId` to the `map.addLayer` function to display the vector under the maps labels



    ```js

    ```





    JavaScript



    Copy

10. Filter the data to only show the countries. Add a filter to the layer to only display level 0 items.



    ```js

    ```





    JavaScript



    Copy

11. Prepare your data. Each feature in the dataset has its own identification for pairing. You need to mark your data with the same identifiers as is stored by features. We will use the iso\_n3 identifier for countries. Alternatively, you can use one of the properties: name, country codes (ISO A2), or wiki data-id. Check out the [Countries dataset schema](https://docs.maptiler.com/schema/countries/#administrative) to see the available fields.



    ```js

    ```





    JavaScript



    Copy

12. Join the data to coresponding features. Use `querySourceFeatures` to get all features from the layer for visualization. We are also filtering for all countries with `['==', 'level', 0]` using style expressions. The second part of the following code goes throw these features and adds attributes from our data array (vizData) to relevant features.



    ```js

    ```





    JavaScript



    Copy

13. Create a function that validates that the country dataset is loaded to call the `setStates` function.



    ```js

    ```





    JavaScript



    Copy

14. Add event handler for map `data` event. Call the `afterLoad` function



    ```js

    ```





    JavaScript



    Copy

15. Create a choropleth map based on the population attribute. Change the `fill-color` property of the layer.



    ```js

    ```





    JavaScript



    Copy

16. Display a popup when clicking on the vector layer and show the information of the age attribute.



    ```js

    ```





    JavaScript



    Copy

17. To make our map more user friendly, we will change the cursor when hovering over a geometry in the vector layer to indicate to the user that they can click on it.



    ```js

    ```





    JavaScript



    Copy


View complete source code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Display a countries choropleth map with your own data</title>
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
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      const vizData = {
        "8":{"name":"Albania","population":2829741},
        "40":{"name":"Austria","population":8932664},
        "56":{"name":"Belgium","population":11566041},
        "100":{"name":"Bulgaria","population":6916548},
        "191":{"name":"Croatia","population":4036355},
        "196":{"name":"Cyprus","population":896005},
        "203":{"name":"Czechia","population":10701777},
        "208":{"name":"Denmark","population":5840045},
        "233":{"name":"Estonia","population":1330068},
        "246":{"name":"Finland","population":5533793},
        "250":{"name":"France","population":67439599},
        "276":{"name":"Germany","population":83155031},
        "300":{"name":"Greece","population":10682547},
        "348":{"name":"Hungary","population":9730772},
        "352":{"name":"Iceland","population":368792},
        "372":{"name":"Ireland","population":5006907},
        "380":{"name":"Italy","population":59257566},
        "428":{"name":"Latvia","population":1893223},
        "438":{"name":"Liechtenstein","population":39055},
        "440":{"name":"Lithuania","population":2795680},
        "442":{"name":"Luxembourg","population":634730},
        "470":{"name":"Malta","population":516100},
        "499":{"name":"Montenegro","population":620739},
        "528":{"name":"Netherlands","population":17475415},
        "578":{"name":"Norway","population":5391369},
        "616":{"name":"Poland","population":37840001},
        "620":{"name":"Portugal","population":10298252},
        "642":{"name":"Romania","population":19186201},
        "688":{"name":"Serbia","population":6871547},
        "703":{"name":"Slovakia","population":5459781},
        "705":{"name":"Slovenia","population":2108977},
        "724":{"name":"Spain","population":47394223},
        "752":{"name":"Sweden","population":10379295},
        "756":{"name":"Switzerland","population":8667088},
        "792":{"name":"Turkey","population":83614362},
        "807":{"name":"North Macedonia","population":2068808}
      };
      function setStates() {
        const countries = map.querySourceFeatures('statesData', {
          sourceLayer: 'administrative',
          filter: ['all', ['==', 'level', 0]],
        });
        countries.forEach(country => {
          if(country.id && vizData[country.id]) {
            map.setFeatureState({
              source: 'statesData',
              sourceLayer: 'administrative',
              id: country.id
            }, {
              population: vizData[country.id].population
            });
          }
        });
        if (countries.length !== 0) {
          map.off('data', afterLoad);
        }
      }
      function afterLoad() {
        if (map.getSource('statesData') && map.isSourceLoaded('statesData')) {
          setStates();
        }
      }
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
        center: [13.39, 52.51], // starting position [lng, lat]
        zoom: 2, // starting zoom
      });
      map.on('load', function() {
        map.addSource('statesData', {
          type: 'vector',
          url: `https://api.maptiler.com/tiles/countries/tiles.json?`
        });

        // Find the id of the first symbol layer in the map style
        const layers = map.getStyle().layers;
        const firstSymbolId = layers.find(layer => layer.type === 'symbol').id;

        map.addLayer(
          {
            'id': 'countries',
            'source': 'statesData',
            'source-layer': 'administrative',
            'type': 'fill',
            'filter': ['==', 'level', 0],
            'paint': {
                'fill-color': ['case',\
                  ['!=', ['to-number', ['feature-state', 'population']], 0],\
                  ['interpolate', ['linear'], ['feature-state', 'population'],\
                    5000000, 'rgba(222,235,247,1)', 90000000, 'rgba(49,130,189,1)'\
                  ],\
                  'rgba(0, 0, 0, 0)'\
                ],
                'fill-opacity': 1,
                'fill-outline-color': '#000'
            }
          },
          firstSymbolId
        );
      });
      map.on('data', afterLoad);
      map.on('click', 'countries', function (e) {
        new maptilersdk.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<h3>Population</h3><p>${e.features[0].state.population.toLocaleString()}</p>`)
          .addTo(map);
      });
      // Change the cursor to a pointer when the mouse is over the layer.
      map.on('mouseenter', 'countries', function () {
          map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'countries', function () {
          map.getCanvas().style.cursor = '';
      });
  </script>
</body>
</html>
```

HTML

Copy

## Learn more

Check out the tutorials [How to use and filter data for MapTiler Countries](https://docs.maptiler.com/sdk-js/examples/countries-filter/) and [How to display an interactive choropleth map legend control](https://docs.maptiler.com/sdk-js/examples/control-legend-choropleth/).

Visit the [MapTiler Countries schema](https://docs.maptiler.com/schema/countries/) to know how it is organized into different thematic layers and which attribute and values each layer contains.

Read the following How-tos related to choropleth maps:

[How to style a choropleth map in Edit Tool](https://docs.maptiler.com/guides/map-design/how-to-style-a-choropleth-map-in-the-customize)

[Prepare GeoJSON with attributes for choropleth map and upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud)

## Related examples

[![How to use and filter data for MapTiler Countries](https://docs.maptiler.com/assets/img/example-card.png)**Countries filter** Example\\
This tutorial shows how to use and filter data for MapTiler Countries and make a choropleth map.](https://docs.maptiler.com/sdk-js/examples/countries-filter/)

[![Point filtering by property](https://docs.maptiler.com/assets/img/example-card.png)**Point filtering by property** Example\\
Filter thousands of features in real time to quickly and easily find those with a property that meets your search criteria.](https://docs.maptiler.com/sdk-js/examples/point-filtering/)

[![Interactive choropleth map](https://docs.maptiler.com/assets/img/example-card.png)**Interactive choropleth map** Example\\
Use events and feature states to create a interactive choropleth map.](https://docs.maptiler.com/sdk-js/examples/interactive-choropleth/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/countries-with-own-data/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/countries-with-own-data/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to create a countries map with your own data

Countries with data

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)