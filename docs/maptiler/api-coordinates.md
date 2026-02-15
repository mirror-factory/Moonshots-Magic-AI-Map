---
title: "Coordinates API | MapTiler API | MapTiler"
source: "https://docs.maptiler.com/cloud/api/coordinates"
description: "Maps API Reference for developers | Coordinates API"
---

# Coordinates API

The MapTiler **Coordinates API** makes it possible to search map coordinate systems and transform coordinates from one to another. See the [intro to working with coordinate systems](https://docs.maptiler.com/guides/location-services/coordinates/) to learn about how it works and when it’s useful.

## How to use the API

- Directly from any application, CLI, backend, pipeline.
- Via the [Coordinates API client](https://docs.maptiler.com/client-js/coordinates/) library, which wraps the API calls in ready-made functions for easier implementation in JavaScript.

You need a **MapTiler API key** to use this service.
[Get it here](https://cloud.maptiler.com/account/keys/)
and
[learn how to protect it](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/).

## Getting started

For practical guidance and sample API calls, see:

- [Search coordinate systems](https://docs.maptiler.com/guides/location-services/coordinates/search-coordinate-systems)
- [Transform coordinates](https://docs.maptiler.com/guides/location-services/coordinates/convert-coordinates)
- [Transform coordinates in batch](https://docs.maptiler.com/guides/location-services/coordinates/convert-coordinates-in-batch)

* * *

The results provided by the Coordinates API are based on the EPSG database version 12.029.

## [Search coordinate systems](https://docs.maptiler.com/cloud/api/coordinates/\#search-coordinate-systems)

GET https://api.maptiler.com/coordinates/search/{query}.json

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| query | string | Query string used to search the catalog. It accepts plain terms such as names of locations and key:value pairs for filtering.<br>Following parameter values can be used:<br>- kind<br>  - \\* (All kinds)<br>  - CRS (All coordinate reference systems - default)<br>    - CRS-PROJCRS (Projected coordinate systems)<br>    - CRS-GEOGCRS (Geodetic coordinate systems)<br>    - CRS-GEOG3DCRS (Geodetic 3D coordinate systems)<br>    - CRS-GCENCRS (Geocentric coordinate systems)<br>    - CRS-VERTCRS (Vertical coordinate systems)<br>    - CRS-ENGCRS (Engineering coordinate systems)<br>    - CRS-COMPOUNDCRS (Compound coordinate systems)<br>    - CRS-DRVDCRS (Derived coordinate systems)<br>  - COORDOP (All operations)<br>    - COORDOP-COPTRAN (Transformations)<br>    - COORDOP-COPCONO (Compound operations)<br>    - COORDOP-POIMOTO (Point motion operations)<br>    - COORDOP-COPCON (Conversions)<br>  - DATUM (All datums)<br>    - DATUM-VERTDAT (Vertical datums)<br>    - DATUM-ENGDAT (Engineering datums)<br>    - DATUM-GEODDAT (Geodetic datums)<br>    - DATUM-DYNGEODDA (Dynamic geodetic datums)<br>    - DATUM-ENSEMDAT (Ensemble datum)<br>  - ELLIPSOID (Ellipsoid)<br>  - PRIMEM (Prime meridian)<br>  - METHOD (Method / Projection)<br>  - CS (Coordinate systems)<br>    - CS-VERTCS (Vertical coordinate system)<br>    - CS-SPHERCS (Spherical coordinate system)<br>    - CS-CARTESCS (Cartesian coordinate system)<br>    - CS-ELLIPCS (Ellipsoidal coordinate system)<br>    - CS-AFFINE (Affine coordinate system)<br>    - CS-ORDINAL (Ordinal coordinate system)<br>  - AXIS (Axis)<br>  - AREA (Area)<br>  - UNIT (Unit)<br>    - UNIT-ANGUNIT (Angle unit)<br>    - UNIT-SCALEUNIT (Scale unit)<br>    - UNIT-LENUNIT (Length unit)<br>    - UNIT-TIMEUNIT (Time unit)<br>- code<br>  - Full code of the resource<br>- trans<br>  - Code of the transformation<br>- deprecated<br>  - \\* (Both active and deprecated)<br>  - 0 (active only - default)<br>  - 1 (deprecated only)<br>Examples:<br>`finland deprecated:* kind:*` \- Finding all resources of Finland<br>`United Kingdom` \- Basic example<br>`mercator deprecated:1` \- Finding deprecated mercator CRS<br>`Finland kind:DATUM` \- Filtering resources using parameter(s)<br>`code:4326` \- Finding specific resource (WGS84) by code |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| limit | integer | Maximum number of results returned<br>`>= 1``<= 50`<br>Default: `10` |
| offset | integer | The starting position of returned list of results<br>`>= 0`<br>Default: `0` |
| transformations | boolean | Show detailed transformations for each CRS<br>Default: `false` |
| exports | boolean | Show exports in WKT and Proj4 notations<br>Default: `false` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [SearchResult](https://docs.maptiler.com/cloud/api/coordinates/#SearchResult) |

## [Transform coordinates](https://docs.maptiler.com/cloud/api/coordinates/\#transform-coordinates)

GET https://api.maptiler.com/coordinates/transform/{coordinates}.json

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| coordinates | string | List of coordinate pairs seperated by `;` delimeter (Max 50 pairs).<br>Example: `17,50;17,50,300` |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| s\_srs | integer | Source CRS<br>Default: `4326` |
| t\_srs | integer | Target CRS<br>Default: `4326` |
| ops | string | List of codes of operations seperated by a \| (pipe) operator<br>Example: `1623` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [TransformResult](https://docs.maptiler.com/cloud/api/coordinates/#TransformResult) |

## [SearchResult](https://docs.maptiler.com/cloud/api/coordinates/\#SearchResult)

| Property | Type | Description |
| --- | --- | --- |
| results | array \[<br> <br> [SearchItem](https://docs.maptiler.com/cloud/api/coordinates/#SearchItem)<br> \] |  |
| total | integer |  |

## [SearchItem](https://docs.maptiler.com/cloud/api/coordinates/\#SearchItem)

| Property | Type | Description |
| --- | --- | --- |
| accuracy | number |  |
| area | string |  |
| bbox | array \[number\] | Bounding box of the resource in \[min\_lon, min\_lat, max\_lon, max\_lat\] order. |
| default\_transformation | [Default Transformation](https://docs.maptiler.com/cloud/api/coordinates/#Default%20Transformation) | Most suitable transformation for this CRS. |
| deprecated | boolean |  |
| exports | [ExportItem](https://docs.maptiler.com/cloud/api/coordinates/#ExportItem) |  |
| id | [Id](https://docs.maptiler.com/cloud/api/coordinates/#Id) |  |
| kind | string |  |
| name | string |  |
| transformations | array<br>Any Of \[ [TransformationItem](https://docs.maptiler.com/cloud/api/coordinates/#TransformationItem), `integer`\] |  |
| unit | string |  |

## [Id](https://docs.maptiler.com/cloud/api/coordinates/\#Id)

| Property | Type | Description |
| --- | --- | --- |
| authority | string |  |
| code | integer |  |

## [ExportItem](https://docs.maptiler.com/cloud/api/coordinates/\#ExportItem)

| Property | Type | Description |
| --- | --- | --- |
| proj4 | string |  |
| wkt | string |  |

## [TransformationItem](https://docs.maptiler.com/cloud/api/coordinates/\#TransformationItem)

| Property | Type | Description |
| --- | --- | --- |
| accuracy | number |  |
| area | string |  |
| bbox | array \[number\] | Bounding box of the resource in \[min\_lon, min\_lat, max\_lon, max\_lat\] order. |
| deprecated | boolean |  |
| exports | [ExportItem](https://docs.maptiler.com/cloud/api/coordinates/#ExportItem) |  |
| grids | array \[<br> <br> [GridFile](https://docs.maptiler.com/cloud/api/coordinates/#GridFile)<br> \] | List of grids used in this operation. |
| id | [Id](https://docs.maptiler.com/cloud/api/coordinates/#Id) |  |
| name | string |  |
| reversible | boolean | Whether this operation can be used in reverse or not. |
| target\_crs | [Id](https://docs.maptiler.com/cloud/api/coordinates/#Id) |  |
| unit | string |  |
| usable | boolean | Whether this operation can be used in online API or not. |

## [GridFile](https://docs.maptiler.com/cloud/api/coordinates/\#GridFile)

| Property | Type | Description |
| --- | --- | --- |
| path | string |  |

## [TransformResult](https://docs.maptiler.com/cloud/api/coordinates/\#TransformResult)

| Property | Type | Description |
| --- | --- | --- |
| results | array \[<br> <br> [XYZ](https://docs.maptiler.com/cloud/api/coordinates/#XYZ)<br> \] |  |
| transformer\_selection\_strategy | string | Transformations are selected using given `ops` parameter. If no parameter is given, `auto` strategy is used. If given, it may try to use a `listed` transformation, then fallback to `towgs84` patching, and finally `boundcrs`. |

## [XYZ](https://docs.maptiler.com/cloud/api/coordinates/\#XYZ)

| Property | Type | Description |
| --- | --- | --- |
| x | number |  |
| y | number |  |
| z | number |  |

## [Default Transformation](https://docs.maptiler.com/cloud/api/coordinates/\#Default%20Transformation)

Most suitable transformation for this CRS.

| Property | Type | Description |
| --- | --- | --- |
| authority | string |  |
| code | integer |  |

![](https://docs.maptiler.com/assets/img/open-api.png)

Using the OpenAPI Specification?

Get the [openapi.yaml](https://docs.maptiler.com/_data/cloud/api/openapi.yml)

On this page

- [How to use the API](https://docs.maptiler.com/cloud/api/coordinates/#how-to-use-the-api)
- [Getting started](https://docs.maptiler.com/cloud/api/coordinates/#getting-started)
- [Search coordinate systems](https://docs.maptiler.com/cloud/api/coordinates/#search-coordinate-systems)
- [Transform coordinates](https://docs.maptiler.com/cloud/api/coordinates/#transform-coordinates)
- [SearchResult](https://docs.maptiler.com/cloud/api/coordinates/#SearchResult)
- [SearchItem](https://docs.maptiler.com/cloud/api/coordinates/#SearchItem)
- [Id](https://docs.maptiler.com/cloud/api/coordinates/#Id)
- [ExportItem](https://docs.maptiler.com/cloud/api/coordinates/#ExportItem)
- [TransformationItem](https://docs.maptiler.com/cloud/api/coordinates/#TransformationItem)
- [GridFile](https://docs.maptiler.com/cloud/api/coordinates/#GridFile)
- [TransformResult](https://docs.maptiler.com/cloud/api/coordinates/#TransformResult)
- [XYZ](https://docs.maptiler.com/cloud/api/coordinates/#XYZ)
- [Default Transformation](https://docs.maptiler.com/cloud/api/coordinates/#Default%20Transformation)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler API


Coordinates API with EPSG support

Coordinates API (EPSG)

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)