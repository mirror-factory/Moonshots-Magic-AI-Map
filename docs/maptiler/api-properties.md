# Properties and options

SDK JS's global properties and options that you can access while initializing your map or accessing
information about its status.

## [addProtocol](https://docs.maptiler.com/sdk-js/api/properties/\#addprotocol)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/protocol\_crud.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/protocol_crud.ts)

Adds a custom load resource function that will be called when using a URL that starts with a custom url schema.
This will happen in the main thread, and workers might call it if they don't know how to handle the protocol.
The example below will be triggered for custom:// urls defined in the sources list in the style definitions.
The function passed will receive the request parameters and should return with the resulting resource,
for example a pbf vector tile, non-compressed, represented as ArrayBuffer.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#addprotocol-example)

```js
// This will fetch a file using the fetch API (this is obviously a non interesting example...)
addProtocol('custom', async (params, abortController) => {
  const t = await fetch(`https://${params.url.split("://")[1]}`);
  if (t.status == 200) {
    const buffer = await t.arrayBuffer();
    return {data: buffer}
  } else {
    throw new Error(`Tile fetch error: ${t.statusText}`);
  }
});
// the following is an example of a way to return an error when trying to load a tile
addProtocol('custom2', async (params, abortController) => {
  throw new Error('someErrorMessage'));
});
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#addprotocol-parameters)

customProtocol`(string)`the
protocol to hook, for example 'custom'


loadFn`(AddProtocolAction)`the
function to use when trying to fetch a tile specified by the customProtocol


## [addSourceType](https://docs.maptiler.com/sdk-js/api/properties/\#addsurcetype)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/source.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/source.ts)

Adds a custom source type, making it available for use with Map.addSource.

### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#addsurcetype-parameters)

name`(string)`The name of the source type; source definition objects use this name in the `{type: ...}` field.


SourceType`(SourceClass)`

## [clearPrewarmedResources](https://docs.maptiler.com/sdk-js/api/properties/\#clearprewarmedresources)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/util/global\_worker\_pool.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/util/global_worker_pool.ts)

Clears up resources that have previously been created by `maptilersdk.prewarm()`.
Note that this is typically not necessary. You should only call this function
if you expect the user of your app to not return to a Map view at any point
in your application.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#clearprewarmedresources-example)

```js
maptilersdk.clearPrewarmedResources()
```

JavaScript

Copy

## [getMaxParallelImageRequests](https://docs.maptiler.com/sdk-js/api/properties/\#getmaxparallelimagerequests)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts)

Gets the maximum number of images (raster tiles, sprites, icons) to load in parallel,
which affects performance in raster-heavy maps. 16 by default.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#getmaxparallelimagerequests-example)

```js
maptilersdk.getMaxParallelImageRequests();
```

JavaScript

Copy

### [Returns](https://docs.maptiler.com/sdk-js/api/properties/\#getmaxparallelimagerequests-returns)

`number`:
Number of parallel requests currently configured.


## [getRTLTextPluginStatus](https://docs.maptiler.com/sdk-js/api/properties/\#getrtltextpluginstatus)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts#L263-L263)

Gets the map's [RTL text plugin](https://maplibre.org/maplibre-gl-js/docs/plugins/#mapbox-gl-rtl-text)
status.
The status can be `unavailable` (i.e. not requested or removed), `loading`,
`loaded` or `error`.
If the status is `loaded` and the plugin is requested again, an error will be thrown.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#getrtltextpluginstatus-example)

```js
const pluginStatus = maptilersdk.getRTLTextPluginStatus();
```

JavaScript

Copy

## [getVersion](https://docs.maptiler.com/sdk-js/api/properties/\#getversion)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts)

Returns the package version of the library.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#getversion-example)

```js
const version = maptilersdk.getVersion();
```

JavaScript

Copy

## [getWorkerCount](https://docs.maptiler.com/sdk-js/api/properties/\#getworkercount)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts)

Gets the number of web workers instantiated on a page with GL JS maps.
By default, workerCount is 1 except for Safari browser where it is set to half the number of CPU cores (capped at 3).
Make sure to set this property before creating any map instances for it to have effect.


### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#getworkercount-example)

```js
const workerCount = maptilersdk.getWorkerCount();
```

JavaScript

Copy

### [Returns](https://docs.maptiler.com/sdk-js/api/properties/\#getworkercount-returns)

`number`:
Number of workers currently configured.


## [getWorkerUrl](https://docs.maptiler.com/sdk-js/api/properties/\#getworkerurl)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts)

Gets the worker url


### [Returns](https://docs.maptiler.com/sdk-js/api/properties/\#getworkerurl-returns)

`string`:
The worker url.


## [getWebGLSupportError](https://docs.maptiler.com/sdk-js/api/properties/\#getWebGLSupportError)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/index.ts)

Detect WebGL compatibility


### [Returns](https://docs.maptiler.com/sdk-js/api/properties/\#getWebGLSupportError-returns)

`string` \|
`null`:
Return `null` if there is no error (WebGL is supported), or returns a string with the error message if WebGL2 is not supported.


## [importScriptInWorkers](https://docs.maptiler.com/sdk-js/api/properties/\#importscriptinworkers)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts)

Allows loading javascript code in the worker thread.
Note that since this is using some very internal classes and flows it is considered experimental and can break at any point.


It can be useful for the following examples:


1. Using `self.addProtocol` in the worker thread -
    note that you might need to also register the protocol on the main thread.
2. Using `self.registerWorkerSource(workerSource: WorkerSource)` to register a worker source,
    which sould come with `addSourceType` usually
3. Using `self.actor.registerMessageHandler` to override some internal worker operations

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#importscriptinworkers-example)

```js
// below is an example of sending a js file to the worker to load the method there
// Note that you'll need to call the global function `addProtocol` in the worker to register the protocol there.
// add-protocol-worker.js
async function loadFn(params, abortController) {
  const t = await fetch(`https://${params.url.split("://")[1]}`);
  if (t.status == 200) {
    const buffer = await t.arrayBuffer();
    return {data: buffer}
  } else {
    throw new Error(`Tile fetch error: ${t.statusText}`);
  }
}
self.addPRotocol('custom', loadFn);

// main.js
importScriptInWorkers('add-protocol-worker.js');
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#importscriptinworkers-parameters)

workerUrl`(string)`The worker url e.g. a url of a javascript file to load in the worker


### [Returns](https://docs.maptiler.com/sdk-js/api/properties/\#importscriptinworkers-returns)

`Promise<void[]>`

## [prewarm](https://docs.maptiler.com/sdk-js/api/properties/\#prewarm)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/util/global\_worker\_pool.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/util/global_worker_pool.ts)

Initializes resources like WebWorkers that can be shared across maps to lower load
times in some situations. `maptilersdk.workerUrl` and `maptilersdk.workerCount`, if being
used, must be set before `prewarm()` is called to have an effect.

By default, the lifecycle of these resources is managed automatically, and they are
lazily initialized when a Map is first created. By invoking `prewarm()`, these
resources will be created ahead of time, and will not be cleared when the last Map
is removed from the page. This allows them to be re-used by new Map instances that
are created later. They can be manually cleared by calling
`maptilersdk.clearPrewarmedResources()`. This is only necessary if your web page remains
active but stops using maps altogether.


This is primarily useful when using GL-JS maps in a single page app, wherein a user
would navigate between various views that can cause Map instances to constantly be
created and destroyed.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#prewarm-example)

```js
maptilersdk.prewarm()
```

JavaScript

Copy

## [removeProtocol](https://docs.maptiler.com/sdk-js/api/properties/\#removeprotocol)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/source/protocol\_crud.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/source/protocol_crud.ts)

Removes a previously added protocol

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#removeprotocol-example)

```js
maptilersdk.removeProtocol('custom');
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#removeprotocol-parameters)

customProtocol`(string)`the
custom protocol to remove registration for


## [setMaxParallelImageRequests](https://docs.maptiler.com/sdk-js/api/properties/\#getmaxparallelimagerequests)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts)

Sets the maximum number of images (raster tiles, sprites, icons) to load in parallel, which affects performance in raster-heavy maps. 16 by default.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#setmaxparallelimagerequests-example)

```js
maptilersdk.setMaxParallelImageRequests(10);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#setmaxparallelimagerequests-parameters)

numRequests`(number)`The maximum number of images to load in parallel.


## [setRTLTextPlugin](https://docs.maptiler.com/sdk-js/api/properties/\#setrtltextplugin)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts#L263-L263)

Sets the map's [RTL text plugin](https://maplibre.org/maplibre-gl-js/docs/plugins/#mapbox-gl-rtl-text).
Necessary for supporting the Arabic and Hebrew languages, which are written right-to-left.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#setrtltextplugin-example)

```js
maptilersdk.setRTLTextPlugin('https://cdn.maptiler.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#setrtltextplugin-parameters)

pluginURL`(string)`URL
pointing to the MapLibre RTL text plugin source.


callback`(Function)`Called
with an error argument if there is an error.


lazy`(boolean)`If
set to
`true`
, maplibregl will defer loading the plugin until rtl text is encountered,
rtl text will then be rendered only after the plugin finishes loading.


## [setWorkerCount](https://docs.maptiler.com/sdk-js/api/properties/\#setworkercount)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts)

Sets the number of web workers instantiated on a page with GL JS maps.
By default, workerCount is 1 except for Safari browser where it is set to half the number of CPU cores (capped at 3).
Make sure to set this property before creating any map instances for it to have effect.


### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#setworkercount-example)

```js
maptilersdk.setWorkerCount(2);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#setworkercount-parameters)

count`(number)`The number of workers.


## [setWorkerUrl](https://docs.maptiler.com/sdk-js/api/properties/\#setworkerurl)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts)

Sets the worker url


### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#setworkerurl-parameters)

value`(string)`The worker url.


## [clearStorage](https://docs.maptiler.com/sdk-js/api/properties/\#clearstorage)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/index.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/index.ts#L163-L165)

Clears browser storage used by this library. Using this method flushes the SDK JS tile
cache that is managed by this library. Tiles may still be cached by the browser
in some cases.

This API is supported on browsers where the [`Cache` API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
is supported and enabled. This includes all major browsers when pages are served over
`https://`, except Internet Explorer and Edge Mobile.


When called in unsupported browsers or environments (private or incognito mode), the
callback will be called with an error argument.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#clearstorage-example)

```js
maptilersdk.clearStorage();
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#clearstorage-parameters)

callback`(Function)`Called
with an error argument if there is an error.


## [AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/\#animationoptions)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/camera.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/camera.ts#L103-L116)

Options common to map movement methods that involve animation, such as [Map#panBy](https://docs.maptiler.com/sdk-js/api/map/#map#panby) and
[Map#easeTo](https://docs.maptiler.com/sdk-js/api/map/#map#easeto), controlling the duration and easing function
of the animation. All properties
are optional.


### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#animationoptions-properties)

duration`(number)`:
The animation's duration, measured in milliseconds.


easing`(Function)`:
A function taking a time in the range 0..1 and returning a number where 0 is
the initial state and 1 is the final state. Default is a `bezier-curve` function with
control points (0.25, 0.1) and (0.25, 1). Example:


```js
(x) => (x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2)
```

JavaScript

Copy

offset`(PointLike)`:
of the target center relative to real map container center at the end of animation.


animate`(boolean)`:
If
`false`
, no animation will occur.


essential`(boolean)`:
If
`true`
, then the animation is considered essential and will not be affected by

[`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
.


## [CameraOptions](https://docs.maptiler.com/sdk-js/api/properties/\#cameraoptions)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/camera.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/camera.ts#L29-L59)

Options common to [Map#jumpTo](https://docs.maptiler.com/sdk-js/api/map/#map#jumpto), [Map#easeTo](https://docs.maptiler.com/sdk-js/api/map/#map#easeto), and [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto), controlling the desired location,
zoom, bearing, and pitch of the camera. All properties are optional, and when a property is omitted, the current
camera value for that property will remain unchanged.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#cameraoptions-example)

```js
// set the map's initial perspective with CameraOptions
const map = new maptilersdk.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=<YOUR_MAPTILER_API_KEY>',
  center: [-73.5804, 45.53483],
  pitch: 60,
  bearing: -60,
  zoom: 10
});
```

JavaScript

Copy

### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#cameraoptions-properties)

center`(LngLatLike)`:
The desired center.


zoom`(number)`:
The desired zoom level.


bearing`(number)`:
The desired bearing in degrees. The bearing is the compass direction that
is "up". For example,
`bearing: 90`
orients the map so that east is up.


pitch`(number)`:
The desired pitch in degrees. The pitch is the angle towards the horizon
measured in degrees with a range between 0 and 60 degrees. For example, pitch: 0 provides the appearance
of looking straight down at the map, while pitch: 60 tilts the user's perspective towards the horizon.
Increasing the pitch value is often used to display 3D objects.


around`(LngLatLike)`:
If
`zoom`
is specified,
`around`
determines the point around which the zoom is centered.


padding`(PaddingOptions)`:
Dimensions in pixels applied on each side of the viewport for shifting the vanishing point.


### [Related examples](https://docs.maptiler.com/sdk-js/api/properties/\#cameraoptions-related)

- [Set pitch and bearing](https://docs.maptiler.com/sdk-js/examples/set-perspective/)
- [Jump to a series of locations](https://docs.maptiler.com/sdk-js/examples/jump-to/)
- [Fly to a location](https://docs.maptiler.com/sdk-js/examples/flyto/)
- [Display buildings in 3D](https://docs.maptiler.com/sdk-js/examples/3d-buildings/)

## [PaddingOptions](https://docs.maptiler.com/sdk-js/api/properties/\#paddingoptions)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/geo/edge\_insets.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/geo/edge_insets.ts#L99-L116)

Options for setting padding on calls to methods such as [Map#fitBounds](https://docs.maptiler.com/sdk-js/api/map/#map#fitbounds), [Map#fitScreenCoordinates](https://docs.maptiler.com/sdk-js/api/map/#map#fitscreencoordinates), and [Map#setPadding](https://docs.maptiler.com/sdk-js/api/map/#map#setpadding). Adjust these options to set the amount
of padding in pixels added to the edges of the canvas. Set a uniform padding on all edges or individual values
for each edge. All properties of this object must be
non-negative integers.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#paddingoptions-example)

```js
const bbox = [[-79, 43], [-73, 45]];
map.fitBounds(bbox, {
  padding: {top: 10, bottom:25, left: 15, right: 5}
});
```

JavaScript

Copy

```js
const bbox = [[-79, 43], [-73, 45]];
map.fitBounds(bbox, {
  padding: 20
});
```

JavaScript

Copy

### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#paddingoptions-properties)

top`(number)`

bottom`(number)`

right`(number)`

left`(number)`

### [Static Members](https://docs.maptiler.com/sdk-js/api/properties/\#paddingoptions-static-members)

bottom

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#bottom-properties)

bottom`(number)`:
Padding in pixels from the bottom of the map canvas.


left

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#left-properties)

right`(number)`:
Padding in pixels from the right of the map canvas.


right

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#right-properties)

left`(number)`:
Padding in pixels from the left of the map canvas.


top

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#top-properties)

top`(number)`:
Padding in pixels from the top of the map canvas.


### [Related examples](https://docs.maptiler.com/sdk-js/api/properties/\#paddingoptions-related)

- [Fit to the bounds of a\\
LineString](https://docs.maptiler.com/sdk-js/examples/zoomto-linestring/)
- [Fit a map to a bounding box](https://docs.maptiler.com/sdk-js/examples/fitbounds/)

## [RequestParameters](https://docs.maptiler.com/sdk-js/api/properties/\#requestparameters)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/util/ajax.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/util/ajax.ts#L42-L64)

A `RequestParameters` object to be returned from Map.options.transformRequest callbacks.

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#requestparameters-example)

```js
// use transformRequest to modify requests that begin with `http://myHost`
transformRequest: function(url, resourceType) {
  if (resourceType === 'Source' &amp;&amp; url.indexOf('http://myHost') &gt; -1) {
    return {
      url: url.replace('http', 'https'),
      headers: { 'my-custom-header': true },
      credentials: 'include'  // Include cookies for cross-origin requests
    }
  }
}
```

JavaScript

Copy

### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#requestparameters-properties)

url`(string)`:
The URL to be requested.


headers`(Object)`:
The headers to be sent with the request.


method`(string)`:
Request method
`'GET' | 'POST' | 'PUT'`
.


body`(string)`:
Request body.


type`(string)`:
Response body type to be returned
`'string' | 'json' | 'arrayBuffer'`
.


credentials`(string)`:
`'same-origin'|'include'`
Use 'include' to send cookies with cross-origin requests.


collectResourceTiming`(boolean)`:
If true, Resource Timing API information will be collected for these transformed requests and returned in
a resourceTiming property of relevant data events.


## [StyleImageInterface](https://docs.maptiler.com/sdk-js/api/properties/\#styleimageinterface)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/style/style\_image.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/style/style_image.ts#L75-L125)

Interface for dynamically generated style images. This is a specification for
implementers to model: it is not an exported method or class.

Images implementing this interface can be redrawn for every frame. They can be used to animate
icons and patterns or make them respond to user input. Style images can implement a
[StyleImageInterface#render](https://docs.maptiler.com/sdk-js/api/properties/#styleimageinterface#render) method.
The method is called every frame and
can be used to update the image.


### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#styleimageinterface-example)

```js
const flashingSquare = {
  width: 64,
  height: 64,
  data: new Uint8Array(64 * 64 * 4),

  onAdd: function(map) {
      this.map = map;
  },

  render: function() {
    // keep repainting while the icon is on the map
    this.map.triggerRepaint();

    // alternate between black and white based on the time
    const value = Math.round(Date.now() / 1000) % 2 === 0  ? 255 : 0;

    // check if image needs to be changed
    if (value !== this.previousValue) {
      this.previousValue = value;

      const bytesPerPixel = 4;
      for (let x = 0; x &lt; this.width; x++) {
        for (let y = 0; y &lt; this.height; y++) {
          const offset = (y * this.width + x) * bytesPerPixel;
          this.data[offset + 0] = value;
          this.data[offset + 1] = value;
          this.data[offset + 2] = value;
          this.data[offset + 3] = 255;
        }
      }

      // return true to indicate that the image changed
      return true;
    }
  }
}

map.addImage('flashing_square', flashingSquare);
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/properties/\#styleimageinterface-instance-members)

data

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#data-properties)

data`((Uint8Array | Uint8ClampedArray))`

height

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#height-properties)

height`(number)`

onAdd(map)

Optional method called when the layer has been added to the Map with [Map#addImage](https://docs.maptiler.com/sdk-js/api/map/#map#addimage).

##### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#onadd-styleimageinterface-parameters)

map`(Map)`The
Map this custom layer was just added to.


onRemove()

Optional method called when the icon is removed from the map with [Map#removeImage](https://docs.maptiler.com/sdk-js/api/map/#map#removeimage).
This gives the image a chance to clean up resources and event listeners.

render()

This method is called once before every frame where the icon will be used.
The method can optionally update the image's `data` member with a new image.

If the method updates the image it must return `true` to commit the change.
If the method returns `false` or nothing the image is assumed to not have changed.

If updates are infrequent it maybe easier to use [Map#updateImage](https://docs.maptiler.com/sdk-js/api/map/#map#updateimage) to update
the image instead of implementing this method.

##### [Returns](https://docs.maptiler.com/sdk-js/api/properties/\#render-styleimageinterface-returns)

`boolean`:
`true`
if this method updated the image.
`false`
if the image was not changed.


width

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#width-properties)

width`(number)`

### [Related examples](https://docs.maptiler.com/sdk-js/api/properties/\#styleimageinterface-related)

- [Add an animated icon to\\
the map.](https://docs.maptiler.com/sdk-js/examples/add-image-animated/)

## [CustomLayerInterface](https://docs.maptiler.com/sdk-js/api/properties/\#customlayerinterface)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/style/style\_layer/custom\_style\_layer.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/style/style_layer/custom_style_layer.ts#L73-L157)

Interface for custom style layers. This is a specification for
implementers to model: it is not an exported method or class.

Custom layers allow a user to render directly into the map's GL context using the map's camera.
These layers can be added between any regular layers using [Map#addLayer](https://docs.maptiler.com/sdk-js/api/map/#map#addlayer).

Custom layers must have a unique `id` and must have the `type` of `"custom"`.
They must implement `render` and may implement `prerender`, `onAdd` and
`onRemove`.
They can trigger rendering using [Map#triggerRepaint](https://docs.maptiler.com/sdk-js/api/map/#map#triggerrepaint)
and they should appropriately handle [Map.event:webglcontextlost](https://docs.maptiler.com/sdk-js/api/map/#map.event:webglcontextlost) and
[Map.event:webglcontextrestored](https://docs.maptiler.com/sdk-js/api/map/#map.event:webglcontextrestored).


The `renderingMode` property controls whether the layer is treated as a `"2d"` or
`"3d"` map layer. Use:

- `"renderingMode": "3d"` to use the depth buffer and share it with other layers
- `"renderingMode": "2d"` to add a layer with no depth. If you need to use the depth buffer for a
`"2d"` layer you must use an offscreen
framebuffer and [CustomLayerInterface#prerender](https://docs.maptiler.com/sdk-js/api/properties/#customlayerinterface#prerender)

### [Example](https://docs.maptiler.com/sdk-js/api/properties/\#customlayerinterface-example)

```js
// Custom layer implemented as ES6 class
class NullIslandLayer {
  constructor() {
    this.id = 'null-island';
    this.type = 'custom';
    this.renderingMode = '2d';
  }

  onAdd(map, gl) {
    const vertexSource = `
    uniform mat4 u_matrix;
    void main() {
        gl_Position = u_matrix * vec4(0.5, 0.5, 0.0, 1.0);
        gl_PointSize = 20.0;
    }`;

    const fragmentSource = `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
  }

  render(gl, matrix) {
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_matrix"), false, matrix);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

map.on('load', function() {
  map.addLayer(new NullIslandLayer());
});
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/properties/\#customlayerinterface-instance-members)

id

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#id-properties)

id`(string)`:
A unique layer id.


onAdd(map, gl)

Optional method called when the layer has been added to the Map with [Map#addLayer](https://docs.maptiler.com/sdk-js/api/map/#map#addlayer). This
gives the layer a chance to initialize gl resources and register event listeners.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#onadd-customlayerinterface-parameters)

map`(Map)`The
Map this custom layer was just added to.


gl`(WebGLRenderingContext)`The
gl context for the map.


onRemove(map, gl)

Optional method called when the layer has been removed from the Map with [Map#removeLayer](https://docs.maptiler.com/sdk-js/api/map/#map#removelayer). This
gives the layer a chance to clean up gl resources and event listeners.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#onremove-customlayerinterface-parameters)

map`(Map)`The
Map this custom layer was just added to.


gl`(WebGLRenderingContext)`The
gl context for the map.


prerender(gl, matrix)

Optional method called during a render frame to allow a layer to prepare resources or render into a
texture.

The layer cannot make any assumptions about the current GL state and must bind a framebuffer before
rendering.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#prerender-parameters)

gl`(WebGLRenderingContext)`The
map's gl context.


matrix`(mat4)`The map's
camera matrix. It projects spherical mercator
coordinates to gl coordinates. The mercator coordinate
`[0, 0]`
represents the
top left corner of the mercator world and
`[1, 1]`
represents the bottom right corner. When
the
`renderingMode`
is
`"3d"`
, the z coordinate is conformal. A box with identical x, y, and z
lengths in mercator units would be rendered as a cube.
[MercatorCoordinate](https://docs.maptiler.com/sdk-js/api/geography/#mercatorcoordinate)
.fromLngLat
can be used to project a
`LngLat`
to a mercator coordinate.


render(gl, matrix)

Called during a render frame allowing the layer to draw into the GL context.

The layer can assume blending and depth state is set to allow the layer to properly
blend and clip other layers. The layer cannot make any other assumptions about the
current GL state.

If the layer needs to render to a texture, it should implement the `prerender` method
to do this and only use the `render` method for drawing directly into the main framebuffer.

The blend function is set to `gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)`. This expects
colors to be provided in premultiplied alpha form where the `r`, `g` and
`b` values are already
multiplied by the `a` value. If you are unable to provide colors in premultiplied form you
may want to change the blend function to
`gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)`.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/properties/\#render-customlayerinterface-parameters)

gl`(WebGLRenderingContext)`The
map's gl context.


matrix`(Array<number>)`The
map's camera matrix. It projects spherical mercator
coordinates to gl coordinates. The spherical mercator coordinate
`[0, 0]`
represents the
top left corner of the mercator world and
`[1, 1]`
represents the bottom right corner. When
the
`renderingMode`
is
`"3d"`
, the z coordinate is conformal. A box with identical x, y, and z
lengths in mercator units would be rendered as a cube.
[MercatorCoordinate](https://docs.maptiler.com/sdk-js/api/geography/#mercatorcoordinate)
.fromLngLat
can be used to project a
`LngLat`
to a mercator coordinate.


renderingMode

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#renderingmode-properties)

renderingMode`(string)`:
Either
`"2d"`
or
`"3d"`
. Defaults to
`"2d"`
.


type

##### [Properties](https://docs.maptiler.com/sdk-js/api/properties/\#type-properties)

type`(string)`:
The layer's type. Must be
`"custom"`
.



Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [addProtocol](https://docs.maptiler.com/sdk-js/api/properties/#addprotocol)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#addprotocol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#addprotocol-parameters)
- [addSourceType](https://docs.maptiler.com/sdk-js/api/properties/#addsurcetype)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#addsurcetype-parameters)
- [clearPrewarmedResources](https://docs.maptiler.com/sdk-js/api/properties/#clearprewarmedresources)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#clearprewarmedresources-example)
- [getMaxParallelImageRequests](https://docs.maptiler.com/sdk-js/api/properties/#getmaxparallelimagerequests)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#getmaxparallelimagerequests-example)
  - [Returns](https://docs.maptiler.com/sdk-js/api/properties/#getmaxparallelimagerequests-returns)
- [getRTLTextPluginStatus](https://docs.maptiler.com/sdk-js/api/properties/#getrtltextpluginstatus)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#getrtltextpluginstatus-example)
- [getVersion](https://docs.maptiler.com/sdk-js/api/properties/#getversion)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#getversion-example)
- [getWorkerCount](https://docs.maptiler.com/sdk-js/api/properties/#getworkercount)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#getworkercount-example)
  - [Returns](https://docs.maptiler.com/sdk-js/api/properties/#getworkercount-returns)
- [getWorkerUrl](https://docs.maptiler.com/sdk-js/api/properties/#getworkerurl)
  - [Returns](https://docs.maptiler.com/sdk-js/api/properties/#getworkerurl-returns)
- [getWebGLSupportError](https://docs.maptiler.com/sdk-js/api/properties/#getWebGLSupportError)
  - [Returns](https://docs.maptiler.com/sdk-js/api/properties/#getWebGLSupportError-returns)
- [importScriptInWorkers](https://docs.maptiler.com/sdk-js/api/properties/#importscriptinworkers)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#importscriptinworkers-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#importscriptinworkers-parameters)
  - [Returns](https://docs.maptiler.com/sdk-js/api/properties/#importscriptinworkers-returns)
- [prewarm](https://docs.maptiler.com/sdk-js/api/properties/#prewarm)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#prewarm-example)
- [removeProtocol](https://docs.maptiler.com/sdk-js/api/properties/#removeprotocol)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#removeprotocol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#removeprotocol-parameters)
- [setMaxParallelImageRequests](https://docs.maptiler.com/sdk-js/api/properties/#setmaxparallelimagerequests)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#setmaxparallelimagerequests-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#setmaxparallelimagerequests-parameters)
- [setRTLTextPlugin](https://docs.maptiler.com/sdk-js/api/properties/#setrtltextplugin)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#setrtltextplugin-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#setrtltextplugin-parameters)
- [setWorkerCount](https://docs.maptiler.com/sdk-js/api/properties/#setworkercount)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#setworkercount-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#setworkercount-parameters)
- [setWorkerUrl](https://docs.maptiler.com/sdk-js/api/properties/#setworkerurl)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#setworkerurl-parameters)
- [clearStorage](https://docs.maptiler.com/sdk-js/api/properties/#clearstorage)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#clearstorage-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/properties/#clearstorage-parameters)
- [AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions)
  - [Properties](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions-properties)
- [CameraOptions](https://docs.maptiler.com/sdk-js/api/properties/#cameraoptions)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#cameraoptions-example)
  - [Properties](https://docs.maptiler.com/sdk-js/api/properties/#cameraoptions-properties)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/properties/#cameraoptions-related)
- [PaddingOptions](https://docs.maptiler.com/sdk-js/api/properties/#paddingoptions)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#paddingoptions-example)
  - [Properties](https://docs.maptiler.com/sdk-js/api/properties/#paddingoptions-properties)
  - [Static Members](https://docs.maptiler.com/sdk-js/api/properties/#paddingoptions-static-members)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/properties/#paddingoptions-related)
- [RequestParameters](https://docs.maptiler.com/sdk-js/api/properties/#requestparameters)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#requestparameters-example)
  - [Properties](https://docs.maptiler.com/sdk-js/api/properties/#requestparameters-properties)
- [StyleImageInterface](https://docs.maptiler.com/sdk-js/api/properties/#styleimageinterface)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#styleimageinterface-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/properties/#styleimageinterface-instance-members)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/properties/#styleimageinterface-related)
- [CustomLayerInterface](https://docs.maptiler.com/sdk-js/api/properties/#customlayerinterface)
  - [Example](https://docs.maptiler.com/sdk-js/api/properties/#customlayerinterface-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/properties/#customlayerinterface-instance-members)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Properties and options

Properties and options

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)