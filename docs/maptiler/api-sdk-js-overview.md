# MapTiler SDK JS

![NpmLogo](https://docs.maptiler.com/assets/img/npm.svg)[Get it from npm registry](https://www.npmjs.com/package/@maptiler/sdk)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[View source code on GitHub](https://github.com/maptiler/maptiler-sdk-js)

MapTiler SDK JS is your complete toolkit for building web maps. At its core, it bundles everything needed to render interactive maps in the browser. On top of that, it provides features to make integration of MapTiler [maps](https://www.maptiler.com/maps/) and [API services](https://docs.maptiler.com/cloud/api/) as easy as possible. It’s also open-source so you can check how it handles your data under the hood.

#### Designed for frontend devs

This SDK was built for JavaScript developers who work on map-based web applications. Focus on your app while the SDK handles all the heavy lifting! _If you only need a specific [location service](https://docs.maptiler.com/guides/location-services/) without a map, using our [APIs](https://docs.maptiler.com/cloud/api/) directly or via [JS client](https://docs.maptiler.com/api-clients/) might be a lighter fit._

#### In-built maps

MapTiler SDK JS comes with built-in [map styles](https://www.maptiler.com/maps/) to pick from, showing detailed street-level information, 3D terrain, and satellite imagery for the entire world. Each map can be displayed in either [flat (Mercator) or globe projection](https://docs.maptiler.com/sdk-js/#projection).

#### Rich data visualization

Your data can be displayed in many ways, from simple maps with markers to dynamic heatmaps and filtered visualizations of millions of features, all using WebGL technology in a browser. There’s [hundreds of code examples](https://docs.maptiler.com/sdk-js/examples) for inspiration.

#### Modules for added functions

The SDK has many modules with pre-built functions, so it’s possible to quickly implement search and other geocoding features, show 3D models in the maps, build weather applications, and much more. Check out [all modules](https://docs.maptiler.com/sdk-js/modules/).

#### Favorable usage tracking

MapTiler SDK JS by default uses the **session-based** model of tracking map usage. To learn more about what this means, how it affects your map traffic billing, and how to change the model if desired, go to [Map usage: Sessions vs requests.](https://docs.maptiler.com/guides/maps-apis/maps-platform/tile-requests-and-map-sessions-compared/)

#### Open source at heart

The core of MapTiler SDK JS is MapLibre GL JS, an open-source web map library based on WebGL. Our SDK extends MapLibre GL JS with functions related to the MapTiler mapping platform. MapTiler SDK JS itself has [public source code](https://github.com/maptiler/maptiler-sdk-js) and is BSD-licensed.

### Examples

Browse code examples

[Go to examples](https://docs.maptiler.com/sdk-js/examples)

### Modules

Get ready-to-use functions

[Go to modules](https://docs.maptiler.com/sdk-js/modules)

### Reference

Read full SDK JS reference

[Go to reference](https://docs.maptiler.com/sdk-js/api)

## Get started

To integrate a map using MapTiler SDK JS, simply use the code below the map.

For a more detailed tutorial on how to initialize a map and load the style, see [Learn the basics – How to use the MapTiler SDK JS](https://docs.maptiler.com/sdk-js/examples/how-to-use/).

Display a map

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

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/#) in the head of the document via the CDN



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

## Map projection

The **Web Mercator projection** has been the go-to standard in cartography since the early days of web mapping. It is great for navigation and shows the entire world in one screen, with no hidden face. However, Mercator’s heavy distortion at high latitudes and discontinuity at the poles can be a limitation for data visualization. There’s been also criticism of providing a biased view of the world. Learn more about Mercator projection on [_Wikipedia_](https://en.wikipedia.org/wiki/Web_Mercator_projection).

The **globe projection**, available from MapTiler SDK v3, does not suffer from these biases and can feel overall more playfull than Mercator. It’s a great choice for semi-global data visualization, especially for data close to the poles, thanks to its geographic continuity.

To learn how to set the projection in your map using SDK JS, see the related [projection examples](https://docs.maptiler.com/sdk-js/examples/?q=projection).

| Mercator projection | Globe projection |
| --- | --- |
| ![](https://docs.maptiler.com/sdk-js/assets/mercator_projection.jpeg) | ![](https://docs.maptiler.com/sdk-js/assets/globe_projection.jpeg) |


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Get started](https://docs.maptiler.com/sdk-js/#get-started)
- [Map projection](https://docs.maptiler.com/sdk-js/#map-projection)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler SDK JS

Home

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)