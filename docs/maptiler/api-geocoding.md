---
title: "Search and geocoding API | MapTiler API | MapTiler"
source: "https://docs.maptiler.com/cloud/api/geocoding"
description: "Maps API Reference for developers | Search and geocoding API"
---

# Search and geocoding API

The MapTiler **Search and geocoding API** makes it possible to search for any place on Earth and get accurate location data in return. See the [intro to place search](https://docs.maptiler.com/guides/location-services/geocoding-search/) to learn how it works and what you can use it for.

## How to use the API

- Directly from your web or backend applications.
- Via the [Geocoding API client](https://docs.maptiler.com/client-js/geocoding/) library, which wraps the API calls in ready-made functions for easier use in JavaScript. The client library is a good choice for JavaScript if you only need to use geocoding but not a map.
- With our complete JavaScript SDK. It provides a [geocoding control module](https://docs.maptiler.com/sdk-js/modules/geocoding/) to quickly integrate place search into your application. The SDK is best if you need the geocoding functionality plus a complete map dev kit.
- With other JavaScript libraries: [MapLibre GL JS](https://docs.maptiler.com/sdk-js/modules/geocoding/api/usage/maplibre-gl-js/) • [Leaflet](https://docs.maptiler.com/leaflet/examples/geocoding-control/) • [OpenLayers](https://docs.maptiler.com/openlayers/examples/geocoding-control/)
- Without a map: [Vanilla JS](https://docs.maptiler.com/sdk-js/modules/geocoding/api/usage/vanilla-js/)

You need a **MapTiler API key** to use this service.
[Get it here](https://cloud.maptiler.com/account/keys/)
and
[learn how to protect it](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/).

## Getting started

For practical guidance on how to use this API, check out:

- Our [geocoding playground](https://www.maptiler.com/showcase/geocoding/) showing how the API calls are constructed
- Explanation and usage tips for the most used [search parameters](https://docs.maptiler.com/guides/location-services/geocoding-search/parameters)

### Basic example

```js
import { geocoding } from "@maptiler/client";

// in an async function, or as a 'thenable':
const result = await geocoding.forward("paris");
```

JavaScript

Copy

## [Search by name (forward)](https://docs.maptiler.com/cloud/api/geocoding/\#search-by-name-forward)

GET https://api.maptiler.com/geocoding/{query}.json

Forward [geocoding (search by place name)](https://www.maptiler.com/cloud/geocoding/).

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| query | string | Place name to search. You can also use bare [POI category](https://docs.maptiler.com/cloud/api/geocoding/#PoiCategory) or mix it with a name to search for POIs of desired category, unless `poi` index is excluded.<br>Examples:<br>`Zurich` \- Search place name<br>`restaurant mediterranean` \- Search POI category |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| bbox | [BoundingBox](https://docs.maptiler.com/cloud/api/geocoding/#BoundingBox) | A `[w, s, e, n]` bounding box array to use for limiting search results. Only features inside the provided bounding box will be included.<br>Example: `5.9559,45.818,10.4921,47.8084` |
| proximity | Any Of \[ [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates), `ip`\] | A `[lon, lat]` array to use for biasing search results or the string `ip` to do server-side IP based geolocation. Specify to prefer results close to a specific location - features closer to the proximity value will be given priority over those further from the proximity value.<br>Example: `8.528509,47.3774434` |
| language | array \[string\] | Prefer results in specific language specified as ISO 639-1 code. Only the first language code is used when prioritizing forward geocode results to be matched. If this query parameter is omited then Accept-Language HTTP header will be analyzed. If the parameter is provided but is empty then no language preference is made.<br>Example: `de,en`<br>`<= 20` items<br>Allowed values: <br>`aa``ab``ae``af``ak``am``an``ar``as``av``ay``az``ba``be``bg``bh``bi``bm``bn``bo``br``bs``ca``ce``ch``co``cr``cs``cu``cv``cy``da``de``dv``dz``ee``el``en``eo``es``et``eu``fa``ff``fi``fj``fo``fr``fy``ga``gd``gl``gn``gu``gv``ha``he``hi``ho``hr``ht``hu``hy``hz``ia``id``ie``ig``ii``ik``io``is``it``iu``ja``jv``ka``kg``ki``kj``kk``kl``km``kn``ko``kr``ks``ku``kv``kw``ky``la``lb``lg``li``ln``lo``lt``lu``lv``mg``mh``mi``mk``ml``mn``mr``ms``mt``my``na``nb``nd``ne``ng``nl``nn``no``nr``nv``ny``oc``oj``om``or``os``pa``pi``pl``ps``pt``qu``rm``rn``ro``ru``rw``sa``sc``sd``se``sg``si``sk``sl``sm``sn``so``sq``sr``ss``st``su``sv``sw``ta``te``tg``th``ti``tk``tl``tn``to``tr``ts``tt``tw``ty``ug``uk``ur``uz``ve``vi``vo``wa``wo``xh``yi``yo``za``zh``zu`<br>Unique values: <br>`true` |
| country | array \[string\] | Limit search to specific country/countries.<br>Example: `sk,cz`<br>Unique values: <br>`true` |
| limit | integer | Maximum number of results to return. For reverse geocoding with multiple types this must not be set or must be set to 1.<br>`>= 1``<= 10`<br>Default: `5` |
| types | array\[ [PlaceType](https://docs.maptiler.com/cloud/api/geocoding/#PlaceType)\] | Filter types of which features to return. If not specified, features of all types except `poi` and `major_landform` are returned (`types = ["poi", "major_landform"]`, `excludeTypes = true`). In case of reverse geocoding if just a single type is specified, then multiple nearby features of the single type can be returned, otherwise single feature for every specified type (or default types) can be returned.<br>Unique values: <br>`true` |
| excludeTypes | boolean | Set to `true` to use all available feature types except those specified in `types`.<br>Default: `false` |
| fuzzyMatch | boolean | Set to `false` to disable fuzzy search.<br>Default: `true` |
| autocomplete | boolean | Set to `true` to use autocomplete, `false` to disable autocomplete.<br>Default: `true` |
| worldview | string | Some of the geographical boundaries and names are disputed. When `worldview` option is selected, the Geocoding API responses will be aligned with the borders and names recognized by the selected country (US or Switzerland). This affects filtering by country, the context returned with the given feature and also some of the labels (e.g., Gulf of Mexico vs. Gulf of America). Special values include: `auto` \- the worldview is determined by the location of the client, `default` \- disputed areas are returned without country information, countries with disputed borders are returned without full geometry.<br>Example: `ch`<br>Allowed values: <br>`default``auto``ch``us`<br>Default: `default` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [SearchResults](https://docs.maptiler.com/cloud/api/geocoding/#SearchResults) |
| 400 |  | Query too long / Invalid parameters |
| 403 |  | Key is missing, invalid or restricted |

## [Search by coordinates (reverse)](https://docs.maptiler.com/cloud/api/geocoding/\#search-by-coordinates-reverse)

GET https://api.maptiler.com/geocoding/{longitude},{latitude}.json

Reverse geocoding (search by coordinates).

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| longitude | number | Example: `8.528509`<br>`>= -180``<= 180` |
| latitude | number | Example: `47.3774434`<br>`>= -90``<= 90` |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| language | array \[string\] | Prefer results in specific language specified as ISO 639-1 code. Only the first language code is used when prioritizing forward geocode results to be matched. If this query parameter is omited then Accept-Language HTTP header will be analyzed. If the parameter is provided but is empty then no language preference is made.<br>Example: `de,en`<br>`<= 20` items<br>Allowed values: <br>`aa``ab``ae``af``ak``am``an``ar``as``av``ay``az``ba``be``bg``bh``bi``bm``bn``bo``br``bs``ca``ce``ch``co``cr``cs``cu``cv``cy``da``de``dv``dz``ee``el``en``eo``es``et``eu``fa``ff``fi``fj``fo``fr``fy``ga``gd``gl``gn``gu``gv``ha``he``hi``ho``hr``ht``hu``hy``hz``ia``id``ie``ig``ii``ik``io``is``it``iu``ja``jv``ka``kg``ki``kj``kk``kl``km``kn``ko``kr``ks``ku``kv``kw``ky``la``lb``lg``li``ln``lo``lt``lu``lv``mg``mh``mi``mk``ml``mn``mr``ms``mt``my``na``nb``nd``ne``ng``nl``nn``no``nr``nv``ny``oc``oj``om``or``os``pa``pi``pl``ps``pt``qu``rm``rn``ro``ru``rw``sa``sc``sd``se``sg``si``sk``sl``sm``sn``so``sq``sr``ss``st``su``sv``sw``ta``te``tg``th``ti``tk``tl``tn``to``tr``ts``tt``tw``ty``ug``uk``ur``uz``ve``vi``vo``wa``wo``xh``yi``yo``za``zh``zu`<br>Unique values: <br>`true` |
| limit | integer | Maximum number of results to return. For reverse geocoding with multiple types this must not be set or must be set to 1.<br>`>= 1``<= 10`<br>Default: `5` |
| types | array\[ [PlaceType](https://docs.maptiler.com/cloud/api/geocoding/#PlaceType)\] | Filter types of which features to return. If not specified, features of all types except `poi` and `major_landform` are returned (`types = ["poi", "major_landform"]`, `excludeTypes = true`). In case of reverse geocoding if just a single type is specified, then multiple nearby features of the single type can be returned, otherwise single feature for every specified type (or default types) can be returned.<br>Unique values: <br>`true` |
| excludeTypes | boolean | Set to `true` to use all available feature types except those specified in `types`.<br>Default: `false` |
| worldview | string | Some of the geographical boundaries and names are disputed. When `worldview` option is selected, the Geocoding API responses will be aligned with the borders and names recognized by the selected country (US or Switzerland). This affects filtering by country, the context returned with the given feature and also some of the labels (e.g., Gulf of Mexico vs. Gulf of America). Special values include: `auto` \- the worldview is determined by the location of the client, `default` \- disputed areas are returned without country information, countries with disputed borders are returned without full geometry.<br>Example: `ch`<br>Allowed values: <br>`default``auto``ch``us`<br>Default: `default` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [SearchResults](https://docs.maptiler.com/cloud/api/geocoding/#SearchResults) |
| 400 |  | Query too long / Invalid parameters |
| 403 |  | Key is missing, invalid or restricted |

## [Search by feature ID](https://docs.maptiler.com/cloud/api/geocoding/\#search-by-feature-id)

GET https://api.maptiler.com/geocoding/{id}.json

Search feature by its ID (\`id\`) as returned in forward or reverse geocoding response and return its full geometry. Note that the feature ID is not stable and it changes when the database is re-indexed.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| id | string | Feature ID (found in response of forward or reverse geocoding)<br>Example: `country.26561650`<br>Match pattern: `^(\S+)\.([0-9]+)$` |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| language | array \[string\] | Prefer results in specific language specified as ISO 639-1 code. Only the first language code is used when prioritizing forward geocode results to be matched. If this query parameter is omited then Accept-Language HTTP header will be analyzed. If the parameter is provided but is empty then no language preference is made.<br>Example: `de,en`<br>`<= 20` items<br>Allowed values: <br>`aa``ab``ae``af``ak``am``an``ar``as``av``ay``az``ba``be``bg``bh``bi``bm``bn``bo``br``bs``ca``ce``ch``co``cr``cs``cu``cv``cy``da``de``dv``dz``ee``el``en``eo``es``et``eu``fa``ff``fi``fj``fo``fr``fy``ga``gd``gl``gn``gu``gv``ha``he``hi``ho``hr``ht``hu``hy``hz``ia``id``ie``ig``ii``ik``io``is``it``iu``ja``jv``ka``kg``ki``kj``kk``kl``km``kn``ko``kr``ks``ku``kv``kw``ky``la``lb``lg``li``ln``lo``lt``lu``lv``mg``mh``mi``mk``ml``mn``mr``ms``mt``my``na``nb``nd``ne``ng``nl``nn``no``nr``nv``ny``oc``oj``om``or``os``pa``pi``pl``ps``pt``qu``rm``rn``ro``ru``rw``sa``sc``sd``se``sg``si``sk``sl``sm``sn``so``sq``sr``ss``st``su``sv``sw``ta``te``tg``th``ti``tk``tl``tn``to``tr``ts``tt``tw``ty``ug``uk``ur``uz``ve``vi``vo``wa``wo``xh``yi``yo``za``zh``zu`<br>Unique values: <br>`true` |
| worldview | string | Some of the geographical boundaries and names are disputed. When `worldview` option is selected, the Geocoding API responses will be aligned with the borders and names recognized by the selected country (US or Switzerland). This affects filtering by country, the context returned with the given feature and also some of the labels (e.g., Gulf of Mexico vs. Gulf of America). Special values include: `auto` \- the worldview is determined by the location of the client, `default` \- disputed areas are returned without country information, countries with disputed borders are returned without full geometry.<br>Example: `ch`<br>Allowed values: <br>`default``auto``ch``us`<br>Default: `default` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | [SearchResults](https://docs.maptiler.com/cloud/api/geocoding/#SearchResults) |
| 400 |  | Query too long / Invalid parameters |
| 403 |  | Key is missing, invalid or restricted |

## [Batch geocoding API](https://docs.maptiler.com/cloud/api/geocoding/\#batch-geocoding-api)

GET https://api.maptiler.com/geocoding/{queries}.json

Perform geocoding of more than one request in a single API call. Check out the [Batch Geocoding guide](https://docs.maptiler.com/guides/geocoding/batch-geocoding-api/) for an example.

### Request

You must include an [API Key](https://docs.maptiler.com/cloud/api/authentication-key) with every API request

#### Path Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| queries | string | Semicolon-separated list of queries. Semicolon `;` must be provided verbatim and not be URL-encoded. Each query may be forward, reverse or by feature ID. Maximum of 50 queries are supported.<br>Example: `Paris;Berlin` |

#### Query Parameters

| Parameters | Type | Description |
| --- | --- | --- |
| bbox | [BoundingBox](https://docs.maptiler.com/cloud/api/geocoding/#BoundingBox) | A `[w, s, e, n]` bounding box array to use for limiting search results. Only features inside the provided bounding box will be included.<br>Example: `5.9559,45.818,10.4921,47.8084` |
| proximity | Any Of \[ [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates), `ip`\] | A `[lon, lat]` array to use for biasing search results or the string `ip` to do server-side IP based geolocation. Specify to prefer results close to a specific location - features closer to the proximity value will be given priority over those further from the proximity value.<br>Example: `8.528509,47.3774434` |
| language | array \[string\] | Prefer results in specific language specified as ISO 639-1 code. Only the first language code is used when prioritizing forward geocode results to be matched. If this query parameter is omited then Accept-Language HTTP header will be analyzed. If the parameter is provided but is empty then no language preference is made.<br>Example: `de,en`<br>`<= 20` items<br>Allowed values: <br>`aa``ab``ae``af``ak``am``an``ar``as``av``ay``az``ba``be``bg``bh``bi``bm``bn``bo``br``bs``ca``ce``ch``co``cr``cs``cu``cv``cy``da``de``dv``dz``ee``el``en``eo``es``et``eu``fa``ff``fi``fj``fo``fr``fy``ga``gd``gl``gn``gu``gv``ha``he``hi``ho``hr``ht``hu``hy``hz``ia``id``ie``ig``ii``ik``io``is``it``iu``ja``jv``ka``kg``ki``kj``kk``kl``km``kn``ko``kr``ks``ku``kv``kw``ky``la``lb``lg``li``ln``lo``lt``lu``lv``mg``mh``mi``mk``ml``mn``mr``ms``mt``my``na``nb``nd``ne``ng``nl``nn``no``nr``nv``ny``oc``oj``om``or``os``pa``pi``pl``ps``pt``qu``rm``rn``ro``ru``rw``sa``sc``sd``se``sg``si``sk``sl``sm``sn``so``sq``sr``ss``st``su``sv``sw``ta``te``tg``th``ti``tk``tl``tn``to``tr``ts``tt``tw``ty``ug``uk``ur``uz``ve``vi``vo``wa``wo``xh``yi``yo``za``zh``zu`<br>Unique values: <br>`true` |
| country | array \[string\] | Limit search to specific country/countries.<br>Example: `sk,cz`<br>Unique values: <br>`true` |
| limit | integer | Maximum number of results to return. For reverse geocoding with multiple types this must not be set or must be set to 1.<br>`>= 1``<= 10`<br>Default: `5` |
| types | array\[ [PlaceType](https://docs.maptiler.com/cloud/api/geocoding/#PlaceType)\] | Filter types of which features to return. If not specified, features of all types except `poi` and `major_landform` are returned (`types = ["poi", "major_landform"]`, `excludeTypes = true`). In case of reverse geocoding if just a single type is specified, then multiple nearby features of the single type can be returned, otherwise single feature for every specified type (or default types) can be returned.<br>Unique values: <br>`true` |
| excludeTypes | boolean | Set to `true` to use all available feature types except those specified in `types`.<br>Default: `false` |
| fuzzyMatch | boolean | Set to `false` to disable fuzzy search.<br>Default: `true` |
| autocomplete | boolean | Set to `true` to use autocomplete, `false` to disable autocomplete.<br>Default: `true` |
| worldview | string | Some of the geographical boundaries and names are disputed. When `worldview` option is selected, the Geocoding API responses will be aligned with the borders and names recognized by the selected country (US or Switzerland). This affects filtering by country, the context returned with the given feature and also some of the labels (e.g., Gulf of Mexico vs. Gulf of America). Special values include: `auto` \- the worldview is determined by the location of the client, `default` \- disputed areas are returned without country information, countries with disputed borders are returned without full geometry.<br>Example: `ch`<br>Allowed values: <br>`default``auto``ch``us`<br>Default: `default` |

##### Request example

```http

```

HTTP

Copy

[Get your **FREE** API key in your MapTiler account](https://cloud.maptiler.com/auth/widget?next=https://cloud.maptiler.com/account/keys/).

### Responses

| Code | Content | Description |
| --- | --- | --- |
| 200 | application/json | Array of geocoding results where items are matching order of queries in the request. Every result is represented as FeatureCollection where every item is represented as a GeoJSON Feature<br> <br>array \[ [SearchResults](https://docs.maptiler.com/cloud/api/geocoding/#SearchResults)\] |
| 400 |  | Query too long / Invalid parameters |
| 403 |  | Key is missing, invalid or restricted |

## [SearchResults](https://docs.maptiler.com/cloud/api/geocoding/\#SearchResults)

Search result represented by FeatureCollection where every item is represented as a GeoJSON Feature

| Property | Type | Description |
| --- | --- | --- |
| type | string | Value: `"FeatureCollection"` |
| features | array of \[ [Feature](https://docs.maptiler.com/cloud/api/geocoding/#Feature)\] | Array of features found |
| query | array \[string\] | Tokenized search query |
| attribution | string | Attribution of the result<br>Example: `© MapTiler © OpenStreetMap contributors` |

## [Feature](https://docs.maptiler.com/cloud/api/geocoding/\#Feature)

Array of features found

| Property | Type | Description |
| --- | --- | --- |
| id | string | Unique feature ID<br>Example: `municipality.46425` |
| text | string | Localized feature name<br>Example: `Paris` |
| language | string | Query’s primary ISO 639-1 language code<br>Example: `en` |
| ^text\_(\\w\\w) | string | A string analogous to the `text` field that matches the query in the requested language. This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language. |
| ^language\_(\\w\\w) | string | A ISO 639-1 query’s fallback language code. This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language. |
| type | string | Value: `"Feature"` |
| properties | [FeatureProperties](https://docs.maptiler.com/cloud/api/geocoding/#FeatureProperties) | Feature properties |
| geometry | Any Of \[ [Point](https://docs.maptiler.com/cloud/api/geocoding/#Point), [LineString](https://docs.maptiler.com/cloud/api/geocoding/#LineString), [Polygon](https://docs.maptiler.com/cloud/api/geocoding/#Polygon), [MultiPoint](https://docs.maptiler.com/cloud/api/geocoding/#MultiPoint), [MultiLineString](https://docs.maptiler.com/cloud/api/geocoding/#MultiLineString), [MultiPolygon](https://docs.maptiler.com/cloud/api/geocoding/#MultiPolygon), [GeometryCollection](https://docs.maptiler.com/cloud/api/geocoding/#GeometryCollection)\] |  |
| bbox | [BoundingBox](https://docs.maptiler.com/cloud/api/geocoding/#BoundingBox) | Bounding box of the original feature as `[w, s, e, n]` array |
| center | [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates) | A `[lon, lat]` array of the original feature centeroid |
| place\_name | string | Formatted (including the hierarchy) and localized feature full name |
| matching\_place\_name | string | A string analogous to the `place_name` field that matches the query. This field is only returned to help you understand how the response aligns with the submitted query. |
| matching\_text | string | A string analogous to the `text` field that matches the query. This field is only returned to help you understand how the response aligns with the submitted query. |
| place\_type | array\[ [PlaceType](https://docs.maptiler.com/cloud/api/geocoding/#PlaceType)\] | An array of feature types describing the feature. Currently each feature has only single type but this may change in the future. |
| place\_type\_name | array \[string\] | Localized type of the place name, matches `place_type` property. |
| relevance | number | Indicates how well the returned feature matches the user’s query on a scale from 0 to 1. 0 means the result does not match the query text at all, while 1 means the result fully matches the query text. You can use the relevance property to remove results that don’t fully match the query. |
| context | array of \[ [Context](https://docs.maptiler.com/cloud/api/geocoding/#Context)\] | Feature hierarchy |
| address | string | Address number, if applicable |
| ^place\_name\_(\\w\\w) | string | A string analogous to the `place_name` field that matches the query in the requested language. This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language. |
| name\* | any |  |

## [FeatureProperties](https://docs.maptiler.com/cloud/api/geocoding/\#FeatureProperties)

| Property | Type | Description |
| --- | --- | --- |
| ref | string | (experimental) External reference of the feature used for debugging purposes. The exact format of this field may change without notice, and should not be relied on at the moment.<br>Example: `osm:r71525` |
| country\_code | string | ISO 3166-1 alpha-2 country code of the feature<br>Example: `fr` |
| kind | string | (experimental) Kind of the feature<br>Allowed values: <br>`road``road_relation``admin_area``place``street``virtual_street` |
| categories | array \[`>= 1`string\] | Array of [POI category](https://docs.maptiler.com/cloud/api/geocoding/#PoiCategory). Only available for `poi` type. Category values may change in the near future. |
| feature\_tags | [Feature tags](https://docs.maptiler.com/cloud/api/geocoding/#Feature%20tags) | (experimental) Feature tags, only available for `poi` type. They can include e.g. working hours, type of amenity or wheelchair access. |
| place\_designation | string | (experimental) Additional information about the place. The main use case is to determine if the administrative area represents a town, a city or a village. This field is especially useful in cases, where a large city is a region, land or prefecture from administrative point of view (typical examples are Berlin and Tokyo).<br>Example: `city` |
| name\* | any |  |

### FeatureProperties example

```json
{
  "ref": "osm:r71525",
  "country_code": "fr",
  "kind": null,
  "categories": ["restaurant"],
  "feature_tags": null,
  "place_designation": "city"
}
```

JSON

Copy

## [Point](https://docs.maptiler.com/cloud/api/geocoding/\#Point)

| Property | Type | Description |
| --- | --- | --- |
| type | string | Value: `"Point"` |
| coordinates | [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates) |  |

## [LineString](https://docs.maptiler.com/cloud/api/geocoding/\#LineString)

| Property | Type | Description |
| --- | --- | --- |
| type | string | Value: `"LineString"` |
| coordinates | array`>= 2`\[ [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates)\] |  |

## [Polygon](https://docs.maptiler.com/cloud/api/geocoding/\#Polygon)

| Property | Type | Description |
| --- | --- | --- |
| type | string | Value: `"Polygon"` |
| coordinates | array \[`>= 4`<br>array`>= 4`\[ [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates)\]<br> \] |  |

## [MultiPoint](https://docs.maptiler.com/cloud/api/geocoding/\#MultiPoint)

| Property | Type | Description |
| --- | --- | --- |
| type | string | Value: `"MultiPoint"` |
| coordinates | array\[ [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates)\] |  |

## [MultiLineString](https://docs.maptiler.com/cloud/api/geocoding/\#MultiLineString)

| Property | Type | Description |
| --- | --- | --- |
| type | string | Value: `"MultiLineString"` |
| coordinates | array \[`>= 2`<br>array`>= 2`\[ [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates)\]<br> \] |  |

## [MultiPolygon](https://docs.maptiler.com/cloud/api/geocoding/\#MultiPolygon)

| Property | Type | Description |
| --- | --- | --- |
| type | string | Value: `"MultiPolygon"` |
| coordinates | array \[`>= 4`<br>array \[`>= 4`<br>array`>= 4`\[ [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates)\]<br> \]<br> \] |  |

## [GeometryCollection](https://docs.maptiler.com/cloud/api/geocoding/\#GeometryCollection)

| Property | Type | Description |
| --- | --- | --- |
| type | string | Value: `"GeometryCollection"` |
| geometries | array<br>Any Of \[ [Point](https://docs.maptiler.com/cloud/api/geocoding/#Point), [LineString](https://docs.maptiler.com/cloud/api/geocoding/#LineString), [Polygon](https://docs.maptiler.com/cloud/api/geocoding/#Polygon), [MultiPoint](https://docs.maptiler.com/cloud/api/geocoding/#MultiPoint), [MultiLineString](https://docs.maptiler.com/cloud/api/geocoding/#MultiLineString), [MultiPolygon](https://docs.maptiler.com/cloud/api/geocoding/#MultiPolygon)\] |  |

## [BoundingBox](https://docs.maptiler.com/cloud/api/geocoding/\#BoundingBox)

| Description | Type | Constraint |
| --- | --- | --- |
| minimal longitude | number | Minimum value: `-180`<br>Maximum value: `180` |
| minimal latitude | number | Minimum value: `-90`<br>Maximum value: `90` |
| maximal longitude | number | Minimum value: `-180`<br>Maximum value: `180` |
| maximal latitude | number | Minimum value: `-90`<br>Maximum value: `90` |

### BoundingBox example

```json
[5.9559, 45.818, 10.4921, 47.8084]
```

JSON

Copy

## [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/\#Coordinates)

| Description | Type | Constraint |
| --- | --- | --- |
| longitude | number | Minimum value: `-180`<br>Maximum value: `180` |
| latitude | number | Minimum value: `-90`<br>Maximum value: `90` |

### Coordinates example

```json
[8.528509, 47.3774434]
```

JSON

Copy

## [Context](https://docs.maptiler.com/cloud/api/geocoding/\#Context)

Feature hierarchy

| Property | Type | Description |
| --- | --- | --- |
| ref | string | (experimental) External reference of the feature used for debugging purposes. The exact format of this field may change without notice, and should not be relied on at the moment.<br>Example: `osm:r71525` |
| country\_code | string | ISO 3166-1 alpha-2 country code of the feature<br>Example: `fr` |
| kind | string | (experimental) Kind of the feature<br>Allowed values: <br>`road``road_relation``admin_area``place``street``virtual_street` |
| categories | array \[`>= 1`string\] | Array of [POI category](https://docs.maptiler.com/cloud/api/geocoding/#PoiCategory). Only available for `poi` type. Category values may change in the near future. |
| feature\_tags | [Feature tags](https://docs.maptiler.com/cloud/api/geocoding/#Feature%20tags) | (experimental) Feature tags, only available for `poi` type. They can include e.g. working hours, type of amenity or wheelchair access. |
| place\_designation | string | (experimental) Additional information about the place. The main use case is to determine if the administrative area represents a town, a city or a village. This field is especially useful in cases, where a large city is a region, land or prefecture from administrative point of view (typical examples are Berlin and Tokyo).<br>Example: `city` |
| id | string | Unique feature ID<br>Example: `municipality.46425` |
| text | string | Localized feature name<br>Example: `Paris` |
| language | string | Query’s primary ISO 639-1 language code<br>Example: `en` |
| ^text\_(\\w\\w) | string | A string analogous to the `text` field that matches the query in the requested language. This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language. |
| ^language\_(\\w\\w) | string | A ISO 639-1 query’s fallback language code. This field is only returned when multiple languages are requested using the `language` parameter, and will be present for each requested language. |
| name\* | any |  |

## [Feature tags](https://docs.maptiler.com/cloud/api/geocoding/\#Feature%20tags)

(experimental) Feature tags, only available for `poi` type. They can include e.g. working hours, type of amenity or wheelchair access.

| Property | Type | Description |
| --- | --- | --- |
| name\* | any |  |

## [PlaceType](https://docs.maptiler.com/cloud/api/geocoding/\#PlaceType)

| Type | Values | Description |
| --- | --- | --- |
| string | - `continental_marine`<br>- `country`<br>- `major_landform`<br>- `region`<br>- `subregion`<br>- `county`<br>- `joint_municipality`<br>- `joint_submunicipality`<br>- `municipality`<br>- `municipal_district`<br>- `locality`<br>- `neighbourhood`<br>- `place`<br>- `postal_code`<br>- `address`<br>- `road`<br>- `poi` | Check out the [descriptions and default values](https://docs.maptiler.com/cloud/api/geocoding/#PlaceTypeValues) of each of the PlaceType values |

## [PlaceType Values](https://docs.maptiler.com/cloud/api/geocoding/\#PlaceTypeValues)

| PlaceType value | Default status | Description |
| --- | --- | --- |
| continental\_marine | `true` | Continents, oceans, seas and other forms of marine water bodies. |
| country | `true` | A sovereign territory with defined borders, a permanent population, and its own government. |
| major\_landform | `false` | Major landforms. |
| region | `true` | Administrative units and settlements. |
| subregion | `true` |
| county | `true` |
| joint\_municipality | `true` |
| joint\_submunicipality | `true` |
| municipality | `true` |
| municipal\_district | `true` |
| locality | `true` |
| neighbourhood | `true` |
| place | `true` |
| postal\_code | `true` | A series of letters, numbers, or both, assigned to specific geographic areas to help sort and deliver mail efficiently. <br> It is also known as a **ZIP code** (in the United States), postcode (in the UK), <br> or **PIN code** (in India), depending on the country. |
| address | `true` | Roof top address point or residential street names. |
| road | `true` | Roads defined by their name or number. From highways to residential streets. |
| poi | `false` | Points of interests can be found by their name or other attributes. Categories search is not enabled at the moment. |

## [POI Category](https://docs.maptiler.com/cloud/api/geocoding/\#PoiCategory)

Category values may change in the near future.

Type: `string`.

List of POIs categories definitions.

- `10pin`
- `3d printing`
- `8pin`
- `9pin`
- `BASE`
- `adit`
- `adult gaming centre`
- `advertising agency`
- `aerialway station`
- `aerodrome`
- `agrarian`
- `agricultural engines`
- `aikido`
- `airsoft`
- `alcohol`
- `allotments`
- `alpine hut`
- `ambulatory care`
- `american`
- `american football`
- `american handball`
- `amusement arcade`
- `animal breeding`
- `animal shelter`
- `anime`
- `antiques`
- `apartment`
- `appliance`
- `aquarium`
- `arch`
- `archaeological site`
- `archery`
- `archipelago`
- `architect`
- `architecture`
- `art`
- `arts centre`
- `artwork`
- `asian`
- `assisted living`
- `associate`
- `association`
- `association football`
- `atelier`
- `athletics`
- `atm`
- `attraction`
- `atv`
- `audiologist`
- `australian football`
- `baby goods`
- `bachelor`
- `badminton`
- `bag`
- `bagel`
- `bakery`
- `balle pelote`
- `bandy`
- `bank`
- `bar`
- `barbecue`
- `bare rock`
- `barefoot`
- `baseball`
- `basic hut`
- `basin`
- `basketball`
- `bathing place`
- `bathroom furnishing`
- `batting cage`
- `bay`
- `bbq`
- `beach`
- `beach resort`
- `beachvolleyball`
- `beauty`
- `bed`
- `bed and breakfast`
- `beef bowl`
- `beekeeper`
- `bell tower`
- `beverages`
- `biathlon`
- `bicycle`
- `bicycle parking`
- `bicycle rental`
- `bicycle repair`
- `bicycle repair station`
- `biergarten`
- `billards`
- `billiards`
- `bird hide`
- `birds nest`
- `blacksmith`
- `blowhole`
- `bmx`
- `boat`
- `boat repair`
- `boatbuilder`
- `bobsleigh`
- `bookbinder`
- `bookmaker`
- `books`
- `boules`
- `boutique`
- `bowling`
- `bowling alley`
- `bowls`
- `boxing`
- `breakfast`
- `brewery`
- `brewing supplies`
- `brothel`
- `brownfield`
- `bubble tea`
- `builder`
- `building materials`
- `bullfighting`
- `bunker`
- `bureau de change`
- `burger`
- `bus station`
- `bus stop`
- `business machines`
- `bust`
- `butcher`
- `cabinet maker`
- `cable car`
- `cafe`
- `cake`
- `calisthenics`
- `camera`
- `camp site`
- `canadian football`
- `canal`
- `candles`
- `cannabis`
- `canoe`
- `canoe hire`
- `cape`
- `car`
- `car parts`
- `car rental`
- `car repair`
- `car service`
- `car wash`
- `caravan`
- `caravan site`
- `carpenter`
- `carpet`
- `carpet layer`
- `casino`
- `castle`
- `catalogue`
- `caterer`
- `cathedral`
- `cave entrance`
- `cemetery`
- `ceramics`
- `chair lift`
- `chalet`
- `chandler`
- `changing rooms`
- `chapel`
- `charging station`
- `charity`
- `cheese`
- `chemist`
- `chess`
- `chicken`
- `childcare`
- `chimney sweeper`
- `chinese`
- `chocolate`
- `church`
- `cinema`
- `city gate`
- `cleaning`
- `cliff diving`
- `climbing`
- `climbing adventure`
- `clinic`
- `clock`
- `clockmaker`
- `clothes`
- `clothing bank`
- `cockfighting`
- `coffee`
- `coffee shop`
- `collector`
- `college`
- `commercial`
- `communication`
- `community centre`
- `compressed air`
- `computer`
- `confectionery`
- `convenience`
- `copyshop`
- `cosmetics`
- `country store`
- `courthouse`
- `covered picnic table`
- `covered reservoir`
- `craft`
- `crepe`
- `cricket`
- `cricket nets`
- `croquet`
- `crossfit`
- `curling`
- `curry`
- `curtain`
- `cycling`
- `dairy`
- `dairy kitchen`
- `dance`
- `dancing`
- `dancing school`
- `darts`
- `day care`
- `deli`
- `delicatessen`
- `delivery`
- `dental technician`
- `dentist`
- `dentures`
- `department store`
- `dessert`
- `device charging station`
- `diplomatic`
- `disc golf`
- `disc golf course`
- `discount`
- `distillery`
- `diving`
- `dock`
- `doctorate`
- `doctors`
- `dog agility`
- `dog park`
- `dog racing`
- `doityourself`
- `donut`
- `doors`
- `dormitory`
- `drag lift`
- `dressing room`
- `dressmaker`
- `drinking spring`
- `drinking water`
- `driving school`
- `dry cleaning`
- `e-cigarette`
- `educational institution`
- `electrical`
- `electrician`
- `electronics`
- `electronics repair`
- `electrotools`
- `embassy`
- `energy`
- `equestrian`
- `erotic`
- `escape game`
- `esoteric`
- `estate agent`
- `events venue`
- `fabric`
- `farm`
- `farmland`
- `farmyard`
- `fashion`
- `fashion accessories`
- `fashion accessories`
- `fast food`
- `feeding place`
- `fell`
- `fencing`
- `ferry terminal`
- `field hockey`
- `field shelter`
- `financial`
- `financial advisor`
- `fire station`
- `firearms`
- `firepit`
- `fireplace`
- `fireworks`
- `fish`
- `fish and chips`
- `fishing`
- `fishmonger`
- `fitness`
- `fitness centre`
- `fitness station`
- `five-a-side`
- `floorball`
- `floorer`
- `flooring`
- `florist`
- `food`
- `food bank`
- `food court`
- `football`
- `footballgolf`
- `forest`
- `fountain`
- `four square`
- `frame`
- `free flying`
- `french`
- `friture`
- `frozen food`
- `fuel`
- `funeral directors`
- `funeral hall`
- `funnel ball`
- `furnace`
- `furniture`
- `futsal`
- `gaelic games`
- `gaga`
- `gallery`
- `gambling`
- `games`
- `garages`
- `garden`
- `garden centre`
- `garden furniture`
- `garden machinery`
- `gardener`
- `gas`
- `gate`
- `general`
- `general store`
- `georgian`
- `german`
- `geyser`
- `gift`
- `glacier`
- `glass`
- `glaziery`
- `gold buyer`
- `golf`
- `golf course`
- `gondola`
- `goods`
- `graffiti`
- `grassland`
- `grave yard`
- `greek`
- `greengrocer`
- `grill`
- `grocery`
- `groundskeeping`
- `group home`
- `guest house`
- `guidepost`
- `guns`
- `gymnastics`
- `haberdashery`
- `hackerspace`
- `hairdresser`
- `hairdresser supply`
- `halt`
- `handball`
- `handicraft`
- `hangar`
- `hardware`
- `health`
- `health food`
- `hearing aids`
- `heath`
- `helipad`
- `herbalist`
- `hifi`
- `hobby`
- `hockey`
- `honey`
- `hookah`
- `horse racing`
- `horse riding`
- `horseshoes`
- `hospice`
- `hospital`
- `hostel`
- `hot dog`
- `hot spring`
- `hot tub`
- `hotel`
- `household`
- `household linen`
- `houseware`
- `hunting`
- `hunting stand`
- `hvac`
- `ice cream`
- `ice hockey`
- `ice rink`
- `ice skating`
- `ice stock`
- `indian`
- `indonesian`
- `industrial`
- `information office`
- `installation`
- `insurance`
- `interior decoration`
- `international`
- `island`
- `islet`
- `italian`
- `italian pizza`
- `j-bar`
- `japanese`
- `jeweller`
- `jewelry`
- `joiner`
- `judo`
- `juice`
- `junk yard`
- `karate`
- `karting`
- `kebab`
- `key cutter`
- `kickboxing`
- `kindergarten`
- `kiosk`
- `kitchen`
- `kitchenware`
- `kitesurfing`
- `korean`
- `korfball`
- `krachtbal`
- `lacrosse`
- `lamps`
- `landfill`
- `language school`
- `laser tag`
- `laundromat`
- `laundry`
- `lawyer`
- `lean to`
- `leather`
- `lebanese`
- `library`
- `lighthouse`
- `lighting`
- `local`
- `locksmith`
- `long jump`
- `lottery`
- `magic carpet`
- `mall`
- `manor`
- `maps`
- `marina`
- `marine`
- `marketplace`
- `martial arts`
- `massage`
- `master's`
- `maze`
- `meadow`
- `medical`
- `medical supply`
- `mediterranean`
- `memorial`
- `mexican`
- `military`
- `military surplus`
- `mineral spring`
- `mineshaft`
- `miniature golf`
- `mixed lift`
- `mobile home`
- `mobile phone`
- `mobility scooter`
- `model`
- `model aerodrome`
- `monastery`
- `money lender`
- `money transfer`
- `monument`
- `mosaic`
- `mosque`
- `motel`
- `motocross`
- `motor`
- `motorcycle`
- `motorcycle parking`
- `motorcycle parts`
- `motorcycle rental`
- `motorcycle repair`
- `motorhome`
- `motorsports`
- `mountain range`
- `multi`
- `mural`
- `museum`
- `music`
- `music school`
- `musical instrument`
- `national park`
- `netball`
- `new age`
- `newsagent`
- `ngo`
- `nightclub`
- `nine mens morris`
- `noodle`
- `notary`
- `nursing home`
- `nutrition supplements`
- `nuts`
- `observation tower`
- `observatory`
- `obstacle course`
- `ocean`
- `office supplies`
- `optician`
- `orchard`
- `organic`
- `orienteering`
- `outdoor`
- `outpost`
- `outreach`
- `paddle tennis`
- `padel`
- `paint`
- `paintball`
- `painter`
- `painting`
- `pancake`
- `parachuting`
- `paragliding`
- `parcel locker`
- `park`
- `parking`
- `parking entrance`
- `parking space`
- `parkour`
- `party`
- `pasta`
- `pastry`
- `pawnbroker`
- `peak`
- `pelota`
- `peninsula`
- `perfumery`
- `pest control`
- `pesäpallo`
- `pet`
- `pet grooming`
- `petanque`
- `pharmacy`
- `photo`
- `photo studio`
- `photographer`
- `photographic laboratory`
- `photography`
- `pickleball`
- `picnic shelter`
- `picnic site`
- `picnic table`
- `piercing`
- `pilates`
- `pitch`
- `pizza`
- `place of mourning`
- `place of worship`
- `plain`
- `planetarium`
- `plant hire`
- `plasterer`
- `plateau`
- `platter`
- `playground`
- `plumber`
- `pole dance`
- `police`
- `polo`
- `portuguese`
- `post box`
- `post office`
- `post-graduate school`
- `pottery`
- `power plant`
- `power tools`
- `primary school`
- `printer`
- `printer ink`
- `printing`
- `prison`
- `protected area`
- `protected tree`
- `psychic`
- `pub`
- `public bookcase`
- `public building`
- `public transport`
- `pyrotechnics`
- `quarry`
- `racquet`
- `radiotechnics`
- `railway halt`
- `railway station`
- `ramen`
- `ranger station`
- `rc car`
- `recreation ground`
- `recycling`
- `regional`
- `relief`
- `religion`
- `rental`
- `repair`
- `reservoir`
- `residential`
- `resort`
- `restaurant`
- `retail`
- `rice`
- `ridge`
- `river`
- `rock`
- `rock shelter`
- `roller hockey`
- `roller skating`
- `roofer`
- `rope tow`
- `rowing`
- `rugby`
- `rugby league`
- `rugby union`
- `running`
- `saddle`
- `saddler`
- `safety training`
- `sailing`
- `salad`
- `salon`
- `sand`
- `sandwich`
- `sauna`
- `sawmill`
- `scaffolder`
- `school`
- `scooter`
- `scree`
- `scrub`
- `scuba diving`
- `scuba diving`
- `sculptor`
- `sculpture`
- `sea`
- `seafood`
- `second hand`
- `second hand`
- `secondary school`
- `security`
- `sewing`
- `shed`
- `shelter`
- `ship chandler`
- `shoe repair`
- `shoemaker`
- `shoes`
- `shooting`
- `shooting ground`
- `shooting range`
- `shopping centre`
- `shot-put`
- `shower`
- `shuffleboard`
- `signmaker`
- `sinkhole`
- `skate`
- `skateboard`
- `skating`
- `ski`
- `ski jumping`
- `ski rental`
- `skiing`
- `smoking area`
- `snack`
- `snooker`
- `snowmobile`
- `soccer`
- `social centre`
- `social club`
- `softball`
- `soup kitchen`
- `souvenir`
- `spanish`
- `spare parts`
- `speedway`
- `spices`
- `sports`
- `sports centre`
- `sports hall`
- `spring`
- `squash`
- `stadium`
- `station`
- `stationery`
- `statue`
- `steak`
- `steak house`
- `stone`
- `stonemason`
- `stop`
- `storage rental`
- `strait`
- `stream`
- `street vendor`
- `streetball`
- `stripclub`
- `studio`
- `subway`
- `summer camp`
- `sumo`
- `sun shelter`
- `supermarket`
- `surf`
- `surfing`
- `sushi`
- `swimming`
- `swimming area`
- `swimming pool`
- `synagogue`
- `t-bar`
- `table soccer`
- `table tennis`
- `taekwondo`
- `tailor`
- `takeaway`
- `tanning salon`
- `tapas`
- `tattoo`
- `tax advisor`
- `taxi`
- `tea`
- `team handball`
- `telecommunication`
- `telephone`
- `telescope`
- `temple`
- `tennis`
- `terminal`
- `tetherball`
- `tex-mex`
- `thai`
- `theatre`
- `theme park`
- `ticket`
- `tiler`
- `tiles`
- `tinsmith`
- `tobacco`
- `toboggan`
- `toilets`
- `tomb`
- `tool hire`
- `tools`
- `touch football`
- `townhall`
- `toys`
- `track`
- `tractor`
- `trade`
- `traffic park`
- `trail riding station`
- `trailer`
- `train halt`
- `train station`
- `tram stop`
- `trampoline`
- `trampoline park`
- `travel agency`
- `tree`
- `trolley bay`
- `trophy`
- `truck`
- `truck repair`
- `turkish`
- `tyres`
- `ultimate`
- `ultralight aviation`
- `university`
- `upholsterer`
- `vacuum cleaner`
- `valley`
- `variety store`
- `vehicle inspection`
- `vending machine`
- `veterinary`
- `video`
- `video games`
- `vietnamese`
- `viewpoint`
- `vineyard`
- `volleyball`
- `wakeboarding`
- `wastewater plant`
- `watches`
- `watchmaker`
- `water`
- `water park`
- `water point`
- `water polo`
- `water ski`
- `water sports`
- `water tap`
- `water tower`
- `water well`
- `waterfall`
- `watering place`
- `watermill`
- `weapons`
- `weather shelter`
- `weightlifting`
- `welder`
- `wellness`
- `wetland`
- `wholesale`
- `wigs`
- `wilderness hut`
- `wildlife hide`
- `windmill`
- `window blind`
- `window construction`
- `windows`
- `windsurfing`
- `wine`
- `wine cellar`
- `winery`
- `wings`
- `winter sports`
- `wood`
- `wool`
- `workout`
- `workshop`
- `wrestling`
- `yoga`
- `zip line`
- `zoo`
- `zurkhaneh sport`

![](https://docs.maptiler.com/assets/img/open-api.png)

Using the OpenAPI Specification?

Get the [openapi.yaml](https://docs.maptiler.com/_data/cloud/api/openapi.yml)

On this page

- [How to use the API](https://docs.maptiler.com/cloud/api/geocoding/#how-to-use-the-api)
- [Getting started](https://docs.maptiler.com/cloud/api/geocoding/#getting-started)
- [Search by name (forward)](https://docs.maptiler.com/cloud/api/geocoding/#search-by-name-forward)
- [Search by coordinates (reverse)](https://docs.maptiler.com/cloud/api/geocoding/#search-by-coordinates-reverse)
- [Search by feature ID](https://docs.maptiler.com/cloud/api/geocoding/#search-by-feature-id)
- [Batch geocoding API](https://docs.maptiler.com/cloud/api/geocoding/#batch-geocoding-api)
- [SearchResults](https://docs.maptiler.com/cloud/api/geocoding/#SearchResults)
- [Feature](https://docs.maptiler.com/cloud/api/geocoding/#Feature)
- [FeatureProperties](https://docs.maptiler.com/cloud/api/geocoding/#FeatureProperties)
- [Point](https://docs.maptiler.com/cloud/api/geocoding/#Point)
- [LineString](https://docs.maptiler.com/cloud/api/geocoding/#LineString)
- [Polygon](https://docs.maptiler.com/cloud/api/geocoding/#Polygon)
- [MultiPoint](https://docs.maptiler.com/cloud/api/geocoding/#MultiPoint)
- [MultiLineString](https://docs.maptiler.com/cloud/api/geocoding/#MultiLineString)
- [MultiPolygon](https://docs.maptiler.com/cloud/api/geocoding/#MultiPolygon)
- [GeometryCollection](https://docs.maptiler.com/cloud/api/geocoding/#GeometryCollection)
- [BoundingBox](https://docs.maptiler.com/cloud/api/geocoding/#BoundingBox)
- [Coordinates](https://docs.maptiler.com/cloud/api/geocoding/#Coordinates)
- [Context](https://docs.maptiler.com/cloud/api/geocoding/#Context)
- [Feature tags](https://docs.maptiler.com/cloud/api/geocoding/#Feature%20tags)
- [PlaceType](https://docs.maptiler.com/cloud/api/geocoding/#PlaceType)
- [PlaceType Values](https://docs.maptiler.com/cloud/api/geocoding/#PlaceTypeValues)
- [POI Category](https://docs.maptiler.com/cloud/api/geocoding/#PoiCategory)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

MapTiler API


Geocoding API: search and reverse geocoding

Geocoding API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)