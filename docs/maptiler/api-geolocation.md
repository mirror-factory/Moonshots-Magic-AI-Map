---
title: "Geolocation API | MapTiler API | MapTiler"
source: "https://docs.maptiler.com/cloud/api/geolocation"
description: "Maps API Reference for developers | Geolocation API"
---

# Geolocation API

The MapTiler **Geolocation API** makes it possible to get approximate location of the incoming request, so you can localize your maps and applications. See the [intro to IP geolocation](https://docs.maptiler.com/guides/location-services/elevation/) to learn how geolocation works and what you can use it for.

## How to use the API

- Directly from your web or backend applications.
- Via the [Geolocation API client](https://docs.maptiler.com/client-js/geolocation/) library, which wraps the API calls in ready-made functions for easier use in JavaScript. Recommended if you don’t need a map.
- With our complete map [SDK JS](https://docs.maptiler.com/sdk-js/). This is the best choice if you want the geolocation service plus a map. See related [code examples](https://docs.maptiler.com/sdk-js/examples/?q=geolocation) for inspiration.

You need a **MapTiler API key** to use this service.
[Get it here](https://cloud.maptiler.com/account/keys/)
and
[learn how to protect it](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/).

* * *

## [IP Geolocation](https://docs.maptiler.com/cloud/api/geolocation/\#ip-geolocation)

GET https://api.maptiler.com/geolocation/ip.json

Obtain information about visitor's location based on IP address of the incoming request.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| elevation | boolean | Include elevation (in meters) in the results.<br>Default: `false` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [GeolocationResult](https://docs.maptiler.com/cloud/api/geolocation/#GeolocationResult) |
| 403 |  | Key is missing, invalid or restricted |

## [GeolocationResult](https://docs.maptiler.com/cloud/api/geolocation/\#GeolocationResult)

| Property | Type | Description |
| --- | --- | --- |
| country | string | Name of the country<br>Example: `Switzerland` |
| country\_code | string | Two-letter code of the country<br>[ISO 3166-1 alpha-2 codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)<br>Example: `CH` |
| country\_bounds | array \[`= 4`number\] | Bounds of the country in WGS84 degrees `[west, south, east, north]`.<br>Example: `[5.95538,45.818852,10.490936,47.809357]` |
| country\_languages | array \[string\] | Official country languages in ISO 639-1 format.<br>[ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)<br>Example: `["de","fr","it"]` |
| continent | string | Name of the continent<br>Example: `Europe` |
| continent\_code | string | Two-letter code of the continent<br>Example: `EU` |
| eu | boolean | Indicated whether the country is part of the European Union. |
| city | string | Name of the city<br>Example: `Zurich` |
| latitude | number | Latitude of the location<br>Example: `47.36667` |
| longitude | number | Longitude of the location<br>Example: `8.55` |
| postal | string | Postal code<br>Example: `8000` |
| region | string | If known, the ISO 3166-2 name for the first level region.<br>[ISO 3166-2 codes](https://en.wikipedia.org/wiki/ISO_3166-2)<br>Example: `Zurich` |
| region\_code | string | If known, the ISO 3166-2 code for the first level region.<br>[ISO 3166-2 codes](https://en.wikipedia.org/wiki/ISO_3166-2)<br>Example: `ZH` |
| timezone | string | Name of the timezone<br>Example: `Europe/Zurich` |
| elevation | number | Elevation of the location in meters<br>Example: `433` |

### GeolocationResult example

```json
{
  "country": "Switzerland",
  "country_code": "CH",
  "country_bounds": [5.95538, 45.818852, 10.490936, 47.809357],
  "country_languages": ["de", "fr", "it"],
  "continent": "Europe",
  "continent_code": "EU",
  "eu": false,
  "city": "Zurich",
  "latitude": 47.36667,
  "longitude": 8.55,
  "postal": "8000",
  "region": "Zurich",
  "region_code": "ZH",
  "timezone": "Europe/Zurich",
  "elevation": 433
}
```

JSON

Copy

![](https://docs.maptiler.com/assets/img/open-api.png)

Using the OpenAPI Specification?

Get the [openapi.yaml](https://docs.maptiler.com/_data/cloud/api/openapi.yml)

On this page

- [How to use the API](https://docs.maptiler.com/cloud/api/geolocation/#how-to-use-the-api)
- [IP Geolocation](https://docs.maptiler.com/cloud/api/geolocation/#ip-geolocation)
- [GeolocationResult](https://docs.maptiler.com/cloud/api/geolocation/#GeolocationResult)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler API


Geolocation API

Geolocation API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)