# User interaction handlers

Items related to the ways in which the map responds to user input.

## [BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#boxzoomhandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/box\_zoom.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/box_zoom.ts)

The `BoxZoomHandler` allows the user to zoom the map to fit within a bounding box.
The bounding box is defined by clicking and holding `shift` while dragging the cursor.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#boxzoomhandler-instance-members)

disable()

Disables the "box zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-boxzoomhandler-example)

```js
map.boxZoom.disable();
```

JavaScript

Copy

enable()

Enables the "box zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-boxzoomhandler-example)

```js
map.boxZoom.enable();
```

JavaScript

Copy

isActive()

Returns a Boolean indicating whether the "box zoom" interaction is active, i.e. currently being used.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-boxzoomhandler-returns)

`boolean`:
`true`
if the "box zoom" interaction is active.


isEnabled()

Returns a Boolean indicating whether the "box zoom" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-boxzoomhandler-returns)

`boolean`:
`true`
if the "box zoom" interaction is enabled.


## [CooperativeGesturesHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#cooperativegestureshandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/cooperative\_gestures.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/cooperative_gestures.ts)

A `CooperativeGesturesHandler` is a control that adds
cooperative gesture info when user tries to zoom in/out.

When the CooperativeGestureHandler blocks a gesture, it will emit a `cooperativegestureprevented` event.


##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#cooperativegestureshandler-example)

```js
const map = new Map({
  cooperativeGestures: true
});
```

JavaScript

Copy

### [Properties](https://docs.maptiler.com/sdk-js/api/handlers/\#cooperativegestureshandler-properties)

\_bypassKey

This is the key (`"ctrlKey"` \| `"metaKey"`)
that will allow to bypass the cooperative gesture protection.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#cooperativegestureshandler-instance-members)

isActive()

This is used to indicate if the handler is currently active or not.
In case a handler is active, it will block other handlers from getting the relevant events.
There is an allow list of handlers that can be active at the same time,
which is configured when adding a handler.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isActive-cooperativegestureshandler-returns)

`boolean`:
`true`
if the cooperative gestures interaction is enabled.


reset()

Can be called by the manager at any time and must reset everything to it's original state.

## [ScrollZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#scrollzoomhandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/scroll\_zoom.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/scroll_zoom.ts)

The `ScrollZoomHandler` allows the user to zoom the map by scrolling.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#scrollzoomhandler-instance-members)

disable()

Disables the "scroll to zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-scrollzoomhandler-example)

```js
map.scrollZoom.disable();
```

JavaScript

Copy

enable(options?)

Enables the "scroll to zoom" interaction.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-scrollzoomhandler-parameters)

options`(Object?)`Options
object.


| options.around<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | If "center" is passed, map will zoom around center of map |

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-scrollzoomhandler-example)

```js
map.scrollZoom.enable();
```

JavaScript

Copy

```js
map.scrollZoom.enable({ around: 'center' })
```

JavaScript

Copy

isEnabled()

Returns a Boolean indicating whether the "scroll to zoom" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-scrollzoomhandler-returns)

`boolean`:
`true`
if the "scroll to zoom" interaction is enabled.


setWheelZoomRate(wheelZoomRate)

Set the zoom rate of a mouse wheel

##### [Parameters](https://docs.maptiler.com/sdk-js/api/handlers/\#setwheelzoomrate-parameters)

wheelZoomRate`(number)`(default
`1/450`)The rate used to scale mouse wheel movement to a zoom value.


##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#setwheelzoomrate-example)

```js
// Slow down zoom of mouse wheel
map.scrollZoom.setWheelZoomRate(1/600);
```

JavaScript

Copy

setZoomRate(zoomRate)

Set the zoom rate of a trackpad

##### [Parameters](https://docs.maptiler.com/sdk-js/api/handlers/\#setzoomrate-parameters)

zoomRate`(number)`(default
`1/100`)The rate used to scale trackpad movement to a zoom value.


##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#setzoomrate-example)

```js
// Speed up trackpad zoom
map.scrollZoom.setZoomRate(1/25);
```

JavaScript

Copy

## [DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#dragpanhandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/shim/drag\_pan.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/shim/drag_pan.ts)

The `DragPanHandler` allows the user to pan the map by clicking and dragging
the cursor.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#dragpanhandler-instance-members)

disable()

Disables the "drag to pan" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-dragpanhandler-example)

```js
map.dragPan.disable();
```

JavaScript

Copy

enable(options?)

Enables the "drag to pan" interaction.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-dragpanhandler-parameters)

options`(Object?)`Options
object


| options.linearity<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 0 | factor used to scale the drag velocity |
| options.easing<br>[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)<br>default: bezier(0,0,0.3,1) | easing function applled to<br> `map.panTo`<br> when applying the drag. |
| options.maxSpeed<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 1400 | the maximum value of the drag velocity. |
| options.deceleration<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: 2500 | the rate at which the speed reduces after the pan ends. |

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-dragpanhandler-example)

```js
map.dragPan.enable();
```

JavaScript

Copy

```js
map.dragPan.enable({
    linearity: 0.3,
    easing: bezier(0, 0, 0.3, 1),
    maxSpeed: 1400,
    deceleration: 2500,
});
```

JavaScript

Copy

isActive()

Returns a Boolean indicating whether the "drag to pan" interaction is active, i.e. currently being used.


##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-dragpanhandler-returns)

`boolean`:
`true`
if the "drag to pan" interaction is active.


isEnabled()

Returns a Boolean indicating whether the "drag to pan" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-dragpanhandler-returns)

`boolean`:
`true`
if the "drag to pan" interaction is enabled.


## [DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#dragrotatehandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/shim/drag\_rotate.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/shim/drag_rotate.ts)

The `DragRotateHandler` allows the user to rotate the map by clicking and
dragging the cursor while holding the right mouse button or `ctrl` key.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#dragrotatehandler-instance-members)

disable()

Disables the "drag to rotate" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-dragrotatehandler-example)

```js
map.dragRotate.disable();
```

JavaScript

Copy

enable()

Enables the "drag to rotate" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-dragrotatehandler-example)

```js
map.dragRotate.enable();
```

JavaScript

Copy

isActive()

Returns a Boolean indicating whether the "drag to rotate" interaction is active, i.e. currently being
used.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-dragrotatehandler-returns)

`boolean`:
`true`
if the "drag to rotate" interaction is active.


isEnabled()

Returns a Boolean indicating whether the "drag to rotate" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-dragrotatehandler-returns)

`boolean`:
`true`
if the "drag to rotate" interaction is enabled.


## [KeyboardHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#keyboardhandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/keyboard.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/keyboard.ts)

The `KeyboardHandler` allows the user to zoom, rotate, and pan the map using
the following keyboard shortcuts:

- `=` / `+`: Increase the zoom level by 1.
- `Shift-=` / `Shift-+`: Increase the zoom level by 2.
- `-`: Decrease the zoom level by 1.
- `Shift--`: Decrease the zoom level by 2.
- Arrow keys: Pan by 100 pixels.
- `Shift+⇢`: Increase the rotation by 15 degrees.
- `Shift+⇠`: Decrease the rotation by 15 degrees.
- `Shift+⇡`: Increase the pitch by 10 degrees.
- `Shift+⇣`: Decrease the pitch by 10 degrees.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#keyboardhandler-instance-members)

disable()

Disables the "keyboard rotate and zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-keyboardhandler-example)

```js
map.keyboard.disable();
```

JavaScript

Copy

disableRotation()

Disables the "keyboard pan/rotate" interaction, leaving the
"keyboard zoom" interaction enabled.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disablerotation-keyboardhandler-example)

```js
map.keyboard.disableRotation();
```

JavaScript

Copy

enable()

Enables the "keyboard rotate and zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-keyboardhandler-example)

```js
map.keyboard.enable();
```

JavaScript

Copy

enableRotation()

Enables the "keyboard pan/rotate" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enablerotation-keyboardhandler-example)

```js
map.keyboard.enable();
map.keyboard.enableRotation();
```

JavaScript

Copy

isActive()

Returns true if the handler is enabled and has detected the start of a
zoom/rotate gesture.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-keyboardhandler-returns)

`boolean`:
`true`
if the handler is enabled and has detected the
start of a zoom/rotate gesture.


isEnabled()

Returns a Boolean indicating whether the "keyboard rotate and zoom"
interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-keyboardhandler-returns)

`boolean`:
`true`
if the "keyboard rotate and zoom"
interaction is enabled.


## [DoubleClickZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#doubleclickzoomhandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/shim/dblclick\_zoom.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/shim/dblclick_zoom.ts)

The `DoubleClickZoomHandler` allows the user to zoom the map at a point by
double clicking or double tapping.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#doubleclickzoomhandler-instance-members)

disable()

Disables the "double click to zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-doubleclickzoomhandler-example)

```js
map.doubleClickZoom.disable();
```

JavaScript

Copy

enable()

Enables the "double click to zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-doubleclickzoomhandler-example)

```js
map.doubleClickZoom.enable();
```

JavaScript

Copy

isActive()

Returns a Boolean indicating whether the "double click to zoom" interaction is active, i.e. currently
being used.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-doubleclickzoomhandler-returns)

`boolean`:
`true`
if the "double click to zoom" interaction is active.


isEnabled()

Returns a Boolean indicating whether the "double click to zoom" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-doubleclickzoomhandler-returns)

`boolean`:
`true`
if the "double click to zoom" interaction is enabled.


## [TwoFingersTouchPitchHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#twofingerstouchpitchhandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/two\_fingers\_touch.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/two_fingers_touch.ts)

The `TwoFingersTouchPitchHandler` allows the user to pitch the map by dragging up and down with two fingers.


Extends TwoFingersTouchHandler.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#twofingerstouchpitchhandler-instance-members)

disable

Disables the "drag to pitch" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-twofingerstouchpitchhandler-example)

```js
map.touchPitch.disable();
```

JavaScript

Copy

enable(options?)

Enables the "drag to pitch" interaction.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-twofingerstouchpitchhandler-parameters)

options`(Object?)`Options
object.


| options.around<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | If "center" is passed, map will zoom around the center |

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-twofingerstouchpitchhandler-example)

```js
map.touchPitch.enable();
```

JavaScript

Copy

```js
map.touchPitch.enable({ around: 'center' });
```

JavaScript

Copy

isActive

Returns a Boolean indicating whether the "drag to pitch" interaction is active, i.e. currently being
used.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-twofingerstouchpitchhandler-returns)

`boolean`:
`true`
if the "drag to pitch" interaction is active.


isEnabled

Returns a Boolean indicating whether the "drag to pitch" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-twofingerstouchpitchhandler-returns)

`boolean`:
`true`
if the "drag to pitch" interaction is enabled.


## [TwoFingersTouchRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#twofingerstouchrotatehandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/two\_fingers\_touch.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/two_fingers_touch.ts)

The `TwoFingersTouchRotateHandler` allows the user to rotate with two fingers.


Extends TwoFingersTouchHandler.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#twofingerstouchrotatehandler-instance-members)

disable

Disables the "drag to rotate" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-twofingerstouchrotatehandler-example)

```js
map.touchPitch.disable();
```

JavaScript

Copy

enable(options?)

Enables the "drag to pitch" interaction.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-twofingerstouchrotatehandler-parameters)

options`(Object?)`Options
object.


| options.around<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | If "center" is passed, map will zoom around the center |

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-twofingerstouchrotatehandler-example)

```js
map.touchPitch.enable();
```

JavaScript

Copy

```js
map.touchPitch.enable({ around: 'center' });
```

JavaScript

Copy

isActive

Returns a Boolean indicating whether the "drag to pitch" interaction is active, i.e. currently being
used.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-twofingerstouchrotatehandler-returns)

`boolean`:
`true`
if the "drag to pitch" interaction is active.


isEnabled

Returns a Boolean indicating whether the "drag to pitch" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-twofingerstouchrotatehandler-returns)

`boolean`:
`true`
if the "drag to pitch" interaction is enabled.


## [TwoFingersTouchZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#twofingerstouchzoomrotatehandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/shim/two\_fingers\_touch.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/shim/two_fingers_touch.ts)

The `TwoFingersTouchZoomHandler` allows the user to zoom the map two fingers.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#twofingerstouchzoomhandler-instance-members)

disable()

Disables the "pinch to rotate and zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-twofingerstouchzoomhandler-example)

```js
map.touchZoomRotate.disable();
```

JavaScript

Copy

enable(options?)

Enables the "drag to zoom" interaction.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-twofingerstouchzoomhandler-parameters)

options`(Object?)`Options
object.


| options.around<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | If "center" is passed, map will zoom around the center |

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-twofingerstouchzoomhandler-example)

```js
map.touchZoomRotate.enable();
```

JavaScript

Copy

```js
map.touchZoomRotate.enable({ around: 'center' });
```

JavaScript

Copy

isActive()

Returns true if the handler is enabled and has detected the start of a zoom/rotate gesture.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-twofingerstouchzoomhandler-returns)

`boolean`:
//eslint-disable-line


isEnabled()

Returns a Boolean indicating whether the "pinch to rotate and zoom" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-twofingerstouchzoomhandler-returns)

`boolean`:
`true`
if the "pinch to rotate and zoom" interaction is enabled.


## [TwoFingersTouchZoomRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/\#twofingerstouchzoomrotatehandler)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/handler/shim/two\_fingers\_touch.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/handler/shim/two_fingers_touch.ts)

The `TwoFingersTouchZoomRotateHandler` allows the user to zoom and rotate the map by
pinching on a touchscreen.

They can zoom with one finger by double tapping and dragging. On the second tap,
hold the finger down and drag up or down to zoom in or out.

### [Methods](https://docs.maptiler.com/sdk-js/api/handlers/\#twofingerstouchzoomrotatehandler-instance-members)

disable()

Disables the "pinch to rotate and zoom" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disable-twofingerstouchzoomrotatehandler-example)

```js
map.touchZoomRotate.disable();
```

JavaScript

Copy

disableRotation()

Disables the "pinch to rotate" interaction, leaving the "pinch to zoom"
interaction enabled.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#disablerotation-twofingerstouchzoomrotatehandler-example)

```js
map.touchZoomRotate.disableRotation();
```

JavaScript

Copy

enable(options?)

Enables the "pinch to rotate and zoom" interaction.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-twofingerstouchzoomrotatehandler-parameters)

options`(Object?)`Options
object.


| options.around<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)? | If "center" is passed, map will zoom around the center |

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enable-twofingerstouchzoomrotatehandler-example)

```js
map.touchZoomRotate.enable();
```

JavaScript

Copy

```js
map.touchZoomRotate.enable({ around: 'center' });
```

JavaScript

Copy

enableRotation()

Enables the "pinch to rotate" interaction.

##### [Example](https://docs.maptiler.com/sdk-js/api/handlers/\#enablerotation-twofingerstouchzoomrotatehandler-example)

```js
map.touchZoomRotate.enable();
map.touchZoomRotate.enableRotation();
```

JavaScript

Copy

isActive()

Returns true if the handler is enabled and has detected the start of a zoom/rotate gesture.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isactive-twofingerstouchzoomrotatehandler-returns)

`boolean`:
//eslint-disable-line


isEnabled()

Returns a Boolean indicating whether the "pinch to rotate and zoom" interaction is enabled.

##### [Returns](https://docs.maptiler.com/sdk-js/api/handlers/\#isenabled-twofingerstouchzoomrotatehandler-returns)

`boolean`:
`true`
if the "pinch to rotate and zoom" interaction is enabled.



Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [BoxZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#boxzoomhandler-instance-members)
- [CooperativeGesturesHandler](https://docs.maptiler.com/sdk-js/api/handlers/#cooperativegestureshandler)
  - [Properties](https://docs.maptiler.com/sdk-js/api/handlers/#cooperativegestureshandler-properties)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#cooperativegestureshandler-instance-members)
- [ScrollZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#scrollzoomhandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#scrollzoomhandler-instance-members)
- [DragPanHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#dragpanhandler-instance-members)
- [DragRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#dragrotatehandler-instance-members)
- [KeyboardHandler](https://docs.maptiler.com/sdk-js/api/handlers/#keyboardhandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#keyboardhandler-instance-members)
- [DoubleClickZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#doubleclickzoomhandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#doubleclickzoomhandler-instance-members)
- [TwoFingersTouchPitchHandler](https://docs.maptiler.com/sdk-js/api/handlers/#twofingerstouchpitchhandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#twofingerstouchpitchhandler-instance-members)
- [TwoFingersTouchRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#twofingerstouchrotatehandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#twofingerstouchrotatehandler-instance-members)
- [TwoFingersTouchZoomHandler](https://docs.maptiler.com/sdk-js/api/handlers/#twofingerstouchzoomhandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#twofingerstouchzoomhandler-instance-members)
- [TwoFingersTouchZoomRotateHandler](https://docs.maptiler.com/sdk-js/api/handlers/#twofingerstouchzoomrotatehandler)
  - [Methods](https://docs.maptiler.com/sdk-js/api/handlers/#twofingerstouchzoomrotatehandler-instance-members)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


User interaction handlers

User interaction handlers

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)