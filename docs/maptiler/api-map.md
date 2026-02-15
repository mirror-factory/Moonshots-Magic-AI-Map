# Map

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/Map.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/Map.ts)

The `Map` object represents the map on your page. It exposes methods
and properties that enable you to programmatically change the map,
and fires events as users interact with it.

You create a `Map` by specifying a `container` and other options.
Then SDK JS initializes the map on the page and returns your `Map`
object.

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

Example

```js
import * as maptilersdk from '@maptiler/sdk';

const map = new maptilersdk.Map({
  container: 'map',
  center: [-122.420679, 37.772537],
  zoom: 13,
  style: maptilersdk.MapStyle.STREETS,
  hash: true,
});
```

JavaScript

Copy

## [Parameters](https://docs.maptiler.com/sdk-js/api/map/\#map-parameters)

options (MapOptions)

Options to provide to the Map constructor
([MapOptions](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/Map.ts))



[Properties](https://docs.maptiler.com/sdk-js/api/map/#map-options)

| options.apiKey![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | Define the [MapTiler API key](https://cloud.maptiler.com/account/keys/) to be used. <br> This is equivalent to setting [`config.apiKey`](https://docs.maptiler.com/sdk-js/api/config/) and will overwrite it. |
| options.container<br>( [HTMLElement](https://developer.mozilla.org/docs/Web/HTML/Element) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | The HTML element in which SDK JS will render the map, or<br> the element's string<br> `id`<br> . The specified element must have no children. |
| options.style![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [ReferenceMapStyle](https://docs.maptiler.com/sdk-js/api/map-styles/#referencemapstyle) \| <br>[MapStyleVariant](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstylevariant) \|<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \|<br>[StyleSpecification](https://docs.maptiler.com/gl-style-specification/))? | The map's style. This must be:<br> <br>- ReferenceMapStyle (e.g. MapStyle.STREETS)<br>- MapStyleVariant (e.g. MapStyle.STREETS.DARK)<br>- MapTIler Style ID (e.g. “streets-v2”)<br>- uuid of custom style<br>- an a JSON object<br>   conforming to<br>   the schema described in the<br>   [GL Style Specification](https://docs.maptiler.com/gl-style-specification/)<br>- a URL to<br>   such JSON. |
| options.language![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| <br>[Language](https://docs.maptiler.com/sdk-js/api/languages/))? | Define the language of the map. This can be done directly with a language ISO code (eg. "en")<br> or with a built-in [Languages](https://docs.maptiler.com/sdk-js/api/languages/) shorthand (eg. Language.ENGLISH) <br> This applies only for the map instance, supersedes the [`config.primaryLanguage`](https://docs.maptiler.com/sdk-js/api/config/). |
| options.center<br>[LngLatLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike)?<br>default: \[0,0\] | The initial geographical centerpoint of the map. If<br> `center`<br> is not specified in the constructor options, SDKJS will look for it in the map's style<br> object. If it is not specified in the style, either, it will default to<br> `[0, 0]`<br> Note: SDK JS uses longitude, latitude coordinate order (as opposed to latitude, longitude) to<br> match GeoJSON. |
| options.zoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The initial zoom level of the map. If<br> `zoom`<br> is not specified in the constructor options, SDK JS will look for it in the map's style<br> object. If it is not specified in the style, either, it will default to<br> `0`<br> . |
| options.projection![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?<br>default: `'mercator'` | This will overwrite the projection property from the style (if any) and <br> will persist it later if the map style was to change.<br> <br> Valid options are<br> `mercator`<br> , <br> `globe`<br> . |
| options.bearing<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The initial bearing (rotation) of the map, measured in degrees<br> counter-clockwise from north. If<br> `bearing`<br> is not specified in the constructor options, SDK JS will look for it in the map's style<br> object. If it is not specified in the style, either, it will default to<br> `0`<br> . |
| options.pitch<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The initial pitch (tilt) of the map, measured in degrees away<br> from the plane of the screen (0-85). If<br> `pitch`<br> is not specified in the constructor options, SDK JS will look for it in the map's style<br> object. If it is not specified in the style, either, it will default to<br> `0`<br> . Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter<br> any, please raise an issue with details in the MapLibre project. |
| options.attributionControl<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , an<br> [AttributionControl](https://docs.maptiler.com/sdk-js/api/controls/#attributioncontrol)<br> will be added to the map. |
| options.bearingSnap<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `7` | The threshold, measured in degrees, that determines when the<br> map's<br> bearing will snap to north. For example, with a<br> `bearingSnap`<br> of 7, if the user rotates<br> the map within 7 degrees of north, the map will automatically snap to exact north. |
| options.bounds<br>[LngLatBoundsLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatboundslike)? | The initial bounds of the map. If<br> `bounds`<br> is specified, it overrides<br> `center`<br> and<br> `zoom`<br> constructor options. |
| options.boxZoom<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , the "box zoom" interaction is enabled (see<br> [BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler)<br> ). |
| options.cancelPendingTileRequestsWhileZooming<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | Determines whether to cancel, or retain, tiles from the current viewport which are still loading <br> but which belong to a farther (smaller) zoom level than the current one.<br> If `true`, when zooming in, tiles which didn't manage to load for previous zoom levels will become canceled. <br> This might save some computing resources for slower devices, but the map details might appear more abruptly at the end of the zoom.<br> If `false`, when zooming in, the previous zoom level(s) tiles will progressively appear, giving a smoother map details experience. <br> However, more tiles will be rendered in a short period of time. |
| options.canvasContextAttributes<br>[WebGLContextAttributesWithType](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)?<br>default: `antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: false, desynchronized: false, contextType: 'webgl2withfallback'` | Set of WebGLContextAttributes that are applied to the WebGL context of the map.<br> See [getContext](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext) for more details.<br> `contextType`, can be set to <br> `webgl2` or `webgl` to force a WebGL version.<br> Not setting it, MapTiler SDK will do it's best to get a suitable context. |
| options.centerClampedToGround<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If `true`, the elevation of the center point will <br> automatically be set to the terrain elevation (or zero if terrain is not enabled).<br> If `false`, the elevation of the center point will <br> default to sea level and will not automatically update.<br> <br> Needs to be set to false to keep the camera above ground when pitch > 90 degrees. |
| options.clickTolerance<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `3` | The max number of pixels a user can shift the mouse pointer<br> during a click for it to be considered a valid click (as opposed to a mouse drag). |
| options.collectResourceTiming<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `false` | If<br> `true`<br> , Resource Timing API information will be collected for requests made by GeoJSON and Vector Tile web<br> workers (this information is normally inaccessible from the main Javascript thread). Information will<br> be returned in a<br> `resourceTiming`<br> property of relevant<br> `data`<br> events. |
| options.cooperativeGestures<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>\| GestureOptions)?<br>default: `false` | If<br> `true`<br> or set to an options object, map is only accessible on desktop while holding Command/Ctrl and only<br> accessible on mobile with two fingers. Interacting with the map using normal gestures will trigger an<br> informational screen. With this option enabled, "drag to pitch" requires a three-finger gesture. <br> Cooperative gestures are disabled when a map enters fullscreen using [FullscreenControl](https://docs.maptiler.com/sdk-js/api/controls/#fullscreencontrol).<br> A valid options object includes the following properties to customize the text on the informational<br> screen. The values below are the defaults.<br> <br>```js<br>{<br>windowsHelpText: "Use Ctrl + scroll to zoom the map",<br>macHelpText: "Use ⌘ + scroll to zoom the map",<br>mobileHelpText: "Use two fingers to move the map",<br>}<br>```<br>JavaScript<br>Copy |
| options.crossSourceCollisions<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , symbols from multiple sources can collide with each other during collision detection. If<br> `false`<br> , collision detection is run separately for the symbols in each source. |
| options.customControls![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?<br>default: `false` | Detect custom external controls.<br>Alternatively, customControls can be set to a **CSS selector string**, restricting autodetection to:<br> <br>- Elements matching the selector directly<br>- Or elements whose **ancestor** matches the selector<br>```js<br>const map = new maptilersdk.Map({<br>  container: "map",<br>  customControls: true, // or ".custom-ui"<br>});<br>```<br>JavaScript<br>Copy |
| options.doubleClickZoom<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , the "double click to zoom" interaction is enabled (see<br> [DoubleClickZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#doubleclickzoomhandler)<br> ). |
| options.dragPan<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>\| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))?<br>default: `true` | If<br> `true`<br> , the "drag to pan" interaction is enabled. An<br> `Object`<br> value is passed as options to<br> [DragPanHandler#enable](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler#enable)<br> . |
| options.dragRotate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , the "drag to rotate" interaction is enabled (see<br> [DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler)<br> ). |
| options.elevation<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The elevation of the initial geographical centerpoint of the map, in meters above sea level.<br> If `elevation` is not specified in the constructor options, <br> it will default to `0`. |
| options.fadeDuration<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `300` | Controls the duration of the fade-in/fade-out animation for<br> label collisions, in milliseconds. This setting affects all symbol layers. This setting does not<br> affect the duration of runtime styling transitions or raster tile cross-fading. |
| options.fitBoundsOptions<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)? | A<br> [Map#fitBounds](https://docs.maptiler.com/sdk-js/api/map/#map#fitbounds)<br> options object to use<br> _only_<br> when fitting the initial<br> `bounds`<br> provided above. |
| options.fullscreenControl![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?<br>default: `false` | If<br> `true`<br> , an<br> [FullscreenControl](https://docs.maptiler.com/sdk-js/api/controls/#fullscreencontrol)<br> will be added to the map.<br> Valid options are<br> `top-left`<br> ,<br> `top-right`<br> ,<br> `bottom-left`<br> ,<br> `bottom-right`<br> . |
| options.geolocate![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>`GeolocationType.POINT` \| <br>`GeolocationType.COUNTRY` )?<br>default: `false` | Center map on the visitor's location by using the [IP geolocation API](https://docs.maptiler.com/cloud/api/geolocation/). There are two strategies:<br> <br>- `GeolocationType.POINT`: <br>   centering the map on the actual visitor location, optionnaly using the zoom option <br>   (zoom level 13 if none is provided). As a more precise option, if the user has previously granted access to the browser location (more precise) <br>   then this is going to be used.<br>   <br>- `GeolocationType.COUNTRY`:<br>   fitting the map view on the bounding box of the visitor's country. In this case, the zoom option, if provided, will be ignored<br>   <br> The `geolocate` options will not be taken into consideration in the following cases:<br> <br>- if the `center` options is provided, then it prevails<br>   <br>- if the `hash` options is provided with the value `true` **AND** a location hash is already part of the URL. If hash is true but there is not yet a location hash in the URL, then the geolocation will work. |
| options.geolocateControl![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?<br>default: `true` | If<br> `true`<br> , an<br> [MaptilerGeolocateControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilergeolocatecontrol)<br> will be added to the map.<br> Valid options are<br> `top-left`<br> ,<br> `top-right`<br> ,<br> `bottom-left`<br> ,<br> `bottom-right`<br> . |
| options.halo![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>\| [RadialGradientLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/#RadialGradientLayerConstructorOptions))?<br>default: `false` | Adds a gradient-based atmospheric glow around the globe, simulating the visual effect of Earth's atmosphere when viewed from space.<br> You can enable a simple halo by setting it to `true`.<br> For more customization, check [RadialGradientLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/#RadialGradientLayerConstructorOptions)<br>This option **only takes effect** when used in conjunction with the `projection: 'globe'` parameter. |
| options.hash<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>\| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?<br>default: `false` | If<br> `true`<br> , the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with<br> the hash fragment of the page's URL.<br> For example,<br> `http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60`<br> .<br> An additional string may optionally be provided to indicate a parameter-styled hash,<br> e.g.<br> [http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar](http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar)<br> , where foo<br> is a custom parameter and bar is an arbitrary hash distinct from the map hash. |
| options.interactive<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `false`<br> , no mouse, touch, or keyboard listeners will be attached to the map, so it will not respond to<br> interaction. |
| options.keyboard<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , keyboard shortcuts are enabled (see<br> [KeyboardHandler](https://docs.maptiler.com/sdk-js/api/handlers/#keyboardhandler)<br> ). |
| options.locale<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?<br>default: `null` | A patch to apply to the default localization table for UI<br> strings, e.g. control tooltips. The<br> `locale`<br> object maps namespaced UI string IDs to translated strings in the target language; see<br> `src/ui/default_locale.js`<br> for an example with all supported string IDs. The object may specify all UI strings (thereby adding<br> support for a new translation) or only a subset of strings (thereby patching the default translation<br> table). |
| options.localIdeographFontFamily<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?<br>default: `'sans-serif'` | Defines a CSS<br> font-family for locally overriding generation of glyphs in the 'CJK Unified Ideographs', 'Hiragana',<br> 'Katakana' and 'Hangul Syllables' ranges.<br> In these ranges, font settings from the map's style will be ignored, except for font-weight keywords<br> (light/regular/medium/bold).<br> Set to<br> `false`<br> , to enable font settings from the map's style for these glyph ranges.<br> The purpose of this option is to avoid bandwidth-intensive glyph server requests. (See<br> [Use locally generated\<br> ideographs](https://docs.maptiler.com/sdk-js/examples/local-ideographs)<br> .) |
| options.logoPosition<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?<br>default: `'bottom-left'` | A string representing the position of the MapTiler wordmark on<br> the map. Valid options are<br> `top-left`<br> ,<br> `top-right`<br> ,<br> `bottom-left`<br> ,<br> `bottom-right`<br> . |
| options.maptilerLogo![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , the MapTiler logo will be shown. `false` will only work on premium accounts |
| options.maxBounds<br>[LngLatBoundsLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatboundslike)? | If set, the map will be constrained to the given bounds. |
| options.maxCanvasSize<br>\[ [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number), [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)\]?<br>default: `[4096, 4096]` | The canvas' `width`<br> and `height` max size.<br> The values are passed as an array where the first element is max width and the second element is max height. <br> You shouldn't set this above WebGl `MAX_TEXTURE_SIZE` |
| options.maxPitch<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `60` | The maximum pitch of the map (0-180). |
| options.maxTileCacheSize<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `null` | The maximum number of tiles stored in the tile cache for a given<br> source. If omitted, the cache will be dynamically sized based on the current viewport. |
| options.maxTileCacheZoomLevels<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: `5` | The maximum number of zoom levels for which to store tiles for a given source.<br> Tile cache dynamic size is calculated by multiplying `maxTileCacheZoomLevels`<br> with the approximate number of tiles in the viewport for a given source. |
| options.maxZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `22` | The maximum zoom level of the map (0-24). |
| options.minimap![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \|<br>[MinimapOptionsInput](https://docs.maptiler.com/sdk-js/api/controls/#maptilerminimapcontrol-parameters))?<br>default: `false` | If<br> `true`<br> , an<br> [MaptilerMinimapControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilerminimapcontrol)<br> will be added to the map.<br> Valid options are<br> `top-left`<br> ,<br> `top-right`<br> ,<br> `bottom-left`<br> ,<br> `bottom-right`<br> .<br> or [MinimapOptionsInput](https://docs.maptiler.com/sdk-js/api/controls/#maptilerminimapcontrol-parameters) |
| options.minPitch<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The minimum pitch of the map (0-85). Values greater than 60<br> degrees are experimental and may result in rendering issues. If you encounter any, please raise an<br> issue with details in the MapLibre project. |
| options.minZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The minimum zoom level of the map (0-24). |
| options.navigationControl![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?<br>default: `true` | If<br> `true`<br> , an<br> [MaptilerNavigationControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilernavigationcontrol)<br> will be added to the map.<br> Valid options are<br> `top-left`<br> ,<br> `top-right`<br> ,<br> `bottom-left`<br> ,<br> `bottom-right`<br> . |
| options.pitchWithRotate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `false`<br> , the map's pitch (tilt) control with "drag to rotate" interaction will be disabled. |
| options.pixelRatio<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The pixel ratio. The canvas'<br> `width`<br> attribute will be<br> `container.clientWidth * pixelRatio`<br> and its<br> `height`<br> attribute will be<br> `container.clientHeight * pixelRatio`<br> . Defaults to<br> `devicePixelRatio`<br> if not specified. |
| options.projectionControl![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?<br>default: `false` | If<br> `true`<br> , an<br> [MaptilerProjectionControl](https://docs.maptiler.com/sdk-js/api/controls/#MaptilerProjectionControl)<br> will be added to the map.<br> Valid options are<br> `top-left`<br> ,<br> `top-right`<br> ,<br> `bottom-left`<br> ,<br> `bottom-right`<br> . |
| options.refreshExpiredTiles<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `false`<br> , the map won't attempt to re-request tiles once they expire per their HTTP<br> `cacheControl`<br> /<br> `expires`<br> headers. |
| options.renderWorldCopies<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If<br> set to<br> `false`<br> :<br> <br>- When the map is zoomed out far enough that a single representation of the world does not fill<br>   the map's entire<br>   container, there will be blank space beyond 180 and -180 degrees longitude.<br>- Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the<br>   right edge of the<br>   map and the other on the left edge of the map) at every zoom level. |
| options.roll![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The initial roll angle of the map, measured in degrees counter-clockwise about the camera boresight.<br> If `roll` is not specified in the constructor options, MapTiler SDK <br> will look for it in the map's style object. <br> If it is not specified in the style, either, it will default to `0`. |
| options.rollEnabled![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `false` | If `false`, the map's roll control with "drag to rotate" interaction will be disabled. |
| options.scaleControl![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?<br>default: `false` | If<br> `true`<br> , an<br> [ScaleControl](https://docs.maptiler.com/sdk-js/api/controls/#scalecontrol)<br> will be added to the map.<br> Valid options are<br> `top-left`<br> ,<br> `top-right`<br> ,<br> `bottom-left`<br> ,<br> `bottom-right`<br> . |
| options.scrollZoom<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>\| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))?<br>default: `true` | If<br> `true`<br> , the "scroll to zoom" interaction is enabled. An<br> `Object`<br> value is passed as options to<br> [ScrollZoomHandler#enable](https://docs.maptiler.com/sdk-js/api/handlers/#scrollzoomhandler#enable)<br> . |
| options.space![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>\| [CubemapLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/#CubemapLayerConstructorOptions))?<br>default: `false` | The space option allows customizing the background environment of the globe, simulating deep space or skybox effects.<br> You can enable a start space background by setting it to `true`.<br> For more customization, check [CubemapLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/#CubemapLayerConstructorOptions)<br>This option **only takes effect** when used in conjunction with the `projection: 'globe'` parameter. |
| options.terrain![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `false` | If<br> `true`<br> , the map's loads a 3D terrain, based on a [MapTiler "raster-dem" source](https://www.maptiler.com/terrain/). |
| options.terrainControl![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))?<br>default: `false` | If<br> `true`<br> , an<br> [MaptilerTerrainControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilerterraincontrol)<br> will be added to the map.<br> Valid options are<br> `top-left`<br> ,<br> `top-right`<br> ,<br> `bottom-left`<br> ,<br> `bottom-right`<br> . |
| options.terrainExaggeration![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `1` | 3D terrain exaggeration factor. |
| options.touchPitch<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>\| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))?<br>default: `true` | If<br> `true`<br> , the "drag to pitch" interaction is enabled. An<br> `Object`<br> value is passed as options to<br> [TouchPitchHandler#enable](https://docs.maptiler.com/sdk-js/api/handlers/#touchpitchhandler#enable)<br> . |
| options.touchZoomRotate<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>\| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))?<br>default: `true` | If<br> `true`<br> , the "pinch to rotate and zoom" interaction is enabled. An<br> `Object`<br> value is passed as options to<br> [TouchZoomRotateHandler#enable](https://docs.maptiler.com/sdk-js/api/handlers/#touchzoomrotatehandler#enable)<br> . |
| options.trackResize<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If<br> `true`<br> , the map will automatically resize when the browser window resizes. |
| options.transformCameraUpdate<br>[CameraUpdateTransformFunction](https://docs.maptiler.com/sdk-js/api/types/#CameraUpdateTransformFunction)?<br>default: `null` | A callback run before the map's <br> camera is moved due to user input or animation. <br> The callback can be used to modify the new center, zoom, pitch and bearing. <br> Expected to return an object containing center, zoom, pitch or bearing values to overwrite. |
| options.transformRequest<br>[RequestTransformFunction](https://docs.maptiler.com/sdk-js/api/types/#RequestTransformFunction)?<br>default: `null` | A callback run before the Map makes a request for an external<br> URL. The callback can be used to modify the url, set headers, or set the credentials property for<br> cross-origin requests.<br> Expected to return an object with a<br> `url`<br> property and optionally<br> `headers`<br> and<br> `credentials`<br> properties.<br> <br>Example<br>```js<br>transformRequest: (url, resourceType); {<br>  if(resourceType === 'Source' && url.startsWith('http://myHost')) {<br>    return {<br>      url: url.replace('http', 'https'),<br>      headers: { 'my-custom-header': true},<br>      credentials: 'include'  // Include cookies for cross-origin requests<br>    }<br>  }<br>}<br>```<br>JavaScript<br>Copy |
| options.validateStyle<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | If `false`, style validation will be skipped. <br> Useful in production environment. |

## [Methods](https://docs.maptiler.com/sdk-js/api/map/\#map-instance-members)

addControl(control,
position?)

Adds an [IControl](https://docs.maptiler.com/sdk-js/api/controls/#icontrol) to the map, calling
`control.onAdd(this)`.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#addcontrol-parameters)

control
([`IControl`](https://docs.maptiler.com/sdk-js/api/controls/#icontrol))
: The
[IControl](https://docs.maptiler.com/sdk-js/api/controls/#icontrol)
to add.


position
([`string`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?)
: position
on the map to which the control will be added.
Valid values are
`'top-left'`
,
`'top-right'`
,
`'bottom-left'`
, and
`'bottom-right'`
. Defaults to
`'top-right'`
.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#addcontrol-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#addcontrol-example)

```js
// Add zoom and rotation controls to the map.
map.addControl(new maptilersdk.NavigationControl());
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#addcontrol-related)

- [Display map navigation\\
controls](https://docs.maptiler.com/sdk-js/examples/navigation/)

addImage(id, image, options)

Add an image to the style. This image can be displayed on the map like any other icon in the style's
sprite using the image's ID with
[`icon-image`](https://docs.maptiler.com/gl-style-specification/#layout-symbol-icon-image),
[`background-pattern`](https://docs.maptiler.com/gl-style-specification/#paint-background-background-pattern),
[`fill-pattern`](https://docs.maptiler.com/gl-style-specification/#paint-fill-fill-pattern),
or [`line-pattern`](https://docs.maptiler.com/gl-style-specification/#paint-line-line-pattern).
A [Map.event:error](https://docs.maptiler.com/sdk-js/api/map/#map.event:error) event will be fired if there
is not enough space in the sprite to add this image.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#addimage-parameters)

id`(string)`: The
ID of the image.


image
(( [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement) \|
`ImageBitmap` \|
`ImageData` \|
{width: [`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number),
height: [`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number),
data: ( [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \|
[`Uint8ClampedArray`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray))} \|
[`StyleImageInterface`](https://docs.maptiler.com/sdk-js/api/properties/#styleimageinterface)))
: The
image as an
`HTMLImageElement`
,
`ImageData`
,
`ImageBitmap`
or object with
`width`
,
`height`
, and
`data`

properties with the same format as
`ImageData`
.


options`(Partial<StyleImageMetadata>)`: Options object. Defaults to `{}`

| options.pixelRatio<br>any?<br>default: `1` | The ratio of pixels in the image to physical pixels on the<br> screen |
| options.sdf<br>any?<br>default: `false` | Whether the image should be interpreted as an SDF image |
| options.stretchX<br>any? | `[[x1, x2], ...]`<br> If<br> `icon-text-fit`<br> is used in a layer with this image, this option defines the part(s) of the image that can be<br> stretched horizontally. |
| options.stretchY<br>any? | `[[y1, y2], ...]`<br> If<br> `icon-text-fit`<br> is used in a layer with this image, this option defines the part(s) of the image that can be<br> stretched vertically. |
| options.content<br>any? | `[x1, y1, x2, y2]`<br> If<br> `icon-text-fit`<br> is used in a layer with this image, this option defines the part of the image that can be<br> covered by the content in<br> `text-field`<br> . |

[Example](https://docs.maptiler.com/sdk-js/api/map/#addimage-example)

```js
// If the style's sprite does not already contain an image with ID 'cat',
// add the image 'cat-icon.png' to the style's sprite with the ID 'cat'.
const image = await map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png');
if (!map.hasImage('cat')) map.addImage('cat', image.data);

// Add a stretchable image that can be used with `icon-text-fit`
// In this example, the image is 600px wide by 400px high.
const image = await map.loadImage('https://upload.wikimedia.org/wikipedia/commons/8/89/Black_and_White_Boxed_%28bordered%29.png');
if (!map.hasImage('border-image')) {
  map.addImage('border-image', image.data, {
      content: [16, 16, 300, 384], // place text over left half of image, avoiding the 16px border
      stretchX: [[16, 584]], // stretch everything horizontally except the 16px border
      stretchY: [[16, 384]], // stretch everything vertically except the 16px border
  });
}
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#addimage-related)

- Use
`HTMLImageElement`
:
[Add an icon to the map](https://docs.maptiler.com/sdk-js/examples/add-image/)
- Use
`ImageData`
:
[Add a generated icon to\\
the map](https://docs.maptiler.com/sdk-js/examples/add-image-generated/)

addLayer(layer, beforeId?)

Adds a [GL style layer](https://docs.maptiler.com/gl-style-specification/#layers)
to the map's style.

A layer defines how data from a specified source will be styled. Read more about layer types
and available paint and layout properties in the [GL Style\\
Specification](https://docs.maptiler.com/gl-style-specification/#layers).

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#addlayer-parameters)

layer
([`Object`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))
: conforming
to either the GL Style Specification's
[layer definition](https://docs.maptiler.com/gl-style-specification/#layers)
or,
less commonly, the
[CustomLayerInterface](https://docs.maptiler.com/sdk-js/api/properties/#customlayerinterface)
specification.
The GL Style Specification's layer definition is appropriate for most layers.


| layer.id<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | A unique identifer that you define. |
| layer.type<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | The type of layer (for example<br> `fill`<br> or<br> `symbol`<br> ).<br> A list of layer types is available in the<br> [GL Style\<br> Specification](https://docs.maptiler.com/gl-style-specification/layers/#type)<br> .<br> <br>(This can also be `custom`. For more information, see<br> [CustomLayerInterface](https://docs.maptiler.com/sdk-js/api/properties/#customlayerinterface).) |
| layer.source<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>\| SourceSpecification)? | The data source for the layer.<br> Reference a source that has<br> _already been defined_<br> using the source's unique id.<br> Reference a<br> _new source_<br> using a source object (as defined in the<br> [GL Style\<br> Specification](https://docs.maptiler.com/gl-style-specification/sources/)<br> ) directly.<br> This is<br> **required**<br> for all<br> `layer.type`<br> options<br> _except_<br> for<br> `custom`<br> and<br> `background`<br> . |
| layer.sourceLayer<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | (optional) The name of the source layer within the<br> specified<br> `layer.source`<br> to use for this style layer.<br> This is only applicable for vector tile sources and is<br> **required**<br> when<br> `layer.source`<br> is of the type<br> `vector`<br> . |
| layer.filter<br>[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)? | (optional) An expression specifying conditions on source<br> features.<br> Only features that match the filter are displayed.<br> The GL Style Specification includes more information on the limitations of the<br> [`filter`](https://docs.maptiler.com/gl-style-specification/layers/#filter)<br> parameter<br> and a complete list of available<br> [expressions](https://docs.maptiler.com/gl-style-specification/expressions/)<br> .<br> If no filter is provided, all features in the source (or source layer for vector tilesets) will<br> be displayed. |
| layer.paint<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)? | (optional) Paint properties for the layer.<br> Available paint properties vary by<br> `layer.type`<br> .<br> A full list of paint properties for each layer type is available in the<br> [GL Style\<br> Specification](https://docs.maptiler.com/gl-style-specification/layers/)<br> .<br> If no paint properties are specified, default values will be used. |
| layer.layout<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)? | (optional) Layout properties for the layer.<br> Available layout properties vary by<br> `layer.type`<br> .<br> A full list of layout properties for each layer type is available in the<br> [GL Style\<br> Specification](https://docs.maptiler.com/gl-style-specification/layers/)<br> .<br> If no layout properties are specified, default values will be used. |
| layer.maxzoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | (optional) The maximum zoom level for the layer.<br> At zoom levels equal to or greater than the maxzoom, the layer will be hidden.<br> The value can be any number between<br> `0`<br> and<br> `24`<br> (inclusive).<br> If no maxzoom is provided, the layer will be visible at all zoom levels for which there are<br> tiles available. |
| layer.minzoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | (optional) The minimum zoom level for the layer.<br> At zoom levels less than the minzoom, the layer will be hidden.<br> The value can be any number between<br> `0`<br> and<br> `24`<br> (inclusive).<br> If no minzoom is provided, the layer will be visible at all zoom levels for which there are<br> tiles available. |
| layer.metadata<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)? | (optional) Arbitrary properties useful to track with the<br> layer, but do not influence rendering. |
| layer.renderingMode<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | This is only applicable for layers with the type<br> `custom`<br> .<br> See<br> [CustomLayerInterface](https://docs.maptiler.com/sdk-js/api/properties/#customlayerinterface)<br> for more information. |

beforeId
([`string`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?)
: The
ID of an existing layer to insert the new layer before,
resulting in the new layer appearing visually beneath the existing layer.
If this argument is not specified, the layer will be appended to the end of the layers array
and appear visually above all other layers.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#addlayer-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#addlayer-example)

```js
// Add a circle layer with a vector source
map.addLayer({
  id: 'points-of-interest',
  source: {
    type: 'vector',
    url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=<YOUR_MAPTILER_API_KEY>'
  },
  'source-layer': 'poi_label',
  type: 'circle',
  paint: {
    // GL Style Specification paint properties
  },
  layout: {
    // GL Style Specification layout properties
  }
});
```

JavaScript

Copy

```js
// Define a source before using it to create a new layer
map.addSource('state-data', {
  type: 'geojson',
  data: 'path/to/data.geojson'
});

map.addLayer({
  id: 'states',
  // References the GeoJSON source defined above
  // and does not require a `source-layer`
  source: 'state-data',
  type: 'symbol',
  layout: {
    // Set the label content to the
    // feature's `name` property
    text-field: ['get', 'name']
  }
});
```

JavaScript

Copy

```js
// Add a new symbol layer before an existing layer
map.addLayer({
  id: 'states',
  // References a source that's already been defined
  source: 'state-data',
  type: 'symbol',
  layout: {
    // Set the label content to the
    // feature's `name` property
    text-field: ['get', 'name']
  }
  // Add the layer before the existing `cities` layer
}, 'cities');
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#addlayer-related)

- [Create and style clusters](https://docs.maptiler.com/sdk-js/examples/cluster/)
- [Add a vector tile\\
source](https://docs.maptiler.com/sdk-js/examples/vector-source/)
- [Add a WMS source](https://docs.maptiler.com/sdk-js/examples/wms/)

addSource(id, source)

Adds a source to the map's style.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#addsource-parameters)

id
([`string`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))
: The
ID of the source to add. Must not conflict with existing sources.


source
([`Object`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))
: The
source object, conforming to the
GL Style Specification's
[source definition](https://docs.maptiler.com/gl-style-specification/#sources)
or

[CanvasSourceOptions](https://docs.maptiler.com/sdk-js/api/sources/#canvassourceoptions)
.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#addsource-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#addsource-example)

```js
map.addSource('my-data', {
  type: 'vector',
  url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=<YOUR_MAPTILER_API_KEY>'
});
```

JavaScript

Copy

```js
map.addSource('my-data', {
  "type": "geojson",
  "data": {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-77.0364, 38.8816]
    },
    "properties": {
      "title": "Jefferson Memorial",
      "marker-symbol": "monument"
    }
  }
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#addsource-related)

- GeoJSON source:
[Add live realtime data](https://docs.maptiler.com/sdk-js/examples/live-geojson/)

addSprite(id, url, options?)

Adds a sprite to the map's style. Fires the `style` event.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#addsprite-parameters)

id
([`string`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))
: The ID of the sprite to add. Must not conflict with existing sprites.


url
([`string`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))
: The URL to load the sprite from.


options
([`StyleSetterOptions`](https://docs.maptiler.com/sdk-js/api/types/#StyleSetterOptions))
: Options object.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#addsprite-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#addsprite-example)

```js
map.addSprite('sprite-two', 'http://example.com/sprite-two');
```

JavaScript

Copy

areTilesLoaded()

Returns a Boolean indicating whether all tiles in the viewport from all sources on
the style are loaded.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#aretilesloaded-returns)

`boolean`:
A Boolean indicating whether all tiles are loaded.


[Example](https://docs.maptiler.com/sdk-js/api/map/#aretilesloaded-example)

```js
const tilesLoaded = map.areTilesLoaded();
```

JavaScript

Copy

boxZoom

The map's [BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler), which
implements zooming using a drag gesture with the Shift key pressed.
Find more details and examples using `boxZoom` in the [BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler) section.

calculateCameraOptionsFromCameraLngLatAltRotation(cameraLngLat, cameraAlt, bearing, pitch, roll)

Given a camera position and rotation, calculates zoom and center point and returns them as as Cameraoptions.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#calculateCameraOptionsFromCameraLngLatAltRotation-parameters)

cameraLngLat
([`LngLatLike`](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike))
: The lng, lat of the camera to look from


cameraAlt
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: The altitude of the camera to look from, in meters above sea level


bearing
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: Bearing of the camera, in degrees


pitch
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: Pitch of the camera, in degrees


roll
([`number`?](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: Roll of the camera, in degrees


[Returns](https://docs.maptiler.com/sdk-js/api/map/#calculateCameraOptionsFromCameraLngLatAltRotation-returns)

`CameraOptions`:
the calculated camera options


calculateCameraOptionsFromTo(from,
altitudeFrom, to, altitudeTo)

Calculates pitch, zoom and bearing for looking at @param newCenter with the camera position being @param
newCenter
and returns them as Cameraoptions.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#calculatecameraoptionsfromto-parameters)

from
([`LngLat`](https://docs.maptiler.com/sdk-js/api/geography/#lnglat))
: The
camera to look from


altitudeFrom
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: The
altitude of the camera to look from


to
([`LngLat`](https://docs.maptiler.com/sdk-js/api/geography/#lnglat))
: The
center to look at


altitudeTo
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: Optional altitude of the center to look at. If none
given the ground height
will be used. Defaults to
`0`

[Returns](https://docs.maptiler.com/sdk-js/api/map/#calculatecameraoptionsfromto-returns)

`CameraOptions`:
the calculated camera options


cameraForBounds(bounds,
options?)

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#cameraforbounds-parameters)

bounds`(LngLatBoundsLike)`Calculate
the center for these bounds in the viewport and use
the highest zoom level up to and including
`Map#getMaxZoom()`
that fits
in the viewport. LngLatBounds represent a box that is always axis-aligned with bearing 0.


options`(CameraForBoundsOptions?)`Options
object


| options.padding<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>\| [PaddingOptions](https://docs.maptiler.com/sdk-js/api/properties/#paddingoptions))? | The amount of padding in pixels to add to the given<br> bounds. |
| options.bearing<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 0 | Desired map bearing at end of animation, in degrees. |
| options.offset<br>[PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike)<br>default: \[0,0\] | The center of the given bounds relative to the map's<br> center, measured in pixels. |
| options.maxZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The maximum zoom level to allow when the camera would<br> transition to the specified bounds. |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#cameraforbounds-returns)

`CenterZoomBearing`:
If map is able to fit to provided bounds, returns
`center`
,
`zoom`
, and
`bearing`
.
If map is unable to fit, method will warn and return undefined.


[Example](https://docs.maptiler.com/sdk-js/api/map/#cameraforbounds-example)

```js
const bbox = [[-79, 43], [-73, 45]];
const newCameraTransform = map.cameraForBounds(bbox, {
  padding: {top: 10, bottom:25, left: 15, right: 5}
});
```

JavaScript

Copy

centerOnIpPoint(zoom)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Centering the map on the actual visitor location. Used when geolocate is to POINT but could be triggered
manually.


As a more precise option, if the user has previously granted access to the browser location (more precise)
then this is going to be used.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#centeronippoint-parameters)

zoom`(number)`The
zoom level to set.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#centeronippoint-returns)

`Promise`:
`void`

[Example](https://docs.maptiler.com/sdk-js/api/map/#centeronippoint-example)

```js
// Center the map on visitor location with a zoom level of 13
map.centerOnIpPoint(13);
```

JavaScript

Copy

cooperativeGestures

The map's [CooperativeGesturesHandler](https://docs.maptiler.com/sdk-js/api/handlers/#cooperativegestureshandler),
which allows the user to see cooperative gesture info when user tries to zoom in/out.
Find more details and examples using `cooperativeGestures` in the [CooperativeGesturesHandler](https://docs.maptiler.com/sdk-js/api/handlers/#cooperativegestureshandler) section.

disableTerrain()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Disable the 3D terrain visualization.


[Example](https://docs.maptiler.com/sdk-js/api/map/#disableterrain-example)

```js
// disable the 3D terrain
map.disableTerrain();
```

JavaScript

Copy

disableHaloAnimations()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Disable transitions between halo states, making it change instantly.


[Example](https://docs.maptiler.com/sdk-js/api/map/#disablehaloanimations-example)

```js
// disable the halo animation
map.disableHaloAnimations();
```

JavaScript

Copy

disableSpaceAnimations()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Disable transitions between space colors and backgrounds, making them change instantly (or as soon as the
images have loaded)


[Example](https://docs.maptiler.com/sdk-js/api/map/#disablespaceanimations-example)

```js
// disable the space animation
map.disableSpaceAnimations();
```

JavaScript

Copy

doubleClickZoom

The map's [DoubleClickZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#doubleclickzoomhandler),
which allows the user to zoom by double clicking.
Find more details and examples using `doubleClickZoom` in the [DoubleClickZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#doubleclickzoomhandler) section.

dragPan

The map's [DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler), which
implements dragging the map with a mouse or touch gesture.
Find more details and examples using `dragPan` in the [DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler) section.

dragRotate

The map's [DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler), which
implements rotating the map while dragging with the right
mouse button or with the Control key pressed. Find more details and examples using `dragRotate`
in the [DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler) section.

easeTo(options, eventData?)

Changes any combination of `center`, `zoom`, `bearing`,
`pitch`, and `padding` with an
animated transition
between old and new values. The map will retain its current values for any
details not specified in `options`.


Note: The transition will happen instantly if the user has enabled
the `reduced motion` accesibility feature enabled in their operating
system,
unless `options` includes `essential: true`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#easeto-parameters)

options`(any)`Options
describing the destination and animation of the transition.
Accepts
[CameraOptions](https://docs.maptiler.com/sdk-js/api/properties/#cameraoptions)
and
[AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions)
.


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#easeto-returns)

`Map`:
`this`

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#easeto-related)

- [Navigate the map with\\
game-like controls](https://docs.maptiler.com/sdk-js/examples/game-controls/)

enableGlobeProjection()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Enables the globe projection visualization.

Similarly to the projection option in the map constructor, this overwrites the `projection` settings defined in the map style json (if any). These settings
persist even
when the style is updated or reloaded. If you're looking for a _temporary projection change_, use [`setProjection({type:"globe"})`](https://docs.maptiler.com/sdk-js/api/map/#map#setProjection).

[Example](https://docs.maptiler.com/sdk-js/api/map/#enableGlobeProjection-example)

```js
map.enableGlobeProjection();
```

JavaScript

Copy

enableMercatorProjection()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Enables the mercator projection visualization.

Similarly to the projection option in the constructor,
this will overwrite the `projection` settings from style (if any)
and persist it when the style is updated.
_`setProjection({type:"mercator"})` changes projection temporarily._
_After map style reload, projection is reset back to the projection defined in map constructor._

[Example](https://docs.maptiler.com/sdk-js/api/map/#enableMercatorProjection-example)

```js
map.enableMercatorProjection();
```

JavaScript

Copy

enableHaloAnimations()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Enable transitions between halo states, making it transition between states (on by default).


[Example](https://docs.maptiler.com/sdk-js/api/map/#enablehaloanimations-example)

```js
// enable the halo animation
map.enableHaloAnimations();
```

JavaScript

Copy

enableSpaceAnimations()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Enable transitions between space colors and backgrounds, making them transition between colours and images.


[Example](https://docs.maptiler.com/sdk-js/api/map/#enablespaceanimations-example)

```js
// enable the space animation
map.enableSpaceAnimations();
```

JavaScript

Copy

enableTerrain(exaggeration?)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Enables the 3D terrain visualization.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#enableterrain-parameters)

exaggeration`(number?)`Enables the 3D terrain visualization and sets the terrain exaggeration factor


[Example](https://docs.maptiler.com/sdk-js/api/map/#enableterrain-example)

```js
// With the default exaggeration factor of 1
map.enableTerrain();

// Or, if you want to boost some volume a little
map.enableTerrain(1.5);
```

JavaScript

Copy

fitBounds(bounds, options?,
eventData?)

Pans and zooms the map to contain its visible area within the specified geographical bounds.
This function will also reset the map's bearing to 0 if bearing is nonzero.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#fitbounds-parameters)

bounds`(LngLatBoundsLike)`Center
these bounds in the viewport and use the highest
zoom level up to and including
`Map#getMaxZoom()`
that fits them in the viewport.


options`(FitBoundsOptions?)`Options supports
all properties from
[AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions)
and
[CameraOptions](https://docs.maptiler.com/sdk-js/api/properties/#cameraoptions)
in addition to the fields below.


| options.padding<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>\| [PaddingOptions](https://docs.maptiler.com/sdk-js/api/properties/#paddingoptions))? | The amount of padding in pixels to add to the given<br> bounds. |
| options.linear<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: false | If<br> `true`<br> , the map transitions using<br> [Map#easeTo](https://docs.maptiler.com/sdk-js/api/map/#map#easeto)<br> . If<br> `false`<br> , the map transitions using<br> [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto)<br> . See<br> those functions and<br> [AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions)<br> for information about options available. |
| options.easing<br>[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)? | An easing function for the animated transition. See<br> [AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions)<br> . |
| options.offset<br>[PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike)<br>default: \[0,0\] | The center of the given bounds relative to the map's<br> center, measured in pixels. |
| options.maxZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The maximum zoom level to allow when the map view<br> transitions to the specified bounds. |

eventData`(Object?)`Additional
properties to be added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#fitbounds-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#fitbounds-example)

```js
const bbox = [[-79, 43], [-73, 45]];
map.fitBounds(bbox, {
  padding: {top: 10, bottom:25, left: 15, right: 5}
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#fitbounds-related)

- [Fit a map to a bounding\\
box](https://docs.maptiler.com/sdk-js/examples/fitbounds/)

fitScreenCoordinates(p0, p1, bearing,
options?, eventData?)

Pans, rotates and zooms the map to to fit the box made by points p0 and p1
once the map is rotated to the specified bearing. To zoom without rotating,
pass in the current map bearing.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#fitscreencoordinates-parameters)

p0`(PointLike)`First
point on screen, in pixel coordinates


p1`(PointLike)`Second
point on screen, in pixel coordinates


bearing`(number)`Desired
map bearing at end of animation, in degrees


options`(FitBoundsOptions?)`Options object


| options.padding<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>\| [PaddingOptions](https://docs.maptiler.com/sdk-js/api/properties/#paddingoptions))? | The amount of padding in pixels to add to the given<br> bounds. |
| options.linear<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: false | If<br> `true`<br> , the map transitions using<br> [Map#easeTo](https://docs.maptiler.com/sdk-js/api/map/#map#easeto)<br> . If<br> `false`<br> , the map transitions using<br> [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto)<br> . See<br> those functions and<br> [AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions)<br> for information about options available. |
| options.easing<br>[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)? | An easing function for the animated transition. See<br> [AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions)<br> . |
| options.offset<br>[PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike)<br>default: \[0,0\] | The center of the given bounds relative to the map's<br> center, measured in pixels. |
| options.maxZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The maximum zoom level to allow when the map view<br> transitions to the specified bounds. |

eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#fitscreencoordinates-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#fitscreencoordinates-example)

```js
const p0 = [220, 400];
const p1 = [500, 900];
map.fitScreenCoordinates(p0, p1, map.getBearing(), {
  padding: {top: 10, bottom:25, left: 15, right: 5}
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#fitscreencoordinates-related)

- Used by
[BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler)

fitToIpBounds()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Fit the map view on the bounding box of the visitor's country. Used when geolocate is to COUNTRY but could be
triggered manually.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#fittoipbounds-returns)

`Promise`:
`void`

[Example](https://docs.maptiler.com/sdk-js/api/map/#fittoipbounds-example)

```js
// With the default exaggeration factor of 1
map.fitToIpBounds();
```

JavaScript

Copy

flyTo(options, eventData?)

Changes any combination of center, zoom, bearing, and pitch, animating the transition along a curve that
evokes flight. The animation seamlessly incorporates zooming and panning to help
the user maintain her bearings even after traversing a great distance.

Note: The animation will be skipped, and this will behave equivalently to `jumpTo`
if the user has the `reduced motion` accesibility feature enabled in
their operating system,
unless 'options' includes `essential: true`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#flyto-parameters)

options`(FlyToOptions)`Options describing the
destination and animation of the transition.
Accepts
[CameraOptions](https://docs.maptiler.com/sdk-js/api/properties/#cameraoptions)
,
[AnimationOptions](https://docs.maptiler.com/sdk-js/api/properties/#animationoptions)
,
and the following additional options.


| options.curve<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 1.42 | The zooming "curve" that will occur along the<br> flight path. A high value maximizes zooming for an exaggerated animation, while a low<br> value minimizes zooming for an effect closer to<br> [Map#easeTo](https://docs.maptiler.com/sdk-js/api/map/#map#easeto)<br> . 1.42 is the average<br> value selected by participants in the user study discussed in<br> [van Wijk (2003)](https://www.win.tue.nl/~vanwijk/zoompan.pdf)<br> . A value of<br> `Math.pow(6, 0.25)`<br> would be equivalent to the root mean squared average velocity. A<br> value of 1 would produce a circular motion. |
| options.minZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The zero-based zoom level at the peak of the flight path.<br> If<br> `options.curve`<br> is specified, this option is ignored. |
| options.speed<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 1.2 | The average speed of the animation defined in relation to<br> `options.curve`<br> . A speed of 1.2 means that the map appears to move along the flight path<br> by 1.2 times<br> `options.curve`<br> screenfuls every second. A<br> _screenful_<br> is the map's visible span.<br> It does not correspond to a fixed physical distance, but varies by zoom level. |
| options.screenSpeed<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The average speed of the animation measured in screenfuls<br> per second, assuming a linear timing curve. If<br> `options.speed`<br> is specified, this option is ignored. |
| options.maxDuration<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The animation's maximum duration, measured in<br> milliseconds.<br> If duration exceeds maximum duration, it resets to 0. |

eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#flyto-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#flyto-example)

```js
// fly with default options to null island
map.flyTo({center: [0, 0], zoom: 9});
// using flyTo options
map.flyTo({
  center: [0, 0],
  zoom: 9,
  speed: 0.2,
  curve: 1,
  easing(t) {
    return t;
  }
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#flyto-related)

- [Fly to a location](https://docs.maptiler.com/sdk-js/examples/flyto/)
- [Slowly fly to a\\
location](https://docs.maptiler.com/sdk-js/examples/flyto-options/)
- [Fly to a location based\\
on scroll position](https://docs.maptiler.com/sdk-js/examples/scroll-fly-to/)

getBearing()

Returns the map's current bearing. The bearing is the compass direction that is "up"; for example, a
bearing
of 90° orients the map so that east is up.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getbearing-returns)

`number`:
The map's current bearing.


[Related examples](https://docs.maptiler.com/sdk-js/api/map/#getbearing-related)

- [Navigate the map with\\
game-like controls](https://docs.maptiler.com/sdk-js/examples/game-controls/)

getBounds()

Returns the map's geographical bounds. When the bearing or pitch is non-zero, the visible region is not
an axis-aligned rectangle, and the result is the smallest bounds that encompasses the visible region.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getbounds-returns)

`LngLatBounds`:
The geographical bounds of the map as
[LngLatBounds](https://docs.maptiler.com/sdk-js/api/geography/#lnglatbounds)
.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getbounds-example)

```js
const bounds = map.getBounds();
```

JavaScript

Copy

getCameraHash()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Compute a base64 string hash that is unique for camera settings (to check if a user a moved in the process of
geolocation)


[Returns](https://docs.maptiler.com/sdk-js/api/map/#getcamerahash-returns)

`string`:
The camera hash base64 string.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getcamerahash-example)

```js
const cameraHash = map.getCameraHash();
```

JavaScript

Copy

getCameraTargetElevation()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Returns the elevation for the point where the camera is looking. This value corresponds to: "meters above sea
level" \* "exaggeration"


[Returns](https://docs.maptiler.com/sdk-js/api/map/#getcameratargetelevation-returns)

`number`:
The elevation.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getcameratargetelevation-example)

```js
const cameraElevation = map.getCameraTargetElevation();
```

JavaScript

Copy

getCanvas()

Returns the map's `<canvas>` element.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getcanvas-returns)

`HTMLCanvasElement`:
The map's
`<canvas>`
element.


[Related examples](https://docs.maptiler.com/sdk-js/api/map/#getcanvas-related)

- [Measure distances](https://docs.maptiler.com/sdk-js/examples/measure/)
- [Display a popup on\\
hover](https://docs.maptiler.com/sdk-js/examples/popup-on-hover/)
- [Center the map on a\\
clicked symbol](https://docs.maptiler.com/sdk-js/examples/center-on-symbol/)

getCanvasContainer()

Returns the HTML element containing the map's `<canvas>`
element.

If you want to add non-GL overlays to the map, you should append them to this element.

This is the element to which event bindings for map interactivity (such as panning and zooming) are
attached. It will receive bubbled events from child elements such as the `<canvas>`, but
not from
map controls.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getcanvascontainer-returns)

`HTMLElement`:
The container of the map's
`<canvas>`
.


[Related\\
examples](https://docs.maptiler.com/sdk-js/api/map/#getcanvascontainer-related)

- [Create a draggable\\
point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

getCenter()

Returns the map's geographical centerpoint.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getcenter-returns)

`LngLat`:
The
map's geographical centerpoint.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getcenter-example)

```js
// return a LngLat object such as {lng: 0, lat: 0}
const center = map.getCenter();
// access longitude and latitude values directly
const {lng, lat} = map.getCenter();
```

JavaScript

Copy

getCenterClampedToGround()

Returns the value of `centerClampedToGround`.

If true, the elevation of the center point will automatically be set to the terrain elevation (or zero if
terrain is not enabled). If false, the elevation of the center point will default to sea level and will not
automatically update. Defaults to true. Needs to be set to false to keep the camera above ground when pitch >
90 degrees.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getCenterClampedToGround-returns)

`boolean`

getCenterElevation()

Returns the elevation of the map's center point.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getCenterElevation-returns)

`number`: The elevation of the map's center point, in meters above sea
level.



getContainer()

Returns the map's containing HTML element.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getcontainer-returns)

`HTMLElement`:
The map's container.


getFeatureState(feature)

Gets the `state` of a feature.
A feature's `state` is a set of user-defined key-value pairs that
are assigned to a feature at
runtime.
Features are identified by their `feature.id` attribute, which can
be any number or string.

_Note: To access the values in a feature's state object for the purposes of styling the feature, use_
_the [`feature-state`\_\
_expression](https://docs.maptiler.com/gl-style-specification/expressions/#feature-state)._

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#getfeaturestate-parameters)

feature`(Object)`Feature
identifier. Feature objects returned from

[Map#queryRenderedFeatures](https://docs.maptiler.com/sdk-js/api/map/#map#queryrenderedfeatures)
or event handlers can be used as feature identifiers.


| feature.id<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>\| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)) | Unique id of the feature. |
| feature.source<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | The id of the vector or GeoJSON source for the feature. |
| feature.sourceLayer<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | (optional)<br> _For vector tile sources, `sourceLayer` is_<br>_required._ |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getfeaturestate-returns)

`Object`:
The state of the feature: a set of key-value pairs that was assigned to the feature at runtime.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getfeaturestate-example)

```js
// When the mouse moves over the `my-layer` layer,
// get the feature state for the feature under the mouse
map.on('mousemove', 'my-layer', function(e) {
  if (e.features.length &gt; 0) {
  map.getFeatureState({
    source: 'my-source',
    sourceLayer: 'my-source-layer',
    id: e.features[0].id
  });
  }
});
```

JavaScript

Copy

getFilter(layerId)

Returns the filter applied to the specified style layer.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#getfilter-parameters)

layerId`(string)`The
ID of the style layer whose filter to get.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#getfilter-returns)

`Array`:
The layer's filter.


getGlobalState()

Returns the global map state.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getGlobalState-returns)

`Record<string, any>`:
The map state object.

getGlyphs(layerId)

Returns the filter applied to the specified style layer.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getglyphs-returns)

`string`:
The glyphs Style's glyphs url.


getHalo()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Returns the map's halo (atmospheric glow) of the globe.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#gethalo-returns)

`(RadialGradientLayer | undefined)`:
Halo (atmospheric glow) of the globe or `undefined` if the halo was
not set in the map.


[Example](https://docs.maptiler.com/sdk-js/api/map/#gethalo-example)

```js
const halo = map.getHalo();
```

JavaScript

Copy

getImage(id)

Returns an image, specified by ID, currently available in the map.
This includes both images from the style's original sprite and any
images that have been added at runtime using addImage.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#getimage-parameters)

id`(string)`The
The ID of the image.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#getimage-returns)

`StyleImage`: An image in the map with the
specified ID.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getimage-example)

```js
let coffeeShopIcon = map.getImage("coffee_cup");
```

JavaScript

Copy

getLayer(id)

Returns the layer with the specified ID in the map's style.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#getlayer-parameters)

id`(string)`The
ID of the layer to get.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#getlayer-returns)

`StyleLayer`: The layer with
the specified ID, or
`undefined`

if the ID corresponds to no existing layers.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getlayer-example)

```js
const stateDataLayer = map.getLayer('state-data');
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#getlayer-related)

- [Filter symbols by\\
toggling a list](https://docs.maptiler.com/sdk-js/examples/filter-markers/)
- [Filter symbols\\
by text input](https://docs.maptiler.com/sdk-js/examples/filter-markers-by-input/)

getLayersOrder()

Return the ids of all layers currently in the style, including custom layers, in order.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getLayersOrder-returns)

`string[]`: ids of layers, in
order.

[Example](https://docs.maptiler.com/sdk-js/api/map/#getLayersOrder-example)

```js
const orderedLayerIds = map.getLayersOrder();
```

JavaScript

Copy

getLayoutProperty(layerId,
name)

Returns the value of a layout property in the specified style layer.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#getlayoutproperty-parameters)

layerId`(string)`The
ID of the layer to get the layout property from.


name`(string)`The
name of the layout property to get.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#getlayoutproperty-returns)

`any`: The value of
the specified layout property.


getLight()

Returns the value of the light object.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getlight-returns)

`Object`:
light Light properties of the style.


getMaptilerSessionId()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Get the MapTiler session ID. Convenient to dispatch to externaly built component that
do not directly have access to the SDK configuration but do have access to a Map instance.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getmaptilersessionid-returns)

`string`: the
MapTiler session ID


[Example](https://docs.maptiler.com/sdk-js/api/map/#getmaptilersessionid-example)

```js
map.getMaptilerSessionId();
```

JavaScript

Copy

getMaxBounds()

Returns the maximum geographical bounds the map is constrained to, or `null` if none set.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getmaxbounds-returns)

`(LngLatBounds | null)`:
The map object.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getmaxbounds-example)

```js
const maxBounds = map.getMaxBounds();
```

JavaScript

Copy

getMaxPitch()

Returns the map's maximum allowable pitch.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getmaxpitch-returns)

`number`:
maxPitch


getMaxZoom()

Returns the map's maximum allowable zoom level.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getmaxzoom-returns)

`number`:
maxZoom


[Example](https://docs.maptiler.com/sdk-js/api/map/#getmaxzoom-example)

```js
const maxZoom = map.getMaxZoom();
```

JavaScript

Copy

getMinPitch()

Returns the map's minimum allowable pitch.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getminpitch-returns)

`number`:
minPitch


getMinZoom()

Returns the map's minimum allowable zoom level.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getminzoom-returns)

`number`:
minZoom


[Example](https://docs.maptiler.com/sdk-js/api/map/#getminzoom-example)

```js
const minZoom = map.getMinZoom();
```

JavaScript

Copy

getPadding()

Returns the current padding applied around the map viewport.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getpadding-returns)

`PaddingOptions`:
The current padding around the map viewport.


getPaintProperty(layerId,
name)

Returns the value of a paint property in the specified style layer.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#getpaintproperty-parameters)

layerId`(string)`The
ID of the layer to get the paint property from.


name`(string)`The
name of a paint property to get.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#getpaintproperty-returns)

`any`: The value of
the specified paint property.


getPitch()

Returns the map's current pitch (tilt).

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getpitch-returns)

`number`:
The map's current pitch, measured in degrees away from the plane of the screen.


getPixelRatio()

Returns the map's pixel ratio.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getpixelratio-returns)

`number`:
The pixel ratio.


getProjection()

Gets the [ProjectionSpecification](https://docs.maptiler.com/gl-style-specification/projection)

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getProjection-returns)

`ProjectionSpecification`:
the projection specification.

[Example](https://docs.maptiler.com/sdk-js/api/map/#getProjection-example)

```js
let projection = map.getProjection();
```

JavaScript

Copy

getRenderWorldCopies()

Returns the state of `renderWorldCopies`. If `true`, multiple copies of the world
will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:

- When the map is zoomed out far enough that a single representation of the world does not fill the
map's entire
container, there will be blank space beyond 180 and -180 degrees longitude.
- Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right
edge of the
map and the other on the left edge of the map) at every zoom level.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getrenderworldcopies-returns)

`boolean`:
renderWorldCopies


[Example](https://docs.maptiler.com/sdk-js/api/map/#getrenderworldcopies-example)

```js
const worldCopiesRendered = map.getRenderWorldCopies();
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#getrenderworldcopies-related)

- [Render world\\
copies](https://docs.maptiler.com/sdk-js/examples/render-world-copies/)

getRoll()

Returns the map's current roll angle.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getRoll-returns)

`number`:
The map's current roll, measured in degrees about the camera boresight.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getRoll-example)

```js
map.getRoll();
```

JavaScript

Copy

getSdkConfig()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Get the SDK config object. This is convenient to dispatch the SDK configuration to externally built layers
that
do not directly have access to the SDK configuration but do have access to a Map instance.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getsdkconfig-returns)

`config`: the
[SDK config object](https://docs.maptiler.com/sdk-js/api/config/)

[Example](https://docs.maptiler.com/sdk-js/api/map/#getsdkconfig-example)

```js
map.getSdkConfig();
```

JavaScript

Copy

getSky()

Returns the value of the style's sky.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getSky-returns)

[`SkySpecification`](https://docs.maptiler.com/gl-style-specification/sky/):
the sky properties of the style.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getSky-example)

```js
map.getSky();
```

JavaScript

Copy

getSource(id)

Returns the source with the specified ID in the map's style.

This method is often used to update a source using the instance members for the relevant
source type as defined in [Sources](https://docs.maptiler.com/sdk-js/api/map/#sources).
For example, setting the `data` for a GeoJSON source or updating the
`url` and
`coordinates`
of an image source.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#getsource-parameters)

id`(string)`The
ID of the source to get.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#getsource-returns)

`(Source | undefined)`:
The style source with the specified ID or
`undefined`
if the ID
corresponds to no existing sources.
The shape of the object varies by source type.
A list of options for each source type is available on the GL Style Specification's

[Sources](https://docs.maptiler.com/gl-style-specification/sources/)
page.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getsource-example)

```js
const sourceObject = map.getSource('points');
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#getsource-related)

- [Create a draggable\\
point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)
- [Animate a\\
point](https://docs.maptiler.com/sdk-js/examples/animate-point-along-line/)
- [Add live realtime\\
data](https://docs.maptiler.com/sdk-js/examples/live-geojson/)

getSpace()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Returns the map's space (background environment) of the globe.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getspace-returns)

`(CubemapLayer | undefined)`:
Space (background environment) of the globe or `undefined` if the
space was not set in the map.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getspace-example)

```js
const space = map.getSpace();
```

JavaScript

Copy

getSprite()

Returns the map's GL style object, a JSON object which can be used to recreate the map's style.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getsprite-returns)

`Array`:
Style's sprite list of id-url pairs.
`[{ id: string ; url: string }]`

[Example](https://docs.maptiler.com/sdk-js/api/map/#getsprite-example)

```js
const sprite = map.getSprite();
```

JavaScript

Copy

getStyle()

Returns the map's GL style object, a JSON object which can be used to recreate the map's style.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getstyle-returns)

`Object`:
The map's style JSON object.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getstyle-example)

```js
const styleJson = map.getStyle();
```

JavaScript

Copy

getTerrain()

Get the terrain-options if terrain is loaded

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getterrain-returns)

`TerrainSpecification`: the
TerrainSpecification passed to setTerrain


[Example](https://docs.maptiler.com/sdk-js/api/map/#getterrain-example)

```js
map.getTerrain(); // { source: 'terrain' };
```

JavaScript

Copy

getTerrainExaggeration()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Get the terrain exaggeration factor if terrain is loaded

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getterrainexaggeration-returns)

`number`: the
terrain exaggeration factor


[Example](https://docs.maptiler.com/sdk-js/api/map/#getterrainexaggeration-example)

```js
map.getTerrainExaggeration();
```

JavaScript

Copy

getVerticalFieldOfView()

Returns the map's current vertical field of view, in degrees.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getVerticalFieldOfView-returns)

`number`: The map's current vertical field of view.
Default Value: `36.87`

[Example](https://docs.maptiler.com/sdk-js/api/map/#getVerticalFieldOfView-example)

```js
const verticalFieldOfView = map.getVerticalFieldOfView();
```

JavaScript

Copy

getZoom()

Returns the map's current zoom level.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#getzoom-returns)

`number`:
The map's current zoom level.


[Example](https://docs.maptiler.com/sdk-js/api/map/#getzoom-example)

```js
map.getZoom();
```

JavaScript

Copy

hasControl(control)

Checks if a control exists on the map.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#hascontrol-parameters)

control`(IControl)`The
[IControl](https://docs.maptiler.com/sdk-js/api/controls/#icontrol)
to check.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#hascontrol-returns)

`boolean`:
True if map contains control.


[Example](https://docs.maptiler.com/sdk-js/api/map/#hascontrol-example)

```js
// Define a new navigation control.
const navigation = new maptilersdk.NavigationControl();
// Add zoom and rotation controls to the map.
map.addControl(navigation);
// Check that the navigation control exists on the map.
map.hasControl(navigation);
```

JavaScript

Copy

hasImage(id)

Check whether or not an image with a specific ID exists in the style. This checks both images
in the style's original sprite and any images
that have been added at runtime using [Map#addImage](https://docs.maptiler.com/sdk-js/api/map/#map#addimage).

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#hasimage-parameters)

id`(string)`The
ID of the image.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#hasimage-returns)

`boolean`:
A Boolean indicating whether the image exists.


[Example](https://docs.maptiler.com/sdk-js/api/map/#hasimage-example)

```js
// Check if an image with the ID 'cat' exists in
// the style's sprite.
const catIconExists = map.hasImage('cat');
```

JavaScript

Copy

hasTerrain()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Check whether or not the terrian is enabled.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#hasterrain-returns)

`boolean`:
A Boolean indicating whether the terrain exists.


[Example](https://docs.maptiler.com/sdk-js/api/map/#hasterrain-example)

```js
// Check if the terrain exists.
const terrainExists = map.hasTerrain();
```

JavaScript

Copy

isGlobeProjection()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Returns whether a globe projection is currently being used.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#isGlobeProjection-returns)

`boolean`:
True if the map projection is globe.


[Example](https://docs.maptiler.com/sdk-js/api/map/#isGlobeProjection-example)

```js
const isGlobeProjection = map.isGlobeProjection();
```

JavaScript

Copy

isLanguageUpdated()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Returns `true` is the language was ever updated, meaning changed from
what is delivered in the style.
Returns `false` if language in use is the language from the style and
has never been changed.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#isLanguageUpdated-returns)

`boolean`:
True is the language was ever updated.


[Example](https://docs.maptiler.com/sdk-js/api/map/#isLanguageUpdated-example)

```js
const isLanguageUpdated = map.isLanguageUpdated();
```

JavaScript

Copy

isMoving()

Returns true if the map is panning, zooming, rotating, or pitching due to a camera animation or user
gesture.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#ismoving-returns)

`boolean`:
True if the map is moving.


[Example](https://docs.maptiler.com/sdk-js/api/map/#ismoving-example)

```js
const isMoving = map.isMoving();
```

JavaScript

Copy

isRotating()

Returns true if the map is rotating due to a camera animation or user gesture.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#isrotating-returns)

`boolean`:
True if the map is rotating.


[Example](https://docs.maptiler.com/sdk-js/api/map/#isrotating-example)

```js
map.isRotating();
```

JavaScript

Copy

isSourceLoaded(id)

Returns a Boolean indicating whether the source is loaded. Returns `true` if the source with
the given ID in the map's style has no outstanding network requests, otherwise `false`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#issourceloaded-parameters)

id`(string)`The
ID of the source to be checked.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#issourceloaded-returns)

`boolean`:
A Boolean indicating whether the source is loaded.


[Example](https://docs.maptiler.com/sdk-js/api/map/#issourceloaded-example)

```js
const sourceLoaded = map.isSourceLoaded('bathymetry-data');
```

JavaScript

Copy

isStyleLoaded()

Returns a Boolean indicating whether the map's style is fully loaded.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#isstyleloaded-returns)

`boolean`:
A Boolean indicating whether the style is fully loaded.


[Example](https://docs.maptiler.com/sdk-js/api/map/#isstyleloaded-example)

```js
const styleLoadStatus = map.isStyleLoaded();
```

JavaScript

Copy

isZooming()

Returns true if the map is zooming due to a camera animation or user gesture.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#iszooming-returns)

`boolean`:
True if the map is zooming.


[Example](https://docs.maptiler.com/sdk-js/api/map/#iszooming-example)

```js
const isZooming = map.isZooming();
```

JavaScript

Copy

jumpTo(options, eventData?)

Changes any combination of center, zoom, bearing, and pitch, without
an animated transition. The map will retain its current values for any
details not specified in `options`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#jumpto-parameters)

options`(JumpToOptions)`Options object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#jumpto-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#jumpto-example)

```js
// jump to coordinates at current zoom
map.jumpTo({center: [0, 0]});
// jump with zoom, pitch, and bearing options
map.jumpTo({
  center: [0, 0],
  zoom: 8,
  pitch: 45,
  bearing: 90
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#jumpto-related)

- [Jump to a series of\\
locations](https://docs.maptiler.com/sdk-js/examples/jump-to/)
- [Update a feature\\
in realtime](https://docs.maptiler.com/sdk-js/examples/live-update-feature/)

keyboard

The map's [KeyboardHandler](https://docs.maptiler.com/sdk-js/api/handlers/#keyboardhandler), which allows
the user to zoom, rotate, and pan the map using keyboard
shortcuts. Find more details and examples using `keyboard` in the [KeyboardHandler](https://docs.maptiler.com/sdk-js/api/handlers/#keyboardhandler) section.

listens(type)

Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the
specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#listens-parameters)

type`(string)`The
The event type.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#listens-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


listImages()

Returns an Array of strings containing the IDs of all images currently available in the map.
This includes both images from the style's original sprite
and any images that have been added at runtime using [Map#addImage](https://docs.maptiler.com/sdk-js/api/map/#map#addimage).


[Returns](https://docs.maptiler.com/sdk-js/api/map/#listimages-returns)

`Array<string>`:
An Array of strings containing the names of all sprites/images currently available in the map.


[Example](https://docs.maptiler.com/sdk-js/api/map/#listimages-example)

```js
const allImages = map.listImages();
```

JavaScript

Copy

loaded()

Returns a Boolean indicating whether the map is fully loaded.

Returns `false` if the style is not yet fully loaded,
or if there has been a change to the sources or style that
has not yet fully loaded.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#loaded-returns)

`boolean`:
A Boolean indicating whether the map is fully loaded.


loadImage(url)

Load an image from an external URL to be used with [Map#addImage](https://docs.maptiler.com/sdk-js/api/map/#map#addimage).
External
domains must support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#loadimage-parameters)

url`(string)`The
URL of the image file. Image file must be in png, webp, or jpg format.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#loadimage-returns)

`Promise<GetResourceResponse<ImageBitmap | HTMLImageElement>>`:
A promise that is resolved when the image is loaded.


[Example](https://docs.maptiler.com/sdk-js/api/map/#loadimage-example)

```js
const response = await map.loadImage('http://placekitten.com/50/50');
// Add the loaded image to the style's sprite with the ID 'kitten'.
map.addImage('kitten', response.data);
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#loadimage-related)

- [Add an icon to the map](https://docs.maptiler.com/sdk-js/examples/add-image/)

moveLayer(id, beforeId?)

Moves a layer to a different z-position.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#movelayer-parameters)

id`(string)`The
ID of the layer to move.


beforeId`(string?)`The
ID of an existing layer to insert the new layer before. When viewing the map, the
`id`
layer will appear beneath the
`beforeId`
layer. If
`beforeId`
is omitted, the layer will be appended to the end of the layers array and appear above all other layers on
the map.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#movelayer-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#movelayer-example)

```js
// Move a layer with ID 'polygon' before the layer with ID 'country-label'. The `polygon` layer will appear beneath the `country-label` layer on the map.
map.moveLayer('polygon', 'country-label');
```

JavaScript

Copy

off(type, layer, listener)

Removes an event listener for layer-specific events previously added with `Map#on`. See [Map Events](https://docs.maptiler.com/sdk-js/api/map/#map-events) for a full list of events
and their description.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#off-parameters)

type`(string)`The
event type previously used to install the listener.


layer`(string)`The
layer ID or listener previously used to install the listener.


listener`(Function)`The
function previously installed as a listener.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#off-returns)

`Map`: `this`

off(type, layerIds,
listener)

Overload of the `off` method that allows to listen to events specifying
multiple layers.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#off3-parameters)

type`(string)`The
event type previously used to install the listener.


layerIds`(string[])`The array of style layer IDs or listener previously used to install the listener.


listener`(Function)`The
function previously installed as a listener.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#off3-returns)

`Map`: `this`

off(type, listener)

Overload of the `off` method that allows to listen to events without
specifying a layer.

See [Map off method](https://docs.maptiler.com/sdk-js/api/map/#map#off) for parameters, returns, and other descriptions.

on(type, layer, listener)

Adds a listener for events of a specified type, optionally limited to features in a specified style
layer. See [Map Events](https://docs.maptiler.com/sdk-js/api/map/#map-events) for a full list of events and their description.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#on-parameters)

type`(string)`The
event type to listen for. Events compatible with the optional
`layerIds`
parameter are triggered
when the cursor enters a visible portion of the specified layer from outside that layer or outside the map
canvas.


layerIds`(string)`The
ID of a style layer. Event will only be triggered if its location
is within a visible feature in this layer. The event will have a
`features`
property containing
an array of the matching features. If
`layer`
is not supplied, the event will not have a
`features`
property.
Please note that many event types are not compatible with the optional
`layer`
parameter.


listener`(Function)`The
function to be called when the event is fired.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#on-returns)

[`Subscription`](https://docs.maptiler.com/sdk-js/api/types/#Subscription)

[Example](https://docs.maptiler.com/sdk-js/api/map/#on-example)

```js
// Set an event listener that will fire
// when the map has finished loading
map.on('load', function() {
  // Once the map has finished loading,
  // add a new layer
  map.addLayer({
    id: 'points-of-interest',
    source: {
      type: 'vector',
      url: '/gl-style-specification/'
    },
    'source-layer': 'poi_label',
    type: 'circle',
    paint: {
      // GL Style Specification paint properties
    },
    layout: {
      // GL Style Specification layout properties
    }
  });
});
```

JavaScript

Copy

```js
// Set an event listener that will fire
// when a feature on the countries layer of the map is clicked
map.on('click', 'countries', function(e) {
  new maptilersdk.Popup()
  .setLngLat(e.lngLat)
  .setHTML(`Country name: ${e.features[0].properties.name}`)
  .addTo(map);
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#on-related)

- [Display popup on\\
click](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)
- [Center the map on a\\
clicked symbol](https://docs.maptiler.com/sdk-js/examples/center-on-symbol/)
- [Create a hover effect](https://docs.maptiler.com/sdk-js/examples/hover-styles/)
- [Create a draggable\\
marker](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

on(type, layerIds, listener)

Overload of the `on` method that allows to listen to events specifying
multiple layers.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#on3-parameters)

type`(string)`The
event type to listen for. Events compatible with the optional
`layerIds`
parameter are triggered
when the cursor enters a visible portion of the specified layer from outside that layer or outside the map
canvas.


layerIds`(string[])`The array of style layer IDs. Event will only be triggered if its location
is within a visible feature in this layer. The event will have a
`features`
property containing
an array of the matching features. If
`layer`
is not supplied, the event will not have a
`features`
property.
Please note that many event types are not compatible with the optional
`layer`
parameter.


listener`(Function)`The
function to be called when the event is fired.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#on3-returns)

[`Subscription`](https://docs.maptiler.com/sdk-js/api/types/#Subscription)

[Example](https://docs.maptiler.com/sdk-js/api/map/#on3-example)

```js
// Set an event listener that will fire
// when a feature on the countries or states layers of the map is clicked
map.on('click', ['countries', 'states'], function(e) {
  new maptilersdk.Popup()
  .setLngLat(e.lngLat)
  .setHTML(`Country name: ${e.features[0].properties.name}`)
  .addTo(map);
});
```

JavaScript

Copy

on(type, listener)

Overload of the `on` method that allows to listen to events without
specifying a layer.

See [Map on method](https://docs.maptiler.com/sdk-js/api/map/#map#on) for parameters, returns, and other descriptions.

once(type, layer, listener)

Adds a listener that will be called only once to a specified event type occurring on features in a
specified style layer. See [Map Events](https://docs.maptiler.com/sdk-js/api/map/#map-events) for a full list of events and their
description.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#once-parameters)

type`(string)`The
event type to listen for; one of
`'mousedown'`
,
`'mouseup'`
,
`'click'`
,
`'dblclick'`
,

`'mousemove'`
,
`'mouseenter'`
,
`'mouseleave'`
,
`'mouseover'`
,
`'mouseout'`
,
`'contextmenu'`
,
`'touchstart'`
,

`'touchend'`
, or
`'touchcancel'`
.
`mouseenter`
and
`mouseover`
events are triggered when the cursor enters
a visible portion of the specified layer from outside that layer or outside the map canvas.
`mouseleave`

and
`mouseout`
events are triggered when the cursor leaves a visible portion of the specified layer, or leaves
the map canvas.


layer`(string)`The
ID of a style layer. Only events whose location is within a visible
feature in this layer will trigger the listener. The event will have a
`features`
property containing
an array of the matching features.


listener`(Function)`The
function to be called when the event is fired.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#once-returns)

`Map`:
`this`

once(type, layerIds,
listener)

Overload of the `once` method that allows to listen to events
specifying multiple layers.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#once3-parameters)

type`(string)`The
event type to listen for; one of
`'mousedown'`
,
`'mouseup'`
,
`'click'`
,
`'dblclick'`
,

`'mousemove'`
,
`'mouseenter'`
,
`'mouseleave'`
,
`'mouseover'`
,
`'mouseout'`
,
`'contextmenu'`
,
`'touchstart'`
,

`'touchend'`
, or
`'touchcancel'`
.
`mouseenter`
and
`mouseover`
events are triggered when the cursor enters
a visible portion of the specified layer from outside that layer or outside the map canvas.
`mouseleave`

and
`mouseout`
events are triggered when the cursor leaves a visible portion of the specified layer, or leaves
the map canvas.


layerIds`(string[])`The array of style layer IDs. Only events whose location is within a visible
feature in this layer will trigger the listener. The event will have a
`features`
property containing
an array of the matching features.


listener`(Function)`The
function to be called when the event is fired.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#once3-returns)

`Map`:
`this`

once(type, listener)

Overload of the `once` method that allows to listen to events without
specifying a layer.

See [Map once method](https://docs.maptiler.com/sdk-js/api/map/#map#once) for parameters, returns, and other descriptions.

onLoadAsync()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Awaits for the Map instance to be "loaded" and returns a Promise to the Map.

If the Map instance is already loaded, the Promise is resolved directly, otherwise, it is resolved as a
result of the "load" event.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#onLoadAsync-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#onLoadAsync-example)

```js
async function init() {

  const map = new Map({
    container,
    center: [2.34804, 48.85439], // Paris, France
    zoom: 14,
  });

  // We wait for the promise to resolve.
  // Once triggered, the rest of the init function runs
  await map.onLoadAsync();

  // Add a data sources, layers, etc
  map.addSource('my-gps-track-source', {
    type: "geojson",
    data: "https://example.com/some-gps-track.geojson",
  });
}
```

JavaScript

Copy

onLoadWithTerrainAsync()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Awaits for the Map instance to be "loaded" as well as with terrain being non-null for the first time and
returns a Promise to the Map.

If the Map instance is already loaded with terrain, the Promise is resolved directly, otherwise, it is
resolved as a result of the "loadWithTerrain" event.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#onLoadWithTerrainAsync-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#onLoadWithTerrainAsync-example)

```js
async function init() {

  const map = new Map({
    container,
    center: [2.34804, 48.85439], // Paris, France
    zoom: 14,
    terrain: true,
  });

  // We wait for the promise to resolve.
  // Once triggered, the rest of the init function runs
  await map.onLoadWithTerrainAsync();

  // make an animation
  map.flyTo({
    center: [-0.09956, 51.50509], // London, UK
    zoom: 12.5,
  })
}
```

JavaScript

Copy

onReadyAsync()![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Awaits for the Map instance to be "ready" and returns a Promise to the Map.

If the Map instance is already loaded, the Promise is resolved directly, otherwise, it is resolved as a
result of the "ready" event.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#onReadyAsync-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#onReadyAsync-example)

```js
async function init() {

  const map = new Map({
    container,
    center: [2.34804, 48.85439], // Paris, France
    zoom: 14,
  });

  // We wait for the promise to resolve.
  // Once triggered, the rest of the init function runs
  await map.onReadyAsync();

  // Add a data sources, layers, etc
  map.addSource('my-gps-track-source', {
    type: "geojson",
    data: "https://example.com/some-gps-track.geojson",
  });
}
```

JavaScript

Copy

panBy(offset, options?,
eventData?)

Pans the map by the specified offset.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#panby-parameters)

offset`(PointLike)``x`
and
`y`
coordinates by which to pan the map.


options`(AnimationOptions?)`Options
object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#panby-returns)

`Map`:
`this`

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#panby-related)

- [Navigate the map with\\
game-like controls](https://docs.maptiler.com/sdk-js/examples/game-controls/)

panTo(lnglat, options?,
eventData?)

Pans the map to the specified location with an animated transition.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#panto-parameters)

lnglat`(LngLatLike)`The
location to pan the map to.


options`(AnimationOptions?)`Options
describing the destination and animation of the transition.


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#panto-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#panto-example)

```js
map.panTo([-74, 38]);
```

JavaScript

Copy

```js
// Specify that the panTo animation should last 5000 milliseconds.
map.panTo([-74, 38], {duration: 5000});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#panto-related)

- [Update a feature\\
in realtime](https://docs.maptiler.com/sdk-js/examples/live-update-feature/)

project(lnglat)

Returns a [Point](https://github.com/mapbox/point-geometry) representing pixel coordinates,
relative to the map's `container`,
that correspond to the specified geographical location.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#project-parameters)

lnglat`(LngLatLike)`The
geographical location to project.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#project-returns)

`Point`:
The
[Point](https://github.com/mapbox/point-geometry)
corresponding to
`lnglat`
, relative to the map's
`container`
.


[Example](https://docs.maptiler.com/sdk-js/api/map/#project-example)

```js
const coordinate = [-122.420679, 37.772537];
const point = map.project(coordinate);
```

JavaScript

Copy

queryRenderedFeatures(geometry?,
options?)

Returns an array of MapGeoJSONFeature objects
representing visible features that satisfy the query parameters.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#queryrenderedfeatures-parameters)

geometry`((PointLike | Array<PointLike>)?)`The
geometry of the query region:
either a single point or southwest and northeast points describing a bounding box.
Omitting this parameter (i.e. calling
[Map#queryRenderedFeatures](https://docs.maptiler.com/sdk-js/api/map/#map#queryrenderedfeatures)
with zero arguments,
or with only a
`options`
argument) is equivalent to passing a bounding box encompassing the entire
map viewport.


options`(Object?)`Options
object.


| options.layers<br>[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) >? | An array of<br> [style layer IDs](https://docs.maptiler.com/gl-style-specification/#layer-id)<br> for the query to inspect.<br> Only features within these layers will be returned. If this parameter is undefined, all layers<br> will be checked. |
| options.filter<br>[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)? | A<br> [filter](https://docs.maptiler.com/gl-style-specification/layers/#filter)<br> to limit query results. |
| options.validate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | Whether to check if the \[options.filter\] conforms to the<br> MapLibre GL Style Specification. Disabling validation is a performance optimization that should<br> only be used if you have previously validated the values you will be passing to this function. |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#queryrenderedfeatures-returns)

`Array<MapGeoJSONFeature>`:
An array of MapGeoJSONFeature objects.

The `properties` value of each returned feature object contains
the properties of its source
feature. For GeoJSON sources, only
string and numeric property values are supported (i.e. `null`,
`Array`, and
`Object` values are not supported).


Each feature includes top-level `layer`, `source`, and `sourceLayer`
properties. The `layer` property is an object
representing the style layer to which the feature belongs. Layout and paint properties in this object
contain values
which are fully evaluated for the given zoom level and feature.

Only features that are currently rendered are included. Some features will **not** be
included, like:

- Features from layers whose `visibility` property is `"none"`.
- Features from layers whose zoom range excludes the current zoom level.
- Symbol features that have been hidden due to text or icon collision.

Features from all other layers are included, including features that may have no visible
contribution to the rendered result; for example, because the layer's opacity or color alpha component
is set to

The topmost rendered feature appears first in the returned array, and subsequent features are sorted by
descending z-order. Features that are rendered multiple times (due to wrapping across the antimeridian
at low
zoom levels) are returned only once (though subject to the following caveat).

Because features come from tiled vector data or GeoJSON data that is converted to tiles internally,
feature
geometries may be split or duplicated across tile boundaries and, as a result, features may appear
multiple
times in query results. For example, suppose there is a highway running through the bounding rectangle
of a query.
The results of the query will be those parts of the highway that lie within the map tiles covering the
bounding
rectangle, even if the highway extends into other tiles, and the portion of the highway within each map
tile
will be returned as a separate feature. Similarly, a point feature near a tile boundary may appear in
multiple
tiles due to tile buffering.

[Example](https://docs.maptiler.com/sdk-js/api/map/#queryrenderedfeatures-example)

```js
// Find all features at a point
const features = map.queryRenderedFeatures(
[20, 35],
{ layers: ['my-layer-name'] }
);
```

JavaScript

Copy

```js
// Find all features within a static bounding box
const features = map.queryRenderedFeatures(
[[10, 20], [30, 50]],
{ layers: ['my-layer-name'] }
);
```

JavaScript

Copy

```js
// Find all features within a bounding box around a point
const width = 10;
const height = 20;
const features = map.queryRenderedFeatures([\
  [point.x - width / 2, point.y - height / 2],\
  [point.x + width / 2, point.y + height / 2]\
], { layers: ['my-layer-name'] });
```

JavaScript

Copy

```js
// Query all rendered features from a single layer
const features = map.queryRenderedFeatures({ layers: ['my-layer-name'] });
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#queryrenderedfeatures-related)

- [Get features\\
under the mouse pointer](https://docs.maptiler.com/sdk-js/examples/queryrenderedfeatures/)

querySourceFeatures(sourceId,
parameters?)

Returns an array of MapGeoJSONFeature objects
representing features within the specified vector tile or GeoJSON source that satisfy the query
parameters.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#querysourcefeatures-parameters)

sourceId`(string)`The
ID of the vector tile or GeoJSON source to query.


parameters`(Object?)`Options
object.


| parameters.sourceLayer<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | The name of the source layer<br> to query.<br> _For vector tile sources, this parameter is required._<br> For GeoJSON sources, it is ignored. |
| parameters.filter<br>[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)? | A<br> [filter](https://docs.maptiler.com/gl-style-specification/layers/#filter)<br> to limit query results. |
| parameters.validate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | Whether to check if the \[parameters.filter\] conforms to<br> the MapLibre GL Style Specification. Disabling validation is a performance optimization that<br> should only be used if you have previously validated the values you will be passing to this<br> function. |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#querysourcefeatures-returns)

`Array<MapGeoJSONFeature>`:
An array of MapGeoJSONFeature objects.

In contrast to [Map#queryRenderedFeatures](https://docs.maptiler.com/sdk-js/api/map/#map#queryrenderedfeatures), this
function returns all features matching the query parameters,
whether or not they are rendered by the current style (i.e. visible). The domain of the query includes
all currently-loaded
vector tiles and GeoJSON source tiles: this function does not check tiles outside the currently
visible viewport.

Because features come from tiled vector data or GeoJSON data that is converted to tiles internally,
feature
geometries may be split or duplicated across tile boundaries and, as a result, features may appear
multiple
times in query results. For example, suppose there is a highway running through the bounding rectangle
of a query.
The results of the query will be those parts of the highway that lie within the map tiles covering the
bounding
rectangle, even if the highway extends into other tiles, and the portion of the highway within each map
tile
will be returned as a separate feature. Similarly, a point feature near a tile boundary may appear in
multiple
tiles due to tile buffering.

[Example](https://docs.maptiler.com/sdk-js/api/map/#querysourcefeatures-example)

```js
// Find all features in one source layer in a vector source
const features = map.querySourceFeatures('your-source-id', {
  sourceLayer: 'your-source-layer'
});
```

JavaScript

Copy

queryTerrainElevation(lngLatLike)

Get the elevation difference between a given point and a point that is currently in the
middle of the screen.
This method should be used for proper positioning of custom 3d objects.
Returns null if terrain is not enabled.
This method is subject to change in Maplibre GL JS v5.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#queryterrainelevation-parameters)

lngLatLike`(LngLatLike)`\[x,y\] or LngLat coordinates of the location.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#queryterrainelevation-returns)

`number`elevation offset in meters

[Example](https://docs.maptiler.com/sdk-js/api/map/#queryterrainelevation-example)

```js
const elevation = map.queryTerrainElevation([-122.420679, 37.772537]);
```

JavaScript

Copy

redraw()

Force a synchronous redraw of the map.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#redraw-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#redraw-example)

```js
map.redraw();
```

JavaScript

Copy

refreshTiles(sourceId,
tileIds?)

Triggers a reload of the selected tiles.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#refreshTiles-parameters)

sourceId`(string)`The ID of the source.

tileIds?`(object[])`An array of tile IDs to be reloaded. If not defined, all tiles will be reloaded.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#refreshTiles-returns)

`void`

[Example](https://docs.maptiler.com/sdk-js/api/map/#refreshTiles-example)

```js
map.refreshTiles('satellite', [{x:1024, y: 1023, z: 11}, {x:1023, y: 1023, z: 11}]);
```

JavaScript

Copy

remove()

Clean up and release all internal resources associated with this map.

This includes DOM elements, event bindings, web workers, and WebGL resources.

Use this method when you are done using the map and wish to ensure that it no
longer consumes browser resources. Afterwards, you must not call any other
methods on the map.

removeControl(control)

Removes the control from the map.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#removecontrol-parameters)

control`(IControl)`The
[IControl](https://docs.maptiler.com/sdk-js/api/controls/#icontrol)
to remove.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#removecontrol-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#removecontrol-example)

```js
// Define a new navigation control.
const navigation = new maptilersdk.NavigationControl();
// Add zoom and rotation controls to the map.
map.addControl(navigation);
// Remove zoom and rotation controls from the map.
map.removeControl(navigation);
```

JavaScript

Copy

removeFeatureState(target,
key)

Removes the `state` of a feature, setting it back to the default
behavior.
If only a `target.source` is specified, it will remove the state for
all features from that
source.
If `target.id` is also specified, it will remove all keys for that
feature's state.
If `key` is also specified, it removes only that key from that
feature's state.
Features are identified by their `feature.id` attribute, which can
be any number or string.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#removefeaturestate-parameters)

target`(Object)`Identifier
of where to remove state. It can be a source, a feature, or a specific key of feature.
Feature objects returned from
[Map#queryRenderedFeatures](https://docs.maptiler.com/sdk-js/api/map/#map#queryrenderedfeatures)
or event handlers can be used as feature identifiers.


| target.id<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>\| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)) | (optional) Unique id of the feature. Optional if key is<br> not specified. |
| target.source<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | The id of the vector or GeoJSON source for the feature. |
| target.sourceLayer<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | (optional)<br> _For vector tile sources, `sourceLayer` is_<br>_required._ |

key`(string)`(optional)
The key in the feature state to reset.


[Example](https://docs.maptiler.com/sdk-js/api/map/#removefeaturestate-example)

```js
// Reset the entire state object for all features
// in the `my-source` source
map.removeFeatureState({
  source: 'my-source'
});
```

JavaScript

Copy

```js
// When the mouse leaves the `my-layer` layer,
// reset the entire state object for the
// feature under the mouse
map.on('mouseleave', 'my-layer', function(e) {
  map.removeFeatureState({
    source: 'my-source',
    sourceLayer: 'my-source-layer',
    id: e.features[0].id
  });
});
```

JavaScript

Copy

```js
// When the mouse leaves the `my-layer` layer,
// reset only the `hover` key-value pair in the
// state for the feature under the mouse
map.on('mouseleave', 'my-layer', function(e) {
  map.removeFeatureState({
    source: 'my-source',
    sourceLayer: 'my-source-layer',
    id: e.features[0].id
  }, 'hover');
});
```

JavaScript

Copy

removeImage(id)

Remove an image from a style. This can be an image from the style's original
sprite or any images
that have been added at runtime using [Map#addImage](https://docs.maptiler.com/sdk-js/api/map/#map#addimage).

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#removeimage-parameters)

id`(string)`The
ID of the image.


[Example](https://docs.maptiler.com/sdk-js/api/map/#removeimage-example)

```js
// If an image with the ID 'cat' exists in
// the style's sprite, remove it.
if (map.hasImage('cat')) map.removeImage('cat');
```

JavaScript

Copy

removeLayer(id)

Removes the layer with the given ID from the map's style.

If no such layer exists, an `error` event is fired.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#removelayer-parameters)

id`(string)`id
of the layer to remove


[Example](https://docs.maptiler.com/sdk-js/api/map/#removelayer-example)

```js
// If a layer with ID 'state-data' exists, remove it.
if (map.getLayer('state-data')) map.removeLayer('state-data');
```

JavaScript

Copy

removeSource(id)

Removes a source from the map's style.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#removesource-parameters)

id`(string)`The
ID of the source to remove.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#removesource-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#removesource-example)

```js
map.removeSource('bathymetry-data');
```

JavaScript

Copy

removeSprite(id)

Removes the sprite from the map's style. Fires the `style` event.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#removesprite-parameters)

id`(string)`The
The ID of the sprite to remove. If the sprite is declared as a single URL, the ID must be "default".


[Returns](https://docs.maptiler.com/sdk-js/api/map/#removesprite-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#removesprite-example)

```js
map.removeSprite('sprite-two');
map.removeSprite('default');
```

JavaScript

Copy

repaint

Gets and sets a Boolean indicating whether the map will
continuously repaint. This information is useful for analyzing performance.

resetNorth(options?,
eventData?)

Rotates the map so that north is up (0° bearing), with an animated transition.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#resetnorth-parameters)

options`(AnimationOptions?)`Options
object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#resetnorth-returns)

`Map`: `this`

resetNorthPitch(options?,
eventData?)

Rotates and pitches the map so that north is up (0° bearing) and pitch is 0°, with an animated
transition.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#resetnorthpitch-parameters)

options`(AnimationOptions?)`Options
object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#resetnorthpitch-returns)

`Map`: `this`

resize(eventData?)

Resizes the map according to the dimensions of its
`container` element.


Checks if the map container size changed and updates the map if it has changed.
This method must be called after the map's `container` is resized
programmatically
or when the map is shown after being initially hidden with CSS.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#resize-parameters)

eventData`(any?)`Additional properties to be
passed to
`movestart`
,
`move`
,
`resize`
, and
`moveend`

events that get triggered as a result of resize. This can be useful for differentiating the
source of an event (for example, user-initiated or programmatically-triggered events).


[Returns](https://docs.maptiler.com/sdk-js/api/map/#resize-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#resize-example)

```js
// Resize the map when the map container is shown
// after being initially hidden with CSS.
const mapDiv = document.getElementById('map');
if (mapDiv.style.visibility === true) map.resize();
```

JavaScript

Copy

rotateTo(bearing, options?,
eventData?)

Rotates the map to the specified bearing, with an animated transition. The bearing is the compass
direction
that is "up"; for example, a bearing of 90° orients the map so that east is up.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#rotateto-parameters)

bearing`(number)`The
desired bearing.


options`(AnimationOptions?)`Options
object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#rotateto-returns)

`Map`: `this`

scrollZoom

The map's [ScrollZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#scrollzoomhandler), which
implements zooming in and out with a scroll wheel or trackpad.
Find more details and examples using `scrollZoom` in the [ScrollZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#scrollzoomhandler) section.

setBearing(bearing,
eventData?)

Sets the map's bearing (rotation). The bearing is the compass direction that is "up"; for example, a
bearing
of 90° orients the map so that east is up.

Equivalent to `jumpTo({bearing: bearing})`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setbearing-parameters)

bearing`(number)`The
desired bearing.


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setbearing-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setbearing-example)

```js
// rotate the map to 90 degrees
map.setBearing(90);
```

JavaScript

Copy

setCenter(center,
eventData?)

Sets the map's geographical centerpoint. Equivalent to `jumpTo({center: center})`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setcenter-parameters)

center`(LngLatLike)`The
centerpoint to set.


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setcenter-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setcenter-example)

```js
map.setCenter([-74, 38]);
```

JavaScript

Copy

setCenterClampedToGround(centerClampedToGround)

Sets the value of `centerClampedToGround`.

If true, the elevation of the center point will automatically be set to the terrain elevation (or zero if
terrain is not enabled). If false, the elevation of the center point will default to sea level and will not
automatically update. Defaults to true. Needs to be set to false to keep the camera above ground when pitch >
90 degrees.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setCenterClampedToGround-parameters)

centerClampedToGround`(boolean)`

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setCenterClampedToGround-returns)

`void`

setCenterElevation(elevation,
eventData?)

Sets the elevation of the map's center point, in meters above sea level.
Equivalent to `jumpTo({elevation: elevation})`.

Triggers the following events: `movestart` and `moveend`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setCenterElevation-parameters)

elevation`(number)`The elevation to set, in meters above sea level.


eventData`(any?)`Additional properties to be added to event objects of events
triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setCenterElevation-returns)

`Map`: `this`

setEventedParent(parent,
data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setEventedParent-parameters)

parent`(Evented?)`

data`(any?)`

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setEventedParent-returns)

`Map`: `this`

setFeatureState(feature,
state)

Sets the `state` of a feature.
A feature's `state` is a set of user-defined key-value pairs that
are assigned to a feature at
runtime.
When using this method, the `state` object is merged with any
existing key-value pairs in the
feature's state.
Features are identified by their `feature.id` attribute, which can
be any number or string.

This method can only be used with sources that have a `feature.id`
attribute. The
`feature.id` attribute can be defined in three ways:


- For vector or GeoJSON sources, including an `id` attribute in
the original data file.
- For vector or GeoJSON sources, using the [`promoteId`](https://docs.maptiler.com/gl-style-specification/sources/#vector-promoteId)
option at the time the source is defined.
- For GeoJSON sources, using the [`generateId`](https://docs.maptiler.com/gl-style-specification/sources/#geojson-generateId)
option to auto-assign an `id` based on the feature's index in the
source data. If you change
feature data using `map.getSource('some id').setData(..)`, you may
need to re-apply state
taking into account updated `id` values.

_Note: You can use the [`feature-state`\_\
_expression](https://docs.maptiler.com/gl-style-specification/expressions/#feature-state) to access the values in a feature's state object for the purposes of styling._

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setfeaturestate-parameters)

feature`(Object)`Feature
identifier. Feature objects returned from

[Map#queryRenderedFeatures](https://docs.maptiler.com/sdk-js/api/map/#map#queryrenderedfeatures)
or event handlers can be used as feature identifiers.


| feature.id<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>\| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)) | Unique id of the feature. |
| feature.source<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | The id of the vector or GeoJSON source for the feature. |
| feature.sourceLayer<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | (optional)<br> _For vector tile sources, `sourceLayer` is_<br>_required._ |

state`(Object)`A
set of key-value pairs. The values should be valid JSON types.


[Example](https://docs.maptiler.com/sdk-js/api/map/#setfeaturestate-example)

```js
// When the mouse moves over the `my-layer` layer, update
// the feature state for the feature under the mouse
map.on('mousemove', 'my-layer', function(e) {
  if (e.features.length &gt; 0) {
    map.setFeatureState({
      source: 'my-source',
      sourceLayer: 'my-source-layer',
      id: e.features[0].id,
    }, {
      hover: true
    });
  }
});
```

JavaScript

Copy

[Related\\
examples](https://docs.maptiler.com/sdk-js/api/map/#setfeaturestate-related)

- [Create a hover effect](https://docs.maptiler.com/sdk-js/examples/hover-styles/)

setFilter(layerId, filter, options =
{})

Sets the filter for the specified style layer.

Filters control which features a style layer renders from its source.
Any feature for which the filter expression evaluates to `true` will
be
rendered on the map. Those that are false will be hidden.

Use `setFilter` to show a subset of your source data.

To clear the filter, pass `null` or `undefined` as the second parameter.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setfilter-parameters)

layerId`(string)`The
ID of the layer to which the filter will be applied.


filter`((Array | null | undefined))`The
filter, conforming to the GL Style Specification's

[filter definition](https://docs.maptiler.com/gl-style-specification/layers/#filter)
. If
`null`
or
`undefined`
is provided, the function removes any existing filter from the layer.


options`(Object?)`(default
`{}`)Options object.


| options.validate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | Whether to check if the filter conforms to the MapLibre GL<br> Style Specification. Disabling validation is a performance optimization that should only be used<br> if you have previously validated the values you will be passing to this function. |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setfilter-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setfilter-example)

```js
// display only features with the 'name' property 'USA'
map.setFilter('my-layer', ['==', ['get', 'name'], 'USA']);
```

JavaScript

Copy

```js
// display only features with five or more 'available-spots'
map.setFilter('bike-docks', ['&gt;=', ['get', 'available-spots'], 5]);
```

JavaScript

Copy

```js
// remove the filter for the 'bike-docks' style layer
map.setFilter('bike-docks', null);
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#setfilter-related)

- [Create a timeline\\
animation](https://docs.maptiler.com/sdk-js/examples/timeline-animation/)

setGlobalStateProperty(propertyName,
value)

Sets a global state property that can be retrieved with the `global-state` expression.
If the value is null, it resets the property to its default value defined in the state style property.

Note that changing `global-state` values defined in layout properties
is not supported, and will be ignored.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setGlobalStateProperty-parameters)

propertyName`(string)`The name of the state property to set.

value`(any)`The value of the state property to set.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setGlobalStateProperty-returns)

`Map`: `this`

setGlyphs(glyphsUrl,
options?)

Sets the value of the style's glyphs property.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setglyphs-parameters)

glyphsUrl`(string)`
The Glyph URL to set. Must conform to the [GL Style Specification](https://docs.maptiler.com/gl-style-specification).


options`(StyleSetterOptions?)`The Options object.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setglyphs-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setglyphs-example)

```js
map.setGlyphs('https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf');
```

JavaScript

Copy

setHalo(halo)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Sets the halo (atmospheric glow) for the map.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#sethalo-parameters)

halo`(RadialGradientLayerConstructorOptions)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#sethalo-example)

```js
map.setHalo({
  scale: 2,
  stops: [\
    [0.0, "rgba(135,206,250,1)"],\
    [0.5, "rgba(0,0,250,0.75)"],\
    [0.75, "rgba(250,0,0,0.0)"],\
  ],
});
```

JavaScript

Copy

setLanguage(language)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Sets the map labels language.

Note: not all the languages shorthands provided are available.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setlanguage-parameters)

language`(string |
            Language)`The
language to be applied. The language generally depends on the style. Whenever a label is not supported in the
defined language, it falls back to `maptilersdk.Language.LATIN`.

Languages that are written right-to-left such as arabic and hebrew are fully supported by default. No need
to install any plugin!

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setlanguage-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setlanguage-example)

```js
//Use the Language object
map.setLanguage(Language.FRENCH);

map.setLanguage(Language.AUTO);

//Use the ISO code string
map.setLanguage("es");
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#setlanguage-related)

- [How to change the default map labels language](https://docs.maptiler.com/sdk-js/examples/language-map/)
- [How to change the map labels language based on visitor's\\
location](https://docs.maptiler.com/sdk-js/examples/ip-map-language/)
- [Change a map's language](https://docs.maptiler.com/sdk-js/examples/language-switch/)

setLayerZoomRange(layerId, minzoom,
maxzoom)

Sets the zoom extent for the specified style layer. The zoom extent includes the
[minimum zoom level](https://docs.maptiler.com/gl-style-specification/#layer-minzoom)
and [maximum zoom level](https://docs.maptiler.com/gl-style-specification/#layer-maxzoom))
at which the layer will be rendered.


Note: For style layers using vector sources, style layers cannot be rendered at zoom levels lower than
the
minimum zoom level of the _source layer_ because the data does not exist at those zoom levels. If
the minimum
zoom level of the source layer is higher than the minimum zoom level defined in the style layer, the style
layer will not be rendered at all zoom levels in the zoom range.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setlayerzoomrange-parameters)

layerId`(string)`The
ID of the layer to which the zoom extent will be applied.


minzoom`(number)`The
minimum zoom to set (0-24).


maxzoom`(number)`The
maximum zoom to set (0-24).


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setlayerzoomrange-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setlayerzoomrange-example)

```js
map.setLayerZoomRange('my-layer', 2, 5);
```

JavaScript

Copy

setLayoutProperty(layerId, name, value,
options = {})

Sets the value of a layout property in the specified style layer.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setlayoutproperty-parameters)

layerId`(string)`The
ID of the layer to set the layout property in.


name`(string)`The
name of the layout property to set.


value`(any)`The value of
the layout property. Must be of a type appropriate for the property, as defined in the
[GL Style Specification](https://docs.maptiler.com/gl-style-specification/)
.


options`(Object?)`(default
`{}`)Options object.


| options.validate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | Whether to check if<br> `value`<br> conforms to the MapLibre GL Style Specification. Disabling validation is a performance<br> optimization that should only be used if you have previously validated the values you will be<br> passing to this function. |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setlayoutproperty-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setlayoutproperty-example)

```js
map.setLayoutProperty('my-layer', 'visibility', 'none');
```

JavaScript

Copy

setLight(light, options =
{})

Sets the any combination of light values.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setlight-parameters)

light`(LightSpecification)`Light properties to
set. Must conform to the
[GL Style Specification](https://docs.maptiler.com/gl-style-specification/#light)
.


options`(Object?)`(default
`{}`)Options object.


| options.validate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | Whether to check if the filter conforms to the GL<br> Style Specification. Disabling validation is a performance optimization that should only be used<br> if you have previously validated the values you will be passing to this function. |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setlight-returns)

`Map`: `this`

setMaxBounds(bounds)

Sets or clears the map's geographical bounds.

Pan and zoom operations are constrained within these bounds.
If a pan or zoom is performed that would
display regions outside these bounds, the map will
instead display a position and zoom level
as close as possible to the operation's request while still
remaining within the bounds.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setmaxbounds-parameters)

bounds`((LngLatBoundsLike | null | undefined))`The
maximum bounds to set. If
`null`
or
`undefined`
is provided, the function removes the map's maximum bounds.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setmaxbounds-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setmaxbounds-example)

```js
// Define bounds that conform to the `LngLatBoundsLike` object.
const bounds = [\
  [-74.04728, 40.68392], // [west, south]\
  [-73.91058, 40.87764]  // [east, north]\
];
// Set the map's max bounds.
map.setMaxBounds(bounds);
```

JavaScript

Copy

setMaxPitch(maxPitch)

Sets or clears the map's maximum pitch.
If the map's current pitch is higher than the new maximum,
the map will pitch to the new maximum.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setmaxpitch-parameters)

maxPitch`((number | null | undefined))`The
maximum pitch to set (0-85). Values greater than 60 degrees are experimental and may result in rendering
issues. If you encounter any, please raise an issue with details in the MapLibre project.
If
`null`
or
`undefined`
is provided, the function removes the current maximum pitch (sets it to 60).


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setmaxpitch-returns)

`Map`: `this`

setMaxZoom(maxZoom)

Sets or clears the map's maximum zoom level.
If the map's current zoom level is higher than the new maximum,
the map will zoom to the new maximum.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setmaxzoom-parameters)

maxZoom`((number | null | undefined))`The
maximum zoom level to set.
If
`null`
or
`undefined`
is provided, the function removes the current maximum zoom (sets it to 22).


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setmaxzoom-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setmaxzoom-example)

```js
map.setMaxZoom(18.75);
```

JavaScript

Copy

setMinPitch(minPitch)

Sets or clears the map's minimum pitch.
If the map's current pitch is lower than the new minimum,
the map will pitch to the new minimum.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setminpitch-parameters)

minPitch`((number | null | undefined))`The
minimum pitch to set (0-85). Values greater than 60 degrees are experimental and may result in rendering
issues. If you encounter any, please raise an issue with details in the MapLibre project.
If
`null`
or
`undefined`
is provided, the function removes the current minimum pitch (i.e. sets it to 0).


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setminpitch-returns)

`Map`: `this`

setMinZoom(minZoom)

Sets or clears the map's minimum zoom level.
If the map's current zoom level is lower than the new minimum,
the map will zoom to the new minimum.

It is not always possible to zoom out and reach the set `minZoom`.
Other factors such as map height may restrict zooming. For example,
if the map is 512px tall it will not be possible to zoom below zoom 0
no matter what the `minZoom` is set to.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setminzoom-parameters)

minZoom`((number | null | undefined))`The
minimum zoom level to set (-2 - 24).
If
`null`
or
`undefined`
is provided, the function removes the current minimum zoom (i.e. sets it to -2).


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setminzoom-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setminzoom-example)

```js
map.setMinZoom(12.25);
```

JavaScript

Copy

setPadding(padding,
eventData?)

Sets the padding in pixels around the viewport.

Equivalent to `jumpTo({padding: padding})`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setpadding-parameters)

padding`(PaddingOptions)`The
desired padding. Format: { left: number, right: number, top: number, bottom: number }


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setpadding-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setpadding-example)

```js
// Sets a left padding of 300px, and a top padding of 50px
map.setPadding({ left: 300, top: 50 });
```

JavaScript

Copy

setPaintProperty(layerId, name, value,
options = {})

Sets the value of a paint property in the specified style layer.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setpaintproperty-parameters)

layerId`(string)`The
ID of the layer to set the paint property in.


name`(string)`The
name of the paint property to set.


value`(any)`The value of
the paint property to set.
Must be of a type appropriate for the property, as defined in the
[GL Style Specification](https://docs.maptiler.com/gl-style-specification/)
.


options`(Object?)`(default
`{}`)Options object.


| options.validate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | Whether to check if<br> `value`<br> conforms to the MapLibre GL Style Specification. Disabling validation is a performance<br> optimization that should only be used if you have previously validated the values you will be<br> passing to this function. |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setpaintproperty-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setpaintproperty-example)

```js
map.setPaintProperty('my-layer', 'fill-color', '#faafee');
```

JavaScript

Copy

[Related\\
examples](https://docs.maptiler.com/sdk-js/api/map/#setpaintproperty-related)

- [Change a layer's color\\
with buttons](https://docs.maptiler.com/sdk-js/examples/color-switcher/)
- [Create a draggable\\
point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

setPitch(pitch, eventData?)

Sets the map's pitch (tilt). Equivalent to `jumpTo({pitch: pitch})`.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setpitch-parameters)

pitch`(number)`The
pitch to set, measured in degrees away from the plane of the screen (0-60).


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setpitch-returns)

`Map`: `this`

setPixelRatio(pixelRatio)

Sets the map's pixel ratio. This allows to override `devicePixelRatio`.
After this call, the canvas' `width` attribute will be
`container.clientWidth * pixelRatio`
and its height attribute will be `container.clientHeight * pixelRatio`.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setpixelratio-parameters)

pixelRatio`(number)`The
pixel ratio.


setProjection(projection)

Sets the [ProjectionSpecification](https://docs.maptiler.com/gl-style-specification/projection)

Accepts types:


- `"mercator"` for [Web Mercator Projection](https://en.wikipedia.org/wiki/Web_Mercator_projection)
- `"vertical-perspective"` for [General Perspective projection](https://en.wikipedia.org/wiki/General_Perspective_projection)
- And preset `"globe"` for adaptive globe (interpolates from
vertical-perspective to mercator projection between zoom levels 10 and 12.)

projection [`(ProjectionSpecification?)`](https://docs.maptiler.com/gl-style-specification/projection)

This will set projection temporarly

This method will overwrite the `projection` settings from style (if any)
and will be overwriten when the style is updated. If you prefere that projection presist on style update use
MapTiler SDK specific method
[`map.enableMercatorProjection()`](https://docs.maptiler.com/sdk-js/api/map/#map#enableMercatorProjection) or [`map.enableGlobeProjection()`](https://docs.maptiler.com/sdk-js/api/map/#map#enableGlobeProjection)

[Example](https://docs.maptiler.com/sdk-js/api/map/#setProjection-example)

```js
map.setProjection({type:"mercator"}) // or  "globe" set one projection across all zoom levels;
map.setProjection({
    "type": [\
      "interpolate", //use linear interpolation between zoom levels ("make it smoooth")\
      ["linear"],\
      ["zoom"],\
      10,\
      "vertical-perspective", // till zoom level 10 use vertical-perspective\
      12,\
      "mercator" // between zoomlevel 10 and 12 use web mercator projection\
    ]
  }) // this is same as map.setProjection("globe");
   // Do you wounder why is this expression in this order? Read more about expresions https://docs.maptiler.com/gl-style-specification/expressions/

  map.setProjection({
  ["step", // on specific zoom levels (in this case zoom 11) switch projection\
  ["zoom"],\
    "vertical-perspective", //from vertical-perspective projection\
    11, "mercator"  // to mercator projection\
  ]})

  output at zoom 10.9: "vertical-perspective"
  output at zoom 11.0: "vertical-perspective"
  output at zoom 11.1: "mercator"
```

JavaScript

Copy

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setProjection-returns)

`Map`: `this`

setRenderWorldCopies(renderWorldCopies)

Sets the state of `renderWorldCopies`.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setrenderworldcopies-parameters)

renderWorldCopies`(boolean)`If
`true`
, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set
to
`false`
:


- When the map is zoomed out far enough that a single representation of the world does not fill the
map's entire
container, there will be blank space beyond 180 and -180 degrees longitude.
- Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right
edge of the
map and the other on the left edge of the map) at every zoom level.

`undefined` is treated as `true`, `null` is treated as
`false`.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setrenderworldcopies-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setrenderworldcopies-example)

```js
map.setRenderWorldCopies(true);
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#setrenderworldcopies-related)

- [Render world\\
copies](https://docs.maptiler.com/sdk-js/examples/render-world-copies/)

setRoll(roll, eventData?)

Sets the map's roll angle. Equivalent to `jumpTo({roll: roll})`.


Triggers the following events: `movestart`, `moveend`,
`rollstart`, and `rollend`.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setRoll-parameters)

roll`(number)`The roll to set, measured in degrees about the camera boresight

eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setRoll-returns)

`Map`: `this`

setSecondaryLanguage(language)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Sets the map labels secondary language.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setsecondarylanguage-parameters)

language`(string |
            Language)`The
language to be applied. The language generally depends on the style. Whenever a label is not supported in the
defined language, it falls back to `maptilersdk.Language.LATIN`.

Languages that are written right-to-left such as arabic and hebrew are fully supported by default. No need
to install any plugin!

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setsecondarylanguage-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setsecondarylanguage-example)

```js
map.setSecondaryLanguage(Language.JAPANESE);
```

JavaScript

Copy

setSky(sky, options?)

Sets the value of style's sky properties.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setSky-parameters)

sky[`(SkySpecification)`](https://docs.maptiler.com/gl-style-specification/sky/)Sky properties to set. Must conform to the [GL Style\\
Specification](https://docs.maptiler.com/gl-style-specification/sky/).

options [`(StyleSetterOptions?)`](https://docs.maptiler.com/sdk-js/api/types/#StyleSetterOptions) Options object.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setSky-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setSky-example)

```js
map.setSky({'atmosphere-blend': 1.0});
```

JavaScript

Copy

setSourceTileLodParams(maxZoomLevelsOnScreen, tileCountMaxMinRatio, sourceId?)

Change the tile Level of Detail behavior of the specified source.
These parameters have no effect when pitch == 0, and the largest effect when the horizon is visible on screen.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setSourceTileLodParams-parameters)

maxZoomLevelsOnScreen`(number)`The maximum number of distinct zoom levels allowed on screen at a time.
There will generally be fewer zoom levels on the screen,
the maximum can only be reached when the horizon is at the top of the screen.
Increasing the maximum number of zoom levels causes the zoom level to decay faster toward the horizon.

tileCountMaxMinRatio`(number)`The ratio of the maximum number of tiles loaded (at high pitch) to the minimum number of tiles loaded.
Increasing this ratio allows more tiles to be loaded at high pitch angles.
If the ratio would otherwise be exceeded,
the zoom level is reduced uniformly to keep the number of tiles within the limit.

sourceId?`(string)`The ID of the source to set tile LOD parameters for.
All sources will be updated if unspecified.
If sourceId is specified but a corresponding source does not exist, an error is thrown.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setSourceTileLodParams-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setSourceTileLodParams-example)

```js
map.setSourceTileLodParams(4.0, 3.0, 'terrain');
```

JavaScript

Copy

setSpace(space)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Sets the space for the map.

This method, at present, \*\*overwrites\*\* the current config.
If an option is not set it will internally revert to the default option unless explicitly set when calling.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setspace-parameters)

space`(CubemapLayerConstructorOptions)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setspace-example)

```js
map.setSpace({color: "red"});
```

JavaScript

Copy

setSprite(spriteUrl,
options?)

Sets the value of style's sky properties.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setSprite-parameters)

spriteUrl`(string)`Sprite URL to set.

options [`(StyleSetterOptions?)`](https://docs.maptiler.com/sdk-js/api/types/#StyleSetterOptions) Options object.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setSprite-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setSprite-example)

```js
map.setSprite('YOUR_SPRITE_URL');
```

JavaScript

Copy

setStyle(style, options?)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Updates the map's style object with a new value.

If a style is already set when this is used and options.diff is set to true, the map renderer will
attempt to compare the given style
against the map's current state and perform only the changes necessary to make the map style match the
desired state. Changes in sprites
(images used for icons and patterns) and glyphs (fonts for label text) **cannot** be diffed.
If the sprites or fonts used in the current
style and the given style are different in any way, the map renderer will force a full update, removing
the current style and building
the given one from scratch.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setstyle-parameters)

style`((ReferenceMapStyle |
            MapStyleVariant |
            string |
            StyleSpecification | null))`The map's style. This must be:


- ReferenceMapStyle (e.g. MapStyle.STREETS)
- MapStyleVariant (e.g. MapStyle.STREETS.DARK)
- MapTIler Style ID (e.g. “streets-v2”)
- uuid of custom style
- an a JSON object
conforming to
the schema described in the
[GL Style Specification](https://docs.maptiler.com/gl-style-specification/)
- a URL to
such JSON
- null

options`(Object?)`Options
object.


| options.diff<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | If false, force a 'full' update, removing the current<br> style<br> and building the given one instead of attempting a diff-based update. |
| options.transformStyle<br>[TransformStyleFunction](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/TransformStyleFunction/) | TransformStyleFunction is a convenience function that allows<br> to modify a style after it is fetched but before it is committed to the map state. |
| options.localIdeographFontFamily<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: 'sans-serif' | Defines a CSS<br> font-family for locally overriding generation of glyphs in the 'CJK Unified Ideographs',<br> 'Hiragana', 'Katakana' and 'Hangul Syllables' ranges.<br> In these ranges, font settings from the map's style will be ignored, except for font-weight<br> keywords (light/regular/medium/bold).<br> Set to<br> `false`<br> , to enable font settings from the map's style for these glyph ranges.<br> Forces a full update. |
| options.validate<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | If false, style validation will be skipped. Useful in<br> production environment. |

[Returns](https://docs.maptiler.com/sdk-js/api/map/#setstyle-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setstyle-example)

```js
map.setStyle(MapStyle.STREETS);
```

JavaScript

Copy

```js
map.setStyle(MapStyle.STREETS, {
  transformStyle: (previousStyle, nextStyle) => ({
    ...nextStyle,
    sources: {
      ...nextStyle.sources,
      // copy a source from previous style
      'osm': previousStyle.sources.osm
    },
    layers: [\
      // background layer\
      nextStyle.layers[0],\
      // copy a layer from previous style\
      previousStyle.layers[0],\
      // other layers from the next style\
      ...nextStyle.layers.slice(1).map(layer => {\
        // hide the layers we don't need from demotiles style\
        if (layer.id.startsWith('geolines')) {\
            layer.layout = {...layer.layout || {}, visibility: 'none'};\
        // filter out US polygons\
        } else if (layer.id.startsWith('coastline') || layer.id.startsWith('countries')) {\
            layer.filter = ['!=', ['get', 'ADM0_A3'], 'USA'];\
        }\
        return layer;\
      })\
    ]
  })
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#setstyle-related)

- [Built-in map styles](https://docs.maptiler.com/sdk-js/examples/built-in-styles/)
- [How to display a style switcher control](https://docs.maptiler.com/sdk-js/examples/control-style-switcher/)

setTerrain(options?)

Loads a 3D terrain mesh, based on a "raster-dem" source.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setterrain-parameters)

options`(TerrainSpecification?)`Options
object.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setterrain-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setterrain-example)

```js
map.setTerrain({ source: 'terrain' });
```

JavaScript

Copy

setTerrainAnimationDuration(duration)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Set the duration (millisec) of the terrain animation for growing or flattening.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setTerrainAnimationDuration-parameters)

duration`(number)`Sets the terrain animation duration in milliseconds


[Example](https://docs.maptiler.com/sdk-js/api/map/#setTerrainAnimationDuration-example)

```js
map.setTerrainAnimationDuration(500);
```

JavaScript

Copy

setTerrainExaggeration(exaggeration)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Sets the 3D terrain exageration factor. This method is just a shortcut to .enableTerrain


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setterrainexaggeration-parameters)

exaggeration`(number)`Sets the terrain exaggeration factor


[Example](https://docs.maptiler.com/sdk-js/api/map/#setterrainexaggeration-example)

```js
map.setTerrainExaggeration(1.5);
```

JavaScript

Copy

setTransformRequest(transformRequest)

Updates the requestManager's transform request with a new function

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#settransformrequest-parameters)

transformRequest`(RequestTransformFunction)`A
callback run before the Map makes a request for an external URL. The callback can be used to modify the
url, set headers, or set the credentials property for cross-origin requests.
Expected to return an object with a
`url`
property and optionally
`headers`
and
`credentials`
properties


[Returns](https://docs.maptiler.com/sdk-js/api/map/#settransformrequest-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#settransformrequest-example)

```js
map.setTransformRequest((url: string, resourceType: string) =&gt; {});
```

JavaScript

Copy

setVerticalFieldOfView(fov,
eventData?)

Sets the map's vertical field of view, in degrees. Default `36.87`.

Triggers the following events: `movestart`, `move`,
and `moveend`.

The internal camera has a default vertical field of view ( _[wikipedia](https://en.wikipedia.org/wiki/Field_of_view)_)
of a wide `~36.86` degrees.
In globe mode, such a large _FOV_ reduces the amount of the Earth that can be seen at once
and exaggerates the central part, comparably to a fisheye lens.
In many cases, a narrower _FOV_ is preferable.

FOV comparison:

| 01° | 50° |
| --- | --- |
| ![Globe FOV 01°](https://docs.maptiler.com/sdk-js/assets/fov_1.jpeg) | ![Globe FOV 50°](https://docs.maptiler.com/sdk-js/assets/fov_50.jpeg) |

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setVerticalFieldOfView-parameters)

fov`(number)`The vertical field of view to set, in degrees (0-180).

eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setVerticalFieldOfView-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setVerticalFieldOfView-example)

```js
map.setVerticalFieldOfView(30);
```

JavaScript

Copy

setZoom(zoom, eventData?)

Sets the map's zoom level. Equivalent to `jumpTo({zoom: zoom})`.


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#setzoom-parameters)

zoom`(number)`The
zoom level to set (0-20).


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#setzoom-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#setzoom-example)

```js
// Zoom to the zoom level 5 without an animated transition
map.setZoom(5);
```

JavaScript

Copy

showCollisionBoxes

Gets and sets a Boolean indicating whether the map will render boxes
around all symbols in the data source, revealing which symbols
were rendered or which were hidden due to collisions.
This information is useful for debugging.

showOverdrawInspector

Gets and sets a Boolean indicating whether the map should color-code each fragment
to show how many times it has been shaded.
White fragments have been shaded 8 or more times.
Black fragments have been shaded 0 times. This information is useful for debugging.

showPadding

Gets and sets a Boolean indicating whether the map will visualize
the padding offsets.

showTileBoundaries

Gets and sets a Boolean indicating whether the map will render an outline
around each tile and the tile ID. These tile boundaries are useful for
debugging.

The uncompressed file size of the first vector source is drawn in the top left
corner of each tile, next to the tile ID.

[Example](https://docs.maptiler.com/sdk-js/api/map/#showtileboundaries-example)

```js
map.showTileBoundaries = true;
```

JavaScript

Copy

snapToNorth(options?,
eventData?)

Snaps the map so that north is up (0° bearing), if the current bearing is close enough to it (i.e. within
the
`bearingSnap` threshold).


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#snaptonorth-parameters)

options`(AnimationOptions?)`Options
object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#snaptonorth-returns)

`Map`: `this`

stop()

Stops any animated transition underway.

[Returns](https://docs.maptiler.com/sdk-js/api/map/#stop-returns)

`Map`:
`this`

touchPitch

The map's [TouchPitchHandler](https://docs.maptiler.com/sdk-js/api/handlers/#touchpitchhandler), which
allows the user to pitch the map with touch gestures.
Find more details and examples using `touchPitch` in the [TouchPitchHandler](https://docs.maptiler.com/sdk-js/api/handlers/#touchpitchhandler) section.

touchZoomRotate

The map's [TouchZoomRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#touchzoomrotatehandler),
which allows the user to zoom or rotate the map with touch gestures.
Find more details and examples using `touchZoomRotate` in the [TouchZoomRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#touchzoomrotatehandler) section.

transformCameraUpdate

A callback ( [CameraUpdateTransformFunction](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/CameraUpdateTransformFunction/))
used to defer camera updates or apply arbitrary constraints.
If specified, this Camera instance can be used as a stateless component in React etc.

triggerRepaint()

Trigger the rendering of a single frame. Use this method with custom layers to
repaint the map when the layer changes. Calling this multiple times before the
next frame is rendered will still result in only a single frame being rendered.

[Example](https://docs.maptiler.com/sdk-js/api/map/#triggerrepaint-example)

```js
map.triggerRepaint();
```

JavaScript

Copy

[Related\\
examples](https://docs.maptiler.com/sdk-js/api/map/#triggerrepaint-related)

- [Add a 3D model](https://docs.maptiler.com/sdk-js/examples/add-3d-model/)
- [Add an animated\\
icon to the map](https://docs.maptiler.com/sdk-js/examples/add-image-animated/)

unproject(point)

Returns a [LngLat](https://docs.maptiler.com/sdk-js/api/geography/#lnglat) representing geographical
coordinates that correspond
to the specified pixel coordinates.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#unproject-parameters)

point`(PointLike)`The
pixel coordinates to unproject.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#unproject-returns)

`LngLat`:
The
[LngLat](https://docs.maptiler.com/sdk-js/api/geography/#lnglat)
corresponding to
`point`
.


[Example](https://docs.maptiler.com/sdk-js/api/map/#unproject-example)

```js
map.on('click', function(e) {
  // When the map is clicked, get the geographic coordinate.
  const coordinate = map.unproject(e.point);
});
```

JavaScript

Copy

updateImage(id, image)

Update an existing image in a style. This image can be displayed on the map like any other icon in the
style's
sprite using the image's ID with
[`icon-image`](https://docs.maptiler.com/gl-style-specification/#layout-symbol-icon-image),
[`background-pattern`](https://docs.maptiler.com/gl-style-specification/#paint-background-background-pattern),
[`fill-pattern`](https://docs.maptiler.com/gl-style-specification/#paint-fill-fill-pattern),
or [`line-pattern`](https://docs.maptiler.com/gl-style-specification/#paint-line-line-pattern).


[Parameters](https://docs.maptiler.com/sdk-js/api/map/#updateimage-parameters)

id`(string)`The
ID of the image.


image`((HTMLImageElement | ImageBitmap | ImageData | {width: number, height: number, data: (Uint8Array | Uint8ClampedArray)} | StyleImageInterface))`The
image as an
`HTMLImageElement`
,
`ImageData`
,
`ImageBitmap`
or object with
`width`
,
`height`
, and
`data`

properties with the same format as
`ImageData`
.


[Example](https://docs.maptiler.com/sdk-js/api/map/#updateimage-example)

```js
// If an image with the ID 'cat' already exists in the style's sprite,
// replace that image with a new image, 'other-cat-icon.png'.
if (map.hasImage('cat')) map.updateImage('cat', './other-cat-icon.png');
```

JavaScript

Copy

version

Returns the package version of the library

[Returns](https://docs.maptiler.com/sdk-js/api/map/#version-returns)

`string`:
Package version of the library


zoomIn(options?, eventData?)

Increases the map's zoom level by 1.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#zoomin-parameters)

options`(AnimationOptions?)`Options
object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#zoomin-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#zoomin-example)

```js
// zoom the map in one level with a custom animation duration
map.zoomIn({duration: 1000});
```

JavaScript

Copy

zoomOut(options?,
eventData?)

Decreases the map's zoom level by 1.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#zoomout-parameters)

options`(AnimationOptions?)`Options
object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#zoomout-returns)

`Map`: `this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#zoomout-example)

```js
// zoom the map out one level with a custom animation offset
map.zoomOut({offset: [80, 60]});
```

JavaScript

Copy

zoomTo(zoom, options?,
eventData?)

Zooms the map to the specified zoom level, with an animated transition.

[Parameters](https://docs.maptiler.com/sdk-js/api/map/#zoomto-parameters)

zoom`(number)`The
zoom level to transition to.


options`((AnimationOptions | null)?)`Options
object


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/map/#zoomto-returns)

`Map`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/map/#zoomto-example)

```js
// Zoom to the zoom level 5 without an animated transition
map.zoomTo(5);
// Zoom to the zoom level 8 with an animated transition
map.zoomTo(8, {
  duration: 2000,
  offset: [100, 50]
});
```

JavaScript

Copy

## [Events](https://docs.maptiler.com/sdk-js/api/map/\#map-events)

boxzoomcancel

Fired when the user cancels a "box zoom" interaction, or when the bounding box does not meet the minimum
size threshold.
See [BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#boxzoomcancel-properties)

data`(MapLibreZoomEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#boxzoomcancel-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// the user cancels a "box zoom" interaction.
map.on('boxzoomcancel', function() {
  console.log('A boxzoomcancel event occurred.');
});
```

JavaScript

Copy

boxzoomend

Fired when a "box zoom" interaction ends. See [BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#boxzoomend-properties)

data`(MapLibreZoomEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#boxzoomend-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just after a "box zoom" interaction ends.
map.on('boxzoomend', function() {
  console.log('A boxzoomend event occurred.');
});
```

JavaScript

Copy

boxzoomstart

Fired when a "box zoom" interaction starts. See [BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#boxzoomstart-properties)

data`(MapLibreZoomEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#boxzoomstart-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just before a "box zoom" interaction starts.
map.on('boxzoomstart', function() {
  console.log('A boxzoomstart event occurred.');
});
```

JavaScript

Copy

click

Fired when a pointing device (usually a mouse) is pressed and released at the same point on the map.

**Note:** This event is compatible with the optional `layerId` parameter.
If `layerId` is included as the second argument in [Map#on](https://docs.maptiler.com/sdk-js/api/map/#map#on), the event listener will fire only when the
point that is pressed and released contains a visible portion of the specifed layer.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#click-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#click-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener
map.on('click', function(e) {
  console.log('A click event has occurred at ' + e.lngLat);
});
```

JavaScript

Copy

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener for a specific layer
map.on('click', 'poi-label', function(e) {
  console.log('A click event has occurred on a visible portion of the poi-label layer at ' + e.lngLat);
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#click-related)

- [Measure distances](https://docs.maptiler.com/sdk-js/examples/measure/)
- [Center the map on a\\
clicked symbol](https://docs.maptiler.com/sdk-js/examples/center-on-symbol/)

contextmenu

Fired when the right button of the mouse is clicked or the context menu key is pressed within the map.


[Properties](https://docs.maptiler.com/sdk-js/api/map/#contextmenu-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#contextmenu-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the right mouse button is
// pressed within the map.
map.on('contextmenu', function() {
  console.log('A contextmenu event occurred.');
});
```

JavaScript

Copy

cooperativegestureprevented

Fired whenever the cooperativeGestures option prevents a gesture from being handled by the map.
This is useful for showing your own UI when this happens.


[Properties](https://docs.maptiler.com/sdk-js/api/map/#cooperativegestureprevented-properties)

data(`WheelEvent`
\| `TouchEvent`) &
`object`

[Type declaration](https://docs.maptiler.com/sdk-js/api/map/#cooperativegestureprevented-types)

gestureType(`"wheel_zoom"`
\| `"touch_pan"`)


[Example](https://docs.maptiler.com/sdk-js/api/map/#cooperativegestureprevented-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the right mouse button is
// pressed within the map.
map.on('cooperativegestureprevented', function() {
  console.log('A cooperativegestureprevented event occurred.');
});
```

JavaScript

Copy

data

Fired when any map data loads or changes. See [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent)
for more information.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#data-properties)

data`(MapDataEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#data-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when map data loads or changes.
map.on('data', function() {
  console.log('A data event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#data-related)

- [Display HTML clusters\\
with custom properties](https://docs.maptiler.com/sdk-js/examples/cluster-html/)

dataabort

Fired when a request for one of the map's sources' tiles is aborted.
Fired when a request for one of the map's sources' data is aborted.
See [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent) for more information.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#dataabort-properties)

data`(MapDataEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#dataabort-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a request for one of the map's sources' data is aborted.
map.on('dataabort', function() {
  console.log('A dataabort event occurred.');
});
```

JavaScript

Copy

dataloading

Fired when any map data (style, source, tile, etc) begins loading or
changing asyncronously. All `dataloading` events are followed by a
`data`,
`dataabort` or `error` event.
See [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent) for more information.


[Properties](https://docs.maptiler.com/sdk-js/api/map/#dataloading-properties)

data`(MapDataEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#dataloading-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when any map data begins loading
// or changing asynchronously.
map.on('dataloading', function() {
  console.log('A dataloading event occurred.');
});
```

JavaScript

Copy

dblclick

Fired when a pointing device (usually a mouse) is pressed and released twice at the same point on
the map in rapid succession.

**Note:** This event is compatible with the optional `layerId` parameter.
If `layerId` is included as the second argument in [Map#on](https://docs.maptiler.com/sdk-js/api/map/#map#on), the event listener will fire only
when the point that is clicked twice contains a visible portion of the specifed layer.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#dblclick-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#dblclick-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener
map.on('dblclick', function(e) {
  console.log('A dblclick event has occurred at ' + e.lngLat);
});
```

JavaScript

Copy

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener for a specific layer
map.on('dblclick', 'poi-label', function(e) {
  console.log('A dblclick event has occurred on a visible portion of the poi-label layer at ' + e.lngLat);
});
```

JavaScript

Copy

drag

Fired repeatedly during a "drag to pan" interaction. See [DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#drag-properties)

data`((MapMouseEvent | MapTouchEvent))`

[Example](https://docs.maptiler.com/sdk-js/api/map/#drag-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// repeatedly  during a "drag to pan" interaction.
map.on('drag', function() {
  console.log('A drag event occurred.');
});
```

JavaScript

Copy

dragend

Fired when a "drag to pan" interaction ends. See [DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#dragend-properties)

data`({originalEvent: DragEvent})`

[Example](https://docs.maptiler.com/sdk-js/api/map/#dragend-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a "drag to pan" interaction ends.
map.on('dragend', function() {
  console.log('A dragend event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#dragend-related)

- [Create a draggable\\
marker](https://docs.maptiler.com/sdk-js/examples/drag-a-marker/)

dragstart

Fired when a "drag to pan" interaction starts. See [DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#dragstart-properties)

data`({originalEvent: DragEvent})`

[Example](https://docs.maptiler.com/sdk-js/api/map/#dragstart-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a "drag to pan" interaction starts.
map.on('dragstart', function() {
  console.log('A dragstart event occurred.');
});
```

JavaScript

Copy

error

Fired when an error occurs. This is GL JS's primary error reporting
mechanism. We use an event instead of `throw` to better accommodate
asyncronous operations. If no listeners are bound to the `error`
event, the
error will be printed to the console.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#error-properties)

data`({error: {message: string}})`

[Example](https://docs.maptiler.com/sdk-js/api/map/#error-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when an error occurs.
map.on('error', function() {
  console.log('A error event occurred.');
});
```

JavaScript

Copy

idle

Fired after the last frame rendered before the map enters an
"idle" state:

- No camera transitions are in progress
- All currently requested tiles have loaded
- All fade/transition animations have completed

[Example](https://docs.maptiler.com/sdk-js/api/map/#idle-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just before the map enters an "idle" state.
map.on('idle', function() {
  console.log('A idle event occurred.');
});
```

JavaScript

Copy

load

Fired immediately after all necessary resources have been downloaded
and the first visually complete rendering of the map has occurred.

[Example](https://docs.maptiler.com/sdk-js/api/map/#load-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the map has finished loading.
map.on('load', function() {
  console.log('A load event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#load-related)

- [Draw GeoJSON\\
points](https://docs.maptiler.com/sdk-js/examples/geojson-markers/)
- [Add live realtime\\
data](https://docs.maptiler.com/sdk-js/examples/live-geojson/)
- [Animate a\\
point](https://docs.maptiler.com/sdk-js/examples/animate-point-along-line/)

loadWithTerrain
![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Fired only once in a `Map` instance lifecycle, when both the `load`
event and the `terrain` event with **non-null terrain** are fired.

[Example](https://docs.maptiler.com/sdk-js/api/map/#loadWithTerrain-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the map and the terrain has finished loading.
map.on("loadWithTerrain", (evt) => {
  console.log('A loadWithTerrain event occurred.');
});
```

JavaScript

Copy

mousedown

Fired when a pointing device (usually a mouse) is pressed within the map.

**Note:** This event is compatible with the optional `layerId` parameter.
If `layerId` is included as the second argument in [Map#on](https://docs.maptiler.com/sdk-js/api/map/#map#on), the event listener will fire only when the
the cursor is pressed while inside a visible portion of the specifed layer.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#mousedown-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#mousedown-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener
map.on('mousedown', function() {
  console.log('A mousedown event has occurred.');
});
```

JavaScript

Copy

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener for a specific layer
map.on('mousedown', 'poi-label', function() {
  console.log('A mousedown event has occurred on a visible portion of the poi-label layer.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#mousedown-related)

- [Create a draggable\\
point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

mouseenter

Fired when a pointing device (usually a mouse) enters a visible portion of a specified layer from
outside that layer or outside the map canvas.

**Important:** This event can only be listened for when [Map#on](https://docs.maptiler.com/sdk-js/api/map/#map#on) includes three arguments,
where the second argument specifies the desired layer.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#mouseenter-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#mouseenter-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener
map.on('mouseenter', 'Water', function() {
  console.log('A mouseenter event occurred on a visible portion of the water layer.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#mouseenter-related)

- [Center the map on a\\
clicked symbol](https://docs.maptiler.com/sdk-js/examples/center-on-symbol/)
- [Display a popup on\\
click](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)

mouseleave

Fired when a pointing device (usually a mouse) leaves a visible portion of a specified layer, or leaves
the map canvas.

**Important:** This event can only be listened for when [Map#on](https://docs.maptiler.com/sdk-js/api/map/#map#on) includes three arguements,
where the second argument specifies the desired layer.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#mouseleave-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#mouseleave-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the pointing device leaves
// a visible portion of the specified layer.
map.on('mouseleave', 'Water', function() {
  console.log('A mouseleave event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#mouseleave-related)

- [Highlight features under\\
the mouse pointer](https://docs.maptiler.com/sdk-js/examples/hover-styles/)
- [Display a popup on\\
click](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)

mousemove

Fired when a pointing device (usually a mouse) is moved while the cursor is inside the map.
As you move the cursor across the map, the event will fire every time the cursor changes position within
the map.

**Note:** This event is compatible with the optional `layerId` parameter.
If `layerId` is included as the second argument in [Map#on](https://docs.maptiler.com/sdk-js/api/map/#map#on), the event listener will fire only when the
the cursor is inside a visible portion of the specified layer.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#mousemove-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#mousemove-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener
map.on('mousemove', function() {
  console.log('A mousemove event has occurred.');
});
```

JavaScript

Copy

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener for a specific layer
map.on('mousemove', 'poi-label', function() {
  console.log('A mousemove event has occurred on a visible portion of the poi-label layer.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#mousemove-related)

- [Get coordinates of the\\
mouse pointer](https://docs.maptiler.com/sdk-js/examples/mouse-position/)
- [Highlight features under\\
the mouse pointer](https://docs.maptiler.com/sdk-js/examples/hover-styles/)
- [Display a popup on\\
over](https://docs.maptiler.com/sdk-js/examples/popup-on-hover/)

mouseout

Fired when a point device (usually a mouse) leaves the map's canvas.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#mouseout-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#mouseout-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the pointing device leave's
// the map's canvas.
map.on('mouseout', function() {
  console.log('A mouseout event occurred.');
});
```

JavaScript

Copy

mouseover

Fired when a pointing device (usually a mouse) is moved within the map.
As you move the cursor across a web page containing a map,
the event will fire each time it enters the map or any child elements.

**Note:** This event is compatible with the optional `layerId` parameter.
If `layerId` is included as the second argument in [Map#on](https://docs.maptiler.com/sdk-js/api/map/#map#on), the event listener will fire only when the
the cursor is moved inside a visible portion of the specifed layer.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#mouseover-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#mouseover-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener
map.on('mouseover', function() {
  console.log('A mouseover event has occurred.');
});
```

JavaScript

Copy

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener for a specific layer
map.on('mouseover', 'poi-label', function() {
  console.log('A mouseover event has occurred on a visible portion of the poi-label layer.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#mouseover-related)

- [Get coordinates of the\\
mouse pointer](https://docs.maptiler.com/sdk-js/examples/mouse-position/)
- [Highlight features under\\
the mouse pointer](https://docs.maptiler.com/sdk-js/examples/hover-styles/)
- [Display a popup on\\
hover](https://docs.maptiler.com/sdk-js/examples/popup-on-hover/)

mouseup

Fired when a pointing device (usually a mouse) is released within the map.

**Note:** This event is compatible with the optional `layerId` parameter.
If `layerId` is included as the second argument in [Map#on](https://docs.maptiler.com/sdk-js/api/map/#map#on), the event listener will fire only when the
the cursor is released while inside a visible portion of the specifed layer.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#mouseup-properties)

data`(MapMouseEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#mouseup-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener
map.on('mouseup', function() {
  console.log('A mouseup event has occurred.');
});
```

JavaScript

Copy

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener for a specific layer
map.on('mouseup', 'poi-label', function() {
  console.log('A mouseup event has occurred on a visible portion of the poi-label layer.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#mouseup-related)

- [Create a draggable\\
point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

move

Fired repeatedly during an animated transition from one view to
another, as the result of either user interaction or methods such as [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#move-properties)

data`((MapMouseEvent | MapTouchEvent))`

[Example](https://docs.maptiler.com/sdk-js/api/map/#move-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// repeatedly during an animated transition.
map.on('move', function() {
  console.log('A move event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#move-related)

- [Display HTML clusters\\
with custom properties](https://docs.maptiler.com/sdk-js/examples/cluster-html/)

moveend

Fired just after the map completes a transition from one
view to another, as the result of either user interaction or methods such as [Map#jumpTo](https://docs.maptiler.com/sdk-js/api/map/#map#jumpto).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#moveend-properties)

data`({originalEvent: DragEvent})`

[Example](https://docs.maptiler.com/sdk-js/api/map/#moveend-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just after the map completes a transition.
map.on('moveend', function() {
  console.log('A moveend event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#moveend-related)

- [Display HTML clusters\\
with custom properties](https://docs.maptiler.com/sdk-js/examples/cluster-html/)

movestart

Fired just before the map begins a transition from one
view to another, as the result of either user interaction or methods such as [Map#jumpTo](https://docs.maptiler.com/sdk-js/api/map/#map#jumpto).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#movestart-properties)

data`({originalEvent: DragEvent})`

[Example](https://docs.maptiler.com/sdk-js/api/map/#movestart-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just before the map begins a transition
// from one view to another.
map.on('movestart', function() {
  console.log('A movestart` event occurred.');
});
```

JavaScript

Copy

pitch

Fired repeatedly during the map's pitch (tilt) animation between
one state and another as the result of either user interaction
or methods such as [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#pitch-properties)

data`(MapEventData)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#pitch-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// repeatedly during a pitch (tilt) transition.
map.on('pitch', function() {
  console.log('A pitch event occurred.');
});
```

JavaScript

Copy

pitchend

Fired immediately after the map's pitch (tilt) finishes changing as
the result of either user interaction or methods such as [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto).


[Properties](https://docs.maptiler.com/sdk-js/api/map/#pitchend-properties)

data`(MapEventData)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#pitchend-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just after a pitch (tilt) transition ends.
map.on('pitchend', function() {
  console.log('A pitchend event occurred.');
});
```

JavaScript

Copy

pitchstart

Fired whenever the map's pitch (tilt) begins a change as
the result of either user interaction or methods such as [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto) .


[Properties](https://docs.maptiler.com/sdk-js/api/map/#pitchstart-properties)

data`(MapEventData)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#pitchstart-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just before a pitch (tilt) transition starts.
map.on('pitchstart', function() {
  console.log('A pitchstart event occurred.');
});
```

JavaScript

Copy

projectiontransition

Fired when map's projection is modified in other ways than by map being moved.


[Properties](https://docs.maptiler.com/sdk-js/api/map/#projectiontransition-properties)

data [`(MapProjectionEvent)`](https://docs.maptiler.com/sdk-js/api/events/#MapProjectionEvent)

[Example](https://docs.maptiler.com/sdk-js/api/map/#projectiontransition-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just before a pitch (tilt) transition starts.
map.on('projectiontransition', function() {
  console.log('A projectiontransition event occurred.');
});
```

JavaScript

Copy

ready
![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Called only once after `load` and wait for all the controls managed by
the Map constructor to be dealt with (as one relies on async logic).

Since the `ready` event waits that all the basic controls
are nicely positioned, it is **safer** to use `ready` than
`load` if you plan to add other custom comtrols with
the `.addControl()` method.


[Example](https://docs.maptiler.com/sdk-js/api/map/#ready-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the map has finished loading.
map.on('ready', function() {
  console.log('A ready event occurred.');
  const terrainControl = new maptilersdk.MaptilerTerrainControl();
  map.addControl(terrainControl);
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#ready-related)

- [Draw GeoJSON\\
points](https://docs.maptiler.com/sdk-js/examples/geojson-markers/)
- [Add live realtime\\
data](https://docs.maptiler.com/sdk-js/examples/live-geojson/)
- [Animate a\\
point](https://docs.maptiler.com/sdk-js/examples/animate-point-along-line/)

remove

Fired immediately after the map has been removed with [Map.event:remove](https://docs.maptiler.com/sdk-js/api/map/#map.event:remove).

[Example](https://docs.maptiler.com/sdk-js/api/map/#evt-remove-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just after the map is removed.
map.on('remove', function() {
  console.log('A remove event occurred.');
});
```

JavaScript

Copy

render

Fired whenever the map is drawn to the screen, as the result of

- a change to the map's position, zoom, pitch, or bearing
- a change to the map's style
- a change to a GeoJSON source
- the loading of a vector tile, GeoJSON file, glyph, or sprite

[Example](https://docs.maptiler.com/sdk-js/api/map/#render-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// whenever the map is drawn to the screen.
map.on('render', function() {
  console.log('A render event occurred.');
});
```

JavaScript

Copy

resize

Fired immediately after the map has been resized.

[Example](https://docs.maptiler.com/sdk-js/api/map/#evt-resize-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// immediately after the map has been resized.
map.on('resize', function() {
  console.log('A resize event occurred.');
});
```

JavaScript

Copy

rotate

Fired repeatedly during a "drag to rotate" interaction. See [DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#rotate-properties)

data`((MapMouseEvent | MapTouchEvent))`

[Example](https://docs.maptiler.com/sdk-js/api/map/#rotate-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// repeatedly during "drag to rotate" interaction.
map.on('rotate', function() {
  console.log('A rotate event occurred.');
});
```

JavaScript

Copy

rotateend

Fired when a "drag to rotate" interaction ends. See [DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#rotateend-properties)

data`((MapMouseEvent | MapTouchEvent))`

[Example](https://docs.maptiler.com/sdk-js/api/map/#rotateend-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just after a "drag to rotate" interaction ends.
map.on('rotateend', function() {
  console.log('A rotateend event occurred.');
});
```

JavaScript

Copy

rotatestart

Fired when a "drag to rotate" interaction starts. See [DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#rotatestart-properties)

data`((MapMouseEvent | MapTouchEvent))`

[Example](https://docs.maptiler.com/sdk-js/api/map/#rotatestart-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just before a "drag to rotate" interaction starts.
map.on('rotatestart', function() {
  console.log('A rotatestart event occurred.');
});
```

JavaScript

Copy

sourcedata

Fired when one of the map's sources loads or changes, including if a tile belonging
to a source loads or changes. See [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent)
for more information.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#sourcedata-properties)

data`(MapDataEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#sourcedata-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when one of the map's sources loads or changes.
map.on('sourcedata', function() {
  console.log('A sourcedata event occurred.');
});
```

JavaScript

Copy

sourcedataabort

Fired when a request for one of the map's sources' data is aborted.
See [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent) for more information.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#sourcedataabort-properties)

data`(MapDataEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#sourcedataabort-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a request for one of the map's sources' data is aborted.
map.on('sourcedataabort', function() {
  console.log('A sourcedataabort event occurred.');
});
```

JavaScript

Copy

sourcedataloading

Fired when one of the map's sources begins loading or changing asyncronously.
All `sourcedataloading` events are followed by a `sourcedata`,
`sourcedataabort` or `error`
event.
See [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent) for more information.


[Properties](https://docs.maptiler.com/sdk-js/api/map/#sourcedataloading-properties)

data`(MapDataEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#sourcedataloading-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// map's sources begin loading or
// changing asyncronously.
map.on('sourcedataloading', function() {
  console.log('A sourcedataloading event occurred.');
});
```

JavaScript

Copy

styledata

Fired when the map's style loads or changes. See
[MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent) for more information.


[Properties](https://docs.maptiler.com/sdk-js/api/map/#styledata-properties)

data`(MapDataEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#styledata-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the map's style loads or changes.
map.on('styledata', function() {
  console.log('A styledata event occurred.');
});
```

JavaScript

Copy

styledataloading

Fired when the map's style begins loading or changing asyncronously.
All `styledataloading` events are followed by a `styledata`
or `error` event. See [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent)
for more information.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#styledataloading-properties)

data`(MapDataEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#styledataloading-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// map's style begins loading or
// changing asyncronously.
map.on('styledataloading', function() {
  console.log('A styledataloading event occurred.');
});
```

JavaScript

Copy

styleimagemissing

Fired when an icon or pattern needed by the style is missing. The missing image can
be added with [Map#addImage](https://docs.maptiler.com/sdk-js/api/map/#map#addimage) within this event
listener callback to prevent the image from
being skipped. This event can be used to dynamically generate icons and patterns.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#styleimagemissing-properties)

id`(string)`:
The id of the missing image.


[Example](https://docs.maptiler.com/sdk-js/api/map/#styleimagemissing-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// an icon or pattern is missing.
map.on('styleimagemissing', function() {
  console.log('A styleimagemissing event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#styleimagemissing-related)

- [Generate\\
and add a missing icon to the map](https://docs.maptiler.com/sdk-js/examples/add-image-missing-generated/)

terrain

Fired when a `terrain`
event occurs within the map.

[Example](https://docs.maptiler.com/sdk-js/api/map/#terrain-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a terrain event occurs within the map.
map.on('terrain', function() {
  console.log('A terrain event occurred.');
});
```

JavaScript

Copy

terrainAnimationStart
![MapTiler logo](https://docs.maptiler.com/favicon.ico)

The `terrainAnimationStart` event is fired
when the animation begins transitioning between terrain and non-terrain states.


[Example](https://docs.maptiler.com/sdk-js/api/map/#terrainAnimationStart-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a terrain event occurs within the map.
map.on('terrainAnimationStart', function() {
  console.log("Terrain animation is starting...");
});
```

JavaScript

Copy

terrainAnimationStop
![MapTiler logo](https://docs.maptiler.com/favicon.ico)

The `terrainAnimationStop` event is fired
when the animation between terrain and non-terrain states ends.


[Example](https://docs.maptiler.com/sdk-js/api/map/#terrainAnimationStop-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a terrain event occurs within the map.
map.on('terrainAnimationStop', function() {
  console.log("Terrain animation is finished");
});
```

JavaScript

Copy

touchcancel

Fired when a [`touchcancel`](https://developer.mozilla.org/en-US/docs/Web/Events/touchcancel)
event occurs within the map.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#touchcancel-properties)

data`(MapTouchEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#touchcancel-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a touchcancel event occurs within the map.
map.on('touchcancel', function() {
  console.log('A touchcancel event occurred.');
});
```

JavaScript

Copy

touchend

Fired when a [`touchend`](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) event
occurs within the map.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#touchend-properties)

data`(MapTouchEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#touchend-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a touchstart event occurs within the map.
map.on('touchstart', function() {
  console.log('A touchstart event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#touchend-related)

- [Create a draggable\\
point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

touchmove

Fired when a [`touchmove`](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event
occurs within the map.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#touchmove-properties)

data`(MapTouchEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#touchmove-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a touchmove event occurs within the map.
map.on('touchmove', function() {
  console.log('A touchmove event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#touchmove-related)

- [Create a draggable\\
point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

touchstart

Fired when a [`touchstart`](https://developer.mozilla.org/en-US/docs/Web/Events/touchstart) event
occurs within the map.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#touchstart-properties)

data`(MapTouchEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#touchstart-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a touchstart event occurs within the map.
map.on('touchstart', function() {
  console.log('A touchstart event occurred.');
});
```

JavaScript

Copy

[Related examples](https://docs.maptiler.com/sdk-js/api/map/#touchstart-related)

- [Create a draggable\\
point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)

webglcontextlost

Fired when the WebGL context is lost.

The maps is rendered with WebGL, that leverages the GPU to provide high-performance graphics. In some cases, the host machine, operating system or the graphics driver, can decide that continuing to run such high performance graphics is unsustainable, and will abort the process. This is called a "WebGL context loss". Such situation happens when the ressources are running low or when multiple browser tabs are competing to access graphics memory.

[Example](https://docs.maptiler.com/sdk-js/api/map/#webglcontextlost-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the WebGL context is lost.
map.on('webglcontextlost', function() {
  console.log('A webglcontextlost event occurred.');
});
```

JavaScript

Copy

webglcontextrestored

Fired when the WebGL context is restored.

[Example](https://docs.maptiler.com/sdk-js/api/map/#webglcontextrestored-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when the WebGL context is restored.
map.on('webglcontextrestored', function() {
  console.log('A webglcontextrestored event occurred.');
});
```

JavaScript

Copy

wheel

Fired when a [`wheel`](https://developer.mozilla.org/en-US/docs/Web/Events/wheel)
event occurs within the map.

[Properties](https://docs.maptiler.com/sdk-js/api/map/#wheel-properties)

data`(MapWheelEvent)`

[Example](https://docs.maptiler.com/sdk-js/api/map/#wheel-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// when a wheel event occurs within the map.
map.on('wheel', function() {
  console.log('A wheel event occurred.');
});
```

JavaScript

Copy

zoom

Fired repeatedly during an animated transition from one zoom level to another,
as the result of either user interaction or methods such as [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#zoom-properties)

data`((MapMouseEvent | MapTouchEvent))`

[Example](https://docs.maptiler.com/sdk-js/api/map/#zoom-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// repeatedly during a zoom transition.
map.on('zoom', function() {
  console.log('A zoom event occurred.');
});
```

JavaScript

Copy

zoomend

Fired just after the map completes a transition from one zoom level to another,
as the result of either user interaction or methods such as [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#zoomend-properties)

data`((MapMouseEvent | MapTouchEvent))`

[Example](https://docs.maptiler.com/sdk-js/api/map/#zoomend-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just after a zoom transition finishes.
map.on('zoomend', function() {
  console.log('A zoomend event occurred.');
});
```

JavaScript

Copy

zoomstart

Fired just before the map begins a transition from one zoom level to another,
as the result of either user interaction or methods such as [Map#flyTo](https://docs.maptiler.com/sdk-js/api/map/#map#flyto).

[Properties](https://docs.maptiler.com/sdk-js/api/map/#zoomstart-properties)

data`((MapMouseEvent | MapTouchEvent))`

[Example](https://docs.maptiler.com/sdk-js/api/map/#zoomstart-example)

```js
// Initialize the map
const map = new maptilersdk.Map({ // map options });
// Set an event listener that fires
// just before a zoom transition starts.
map.on('zoomstart', function() {
  console.log('A zoomstart event occurred.');
});
```

JavaScript

Copy

## [Related examples](https://docs.maptiler.com/sdk-js/api/map/\#map-related)

- [Display a map](https://docs.maptiler.com/sdk-js/examples/add-map/)


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Parameters](https://docs.maptiler.com/sdk-js/api/map/#map-parameters)
- [Methods](https://docs.maptiler.com/sdk-js/api/map/#map-instance-members)
- [Events](https://docs.maptiler.com/sdk-js/api/map/#map-events)
- [Related examples](https://docs.maptiler.com/sdk-js/api/map/#map-related)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Map

Map

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)