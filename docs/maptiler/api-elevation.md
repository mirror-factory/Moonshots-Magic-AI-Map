---
title: "Elevation API | MapTiler API | MapTiler"
source: "https://docs.maptiler.com/cloud/api/elevation"
description: "Maps API Reference for developers | Elevation API"
---

# Elevation API

The MapTiler **Elevation API** makes it possible to get accurate altitude above mean sea level for any place on Earth. See the [intro to elevation](https://docs.maptiler.com/guides/location-services/elevation/) to learn how it works and what you can use it for.

## How to use the API

- Directly from your web or backend applications.
- Via the [Elevation API client](https://docs.maptiler.com/client-js/elevation/) library, which wraps the API calls in ready-made functions for easier use in JavaScript. This is the best option if you don’t need a map.
- With our complete map SDK for JavaScript. It provides an [elevation profile module](https://docs.maptiler.com/sdk-js/modules/elevation-profile/) to add a control to your map which draws the elevation profile for a specified route.

You need a **MapTiler API key** to use this service.
[Get it here](https://cloud.maptiler.com/account/keys/)
and
[learn how to protect it](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/).

You can get elevation for a single point or multiple points at once by providing their coordinates. Note that each pair of coordinates counts separately towards [your API quota](https://cloud.maptiler.com/account/).

* * *

## [Get elevation](https://docs.maptiler.com/cloud/api/elevation/\#get-elevation)

GET https://api.maptiler.com/elevation/{locations}.json

Get the elevation at given locations. If _unit_ is omitted, elevation values are in meters.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| locations | string | List of `lng,lat` WGS 84 positions seperated by `;` delimeter (Max 50 positions). Longitude values must be `> -180 < 180`. Latitudes must be `>= -85 <= 85`.<br>Example: `17,50;-133.5,58.39` |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| unit | string | Unit of the elevation.<br>Allowed values: <br>`meters``feet`<br>Default: `meters` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [ElevationResults](https://docs.maptiler.com/cloud/api/elevation/#ElevationResults) |
| 400 |  | Out of bounds |

## [ElevationResults](https://docs.maptiler.com/cloud/api/elevation/\#ElevationResults)

Array of locations with elevation `[lng, lat, ele]`

Array of array
(3 items)
\[number\]

### ElevationResults example

```json
[\
  [17, 50, 364.20001220703125],\
  [-133.5, 58.39, 1323.800048828125]\
]
```

JSON

Copy

![](https://docs.maptiler.com/assets/img/open-api.png)

Using the OpenAPI Specification?

Get the [openapi.yaml](https://docs.maptiler.com/_data/cloud/api/openapi.yml)

On this page

- [How to use the API](https://docs.maptiler.com/cloud/api/elevation/#how-to-use-the-api)
- [Get elevation](https://docs.maptiler.com/cloud/api/elevation/#get-elevation)
- [ElevationResults](https://docs.maptiler.com/cloud/api/elevation/#ElevationResults)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler Cloud API


Elevation API

Elevation API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)