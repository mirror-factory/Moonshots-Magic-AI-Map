# ImageViewer

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ImageViewer/ImageViewer.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/ImageViewer/ImageViewer.ts)

MapTiler's `ImageViewer` component allows you
to display tiled, non-georeferenced images but interact with them in almost the same
way you would if you were displaying map.
These can be handy for zoomable non-georeferenced,
geographically "inaccurate" maps such as hotel maps, golf courses, theme parks etc.
Think pixels instead of lattitudes and longtidues.

You create a `ImageViewer` by specifying a `container` and other options.
Then SDK JS initializes the viewer on the page and returns your `ImageViewer`
object.

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

Example

```js
import { ImageViewer } from '@maptiler/sdk';

const imageViewer = new ImageViewer({
  container: document.getElementById("map")!, // the container element you want to use
  imageUUID: "11111111-2222-3333-4444-555555555555", // unique UUID of the image object
  // ...other options, see below
});
```

JavaScript

Copy

## [Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/\#imageViewer-parameters)

options (ImageViewerConstructorOptions)

Options to provide to the ImageViewer constructor
([ImageViewerConstructorOptions](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/ImageViewer/ImageViewer.ts))



[Properties](https://docs.maptiler.com/sdk-js/api/image-viewer/#imageViewer-options)

| options.apiKey![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | Define the [MapTiler API key](https://cloud.maptiler.com/account/keys/) to be used. <br> This is equivalent to setting [`config.apiKey`](https://docs.maptiler.com/sdk-js/api/config/) and will overwrite it. |
| options.container<br>( [HTMLElement](https://developer.mozilla.org/docs/Web/HTML/Element) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | The HTML element in which SDK JS will render the viewer, or<br> the element's string<br> `id`. |
| options.imageUUID![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | The unique UUID of the image object you are displaying. |
| options.center<br>\[number, number\]?<br>default: the center of the image | The initial centerpoint in pixels of the viewer. |
| options.zoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The initial zoom level of the viewer. |
| options.bearing<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: `0` | The initial bearing (rotation) of the viewer, measured in degrees<br> counter-clockwise from north. |
| options.debug<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `false` | Whether to show tiles debug information. |
| options.fitToBoundsControl<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | Whether to show a control to fit the image to the viewport. |
| options.navigationControl<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: `true` | Whether to show a navigation control. |
| options.maxZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The maximum zoom level of the viewer. |
| options.minZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | The minimum zoom level of the viewer. |

## [Methods](https://docs.maptiler.com/sdk-js/api/image-viewer/\#imageViewer-instance-members)

`ImageViewer` provides a subset of methods for interaction with the map.
A major caveat is that the `ImageViewer` component works in pixels and not in LngLat.
Thus, when using methods such as `setCenter` or
`flyTo` the pixel values provided refer to
the **absolute pixel position** on the image, not screen pixel position.

Imagine your image is 10,000px x 10,000px, if regardless if your zoom is 2 or 4,
calling `.setCenter(500,500)` will always position the viewer over the same part of the image.

fitImageBounds(bounds)

Set the bounds of the image.


[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#fitImageBounds-parameters)

bounds`([[number, number],[number, number]])`The bounds of the image. The bounds are defined by topLeft and bottomRight corner.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#fitImageBounds-returns)

`ImageViewer`:
`this`

fitImageToViewport(options?)

Fits the image to the viewport.


[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#fitImageToViewport-parameters)

options`(object?)` Options describing the destination.


| options.ease<br>`boolean`? | Whether to ease to the viewport bounds.<br>Default `false` |

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#fitImageToViewport-returns)

`void`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#fitImageToViewport-example)

```js
// Fits the image to the viewport.
imageViewer.fitImageToViewport({ease: true});
```

JavaScript

Copy

flyTo(options, eventData?)

Fly to a given center.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#flyto-parameters)

options`(ImageViewerFlyToOptions)`Options describing the
destination.


| options.center<br>\[number, number\] | The given center. |

eventData`(MapDataEvent?)`The event data.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#flyto-returns)

`ImageViewer`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#flyto-example)

```js
imageViewer.flyTo({center: [300, 440]});
```

JavaScript

Copy

getBearing()

Get the bearing of the ImageViewer in degrees.

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#getbearing-returns)

`number`:
The viewer's current bearing.


getCanvas()

Get the canvas of the internal SDK instance.

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#getCanvas-returns)

`HTMLCanvasElement`:
The canvas of the internal SDK instance.

getCenter()

Get the center of the ImageViewer in pixels.

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#getcenter-returns)

`[number, number]`:
The center of the ImageViewer.

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#getcenter-example)

```js
// return a Array object such as [300,500]
const center = imageViewer.getCenter();
```

JavaScript

Copy

getImageBounds()

Get the visible bounds of the image in the viewport in imagePixels. \[topLeft, bottomRight\]

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#getImageBounds-returns)

`[[number, number], [number, number]]`:
The visible bounds of the image.

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#getImageBounds-example)

```js
// return a Array object such as [300,500]
const bounds = imageViewer.getImageBounds();
```

JavaScript

Copy

getImageMetadata()

Get the image metadata.

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#getImageMetadata-returns)

`ImageMetadata`:
The [image metadata](https://docs.maptiler.com/sdk-js/api/types/#ImageMetadata).

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#getImageMetadata-example)

```js
// return a Array object such as [300,500]
const metadata = imageViewer.getImageMetadata();
```

JavaScript

Copy

getZoom()

Returns the viewer's current zoom level.

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#getzoom-returns)

`number`:
The viewer's current zoom level.


[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#getzoom-example)

```js
imageViewer.getZoom();
```

JavaScript

Copy

jumpTo(options, eventData?)

Jump to a given center.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#jumpTo-parameters)

options`(ImageViewerJumpToOptions)`Options describing the
destination.


| options.center<br>\[number, number\] | The given center. |

eventData`(MapDataEvent?)`The event data.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#jumpTo-returns)

`ImageViewer`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#jumpTo-example)

```js
imageViewer.jumpTo({center: [300, 440]});
```

JavaScript

Copy

onReadyAsync()

Waits for the ImageViewer to be ready.

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#onReadyAsync-returns)

`Promise<void>`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#onReadyAsync-example)

```js
// Set an event listener that will fire
// when the viewer has finished loading
await imageViewer.onReadyAsync();
```

JavaScript

Copy

panBy(delta, options?,
eventData?)

Pan by a given delta in pixels.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#panby-parameters)

delta`(PointLike)`The delta to pan by.

options`(ImageViewerEaseToOptions?)`Options
object for the pan.


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#panby-returns)

`ImageViewer`:
`this`

panTo(center, options?,
eventData?)

Pan to a given center in pixels.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#panto-parameters)

center`([number, number])`The
location to pan the map to.


options`(ImageViewerEaseToOptions?)`The options for the pan.


eventData`(any?)`Additional properties to be
added to event objects of events triggered by this method.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#panto-returns)

`ImageViewer`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#panto-example)

```js
imageViewer.panTo([74, 38]);
```

JavaScript

Copy

pointIsWithinImageBounds(px)

Check if a given point is within the bounds of the image.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#pointIsWithinImageBounds-parameters)

px`([number, number])`The point to be evaluated.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#pointIsWithinImageBounds-returns)

`boolean`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#pointIsWithinImageBounds-example)

```js
const pointIsWithinImage = imageViewer.pointIsWithinImageBounds([74, 38]);
```

JavaScript

Copy

remove()

Destroys the ImageViewer, removes the map instance and all event listeners. Useful for cleanup.

[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#remove-returns)

`void`

setBearing(bearing)

Set the bearing of the ImageViewer in degrees..

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#setbearing-parameters)

bearing`(number)`The
desired bearing.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#setbearing-returns)

`ImageViewer`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#setbearing-example)

```js
// rotate the viewer to 90 degrees
imageViewer.setBearing(90);
```

JavaScript

Copy

setCenter(center)

Set the center of the ImageViewer in pixels.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#setcenter-parameters)

center`([number, number])`The
centerpoint to set.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#setcenter-returns)

`ImageViewer`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#setcenter-example)

```js
imageViewer.setCenter([74, 38]);
```

JavaScript

Copy

setZoom(zoom)

Sets the viewer's zoom level.


[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#setzoom-parameters)

zoom`(number)`The
zoom level to set.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#setzoom-returns)

`ImageViewer`:
`this`

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#setzoom-example)

```js
// Zoom to the zoom level 5
imageViewer.setZoom(5);
```

JavaScript

Copy

on(type, listener)

Adds a listener for events of a specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#on-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The function to be called when the event is `fired`.
The listener function is called with the data object passed to fire,
extended with `target` and
`type` properties.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#on-returns)

[`Subscription`](https://docs.maptiler.com/sdk-js/api/types/#Subscription)

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#on-example)

```js
// Set an event listener that will fire
// when the image has finished loading
imageViewer.on("imageviewerready", () => { console.log('Ready!') });
```

JavaScript

Copy

off(type, listener)

Removes a previously registered event listener.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#off-parameters)

type`(string)`The event type to remove listeners for.


listener`(Function)`The
function previously installed as a listener.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#off-returns)

`ImageViewer`: `this`

once(type, listener?)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

[Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#once-parameters)

type`(string)`The event type to listen for.

listener`(Function?)`The function to be called when the event is fired the first time.


[Returns](https://docs.maptiler.com/sdk-js/api/image-viewer/#once-returns)

`ImageViewer` \|
`Promise<any>`:
`this` or a promise if a listener is not provided


## [Events](https://docs.maptiler.com/sdk-js/api/image-viewer/\#imageViewer-events)

In a similar manner, a subset of map events are fired by the image viewer.
All UI interaction events that would normally include a `LngLat` in the
event data instead receive an `imageX`
and `imageY` field, representing an absolute pixel position of the image.
This is same for `flyTo`, `jumpTo`,
`panTo` etc.

A full list of supported events can be found in the exported type declaration
[`ImageViewerEventTypes`](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/ImageViewer/events.ts)

imageviewerinit


Called only once after the viewer is initialized.

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#imageviewerinit-example)

```js
import { ImageViewer } from '@maptiler/sdk';

const imageViewer = new ImageViewer({ // viewer options});

// Set an event listener that fires
// when the viewer has finished loading.
imageViewer.on('imageviewerinit', function() {
  console.log('A init event occurred.');
});
```

JavaScript

Copy

imageviewerready


Called only once after the viewer is ready.

[Example](https://docs.maptiler.com/sdk-js/api/image-viewer/#imageviewerready-example)

```js
import { ImageViewer } from '@maptiler/sdk';

const imageViewer = new ImageViewer({ // viewer options});

// Set an event listener that fires
// when the viewer has finished loading.
imageViewer.on('imageviewerready', function() {
  console.log('A ready event occurred.');
});
```

JavaScript

Copy

imagevieweriniterror

Fired when an error occurs.

[Properties](https://docs.maptiler.com/sdk-js/api/image-viewer/#error-properties)

data`({error: {message: string}})`

## [Related examples](https://docs.maptiler.com/sdk-js/api/image-viewer/\#imageViewer-related)

- [Display a tiled, non-georeferenced image](https://docs.maptiler.com/sdk-js/examples/image-viewer/)
- [Add markers to a non-georeferenced image](https://docs.maptiler.com/sdk-js/examples/image-viewer-marker/)


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Parameters](https://docs.maptiler.com/sdk-js/api/image-viewer/#imageViewer-parameters)
- [Methods](https://docs.maptiler.com/sdk-js/api/image-viewer/#imageViewer-instance-members)
- [Events](https://docs.maptiler.com/sdk-js/api/image-viewer/#imageViewer-events)
- [Related examples](https://docs.maptiler.com/sdk-js/api/image-viewer/#imageViewer-related)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


ImageViewer

ImageViewer

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)