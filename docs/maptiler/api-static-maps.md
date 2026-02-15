---
title: "Static maps API | MapTiler API | MapTiler"
source: "https://docs.maptiler.com/cloud/api/static-maps"
description: "Maps API Reference for developers | Static maps API"
---

# Static maps API

**Static maps API** makes it possible to use our maps as non-interactive, non-zoomable images. Adding [markers](https://docs.maptiler.com/guides/maps-apis/static-maps/static-map-with-markers/) or [lines](https://docs.maptiler.com/guides/maps-apis/static-maps/static-map-with-lines/) to static maps is also supported.

Static maps **don't work with a free plan**. Get them with [any paid plan](https://www.maptiler.com/cloud/pricing/), including our most affordable tier.

### How to use the API

- Directly
- With the [Static maps Client JS](https://docs.maptiler.com/client-js/static-maps/) library

You need a **MapTiler API key** to use this service.
[Get it here](https://cloud.maptiler.com/account/keys/)
and
[learn how to protect it](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/).

### Getting started

- Use our [visual generator](https://www.maptiler.com/cloud/static-maps/generator/) to test the API and quickly build your static map’s URL.
- See the [static maps guide](https://docs.maptiler.com/guides/maps-apis/static-maps/static-maps-for-your-web/) to learn how to configure static maps and see practical usage examples.
- Learn how to [make a map non-interactive](https://docs.maptiler.com/sdk-js/examples/interactive-false/) with MapTiler SDK JS.

* * *

## [Center-based image](https://docs.maptiler.com/cloud/api/static-maps/\#center-based-image)

GET https://api.maptiler.com/maps/{mapId}/static/{lon},{lat},{zoom}/{width}x{height}{scale}.{format}

Generates a raster image based on the specified center and zoom level.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |
| lon | number | Longitude of the center of the image. |
| lat | number | Latitude of the center of the image. |
| zoom | number | Zoom level of the resulting image (can be fractional). (In the tile pyramid based on 512x512 tiles.) |
| width | integer | Width of the image in pixels.<br>`>= 1``<= 2048` |
| height | integer | Height of the image in pixels.<br>`>= 1``<= 2048` |
| scale | string | Use “@2x” to get “retina”/HiDPI image.<br>Allowed values: <br>`@2x` |
| format | string | Allowed values: <br>`png``jpg``webp` |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| path | string | Define path(s) to be drawn on top of the map. Can be used multiple times. See [Static map with lines or polygons](https://docs.maptiler.com/guides/maps-apis/static-maps/static-map-with-lines/).<br>Match pattern: `((fill|stroke|width|shortest)\:[^\|]+\|)*((enc:.+)|((-?\d+\.?\d*,-?\d+\.?\d*\|)+(-?\d+\.?\d*,-?\d+\.?\d*)))` |
| markers | string | Define marker(s) to be drawn on top of the map. Can be used multiple times. See [Static map with markers](https://docs.maptiler.com/guides/maps-apis/static-maps/static-map-with-markers/).<br>Match pattern: `((icon|anchor|scale)\:[^\|]+\|)*((-?\d+\.?\d*,-?\d+\.?\d*(,[^\|]+)?\|)*(-?\d+\.?\d*,-?\d+\.?\d*(,[^\|]+)?))` |
| latlng | boolean | Use \[latitude, longitude\] order for coordinates instead of \[longitude, latitude\].<br>Default: `false` |
| attribution | string | Changes the position of map attribution. If you disable the attribution make sure to display it in your application yourself (visibly).<br>Allowed values: <br>`bottomright``bottomleft``topleft``topright``false`<br>Default: `bottomright` |
| fill | string | Color to use as a fill when drawing polygons. Deprecated, use “path” instead.<br>Default: `rgba(255,255,255,0.4)` |
| stroke | string | Color to use as a stroke when drawing polygons. Deprecated, use “path” instead.<br>Default: `rgba(0,64,255,0.7)` |
| width | number | Width of the stroke line when drawing polygons (in pixels). Deprecated, use “path” instead.<br>Default: `1` |
| encodedpath | string | Path in [Google Encoded Polyline Format](https://developers.google.com/maps/documentation/utilities/polylinealgorithm). Deprecated, use “path” instead. |
| shortest | boolean | Draw the shortest paths, allow to cross the dateline.<br>Default: `false` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | image/\* |  |
| 400 |  | Out of bounds / Invalid format / Invalid image size |
| 403 |  | Key is missing, invalid or restricted |
| 404 |  | The item does not exist |
| 414 |  | URI Too Long. Maximum allowed length is 8192 bytes. |

## [Bounds-based image](https://docs.maptiler.com/cloud/api/static-maps/\#bounds-based-image)

GET https://api.maptiler.com/maps/{mapId}/static/{minx},{miny},{maxx},{maxy}/{width}x{height}{scale}.{format}

Generates a raster image based on the given bounds.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |
| minx | number | Longitude of the left (west) edge. |
| miny | number | Latitude of the bottom (south) edge. |
| maxx | number | Longitude of the right (east) edge. |
| maxy | number | Latitude of the top (north) edge. |
| width | integer | Width of the image in pixels.<br>`>= 1``<= 2048` |
| height | integer | Height of the image in pixels.<br>`>= 1``<= 2048` |
| scale | string | Use “@2x” to get “retina”/HiDPI image.<br>Allowed values: <br>`@2x` |
| format | string | Allowed values: <br>`png``jpg``webp` |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| padding | number | Ensures the autofitted bounds or features are comfortably visible in the resulting area. E.g. use 0.1 to add 10% margin (at least) of the size to each side.<br>Default: `0.1` |
| path | string | Define path(s) to be drawn on top of the map. Can be used multiple times. See [Static map with lines or polygons](https://docs.maptiler.com/guides/maps-apis/static-maps/static-map-with-lines/).<br>Match pattern: `((fill|stroke|width|shortest)\:[^\|]+\|)*((enc:.+)|((-?\d+\.?\d*,-?\d+\.?\d*\|)+(-?\d+\.?\d*,-?\d+\.?\d*)))` |
| markers | string | Define marker(s) to be drawn on top of the map. Can be used multiple times. See [Static map with markers](https://docs.maptiler.com/guides/maps-apis/static-maps/static-map-with-markers/).<br>Match pattern: `((icon|anchor|scale)\:[^\|]+\|)*((-?\d+\.?\d*,-?\d+\.?\d*(,[^\|]+)?\|)*(-?\d+\.?\d*,-?\d+\.?\d*(,[^\|]+)?))` |
| latlng | boolean | Use \[latitude, longitude\] order for coordinates instead of \[longitude, latitude\].<br>Default: `false` |
| attribution | string | Changes the position of map attribution. If you disable the attribution make sure to display it in your application yourself (visibly).<br>Allowed values: <br>`bottomright``bottomleft``topleft``topright``false`<br>Default: `bottomright` |
| fill | string | Color to use as a fill when drawing polygons. Deprecated, use “path” instead.<br>Default: `rgba(255,255,255,0.4)` |
| stroke | string | Color to use as a stroke when drawing polygons. Deprecated, use “path” instead.<br>Default: `rgba(0,64,255,0.7)` |
| width | number | Width of the stroke line when drawing polygons (in pixels). Deprecated, use “path” instead.<br>Default: `1` |
| encodedpath | string | Path in [Google Encoded Polyline Format](https://developers.google.com/maps/documentation/utilities/polylinealgorithm). Deprecated, use “path” instead. |
| shortest | boolean | Draw the shortest paths, allow to cross the dateline.<br>Default: `false` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | image/\* |  |
| 400 |  | Out of bounds / Invalid format / Invalid image size |
| 403 |  | Key is missing, invalid or restricted |
| 404 |  | The item does not exist |
| 414 |  | URI Too Long. Maximum allowed length is 8192 bytes. |

## [Auto-fitted image](https://docs.maptiler.com/cloud/api/static-maps/\#auto-fitted-image)

GET https://api.maptiler.com/maps/{mapId}/static/auto/{width}x{height}{scale}.{format}

Generates a raster image based on the given features. The area is calculated so that all the paths and markers given in query are visible.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |
| width | integer | Width of the image in pixels.<br>`>= 1``<= 2048` |
| height | integer | Height of the image in pixels.<br>`>= 1``<= 2048` |
| scale | string | Use “@2x” to get “retina”/HiDPI image.<br>Allowed values: <br>`@2x` |
| format | string | Allowed values: <br>`png``jpg``webp` |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| padding | number | Ensures the autofitted bounds or features are comfortably visible in the resulting area. E.g. use 0.1 to add 10% margin (at least) of the size to each side.<br>Default: `0.1` |
| path | string | Define path(s) to be drawn on top of the map. Can be used multiple times. See [Static map with lines or polygons](https://docs.maptiler.com/guides/maps-apis/static-maps/static-map-with-lines/).<br>Match pattern: `((fill|stroke|width|shortest)\:[^\|]+\|)*((enc:.+)|((-?\d+\.?\d*,-?\d+\.?\d*\|)+(-?\d+\.?\d*,-?\d+\.?\d*)))` |
| markers | string | Define marker(s) to be drawn on top of the map. Can be used multiple times. See [Static map with markers](https://docs.maptiler.com/guides/maps-apis/static-maps/static-map-with-markers/).<br>Match pattern: `((icon|anchor|scale)\:[^\|]+\|)*((-?\d+\.?\d*,-?\d+\.?\d*(,[^\|]+)?\|)*(-?\d+\.?\d*,-?\d+\.?\d*(,[^\|]+)?))` |
| latlng | boolean | Use \[latitude, longitude\] order for coordinates instead of \[longitude, latitude\].<br>Default: `false` |
| attribution | string | Changes the position of map attribution. If you disable the attribution make sure to display it in your application yourself (visibly).<br>Allowed values: <br>`bottomright``bottomleft``topleft``topright``false`<br>Default: `bottomright` |
| fill | string | Color to use as a fill when drawing polygons. Deprecated, use “path” instead.<br>Default: `rgba(255,255,255,0.4)` |
| stroke | string | Color to use as a stroke when drawing polygons. Deprecated, use “path” instead.<br>Default: `rgba(0,64,255,0.7)` |
| width | number | Width of the stroke line when drawing polygons (in pixels). Deprecated, use “path” instead.<br>Default: `1` |
| encodedpath | string | Path in [Google Encoded Polyline Format](https://developers.google.com/maps/documentation/utilities/polylinealgorithm). Deprecated, use “path” instead. |
| shortest | boolean | Draw the shortest paths, allow to cross the dateline.<br>Default: `false` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | image/\* |  |
| 400 |  | Out of bounds / Invalid format / Invalid image size |
| 403 |  | Key is missing, invalid or restricted |
| 404 |  | The item does not exist |
| 414 |  | URI Too Long. Maximum allowed length is 8192 bytes. |

![](https://docs.maptiler.com/assets/img/open-api.png)

Using the OpenAPI Specification?

Get the [openapi.yaml](https://docs.maptiler.com/_data/cloud/api/openapi.yml)

On this page

- [Center-based image](https://docs.maptiler.com/cloud/api/static-maps/#center-based-image)
- [Bounds-based image](https://docs.maptiler.com/cloud/api/static-maps/#bounds-based-image)
- [Auto-fitted image](https://docs.maptiler.com/cloud/api/static-maps/#auto-fitted-image)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler API


Static maps API

Static maps API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)