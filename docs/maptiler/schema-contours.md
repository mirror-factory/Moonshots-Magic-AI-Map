---
title: "MapTiler Contours | Schema | MapTiler"
source: "https://docs.maptiler.com/schema/contours"
description: "Tileset containing isolines of equal elevation."
---

# MapTiler Contours schema

The vector tile schema describes how the vector data is organized
into different thematic layers and which attribute and values each
layer contains. This is useful for writing a map style.

MapTiler Contours is a tileset that contains contour lines with height in both meters and feet and additional information
for index line and glacier styling.

Explore the tileset in the interactive map viewer, check the date of the last update, use it as vector tiles, etc.

[Inspect MapTiler Contours schema](https://cloud.maptiler.com/tiles/contours-v2/)

##### Maps with this tileset

[![Outdoor map](https://cloud.maptiler.com/static/img/maps/outdoor-v4.png)\\
Outdoor](https://cloud.maptiler.com/maps/outdoor-v4/) [![Topo map](https://cloud.maptiler.com/static/img/maps/topo-v4.png)\\
Topo](https://cloud.maptiler.com/maps/topo-v4/) [![Winter map](https://cloud.maptiler.com/static/img/maps/winter-v4.png)\\
Winter](https://cloud.maptiler.com/maps/winter-v4/)

## Definition of layers

The MapTiler Contours tileset contains the following layers:

## contour   [\#](https://docs.maptiler.com/schema/contours/\#contour)

Contour lines with height in meters and additional information for index line and glacier styling.

### Fields

#### height

Elevation in meters (10 m resolution globally, 5 m resolution in specific areas - please see the [`high-res section`](https://docs.maptiler.com/schema/contours/#high-res)).

#### nth\_line

Specifies the order of a contour line. Convenient for index line marking.

Possible values:

- `0`
- `1`
- `2`
- `5`
- `10`

Example:

For contour lines at zoom level 14 and higher
in areas with high-resolution data (5 m resolution),
the following contour lines with `height` and `nth_line` attributes are available:

| height (m) |  | nth\_line |
| --- | --- | --- |
| 1200 |  | 10 |
| 1205 |  | 0 |
| 1210 |  | 1 |
| 1215 |  | 0 |
| 1220 |  | 2 |
| 1225 |  | 0 |
| 1230 |  | 1 |
| 1235 |  | 0 |
| 1240 |  | 2 |
| 1245 |  | 0 |
| 1250 |  | 5 |
| 1255 |  | 0 |
| 1260 |  | 2 |
| 1265 |  | 0 |
| 1270 |  | 1 |
| 1275 |  | 0 |
| 1280 |  | 2 |
| 1285 |  | 0 |
| 1290 |  | 1 |
| 1295 |  | 0 |
| 1300 |  | 10 |

#### glacier

Marks whether a line intersects a glacier.

## contour\_ft   [\#](https://docs.maptiler.com/schema/contours/\#contour_ft)

Contour lines with height in feet and additional information for index line and glacier styling.

### Fields

#### height

Elevation in feet.

#### nth\_line

Specifies the order of a contour line. Convenient for index line marking.

Possible values:

- `1`
- `2`
- `5`
- `10`

Example:

For contour lines at zoom level 14 and higher
in areas with high-resolution data,
the following contour lines with `height` and `nth_line` attributes are available:

| height (ft) |  | nth\_line |
| --- | --- | --- |
| 4000 |  | 10 |
| 4010 |  | 1 |
| 4020 |  | 2 |
| 4030 |  | 1 |
| 4040 |  | 2 |
| 4050 |  | 5 |
| 4060 |  | 2 |
| 4070 |  | 1 |
| 4080 |  | 2 |
| 4090 |  | 1 |
| 4100 |  | 10 |
| 4110 |  | 1 |
| 4120 |  | 2 |
| 4130 |  | 1 |
| 4140 |  | 2 |
| 4150 |  | 5 |
| 4160 |  | 2 |
| 4170 |  | 1 |
| 4180 |  | 2 |
| 4190 |  | 1 |
| 4200 |  | 10 |

#### glacier

Marks whether a line intersects a glacier.

## high-res   [\#](https://docs.maptiler.com/schema/contours/\#high-res)

List of areas with high resolution data.

### 5 m

- Czech Republic

More to come.

### 10 m

- Planet (global coverage)

## License

With the use of this API, you must visibly credit these attributions:

[© MapTiler](https://www.maptiler.com/copyright/)

[![Contours](https://docs.maptiler.com/img/schema/contours.png)](https://cloud.maptiler.com/tiles/contours-v2/)

##### Layers

- [contour](https://docs.maptiler.com/schema/contours/#contour)
- [contour\_ft](https://docs.maptiler.com/schema/contours/#contour_ft)
- [high-res](https://docs.maptiler.com/schema/contours/#high-res)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

Schema


MapTiler Contours

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)