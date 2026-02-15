# Types

## [CameraUpdateTransformFunction](https://docs.maptiler.com/sdk-js/api/types/\#CameraUpdateTransformFunction)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/camera.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/camera.ts)

A callback hook that allows manipulating the camera and being notified about camera updates before they happen.

```js
CameraUpdateTransformFunction(next: object) => object
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/types/\#CameraUpdateTransformFunction-parameters)

next`
        { bearing: number; center: LngLat; elevation: number; pitch: number; roll: number; zoom: number; }
`

next.bearing`number`

next.center`LngLat`

next.elevation`number`

next.pitch`number`

next.roll`number`

next.zoom`number`

## [RequestTransformFunction](https://docs.maptiler.com/sdk-js/api/types/\#RequestTransformFunction)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/util/request\_manager.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/util/request_manager.ts)

This function is used to tranform a request. It is used just before executing the relevant request.

```js
RequestTransformFunction: (url: string, resourceType?: ResourceType) => RequestParameters | undefined
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/types/\#RequestTransformFunction-parameters)

url`string`

resourceType ? [`ResourceType`](https://docs.maptiler.com/sdk-js/api/types/#ResourceType)

## [ResourceType](https://docs.maptiler.com/sdk-js/api/types/\#ResourceType)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/util/request\_manager.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/util/request_manager.ts)

A type of MapLibre resource.

### [Enumeration members](https://docs.maptiler.com/sdk-js/api/types/\#ResourceType-enumeration)

Glyphs

Image

Source

SpriteImage

SpriteJSON

Style

Tile

Unknown

## [Subscription](https://docs.maptiler.com/sdk-js/api/types/\#Subscription)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/util/util.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/util/util.ts)

Allows to unsubscribe from events without the need to store the method reference.

### [Methods](https://docs.maptiler.com/sdk-js/api/types/\#Subscription-methods)

#### [unsubscribe()](https://docs.maptiler.com/sdk-js/api/types/\#unsubscribe)

Unsubscribes from the event.

### [Returns](https://docs.maptiler.com/sdk-js/api/types/\#unsubscribe-returns)

`void`

## [StyleSetterOptions](https://docs.maptiler.com/sdk-js/api/types/\#StyleSetterOptions)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/style/style.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/style/style.ts)

Supporting type to add validation to another style related type.

### [Type declaration](https://docs.maptiler.com/sdk-js/api/types/\#StyleSetterOptions-types)

validate?`boolean`Whether to check if the filter conforms to the MapLibre Style Specification.
Disabling validation is a performance optimization that should only be used if you have previously validated
the values you will be passing to this function.


## [CubemapLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/\#CubemapLayerConstructorOptions)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/custom-layers/CubemapLayer/types.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/custom-layers/CubemapLayer/types.ts)

Constructor options for the CubemapLayer.

### [Usage](https://docs.maptiler.com/sdk-js/api/types/\#CubemapLayerConstructorOptions-usage)

#### [Simple space](https://docs.maptiler.com/sdk-js/api/types/\#simple-usage)

You can enable a simple space background with a solid color:


```js
const map = new maptilersdk.Map({
  container: document.getElementById("map"),
  style: maptilersdk.MapStyle.OUTDOOR,
  space: {
    color: "#111122", // Dark space-like color
  },
});
```

JavaScript

Copy

#### [Predefined Presets](https://docs.maptiler.com/sdk-js/api/types/\#predefined-presets-usage)

Alternatively, you can provide a cubemap for a space backround using one of the following methods:


- `space`
: Dark blue hsl(210, 100%, 4%) background and white stars (transparent background image).
Space color changes the background color, stars always stay white.

- `stars`
(default): Black background (image mask), space color changes the stars color, background always stays black.

- `milkyway`
: Black half-transparent background with standard milkyway and stars.
Space color changes the stars and milkyway color, background always stays black.

- `milkyway-subtle`
: Black half-transparent background with subtle milkyway and less stars.
Space color changes the stars and milkyway color, background always stays black.
Black half-transparent background with standard milkyway and stars.
Space color changes the stars and milkyway color, background always stays black.

- `milkyway-bright`
: Black half-transparent background with bright milkyway and more stars.
Space color changes the stars and milkyway color, background always stays black.


```js
const map = new maptilersdk.Map({
  container: document.getElementById("map"),
  style: maptilersdk.MapStyle.SATELLITE,
  projection: "globe",
  space: {
    preset: "milkyway-bright",
  },
});
```

JavaScript

Copy

#### [Cubemap Images (Custom Skybox)](https://docs.maptiler.com/sdk-js/api/types/\#cubemap-images-usage)

Load your custom cubemap images:


```js
const map = new maptilersdk.Map({
  container: document.getElementById("map"),
  style: maptilersdk.MapStyle.OUTDOOR,
  projection: "globe",
  space: {
    faces: {
      nX: '/path-to-image/nX.png',
      nY: '/path-to-image/nY.png',
      nZ: '/path-to-image/nZ.png',
      pX: '/path-to-image/pX.png',
      pY: '/path-to-image/pY.png',
      pZ: '/path-to-image/pZ.png',
    },
  },
});
```

JavaScript

Copy

#### [Cubemap Path with image format](https://docs.maptiler.com/sdk-js/api/types/\#cubemap-path-format-usage)

This fetches all images from a path, this assumes all files are named px, nx, py, ny, pz, nz and
suffixed with the appropriate extension specified in `format`.


```js
const map = new maptilersdk.Map({
  container: document.getElementById("map"),
  style: maptilersdk.MapStyle.WINTER,
  projection: "globe",
  space: {
    path: {
      baseUrl: "spacebox/transparent",
      format: "png", // Defaults to PNG
    },
  },
});
```

JavaScript

Copy

#### [Set the space background dynamically](https://docs.maptiler.com/sdk-js/api/types/\#space-dynamically-usage)

You can also set the space dynamically after the map loads:


```js
map.on("load", () => {
  map.setSpace({
    color: "red",
    path: {
      baseUrl: "spacebox/transparent",
    },
  });
});
```

JavaScript

Copy

- Cubemap face images must be square and have a height / width of a power of 2 512px, 1024px
- if `space.color` or
`space.<faces | path | preset></faces>` are not explicitly
set in the call to `setSpace`,
then the previous value will remain for this field.
To override the default, set the required field to `null`.

## [RadialGradientLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/\#RadialGradientLayerConstructorOptions)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/custom-layers/RadialGradientLayer/types.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/custom-layers/RadialGradientLayer/types.ts)

Options for constructing a RadialGradientLaye.

### [Usage](https://docs.maptiler.com/sdk-js/api/types/\#RadialGradientLayerConstructorOptions-usage)

#### [Simple halo](https://docs.maptiler.com/sdk-js/api/types/\#simple-halo-usage)

You can enable a simple halo by setting it to `true`:


```js
const map = new maptilersdk.Map({
  container: document.getElementById("map"),
  style: maptilersdk.MapStyle.STREETS,
  projection: "globe",
  halo: true,
});
```

JavaScript

Copy

#### [Radial gradient](https://docs.maptiler.com/sdk-js/api/types/\#radial-gradient-halo-usage)

For more customization, you can define a radial gradient with scale and stops:


```js
const map = new maptilersdk.Map({
  container: document.getElementById("map"),
  style: maptilersdk.MapStyle.OUTDOOR,
  projection: "globe",
  halo: {
    scale: 1.5, // Halo size in multiples of the Earth's radius
    stops: [\
      [0.2, "transparent"],\
      [0.2, "red"],\
      [0.4, "red"],\
      [0.4, "transparent"],\
      [0.6, "transparent"],\
      [0.6, "red"],\
      [0.8, "red"],\
      [0.8, "transparent"],\
      [1.0, "transparent"],\
    ],
  },
});
```

JavaScript

Copy

#### [Set the halo dynamically](https://docs.maptiler.com/sdk-js/api/types/\#halo-dynamically-usage)

You can also set the halo dynamically after the map loads:


```js
map.on("load", () => {
  map.setHalo({
    scale: 2, // Halo size in multiples of the Earth's radius
    stops: [\
      [0.0, "rgba(135,206,250,1)"],\
      [0.5, "rgba(0,0,250,0.75)"],\
      [0.75, "rgba(250,0,0,0.0)"],\
    ],
  });
});
```

JavaScript

Copy

## [MaptilerCustomControlCallback](https://docs.maptiler.com/sdk-js/api/types/\#MaptilerCustomControlCallback)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/controls/MaptilerCustomControl.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/controls/MaptilerCustomControl.ts)

A callback hook used by a [MaptilerCustomControl](https://docs.maptiler.com/sdk-js/api/controls/#maptilercustomcontrol).

```js
MaptilerCustomControlCallback(map: SDKMap, element: HTMLElement, event: E) => void
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/types/\#MaptilerCustomControlCallback-parameters)

map`SDKMap`

element`HTMLElement`

event`Event`

## [ImageMetadata](https://docs.maptiler.com/sdk-js/api/types/\#ImageMetadata)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ImageViewer/ImageViewer.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/ImageViewer/ImageViewer.ts)

The metadata of the image. This is the shape of the response from the API. And used to convert px to lnglat and vice versa..

```json
{
    attribution: string;
    description: string;
    height: number;
    id: string;
    maxzoom: number;
    minzoom: number;
    tileSize: number;
    width: number;
}
```

JSON

Copy

### [Type declaration](https://docs.maptiler.com/sdk-js/api/types/\#StyleSetterOptions-types)

attribution`string`

description`string`

height`number`

id`string`

maxzoom`number`

minzoom`number`

tileSize`number`

width`number`


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [CameraUpdateTransformFunction](https://docs.maptiler.com/sdk-js/api/types/#CameraUpdateTransformFunction)
- [RequestTransformFunction](https://docs.maptiler.com/sdk-js/api/types/#RequestTransformFunction)
- [ResourceType](https://docs.maptiler.com/sdk-js/api/types/#ResourceType)
- [Subscription](https://docs.maptiler.com/sdk-js/api/types/#Subscription)
- [StyleSetterOptions](https://docs.maptiler.com/sdk-js/api/types/#StyleSetterOptions)
- [CubemapLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/#CubemapLayerConstructorOptions)
- [RadialGradientLayerConstructorOptions](https://docs.maptiler.com/sdk-js/api/types/#RadialGradientLayerConstructorOptions)
- [MaptilerCustomControlCallback](https://docs.maptiler.com/sdk-js/api/types/#MaptilerCustomControlCallback)
- [ImageMetadata](https://docs.maptiler.com/sdk-js/api/types/#ImageMetadata)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Types

Types

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)