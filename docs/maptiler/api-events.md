# Events

The different types of events that SDK JS can raise.

You can also find additional event documentation for:
[`Map`](https://docs.maptiler.com/sdk-js/api/map/#map-events),
[`Marker`](https://docs.maptiler.com/sdk-js/api/markers/#marker-events),
[`Popup`](https://docs.maptiler.com/sdk-js/api/markers/#popup-events), and
[`GeolocationControl`](https://docs.maptiler.com/sdk-js/api/markers/#geolocatecontrol-events).


## [Evented](https://docs.maptiler.com/sdk-js/api/events/\#evented)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/util/evented.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/util/evented.ts)

Methods mixed in to other classes for event capabilities.

### [Methods](https://docs.maptiler.com/sdk-js/api/events/\#evented-instance-members)

listens(type)

Returns a true if this instance of Evented or any forwarded instances of Evented has a listener for the specified type.

[Parameters](https://docs.maptiler.com/sdk-js/api/events/#listens-evented-parameters)

type`(string)`The event type.

[Returns](https://docs.maptiler.com/sdk-js/api/events/#listens-evented-returns)

`boolean`:
`true` if there is at least one registered listener
for specified event type, `false` otherwise


off(type, listener)

Removes a previously registered event listener.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/events/\#off-evented-parameters)

type`(string)`The
event type to remove listeners for.


listener`(Function)`The
listener function to remove.


##### [Returns](https://docs.maptiler.com/sdk-js/api/events/\#off-evented-returns)

`

          Object

`:`this`

on(type, listener)

Adds a listener to a specified event type.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/events/\#on-evented-parameters)

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


##### [Returns](https://docs.maptiler.com/sdk-js/api/events/\#on-evented-returns)

`

          Object

`:`this`

once(type, listener)

Adds a listener that will be called only once to a specified event type.

The listener will be called first time the event fires after the listener is registered.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/events/\#once-evented-parameters)

type`(string)`The
event type to listen for.


listener`(Function)`The
function to be called when the event is fired the first time.


##### [Returns](https://docs.maptiler.com/sdk-js/api/events/\#once-evented-returns)

`

          Object

`:`this`

setEventedParent(parent?, data?)

Bubble all events fired by this instance of Evented to this parent instance of Evented.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/events/\#seteventedparent-evented-parameters)

parent`(Evented)`

data`(any)`

##### [Returns](https://docs.maptiler.com/sdk-js/api/events/\#seteventedparent-evented-returns)

`

          Object

`:`this`

## [MapMouseEvent](https://docs.maptiler.com/sdk-js/api/events/\#mapmouseevent)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/events.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/events.ts#L64-L134)

`MapMouseEvent` is the event type
for mouse-related map events.


Extends
[Event](https://developer.mozilla.org/docs/Web/API/Event).


### [Example](https://docs.maptiler.com/sdk-js/api/events/\#mapmouseevent-example)

```js
// The `click` event is an example of a `MapMouseEvent`.
// Set up an event listener on the map.
map.on('click', function(e) {
  // The event object (e) contains information like the
  // coordinates of the point on the map that was clicked.
  console.log('A click event has occurred at ' + e.lngLat);
});
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/events/\#mapmouseevent-instance-members)

lngLat

The geographic location on the map of the mouse cursor.

originalEvent

The DOM event which caused the map event.

point

The pixel coordinates of the mouse cursor, relative to the map and
measured from the top left corner.


preventDefault()

Prevents subsequent default processing of the event by the map.


Calling this method will prevent the following default map
behaviors:


- On `mousedown` events, the
behavior of
[DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler)
- On `mousedown` events, the
behavior of
[DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler)
- On `mousedown` events, the
behavior of
[BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler)
- On `dblclick` events, the
behavior of
[DoubleClickZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#doubleclickzoomhandler)

target

The `Map` object that fired
the event.


type

The event type (one of
[Map.event:mousedown](https://docs.maptiler.com/sdk-js/api/map/#map.event:mousedown),
[Map.event:mouseup](https://docs.maptiler.com/sdk-js/api/map/#map.event:mouseup), [Map.event:click](https://docs.maptiler.com/sdk-js/api/map/#map.event:click),
[Map.event:dblclick](https://docs.maptiler.com/sdk-js/api/map/#map.event:dblclick),
[Map.event:mousemove](https://docs.maptiler.com/sdk-js/api/map/#map.event:mousemove),
[Map.event:mouseover](https://docs.maptiler.com/sdk-js/api/map/#map.event:mouseover),
[Map.event:mouseenter](https://docs.maptiler.com/sdk-js/api/map/#map.event:mouseenter),
[Map.event:mouseleave](https://docs.maptiler.com/sdk-js/api/map/#map.event:mouseleave),
[Map.event:mouseout](https://docs.maptiler.com/sdk-js/api/map/#map.event:mouseout),
[Map.event:contextmenu](https://docs.maptiler.com/sdk-js/api/map/#map.event:contextmenu)).


## [MapTouchEvent](https://docs.maptiler.com/sdk-js/api/events/\#maptouchevent)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/events.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/events.ts#L140-L216)

`MapTouchEvent` is the event type
for touch-related map events.


Extends
[Event](https://developer.mozilla.org/docs/Web/API/Event).


### [Methods](https://docs.maptiler.com/sdk-js/api/events/\#maptouchevent-instance-members)

lngLat

The geographic location on the map of the center of the touch
event points.


lngLats

The geographical locations on the map corresponding to a
[touch event's\\
`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
property.


originalEvent

The DOM event which caused the map event.

point

The pixel coordinates of the center of the touch event points,
relative to the map and measured from the top left corner.


points

The array of pixel coordinates corresponding to a
[touch event's\\
`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
property.


preventDefault()

Prevents subsequent default processing of the event by the map.


Calling this method will prevent the following default map
behaviors:


- On `touchstart` events,
the behavior of
[DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler)
- On `touchstart` events,
the behavior of
[TouchZoomRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#touchzoomrotatehandler)

target

The `Map` object that fired
the event.


type

The event type.

## [MapLibreZoomEvent](https://docs.maptiler.com/sdk-js/api/events/\#maplibrezoomevent)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/events.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/events.ts#L266-L273)

A `MapLibreZoomEvent` is the event
type for the boxzoom-related map events emitted by the
[BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler).


### [Properties](https://docs.maptiler.com/sdk-js/api/events/\#maplibrezoomevent-properties)

originalEvent`(MouseEvent)`:
The DOM event that triggered the boxzoom event. Can be a
`MouseEvent`
or
`KeyboardEvent`

type`(string)`:
The type of boxzoom event. One of
`boxzoomstart`
,
`boxzoomend`
or
`boxzoomcancel`

target`(Map)`:
The
`Map`
instance that triggerred the event


## [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/\#mapdataevent)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/events.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/events.ts#L280-L307)

A `MapDataEvent` object is emitted
with the
[Map.event:data](https://docs.maptiler.com/sdk-js/api/map/#map.event:data) and
[Map.event:dataloading](https://docs.maptiler.com/sdk-js/api/map/#map.event:dataloading)
events. Possible values for
`dataType`s are:


- `'source'`: The non-tile data
associated with any source

- `'style'`: The
[style](https://docs.maptiler.com/gl-style-specification/) used by the map


### [Example](https://docs.maptiler.com/sdk-js/api/events/\#mapdataevent-example)

```js
// The sourcedata event is an example of MapDataEvent.
// Set up an event listener on the map.
map.on('sourcedata', function(e) {
   if (e.isSourceLoaded) {
       // Do something when the source has finished loading
   }
});
```

JavaScript

Copy

### [Properties](https://docs.maptiler.com/sdk-js/api/events/\#mapdataevent-properties)

type`(string)`: The event type.

dataType`(string)`:
The type of data that has changed. One of
`'source'`
,
`'style'`
.


isSourceLoaded`(boolean?)`:
True if the event has a
`dataType`
of
`source`
and the source has no outstanding network requests.


source`(Object?)`:
The
[style spec representation of the source](https://docs.maptiler.com/gl-style-specification/#sources)
if the event has a
`dataType`
of
`source`
.


sourceDataType`(string?)`:
Included if the event has a
`dataType`
of
`source`
and the event signals that internal data has been received or changed.
Possible values are
`metadata`
,
`content`
and
`visibility`
.


tile`(Object?)`:
The tile being loaded or changed, if the event has a
`dataType`
of
`source`
and the event is related to loading of a tile.


coord`(Coordinates?)`:
The coordinate of the tile if the event has a
`dataType`
of
`source`
and the event is related to loading of a tile.


## [MapWheelEvent](https://docs.maptiler.com/sdk-js/api/events/\#mapwheelevent)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/events.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/events.ts#L222-L264)

`MapWheelEvent` is the event type
for the `wheel` map event.


Extends
[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object).


### [Methods](https://docs.maptiler.com/sdk-js/api/events/\#mapwheelevent-instance-members)

originalEvent

The DOM event which caused the map event.

preventDefault()

Prevents subsequent default processing of the event by the map.


Calling this method will prevent the the behavior of
[ScrollZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#scrollzoomhandler).


target

The `Map` object that fired
the event.


type

The event type.

## [MapProjectionEvent](https://docs.maptiler.com/sdk-js/api/events/\#MapProjectionEvent)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/events.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/events.ts)

Supporting type to add validation to another style related type.

### [Type declaration](https://docs.maptiler.com/sdk-js/api/events/\#MapProjectionEvent-types)

newProjection?`ProjectionSpecification`Specifies the name of the new projection.
Additionally includes 'globe-mercator' to describe globe that has internally switched to mercator.



Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented)
  - [Methods](https://docs.maptiler.com/sdk-js/api/events/#evented-instance-members)
- [MapMouseEvent](https://docs.maptiler.com/sdk-js/api/events/#mapmouseevent)
  - [Example](https://docs.maptiler.com/sdk-js/api/events/#mapmouseevent-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/events/#mapmouseevent-instance-members)
- [MapTouchEvent](https://docs.maptiler.com/sdk-js/api/events/#maptouchevent)
  - [Methods](https://docs.maptiler.com/sdk-js/api/events/#maptouchevent-instance-members)
- [MapLibreZoomEvent](https://docs.maptiler.com/sdk-js/api/events/#maplibrezoomevent)
  - [Properties](https://docs.maptiler.com/sdk-js/api/events/#maplibrezoomevent-properties)
- [MapDataEvent](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent)
  - [Example](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent-example)
  - [Properties](https://docs.maptiler.com/sdk-js/api/events/#mapdataevent-properties)
- [MapWheelEvent](https://docs.maptiler.com/sdk-js/api/events/#mapwheelevent)
  - [Methods](https://docs.maptiler.com/sdk-js/api/events/#mapwheelevent-instance-members)
- [MapProjectionEvent](https://docs.maptiler.com/sdk-js/api/events/#MapProjectionEvent)
  - [Type declaration](https://docs.maptiler.com/sdk-js/api/events/#MapProjectionEvent-types)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Events

Events

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)