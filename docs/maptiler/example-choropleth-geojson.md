# How to create a choropleth Map from GeoJSON

This tutorial demonstrates the process of generating a Choropleth map through the application of styling to a GeoJSON overlay layer on the map. Additionally, it explains how to display a popup when clicked and create a map legend. As an illustrative example, we will be using countries with attributes sourced from EUROSTAT in GeoJSON format. You can download the [Age of the first marriage sample data](https://docs.maptiler.com/sdk-js/assets/Mean_age_of_women_at_first_marriage_in_2019.geojson).

Display a choropleth Map from GeoJSON

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

#### Mean age of    women at first marriage  in 2019

23

24

25

26

27

28

29

30

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/#) in the head of the document via the CDN



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


6. Add event handler for map load event. You will add code to create a GeoJSON source and a vector layer in this handler.



```js

```





JavaScript



Copy

7. Create GeoJSON source. The following snippet creates GeoJSON source hosted on MapTiler (check out the [How to Upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud#PrepareGeoJSONwithattributesforchoroplethmapanduploadGeoJSONtoMapTilerCloud-UploadGeoJSONtoMapTilerCloud) tutorial). Publish the dataset and copy the link to the GeoJSON. The GeoJSON used in the example contains data from EUROSTAT Marriage indicators dataset filtrated to just countries with some value of mean age of women at first marriage in 2019. Download the [Age of the first marriage sample data](https://docs.maptiler.com/sdk-js/assets/Mean_age_of_women_at_first_marriage_in_2019.geojson).



```js

```





JavaScript



Copy

8. Get the ID of the first symbol layer. We want to include GeoJSON below the map labels. That means we need to know the ID of the first symbol layer so we can include the GeoJSON layer before this layer.



```js

```





JavaScript



Copy

9. Add the GeoJSON layer. We need to include `firsSymbolId` on the `map.addLayer` function to display the GeoJSON under the map’s labels.



```js

```





JavaScript



Copy

10. Create a choropleth map based on the age attribute. Change the `fill-color` property of the layer.



```js

```





JavaScript



Copy

11. Display a popup when clicking on the geojson layer and show the information of the age attribute.



```js

```





JavaScript



Copy

12. To make our map more user-friendly, we will change the cursor when hovering over a geometry in the geojson layer to indicate to the user that they can click on it.



```js

```





JavaScript



Copy

13. Create a map legend style. Add the legend style to your stylesheet.



```css
.legend {
     background-color: #000;
     border-radius: 3px;
     bottom: 30px;
     box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
     color: #fff ;
     font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
     padding: 10px;
     position: absolute;
     right: 10px;
     z-index: 1;
}
.legend h4 {
     margin: 0 0 10px;
}
.legend div span {
     border-radius: 50%;
     display: inline-block;
     height: 10px;
     margin-right: 5px;
     width: 10px;
}
```





CSS



Copy

14. Create the map legend elements. Add after the element that contains the map.



```html
<div id="state-legend" class="legend">
     <h4>Mean age of </br> women at first marriage</br>in 2019</h4>
       <div><span style="background-color: #fff5eb"></span>23</div>
       <div><span style="background-color: #fee6ce"></span>24</div>
       <div><span style="background-color: #fdd0a2"></span>25</div>
       <div><span style="background-color: #fdae6b"></span>26</div>
       <div><span style="background-color: #fd8d3c"></span>27</div>
       <div><span style="background-color: #f16913"></span>28</div>
       <div><span style="background-color: #d94801"></span>29</div>
       <div><span style="background-color: #8c2d04"></span>30</div>
</div>
```





HTML



Copy


View complete source code

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Display a choropleth Map from GeoJSON</title>
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

    .legend {
      background-color: #000;
      border-radius: 3px;
      bottom: 30px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      color: #fff;
      font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
      padding: 10px;
      position: absolute;
      right: 10px;
      z-index: 1;
    }

    .legend h4 {
      margin: 0 0 10px;
    }

    .legend div span {
      border-radius: 50%;
      display: inline-block;
      height: 10px;
      margin-right: 5px;
      width: 10px;
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <div id="state-legend" class="legend">
    <h4>Mean age of </br> women at first marriage </br>in 2019</h4>
    <div><span style="background-color: #fff5eb"></span>23</div>
    <div><span style="background-color: #fee6ce"></span>24</div>
    <div><span style="background-color: #fdd0a2"></span>25</div>
    <div><span style="background-color: #fdae6b"></span>26</div>
    <div><span style="background-color: #fd8d3c"></span>27</div>
    <div><span style="background-color: #f16913"></span>28</div>
    <div><span style="background-color: #d94801"></span>29</div>
    <div><span style="background-color: #8c2d04"></span>30</div>
  </div>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
      container: 'map', // container id
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: [13.39, 52.51], // starting position [lng, lat]
      zoom: 2, // starting zoom
    });
    map.on('load', async function () {
      const result = await maptilersdk.data.get('YOUR_MAPTILER_DATASET_ID_HERE');
      map.addSource('age', {
        'type': 'geojson',
        'data': result
      });
      // Find the id of the first symbol layer in the map style
      const layers = map.getStyle().layers;
      const firstSymbolId = layers.find(layer => layer.type === 'symbol').id;

      map.addLayer(
        {
          'id': 'IDage',
          'source': 'age',
          'type': 'fill',
          'paint': {
            'fill-color': [\
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
            'fill-opacity': 1,
            'fill-outline-color': '#000'
          }
        },
        firstSymbolId
      );

      map.on('click', 'IDage', function (e) {
        new maptilersdk.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<h3>Average age of </br> women at first marriage</br>in 2019</h3><p>${e.features[0].properties.age}</p>`)
          .addTo(map);
      });

      // Change the cursor to a pointer when the mouse is over the layer.
      map.on('mouseenter', 'IDage', function () {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'IDage', function () {
        map.getCanvas().style.cursor = '';
      });
    });
  </script>
</body>

</html>
```

HTML

Copy

## Learn more

Get more details about this tutorial on [Zoomable Choropleth Map from GeoJSON with MapLibre](https://docs.maptiler.com/guides/maps-apis/maps-platform/zoomable-choropleth-map-from-geojson-with-maplibre) or check out the following How-tos related to choropleth maps

[How to style a choropleth map in Edit Tool](https://docs.maptiler.com/guides/map-design/how-to-style-a-choropleth-map-in-the-customize)

[Prepare GeoJSON with attributes for choropleth map and upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud)

[Join MapTiler Countries with your own custom data and make a choropleth map](https://docs.maptiler.com/guides/maps-apis/maps-platform/join-maptiler-countries-with-your-own-custom-data-and-make-a-choropleth-map)

## Related examples

[![How to display an interactive choropleth map legend control](https://docs.maptiler.com/assets/img/example-card.png)**Choropleth legend** Example\\
This tutorial shows how to display an interactive choropleth map legend control.](https://docs.maptiler.com/sdk-js/examples/control-legend-choropleth/)

[![Create a 3D choropleth map of Europe with countries extruded](https://docs.maptiler.com/assets/img/example-card.png)**Create a 3D choropleth map of Europe with countries extruded** Example\\
This 3D choropleth map of Europe with countries extruded uses an external dataset to provide data-driven values for the fill-extrusion-height paint property of various country polygons in a fill-extrusion layer.](https://docs.maptiler.com/sdk-js/examples/fill-extrusion/)

[![Interactive choropleth map](https://docs.maptiler.com/assets/img/example-card.png)**Interactive choropleth map** Example\\
Use events and feature states to create a interactive choropleth map.](https://docs.maptiler.com/sdk-js/examples/interactive-choropleth/)

[![How to use and filter data for MapTiler Countries](https://docs.maptiler.com/assets/img/example-card.png)**Countries filter** Example\\
This tutorial shows how to use and filter data for MapTiler Countries and make a choropleth map.](https://docs.maptiler.com/sdk-js/examples/countries-filter/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to create a choropleth Map from GeoJSON

Choropleth GeoJSON

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)