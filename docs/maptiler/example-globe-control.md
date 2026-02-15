# Projection control how to toggle the map between mercator and globe projection

This tutorial provides instructions on how to add the projection control that toggles the map between “mercator” and “globe” projection.

MapTiler Projection control

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/globe-control/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/globe-control/#) in the head of the document via the CDN



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


6. To add the control to the map, all you have to do is indicate it in the map builder options.



```js

```





JavaScript



Copy


## Related examples

[![How to turn on the globe projection](https://docs.maptiler.com/assets/img/example-card.png)**Globe projection** Example\\
Specify the map projection to view the map in a 3D globe.](https://docs.maptiler.com/sdk-js/examples/globe-projection/)

[![Create a globe map with ocean bathymetry terrain elevation](https://docs.maptiler.com/assets/img/example-card.png)**Globe with ocean bathymetry** Example\\
Create a globe map with ocean bathymetry terrain elevation.](https://docs.maptiler.com/sdk-js/examples/globe-bathymetry/)

[![Add a 3D model to globe using MapTiler 3D JS](https://docs.maptiler.com/assets/img/example-card.png)**Add a 3D model to globe using MapTiler 3D JS** Example\\
Add a 3D model to globe using MapTiler 3D JS module.](https://docs.maptiler.com/sdk-js/examples/globe-3d-model/)

[![Create a globe map with 3D terrain elevation](https://docs.maptiler.com/assets/img/example-card.png)**Globe with elevation terrain** Example\\
Create a globe map with 3D terrain elevation.](https://docs.maptiler.com/sdk-js/examples/globe-terrain/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/globe-control/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Projection control how to toggle the map between mercator and globe projection

Projection control (globe)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)