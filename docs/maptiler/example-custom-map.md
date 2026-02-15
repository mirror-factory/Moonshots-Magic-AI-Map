# How to display your custom map on the web page.

This tutorial shows the process of displaying a customized map on a webpage by utilizing MapTiler.

With [MapTiler’s customization tool](https://www.maptiler.com/cloud/customize/), you can craft fully customized interactive web maps. Stand out from your competitors and enhance the quality of your web mapping applications. Take your mapping experience to the next level.

Display a custom map

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

To create your first customized map, check out the [How to create a custom map](https://docs.maptiler.com/guides/general/how-to-create-custom-map/) tutorial.

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/custom-map/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/custom-map/#) in the head of the document via the CDN



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


6. Replace the style with your custom map style. Check the [Publish the map](https://docs.maptiler.com/guides/general/how-to-create-custom-map/#publish-the-map) section to get the URL of your custom style.



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
    <title>Display a custom map</title>
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
        style: 'YOUR_CUSTOM_MAP_ID',
        center: [10.989249486220501, 46.948652944430734], // starting position [lng, lat]
        zoom: 11, // starting zoom
        });
    </script>
</body>
</html>
```

HTML

Copy

## Learn more

Check out this tutorial [How to create a custom map](https://docs.maptiler.com/guides/general/how-to-create-custom-map/) to learn how to create the map of the ski slopes of the online demo.

## Related examples

[![Built-in map styles](https://docs.maptiler.com/assets/img/example-card.png)**Built-in map styles** Example\\
Our built-in styles are designed to make it easier for you to create beautiful maps, without the need for extra coding or worrying about outdated versions.](https://docs.maptiler.com/sdk-js/examples/built-in-styles/)

[![How to change the default map labels language](https://docs.maptiler.com/assets/img/example-card.png)**Set map language** Example\\
This tutorial shows how to change the default map labels language.](https://docs.maptiler.com/sdk-js/examples/language-map/)

[![Add a raster tile source](https://docs.maptiler.com/assets/img/example-card.png)**Add a raster tile source** Example\\
Add a third-party raster source to the map.](https://docs.maptiler.com/sdk-js/examples/map-tiles/)

[![Ocean bathymetry 3D](https://docs.maptiler.com/assets/img/example-card.png)**Ocean bathymetry 3D** Example\\
Show a detailed 3D map of the ocean seafloor and bathymetry.](https://docs.maptiler.com/sdk-js/examples/ocean-bathymetry/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/custom-map/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/custom-map/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to display your custom map on the web page.

Custom map

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)