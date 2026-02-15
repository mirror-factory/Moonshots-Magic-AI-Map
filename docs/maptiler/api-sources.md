# Sources

A **source** provides the data that is displayed on a map. Sources are defined by the [GL Style Specification](https://docs.maptiler.com/gl-style-specification/sources/).


## [Vector Tile](https://docs.maptiler.com/sdk-js/api/sources/\#vector)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/vector\_tile\_source.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/geojson_source.ts)

A vector tile source. Tiles must be in [Vector Tile format](https://www.maptiler.com/news/2019/02/what-are-vector-tiles-and-why-you-should-care/).
All layers that use a vector source must specify a "source-layer" value.
(See the [Style Specification](https://docs.maptiler.com/gl-style-specification/sources/#vector)
for detailed documentation of options.)

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#vector-example)

```js
map.addSource('planet', {
    type: 'vector',
    data: 'https://api.maptiler.com/tiles/v3/tiles.json'
});
```

JavaScript

Copy

```js
map.addSource('planet', {
    type: 'vector',
    tiles: ['https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf'],
    minzoom: 0,
    maxzoom: 15
});
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/sources/\#vector-instance-members)

listens(type)

Returns a true if this instance of Evented or any forwarded instances of Evented has a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/sources/#listens-vector-parameters)

type`(string)`The event type.

[Returns](https://docs.maptiler.com/sdk-js/api/sources/#listens-vector-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#off-vector-parameters)

type`(string)`The
event type to remove listeners for.


listener`(Function)`The
listener function to remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#off-vector-returns)

`

          VectorTileSource

`: `this`

on(type, listener)

Adds a listener to a specified event type.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#on-vector-parameters)

type`(string)`The
event type to add a listen for.


listener`(Function)`The
function to be called when the event is fired.
The listener function is called with the data object passed to
`fire`
,
extended with
`target`
and
`type`
properties.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#on-vector-returns)

`

          VectorTileSource

`: `this`

once(type, listener)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#once-vector-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The
function to be called when the event is fired the first time.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#once-vector-returns)

`

          VectorTileSource

`: `this`

setEventedParent(parent?, data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-vector-parameters)

parent`(Evented)`

data`(any)`

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-vector-returns)

`

          VectorTileSource

`: `this`

setTiles(tiles)

Sets the source `tiles` property and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#settiles-vector-parameters)

tiles`(Array<string>)`An array of one or more tile source URLs, as in the TileJSON spec.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#settiles-vector-returns)

`

            VectorTileSource

`: `this`

setUrl(url)

Sets the source `url` property and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seturl-vector-parameters)

url`(string)`A URL to a TileJSON resource. Supported protocols are http: and https:.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seturl-vector-returns)

`

            VectorTileSource

`: `this`

### [Related examples](https://docs.maptiler.com/sdk-js/api/sources/\#vector-related)

- [Add a vector tile source](https://docs.maptiler.com/sdk-js/examples/vector-source/)
- [Add a third party vector tile source](https://docs.maptiler.com/sdk-js/examples/third-party/)

## [Raster Tile](https://docs.maptiler.com/sdk-js/api/sources/\#raster)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/raster\_tile\_source.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/raster_tile_source.ts)

A raster tile source. Tiles must be in [ZXY](https://docs.maptiler.com/guides/map-tiling-hosting/data-processing/tiling-scheme-in-folder-output#TilingschemeinFolderoutput-OpenGISWMTS/OpenStreetMap/GoogleXYZ/ZXY) or [TMS](https://docs.maptiler.com/guides/map-tiling-hosting/data-processing/tiling-scheme-in-folder-output#TilingschemeinFolderoutput-OSGEOTMS) tile format.
(See the [Style Specification](https://docs.maptiler.com/gl-style-specification/sources/#raster)
for detailed documentation of options.)

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#raster-example)

```js
map.addSource('satellite', {
    type: 'raster',
    data: 'https://api.maptiler.com/tiles/satellite-v2/tiles.json'
});
```

JavaScript

Copy

```js
map.addSource('satellite', {
    type: 'raster',
    tiles: ['https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg'],
    minzoom: 0,
    maxzoom: 20
});
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/sources/\#raster-instance-members)

listens(type)

Returns a true if this instance of Evented or any forwarded instances of Evented has a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/sources/#listens-raster-parameters)

type`(string)`The event type.

[Returns](https://docs.maptiler.com/sdk-js/api/sources/#listens-raster-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#off-raster-parameters)

type`(string)`The
event type to remove listeners for.


listener`(Function)`The
listener function to remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#off-raster-returns)

`

          RasterTileSource

`: `this`

on(type, listener)

Adds a listener to a specified event type.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#on-raster-parameters)

type`(string)`The
event type to add a listen for.


listener`(Function)`The
function to be called when the event is fired.
The listener function is called with the data object passed to
`fire`
,
extended with
`target`
and
`type`
properties.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#on-raster-returns)

`

          RasterTileSource

`: `this`

once(type, listener)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#once-raster-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The
function to be called when the event is fired the first time.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#once-raster-returns)

`

          RasterTileSource

`: `this`

setEventedParent(parent?, data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-raster-parameters)

parent`(Evented)`

data`(any)`

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-raster-returns)

`

          RasterTileSource

`: `this`

setTiles(tiles)

Sets the source `tiles` property and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#settiles-raster-parameters)

tiles`(Array<string>)`An array of one or more tile source URLs, as in the raster tiles spec

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#settiles-raster-returns)

`

            RasterTileSource

`: `this`

setUrl(url)

Sets the source `url` property and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seturl-raster-parameters)

url`(string)`A URL to a TileJSON resource. Supported protocols are http: and https:.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seturl-raster-returns)

`

            RasterTileSource

`: `this`

### [Related examples](https://docs.maptiler.com/sdk-js/api/sources/\#raster-related)

- [Add a raster tile source](https://docs.maptiler.com/sdk-js/examples/map-tiles/)
- [Add a WMS source](https://docs.maptiler.com/sdk-js/examples/wms/)

## [GeoJSON](https://docs.maptiler.com/sdk-js/api/sources/\#geojsonsource)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/geojson\_source.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/geojson_source.ts#L68-L346)

A source containing GeoJSON.
(See the [Style Specification](https://docs.maptiler.com/gl-style-specification/#sources-geojson)
for detailed documentation of options.)

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#geojsonsource-example)

```js
map.addSource('some id', {
    type: 'geojson',
    data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson'
});
```

JavaScript

Copy

```js
map.addSource('some id', {
   type: 'geojson',
   data: {
       "type": "FeatureCollection",
       "features": [{\
           "type": "Feature",\
           "properties": {},\
           "geometry": {\
               "type": "Point",\
               "coordinates": [\
                   -76.53063297271729,\
                   39.18174077994108\
               ]\
           }\
       }]
   }
});
```

JavaScript

Copy

```js
map.getSource('some id').setData({
  "type": "FeatureCollection",
  "features": [{\
      "type": "Feature",\
      "properties": { "name": "Null Island" },\
      "geometry": {\
          "type": "Point",\
          "coordinates": [ 0, 0 ]\
      }\
  }]
});
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/sources/\#geojsonsource-instance-members)

\_updateWorkerData(diff?)

Responsible for invoking WorkerSource's geojson.loadData target, which handles loading the geojson
data and preparing to serve it up as tiles, using geojson-vt or supercluster as appropriate.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#updateworkerdata-parameters)

diff`(GeoJSONSourceDiff)`The diff object

callback`(Callback<Array<GeoJSON.Feature>>)`A
callback to be called when the features are retrieved (
`(error, features) => { ... }`
).


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#updateworkerdata-returns)

`Promise<void[]>`

abortTile(tile)

Allows to abort a tile loading.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#abortTile-parameters)

tile`(Tile)`The tile to abort

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#abortTile-returns)

`Promise<void[]>`

getBounds()

Allows getting the source's boundaries. If there's a problem with the source's data, it will return an empty `LngLatBounds`.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#getBounds-returns)

`
          Promise<LngLatBounds>
`: A promise which resolves to the source's boundaries.

getClusterChildren(clusterId)

For clustered sources, fetches the children of the given cluster on the next zoom level (as an array of
GeoJSON features).

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#getclusterchildren-parameters)

clusterId`(number)`The value of the cluster's `cluster_id` property.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#getclusterchildren-returns)

`
          Promise<Feature<Geometry,{ [name: string]: any; }>[]>
`: A promise that is resolved when the features are retrieved.

getClusterExpansionZoom(clusterId)

For clustered sources, fetches the zoom at which the given cluster expands.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#getclusterexpansionzoom-parameters)

clusterId`(number)`The
value of the cluster's
`cluster_id`
property.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#getclusterexpansionzoom-returns)

`
          Promise<number>
`: A promise that is resolved with the zoom number.

getClusterLeaves(clusterId, limit, offset)

For clustered sources, fetches the original points that belong to the cluster (as an array of GeoJSON
features).

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#getclusterleaves-parameters)

clusterId`(number)`The
value of the cluster's
`cluster_id`
property.


limit`(number)`The
maximum number of features to return.


offset`(number)`The
number of features to skip (e.g. for pagination).


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#getclusterleaves-returns)

`
          Promise<Feature<Geometry,{ [name: string]: any; }>[]>
`: A promise that is resolved when the features are retrieved.

##### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#getclusterleaves-example)

```js
// Retrieve cluster leaves on click
map.on('click', 'clusters', function(e) {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
  });

  const clusterId = features[0].properties.cluster_id;
  const pointCount = features[0].properties.point_count;
  const clusterSource = map.getSource('clusters');

  clusterSource.getClusterLeaves(clusterId, pointCount, 0, function(error, features) {
    // Print cluster leaves in the console
    console.log('Cluster leaves:', error, features);
  })
});
```

JavaScript

Copy

getData()

Allows to get the source's actual GeoJSON data.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#getData-returns)

A promise which resolves to the source's actual GeoJSON data.
`Promise` <
`GeoJSON` >


hasTransition()

True if the source has transition, false otherwise.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#hasTransition-returns)

`boolean`

listens(type)

Returns a true if this instance of Evented or any forwarded instances of Evented has a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/sources/#listens-geojsonsource-parameters)

type`(string)`The event type.

[Returns](https://docs.maptiler.com/sdk-js/api/sources/#listens-geojsonsource-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#off-geojsonsource-parameters)

type`(string)`The
event type to remove listeners for.


listener`(Function)`The
listener function to remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#off-geojsonsource-returns)

`

          GeoJSONSource

`: `this`

on(type, listener)

Adds a listener to a specified event type.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#on-geojsonsource-parameters)

type`(string)`The
event type to add a listen for.


listener`(Function)`The
function to be called when the event is fired.
The listener function is called with the data object passed to
`fire`
,
extended with
`target`
and
`type`
properties.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#on-geojsonsource-returns)

`

          GeoJSONSource

`: `this`

once(type, listener)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#once-geojsonsource-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The
function to be called when the event is fired the first time.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#once-geojsonsource-returns)

`

          GeoJSONSource

`: `this`

setEventedParent(parent?, data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-geojsonsource-parameters)

parent`(Evented)`

data`(any)`

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-geojsonsource-returns)

`

          GeoJSONSource

`: `this`

loaded()

True if the source is loaded, false otherwise.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#loaded-returns)

`boolean`

loadTile(tile)

This method does the heavy lifting of loading a tile. In most cases it will defer the work to the relevant worker source.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#loadTile-parameters)

tile`(Tile)`The tile to load

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#loadTile-returns)

`Promise<void[]>`

serialize()

This method returns a plain (stringifiable) JS object representing the current state of the source. Creating a source using the returned object as the options should result in a Source that is equivalent to this one.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#serialize-returns)

`GeoJSONSourceSpecification`

setClusterOptions(options)

To disable/enable clustering on the source options.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#setclusteroptions-parameters)

options`(SetClusterOptions)`The options to set

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#setclusteroptions-returns)

`GeoJSONSource`:
this


##### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#setclusteroptions-example)

```js
map.getSource('some id').setClusterOptions({cluster: false});
map.getSource('some id').setClusterOptions({cluster: false, clusterRadius: 50, clusterMaxZoom: 14});
```

JavaScript

Copy

setData(data)

Sets the GeoJSON data and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#setdata-parameters)

data`((Object | string))`A
GeoJSON data object or a URL to one. The latter is preferable in the case of large GeoJSON files.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#setdata-returns)

`GeoJSONSource`:
this


unloadTile(tile)

Allows to unload a tile.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#unloadTile-parameters)

tile`(Tile)`The tile to unload

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#unloadTile-returns)

`Promise<void[]>`

updateData(diff)

Updates the source's GeoJSON, and re-renders the map.

For sources with lots of features, this method can be used to make updates more quickly.

This approach requires unique IDs for every feature in the source.
The IDs can either be specified on the feature, or by using the promoteId option to specify which property should be used as the ID.

It is an error to call updateData on a source that did not have unique IDs for each of its features already.

Updates are applied on a best-effort basis, updating an ID that does not exist will not result in an error.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#updatedata-parameters)

diff`(GeoJSONSourceDiff)`The changes that need to be applied.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#updatedata-returns)

`GeoJSONSource`:
this


### [Related examples](https://docs.maptiler.com/sdk-js/api/sources/\#geojsonsource-related)

- [Draw GeoJSON points](https://docs.maptiler.com/sdk-js/examples/geojson-markers/)
- [Add a GeoJSON line](https://docs.maptiler.com/sdk-js/examples/geojson-line/)
- [Create a heatmap from points](https://docs.maptiler.com/sdk-js/examples/heatmap-layer/)
- [Create and style clusters](https://docs.maptiler.com/sdk-js/examples/cluster/)

## [Raster DEM Tile](https://docs.maptiler.com/sdk-js/api/sources/\#raster-dem)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/raster\_dem\_tile\_source.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/raster_dem_tile_source.ts)

A raster DEM source. Only supports [Terrain RGB format](https://docs.maptiler.com/guides/map-tiling-hosting/data-hosting/rgb-terrain-by-maptiler).
(See the [Style Specification](https://docs.maptiler.com/gl-style-specification/sources/#raster-dem)
for detailed documentation of options.)

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#raster-dem-example)

```js
map.addSource('terrain-rgb', {
    type: 'raster-dem',
    data: 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json'
});
```

JavaScript

Copy

```js
map.addSource('satellite', {
    type: 'raster-dem',
    tiles: ['https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp'],
    minzoom: 0,
    maxzoom: 12
});
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/sources/\#raster-dem-instance-members)

listens(type)

Returns a true if this instance of Evented or any forwarded instances of Evented has a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/sources/#listens-raster-dem-parameters)

type`(string)`The event type.

[Returns](https://docs.maptiler.com/sdk-js/api/sources/#listens-raster-dem-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#off-raster-dem-parameters)

type`(string)`The
event type to remove listeners for.


listener`(Function)`The
listener function to remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#off-raster-dem-returns)

`

          RasterDEMTileSource

`: `this`

on(type, listener)

Adds a listener to a specified event type.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#on-raster-dem-parameters)

type`(string)`The
event type to add a listen for.


listener`(Function)`The
function to be called when the event is fired.
The listener function is called with the data object passed to
`fire`
,
extended with
`target`
and
`type`
properties.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#on-raster-dem-returns)

`

          RasterDEMTileSource

`: `this`

once(type, listener)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#once-raster-dem-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The
function to be called when the event is fired the first time.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#once-raster-dem-returns)

`

          RasterDEMTileSource

`: `this`

setEventedParent(parent?, data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-raster-dem-parameters)

parent`(Evented)`

data`(any)`

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-raster-dem-returns)

`

          RasterDEMTileSource

`: `this`

setTiles(tiles)

Sets the source `tiles` property and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#settiles-dem-parameters)

tiles`(Array<string>)`An array of one or more tile source URLs, as in the raster tiles spec

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#settiles-dem-returns)

`

              RasterDEMTileSource

`: `this`

setUrl(url)

Sets the source `url` property and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seturl-raster-dem-parameters)

url`(string)`A URL to a TileJSON resource. Supported protocols are http: and https:.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seturl-raster-dem-returns)

`

              RasterDEMTileSource

`: `this`

### [Related examples](https://docs.maptiler.com/sdk-js/api/sources/\#raster-dem-related)

- [Add hillshading](https://docs.maptiler.com/sdk-js/examples/hillshade/)

## [Image](https://docs.maptiler.com/sdk-js/api/sources/\#imagesource)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/image\_source.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/image_source.ts#L64-L274)

A data source containing an image.
(See the [Style Specification](https://docs.maptiler.com/gl-style-specification/#sources-image)
for detailed documentation of options.)

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#imagesource-example)

```js
// add to map
map.addSource('some id', {
   type: 'image',
   url: 'https://www.maplibre.org/images/foo.png',
   coordinates: [\
       [-76.54, 39.18],\
       [-76.52, 39.18],\
       [-76.52, 39.17],\
       [-76.54, 39.17]\
   ]
});

// update coordinates
const mySource = map.getSource('some id');
mySource.setCoordinates([\
    [-76.54335737228394, 39.18579907229748],\
    [-76.52803659439087, 39.1838364847587],\
    [-76.5295386314392, 39.17683392507606],\
    [-76.54520273208618, 39.17876344106642]\
]);

// update url and coordinates simultaneously
mySource.updateImage({
   url: 'https://www.maplibre.org/images/bar.png',
   coordinates: [\
       [-76.54335737228394, 39.18579907229748],\
       [-76.52803659439087, 39.1838364847587],\
       [-76.5295386314392, 39.17683392507606],\
       [-76.54520273208618, 39.17876344106642]\
   ]
})

map.removeSource('some id');  // remove
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/sources/\#imagesource-instance-members)

listens(type)

Returns a true if this instance of Evented or any forwarded instances of Evented has a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/sources/#listens-imagesource-parameters)

type`(string)`The event type.

[Returns](https://docs.maptiler.com/sdk-js/api/sources/#listens-imagesource-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#off-imagesource-parameters)

type`(string)`The
event type to remove listeners for.


listener`(Function)`The
listener function to remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#off-imagesource-returns)

`

          ImageSource

`: `this`

on(type, listener)

Adds a listener to a specified event type.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#on-imagesource-parameters)

type`(string)`The
event type to add a listen for.


listener`(Function)`The
function to be called when the event is fired.
The listener function is called with the data object passed to
`fire`
,
extended with
`target`
and
`type`
properties.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#on-imagesource-returns)

`

          ImageSource

`: `this`

once(type, listener)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#once-imagesource-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The
function to be called when the event is fired the first time.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#once-imagesource-returns)

`

          ImageSource

`: `this`

setEventedParent(parent?, data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-imagesource-parameters)

parent`(Evented)`

data`(any)`

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-imagesource-returns)

`

          ImageSource

`: `this`

setCoordinates(coordinates)

Sets the image's coordinates and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#setcoordinates-image-parameters)

coordinates`(Array<Array<number>>)`Four
geographical coordinates,
represented as arrays of longitude and latitude numbers, which define the corners of the image.
The coordinates start at the top left corner of the image and proceed in clockwise order.
They do not have to represent a rectangle.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#setcoordinates-image-returns)

`ImageSource`:
this


updateImage(options)

Updates the image URL and, optionally, the coordinates. To avoid having the image flash after changing,
set the `raster-fade-duration` paint property on the raster layer to 0.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#updateimage-parameters)

options`(Object)`Options
object.


| options.url<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | Required image URL. |
| options.coordinates<br>[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) >>? | Four geographical coordinates,<br> represented as arrays of longitude and latitude numbers, which define the corners of the image.<br> The coordinates start at the top left corner of the image and proceed in clockwise order.<br> They do not have to represent a rectangle. |

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#updateimage-returns)

`ImageSource`:
this


## [Video](https://docs.maptiler.com/sdk-js/api/sources/\#videosource)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/video\_source.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/video_source.ts#L47-L199)

A data source containing video.
(See the [Style Specification](https://docs.maptiler.com/gl-style-specification/#sources-video)
for detailed documentation of options.)

Extends [ImageSource](https://docs.maptiler.com/sdk-js/api/sources/#imagesource).


### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#videosource-example)

```js
// add to map
map.addSource('some id', {
   type: 'video',
   url: [\
       'https://www.mapbox.com/blog/assets/baltimore-smoke.mp4',\
       'https://www.mapbox.com/blog/assets/baltimore-smoke.webm'\
   ],
   coordinates: [\
       [-76.54, 39.18],\
       [-76.52, 39.18],\
       [-76.52, 39.17],\
       [-76.54, 39.17]\
   ]
});

// update
const mySource = map.getSource('some id');
mySource.setCoordinates([\
    [-76.54335737228394, 39.18579907229748],\
    [-76.52803659439087, 39.1838364847587],\
    [-76.5295386314392, 39.17683392507606],\
    [-76.54520273208618, 39.17876344106642]\
]);

map.removeSource('some id');  // remove
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/sources/\#videosource-instance-members)

getVideo()

Returns the HTML `video` element.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#getvideo-returns)

`HTMLVideoElement`:
The HTML
`video`
element.


listens(type)

Returns a true if this instance of Evented or any forwarded instances of Evented has a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/sources/#listens-videosource-parameters)

type`(string)`The event type.

[Returns](https://docs.maptiler.com/sdk-js/api/sources/#listens-videosource-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#off-videosource-parameters)

type`(string)`The
event type to remove listeners for.


listener`(Function)`The
listener function to remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#off-videosource-returns)

`

          VideoSource

`: `this`

on(type, listener)

Adds a listener to a specified event type.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#on-videosource-parameters)

type`(string)`The
event type to add a listen for.


listener`(Function)`The
function to be called when the event is fired.
The listener function is called with the data object passed to
`fire`
,
extended with
`target`
and
`type`
properties.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#on-videosource-returns)

`

          VideoSource

`: `this`

once(type, listener)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#once-videosource-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The
function to be called when the event is fired the first time.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#once-videosource-returns)

`

          VideoSource

`: `this`

setEventedParent(parent?, data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-videosource-parameters)

parent`(Evented)`

data`(any)`

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-videosource-returns)

`

          VideoSource

`: `this`

pause()

Pauses the video.

play()

Plays the video.

prepare()

Sets the video's coordinates and re-renders the map.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#prepare-returns)

`

          VideoSource

`: `this`

seek(seconds)

Sets playback to a timestamp, in seconds.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seek-parameters)

seconds`(number)`

setCoordinates(coordinates)

Sets the video's coordinates and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#setcoordinates-video-parameters)

coordinates`(Array<Array<number>>)`Four
geographical coordinates,
represented as arrays of longitude and latitude numbers, which define the corners of the image.
The coordinates start at the top left corner of the image and proceed in clockwise order.
They do not have to represent a rectangle.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#setcoordinates-video-returns)

`VideoSource`:
this


updateImage(options)

Updates the image URL and, optionally, the coordinates. To avoid having the image flash after changing,
set the `raster-fade-duration` paint property on the raster layer
to 0.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#updateimage-video-parameters)

options`(Object)`Options
object.


| options.url<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | Required image URL. |
| options.coordinates<br>[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) >>? | Four geographical coordinates,<br> represented as arrays of longitude and latitude numbers, which define the corners of the<br> image.<br> The coordinates start at the top left corner of the image and proceed in clockwise order.<br> They do not have to represent a rectangle. |

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#updateimage-video-returns)

`VideoSource`:
this


### [Related\  examples](https://docs.maptiler.com/sdk-js/api/sources/\#videosource-related)

- [Add a video](https://docs.maptiler.com/sdk-js/examples/video-on-a-map/)

## [Canvas](https://docs.maptiler.com/sdk-js/api/sources/\#canvassource)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/canvas\_source.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/canvas_source.ts#L58-L235)

A data source containing the contents of an HTML canvas. See [canvas source properties](https://docs.maptiler.com/sdk-js/api/sources/#canvassource-properties) for detailed
documentation of options.

Extends [ImageSource](https://docs.maptiler.com/sdk-js/api/sources/#imagesource).


### [Example](https://docs.maptiler.com/sdk-js/api/sources/\#canvassource-example)

```js
// add to map
map.addSource('some id', {
   type: 'canvas',
   canvas: 'idOfMyHTMLCanvas',
   animate: true,
   coordinates: [\
       [-76.54, 39.18],\
       [-76.52, 39.18],\
       [-76.52, 39.17],\
       [-76.54, 39.17]\
   ]
});

// update
const mySource = map.getSource('some id');
mySource.setCoordinates([\
    [-76.54335737228394, 39.18579907229748],\
    [-76.52803659439087, 39.1838364847587],\
    [-76.5295386314392, 39.17683392507606],\
    [-76.54520273208618, 39.17876344106642]\
]);

map.removeSource('some id');  // remove
```

JavaScript

Copy

### [Properties](https://docs.maptiler.com/sdk-js/api/sources/\#canvassource-properties)

| options.type<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | Source type. Must be `"canvas"`. |
| options.canvas<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [HTMLCanvasElement](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement)) | Canvas source from which to read pixels. Can be a string representing the ID of the canvas element, or the<br> `HTMLCanvasElement`<br> itself. |
| options.coordinates<br>[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) >> | Four geographical coordinates denoting where to place the corners of the canvas, specified in<br> `[longitude, latitude]`<br> pairs. |
| options.animate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)? | Whether the canvas source is animated. If the canvas is static (i.e. pixels do not need to be re-read on<br> every frame),<br> `animate`<br> should be set to<br> `false`<br> to improve performance. |

### [Methods](https://docs.maptiler.com/sdk-js/api/sources/\#canvassource-instance-members)

getCanvas()

Returns the HTML `canvas` element.

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#getcanvas-returns)

`HTMLCanvasElement`:
The HTML
`canvas`
element.


listens(type)

Returns a true if this instance of Evented or any forwarded instances of Evented has a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/sources/#listens-canvassource-parameters)

type`(string)`The event type.

[Returns](https://docs.maptiler.com/sdk-js/api/sources/#listens-canvassource-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#off-canvassource-parameters)

type`(string)`The
event type to remove listeners for.


listener`(Function)`The
listener function to remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#off-canvassource-returns)

`

          CanvasSource

`: `this`

on(type, listener)

Adds a listener to a specified event type.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#on-canvassource-parameters)

type`(string)`The
event type to add a listen for.


listener`(Function)`The
function to be called when the event is fired.
The listener function is called with the data object passed to
`fire`
,
extended with
`target`
and
`type`
properties.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#on-canvassource-returns)

`

          CanvasSource

`: `this`

once(type, listener)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#once-canvassource-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The
function to be called when the event is fired the first time.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#once-canvassource-returns)

`

          CanvasSource

`: `this`

setEventedParent(parent?, data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-canvassource-parameters)

parent`(Evented)`

data`(any)`

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#seteventedparent-canvassource-returns)

`

          CanvasSource

`: `this`

pause()

Disables animation. The map will display a static copy of the canvas image.

play()

Enables animation. The image will be copied from the canvas to the map on each frame.

setCoordinates(coordinates)

Sets the video's coordinates and re-renders the map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#setcoordinates-parameters)

coordinates`(Array<Array<number>>)`Four
geographical coordinates,
represented as arrays of longitude and latitude numbers, which define the corners of the image.
The coordinates start at the top left corner of the image and proceed in clockwise order.
They do not have to represent a rectangle.


##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#setcoordinates-returns)

`CanvasSource`:
this


updateImage(options)

Updates the image URL and, optionally, the coordinates. To avoid having the image flash after changing,
set the `raster-fade-duration` paint property on the raster layer to 0.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/sources/\#updateimage-image-parameters)

options`(Object)`Options
object.


| options.url<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | Required image URL. |
| options.coordinates<br>[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) >>? | Four geographical coordinates,<br> represented as arrays of longitude and latitude numbers, which define the corners of the image.<br> The coordinates start at the top left corner of the image and proceed in clockwise order.<br> They do not have to represent a rectangle. |

##### [Returns](https://docs.maptiler.com/sdk-js/api/sources/\#updateimage-image-returns)

`CanvasSource`:
this



Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Vector Tile](https://docs.maptiler.com/sdk-js/api/sources/#vector)
  - [Example](https://docs.maptiler.com/sdk-js/api/sources/#vector-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/sources/#vector-instance-members)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/sources/#vector-related)
- [Raster Tile](https://docs.maptiler.com/sdk-js/api/sources/#raster)
  - [Example](https://docs.maptiler.com/sdk-js/api/sources/#raster-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/sources/#raster-instance-members)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/sources/#raster-related)
- [GeoJSON](https://docs.maptiler.com/sdk-js/api/sources/#geojsonsource)
  - [Example](https://docs.maptiler.com/sdk-js/api/sources/#geojsonsource-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/sources/#geojsonsource-instance-members)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/sources/#geojsonsource-related)
- [Raster DEM Tile](https://docs.maptiler.com/sdk-js/api/sources/#raster-dem)
  - [Example](https://docs.maptiler.com/sdk-js/api/sources/#raster-dem-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/sources/#raster-dem-instance-members)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/sources/#raster-dem-related)
- [Image](https://docs.maptiler.com/sdk-js/api/sources/#imagesource)
  - [Example](https://docs.maptiler.com/sdk-js/api/sources/#imagesource-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/sources/#imagesource-instance-members)
- [Video](https://docs.maptiler.com/sdk-js/api/sources/#videosource)
  - [Example](https://docs.maptiler.com/sdk-js/api/sources/#videosource-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/sources/#videosource-instance-members)
  - [Related\\
     examples](https://docs.maptiler.com/sdk-js/api/sources/#videosource-related)
- [Canvas](https://docs.maptiler.com/sdk-js/api/sources/#canvassource)
  - [Example](https://docs.maptiler.com/sdk-js/api/sources/#canvassource-example)
  - [Properties](https://docs.maptiler.com/sdk-js/api/sources/#canvassource-properties)
  - [Methods](https://docs.maptiler.com/sdk-js/api/sources/#canvassource-instance-members)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Sources

Sources

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)