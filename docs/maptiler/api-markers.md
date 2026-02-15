# Markers and popups

Elements that can be added to the map. The items in this section exist
outside of the map's
`canvas` element.


## [Marker](https://docs.maptiler.com/sdk-js/api/markers/\#marker)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/marker.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/marker.ts#L56-L685)

Creates a marker component

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).


### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#marker-example)

```js
const marker = new maptilersdk.Marker()
.setLngLat([30.5, 50.5])
.addTo(map);
```

JavaScript

Copy

```js
// Set options
const marker = new maptilersdk.Marker({
color: "#FFFFFF",
draggable: true
}).setLngLat([30.5, 50.5])
.addTo(map);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#marker-parameters)

options`(Object?)`

| options.anchor<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: 'center' | A string indicating the part of the Marker that should be<br> positioned closest to the coordinate set via<br> [Marker#setLngLat](https://docs.maptiler.com/sdk-js/api/markers/#marker#setlnglat)<br> . Options are<br> `'center'`<br> ,<br> `'top'`<br> ,<br> `'bottom'`<br> ,<br> `'left'`<br> ,<br> `'right'`<br> ,<br> `'top-left'`<br> ,<br> `'top-right'`<br> ,<br> `'bottom-left'`<br> , and<br> `'bottom-right'`<br> . |
| options.className<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | Space-separated CSS class names to add to marker element. |
| options.clickTolerance<br> <br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 0 | The max number of pixels a user can shift the mouse pointer<br> during a click on the marker for it to be considered a valid<br> click (as opposed to a marker drag). The default is to inherit<br> map's clickTolerance. |
| options.color<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: '#3FB1CE' | The color to use for the default marker if options.element is<br> not provided. The default is light blue. |
| options.draggable<br> <br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: false | A boolean indicating whether or not a marker is able to be<br> dragged to a new position on the map. |
| options.element<br> <br>[HTMLElement](https://developer.mozilla.org/docs/Web/HTML/Element) | DOM element to use as a marker. The default is a light blue,<br> droplet-shaped SVG marker. |
| options.offset<br> <br>[PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike) | The offset in pixels as a<br> [PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike)<br> object to apply relative to the element's center. Negatives<br> indicate left and up. |
| options.opacity<br> <br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | Marker's opacity when it's in clear view (not behind 3d terrain). <br> The default is `1` |
| options.opacityWhenCovered<br> <br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | Marker's opacity when it's behind 3d terrain. <br> The default is `0.2` |
| options.pitchAlignment<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: 'auto' | `map`<br> aligns the<br> `Marker`<br> to the plane of the map.<br> `viewport`<br> aligns the<br> `Marker`<br> to the plane of the viewport.<br> `auto`<br> automatically matches the value of<br> `rotationAlignment`<br> . |
| options.rotation<br> <br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 0 | The rotation angle of the marker in degrees, relative to its<br> respective<br> `rotationAlignment`<br> setting. A positive value will rotate the marker clockwise. |
| options.rotationAlignment<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: 'auto' | `map`<br> aligns the<br> `Marker`<br> 's rotation relative to the map, maintaining a bearing as the<br> map rotates.<br> `viewport`<br> aligns the<br> `Marker`<br> 's rotation relative to the viewport, agnostic to map<br> rotations.<br> `auto`<br> is equivalent to<br> `viewport`<br> . |
| options.scale<br> <br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 1 | The scale to use for the default marker if options.element is<br> not provided. The default scale corresponds to a height of<br> `41px`<br> and a width of<br> `27px`<br> . |

| options.subpixelPositioning<br> <br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: false | If `true`, rounding is disabled for placement of the marker, <br> allowing for subpixel positioning and smoother movement when the marker is translated. |

legacyOptions`(MarkerOptions?)`

### [Methods](https://docs.maptiler.com/sdk-js/api/markers/\#marker-instance-members)

addClassName(className)

Adds a CSS class to the marker element.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#addclassname-marker-parameters)

className`(string)`Non-empty string with CSS class name to add to marker element.


##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#addclassname-marker-example)

```js
const marker = new maptilersdk.Marker()
marker.addClassName('some-class');
```

JavaScript

Copy

addTo(map)

Attaches the `Marker` to a
`Map` object.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#addto-marker-parameters)

map`(Map)`The SDK JS map to add the marker to.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#addto-marker-returns)

`Marker`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#addto-marker-example)

```js
const marker = new maptilersdk.Marker()
.setLngLat([30.5, 50.5])
.addTo(map); // add the marker to the map
```

JavaScript

Copy

getElement()

Returns the `Marker`'s HTML
element.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getelement-marker-returns)

`HTMLElement`: element

getLngLat()

Get the marker's geographical location.

The longitude of the result may differ by a multiple of 360
degrees from the longitude previously set by
`setLngLat` because
`Marker` wraps the anchor
longitude across copies of the world to keep the marker on screen.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getlnglat-marker-returns)

`LngLat`:
A
[LngLat](https://docs.maptiler.com/sdk-js/api/geography/#lnglat)
describing the marker's location.


##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#getlnglat-marker-example)

```js
// Store the marker's longitude and latitude coordinates in a variable
const lngLat = marker.getLngLat();
// Print the marker's longitude and latitude values in the console
console.log('Longitude: ' + lngLat.lng + ', Latitude: ' + lngLat.lat )
```

JavaScript

Copy

##### [Related examples](https://docs.maptiler.com/sdk-js/api/markers/\#getlnglat-marker-related)

- [Create a draggable Marker](https://docs.maptiler.com/sdk-js/examples/drag-a-marker/)

getOffset()

Get the marker's offset.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getoffset-returns)

`Point`: The marker's screen coordinates in
pixels.

getPitchAlignment()

Returns the current
`pitchAlignment` property of
the marker.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getpitchalignment-returns)

`string`:
The current pitch alignment of the marker in degrees.


getPopup()

Returns the
[Popup](https://docs.maptiler.com/sdk-js/api/markers/#popup) instance that is
bound to the [Marker](https://docs.maptiler.com/sdk-js/api/markers/#marker).


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getpopup-returns)

`Popup`:
popup

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#getpopup-example)

```js
const marker = new maptilersdk.Marker()
.setLngLat([0, 0])
.setPopup(new maptilersdk.Popup().setHTML("&lt;h1&gt;Hello World!&lt;/h1&gt;"))
.addTo(map);

console.log(marker.getPopup()); // return the popup instance
```

JavaScript

Copy

getRotation()

Returns the current rotation angle of the marker (in degrees).


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getrotation-returns)

`number`: The current rotation angle of the marker.

getRotationAlignment()

Returns the current
`rotationAlignment` property
of the marker.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getrotationalignment-returns)

`string`:
The current rotational alignment of the marker.

isDraggable()

Returns true if the marker can be dragged

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#isdraggable-returns)

`boolean`: True if the marker is draggable.

listens(type)

Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/markers/#listens-marker-parameters)

type`(string)`The
The event type.


[Returns](https://docs.maptiler.com/sdk-js/api/markers/#listens-marker-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

[Parameters](https://docs.maptiler.com/sdk-js/api/markers/#off-marker-parameters)

type`(string)`The
event type previously used to install the listener.


listener`(Function)`The
function previously installed as a listener.


[Returns](https://docs.maptiler.com/sdk-js/api/markers/#off-marker-returns)

`Marker`: `this`

on(type, layer, listener)

Adds a listener for events of a specified type, optionally limited to features in a specified style
layer.

[Parameters](https://docs.maptiler.com/sdk-js/api/markers/#on-marker-parameters)

type`(string)`The event type to add a listen for.


listener`(Function)`The function to be called when the event is fired.
The listener function is called with the data object passed to `fire`,
extended with `target` and `type` properties


[Returns](https://docs.maptiler.com/sdk-js/api/markers/#on-marker-returns)

`Marker`: `this`

once(type, listener?)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

[Parameters](https://docs.maptiler.com/sdk-js/api/markers/#once-marker-parameters)

type`(string?)`The
event type to listen for.


listener`(Function)`The function to be called when the event is fired the first time.


[Returns](https://docs.maptiler.com/sdk-js/api/markers/#once-marker-returns)

`(Marker | Promise	<any> )`: `this` or a promise if a listener is not provided


remove()

Removes the marker from a map

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#remove-marker-returns)

`Marker`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#remove-marker-example)

```js
const marker = new maptilersdk.Marker().addTo(map);
marker.remove();
```

JavaScript

Copy

removeClassName(className)

Removes a CSS class from the marker element.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#removeclassname-marker-parameters)

className`(string)`Non-empty string with CSS class name to remove from marker element.


##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#removeclassname-marker-example)

```js
const marker = new maptilersdk.Marker()
marker.removeClassName('some-class');
```

JavaScript

Copy

setDraggable(shouldBeDraggable)

Sets the
`draggable` property and
functionality of the marker


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setdraggable-parameters)

shouldBeDraggable`(boolean)`(default `false`)Turns drag
functionality on/off

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setdraggable-returns)

`Marker`:
`this`

setLngLat(lnglat)

Set the marker's geographical position and move it.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setlnglat-marker-parameters)

lnglat`(LngLat)`A
[LngLat](https://docs.maptiler.com/sdk-js/api/geography/#lnglat)
describing where the marker should be located.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setlnglat-marker-returns)

`Marker`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#setlnglat-marker-example)

```js
// Create a new marker, set the longitude and latitude, and add it to the map
new maptilersdk.Marker()
.setLngLat([-65.017, -16.457])
.addTo(map);
```

JavaScript

Copy

##### [Related examples](https://docs.maptiler.com/sdk-js/api/markers/\#setlnglat-marker-related)

- [Add custom icons with Markers](https://docs.maptiler.com/sdk-js/examples/custom-marker-icons/)
- [Create a draggable Marker](https://docs.maptiler.com/sdk-js/examples/drag-a-marker/)

setOffset(offset)

Sets the offset of the marker

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setoffset-marker-parameters)

offset`(PointLike)`The offset in pixels as a
[PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike)
object to apply relative to the element's center. Negatives
indicate left and up.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setoffset-marker-returns)

`Marker`:
`this`

setPitchAlignment(alignment?)

Sets the
`pitchAlignment` property of
the marker.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setpitchalignment-parameters)

alignment`(string?)`Sets the
`pitchAlignment`
property of the marker. If alignment is 'auto', it will
automatically match
`rotationAlignment`
.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setpitchalignment-returns)

`Marker`:
`this`

setPopup(popup?)

Binds a [Popup](https://docs.maptiler.com/sdk-js/api/markers/#popup) to the
[Marker](https://docs.maptiler.com/sdk-js/api/markers/#marker).


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setpopup-parameters)

popup`((Popup | null)?)`An instance of the
[Popup](https://docs.maptiler.com/sdk-js/api/markers/#popup)
class. If undefined or null, any popup set on this
[Marker](https://docs.maptiler.com/sdk-js/api/markers/#marker)
instance is unset.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setpopup-returns)

`Marker`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#setpopup-example)

```js
const marker = new maptilersdk.Marker()
.setLngLat([0, 0])
.setPopup(new maptilersdk.Popup().setHTML("&lt;h1&gt;Hello World!&lt;/h1&gt;")) // add popup
.addTo(map);
```

JavaScript

Copy

##### [Related examples](https://docs.maptiler.com/sdk-js/api/markers/\#setpopup-related)

- [Attach a popup to a marker instance](https://docs.maptiler.com/sdk-js/examples/set-popup/)

setRotation(rotation)

Sets the `rotation` property
of the marker.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setrotation-parameters)

rotation`(number)`(default `0`)The rotation angle of the
marker (clockwise, in degrees),
relative to its respective
[Marker#setRotationAlignment](https://docs.maptiler.com/sdk-js/api/markers/#marker#setrotationalignment)
setting.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setrotation-returns)

`Marker`:
`this`

setRotationAlignment(alignment)

Sets the
`rotationAlignment` property
of the marker.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setrotationalignment-parameters)

alignment`(string)`(default `'auto'`)Sets the
`rotationAlignment`
property of the marker.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setrotationalignment-returns)

`Marker`:
`this`

toggleClassName(className)

Add or remove the given CSS class on the marker element, depending on whether the element currently has that class.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#toggleclassName-marker-parameters)

className`(string)`Non-empty string with CSS class name to add/remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#toggleclassName-marker-returns)

`boolean`:
if the class was removed return `false`,
if class was added, then return `true`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#toggleclassName-marker-example)

```js
const marker = new maptilersdk.Marker()
marker.toggleClassName('some-class');
```

JavaScript

Copy

togglePopup()

Opens or closes the
[Popup](https://docs.maptiler.com/sdk-js/api/markers/#popup) instance that is
bound to the [Marker](https://docs.maptiler.com/sdk-js/api/markers/#marker),
depending on the current state of the
[Popup](https://docs.maptiler.com/sdk-js/api/markers/#popup).


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#togglepopup-returns)

`Marker`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#togglepopup-example)

```js
const marker = new maptilersdk.Marker()
.setLngLat([0, 0])
.setPopup(new maptilersdk.Popup().setHTML("&lt;h1&gt;Hello World!&lt;/h1&gt;"))
.addTo(map);

marker.togglePopup(); // toggle popup open or closed
```

JavaScript

Copy

### [Events](https://docs.maptiler.com/sdk-js/api/markers/\#marker-events)

drag

Fired while dragging

##### [Properties](https://docs.maptiler.com/sdk-js/api/markers/\#drag-properties)

marker`(Marker)`: object that is being dragged

dragend

Fired when the marker is finished being dragged

##### [Properties](https://docs.maptiler.com/sdk-js/api/markers/\#dragend-properties)

marker`(Marker)`: object that was dragged

dragstart

Fired when dragging starts

##### [Properties](https://docs.maptiler.com/sdk-js/api/markers/\#dragstart-properties)

marker`(Marker)`: object that is being dragged

### [Related examples](https://docs.maptiler.com/sdk-js/api/markers/\#marker-related)

- [Add custom icons with Markers](https://docs.maptiler.com/sdk-js/examples/custom-marker-icons/)
- [Create a draggable Marker](https://docs.maptiler.com/sdk-js/examples/drag-a-marker/)

## [ImageViewerMarker](https://docs.maptiler.com/sdk-js/api/markers/\#imageViewerMarker)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ImageViewer/ImageViewerMarker.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/ImageViewer/ImageViewerMarker.ts)

Creates a ImageViewerMarker component.
This is, for all intents and purposes, the same as `Marker`
with the exception of **working in image pixels**, not _lat/lon_.
It composes the the internal logic of the Marker class so the behaviour should be exactly the same.

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).


### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#imageViewerMarker-example)

```js
const marker = new maptilersdk.ImageViewerMarker({})
.setPosition([10, 20])
.addTo(imageViewer);
```

JavaScript

Copy

```js
// Set options
const marker = new maptilersdk.ImageViewerMarker({
color: "#FFFFFF",
draggable: true
}).setPosition([30.5, 50.5])
.addTo(imageViewer);
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/markers/\#imageViewerMarker-instance-members)

Lists the methods that are different or exclusive to the `ImageViewerMarker` class.
For the complete list of methods, check out [Marker.Methods](https://docs.maptiler.com/sdk-js/api/markers/#marker-instance-members)

addTo(viewer)

Attaches the `ImageViewerMarker` to a
`ImageViewer` instance.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#addTo-imageViewerMarker-parameters)

viewer`(ImageViewer)`The SDK JS imageViewer to add the marker to.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#addTo-imageViewerMarker-returns)

` ImageViewerMarker`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#addTo-imageViewerMarker-example)

```js
const marker = new maptilersdk.ImageViewerMarker()
.setPosition([30.5, 50.5])
.addTo(imageViewer); // add the marker to the imageViewer
```

JavaScript

Copy

getPosition()

Gets the position of the ImageViewerMarker.
This is the equivalent of the `getLngLat` function
of the markers on the map

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getPosition-imageViewerMarker-returns)

`PointLike`:
A Point or an array \[number, number\] of two numbers representing x and y screen coordinates in pixels.


##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#getPosition-imageViewerMarker-example)

```js
const position = marker.getPosition();
```

JavaScript

Copy

setPosition(px)

Sets the position of the ImageViewerMarker.
This is the equivalent of the `setLngLat` function
of the markers on the map

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setPosition-imageViewerMarker-parameters)

px`([number, number])`The position of the ImageViewerMarker in image pixels.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setPosition-imageViewerMarker-returns)

`ImageViewerMarker`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#setPosition-imageViewerMarker-example)

```js
// Create a new marker, set the position, and add it to the imageViewer
new maptilersdk.ImageViewerMarker()
.setPosition([-65.017, -16.457])
.addTo(imageViewer);
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/markers/\#imageViewerMarker-related)

- [Add markers to a non-georeferenced image](https://docs.maptiler.com/sdk-js/examples/image-viewer-marker/)

## [Popup](https://docs.maptiler.com/sdk-js/api/markers/\#popup)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/popup.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/popup.ts#L99-L590)

A popup component.

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).


### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#popup-example)

```js
const markerHeight = 50, markerRadius = 10, linearOffset = 25;
const popupOffsets = {
'top': [0, 0],
'top-left': [0,0],
'top-right': [0,0],
'bottom': [0, -markerHeight],
'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
'left': [markerRadius, (markerHeight - markerRadius) * -1],
'right': [-markerRadius, (markerHeight - markerRadius) * -1]
};
const popup = new maptilersdk.Popup({offset: popupOffsets, className: 'my-class'})
.setLngLat(e.lngLat)
.setHTML("&lt;h1&gt;Hello World!&lt;/h1&gt;")
.setMaxWidth("300px")
.addTo(map);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#popup-parameters)

options`(Object?)`

| options.closeButton<br> <br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | If<br> `true`<br> , a close button will appear in the top right corner of the<br> popup. |
| options.closeOnClick<br> <br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | If<br> `true`<br> , the popup will closed when the map is clicked. |
| options.closeOnMove<br> <br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: false | If<br> `true`<br> , the popup will closed when the map moves. |
| options.focusAfterOpen<br> <br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | If<br> `true`<br> , the popup will try to focus the first focusable element<br> inside the popup. |
| options.anchor<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | A string indicating the part of the Popup that should be<br> positioned closest to the coordinate set via<br> [Popup#setLngLat](https://docs.maptiler.com/sdk-js/api/markers/#popup#setlnglat)<br> . Options are<br> `'center'`<br> ,<br> `'top'`<br> ,<br> `'bottom'`<br> ,<br> `'left'`<br> ,<br> `'right'`<br> ,<br> `'top-left'`<br> ,<br> `'top-right'`<br> ,<br> `'bottom-left'`<br> , and<br> `'bottom-right'`<br> . If unset the anchor will be dynamically set to ensure the<br> popup falls within the map container with a preference for<br> `'bottom'`<br> . |
| options.offset<br> <br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>\| [PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike) \|<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))? | A pixel offset applied to the popup's location specified as:<br> <br>- a single number specifying a distance from the popup's<br>   location<br>   <br>- a<br>   [PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike)<br>   specifying a constant offset<br>   <br>- an object of<br>   [Point](https://docs.maptiler.com/sdk-js/api/geography/#point) s<br>   specifing an offset for each anchor position Negative<br>   offsets indicate left and up. |
| options.className<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | Space-separated CSS class names to add to popup container |
| options.maxWidth<br> <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: '240px' | A string that sets the CSS property of the popup's maximum<br> width, eg<br> `'300px'`<br> . To ensure the popup resizes to fit its content, set this<br> property to<br> `'none'`<br> . Available values can be found here:<br> [https://developer.mozilla.org/en-US/docs/Web/CSS/max-width](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width) |

### [Methods](https://docs.maptiler.com/sdk-js/api/markers/\#popup-instance-members)

addClassName(className)

Adds a CSS class to the popup container element.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#addclassname-parameters)

className`(string)`Non-empty string with CSS class name to add to popup container


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#addclassname-returns)

`Popup`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#addclassname-example)

```js
let popup = new maptilersdk.Popup()
popup.addClassName('some-class')
```

JavaScript

Copy

addTo(map)

Adds the popup to a map.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#addto-parameters)

map`(Map)`The SDK JS map to add the popup to.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#addto-returns)

`Popup`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#addto-example)

```js
new maptilersdk.Popup()
.setLngLat([0, 0])
.setHTML("&lt;h1&gt;Null Island&lt;/h1&gt;")
.addTo(map);
```

JavaScript

Copy

##### [Related examples](https://docs.maptiler.com/sdk-js/api/markers/\#addto-related)

- [Display a popup](https://docs.maptiler.com/sdk-js/examples/popup/)
- [Display a popup on hover](https://docs.maptiler.com/sdk-js/examples/popup-on-hover/)
- [Display a popup on click](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)
- [Show polygon information on click](https://docs.maptiler.com/sdk-js/examples/polygon-popup-on-click/)

getElement()

Returns the `Popup`'s HTML
element.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getelement-returns)

`HTMLElement`: element

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#getelement-example)

```js
// Change the `Popup` element's font size
const popup = new maptilersdk.Popup()
.setLngLat([-96, 37.8])
.setHTML("&lt;p&gt;Hello World!&lt;/p&gt;")
.addTo(map);
const popupElem = popup.getElement();
popupElem.style.fontSize = "25px";
```

JavaScript

Copy

getLngLat()

Returns the geographical location of the popup's anchor.

The longitude of the result may differ by a multiple of 360
degrees from the longitude previously set by
`setLngLat` because
`Popup` wraps the anchor
longitude across copies of the world to keep the popup on screen.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getlnglat-returns)

`LngLat`:
The geographical location of the popup's anchor.

getMaxWidth()

Returns the popup's maximum width.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#getmaxwidth-returns)

`string`: The maximum width of the popup.

isOpen()

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#isopen-returns)

`boolean`:
`true`
if the popup is open,
`false`
if it is closed.


listens(type)

Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/markers/#listens-parameters)

type`(string)`The
The event type.


[Returns](https://docs.maptiler.com/sdk-js/api/markers/#listens-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

[Parameters](https://docs.maptiler.com/sdk-js/api/markers/#off-parameters)

type`(string)`The
event type previously used to install the listener.


listener`(Function)`The
function previously installed as a listener.


[Returns](https://docs.maptiler.com/sdk-js/api/markers/#off-returns)

`Popup`: `this`

on(type, layer, listener)

Adds a listener for events of a specified type, optionally limited to features in a specified style
layer.

[Parameters](https://docs.maptiler.com/sdk-js/api/markers/#on-parameters)

type`(string)`The event type to add a listen for.


listener`(Function)`The function to be called when the event is fired.
The listener function is called with the data object passed to `fire`,
extended with `target` and `type` properties


[Returns](https://docs.maptiler.com/sdk-js/api/markers/#on-returns)

`Popup`: `this`

once(type, listener?)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

[Parameters](https://docs.maptiler.com/sdk-js/api/markers/#once-parameters)

type`(string?)`The
event type to listen for.


listener`(Function)`The function to be called when the event is fired the first time.


[Returns](https://docs.maptiler.com/sdk-js/api/markers/#once-returns)

`(Popup | Promise	<any> )`: `this` or a promise if a listener is not provided


remove()

Removes the popup from the map it has been added to.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#remove-returns)

`Popup`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#remove-example)

```js
const popup = new maptilersdk.Popup().addTo(map);
popup.remove();
```

JavaScript

Copy

removeClassName(className)

Removes a CSS class from the popup container element.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#removeclassname-parameters)

className`(string)`Non-empty string with CSS class name to remove from popup
container


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#removeclassname-returns)

`Popup`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#removeclassname-example)

```js
let popup = new maptilersdk.Popup()
popup.removeClassName('some-class')
```

JavaScript

Copy

setDOMContent(htmlNode)

Sets the popup's content to the element provided as a DOM node.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setdomcontent-parameters)

htmlNode`(Node)`A DOM node to be used as content for the popup.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setdomcontent-returns)

`Popup`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#setdomcontent-example)

```js
// create an element with the popup content
const div = document.createElement('div');
div.innerHTML = 'Hello, world!';
const popup = new maptilersdk.Popup()
.setLngLat(e.lngLat)
.setDOMContent(div)
.addTo(map);
```

JavaScript

Copy

setHTML(html)

Sets the popup's content to the HTML provided as a string.

This method does not perform HTML filtering or sanitization, and
must be used only with trusted content. Consider
[Popup#setText](https://docs.maptiler.com/sdk-js/api/markers/#popup#settext) if
the content is an untrusted text string.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#sethtml-parameters)

html`(string)`A string representing HTML content for the popup.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#sethtml-returns)

`Popup`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#sethtml-example)

```js
const popup = new maptilersdk.Popup()
.setLngLat(e.lngLat)
.setHTML("&lt;h1&gt;Hello World!&lt;/h1&gt;")
.addTo(map);
```

JavaScript

Copy

##### [Related examples](https://docs.maptiler.com/sdk-js/api/markers/\#sethtml-related)

- [Display a popup](https://docs.maptiler.com/sdk-js/examples/popup/)
- [Display a popup on hover](https://docs.maptiler.com/sdk-js/examples/popup-on-hover/)
- [Display a popup on click](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)
- [Attach a popup to a marker instance](https://docs.maptiler.com/sdk-js/examples/set-popup/)

setLngLat(lnglat)

Sets the geographical location of the popup's anchor, and moves
the popup to it. Replaces trackPointer() behavior.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setlnglat-parameters)

lnglat`(LngLatLike)`The geographical location to set as the popup's anchor.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setlnglat-returns)

`Popup`:
`this`

setMaxWidth(maxWidth)

Sets the popup's maximum width. This is setting the CSS property
`max-width`. Available
values can be found here:
[https://developer.mozilla.org/en-US/docs/Web/CSS/max-width](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setmaxwidth-parameters)

maxWidth`(string)`A string representing the value for the maximum width.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setmaxwidth-returns)

`Popup`:
`this`

setOffset(offset?)

Sets the popup's offset.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setoffset-parameters)

offset`(Offset?)`Sets the popup's offset.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#setoffset-returns)

`Popup`:
`this`

setSubpixelPositioning(value)

Set the option to allow subpixel positioning of the popup by passing a boolean


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#setsubpixelpositioning-parameters)

value`(boolean)`When boolean is true, subpixel positioning is enabled for the popup.

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#setsubpixelpositioning-example)

```js
const popup = new maptilersdk.Popup()
popup.setSubpixelPositioning(true);
```

JavaScript

Copy

setText(text)

Sets the popup's content to a string of text.

This function creates a
[Text](https://developer.mozilla.org/en-US/docs/Web/API/Text)
node in the DOM, so it cannot insert raw HTML. Use this method for
security against XSS if the popup content is user-provided.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#settext-parameters)

text`(string)`Textual content for the popup.

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#settext-returns)

`Popup`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#settext-example)

```js
const popup = new maptilersdk.Popup()
.setLngLat(e.lngLat)
.setText('Hello, world!')
.addTo(map);
```

JavaScript

Copy

toggleClassName(className)

Add or remove the given CSS class on the popup container,
depending on whether the container currently has that class.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/markers/\#toggleclassname-parameters)

className`(string)`Non-empty string with CSS class name to add/remove

##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#toggleclassname-returns)

`boolean`:
if the class was removed return false, if class was added, then
return true


##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#toggleclassname-example)

```js
let popup = new maptilersdk.Popup()
popup.toggleClassName('toggleClass')
```

JavaScript

Copy

trackPointer()

Tracks the popup anchor to the cursor position on screens with a
pointer device (it will be hidden on touchscreens). Replaces the
`setLngLat` behavior. For
most use cases, set
`closeOnClick` and
`closeButton` to
`false`.


##### [Returns](https://docs.maptiler.com/sdk-js/api/markers/\#trackpointer-returns)

`Popup`:
`this`

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#trackpointer-example)

```js
const popup = new maptilersdk.Popup({ closeOnClick: false, closeButton: false })
.setHTML("&lt;h1&gt;Hello World!&lt;/h1&gt;")
.trackPointer()
.addTo(map);
```

JavaScript

Copy

### [Events](https://docs.maptiler.com/sdk-js/api/markers/\#popup-events)

close

Fired when the popup is closed manually or programatically.

##### [Properties](https://docs.maptiler.com/sdk-js/api/markers/\#close-properties)

popup`(Popup)`: object that was closed

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#close-example)

```js
// Create a popup
const popup = new maptilersdk.Popup();
// Set an event listener that will fire
// any time the popup is closed
popup.on('close', function(){
console.log('popup was closed');
});
```

JavaScript

Copy

open

Fired when the popup is opened manually or programatically.

##### [Properties](https://docs.maptiler.com/sdk-js/api/markers/\#open-properties)

popup`(Popup)`: object that was opened

##### [Example](https://docs.maptiler.com/sdk-js/api/markers/\#open-example)

```js
// Create a popup
const popup = new maptilersdk.Popup();
// Set an event listener that will fire
// any time the popup is opened
popup.on('open', function(){
console.log('popup was opened');
});
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/markers/\#popup-related)

- [Display a popup](https://docs.maptiler.com/sdk-js/examples/popup/)
- [Display a popup on hover](https://docs.maptiler.com/sdk-js/examples/popup-on-hover/)
- [Display a popup on click](https://docs.maptiler.com/sdk-js/examples/popup-on-click/)
- [Attach a popup to a marker instance](https://docs.maptiler.com/sdk-js/examples/set-popup/)


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Markers and popups

Markers and popups

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)