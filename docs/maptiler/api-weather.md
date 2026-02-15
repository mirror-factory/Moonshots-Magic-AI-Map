---
title: "Weather API | MapTiler API | MapTiler"
source: "https://docs.maptiler.com/cloud/api/weather"
description: "Maps API Reference for developers | Weather API"
---

# Weather API

![](https://docs.maptiler.com/assets/img/weather-logo-icon.svg)Using the API from JavaScript?

[Weather Module](https://docs.maptiler.com/sdk-js/modules/weather/)

## [Weather catalog](https://docs.maptiler.com/cloud/api/weather/\#weather-catalog)

GET https://api.maptiler.com/weather/latest.json

List current weather-related variables, their metadata and individual keyframes

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [WeatherCatalogResult](https://docs.maptiler.com/cloud/api/weather/#WeatherCatalogResult) |
| 403 |  | Key is missing, invalid or restricted |

## [WeatherCatalogResult](https://docs.maptiler.com/cloud/api/weather/\#WeatherCatalogResult)

| Property | Type | Description |
| --- | --- | --- |
| variables | array of \[ [CatalogResult](https://docs.maptiler.com/cloud/api/weather/#CatalogResult)\] | List of all the available weather variables |

## [CatalogResult](https://docs.maptiler.com/cloud/api/weather/\#CatalogResult)

List of all the available weather variables

| Property | Type | Description |
| --- | --- | --- |
| spatial\_ref\_sys | [Spatial reference system](https://docs.maptiler.com/cloud/api/weather/#Spatial%20reference%20system) | Projection |
| bounds |  | Bounds of the area represented by the tileset. Coordinates are in the given projection.<br>Example: `[-20037481.18083349,-20037508.342789244,20008180.55502281,20037508.342789244]` |
| tile\_format | string | Format of individual tiles<br>Example: `png` |
| tile\_matrix\_set | [Tile matrix set](https://docs.maptiler.com/cloud/api/weather/#Tile%20matrix%20set) |  |
| metadata | [Metadata](https://docs.maptiler.com/cloud/api/weather/#Metadata) |  |
| keyframes | array \[<br> <br> [Keyframe](https://docs.maptiler.com/cloud/api/weather/#Keyframe)<br> \] | List of the available keyframes for this variable |

## [Spatial reference system](https://docs.maptiler.com/cloud/api/weather/\#Spatial%20reference%20system)

Projection

| Property | Type | Description |
| --- | --- | --- |
| auth\_name | string | Name of the defining authority<br>Example: `EPSG` |
| auth\_srid | string | ID given by the defining authority<br>Example: `3857` |
| wkt | string | Well known text of the definition<br>Example: `PROJCRS["WGS 84 / Pseudo-Mercator",BASEGEOGCRS["WGS 84",ENSEMBLE["World Geodetic System 1984 ensemble",MEMBER["World Geodetic System 1984 (Transit)"],MEMBER["World Geodetic System 1984 (G730)"],MEMBER["World Geodetic System 1984 (G873)"],MEMBER["World Geodetic System 1984 (G1150)"],MEMBER["World Geodetic System 1984 (G1674)"],MEMBER["World Geodetic System 1984 (G1762)"],MEMBER["World Geodetic System 1984 (G2139)"],ELLIPSOID["WGS 84",6378137,298.257223563,LENGTHUNIT["metre",1]],ENSEMBLEACCURACY[2.0]],PRIMEM["Greenwich",0,ANGLEUNIT["degree",0.0174532925199433]],ID["EPSG",4326]],CONVERSION["Popular Visualisation Pseudo-Mercator",METHOD["Popular Visualisation Pseudo Mercator",ID["EPSG",1024]],PARAMETER["Latitude of natural origin",0,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8801]],PARAMETER["Longitude of natural origin",0,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8802]],PARAMETER["False easting",0,LENGTHUNIT["metre",1],ID["EPSG",8806]],PARAMETER["False northing",0,LENGTHUNIT["metre",1],ID["EPSG",8807]]],CS[Cartesian,2],AXIS["easting (X)",east,ORDER[1],LENGTHUNIT["metre",1]],AXIS["northing (Y)",north,ORDER[2],LENGTHUNIT["metre",1]],USAGE[SCOPE["Web mapping and visualisation."],AREA["World between 85.06°S and 85.06°N."],BBOX[-85.06,-180,85.06,180]],ID["EPSG",3857]]` |

### Spatial reference system example

```json
{
  "auth_name": "EPSG",
  "auth_srid": "3857",
  "wkt": "PROJCRS[\"WGS 84 / Pseudo-Mercator\",BASEGEOGCRS[\"WGS 84\",ENSEMBLE[\"World Geodetic System 1984 ensemble\",MEMBER[\"World Geodetic System 1984 (Transit)\"],MEMBER[\"World Geodetic System 1984 (G730)\"],MEMBER[\"World Geodetic System 1984 (G873)\"],MEMBER[\"World Geodetic System 1984 (G1150)\"],MEMBER[\"World Geodetic System 1984 (G1674)\"],MEMBER[\"World Geodetic System 1984 (G1762)\"],MEMBER[\"World Geodetic System 1984 (G2139)\"],ELLIPSOID[\"WGS 84\",6378137,298.257223563,LENGTHUNIT[\"metre\",1]],ENSEMBLEACCURACY[2.0]],PRIMEM[\"Greenwich\",0,ANGLEUNIT[\"degree\",0.0174532925199433]],ID[\"EPSG\",4326]],CONVERSION[\"Popular Visualisation Pseudo-Mercator\",METHOD[\"Popular Visualisation Pseudo Mercator\",ID[\"EPSG\",1024]],PARAMETER[\"Latitude of natural origin\",0,ANGLEUNIT[\"degree\",0.0174532925199433],ID[\"EPSG\",8801]],PARAMETER[\"Longitude of natural origin\",0,ANGLEUNIT[\"degree\",0.0174532925199433],ID[\"EPSG\",8802]],PARAMETER[\"False easting\",0,LENGTHUNIT[\"metre\",1],ID[\"EPSG\",8806]],PARAMETER[\"False northing\",0,LENGTHUNIT[\"metre\",1],ID[\"EPSG\",8807]]],CS[Cartesian,2],AXIS[\"easting (X)\",east,ORDER[1],LENGTHUNIT[\"metre\",1]],AXIS[\"northing (Y)\",north,ORDER[2],LENGTHUNIT[\"metre\",1]],USAGE[SCOPE[\"Web mapping and visualisation.\"],AREA[\"World between 85.06°S and 85.06°N.\"],BBOX[-85.06,-180,85.06,180]],ID[\"EPSG\",3857]]"
}
```

JSON

Copy

## [Tile matrix set](https://docs.maptiler.com/cloud/api/weather/\#Tile%20matrix%20set)

| Property | Type | Description |
| --- | --- | --- |
| bounds |  | Example: `[-20037481.18083349,-20037508.342789244,20008180.55502281,20037508.342789244]` |
| items | array \[<br> <br> [Tile matrix](https://docs.maptiler.com/cloud/api/weather/#Tile%20matrix)<br> \] |  |

### Tile matrix set example

```json
{
  "bounds": [\
    -20037481.18083349,\
    -20037508.342789244,\
    20008180.55502281,\
    20037508.342789244\
  ],
  "items": null
}
```

JSON

Copy

## [Metadata](https://docs.maptiler.com/cloud/api/weather/\#Metadata)

| Property | Type | Description |
| --- | --- | --- |
| weather\_variable | [Weather variable](https://docs.maptiler.com/cloud/api/weather/#Weather%20variable) |  |

## [Keyframe](https://docs.maptiler.com/cloud/api/weather/\#Keyframe)

| Property | Type | Description |
| --- | --- | --- |
| id | string | UUID of the tileset |
| timestamp | string | ISO timestamp of the tileset |

## [Tile matrix](https://docs.maptiler.com/cloud/api/weather/\#Tile%20matrix)

| Property | Type | Description |
| --- | --- | --- |
| zoom\_level | integer |  |
| matrix\_width | integer |  |
| matrix\_height | integer |  |
| tile\_width | integer |  |
| tile\_height | integer |  |
| pixel\_x\_size | number |  |
| pixel\_y\_size | number |  |

## [Weather variable](https://docs.maptiler.com/cloud/api/weather/\#Weather%20variable)

| Property | Type | Description |
| --- | --- | --- |
| name | string | Human-friendly name of the variable<br>Example: `Wind` |
| description | string | Human-friendly description of the variable<br>Example: `Wind at 10 m above ground [m/s]` |
| attribution | string | Example: `GFS` |
| variable\_id | string | unique ID of the forecast for grouping<br>Example: `wind-10m:gfs` |
| decoding | [Decoding](https://docs.maptiler.com/cloud/api/weather/#Decoding) |  |
| unit | string | Human-friendly unit of the values<br>Example: `ms` |
| release\_timestamp | string | Date of release for the whole batch, ISO timestamp<br>Example: `2023-03-01T06:00:00+00:00` |
| timestamp | string | ISO timestamp of the forecast frame – the moment in time it depicts<br>Example: `2023-03-01T11:00:00+00:00` |

### Weather variable example

```json
{
  "name": "Wind",
  "description": "Wind at 10 m above ground [m/s]",
  "attribution": "GFS",
  "variable_id": "wind-10m:gfs",
  "decoding": null,
  "unit": "ms",
  "release_timestamp": "2023-03-01T06:00:00+00:00",
  "timestamp": "2023-03-01T11:00:00+00:00"
}
```

JSON

Copy

## [Decoding](https://docs.maptiler.com/cloud/api/weather/\#Decoding)

| Property | Type | Description |
| --- | --- | --- |
| channels | string | Channel to decode the info from<br>Example: `rg`<br>Allowed values: <br>`r``g``b``rg``rb``gb``rgb` |
| min | number | Min boundary of the data for decoding<br>Example: `-75` |
| max | number | Max boundary of the data for decoding<br>Example: `75` |

### Decoding example

```json
{"channels": "rg", "min": -75, "max": 75}
```

JSON

Copy

![](https://docs.maptiler.com/assets/img/open-api.png)

Using the OpenAPI Specification?

Get the [openapi.yaml](https://docs.maptiler.com/_data/cloud/api/openapi.yml)

On this page

- [Weather catalog](https://docs.maptiler.com/cloud/api/weather/#weather-catalog)
- [WeatherCatalogResult](https://docs.maptiler.com/cloud/api/weather/#WeatherCatalogResult)
- [CatalogResult](https://docs.maptiler.com/cloud/api/weather/#CatalogResult)
- [Spatial reference system](https://docs.maptiler.com/cloud/api/weather/#Spatial%20reference%20system)
- [Tile matrix set](https://docs.maptiler.com/cloud/api/weather/#Tile%20matrix%20set)
- [Metadata](https://docs.maptiler.com/cloud/api/weather/#Metadata)
- [Keyframe](https://docs.maptiler.com/cloud/api/weather/#Keyframe)
- [Tile matrix](https://docs.maptiler.com/cloud/api/weather/#Tile%20matrix)
- [Weather variable](https://docs.maptiler.com/cloud/api/weather/#Weather%20variable)
- [Decoding](https://docs.maptiler.com/cloud/api/weather/#Decoding)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler API


Weather API

Weather API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)