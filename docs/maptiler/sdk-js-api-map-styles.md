---
title: "Map Styles | JavaScript maps SDK | MapTiler SDK JS | MapTiler"
source: "https://docs.maptiler.com/sdk-js/api/map-styles"
description: "JavaScript maps SDK | Home Platform updates Getting started How maps work Maps, tiles, data Zoomable maps Coordinate systems Raster vs vector tiles Vector..."
---

# Map Styles![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/mapstyle.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/mapstyle.ts)

The built-in map styles defined in the [Client JS library](https://docs.maptiler.com/client-js/static-maps/#mapstyles) are exposed by the SDK so that they can easily be used.


MapTiler teams maintains a few styles that we have decided to expose as style shorthand from the SDK.
Our built-in styles are designed to make it easier for you to create beautiful maps, without the need for extra coding or worrying about outdated versions.
This has several advantages:


- If we make an update to a style, you won't have to modify your codebase. Always use the latest version of styles.
- They are easier to remember, no need to type along style URL. No more putting the API key in every URL.
- Code completion: reducing typos and other common mistakes.

The built-in styles generaly defines a purpose for which this style is the most relevant: street navigation, outdoor adventure, minimalist dashboard, etc.
Then, each style offers a range of variants that contain the same level of information and has the same purpose but using different colors schemes like dark, light, etc.


## [ReferenceMapStyle](https://docs.maptiler.com/sdk-js/api/map-styles/\#referencemapstyle)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

A reference syle sets some guidelines about what kind of information is displayed, the granularity of the information,
and more generaly defines a purpose for which this style is the most relevant: street navigation, outdoor adventure, minimalist dashboard, etc.

The `MapStyle.REFERENCE_MAP_STYLE` is an instance of the class [ReferenceMapStyle](https://github.com/maptiler/maptiler-client-js/blob/main/src/mapstyle.ts) (with a proxy layer).


### [Example](https://docs.maptiler.com/sdk-js/api/map-styles/\#referencemapstyle-example)

|     |     |     |
| --- | --- | --- |
| `MapStyle.STREETS` | ![MapStyle.STREETS](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-streets-v2.jpeg) | The classic default style, perfect for urban areas. |
| `MapStyle.SATELLITE` | ![MapStyle.SATELLITE](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-satellite.jpeg) | High resolution satellite images. |
| `MapStyle.HYBRID` | ![MapStyle.HYBRID](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-hybrid.jpeg) | High resolution satellite with labels, landmarks, roads ways and political borders. |
| `MapStyle.OUTDOOR` | ![MapStyle.OUTDOORS](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-outdoor-v2.jpeg) | A solid hiking companion, with peaks, parks, isolines and more. |
| `MapStyle.WINTER` | ![MapStyle.WINTER](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-winter-v2.jpeg) | A map for developing skiing, snowboarding and other winter activities and adventures. |
| `MapStyle.BASIC` | ![MapStyle.BASIC](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-basic-v2.jpeg) | A minimalist alternative to STREETS, with a touch of flat design. |

### [Methods](https://docs.maptiler.com/sdk-js/api/map-styles/\#referencemapstyle-methods)

addVariant(v)

Add a variant to the reference style

##### [Parameters](https://docs.maptiler.com/sdk-js/api/map-styles/\#addVariant-referencemapstyle-parameters)

v`(MapStyleVariant)`Map style variant to add.


getDefaultVariant()

Get the defualt variant for the reference style.


##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getDefaultVariant-referencemapstyle-returns)

`MapStyleVariant`

getId()

Get the id of the reference style

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getId-referencemapstyle-returns)

`string`: id of the style

getName()

Get the human-friendly name of the reference style

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getName-referencemapstyle-returns)

`string`: human-friendly name of the style

getVariant(variantType)

Get a given variant. If the given type of variant does not exist for this reference style,
then the most relevant default variant is returned instead.


##### [Parameters](https://docs.maptiler.com/sdk-js/api/map-styles/\#getVariant-referencemapstyle-parameters)

variantType`(string)`Name of the style variant to get.


##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getVariant-referencemapstyle-returns)

`MapStyleVariant`

getVariants()

Get the list of variants for this reference style.


##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getVariants-referencemapstyle-returns)

`Array[MapStyleVariant]`: list of variants

hasVariant(variantType)

Check if a given variant type exists for this reference style

##### [Parameters](https://docs.maptiler.com/sdk-js/api/map-styles/\#hasVariant-referencemapstyle-parameters)

variantType`(string)`Name of the style variant to check.


##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#hasVariant-referencemapstyle-returns)

`boolean`

## [MapStyleVariant](https://docs.maptiler.com/sdk-js/api/map-styles/\#mapstylevariant)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

Each reference style offers a range of variants that contain the same level of information and has the same purpose but using different colors schemes.


The `MapStyle.REFERENCE_MAP_STYLE.MAP_STYLE_VARIANT` is an instance of the class [MapStyleVariant](https://github.com/maptiler/maptiler-client-js/blob/main/src/mapstyle.ts).
The proxy layer on top of each ReferenceMapStyle instance is useful to catch any inexistant variant and still fallback on the default one.


For example, `MapStyle.STREETS` is an proxied instance of ReferenceMapStyle and if we look for the DARK variant
(instance of the class MapStyleVariant), we need to type `MapStyle.STREETS.DARK` but if we were looking for an inexisting variant,
such as `MapStyle.STREETS.INDIGO` then `MapStyle.STREETS` will fallback on
`MapStyle.STREETS.DEFAULT` (the advantage of a proxy compared to a classic getter is the dynamic resolution of the property)

### [Example](https://docs.maptiler.com/sdk-js/api/map-styles/\#mapstylevariant-example)

|     |     |     |
| --- | --- | --- |
| `MapStyle.DATAVIZ.DARK` | ![MapStyle.DATAVIZ.DARK](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-dataviz-dark.jpeg) | A minimalist style for data visualization. Also available in color and light mode |
| `MapStyle.DATAVIZ.LIGHT` | ![MapStyle.DATAVIZ.LIGHT](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-dataviz-light.jpeg) | A minimalist style for data visualization. Also available in color and dark mode |
| `MapStyle.BRIGHT.PASTEL` | ![MapStyle.BRIGHT.PASTEL](https://docs.maptiler.com/sdk-js/api/map-styles/img/style-bright-v2-pastel.jpeg) | A minimalist style for high contrast navigation. Also available in color, dark and light mode |

### [Methods](https://docs.maptiler.com/sdk-js/api/map-styles/\#mapstylevariant-methods)

getDescription()

Get the human-friendly description

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getDescription-mapstylevariant-returns)

`string`: human-friendly description of the style

getExpandedStyleURL()

Get the style as usable by MapLibre, a string (URL) or a plain style description (StyleSpecification)

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getExpandedStyleURL-mapstylevariant-returns)

`string`: string (URL) or a plain style description (StyleSpecification)

getFullName()

Get the full name of the style variant

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getFullName-mapstylevariant-returns)

`string`: full name of the style

getId()

Get the MapTiler id

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getId-mapstylevariant-returns)

`string`: id of the style

getImageURL()

Get the image URL that represent this variant

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getImageURL-mapstylevariant-returns)

`string`: image url of the style

getName()

Get the human-friendly name

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getName-mapstylevariant-returns)

`string`: human-friendly name of the style

getReferenceStyle()

Get the reference style this variant belongs to.


##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getReferenceStyle-mapstylevariant-returns)

`ReferenceMapStyle`

getType()

Get the variant type (eg. "DEFAULT", "DARK", "PASTEL", etc.)

##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getType-mapstylevariant-returns)

`string`: varian type

getVariant(variantType)

Retrieve the variant of a given type. If not found, will return the "DEFAULT" variant.
(eg. \_this\_ "DARK" variant does not have any "PASTEL" variant, then the "DEFAULT" is returned).


##### [Parameters](https://docs.maptiler.com/sdk-js/api/map-styles/\#getVariant-mapstylevariant-parameters)

variantType`(string)`Name of the style variant to get.


##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getVariant-mapstylevariant-returns)

`MapStyleVariant`

getVariants()

Get all the variants for this variants, except this current one.


##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#getVariants-mapstylevariant-returns)

`Array[MapStyleVariant]`: list of variants

hasVariant(variantType)

Check if a variant of a given type exists for this variants
(eg. if this is a "DARK", then we can check if there is a "LIGHT" variant of it).


##### [Parameters](https://docs.maptiler.com/sdk-js/api/map-styles/\#hasVariant-mapstylevariant-parameters)

variantType`(string)`Name of the style variant to check.


##### [Returns](https://docs.maptiler.com/sdk-js/api/map-styles/\#hasVariant-mapstylevariant-returns)

`boolean`

## [Map Styles list](https://docs.maptiler.com/sdk-js/api/map-styles/\#mapstylelist)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

MapTiler provides some **reference styles** as well as some **variants** for each. Here is the full list:

- `MapStyle.STREETS_V2`,
Complete and legible map for navigation and mobility
  - `MapStyle.STREETS_V2.DARK` (variant)
  - `MapStyle.STREETS_V2.LIGHT` (variant)
  - `MapStyle.STREETS_V2.PASTEL` (variant)
- `MapStyle.OUTDOOR`,
Summer topographic map for sport and mountain apps
  - `MapStyle.OUTDOOR.DARK` (variant)
- `MapStyle.WINTER`,
Winter topographic map for ski and snow apps
  - `MapStyle.WINTER.DARK` (variant)
- `MapStyle.SATELLITE`,
Seamless satellite and aerial imagery of the world
(no variants)

- `MapStyle.HYBRID`,
Seamless satellite and aerial imagery of the world with labels
(no variants)

- `MapStyle.BASIC_V2`,
Light and informative map for general use
  - `MapStyle.BASIC_V2.DARK` (variant)
  - `MapStyle.BASIC_V2.LIGHT` (variant)
- `MapStyle.BRIGHT`,
General shiny map for context or navigation
  - `MapStyle.BRIGHT.DARK` (variant)
  - `MapStyle.BRIGHT.LIGHT` (variant)
  - `MapStyle.BRIGHT.PASTEL` (variant)
- `MapStyle.OPENSTREETMAP`,
Rich and familiar map based on the OpenStreetmap community style
(no variants)

- `MapStyle.TOPO`,
General topographic map for terrain and nature apps
  - `MapStyle.TOPO.DARK` (variant)
  - `MapStyle.TOPO.PASTEL` (variant)
  - `MapStyle.TOPO.TOPOGRAPHIQUE` (variant)
- `MapStyle.TONER`,
Contrasted monochrome map for general use
  - `MapStyle.TONER.LITE` (variant)
- `MapStyle.DATAVIZ`,
Simple background map for data visualization
  - `MapStyle.DATAVIZ.DARK` (variant)
  - `MapStyle.DATAVIZ.LIGHT` (variant)
- `MapStyle.BACKDROP`,
Monochromatic context map with hillshade
  - `MapStyle.BACKDROP.DARK` (variant)
  - `MapStyle.BACKDROP.LIGHT` (variant)
- `MapStyle.OCEAN`,
Detailed map of the ocean seafloor and bathymetry
(no variants)

- `MapStyle.AQUARELLE`,
Watercolor map for creative use
  - `MapStyle.AQUARELLE.DARK` (variant)
  - `MapStyle.AQUARELLE.VIVID` (variant)
- `MapStyle.LANDSCAPE_V2`,
Light terrain map for data overlays and visualisations
  - `MapStyle.LANDSCAPE_V2.DARK` (variant)
  - `MapStyle.LANDSCAPE_V2.VIVID` (variant)
- `MapStyle.STREETS`,
Complete and legible map for navigation and mobility
  - `MapStyle.STREETS.DARK` (variant)
  - `MapStyle.STREETS.LIGHT` (variant)
  - `MapStyle.STREETS.PASTEL` (variant)
- `MapStyle.BASIC`,
Light and informative map for general use
  - `MapStyle.BASIC.DARK` (variant)
  - `MapStyle.BASIC.LIGHT` (variant)
- `MapStyle.LANDSCAPE`,
Light terrain map for data overlays and visualisations
  - `MapStyle.LANDSCAPE.DARK` (variant)
  - `MapStyle.LANDSCAPE.VIVID` (variant)

### [Related examples](https://docs.maptiler.com/sdk-js/api/map-styles/\#mapstyle-related)

- [Built-in map styles](https://docs.maptiler.com/sdk-js/examples/built-in-styles/)
- [How to display a style switcher control](https://docs.maptiler.com/sdk-js/examples/control-style-switcher/)
- [How to display your custom map on the web page](https://docs.maptiler.com/sdk-js/examples/custom-map/)


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [ReferenceMapStyle](https://docs.maptiler.com/sdk-js/api/map-styles/#referencemapstyle)
  - [Example](https://docs.maptiler.com/sdk-js/api/map-styles/#referencemapstyle-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/map-styles/#referencemapstyle-methods)
- [MapStyleVariant](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstylevariant)
  - [Example](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstylevariant-example)
  - [Methods](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstylevariant-methods)
- [Map Styles list](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstylelist)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/map-styles/#mapstyle-related)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Map Styles

Map Styles

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)