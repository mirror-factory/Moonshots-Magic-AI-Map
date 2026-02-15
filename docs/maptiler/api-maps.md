---
title: "Maps API | MapTiler API | MapTiler"
source: "https://docs.maptiler.com/cloud/api/maps"
description: "Maps API Reference for developers | Maps API"
---

# Maps API

## [Embeddable HTML viewer](https://docs.maptiler.com/cloud/api/maps/\#embeddable-html-viewer)

GET https://api.maptiler.com/maps/{mapId}/

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |

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

## [Style JSON of the map](https://docs.maptiler.com/cloud/api/maps/\#style-json-of-the-map)

GET https://api.maptiler.com/maps/{mapId}/style.json

Style JSON describing the map cartography. Can be used with various libraries to display a vector map (e.g. Mapbox GL JS, OpenLayers, ...).

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | Style JSON object [https://docs.mapbox.com/mapbox-gl-js/style-spec/](https://docs.mapbox.com/mapbox-gl-js/style-spec/) [StyleJSON](https://docs.maptiler.com/cloud/api/maps/#StyleJSON) |

## [Map symbols (sprites)](https://docs.maptiler.com/cloud/api/maps/\#map-symbols-sprites)

GET https://api.maptiler.com/maps/{mapId}/sprite{scale}.{format}

Map symbols (sprites) required to display the vector map.

### Request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |
| scale | string | Allowed values: <br>`@2x` |
| format | string | Allowed values: <br>`png``json` |

##### Request example

```http

```

HTTP

Copy

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json |  |
| 200 | image/png |  |

## [Raster XYZ tiles](https://docs.maptiler.com/cloud/api/maps/\#raster-xyz-tiles)

GET https://api.maptiler.com/maps/{mapId}/{tileSize}/{z}/{x}/{y}{scale}.{format}

Rasterized tiles (XYZ) of the map. Can be used with various libraries to display a raster map (e.g. Leaflet, OpenLayers, ...). It's usually better (if possible) to use the TileJSON rather than using the tile URL directly.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |
| tileSize | integer | Allowed values: <br>`256` |
| z | integer | Zoom level. Specifies the tile’s zoom level. See [Tiles à la Google Maps](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/) |
| x | integer | Column. Specifies the tile’s column. See [Tiles à la Google Maps](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/) |
| y | integer | Row. Specifies the tile’s row. See [Tiles à la Google Maps](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/) |
| scale | string | Use “@2x” to get “retina”/HiDPI image.<br>Allowed values: <br>`@2x` |
| format | string | Allowed values: <br>`png``jpg``webp` |

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
| 400 |  | Out of bounds / Invalid format |

## [TileJSON](https://docs.maptiler.com/cloud/api/maps/\#tilejson)

GET https://api.maptiler.com/maps/{mapId}/{tileSize}/tiles.json

TileJSON describing the metadata of the map as well as link to the XYZ tiles. Can be used with various libraries to display a raster map (e.g. Leaflet, OpenLayers, ...).

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |
| tileSize | integer | Allowed values: <br>`256` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [https://raw.githubusercontent.com/mapbox/tilejson-spec/master/2.2.0/schema.json](https://raw.githubusercontent.com/mapbox/tilejson-spec/master/2.2.0/schema.json) [TileJSON](https://docs.maptiler.com/cloud/api/maps/#TileJSON) |

## [OGC API - Tiles](https://docs.maptiler.com/cloud/api/maps/\#ogc-api-tiles)

GET https://api.maptiler.com/maps/{mapId}/tiles

Tileset landing page of the rasterized tiles. Can be used in software supporting the OGC API - Tiles v1.0 specification.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |

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

## [OGC API TileMatrixSets](https://docs.maptiler.com/cloud/api/maps/\#ogc-api-tilematrixsets)

GET https://api.maptiler.com/maps/{mapId}/tileMatrixSet

Description of the tileset tile matrix sets according to the OGC Web API. This resource is linked from the OGC API - Tiles endpoint.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |

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

## [WMTS Capabilities](https://docs.maptiler.com/cloud/api/maps/\#wmts-capabilities)

GET https://api.maptiler.com/maps/{mapId}/WMTSCapabilities.xml

WMTS Capabilities XML document describing the metadata of the map as well as link to the XYZ tiles. Can be used with various GIS software (e.g. QGIS) to display the map.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| mapId | string | Identifier of the map. See [MapTiler Maps](https://cloud.maptiler.com/maps/).<br>Example: `streets-v2` |

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

- [Embeddable HTML viewer](https://docs.maptiler.com/cloud/api/maps/#embeddable-html-viewer)
- [Style JSON of the map](https://docs.maptiler.com/cloud/api/maps/#style-json-of-the-map)
- [Map symbols (sprites)](https://docs.maptiler.com/cloud/api/maps/#map-symbols-sprites)
- [Raster XYZ tiles](https://docs.maptiler.com/cloud/api/maps/#raster-xyz-tiles)
- [TileJSON](https://docs.maptiler.com/cloud/api/maps/#tilejson)
- [OGC API - Tiles](https://docs.maptiler.com/cloud/api/maps/#ogc-api-tiles)
- [OGC API TileMatrixSets](https://docs.maptiler.com/cloud/api/maps/#ogc-api-tilematrixsets)
- [WMTS Capabilities](https://docs.maptiler.com/cloud/api/maps/#wmts-capabilities)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler API


Maps API

Maps API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)