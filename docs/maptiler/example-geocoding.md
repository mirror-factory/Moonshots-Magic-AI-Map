# Geocoding: Show place search results

This tutorial shows how you can use place search using the [MapTiler Geocoding API](https://www.maptiler.com/cloud/geocoding/). The resultant map application takes a search query from the URL and displays the search results on the map, zooming in on the first result.

Search a placename

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

The map shows as a red dot the first search result for **“Austin”**.

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/geocoding/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/geocoding/#) in the head of the document via the CDN



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


6. Get the query string of the map URL.



```js

```





JavaScript



Copy

7. Create the map layer where we will display the search results.



```js

```





JavaScript



Copy

8. Check if the search parameter called `q` exists. If it exists, call the forward geocoding function with the value of the parameter `q`.



```js

```





JavaScript



Copy

9. Show the results on the map and zoom in on the first result.



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
  <title>Search a placename</title>
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
      const urlParams = new URLSearchParams(window.location.search);
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS,
        center: [-97.7485, 30.2711], // starting position [lng, lat]
        zoom: 11.7, // starting zoom
      });
      map.on('load', async () => {
        map.addSource('search-results', {
            type: 'geojson',
            data: {
                "type": "FeatureCollection",
                "features": []
            }
        });
        map.addLayer({
            'id': 'point-result',
            'type': 'circle',
            'source': 'search-results',
            'paint': {
                'circle-radius': 8,
                'circle-color': '#B42222',
                'circle-opacity': 0.5
            },
            'filter': ['==', '$type', 'Point']
        });
        if (urlParams.get('q')) {
          const results = await maptilersdk.geocoding.forward(urlParams.get('q'));
          map.getSource('search-results').setData(results);
          if (results.features[0]) {
            map.fitBounds(results.features[0].bbox, {maxZoom: 19})
          }
        }
      });
  </script>
</body>
</html>
```

HTML

Copy

## Learn more

Check out the tutorials on [How to search places using the geocoder component](https://docs.maptiler.com/sdk-js/examples/geocoder-component/) and [How to search places by coordinates (reverse geocoding)](https://docs.maptiler.com/sdk-js/examples/reverse-geocoding/).

Visit the [MapTiler Geocoding API reference](https://docs.maptiler.com/cloud/api/geocoding/) for all search options. For example specifying the language of the results, etc.

If you want to learn how to display the search results in a list, check out the [Reverse Geocoding](https://docs.maptiler.com/sdk-js/examples/reverse-geocoding/) tutorial (point 6 onwards).

## Related examples

[![Geocoding: Add place search to map](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding control** Example\\
This tutorial shows how to search for places using the geocoding control.](https://docs.maptiler.com/sdk-js/examples/geocoder-component/)

[![How to search places by coordinates (reverse geocoding)](https://docs.maptiler.com/assets/img/example-card.png)**Reverse geocoding** Example\\
This tutorial shows how to search places by coordinates (reverse geocoding).](https://docs.maptiler.com/sdk-js/examples/reverse-geocoding/)

[![How to specify the geocoding control language(s) response text and prioritization](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding language** Example\\
Specify the geocoding control language(s) that are used for the response text and weighting of the query results.](https://docs.maptiler.com/sdk-js/examples/geocoding-language/)

[![Geocoding limit results by area (bounding box)](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding limit results by area** Example\\
Limit the search results of the geocoding control to the specific area (bounding box).](https://docs.maptiler.com/sdk-js/examples/geocoding-filter-bbox/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/geocoding/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/geocoding/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Geocoding: Show place search results

Geocoding API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)