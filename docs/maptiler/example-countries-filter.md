# How to use and filter data for MapTiler Countries

This tutorial shows the process of utilizing and refining data from the [MapTiler Countries](https://www.maptiler.com/countries/) to create a [Choropleth map](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/) of the US states. The MapTiler Countries dataset primarily consists of information regarding the administrative divisions within various countries and their respective territories.

Display a US states map

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/countries-filter/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/countries-filter/#) in the head of the document via the CDN



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


6. Add event handler for map `load` event. You will add code to create a vector source and a vector layer in this handler.



```js

```





JavaScript



Copy

7. Create vector source. The following snippet creates a vector source for the MapTiler Countries dataset.



```js

```





JavaScript



Copy

8. Get the ID of the first symbol layer. We want to include the vector layer below the map labels. That means we need to know the id of the first symbol layer so we can include the vector layer before this layer.



```js

```





JavaScript



Copy

9. Add the vector layer. We need to include `firsSymbolId` on the `map.addLayer` function to display the vector under the maps labels



```js

```





JavaScript



Copy

10. Filter the data to only show the states of USA. Add a filter to the layer to only display level 1 items. The dataset now contains divisions and sub-subdivisions only for the US, if you need other country\`s divisions, please contact us.



```js

```





JavaScript



Copy

11. Create a choropleth map based on the name attribute. Change the `fill-color` property of the layer.



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
  <title>Display a US states map</title>
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
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS,
        center: [-94.28, 38.45], // starting position [lng, lat]
        zoom: 3, // starting zoom
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
            'id': 'US_states',
            'source': 'statesData',
            'source-layer': 'administrative',
            'type': 'fill',
            'filter': [\
              'all',\
              ['==', 'level', 1],\
              ['==', 'level_0', 'US']\
            ],
            'paint': {
                'fill-color': [\
                  "match",\
                  ["get", "name"],\
                  ["Nebraska", "Alaska", "Washington", "Nevada", "New Mexico", "Montana", "Minnesota", "Louisiana", "North Carolina", "Kentucky", "Massachusetts", "Delaware", "Michigan"],\
                  "#D5CD85",\
                  ["Oklahoma", "Florida", "Idaho", "Wisconsin", "Arizona", "Tennessee", "Pennsylvania", "New Hampshire", "Rhode Island"],\
                  "#D58785",\
                  ["New York", "California", "Wyoming", "Kansas", "Illinois", "Mississippi", "South Carolina", "West Virginia"],\
                  "#735F91",\
                  ["Texas", "Georgia", "Utah", "Missouri", "South Dakota", "Ohio", "Maryland", "Vermont"],\
                  "#567986",\
                  ["Colorado", "Oregon", "Alabama", "Indiana", "North Dakota", "Iowa", "Arkansas", "Virginia", "New Jersey", "Maine", "Connecticut"],\
                  "#69A86D",\
                  "rgba(0, 0, 0, 0.5)"\
                ],
                'fill-opacity': 1,
                'fill-outline-color': '#000'
            }
          },
          firstSymbolId
        );
      });
  </script>
</body>
</html>
```

HTML

Copy

## Learn more

Check out the [How to create a countries map with your own data](https://docs.maptiler.com/sdk-js/examples/countries-with-own-data/) tutorial.

Visit the [MapTiler Countries schema](https://docs.maptiler.com/schema/countries/) to know how it is organized into different thematic layers and which attributes and values each layer contains.

Read the following How-tos related to choropleth maps:

[How to style a choropleth map in Edit Tool](https://docs.maptiler.com/guides/map-design/how-to-style-a-choropleth-map-in-the-customize)

[Prepare GeoJSON with attributes for choropleth map and upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud)

## Related examples

[![How to create a countries map with your own data](https://docs.maptiler.com/assets/img/example-card.png)**Countries with data** Example\\
This tutorial shows how to Join MapTiler Countries with your own custom data and make a choropleth map.](https://docs.maptiler.com/sdk-js/examples/countries-with-own-data/)

[![Point filtering by property](https://docs.maptiler.com/assets/img/example-card.png)**Point filtering by property** Example\\
Filter thousands of features in real time to quickly and easily find those with a property that meets your search criteria.](https://docs.maptiler.com/sdk-js/examples/point-filtering/)

[![Interactive choropleth map](https://docs.maptiler.com/assets/img/example-card.png)**Interactive choropleth map** Example\\
Use events and feature states to create a interactive choropleth map.](https://docs.maptiler.com/sdk-js/examples/interactive-choropleth/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/countries-filter/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/countries-filter/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to use and filter data for MapTiler Countries

Countries filter

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)