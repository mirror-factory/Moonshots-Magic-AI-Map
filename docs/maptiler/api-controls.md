# Controls

The term "control" is commonly used for all sorts of buttons and information display that take place in one of the corner of the map area.
The most well know are probably the `[+]` and `[-]` zoom buttons as well as the attribution information.

User interface elements that can be added to the map. The items in this section exist outside of the map's
`canvas` element.

## [Easy to add controls](https://docs.maptiler.com/sdk-js/api/controls/\#easyaddcontrols)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

The easiest way to add the most used controls is through the [Map constructor options](https://docs.maptiler.com/sdk-js/api/map/#map-options).

To add a control in the map constructor, you must indicate the name of the control and one of these values:
`true` to add the control or `false` to hide the control.
You can also indicate in which position we are going to add the control:
`top-left``top-right``bottom-left``bottom-right`

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#easyaddcontrols-example)

```js
const map = new maptilersdk.Map({
  container: document.getElementById("my-container-div"),
  terrainControl: true,
  scaleControl: true,
  fullscreenControl: "top-left",
  geolocateControl: false
})
```

JavaScript

Copy

These are the controls that are directly accessible in the map constructor:

- `navigationControl`: Shows the `[+]`,
`[-]` zoom buttons and tilt/bearing/compass buttons.
Showing on the `top-right` by default.

- `geolocateControl`: Shows a arrow-shaped locate button. When clicked,
it adds a marker and center the map. If clicked again, the marker disapears (unless the map was moved since first clicked).
Showing on the `top-right` by default.

- `terrainControl`: Shows a button to enable/disable the 3D terrain (does not tilt the map)
Hidden by default, showing on the `top-right` if true.

- `scaleControl`: Shows a distance scale. The unit ("metric", "imperial" or "nautical")
can be set in the [config object](https://docs.maptiler.com/sdk-js/api/config/) config.unit (default: "metric").
Hidden by default, showing on the `bottom-right` if true.

- `fullscreenControl`: Shows a button that toggles the map into fullscreen.
Hidden by default, showing on the `top-right` if true.


## [Custom controls](https://docs.maptiler.com/sdk-js/api/controls/\#customcontrols)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

MapTiler SDK JS supports two flexible ways to add custom controls to your map interface,
depending on the level of control and flexibility you need.

### [Related\  examples](https://docs.maptiler.com/sdk-js/api/controls/\#customcontrols-related)

- [How to add a custom control programmatically](https://docs.maptiler.com/sdk-js/examples/custom-controls-programmatic/)
- [Add a custom control declarative way](https://docs.maptiler.com/sdk-js/examples/custom-controls-declarative/)

### [Programmatic\  Controls](https://docs.maptiler.com/sdk-js/api/controls/\#programmatic-controls)

Programmatic controls allow developers to have more control and register custom control elements manually by
calling
`map.addControl()`
and providing a control implementation. This method is ideal for applications that require dynamic logic,
event-based behaviour, or a deeper integration with a framework like React.


Custom controls are instantiated using the
[`MaptilerCustomControl`](https://docs.maptiler.com/sdk-js/api/controls/#maptilercustomcontrol) class.
The element that should be used can be provided either as the **element itself**, or as its **CSS selector**.
Optionally, two callback functions can be provided:


- `onClick`function that is called when the element is clicked, and
- `onRender`function that is called every time the map renders a new state.


Both callbacks receive the active `Map` instance, the associated control
element itself,
and an event object associated with the original event (`PointerEvent`
and `MapLibreEvent` respectively).


#### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#programmatic-controls-example)

```js
const panControl = new maptilersdk.MaptilerCustomControl(
  ".pan-control",
  (map) => map.panBy([10, 10]), // Move southeast when clicked
  (map, el) => el.classList.toggle( // Change class based on current hemisphere
    "northern-hemisphere", map.getCenter().lat > 0
  )
);
map.addControl(panControl);

const element = document.createElement("button");
element.className = "btn btn-primary pan-nw"
element.textContent = "Pan NW";

map.addControl(
  new maptilersdk.MaptilerCustomControl(
    element,
    (map) => map.panBy([-10, -10]) // Move northwest when clicked
  ),
  "top-left"
);
```

JavaScript

Copy

Example: [How to add a custom control programmatically](https://docs.maptiler.com/sdk-js/examples/custom-controls-programmatic/)

#### Behaviour Overview

- Upon adding, the control element is removed from its original DOM position and inserted into the map UI.
- The `onClick` callback binds an action to user interaction.
- The `onRender` callback can be used for state-based updates, styling, or
other custom logic.
- The control is treated as a native part of the map UI but maintains its own DOM context.
- Upon removing, the control element is moved back into its original DOM position (if any) to not interfere with
DOM handling of frameworks like React.

### [Declarative\  Controls](https://docs.maptiler.com/sdk-js/api/controls/\#declarative-controls)

Declarative controls offer a simple way to add interactive UI elements to the map by using HTML attributes alone.
Instead of instantiating controls through JavaScript, developers annotate DOM elements and allow
the SDK to discover and wire them automatically.

Declarative controls are instantiated under the hood using the [`MaptilerExternalControl`](https://docs.maptiler.com/sdk-js/api/controls/#maptilerexternalcontrol) class.

#### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#declarative-controls-example)

[Add a custom control declarative way](https://docs.maptiler.com/sdk-js/examples/custom-controls-declarative/)

#### Enabling Detection

To activate declarative control detection:

- Set the `customControls` option
to `true` in the map initialization configuration, to enable detection
globally.
- Alternatively, `customControls` may be set to a
**CSS selector string**, to scope the autodetection to:

  - Elements matching the selector directly
  - Or elements whose **ancestor** matches the selector

```js
const map = new maptilersdk.Map({
  container: "map",
  customControls: true, // or ".custom-ui"
});
```

JavaScript

Copy

#### Declaring a Control

To declare a control element, use the `data-maptiler-control` attribute:

```html
<button data-maptiler-control="zoom-in">+</button>
```

HTML

Copy

The attribute’s value must be one of the predefined keywords, or an empty value.
The element is automatically registered as a control and moved into the map UI. Supported values:

| **Value** | **Description** |
| --- | --- |
| `zoom-in` | zooms the map in |
| `zoom-out` | zooms the map out |
| `toggle-projection` | toggles between Mercator and Globe projections |
| `toggle-terrain` | turns Terrain layer on and off |
| `reset-view` | resets bearing, pitch, and roll to 0 (heading north, no pitch, no roll) |
| `reset-bearing` | resets bearing to 0 (heading north) |
| `reset-pitch` | resets pitch to 0 (no pitch) |
| `reset-roll` | resets roll to 0 (no roll) |
| empty value | registers the element as control but does not add any functionality automatically |

An Error is thrown when an unrecognized value is used.

#### Grouping Controls

For grouping related controls together, use the `data-maptiler-control-group`
attribute.
This approach is ideal for styling multiple buttons as a single floating UI block.

```html
<div data-maptiler-control-group>
  <button data-maptiler-control="zoom-in">+</button>
  <button data-maptiler-control="zoom-out">−</button>
</div>
```

HTML

Copy

- The **group container** (`data-maptiler-control-group`)
is registered as a control and moved into the map UI.
- It does **not** receive any automatic functionality.
- Functional behaviour is attached to valid descendant elements with `data-maptiler-control`.

#### Positioning Controls

To set a specific position for a control or group, use the `data-maptiler-position`.
The allowed values are the same as in [addControl](https://docs.maptiler.com/sdk-js/api/map/#map#addcontrol) method.

```html
<button data-maptiler-control="reset-view" data-maptiler-position="top-left">↻</button>
<div data-maptiler-control-group data-maptiler-position="bottom-right">
  <button data-maptiler-control="zoom-in">+</button>
  <button data-maptiler-control="zoom-out">−</button>
</div>
```

HTML

Copy

#### State Styling via CSS

To support dynamic styling based on map state (without relying on JavaScript),
custom CSS variables are set directly on the map container when declarative controls are enabled. Available CSS
properties:

| **Property** | **Description** | **Data type** |
| --- | --- | --- |
| `--maptiler-center-lng` | Longitude of map center | unitless number |
| `--maptiler-center-lat` | Latitude of map center | unitless number |
| `--maptiler-zoom` | Current zoom level | unitless number |
| `--maptiler-bearing` | Current map bearing (rotation) | unitless number |
| `--maptiler-pitch` | Pitch angle | unitless number |
| `--maptiler-roll` | Roll angle | unitless number |
| `--maptiler-is-globe-projection` | `true` if globe view is enabled, `false` otherwise | string |
| `--maptiler-has-terrain` | `true` if terrain is active,<br> `false` otherwise | string |

This enables responsive UI tweaks via pure CSS, for example:

```css
/* transform compass icon based on bearing and pitch */
.compass-icon {
  transform: rotateX(calc(var(--maptiler-pitch) * 1deg))
            rotateZ(calc(var(--maptiler-bearing) * -1deg));
}

/* change projection button icon when Globe projection is on */
@container style(--maptiler-is-globe-projection: true) {
  .projection-icon {
    content: "globe";
  }
}
```

CSS

Copy

## [MaptilerNavigationControl](https://docs.maptiler.com/sdk-js/api/controls/\#maptilernavigationcontrol)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/MaptilerNavigationControl.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/MaptilerNavigationControl.ts)

A `MaptilerNavigationControl` control contains zoom buttons and a compass.

Behavior changes

- When enabled, the pitch button is always present
- The pitch button now pitches the map if it ws not (and as before, unpitches the map if pitched)
- The compass icon on the pitch button has a capped “squeeziness” factor to prevent it from looking extra flat and wide when pitch is set higher than 60

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#maptilernavigationcontrol-example)

```js
const nav = new maptilersdk.MaptilerNavigationControl();
map.addControl(nav, 'top-left');
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#maptilernavigationcontrol-parameters)

options`(Object?)`

| options.showCompass<br>[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | If<br> `true`<br> the compass button is included. |
| options.showZoom<br>[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: true | If<br> `true`<br> the zoom-in and zoom-out buttons are included. |
| options.visualizePitch<br>[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>default: false | If<br> `true`<br> the pitch is visualized by rotating X-axis of compass. |

### [Related examples](https://docs.maptiler.com/sdk-js/api/controls/\#maptilernavigationcontrol-related)

- [Display map navigation\\
controls](https://docs.maptiler.com/sdk-js/examples/navigation/)
- [Add a third party vector tile\\
source](https://docs.maptiler.com/sdk-js/examples/third-party/)

## [MaptilerGeolocateControl](https://docs.maptiler.com/sdk-js/api/controls/\#maptilergeolocatecontrol)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/MaptilerGeolocateControl.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/MaptilerGeolocateControl.ts)

A `MaptilerGeolocateControl` control provides a button that uses the browser's geolocation
API to locate the user on the map.

Not all browsers support geolocation,
and some users may disable the feature. Geolocation support for modern
browsers including Chrome requires sites to be served over HTTPS. If
geolocation support is not available, the `MaptilerGeolocateControl` will show
as disabled.

The zoom level applied will depend on the accuracy of the geolocation provided by the device.

The `MaptilerGeolocateControl` has two modes. If `trackUserLocation` is `false` (default) the
control acts as a button, which when pressed will set the map's camera to target the user location. If the user
moves, the map won't update. This is most suited for the desktop. If `trackUserLocation` is
`true` the control acts as a toggle button that when active the user's location is actively monitored
for changes. In this mode the `MaptilerGeolocateControl` has three interaction states:

- active - the map's camera automatically updates as the user's location changes, keeping the location dot in
the center. Initial state and upon clicking the `MaptilerGeolocateControl` button.
- passive - the user's location dot automatically updates, but the map's camera does not. Occurs upon the user
initiating a map movement.
- disabled - occurs if Geolocation is not available, disabled or denied.

These interaction states can't be controlled programmatically, rather they are set based on user interactions.


Behavior changes

- Now with these defaults:
  - enableHighAccuracy: true (uses browser location, probably GPS)
  - maximumAge: 0 (not using any cached location)
  - Timeout: 6000 (6 seconds)
  - trackUserLocation: true
- When geolocate is “active”, zooming/rotating/pitching the map no longer changes the status to “background” because it does not change the center of the map.
The center of the map must move of at least 1 m (world) from the active locked position in order for the status to change to “background”
(note: the “background” status means the location is still refreshed but if the user moves, the map will no longer continue to be centered on them)
- The method to update the blue disc (location precision radius) has been improved as we zoom in. It is now less shaky and behave according to perspective when the camera is tilted

Extends [Evented](https://docs.maptiler.com/sdk-js/api/events/#evented).

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#maptilergeolocatecontrol-example)

```js
map.addControl(new maptilersdk.MaptilerGeolocateControl({
  positionOptions: {
      enableHighAccuracy: true
  },
  trackUserLocation: true
}), 'top-left');
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#maptilergeolocatecontrol-parameters)

options`(Object?)`

| options.positionOptions<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)<br>default: {enableHighAccuracy:false,timeout:6000} | A Geolocation API<br> [PositionOptions](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)<br> object. |
| options.fitBoundsOptions<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)<br>default: {maxZoom:15} | A<br> [Map#fitBounds](https://docs.maptiler.com/sdk-js/api/map/#map#fitbounds)<br> options object to use when the map is panned and zoomed to the user's location. The default is to use<br> a<br> `maxZoom`<br> of 15 to limit how far the map will zoom in for very accurate locations. |
| options.trackUserLocation<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)<br>default: false | If<br> `true`<br> the Geolocate Control becomes a toggle button and when active the map will receive updates to the<br> user's location as it changes. |
| options.showAccuracyCircle<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)<br>default: true | By default, if showUserLocation is<br> `true`<br> , a transparent circle will be drawn around the user location indicating the accuracy (95% confidence<br> level) of the user's location. Set to<br> `false`<br> to disable. Always disabled when showUserLocation is<br> `false`<br> . |
| options.showUserLocation<br>[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)<br>default: true | By default a dot will be shown on the map at the user's<br> location. Set to<br> `false`<br> to disable. |

### [Methods](https://docs.maptiler.com/sdk-js/api/controls/\#maptilergeolocatecontrol-instance-members)

trigger()

Programmatically request and move the map to the user's location.

##### [Returns](https://docs.maptiler.com/sdk-js/api/controls/\#trigger-returns)

`boolean`:
Returns
`false`
if called before control was added to a map, otherwise returns
`true`
.


##### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#trigger-example)

```js
// Initialize the geolocate control.
const geolocate = new maptilersdk.GeolocateControl({
positionOptions: {
  enableHighAccuracy: true
},
trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
map.on('load', function() {
geolocate.trigger();
});
```

JavaScript

Copy

### [Events](https://docs.maptiler.com/sdk-js/api/controls/\#maptilergeolocatecontrol-events)

error

Fired on each Geolocation API position update which returned as an error.

##### [Properties](https://docs.maptiler.com/sdk-js/api/controls/\#error-properties)

data`(PositionError)`:
The returned
[PositionError](https://developer.mozilla.org/en-US/docs/Web/API/PositionError)
object from the callback in
[Geolocation.getCurrentPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition)
or
[Geolocation.watchPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition)
.


##### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#error-example)

```js
// Initialize the geolocate control.
const geolocate = new maptilersdk.GeolocateControl({
positionOptions: {
    enableHighAccuracy: true
},
trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
// Set an event listener that fires
// when an error event occurs.
geolocate.on('error', function() {
console.log('An error event has occurred.')
});
```

JavaScript

Copy

geolocate

Fired on each Geolocation API position update which returned as success.

##### [Properties](https://docs.maptiler.com/sdk-js/api/controls/\#geolocate-properties)

data`(Position)`:
The returned
[Position](https://developer.mozilla.org/en-US/docs/Web/API/Position)
object from the callback in
[Geolocation.getCurrentPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition)
or
[Geolocation.watchPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition)
.


##### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#geolocate-example)

```js
// Initialize the geolocate control.
const geolocate = new maptilersdk.GeolocateControl({
positionOptions: {
    enableHighAccuracy: true
},
trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
// Set an event listener that fires
// when a geolocate event occurs.
geolocate.on('geolocate', function() {
console.log('A geolocate event has occurred.')
});
```

JavaScript

Copy

outofmaxbounds

Fired on each Geolocation API position update which returned as success but user position is out of map
maxBounds.

##### [Properties](https://docs.maptiler.com/sdk-js/api/controls/\#outofmaxbounds-properties)

data`(Position)`:
The returned
[Position](https://developer.mozilla.org/en-US/docs/Web/API/Position)
object from the callback in
[Geolocation.getCurrentPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition)
or
[Geolocation.watchPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition)
.


##### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#outofmaxbounds-example)

```js
// Initialize the geolocate control.
const geolocate = new maptilersdk.GeolocateControl({
positionOptions: {
    enableHighAccuracy: true
},
trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
// Set an event listener that fires
// when an outofmaxbounds event occurs.
geolocate.on('outofmaxbounds', function() {
console.log('An outofmaxbounds event has occurred.')
});
```

JavaScript

Copy

trackuserlocationend

Fired when the Geolocate Control changes to the background state, which happens when a user changes the
camera during an active position lock. This only applies when trackUserLocation is true. In the background
state, the dot on the map will update with location updates but the camera will not.

##### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#trackuserlocationend-example)

```js
// Initialize the geolocate control.
const geolocate = new maptilersdk.GeolocateControl({
positionOptions: {
    enableHighAccuracy: true
},
trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
// Set an event listener that fires
// when a trackuserlocationend event occurs.
geolocate.on('trackuserlocationend', function() {
console.log('A trackuserlocationend event has occurred.')
});
```

JavaScript

Copy

trackuserlocationstart

Fired when the Geolocate Control changes to the active lock state, which happens either upon first
obtaining a successful Geolocation API position for the user (a geolocate event will follow), or the user
clicks the geolocate button when in the background state which uses the last known position to recenter
the map and enter active lock state (no geolocate event will follow unless the users's location changes).


##### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#trackuserlocationstart-example)

```js
// Initialize the geolocate control.
const geolocate = new maptilersdk.GeolocateControl({
positionOptions: {
    enableHighAccuracy: true
},
trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
// Set an event listener that fires
// when a trackuserlocationstart event occurs.
geolocate.on('trackuserlocationstart', function() {
console.log('A trackuserlocationstart event has occurred.')
});
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/controls/\#maptilergeolocatecontrol-related)

- [Locate the user](https://docs.maptiler.com/sdk-js/examples/geolocate-control/)

## [MaptilerTerrainControl](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerterraincontrol)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/MaptilerTerrainControl.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/MaptilerTerrainControl.ts)

The `MaptilerTerrainControl` shows a button to enable/disable the 3D terrain (does not tilt the map)

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerterraincontrol-example)

```js
const terrain3d = new maptilersdk.MaptilerTerrainControl();
map.addControl(terrain3d, 'top-left');
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerterraincontrol-related)

- [Display a 3D terrain map](https://docs.maptiler.com/sdk-js/examples/3d-map/)

## [AttributionControl](https://docs.maptiler.com/sdk-js/api/controls/\#attributioncontrol)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/control/attribution\_control.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/control/attribution_control.ts)

An `AttributionControl` control presents the map's attribution information.
By default, the attribution control is expanded (regardless of map width).

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#attributioncontrol-example)

```js
const map = new maptilersdk.Map({attributionControl: false})
.addControl(new maptilersdk.AttributionControl({
    compact: true
}));
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#attributioncontrol-parameters)

options`(Object?)`(default
`{}`)

| options.compact<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)? | If<br> `true`<br> , force a compact attribution that shows the full attribution on mouse hover. If<br> `false`<br> , force the full attribution control. The default is a responsive attribution that collapses when the<br> map is less than 640 pixels wide.<br> **Attribution should not be collapsed if it can comfortably fit on the map. `compact`**<br>**should only be used to modify default attribution when map size makes it impossible to fit default**<br>**attribution and when the automatic compact resizing for default settings are not**<br>**sufficient.** |
| options.customAttribution<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>\| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) >)? | String or strings to show in addition to any other attributions. |

## [ScaleControl](https://docs.maptiler.com/sdk-js/api/controls/\#scalecontrol)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/control/scale\_control.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/control/scale_control.ts)

A `ScaleControl` control displays the ratio of a distance on the map to the corresponding distance
on the ground.

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#scalecontrol-example)

```js
const scale = new maptilersdk.ScaleControl({
maxWidth: 80,
unit: 'imperial'
});
map.addControl(scale);

scale.setUnit('metric');
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#scalecontrol-parameters)

options`(Object?)`

| options.maxWidth<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>default: '100' | The maximum length of the scale control in pixels. |
| options.unit<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: 'metric' | Unit of the distance (<br> `'imperial'`<br> ,<br> `'metric'`<br> or<br> `'nautical'`<br> ). |

### [Methods](https://docs.maptiler.com/sdk-js/api/controls/\#scalecontrol-instance-members)

setUnit(unit)

Set the scale's unit of the distance

##### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#setunit-parameters)

unit`(Unit)`Unit of the
distance (
`'imperial'`
,
`'metric'`
or
`'nautical'`
).


## [FullscreenControl](https://docs.maptiler.com/sdk-js/api/controls/\#fullscreencontrol)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/control/fullscreen\_control.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/control/fullscreen_control.ts)

A `FullscreenControl` control contains a button for toggling the map in and out of fullscreen mode.


### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#fullscreencontrol-example)

```js
map.addControl(new maptilersdk.FullscreenControl({container: document.querySelector('body')}));
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#fullscreencontrol-parameters)

options`(Object?)`

| options.container<br>[HTMLElement](https://developer.mozilla.org/docs/Web/HTML/Element)? | `container`<br> is the<br> [compatible\<br> DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen#Compatible_elements)<br> which should be made full screen. By default, the map container element will be made full screen. |

### [Related examples](https://docs.maptiler.com/sdk-js/api/controls/\#fullscreencontrol-related)

- [View a fullscreen map](https://docs.maptiler.com/sdk-js/examples/fullscreen/)

## [MaptilerLogoControl](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerlogocontrol)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/MaptilerLogoControl.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/MaptilerLogoControl.ts)

A `MaptilerLogoControl` replaces MaplibreLogoControl.

Can be used only with paid account

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerlogocontrol-example)

```js
const logo = new maptilersdk.MaptilerLogoControl({
  logoURL: "https://api.maptiler.com/resources/logo.svg",
  linkURL: "https://www.maptiler.com"
});
map.addControl(logo, 'bottom-left');
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#customlogocontrol-parameters)

options`(Object?)`

| options.logoURL<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: "" | Image logo URL. |
| options.linkURL<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)<br>default: "" | Logo link URL |

## [MaptilerMinimapControl](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerminimapcontrol)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/Minimap.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/Minimap.ts)

A `MaptilerMinimapControl` control. Display a overview (minimap) in a user defined corner of the map

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerminimapcontrol-parameters)

options`(Object?)`

| options.style![MapTiler logo](https://docs.maptiler.com/favicon.ico)<br>( [ReferenceMapStyle](https://docs.maptiler.com/sdk-js/api/map-styles/#referencemapstyle) \| <br>[MapStyleVariant](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstylevariant) \|<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \|<br>[StyleSpecification](https://docs.maptiler.com/gl-style-specification/))? | The map's style. This must be:<br> <br>- ReferenceMapStyle (e.g. MapStyle.STREETS)<br>- MapStyleVariant (e.g. MapStyle.STREETS.DARK)<br>- MapTIler Style ID (e.g. “streets-v2”)<br>- uuid of custom style<br>- an a JSON object<br>   conforming to<br>   the schema described in the<br>   [GL Style Specification](https://docs.maptiler.com/gl-style-specification/)<br>- a URL to<br>   such JSON. |
| options.zoomAdjust<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?<br>default: -4 | Set the zoom difference between the parent and the minimap.<br> If the parent is zoomed to 10 and the minimap is zoomed to 8, the zoomAdjust should be 2. |
| options.lockZoom<br>[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)? | Set a zoom of the minimap and don't allow any future changes. |
| options.pitchAdjust<br>[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?<br>default: false | Adjust the pitch only if the user requests. |
| options.containerStyle<br>Record< [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) >? | Set CSS properties of the container using object key-values. |
| options.position<br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?<br>default: `'bottom-left'` | Set the position of the minimap.<br> Valid values are<br> `'top-left'`<br> ,<br> `'top-right'`<br> ,<br> `'bottom-left'`<br> , and<br> `'bottom-right'`<br> . |
| options.parentRect<br>[ParentRect](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/Minimap.ts)? | Set the parentRect fill and/or line options. |

## [MaptilerProjectionControl](https://docs.maptiler.com/sdk-js/api/controls/\#MaptilerProjectionControl)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/control/globe\_control.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/control/globe_control.ts)

A `MaptilerProjectionControl` control contains a button for toggling the map projection between "mercator" and "globe".


### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#MaptilerProjectionControl-example)

```js
map.addControl(new maptilersdk.MaptilerProjectionControl());
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/controls/\#MaptilerProjectionControl-related)

- [Projection control how to toggle the map between mercator and globe projection](https://docs.maptiler.com/sdk-js/examples/globe-control/)

## [MaptilerExternalControl](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerexternalcontrol)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/controls/MaptilerExternalControl.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/MaptilerExternalControl.ts)

The `MaptilerExternalControl` allows any existing element to automatically become a map control.
Used for detected controls if `customControls` config is turned on.


### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerexternalcontrol-example)

```js
const zoomInControl = new maptilersdk.MaptilerExternalControl(
  ".zoom-in-control",
  "zoom-in"
);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#maptilerexternalcontrol-parameters)

controlElement
(`HTMLElement`):
Element to be used as control, specified as either reference to element itself or a CSS selector to find the element in DOM


controlType
(`MaptilerExternalControlType`):
One of the predefined types of functionality. Allowed values:
`zoom-in` \|
`zoom-out` \|
`toggle-projection` \|
`toggle-terrain` \|
`reset-view` \|
`reset-bearing` \|
`reset-pitch` \|
`reset-roll`

## [MaptilerCustomControl](https://docs.maptiler.com/sdk-js/api/controls/\#maptilercustomcontrol)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/controls/MaptilerCustomControl.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/MaptilerCustomControl.ts)

The `MaptilerCustomControl` allows any existing element to become a map control.

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#maptilercustomcontrol-example)

```js
const panControl = new maptilersdk.MaptilerCustomControl(
  ".pan-control",
  (map) => map.panBy([10, 10]), // Move southeast when clicked
  (map, el) => el.classList.toggle( // Change class based on current hemisphere
    "northern-hemisphere", map.getCenter().lat > 0
  )
);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#maptilercustomcontrol-parameters)

selectorOrElement
(`string` \| `HTMLElement`):
Element to be used as control, specified as either reference to element itself or a CSS selector to find the element in DOM


onClick
(`MaptilerCustomControlCallback<PointerEvent>?`):
Function called when the element is clicked


onRender
(`MaptilerCustomControlCallback<MapLibreEvent>?`):
Function called every time the underlying map renders a new state


Both callbacks receive the active `Map` instance,
the associated control element itself, and an event object associated with the original event
(`PointerEvent` and
`MapLibreEvent` respectively).


### [Related examples](https://docs.maptiler.com/sdk-js/api/controls/\#maptilercustomcontrol-related)

- [How to add a custom control programmatically](https://docs.maptiler.com/sdk-js/examples/custom-controls-programmatic/)

## [IControl](https://docs.maptiler.com/sdk-js/api/controls/\#icontrol)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/control/control.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/control/control.ts)

Interface for interactive controls added to the map. This is a
specification for implementers to model: it is not
an exported method or class. This interface is the one to use to create custom controls.

Controls must implement `onAdd` and `onRemove`, and must own an
element, which is often a `div` element. To use MapLibre GL JS's
default control styling, add the `maplibregl-ctrl` class to your control's
node.

### [Example](https://docs.maptiler.com/sdk-js/api/controls/\#icontrol-example)

```js
// Control implemented as ES6 class
class HelloWorldControl {
  onAdd(map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'maplibregl-ctrl';
      this._container.textContent = 'Hello, world';
      return this._container;
  }

  onRemove() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
  }
}

// Control implemented as ES5 prototypical class
function HelloWorldControl() { }

HelloWorldControl.prototype.onAdd = function(map) {
  this._map = map;
  this._container = document.createElement('div');
  this._container.className = 'maplibregl-ctrl';
  this._container.textContent = 'Hello, world';
  return this._container;
};

HelloWorldControl.prototype.onRemove = function () {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
};
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/controls/\#icontrol-instance-members)

getDefaultPosition()

Optionally provide a default position for this control. If this method
is implemented and [Map#addControl](https://docs.maptiler.com/sdk-js/api/map/#map#addcontrol) is called
without the `position`
parameter, the value returned by getDefaultPosition will be used as the
control's position.

##### [Returns](https://docs.maptiler.com/sdk-js/api/controls/\#getdefaultposition-returns)

`ControlPosition`:
a control position, one of the values valid in addControl.


onAdd(map)

Register a control on the map and give it a chance to register event listeners
and resources. This method is called by [Map#addControl](https://docs.maptiler.com/sdk-js/api/map/#map#addcontrol)
internally.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#onadd-parameters)

map`(Map)`the
Map this control will be added to


##### [Returns](https://docs.maptiler.com/sdk-js/api/controls/\#onadd-returns)

`HTMLElement`:
The control's container element. This should
be created by the control and returned by onAdd without being attached
to the DOM: the map will insert the control's element into the DOM
as necessary.


onRemove(map)

Unregister a control on the map and give it a chance to detach event listeners
and resources. This method is called by [Map#removeControl](https://docs.maptiler.com/sdk-js/api/map/#map#removecontrol)
internally.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/controls/\#onremove-parameters)

map`(Map)`the
Map this control will be removed from


##### [Returns](https://docs.maptiler.com/sdk-js/api/controls/\#onremove-returns)

`undefined`:
there is no required return value for this method



Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Easy to add controls](https://docs.maptiler.com/sdk-js/api/controls/#easyaddcontrols)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#easyaddcontrols-example)
- [Custom controls](https://docs.maptiler.com/sdk-js/api/controls/#customcontrols)
  - [Related\\
     examples](https://docs.maptiler.com/sdk-js/api/controls/#customcontrols-related)
  - [Programmatic\\
     Controls](https://docs.maptiler.com/sdk-js/api/controls/#programmatic-controls)
  - [Declarative\\
     Controls](https://docs.maptiler.com/sdk-js/api/controls/#declarative-controls)
- [MaptilerNavigationControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilernavigationcontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#maptilernavigationcontrol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#maptilernavigationcontrol-parameters)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/controls/#maptilernavigationcontrol-related)
- [MaptilerGeolocateControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilergeolocatecontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#maptilergeolocatecontrol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#maptilergeolocatecontrol-parameters)
  - [Methods](https://docs.maptiler.com/sdk-js/api/controls/#maptilergeolocatecontrol-instance-members)
  - [Events](https://docs.maptiler.com/sdk-js/api/controls/#maptilergeolocatecontrol-events)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/controls/#maptilergeolocatecontrol-related)
- [MaptilerTerrainControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilerterraincontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#maptilerterraincontrol-example)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/controls/#maptilerterraincontrol-related)
- [AttributionControl](https://docs.maptiler.com/sdk-js/api/controls/#attributioncontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#attributioncontrol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#attributioncontrol-parameters)
- [ScaleControl](https://docs.maptiler.com/sdk-js/api/controls/#scalecontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#scalecontrol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#scalecontrol-parameters)
  - [Methods](https://docs.maptiler.com/sdk-js/api/controls/#scalecontrol-instance-members)
- [FullscreenControl](https://docs.maptiler.com/sdk-js/api/controls/#fullscreencontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#fullscreencontrol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#fullscreencontrol-parameters)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/controls/#fullscreencontrol-related)
- [MaptilerLogoControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilerlogocontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#maptilerlogocontrol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#customlogocontrol-parameters)
- [MaptilerMinimapControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilerminimapcontrol)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#maptilerminimapcontrol-parameters)
- [MaptilerProjectionControl](https://docs.maptiler.com/sdk-js/api/controls/#MaptilerProjectionControl)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#MaptilerProjectionControl-example)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/controls/#MaptilerProjectionControl-related)
- [MaptilerExternalControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilerexternalcontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#maptilerexternalcontrol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#maptilerexternalcontrol-parameters)
- [MaptilerCustomControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilercustomcontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#maptilercustomcontrol-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/controls/#maptilercustomcontrol-parameters)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/controls/#maptilercustomcontrol-related)
- [IControl](https://docs.maptiler.com/sdk-js/api/controls/#icontrol)
  - [Example](https://docs.maptiler.com/sdk-js/api/controls/#icontrol-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/controls/#icontrol-instance-members)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Controls

Controls

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)