---
title: "Change map styles | JavaScript maps SDK | MapTiler SDK JS | MapTiler"
source: "https://docs.maptiler.com/sdk-js/examples/change-map-styles"
description: "This tutorial shows how to change the map styles, you can switch between the built-in maps and your own custom maps."
---

# Change map styles

This tutorial demonstrates the process of altering map styles, allowing users to seamlessly transition between the built-in maps and their customized maps. Explore the selection of pre-designed styles available in MapTiler’s library by referring to the [list of built-in styles](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstylelist).

MapTiler provides a wide range of predefined styles, enabling users to customize their maps to suit their specific preferences. Additionally, you have the option to create a completely 100% customized map using [MapTiler’s Map Designer tool](https://www.maptiler.com/cloud/customize/).

Display a map

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

STREETSSTREETS.DARKSTREETS.LIGHTSTREETS.PASTELOUTDOORWINTERSATELLITEHYBRIDDATAVIZDATAVIZ.DARKDATAVIZ.LIGHTCoffeeBeer

Using the built-in styles and their variants defined in the SDK (`maptilersdk.MapStyle`) has several advantages such as:

- If we make an update to a style, you won’t have to modify your codebase. Always use the latest version of styles.
- They are easier to remember, no need to type along the style URL. No more putting the API key in every URL.
- Code completion: reducing typos and other common mistakes.

The built-in styles generally define a purpose for which this style is the most relevant: **street navigation, outdoor adventure, minimalist dashboard**, etc. Then, each style offers a range of **variants** that contain the same level of information and have the same purpose but use different color schemes like **dark, light**, etc.

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/change-map-styles/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/change-map-styles/#) in the head of the document via the CDN



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


6. Change the map style to a hybrid satellite images.



```js

```





JavaScript



Copy

7. Create a selector to change the map style. In this example we will use some of the build-in styles. See the full [list of styles](https://docs.maptiler.com/sdk-js/examples/change-map-styles/#). Copy the following code into your HTML file.



   - `MapStyle.STREETS`, reference style for navigation and city exploration

     - `MapStyle.STREETS.DARK` (variant)
     - `MapStyle.STREETS.LIGHT` (variant)
     - `MapStyle.STREETS.PASTEL` (variant)

   - `MapStyle.OUTDOOR` reference style for adventure
   - `MapStyle.WINTER` reference style for winter adventure
   - `MapStyle.SATELLITE` reference style satellite and airborne imagery
   - `MapStyle.HYBRID` reference style satellite and airborne imagery with labels
   - `MapStyle.BASIC` reference style for minimalist design and general purpose

     - `MapStyle.BASIC.DARK` (variant)
     - `MapStyle.BASIC.LIGHT` (variant)

   - `MapStyle.DATAVIZ` the perfect style for data visualization, with very little noise

     - `MapStyle.DATAVIZ.DARK` (variant)
     - `MapStyle.DATAVIZ.LIGHT` (variant)

   - `MapStyle.BRIGHT` reference style for high contrast navigation

     - `MapStyle.BRIGHT.DARK` (variant)
     - `MapStyle.BRIGHT.LIGHT` (variant)
     - `MapStyle.BRIGHT.PASTEL` (variant)

   - `MapStyle.TOPO` reference style for topographic study

     - `MapStyle.TOPO.SHINY` (variant)
     - `MapStyle.TOPO.PASTEL` (variant)
     - `MapStyle.TOPO.TOPOGRAPHIQUE` (variant)

   - `MapStyle.VOYAGER` reference style for stylish yet minimalist maps

     - `MapStyle.VOYAGER.DARK` (variant)
     - `MapStyle.VOYAGER.LIGHT` (variant)
     - `MapStyle.VOYAGER.VINTAGE` (variant)

   - `MapStyle.TONER` reference style for very high contrast stylish maps

     - `MapStyle.TONER.BACKGROUND` (variant)
     - `MapStyle.TONER.LITE` (variant)
     - `MapStyle.TONER.LINES` (variant)

   - `MapStyle.BACKDROP` neutral greyscale style with hillshading

     - `MapStyle.BACKDROP.DARK` (variant)
     - `MapStyle.BACKDROP.LIGHT` (variant)

   - `MapStyle.OPENSTREETMAP` reference style for OpenStreetMap

```html
<select class="mapstyles-select">
  <optgroup label="Navigation and city exploration">
    <option value="STREETS">STREETS</option>
    <option value="STREETS.DARK" selected>STREETS.DARK</option>
    <option value="STREETS.LIGHT">STREETS.LIGHT</option>
    <option value="STREETS.PASTEL">STREETS.PASTEL</option>
  </optgroup>
  <option value="OUTDOOR">OUTDOOR</option>
  <option value="WINTER">WINTER</option>
  <option value="SATELLITE">SATELLITE</option>
  <option value="HYBRID">HYBRID</option>
  <optgroup label="Data visualization">
    <option value="DATAVIZ">DATAVIZ</option>
    <option value="DATAVIZ.DARK">DATAVIZ.DARK</option>
    <option value="DATAVIZ.LIGHT">DATAVIZ.LIGHT</option>
  </optgroup>
  <option value="YOUR_CUSTOM_MAP_ID_1">Custom map name 1</option>
  <option value="YOUR_CUSTOM_MAP_ID_2">Custom map name 2</option>
</select>
```

HTML

Copy

8. Change the style when the user select one style.



```js
document.querySelector('.mapstyles-select').addEventListener('change', (e) => {
     const style_code = e.target.value.split(".");
     style_code.length === 2 ?
       map.setStyle(maptilersdk.MapStyle[style_code[0]][style_code[1]]) :
       map.setStyle(maptilersdk.MapStyle[style_code[0]] || style_code[0]);
});
```





JavaScript



Copy

9. Create the layer selector style. Add the selector style to your stylesheet.

```css
.mapstyles-select {
  position: relative;
  top: 5px;
  left: 5px;
  z-index: 1000;
}
```

CSS

Copy

View complete source code

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Display a map</title>
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

    .mapstyles-select {
      position: relative;
      top: 5px;
      left: 5px;
      z-index: 1000;
    }
  </style>
</head>

<body>
  <div id="map">

  </div>
  <select class="mapstyles-select">
    <optgroup label="Navigation and city exploration">
      <option value="STREETS">STREETS</option>
      <option value="STREETS.DARK" selected>STREETS.DARK</option>
      <option value="STREETS.LIGHT">STREETS.LIGHT</option>
      <option value="STREETS.PASTEL">STREETS.PASTEL</option>
    </optgroup>
    <option value="OUTDOOR">OUTDOOR</option>
    <option value="WINTER">WINTER</option>
    <option value="SATELLITE">SATELLITE</option>
    <option value="HYBRID">HYBRID</option>
    <optgroup label="Data visualization">
      <option value="DATAVIZ">DATAVIZ</option>
      <option value="DATAVIZ.DARK">DATAVIZ.DARK</option>
      <option value="DATAVIZ.LIGHT">DATAVIZ.LIGHT</option>
    </optgroup>
    <option value="e4e704fd-bdaa-4a54-a6d5-50f1b07d9d68">Coffee</option>
    <option value="f38285f4-f75f-486a-9127-0cc7a7358ae6">Beer</option>
  </select>
  <script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
      container: 'map', // container id
      style: maptilersdk.MapStyle.STREETS.DARK,
      center: [11.5786, 48.0968], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });
    document.querySelector('.mapstyles-select').addEventListener('change', (e) => {
      const style_code = e.target.value.split(".");
      style_code.length === 2 ?
        map.setStyle(maptilersdk.MapStyle[style_code[0]][style_code[1]]) :
        map.setStyle(maptilersdk.MapStyle[style_code[0]] || style_code[0]);
    });
  </script>
</body>

</html>
```

HTML

Copy

## Learn more

If you want to switch between built-in styles see this example [Built-in map styles](https://docs.maptiler.com/sdk-js/examples/built-in-styles/).

Check out this tutorial [How to display a style switcher control](https://docs.maptiler.com/sdk-js/examples/control-style-switcher/) to learn how to create a visual style switcher control.

## Related examples

[![Built-in map styles](https://docs.maptiler.com/assets/img/example-card.png)**Built-in map styles** Example\\
Our built-in styles are designed to make it easier for you to create beautiful maps, without the need for extra coding or worrying about outdated versions.](https://docs.maptiler.com/sdk-js/examples/built-in-styles/)

[![How to display a style switcher control](https://docs.maptiler.com/assets/img/example-card.png)**Style switcher** Example\\
This tutorial shows how to add and display a style switcher control on the map.](https://docs.maptiler.com/sdk-js/examples/control-style-switcher/)

[![Set dark mode based on system settings](https://docs.maptiler.com/assets/img/example-card.png)**Set dark mode based on system settings** Example\\
This example shows how to change the map mode (light/dark) based on system settings.](https://docs.maptiler.com/sdk-js/examples/style-by-settings/)

[![How to change the default map labels language](https://docs.maptiler.com/assets/img/example-card.png)**Set map language** Example\\
This tutorial shows how to change the default map labels language.](https://docs.maptiler.com/sdk-js/examples/language-map/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/sdk-js/examples/change-map-styles/#learn-more)
- [Related examples](https://docs.maptiler.com/sdk-js/examples/change-map-styles/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Change map styles

Change map styles

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)