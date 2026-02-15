---
title: "Config | JavaScript maps SDK | MapTiler SDK JS | MapTiler"
source: "https://docs.maptiler.com/sdk-js/api/config"
description: "JavaScript maps SDK | Home Platform updates Getting started How maps work Maps, tiles, data Zoomable maps Coordinate systems Raster vs vector tiles Vector..."
---

# Config

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/config.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/config.ts)

The `config` object represents the SDK global settings.
It exposes properties and options that make it easier to define some values that the SDK will use globally,
such as the API key, the map units, etc.

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

Example

```js
import * as maptilersdk from '@maptiler/sdk';

maptilersdk.config.apiKey = "YOUR_MAPTILER_API_KEY_HERE";
maptilersdk.config.primaryLanguage = maptilersdk.Language.FRENCH;
```

JavaScript

Copy

## [Properties](https://docs.maptiler.com/sdk-js/api/config/\#properties)

| apiKey<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: `""` | Gets and sets the [MapTiler API key](https://cloud.maptiler.com/account/keys/).<br> Emits the `apiKey` event when updated. |
| caching<br> <br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: `true` | Starting from v2, MapTiler SDK introduced the **caching** of tiles and fonts served by MapTiler,<br>which can represent a large chunk of the data being fetched when browsing a map. <br>This caching leverages modern browsers caching API so it's well-managed and there is no risk of <br>bloating! When we update **MapTiler Planet** or our **official styles**, <br>the caching logic will detect it and automatically invalidate older versions of the tiles that <br>were previously cached.<br>Caching greatly improves the performance at load time and positively impact the user experience, <br>for this reason, it is **enabled by default**. <br>If for debugging purposes or a for a very specific use-case caching needs to be disabled, <br>then it possible. |
| session<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: `true` | Setting on whether of not the SDK runs with a session logic.<br> A **"session"** is started at the initialization of the SDK and finished when the browser page<br> is being refreshed.<br> When session is enabled, the extra URL param mtsid is added to queries on the MapTiler API.<br> <br>This allows MapTiler to enable **"session based billing"**. |
| units<br>[Unit](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/types.ts)<br>default: `metric` | Gets and sets the map units.<br> When updated, it emits the `unit` event that is caught inside of the<br> map instances.<br> <br>Example: to update the scale control |
| primaryLanguage<br>[LanguageString](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/language.ts)<br>default: `Language.AUTO` | Sets the map primary language, use when a Map instance is created.<br> <br>(default: the language of the web browser is used) |
| fetch<br>FetchFunction | Gets and sets a the custom fetch function to replace the default one.<br> If the `fetch()` function exists (browser or Node >= 18) then it will<br> be resolved automatically.<br> A custom `fetch()` function can be provided for early Node versions<br> (Node < 18). |
| telemetry<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: `true` | The telemetry is very valuable to the team at MapTiler because it shares information <br>about where to add the extra effort. <br>It also helps spotting some incompatibility issues that may arise between the SDK <br>and a specific version of a module.<br> <br>It consists in sending metrics about usage of the following features:<br> <br>- SDK version \[string\]<br>- API key \[string\]<br>- MapTiler sesion ID (if opted-in) \[string\]<br>- if tile caching is enabled \[boolean\]<br>- if language specified at initialization \[boolean\]<br>- if terrain is activated at initialization \[boolean\]<br>- if globe projection is activated at initialization \[boolean\]<br>In addition, each official module will be added to a list, alongside its version number.<br> <br>Telemetry is enabled by default but can be opted-out by setting to `false`.<br> <br>```js<br>import * as maptilersdk from '@maptiler/sdk';<br>maptilersdk.config.telemetry = false;<br>```<br>JavaScript<br>Copy |


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Properties](https://docs.maptiler.com/sdk-js/api/config/#properties)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Config

Config

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)