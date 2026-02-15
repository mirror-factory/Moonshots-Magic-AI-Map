# Geolocate control how to get the user’s location using the GPS

This tutorial provides instructions on how to deactivate the geolocate feature that displays the user’s location using either the GPS or the browser’s location.

By default, the geolocation control is enabled and included to the map with these parameters:

- enableHighAccuracy: true (uses the browser’s location, probably GPS)
- maximumAge: 0 (does not utilize any cached location data)
- timeout: 6000 (6 seconds)
- trackUserLocation: true

MapTiler Geolocate control

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/geolocate-control/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/geolocate-control/#) in the head of the document via the CDN



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


6. To disable the control and remove it from the map, all you have to do is indicate it in the map builder options.



```js

```





JavaScript



Copy


## Related examples

[![Geocoding search for POIs near the user's location](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding search for POIs near the user's location** Example\\
Geocoding control search results filter by type and given higher priority for the results near the user's location.](https://docs.maptiler.com/sdk-js/examples/geocoding-filter-types/)

[![How to change the map labels language based on visitor's location](https://docs.maptiler.com/assets/img/example-card.png)**Map language by IP** Example\\
This tutorial shows how to automatically change the map labels language based on visitor's location usign the MapTiler Geolocation API.](https://docs.maptiler.com/sdk-js/examples/ip-map-language/)

[![Change between light and dark mode based on the time of day](https://docs.maptiler.com/assets/img/example-card.png)**Change to dark mode at sunset** Example\\
This example shows how to change the map mode between light and dark based on the time of day.](https://docs.maptiler.com/sdk-js/examples/style-by-daytime/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/geolocate-control/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Geolocate control how to get the user's location using the GPS

Geolocate control (GPS)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)