# Show polygon data from GeoJSON on the map

In this tutorial, we will demonstrate the process of incorporating a GeoJSON polygon overlay onto the map. Through the following steps, you will learn how to seamlessly integrate this feature into your web mapping applications.

Display a GeoJSON Layer

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/geojson-polygon/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/geojson-polygon/#) in the head of the document via the CDN



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

7. Create GeoJSON source. The following snippet creates GeoJSON source hosted on MapTiler (check out the [How to Upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud#PrepareGeoJSONwithattributesforchoroplethmapanduploadGeoJSONtoMapTilerCloud-UploadGeoJSONtoMapTilerCloud) tutorial). Publish the dataset and copy the link to the GeoJSON. Download the [Rio de Janeiro sample data](https://docs.maptiler.com/sdk-js/assets/rio_cats.geojson).



```js

```





JavaScript



Copy

8. Add the vector layer



```js

```





JavaScript



Copy


View complete source code

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Display a GeoJSON Layer</title>
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
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
            center: [-43.206091, -22.920387], // starting position [lng, lat]
            zoom: 11, // starting zoom
        });
        map.on('load', async function () {
            const geojson = await maptilersdk.data.get('YOUR_MAPTILER_DATASET_ID_HERE');
            map.addSource('rio_cats', {
                type: 'geojson',
                data: geojson
            });
            map.addLayer({
                'id': 'rio_cats',
                'type': 'fill',
                'source': 'rio_cats',
                'layout': {},
                'paint': {
                    'fill-color': '#98b',
                    'fill-opacity': 0.8
                }
            });
        });
    </script>
</body>
</html>
```

HTML

Copy

## Related examples

[![Polygon layer (polygon helper)](https://docs.maptiler.com/assets/img/example-card.png)**Polygon layer (polygon helper)** Example\\
This example shows how to add a polygon layer to the map using the polygon layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-polygon-minimal/)

[![How to create a choropleth Map from GeoJSON](https://docs.maptiler.com/assets/img/example-card.png)**Choropleth GeoJSON** Example\\
This tutorial shows how to add a styled GeoJSON overlay to the map, display a popup on click, and create a map legend.](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/)

[![Create a 3D choropleth map of Europe with countries extruded](https://docs.maptiler.com/assets/img/example-card.png)**Create a 3D choropleth map of Europe with countries extruded** Example\\
This 3D choropleth map of Europe with countries extruded uses an external dataset to provide data-driven values for the fill-extrusion-height paint property of various country polygons in a fill-extrusion layer.](https://docs.maptiler.com/sdk-js/examples/fill-extrusion/)

[![Show multiGeometry data from GeoJSON on the map](https://docs.maptiler.com/assets/img/example-card.png)**GeoJSON multiGeometry layer** Example\\
This tutorial shows how to add a GeoJSON MultiGeometry overlay to the map.](https://docs.maptiler.com/sdk-js/examples/geojson-multigeometry/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/geojson-polygon/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Show polygon data from GeoJSON on the map

GeoJSON polygon layer

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)