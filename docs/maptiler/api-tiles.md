---
title: "Tiles API | MapTiler API | MapTiler"
source: "https://docs.maptiler.com/cloud/api/tiles"
description: "Maps API Reference for developers | Tiles API"
---

# Tiles API

## [Embeddable HTML viewer](https://docs.maptiler.com/cloud/api/tiles/\#embeddable-html-viewer)

GET https://api.maptiler.com/tiles/{tilesId}/

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| tilesId | string | Identifier of the tiles. See [MapTiler Tiles](https://cloud.maptiler.com/tiles/).<br>Example: `satellite-v2` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | text/html |  |

## [XYZ tiles](https://docs.maptiler.com/cloud/api/tiles/\#xyz-tiles)

GET https://api.maptiler.com/tiles/{tilesId}/{z}/{x}/{y}

The individual tiles. Can be used with various libraries to display the tiles (e.g. Leaflet, OpenLayers, ...). It's usually better (if possible) to use the TileJSON rather than using the tile URL directly.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| tilesId | string | Identifier of the tiles. See [MapTiler Tiles](https://cloud.maptiler.com/tiles/).<br>Example: `satellite-v2` |
| z | integer | Zoom level. Specifies the tile’s zoom level. See [Tiles à la Google Maps](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/) |
| x | integer | Column. Specifies the tile’s column. See [Tiles à la Google Maps](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/) |
| y | integer | Row. Specifies the tile’s row. See [Tiles à la Google Maps](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/) |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | \* |  |
| 204 |  | Tile not present – presumed empty (empty response) |
| 400 |  | Out of bounds |
| 403 |  | Key is missing, invalid or restricted |
| 404 |  | The item does not exist |

## [TileJSON](https://docs.maptiler.com/cloud/api/tiles/\#tilejson)

GET https://api.maptiler.com/tiles/{tilesId}/tiles.json

TileJSON describing the metadata of the tiles as well as link to the XYZ tiles. Can be used with various libraries to display the tiles (e.g. Leaflet, OpenLayers, ...).

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| tilesId | string | Identifier of the tiles. See [MapTiler Tiles](https://cloud.maptiler.com/tiles/).<br>Example: `satellite-v2` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [https://raw.githubusercontent.com/mapbox/tilejson-spec/master/2.2.0/schema.json](https://raw.githubusercontent.com/mapbox/tilejson-spec/master/2.2.0/schema.json) [TileJSON](https://docs.maptiler.com/cloud/api/tiles/#TileJSON) |

## [OGC API - Tiles](https://docs.maptiler.com/cloud/api/tiles/\#ogc-api-tiles)

GET https://api.maptiler.com/tiles/{tilesId}/tiles

Tileset landing page of the tiles. Can be used in software supporting the OGC API - Tiles v1.0 specification.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| tilesId | string | Identifier of the tiles. See [MapTiler Tiles](https://cloud.maptiler.com/tiles/).<br>Example: `satellite-v2` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json |  |

## [OGC API TileMatrixSets](https://docs.maptiler.com/cloud/api/tiles/\#ogc-api-tilematrixsets)

GET https://api.maptiler.com/tiles/{tilesId}/tileMatrixSet

Description of the tileset tile matrix sets according to the OGC Web API. This resource is linked from the OGC API - Tiles endpoint.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| tilesId | string | Identifier of the tiles. See [MapTiler Tiles](https://cloud.maptiler.com/tiles/).<br>Example: `satellite-v2` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json |  |

## [WMTS Capabilities](https://docs.maptiler.com/cloud/api/tiles/\#wmts-capabilities)

GET https://api.maptiler.com/tiles/{tilesId}/WMTSCapabilities.xml

WMTS Capabilities XML document describing the metadata of the tiles as well as link to the XYZ tiles. Can be used with various GIS software (e.g. QGIS) to display the tiles.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| tilesId | string | Identifier of the tiles. See [MapTiler Tiles](https://cloud.maptiler.com/tiles/).<br>Example: `satellite-v2` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | text/xml |  |

![](https://docs.maptiler.com/assets/img/open-api.png)

Using the OpenAPI Specification?

Get the [openapi.yaml](https://docs.maptiler.com/_data/cloud/api/openapi.yml)

On this page

- [Embeddable HTML viewer](https://docs.maptiler.com/cloud/api/tiles/#embeddable-html-viewer)
- [XYZ tiles](https://docs.maptiler.com/cloud/api/tiles/#xyz-tiles)
- [TileJSON](https://docs.maptiler.com/cloud/api/tiles/#tilejson)
- [OGC API - Tiles](https://docs.maptiler.com/cloud/api/tiles/#ogc-api-tiles)
- [OGC API TileMatrixSets](https://docs.maptiler.com/cloud/api/tiles/#ogc-api-tilematrixsets)
- [WMTS Capabilities](https://docs.maptiler.com/cloud/api/tiles/#wmts-capabilities)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler API


Tiles API

Tiles API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)