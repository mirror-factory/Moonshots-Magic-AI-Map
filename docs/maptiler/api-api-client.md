# API Client![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Our map SDK is not only about maps! The SDK also wraps API calls to [MapTiler API services](https://docs.maptiler.com/cloud/api) in a series of handy functions.

The SDK uses the [API Client JS library](https://docs.maptiler.com/client-js/) under the hood and exposes its functions so that they can be used directly from the SDK.

Example

```js
// in an async function, or as a 'thenable':
const result = await maptilersdk.geocoding.forward('paris');
```

JavaScript

Copy

## [Functions](https://docs.maptiler.com/sdk-js/api/api-client/\#functions)

These are the services wrapper functions that are built-in:


- [Geocoding](https://docs.maptiler.com/client-js/geocoding/)
- [Geolocation](https://docs.maptiler.com/client-js/geolocation/)
- [Coordinates](https://docs.maptiler.com/client-js/coordinates/)
- [Data](https://docs.maptiler.com/client-js/data/)
- [Static maps](https://docs.maptiler.com/client-js/static-maps/)
- [Elevation](https://docs.maptiler.com/client-js/elevation/)
- [Math](https://docs.maptiler.com/client-js/math/)
- [Languages](https://docs.maptiler.com/client-js/languages/)

You can use any of the functions documented in the Client JS library. Check out the examples in the library's documentation.
To use these functions in the SDK, all you have to do is change `maptilerClient` by `maptilersdk`

Examples

```diff-javascript
- const result = await maptilerClient.geocoding.reverse([6.249638, 46.402056]);
+ const result = await maptilersdk.geocoding.reverse([6.249638, 46.402056]);

- const result = await maptilerClient.geolocation.info();
+ const result = await maptilersdk.geolocation.info();
```

Diff-javaScript

Copy


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Functions](https://docs.maptiler.com/sdk-js/api/api-client/#functions)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


API Client

API Client

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)