# Helpers![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/helpers/vectorlayerhelpers.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/helpers/vectorlayerhelpers.ts)

Helpers are a set of functions to facilitate the creation of sources and layers.
All the helpers are made avaialable under the `helpers` object.

###### Example

- NPM module
- Basic JavaScript

```js
maptilersdk.helpers.addPolyline(map, {
  // dataset UUID, a URL (relative or absolute)
  data: "some-trace.geojson",
});
```

JavaScript

Copy

```js
import { helpers } from "@maptiler/sdk";

helpers.addPolyline(map, {
  // dataset UUID, a URL (relative or absolute)
  data: "some-trace.geojson",
});
```

JavaScript

Copy

## [Vector Layer Helpers](https://docs.maptiler.com/sdk-js/api/helpers/\#vector-layer-helpers)

**Let's make vector layers easy!**
Originaly, you'd have to add a source and then proceed to the styling of your layer,
which can be tricky because there are a lot of paint and layout options and they vary a lot from one type of layer to another.
**But we have helpers for this!**

![](https://docs.maptiler.com/sdk-js/api/helpers/img/point-layer.jpg)

Vector Layer Helpers:


- [Polyline Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#polyline)
- [Polygon Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#polygon)
- [Point Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#point)
- [Heatmap Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap)

## [Shared logic](https://docs.maptiler.com/sdk-js/api/helpers/\#shared-logic)

Helpers come with a lot of **built-in defaults** and some fail-proof logic that makes creating vector layers much easier!
As a result, a dataset can be displayed in one call, creating both the datasource and the layer(s) in one go!

Depending on the type of feature to add ( [point](https://docs.maptiler.com/sdk-js/api/helpers/#point), [polyline](https://docs.maptiler.com/sdk-js/api/helpers/#polyline),
[polygon](https://docs.maptiler.com/sdk-js/api/helpers/#polygon) or [heatmap](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap)), a different helper function needs to be used,
but datasource could contain mixed types of feature and the helper will only display a specific type.
**Example:** we have a _geoJSON_ file that contains both _polygons_ and _point_ and we use
it as the data property on the `helpers.addPoint(map, {options})`, this will only add the _points_.

In addition to easy styling, helper's datasource can be:


- a URL to a geoJSON file or its string content
- a URL to a GPX or KML file (only for the polyline helper) or its string content
- a UUID of a [MapTiler dataset](https://cloud.maptiler.com/data/)

### [Multiple Layers](https://docs.maptiler.com/sdk-js/api/helpers/\#multiple-layers)

The key design principle of these vector layers helpers is **it's easy to make what you want**.
Helpers can create multiple layers to represent the symbolization of a layer, if necessary.

###### Example

To create a road with an outline with the [Polyline Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#polyline), you just say if you want an outline and specify its size
(or even a zoom dependant size) and everything is handled for you.
As a result, the `helpers.addPolyline` method will return an object with **multiple IDs**:
ID of the top/main layer, ID of the outline layer (could be `null`) and the ID of the data source.
This makes further layer and source manipulation possible.

Without the helpers to create a road with an outline, one must draw two layers:
a wider base layer and a narrower top layer, fueled by the same polyline data.
This requires ordering the layers properly and computing not the width of the outline,
but rather the width of the polyline underneath so that it outgrows the top road layer of the desired number of pixels.

### [CommonShapeLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/\#CommonShapeLayerOptions)

The vector layer helper also share some _I/O_ logic:
each of them can take many options but a subset of them is common across all the helpers:

| options.layerId?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | ID to give to the layer.<br> If not provided, an auto-generated ID like "maptiler-layer-xxxxxx" will be auto-generated,<br> with "xxxxxx" being a random string. |
| options.sourceId?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | ID to give to the source.<br> If not provided, an auto-generated ID like "maptiler-source-xxxxxx" will be auto-generated,<br> with "xxxxxx" being a random string. |
| options.data<br>(`FeatureCollection` \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | A geojson Feature collection or a URL to a geojson or <br> the UUID of a MapTiler dataset. |
| options.beforeId?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | The ID of an existing layer to insert the new layer before, resulting in the new layer appearing<br> visually beneath the existing layer. If this argument is not specified, the layer will be appended<br> to the end of the layers array and appear visually above all other layers. |
| options.minzoom?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))<br>default: 0 | Zoom level at which it starts to show. |
| options.maxzoom?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))<br>default: 22 | Zoom level after which it no longer show. |
| options.outline?<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))<br>default: false | Whether or not to add an outline. |
| options.outlineColor?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| <br>[ZoomStringValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomStringValues))<br>default: `white` | Color of the outline. This is can be a constant color string or a definition based on zoom levels.<br> Applies only if `.outline` is `true`. |
| options.outlineWidth?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 1 | Width of the outline (relative to screen-space). This is can be a constant width or a definition based on zoom levels.<br> Applies only if `.outline` is `true`. |
| options.outlineOpacity?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 1 | Opacity of the outline. This is can be a constant opacity in \[0, 1\] or a definition based on zoom levels.<br> Applies only if `.outline` is `true`. |

## [Polyline Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/\#polyline)

The polyline helper makes it easy to create vector layers that contain polylines.
Whenever it's possible and it makes sense, we use the same terminology across the different helpers.

### [Methods](https://docs.maptiler.com/sdk-js/api/helpers/\#polyline-members)

The method `helpers.addPolyline` is not only compatible with the traditionnal
**GeoJSON** source but also with **GPX** and **KML** files and the
`data` option can be a MapTiler dataset UUID and will be resolved automatically.

Minimal usage, with the default line width and a random color (withing a selected list)

```js
import { helpers } from "@maptiler/sdk";

helpers.addPolyline(map, {
  // dataset UUID, a URL (relative or absolute)
  data: "some-trace.geojson",
});
```

JavaScript

Copy

addPolyline(map, options, fetchOptions?)

Add a polyline to the map from various sources and with builtin styling.

Compatible sources:


- uuid of a MapTiler dataset
- geojson from url
- geojson content as string
- geojson content as JS object
- gpx content as string
- gpx file from URL
- kml content from string
- kml from url

The method also gives the possibility to add an outline layer (if \`options.outline\` is \`true\`)
and if so , the returned property \`polylineOutlineLayerId\` will be a string. As a result, two layers
would be added.


The default styling creates a line layer of constant width of 3px, the color will be randomly picked
from a curated list of colors and the opacity will be 1.
If the outline is enabled, the outline width is of 1px at all zoom levels, the color is white and
the opacity is 1.


Those style properties can be changed and ramped according to zoom level using an easier syntax.


[Parameters](https://docs.maptiler.com/sdk-js/api/helpers/#addPolyline-parameters)

map
([`Map`](https://docs.maptiler.com/sdk-js/api/map))
: The [Map](https://docs.maptiler.com/sdk-js/api/map) instance to add the polyline layer.


options
([`PolylineLayerOptions`](https://docs.maptiler.com/sdk-js/api/helpers/#polyline-options))
: [Polyline Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#polyline) options.


fetchOptions
([`RequestInit`](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)?)
: An object containing any custom settings that you want to apply to the request.


[Returns](https://docs.maptiler.com/sdk-js/api/helpers/#addPolyline-returns)

`Promise`: `{
              polylineLayerId: string;
              polylineOutlineLayerId: string;
              polylineSourceId: string;
            }`

[Related examples](https://docs.maptiler.com/sdk-js/api/helpers/#addPolyline-related)

- [Add a GPX Line layer](https://docs.maptiler.com/sdk-js/examples/helper-polyline-gpx/)
- [Add a KML Line layer](https://docs.maptiler.com/sdk-js/examples/helper-polyline-kml/)
- [Line color ramp symbol](https://docs.maptiler.com/sdk-js/examples/helper-polyline-ramped-style/)
- [Line dash pattern symbol](https://docs.maptiler.com/sdk-js/examples/helper-polyline-dash-array/)
- [Line layer](https://docs.maptiler.com/sdk-js/examples/helper-polyline-minimal/)
- [Line outline glow blur symbol](https://docs.maptiler.com/sdk-js/examples/helper-polyline-blur/)
- [Style a GeoJSON Line layer](https://docs.maptiler.com/sdk-js/examples/helper-polyline-simple/)

![](https://docs.maptiler.com/sdk-js/api/helpers/img/default-trace.jpg)

### [PolylineLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/\#polyline-options)

[Extends](https://docs.maptiler.com/sdk-js/api/helpers/#polyline-options) [CommonShapeLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/#CommonShapeLayerOptions)

| options.lineColor?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| <br>[ZoomStringValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomStringValues))<br>default: a color randomly pick from a list | Color of the line (or polyline). This is can be a constant color string or a definition based on zoom levels. |
| options.lineWidth?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 3 | Width of the line (relative to screen-space). This is can be a constant width or a definition based on zoom levels. |
| options.lineOpacity?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 1 | Opacity of the line. This is can be a constant opacity in \[0, 1\] or a definition based on zoom levels. |
| options.lineBlur?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 0 | How blury the line is, with \`0\` being no blur and \`10\` and beyond being quite blurry. |
| options.lineGapWidth?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 0 | Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap. |
| options.lineDashArray?<br>( [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \> \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))<br>default: no dash pattern | Sequence of line and void to create a dash pattern. The unit is the line width so that<br>a dash array value of `[3, 1]` <br>will create a segment worth 3 times the width of the line,<br>followed by a spacing worth 1 time the line width, and then repeat.<br> <br>Alternatively, this property can be a string made of underscore and whitespace characters<br>such as `"___ _ "` and internaly this will be translated <br>into `[3, 1, 1, 1]`. Note that<br>this way of describing dash arrays with a string only works for integer values.<br> <br>Dash arrays can contain more than 2 element to create more complex patters. For instance<br>a dash array value of `[3, 2, 1, 2]` will create the following sequence:<br> <br>- a segment worth 3 times the width<br>- a spacing worth 2 times the width<br>- a segment worth 1 times the width<br>- a spacing worth 2 times the width<br>- repeat |
| options.lineCap?<br>(`"butt"` \| <br>`"round"` \| `"square"`)<br>default: `"round"` | The display of line endings for both the line and the outline <br> (if `.outline` is `true`).<br> <br>- `"butt"`:<br>   A cap with a squared-off end which is drawn to the exact endpoint of the line.<br>   <br>- `"round"`:<br>   A cap with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.<br>   <br>- `"square"`:<br>   A cap with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width. |
| options.lineJoin?<br>(`"bevel"` \| <br>`"round"` \| `"miter"`)<br>default: `"round"` | The display of lines when joining for both the line and the outline <br> (if `.outline` is `true`).<br> <br>- `"bevel"`:<br>   A join with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.<br>   <br>- `"round"`:<br>   A join with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.<br>   <br>- `"miter"`:<br>   A join with a sharp, angled corner which is drawn with the outer sides beyond the endpoint of the path until they meet. |
| options.outlineBlur?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 0 | How blury the outline is, with \`0\` being no blur and \`10\` and beyond being quite blurry.<br> Applies only if `.outline` is `true`. |

### [Examples](https://docs.maptiler.com/sdk-js/api/helpers/\#polyline-examples)

Check out the full list of [examples](https://docs.maptiler.com/sdk-js/examples/?q=polyline+helper)

We can add many options, such a a specific color, a custom width or a dash pattern,
this time sourcing the data from MapTiler, using the UUID of a dataset:

```js
import { helpers } from "@maptiler/sdk";

helpers.addPolyline(map, {
  data: "74003ba7-215a-4b7e-8e26-5bbe3aa70b05",
  lineColor: "#FF6666",
  lineWidth: 4,
  lineDashArray: "____ _ ",
  lineCap: "butt",
});
```

JavaScript

Copy

![](https://docs.maptiler.com/sdk-js/api/helpers/img/custom-trace.jpg)

As you can see, we've come up with a fun and easy way to create **dash arrays**,
just use underscores and white spaces and this pattern will repeat!

Adding an outline is also pretty straightforward:

```js
import { helpers } from "@maptiler/sdk";

helpers.addPolyline(map, {
  data: "74003ba7-215a-4b7e-8e26-5bbe3aa70b05",
  lineColor: "#880000",
  outline: true,
});
```

JavaScript

Copy

![](https://docs.maptiler.com/sdk-js/api/helpers/img/polyline-outline.png)

Endless possibilities, what about a glowing wire?

```js
import { helpers } from "@maptiler/sdk";

helpers.addPolyline(map, {
  data: "74003ba7-215a-4b7e-8e26-5bbe3aa70b05",
  lineColor: "#fff",
  lineWidth: 1,
  outline: true,
  outlineColor: "#ca57ff",
  outlineWidth: 2,
  outlineWidth: 10,
  outlineBlur: 10,
  outlineOpacity: 0.5,
});
```

JavaScript

Copy

![](https://docs.maptiler.com/sdk-js/api/helpers/img/polyline-glow.png)

View more [Polyline Layer Helper examples](https://docs.maptiler.com/sdk-js/examples/?q=polyline+helper)

## [Polygon Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/\#polygon)

The polygon helper makes it easy to create vector layers that contain polygons, whether they are _multipolygons_,
_holedpolygons_ or just simple _polygons_.
Whenever it's possible and it makes sense, we use the same terminology across the different helpers.

### [Methods](https://docs.maptiler.com/sdk-js/api/helpers/\#polygon-members)

Minimal usage, with a half-transparent and a random color (withing a selected list) polygon of Switzerland, from a local file:

```js
import { helpers } from "@maptiler/sdk";

helpers.addPolygon(map, {
  data: "switzerland.geojson",
  fillOpacity: 0.5,
});
```

JavaScript

Copy

addPolygon(map, options)

Add a polygon with styling options.

Compatible sources:


- uuid of a MapTiler dataset
- geojson from url
- geojson content as string
- geojson content as JS object

The method also gives the possibility to add an outline layer (if \`options.outline\` is \`true\`)
and if so, the returned property \`polygonOutlineLayerId\` will be a string. As a result, two layers
would be added.


The default styling creates a line layer of constant width of 3px, the color will be randomly picked
from a curated list of colors and the opacity will be 1.
If the outline is enabled, the outline width is of 1px at all zoom levels, the color is white and
the opacity is 1.


Those style properties can be changed and ramped according to zoom level using an easier syntax.


[Parameters](https://docs.maptiler.com/sdk-js/api/helpers/#addPolygon-parameters)

map
([`Map`](https://docs.maptiler.com/sdk-js/api/map))
: The [Map](https://docs.maptiler.com/sdk-js/api/map) instance to add the polygon layer.


options
([`PolygonLayerOptions`](https://docs.maptiler.com/sdk-js/api/helpers/#polygon-options))
: [Polygon Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#polygon) options.


[Returns](https://docs.maptiler.com/sdk-js/api/helpers/#addPolygon-returns)

`Promise`: `{
              polygonLayerId: string;
              polygonOutlineLayerId: string;
              polygonSourceId: string;
            }`

[Related examples](https://docs.maptiler.com/sdk-js/api/helpers/#addPolygon-related)

- [Polygon fill pattern](https://docs.maptiler.com/sdk-js/examples/helper-polygon-pattern/)
- [Polygon color ramp symbol](https://docs.maptiler.com/sdk-js/examples/helper-polygon-ramped-style/)
- [Polygon layer](https://docs.maptiler.com/sdk-js/examples/helper-polygon-minimal/)

![](https://docs.maptiler.com/sdk-js/api/helpers/img/polygon-transparent.png)

### [PolygonLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/\#polygon-options)

[Extends](https://docs.maptiler.com/sdk-js/api/helpers/#polygon-options) [CommonShapeLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/#CommonShapeLayerOptions)

| options.fillColor?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| <br>[ZoomStringValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomStringValues))<br>default: a color randomly pick from a list | Color of the polygon. This is can be a constant color string or a definition based on zoom levels. |
| options.fillOpacity?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 1 | Opacity of the polygon. This is can be a constant opacity in \[0, 1\] or a definition based on zoom levels. |
| options.outlinePosition?<br>(`"center"` \| <br>`"inside"` \| `"outside"`)<br>default: `"center"` | Position of the outline with regard to the polygon edge<br> (when `.outline` is `true`). |
| options.outlineDashArray?<br>( [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) < [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \> \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))<br>default: no dash pattern | Sequence of line and void to create a dash pattern. The unit is the line width so that<br>a dash array value of `[3, 1]` <br>will create a segment worth 3 times the width of the line,<br>followed by a spacing worth 1 time the line width, and then repeat.<br> <br>Alternatively, this property can be a string made of underscore and whitespace characters<br>such as `"___ _ "` and internaly this will be translated <br>into `[3, 1, 1, 1]`. Note that<br>this way of describing dash arrays with a string only works for integer values.<br> <br>Dash arrays can contain more than 2 element to create more complex patters. For instance<br>a dash array value of `[3, 2, 1, 2]` will create the following sequence:<br> <br>- a segment worth 3 times the width<br>- a spacing worth 2 times the width<br>- a segment worth 1 times the width<br>- a spacing worth 2 times the width<br>- repeat |
| options.outlineCap?<br>(`"butt"` \| <br>`"round"` \| `"square"`)<br>default: `"round"` | The display of line endings for both the line and the outline <br> (if `.outline` is `true`).<br> <br>- `"butt"`:<br>   A cap with a squared-off end which is drawn to the exact endpoint of the line.<br>   <br>- `"round"`:<br>   A cap with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.<br>   <br>- `"square"`:<br>   A cap with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width. |
| options.outlineJoin?<br>(`"bevel"` \| <br>`"round"` \| `"miter"`)<br>default: `"round"` | The display of lines when joining for both the line and the outline <br> (if `.outline` is `true`).<br> <br>- `"bevel"`:<br>   A join with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.<br>   <br>- `"round"`:<br>   A join with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.<br>   <br>- `"miter"`:<br>   A join with a sharp, angled corner which is drawn with the outer sides beyond the endpoint of the path until they meet. |
| options.pattern?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| <br>[null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null))<br>default: null (no pattern, `fillColor` will be used) | The pattern is an image URL to be put as a repeated background pattern of the polygon. |
| options.outlineBlur?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 0 | How blury the outline is, with \`0\` being no blur and \`10\` and beyond being quite blurry.<br> Applies only if `.outline` is `true`. |

### [Examples](https://docs.maptiler.com/sdk-js/api/helpers/\#polygon-examples)

Check out the full list of [examples](https://docs.maptiler.com/sdk-js/examples/?q=polygon+helper)

We can add many options, such a a specific color, a custom width or a pattern,
this time sourcing the data from MapTiler, using the UUID of a dataset:

```js
import { helpers } from "@maptiler/sdk";

helpers.addPolygon(map, {
  data: "aa203ccf-25ee-4447-bef3-55f90916897a",
  pattern: "cheese512.png",
  outline: true,
  outlineWidth: 3,
  outlineColor: "white",
  outlineDashArray: "_ ",
  fillOpacity: 0.7,
});
```

JavaScript

Copy

![](https://docs.maptiler.com/sdk-js/api/helpers/img/swiss-cheese.png)

View more [Polygon Layer Helper examples](https://docs.maptiler.com/sdk-js/examples/?q=polygon+helper)

## [Point Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/\#point)

A point visualisation may appear like the simplest of all, but we noticed this is where people get the most creative:
cluster, data-drive variable radius, but also scaled with zoom, with or without labels, data-driven colors, etc.
Our helper supports all of these and will fill-in with built-in default for what's missing.
Whenever it's possible and it makes sense, we use the same terminology across the different helpers.

### [Methods](https://docs.maptiler.com/sdk-js/api/helpers/\#point-members)

Here is the simplest example, with a dataset loaded from a local file
(if no color is specified, a random color is used and the default radius is ramped over the zoom level):

```js
import { helpers } from "@maptiler/sdk";

helpers.addPoint(map, {
  data: "public-schools.geojson",
});
```

JavaScript

Copy

addPoint(map, options)

Add a point with styling options.

Compatible sources:


- uuid of a MapTiler dataset
- geojson from url
- geojson content as string
- geojson content as JS object

The default styling creates a point layer of default radius ramped over the zoom level, the color will be randomly picked
from a curated list of colors and the opacity will be 1.
If the outline is enabled, the outline width is of 1px at all zoom levels, the color is white and
the opacity is 1.


Those style properties can be changed and ramped according to zoom level using an easier syntax.


[Parameters](https://docs.maptiler.com/sdk-js/api/helpers/#addPoint-parameters)

map
([`Map`](https://docs.maptiler.com/sdk-js/api/map))
: The [Map](https://docs.maptiler.com/sdk-js/api/map) instance to add the point layer.


options
([`PointLayerOptions`](https://docs.maptiler.com/sdk-js/api/helpers/#point-options))
: [Point Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#point) options.


[Returns](https://docs.maptiler.com/sdk-js/api/helpers/#addPoint-returns)

`Promise`: `{
              pointLayerId: string;
              clusterLayerId: string;
              labelLayerId: string;
              pointSourceId: string;
            }`

[Related examples](https://docs.maptiler.com/sdk-js/api/helpers/#addPoint-related)

- [Point layer](https://docs.maptiler.com/sdk-js/examples/helper-point-minimal/)
- [Point layer cluster](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/)
- [Point layer colored and sized according to a property](https://docs.maptiler.com/sdk-js/examples/helper-point-property-style/)
- [Point layer disabled zoom compensation](https://docs.maptiler.com/sdk-js/examples/helper-point-no-zoom-compensation/)
- [Point layer labels](https://docs.maptiler.com/sdk-js/examples/helper-point-label/)
- [Point layer min and max size](https://docs.maptiler.com/sdk-js/examples/helper-point-min-max-radius/)
- [Point layer outline](https://docs.maptiler.com/sdk-js/examples/helper-point-outline/)
- [Point layer scaled radius by property](https://docs.maptiler.com/sdk-js/examples/helper-point-ramped-property/)
- [Point layer scaled radius](https://docs.maptiler.com/sdk-js/examples/helper-point-ramped-radius/)

![](https://docs.maptiler.com/sdk-js/api/helpers/img/points.png)

### [PointLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/\#point-options)

[Extends](https://docs.maptiler.com/sdk-js/api/helpers/#point-options) [CommonShapeLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/#CommonShapeLayerOptions)

| options.pointColor?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| <br>[ZoomStringValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomStringValues))<br>default: a color randomly pick from a list | Color of the point. This is can be a constant color string or a definition based on zoom levels.<br> <br>Can be a unique point color as a string (CSS color such as "#FF0000" or "red"). Alternatively, the color can be a ColorRamp with a range.<br> <br>In case of `.cluster` being `true`, <br>the range of the ColorRamp will be addressed with the number of elements in the cluster. <br>If `.cluster` is `false`, <br>the color will be addressed using the value of the `.property`.<br>If no `.property` is given but `.pointColor`<br>is a ColorRamp, the chosen color is the one at the lower bound of the ColorRamp. |
| options.pointRadius?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: The radius will be between `.minPointRadius` <br>and `.maxPointRadius` | Radius of the points. Can be a fixed size or a value dependant on the zoom.<br> <br>If `.pointRadius` is not provided, the radius will depend on the size of each cluster <br>(if `.cluster` is `true`)<br>or on the value of each point (if `.property` is provided and <br>`.pointColor` is a ColorRamp). |
| options.minPointRadius?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))<br>default: 10 | The minimum point radius posible. |
| options.maxPointRadius?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))<br>default: 40 | The maximum point radius posible. |
| options.property?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))<br>default: none | The point property to observe and apply the radius and color upon. <br> This is ignored if `.cluster` is `true`<br> as the observed value will be fiorced to being the number of elements in each cluster. |
| options.pointOpacity?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: 1 | Opacity of the point or icon. This is can be a constant opacity in \[0, 1\] or a definition based on zoom levels.<br> <br>Alternatively, if not provided but the `.pointColor` is a ColorRamp, <br>the opacity will be extracted from tha alpha component if present. |
| options.alignOnViewport?<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))<br>default: true | If `true`, the points will keep their circular shape align with the wiewport.<br> If `false`, the points will be like flatten on the map. This difference shows when the map is tilted. |
| options.cluster?<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))<br>default: false | Whether the points should cluster |
| options.showLabel?<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))<br>default: `true` if `.cluster` <br>or `dataDrivenStyleProperty` are used, `false` otherwise | Shows a label with the numerical value id `true`.<br> If `.cluster` is `true`, the value will be the number of elements in the cluster. |
| options.labelColor?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))<br>default: `white` | Text color used for the number elements in each cluster. <br> Applicable only when `.cluster` is `true` or <br> `dataDrivenStyleProperty` are used. |
| options.labelSize?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))<br>default: 12 | Text size used for the number elements in each cluster. <br> Applicable only when `.cluster` is `true`. |
| options.zoomCompensation?<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))<br>default: true | Only if `.cluster` is `false`. <br> If the radius is driven by a property, then it will also scale by zoomming if `.zoomCompensation` is `true`.<br> If `false`, the radius will not adapt according to the zoom level. |

### [Examples](https://docs.maptiler.com/sdk-js/api/helpers/\#point-examples)

Check out the full list of [examples](https://docs.maptiler.com/sdk-js/examples/?q=point+helper)

Here is the same dataset, but with point clustering enabled:

```js
import { helpers } from "@maptiler/sdk";

helpers.addPoint(map, {
  data: "public-schools.geojson",
  cluster: true,
});
```

JavaScript

Copy

On the other hand, if clusters are enabled, the default color is fueled by the color ramp `TURBO`
scaled from `10` to `10000`
non-linearly resampled with the method `"ease-out-square"`.
The size also varies from `minPointradius` (default: `10`)
to `maxPointRadius` (default: `50`):

![](https://docs.maptiler.com/sdk-js/api/helpers/img/points-clustered.png)

With the point helper, it's also possible to adapt the color and theradius based on a property. In the following example,
we display a point for each public school, with the scaling factor being the number of students:

```js
import { helpers } from "@maptiler/sdk";

helpers.addPoint(map, {
  data: "public-schools.geojson",
  property: "students",
  pointColor: ColorRampCollection.PORTLAND.scale(200, 2000).resample("ease-out-sqrt"),
  pointOpacity: 0.8,
  minPointRadius: 6,
  maxPointRadius: 30,
  showLabel: true,
  zoomCompensation: false,
})
```

JavaScript

Copy

![](https://docs.maptiler.com/sdk-js/api/helpers/img/nyc-schools.png)

Here, the `PORTLAND` color ramp is going to be used so that schools
with `200` students or less will have the colors at the very begining of the color
ramp and schools with `2000` or more will have the color defined at the very end.
Schools in between will be attributed a colors in a non-linear fashion,
following the `"ease-out-sqrt"` method
(read [Color Ramps](https://docs.maptiler.com/sdk-js/api/color-ramp/) section for more info).

View more [Point Layer Helper examples](https://docs.maptiler.com/sdk-js/examples/?q=point+helper)

## [Heatmap Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/\#heatmap)

The heatmap layer is a great alternative for visualizing a collection of sparse data,
but they can be challenging to use, especially when one has to come up with their own color ramp from scratch.
**The helper makes this much easier!**
Whenever it's possible and it makes sense, we use the same terminology across the different helpers.

### [Methods](https://docs.maptiler.com/sdk-js/api/helpers/\#heatmap-members)

Here is a minimalist example, using the default built-in `TURBO` color ramp:

```js
import { helpers } from "@maptiler/sdk";

helpers.addHeatmap(map, {
  data: "public-schools.geojson",
});
```

JavaScript

Copy

addHeatmap(map, options)

Add a heatmap with styling options.

Compatible sources:


- uuid of a MapTiler dataset
- geojson from url
- geojson content as string
- geojson content as JS object

The default styling creates a heatmap layer usign the default built-in `TURBO` color ramp.


Those style properties can be changed and ramped according to zoom level using an easier syntax.


[Parameters](https://docs.maptiler.com/sdk-js/api/helpers/#addHeatmap-parameters)

map
([`Map`](https://docs.maptiler.com/sdk-js/api/map))
: The [Map](https://docs.maptiler.com/sdk-js/api/map) instance to add the point layer.


options
([`HeatmapLayerOptions`](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap-options))
: [Heatmap Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap) options.


[Returns](https://docs.maptiler.com/sdk-js/api/helpers/#addHeatmap-returns)

`Promise`: `{
              heatmapLayerId: string;
              heatmapSourceId: string;
            }`

[Related examples](https://docs.maptiler.com/sdk-js/api/helpers/#addHeatmap-related)

- [Point layer](https://docs.maptiler.com/sdk-js/examples/helper-point-minimal/)
- [Point layer cluster](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/)
- [Point layer colored and sized according to a property](https://docs.maptiler.com/sdk-js/examples/helper-point-property-style/)
- [Point layer disabled zoom compensation](https://docs.maptiler.com/sdk-js/examples/helper-point-no-zoom-compensation/)
- [Point layer labels](https://docs.maptiler.com/sdk-js/examples/helper-point-label/)
- [Point layer min and max size](https://docs.maptiler.com/sdk-js/examples/helper-point-min-max-radius/)
- [Point layer outline](https://docs.maptiler.com/sdk-js/examples/helper-point-outline/)
- [Point layer scaled radius by property](https://docs.maptiler.com/sdk-js/examples/helper-point-ramped-property/)
- [Point layer scaled radius](https://docs.maptiler.com/sdk-js/examples/helper-point-ramped-radius/)

![](https://docs.maptiler.com/sdk-js/api/helpers/img/heatmap-schools.png)

### [HeatmapLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/\#heatmap-options)

[| options.layerId?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | ID to give to the layer.<br> If not provided, an auto-generated ID like "maptiler-layer-xxxxxx" will be auto-generated,<br> with "xxxxxx" being a random string. |\\
| options.sourceId?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | ID to give to the source.<br> If not provided, an auto-generated ID like "maptiler-source-xxxxxx" will be auto-generated,<br> with "xxxxxx" being a random string. |\\
| options.data<br>(`FeatureCollection` \| <br>[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | A geojson Feature collection or a URL to a geojson or <br> the UUID of a MapTiler dataset. |\\
| options.beforeId?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)) | The ID of an existing layer to insert the new layer before, resulting in the new layer appearing<br> visually beneath the existing layer. If this argument is not specified, the layer will be appended<br> to the end of the layers array and appear visually above all other layers. |\\
| options.minzoom?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))<br>default: 0 | Zoom level at which it starts to show. |\\
| options.maxzoom?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))<br>default: 22 | Zoom level after which it no longer show. |\\
| options.colorRamp?<br>( [ColorRamp](https://docs.maptiler.com/sdk-js/api/color-ramp/))<br>default: `ColorRampCollection.TURBO` | The ColorRamp instance to use for visualization. The color ramp is expected to be defined in the<br> range `[0, 1]` or else will be forced to this range. |\\
| options.property?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))<br>default: none, the points will all have a weight of `1` | Use a property to apply a weight to each data point. <br> Using a property requires also using the options `.propertyValueWeight` <br> or otherwise will be ignored. |\\
| options.weight?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[PropertyValues](https://docs.maptiler.com/sdk-js/api/helpers/#PropertyValues) <br>) | The weight to give to each data point. If of type `PropertyValueWeights`<br>, then the options `.property` must also be provided. <br>If used a number, all data points will be weighted by the same number (which is of little interest) |\\
| options.radius?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues) \|<br>[PropertyValues](https://docs.maptiler.com/sdk-js/api/helpers/#PropertyValues) <br>) | Radius in screenspace. Can be: <br> <br>- A fixed number that will be constant across zoom level.<br>   <br>- A type `ZoomNumberValues` to be ramped accoding to zoom level <br>   (`.zoomCompensation` will then be ignored).<br>   <br>- A type `PropertyValues` to be driven by the value of a property.<br>   If so, the option `.property` must be provided and will still be resized according to zoom level,<br>   unless the option `.zoomCompensation` is set to `false`. |\\
| options.opacity?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: fades-in 0.25z after minzoom and fade-out 0.25z before maxzoom | The opacity can be a fixed value or zoom-driven. |\\
| options.intensity?<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| <br>[ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/#ZoomNumberValues))<br>default: the intensity is going to be scaled by zoom to preserve a natural aspect or the data distribution | The intensity is zoom-dependent. |\\
| options.zoomCompensation?<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))<br>default: true | If the radius is driven by a property, then it will also scale by zoomming if<br> `.zoomCompensation` is `true`.<br> If `false`, the radius will not adapt according to the zoom level. |](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap-options)

### [Examples](https://docs.maptiler.com/sdk-js/api/helpers/\#heatmap-examples)

Check out the full list of [examples](https://docs.maptiler.com/sdk-js/examples/?q=heatmap+helper)

Some visualisations are created with a fixed geographic extent or zoom level in mind,
whether it's a survey at the scale of a single neigbohood, or statitics at country scale.
In this case, we want to tailor the color, radius, weight and intensity of the heatmap blobs exactely for this precise settings.
In the following example, we disable the zoom compensation to make sure radii and intensity is never zoom-dependant:

```js
import { helpers } from "@maptiler/sdk";

helpers.addHeatmap(map, {
  data: "public-schools.geojson",
  property: "students",
  // radius: how wide are the blobs
  radius: [\
    {propertyValue: 100, value: 15},\
    {propertyValue: 800, value: 50},\
  ],
  // weight: how intense are the blob, as fueled by a property
  weight: [\
    {propertyValue: 100, value: 0.1},\
    {propertyValue: 800, value: 1},\
  ],
  // A custom color ramp, must be used with its default interval of [0, 1]
  colorRamp: ColorRampCollection.MAGMA,
  zoomCompensation: false,
  opacity: 0.6,
  // a global factor applied to all the blobs, regardless of the property or zoom
  intensity: 1.2,
});
```

JavaScript

Copy

![](https://docs.maptiler.com/sdk-js/api/helpers/img/heatmap-colorramp.png)

Turning off _zoom compensation_ allows for more accurate adjustments to the visualization at a specific zoom level,
but it may not adapt as smoothly when zooming in or out.

View more [Heatmap Layer Helper examples](https://docs.maptiler.com/sdk-js/examples/?q=heatmap+helper)

## [Take Screenshot Helper](https://docs.maptiler.com/sdk-js/api/helpers/\#screenshot)

The screenshot helper provides a quick and easy solution for capturing the current map view as a PNG image file, making it the most convenient way to save map snapshots.



Screenshots will not contain _DOM elements_ such as
`Marker` and `Popup`,
since those are not part of the rendering context.


### [Methods](https://docs.maptiler.com/sdk-js/api/helpers/\#takeScreenshot-members)

Here is a minimalist example to get a `blob` (PNG encoded):

```js
import { Map, helpers } from "@maptiler/sdk";

// ... initialize a Map instance, wait for the "load" or "ready" event ...

// Inside an async function, or with using .then()
const blob = await helpers.takeScreenshot(map);
```

JavaScript

Copy

takeScreenshot(map, options)

Takes a screenshot `blob` (PNG file) of the curent map view.

Depending on the options, this function can automatically trigger a download of the file.

[Parameters](https://docs.maptiler.com/sdk-js/api/helpers/#takeScreenshot-parameters)

map
([`Map`](https://docs.maptiler.com/sdk-js/api/map))
: The [Map](https://docs.maptiler.com/sdk-js/api/map) instance to take a screenshot of the curent map view.


options
([`TakeScreenshotOptions`](https://docs.maptiler.com/sdk-js/api/helpers/#takeScreenshot-options))
: [Take Screenshot Helper](https://docs.maptiler.com/sdk-js/api/helpers/#screenshot) options.


[Returns](https://docs.maptiler.com/sdk-js/api/helpers/#takeScreenshot-returns)

`Promise`: `Blob` (PNG encoded)


[Related examples](https://docs.maptiler.com/sdk-js/api/helpers/#takeScreenshot-related)

- [How to take a screenshot of the current map view](https://docs.maptiler.com/sdk-js/examples/helper-screenshot/)
- [How to download a map screenshot as a PNG file](https://docs.maptiler.com/sdk-js/examples/helper-screenshot-download/)

### [TakeScreenshotOptions](https://docs.maptiler.com/sdk-js/api/helpers/\#takeScreenshot-options)

[| options.download?<br>( [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))<br>default: false | If `true`, <br> this function will trigger a download in addition to returning a blob. |\\
| options.filename?<br>( [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))<br>default: "maptiler\_screenshot.png" | Only if `options.download` <br> is `true`. <br> Indicates the filename under which the file will be downloaded. |](https://docs.maptiler.com/sdk-js/api/helpers/#takeScreenshot-options)

### [Examples](https://docs.maptiler.com/sdk-js/api/helpers/\#takeScreenshot-examples)

Check out the full list of [examples](https://docs.maptiler.com/sdk-js/examples/?q=screenshot+helper)

There are two different ways to create screenshot, corresponding to two very different usecases.
Note that screenshots will not contain _DOM elements_ such as `Marker` and `Popup`, since those are not part of the rendering context.

##### Get a `blob` of a screenshot, PNG encoded

```js
import { Map, helpers } from "@maptiler/sdk";

// ... initialize a Map instance, wait for the "load" or "ready" event ...

// Inside an async function, or with using .then()
const blob = await helpers.takeScreenshot(map);
```

JavaScript

Copy

The returned `blob` of a PNG image file can be very handy if the goal is to programmatically further manipulate the screenshot, such as sending it to some feedback endpoint with a POST request.

##### Download a PNG file

```js
import { Map, helpers } from "@maptiler/sdk";

// ... initialize a Map instance, wait for the "load" or "ready" event ...

// No need to be inside an async function, the download will be triggered when the file is ready
maptilersdk.helpers.takeScreenshot(map, {
  download: true,
  filename: "map_screenshot.png"
});
```

JavaScript

Copy

Getting a file directly is a nice option that can be useful to share some debugging context with colleagues, compare multiple styles, or share your creation on social media.

Keep in mind that MapTiler data are copyrighted and their usage is restricted.
This include MapTiler built-in styles and tilesets, among others.
In case of doubt, do not hesitate to read our [terms](https://www.maptiler.com/terms/) or to ask our [support team](https://www.maptiler.com/contacts/).

## [Other helpers](https://docs.maptiler.com/sdk-js/api/helpers/\#other)

### [Convert GPX and KML to GeoJSON](https://docs.maptiler.com/sdk-js/api/helpers/\#GPX-KML)

In the [Polyline helper section](https://docs.maptiler.com/sdk-js/api/helpers/#polyline) above, we have seen that one can feed the helper
directly with a path to a GPX or KML file, that is then converted under the hood client-side into a GeoJSON
`FeatureCollection` object.
This conversion feature is also exposed and can be used as such:

```js
import { gpx } from "@maptiler/sdk";

// ... assuming inside an async function

// Fetching the GPX file as a string:
const gpxFilePath = "some_gps_trace.gpx";
const gpxResponse = await fetch(gpxFilePath);
const gpxStr = await res.text();

// Converting the GPX payload into a GeoJSON FeatureCollection:
const features = maptilersdk.gpx(gpxStr);
//or
const features = gpx(gpxStr);
```

JavaScript

Copy

And for KML files:

```js
import { kml } from "@maptiler/sdk";

// ... assuming inside an async function

// Fetching the KML file as a string:
const kmlFilePath = "some_gps_trace.kml";
const kmlResponse = await fetch(kmlFilePath);
const kmlStr = await res.text();

// Converting the KML payload into a GeoJSON FeatureCollection:
const features = maptilersdk.kml(kmlStr);
//or
const features = kml(kmlStr);
```

JavaScript

Copy

##### [Types and Interfaces](https://docs.maptiler.com/sdk-js/api/helpers/\#types)

###### [ZoomStringValues](https://docs.maptiler.com/sdk-js/api/helpers/\#ZoomStringValues)

Array of string values that depend on zoom level

```js
Array<{
  zoom: number, // Zoom level
  value: string // Value for the given zoom level
}>
```

JavaScript

Copy

###### [ZoomNumberValues](https://docs.maptiler.com/sdk-js/api/helpers/\#ZoomNumberValues)

Array of number values that depend on zoom level

```js
Array<{
  zoom: number, // Zoom level
  value: number // Value for the given zoom level
}>
```

JavaScript

Copy

###### [PropertyValues](https://docs.maptiler.com/sdk-js/api/helpers/\#PropertyValues)

```js
Array<{
  propertyValue: number, // Value of the property (input)
  value: number // Value to associate it with (output)
}>
```

JavaScript

Copy


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Vector Layer Helpers](https://docs.maptiler.com/sdk-js/api/helpers/#vector-layer-helpers)
- [Shared logic](https://docs.maptiler.com/sdk-js/api/helpers/#shared-logic)
  - [Multiple Layers](https://docs.maptiler.com/sdk-js/api/helpers/#multiple-layers)
  - [CommonShapeLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/#CommonShapeLayerOptions)
- [Polyline Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#polyline)
  - [Methods](https://docs.maptiler.com/sdk-js/api/helpers/#polyline-members)
  - [PolylineLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/#polyline-options)
  - [Examples](https://docs.maptiler.com/sdk-js/api/helpers/#polyline-examples)
- [Polygon Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#polygon)
  - [Methods](https://docs.maptiler.com/sdk-js/api/helpers/#polygon-members)
  - [PolygonLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/#polygon-options)
  - [Examples](https://docs.maptiler.com/sdk-js/api/helpers/#polygon-examples)
- [Point Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#point)
  - [Methods](https://docs.maptiler.com/sdk-js/api/helpers/#point-members)
  - [PointLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/#point-options)
  - [Examples](https://docs.maptiler.com/sdk-js/api/helpers/#point-examples)
- [Heatmap Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap)
  - [Methods](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap-members)
  - [HeatmapLayerOptions](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap-options)
  - [Examples](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap-examples)
- [Take Screenshot Helper](https://docs.maptiler.com/sdk-js/api/helpers/#screenshot)
  - [Methods](https://docs.maptiler.com/sdk-js/api/helpers/#takeScreenshot-members)
  - [TakeScreenshotOptions](https://docs.maptiler.com/sdk-js/api/helpers/#takeScreenshot-options)
  - [Examples](https://docs.maptiler.com/sdk-js/api/helpers/#takeScreenshot-examples)
- [Other helpers](https://docs.maptiler.com/sdk-js/api/helpers/#other)
  - [Convert GPX and KML to GeoJSON](https://docs.maptiler.com/sdk-js/api/helpers/#GPX-KML)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Helpers

Helpers

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)