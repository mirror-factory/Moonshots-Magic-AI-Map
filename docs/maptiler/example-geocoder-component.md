# Geocoding: Add place search to map

This tutorial shows how to use the [geocoding control](https://docs.maptiler.com/sdk-js/modules/geocoding/) module to add a **place search box** to your map or another application.

MapTiler Geocoding control

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/geocoder-component/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/geocoder-component/#) in the head of the document via the CDN



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


1. Include the geocoder component JavaScript and CSS files in the `<head>` of your HTML file.



```html
<script src="https://cdn.maptiler.com/maptiler-geocoding-control/v2.1.7/maptilersdk.umd.js"></script>
<link href="https://cdn.maptiler.com/maptiler-geocoding-control/v2.1.7/style.css" rel="stylesheet">
```





HTML



Copy

2. Add the geocoder control to the map.



```js

```





JavaScript



Copy


6. Install the Geocoding control using npm.



```bash
npm install --save @maptiler/geocoding-control
```





Bash



Copy

7. Import the Geocoding control component and CSS in your mapping application.



```js

```





JavaScript



Copy

8. Add the geocoder control to the map.



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
  <title>MapTiler Geocoding control</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet">
  <script src="https://cdn.maptiler.com/maptiler-geocoding-control/v2.1.7/maptilersdk.umd.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-geocoding-control/v2.1.7/style.css" rel="stylesheet">
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
        center: [16.62662018, 49.2125578], // starting position [lng, lat]
        zoom: 14, // starting zoom
      });

      const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({});

      map.addControl(gc, 'top-left');
  </script>
</body>
</html>
```

HTML

Copy

## Related examples

[![Geocoding: Show place search results](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding API** Example\\
This tutorial shows how to search places using the MapTiler Geocoding API.](https://docs.maptiler.com/sdk-js/examples/geocoding/)

[![How to search places by coordinates (reverse geocoding)](https://docs.maptiler.com/assets/img/example-card.png)**Reverse geocoding** Example\\
This tutorial shows how to search places by coordinates (reverse geocoding).](https://docs.maptiler.com/sdk-js/examples/reverse-geocoding/)

[![Geocoding search results closer to specific point](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding search results by proximity to a specific point** Example\\
Geocoding control search results closer to the specific geographical point, results near the provided point are ranked higher.](https://docs.maptiler.com/sdk-js/examples/geocoding-filter-proximity/)

[![Geocoding search results to specified country(ies)](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding search results to specified country(ies)** Example\\
Geocoding control limit search results to specified country(ies).](https://docs.maptiler.com/sdk-js/examples/geocoding-filter-country/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/geocoder-component/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Geocoding: Add place search to map

Geocoding control

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)