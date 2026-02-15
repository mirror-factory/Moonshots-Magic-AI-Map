# Color Ramp![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ColorRamp.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/ColorRamp.ts)

A color ramp is a color gradient defined in a specific interval, for instance in \[0, 1\],
and for any value within this interval will retrieve a color.
They are defined by at least a color at each bound and usualy additional colors within the range.

Color ramps are super useful to represent numerical data in a visual way:
the temperature, the population density, the average commute time, etc.

Example

```js
import { ColorRampCollection } from "@maptiler/sdk";

// Let's use the builtin TURBO color ramp,
const turbo = ColorRampCollection.TURBO;
```

JavaScript

Copy

To use an already existing color ramp and access some of its values:

```js
import { ColorRampCollection } from "@maptiler/sdk";

// The TURBO color ramp, just like all the built-ins, is defined in [0, 1],
// but we can rescale it to fit the range of temperature [-18, 38]°C (equivalent to [0, 100]F)
// and this actually creates a clone of the original TURBO
const temperatureTurbo = ColorRampCollection.TURBO.scale(-18, 38);

// What's the color at 0°C (or 32F) ?
const zeroColor = temperatureTurbo.getColor(0);
// The color is an array: [45, 218, 189, 255]

// Alternatively, we can ask for the hex color:
const zeroColorHex = temperatureTurbo.getColorHex(0);
// The color is a string: "#2ddabdff"
```

JavaScript

Copy

Creating a new one consists in defining all the colors for each _color stops_.
The values can be in the range of interest and _do not_ have to be in \[0, 1\].
For example, let's recreate a _Viridis_ color ramp but with a range going from 0 to 100:

```js
import { ColorRamp } from "@maptiler/sdk";

const myCustomRamp = new ColorRamp({
  stops: [\
    { value: 0, color: [68, 1, 84] },\
    { value: 13, color: [71, 44, 122] },\
    { value: 25, color: [59, 81, 139] },\
    { value: 38, color: [44, 113, 142] },\
    { value: 5, color: [33, 144, 141] },\
    { value: 63, color: [39, 173, 129] },\
    { value: 75, color: [92, 200, 99] },\
    { value: 88, color: [170, 220, 50] },\
    { value: 100, color: [253, 231, 37] },\
  ]
});
```

JavaScript

Copy

When defining a new ramp, the colors can be a
RGB array (`[number, number, number]`) or a
RGBA array (`[number, number, number, number]`).

View more [Color Ramp examples](https://docs.maptiler.com/sdk-js/examples/?q=%28color+ramp%29)

## [Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/\#color-ramp-parameters)

options? (ColorRampOptions)

Options to provide to the constructor
(ColorRampOptions)



[Properties](https://docs.maptiler.com/sdk-js/api/color-ramp/#color-ramp-options)

| options.min<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))? | The value the colorramp starts |
| options.max<br>( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))? | The value the colorramp ends |
| options.stops<br>( [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) <<br>[ColorStop](https://docs.maptiler.com/sdk-js/api/color-ramp/#ColorStop)<br>>)? | Some color stops to copy from |

## [Methods](https://docs.maptiler.com/sdk-js/api/color-ramp/\#color-ramp-methods)

clone()

Clone the color ramp.


[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#clone-returns)

`ColorRamp`: The cloned color ramp

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#clone-example)

```js
// clone a builtin color ramp.
const myColorRamp = ColorRampCollection.JET.clone();
```

JavaScript

Copy

getBounds()

Get the colorramp starts and end values.


[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#getBounds-returns)

`Object`: The color ramp `min` and `max` values

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#getBounds-example)

```js
// getBounds color ramp.
const myColorRampBounds = ColorRampCollection.JET.getBounds();
```

JavaScript

Copy

getCanvasStrip(options?)

Get the colorramp starts and end values.


[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#getCanvasStrip-parameters)

options?
(`Object`)
: The options object.

| options.horizontal<br>boolean?<br>default: `true` |  |
| options.size<br>number?<br>default: `512` |  |
| options.smooth<br>boolean?<br>default: `true` |  |

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#getCanvasStrip-returns)

`HTMLCanvasElement`: The color ramp `canvas`

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#getCanvasStrip-example)

```js
// getCanvasStrip color ramp.
const canvas = ColorRampCollection.JET.getCanvasStrip();
```

JavaScript

Copy

getColor
(value, options?)

Get the color for a given value.

[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColor-parameters)

value
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: value from color


options?
(`Object`)
: The options object.

| options.smooth<br>boolean?<br>default: `true` |  |

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColor-returns)

`RgbaColor`: The color for the given value

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColor-example)

```js
// getColor color ramp.
const color = ColorRampCollection.JET.getColor(0.5);
```

JavaScript

Copy

getColorHex
(value, options?)

Get the color as an hexadecimal string for a given value.

[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColorHex-parameters)

value
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: value from color


options?
(`Object`)
: The options object.

| options.smooth<br>boolean?<br>default: `true` |  |
| options.withAlpha<br>boolean?<br>default: `false` |  |

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColorHex-returns)

`HexColor`: The color for the given value

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColorHex-example)

```js
// getColorHex color ramp.
const color = ColorRampCollection.JET.getColorHex(0.5);
```

JavaScript

Copy

getColorRelative
(value, options?)

Get the color of the color ramp at a relative position in \[0, 1\]

[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColorRelative-parameters)

value
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: value from color


options?
(`Object`)
: The options object.

| options.smooth<br>boolean?<br>default: `true` |  |

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColorRelative-returns)

`RgbaColor`: The color for the given value

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#getColorRelative-example)

```js
// getColorRelative color ramp.
const color = ColorRampCollection.JET.getColorRelative(0.5);
```

JavaScript

Copy

getRawColorStops
()

Get color ramp color stops array.

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#getRawColorStops-returns)

`Array`: ColorStop

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#getRawColorStops-example)

```js
// getRawColorStops color ramp.
const colorStops = ColorRampCollection.HOT.getRawColorStops();
```

JavaScript

Copy

reverse
(options?)

Reverse the color ramp.

[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#reverse-parameters)

options?
(`Object`)
: The options object.

| options.clone<br>boolean?<br>default: `true` | Clone the reverse color ramp |

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#reverse-returns)

`ColorRamp`: The reversed color ramp

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#reverse-example)

```js
// reverse color ramp.
const myColorRamp = ColorRampCollection.JET.reverse();
```

JavaScript

Copy

scale
(min, max, options?)

Scale the color ramp min and max values.

[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#scale-parameters)

min
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: Minimum color ramp value

max
([`number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: Maximum color ramp value

options?
(`Object`)
: The options object.

| options.clone<br>boolean?<br>default: `true` | Clone the scaled color ramp |

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#scale-returns)

`ColorRamp`: The scaled color ramp

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#scale-example)

```js
// scale color ramp.
const myColorRamp = ColorRampCollection.TEMPERATURE.scale(-65, 55);
```

JavaScript

Copy

setStops
(stops, options?)

Change the color ramp stops values and colors

[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#setStops-parameters)

stops
( [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) <ColorStop>)
: New color stops

options?
(`Object`)
: The options object.

| options.clone<br>boolean?<br>default: `true` | Clone the color ramp |

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#setStops-returns)

`ColorRamp`: The color ramp with the new stops

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#setStops-example)

```js
// set color ramp stops.
const myTempRamp = ColorRampCollection.TEMPERATURE.setStops([\
  { value: -65, color: [3, 78, 77, 255] },\
  { value: -55, color: [4, 98, 96, 255] },\
  { value: -40, color: [5, 122, 120, 255] },\
  { value: -25, color: [6, 152, 149, 255] },\
  { value: -20, color: [8, 201, 198, 255] },\
  { value: -12, color: [20, 245, 241, 255] },\
  { value: -8, color: [108, 237, 249, 255] },\
  { value: -4, color: [133, 205, 250, 255] },\
  { value: 0, color: [186, 227, 252, 255] },\
  { value: 4, color: [238, 221, 145, 255] },\
  { value: 8, color: [232, 183, 105, 255] },\
  { value: 12, color: [232, 137, 69, 255] },\
  { value: 20, color: [231, 107, 24, 255] },\
  { value: 25, color: [236, 84, 19, 255] },\
  { value: 30, color: [236, 44, 19, 255] },\
  { value: 40, color: [123, 23, 10, 255] },\
  { value: 55, color: [91, 11, 0, 255] },\
]);
```

JavaScript

Copy

fromArrayDefinition
(cr)

`Static` Converts a array-definition color ramp definition into a usable ColorRamp instance. Note: units are not converted and may need to to be converted beforehand (eg. kelvin to centigrade)

[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#fromArrayDefinition-parameters)

cr
( [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) <ArrayColorRampStop>)
: A color ramp as per array definition

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#fromArrayDefinition-returns)

`ColorRamp`: The new color ramp

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#fromArrayDefinition-example)

```js
// create a new color ramp.
const myColorRamp = ColorRamp.fromArrayDefinition([\
  [-65, [3, 78, 77, 255]],\
  [-55, [4, 98, 96, 255]],\
  [-40, [5, 122, 120, 255]],\
  [-25, [6, 152, 149, 255]],\
  [-20, [8, 201, 198, 255]],\
  [-12, [20, 245, 241, 255]],\
  [-8, [108, 237, 249, 255]],\
  [-4, [133, 205, 250, 255]],\
  [0, [186, 227, 252, 255]],\
  [4, [238, 221, 145, 255]],\
  [8, [232, 183, 105, 255]],\
  [12, [232, 137, 69, 255]],\
  [20, [231, 107, 24, 255]],\
  [25, [236, 84, 19, 255]],\
  [30, [236, 44, 19, 255]],\
  [40, [123, 23, 10, 255]],\
  [55, [91, 11, 0, 255]],\
]);
```

JavaScript

Copy

resample
(method, samples)

Apply a non-linear ressampling. This will create a new instance of ColorRamp with the same bounds.
Check out the [non-linear color ramps](https://docs.maptiler.com/sdk-js/api/color-ramp/#color-ramp-non-linear) section to see how to apply the resampling to a point layer visualization.


[Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#resample-parameters)

method
(`"ease-in-square"` \|
`"ease-out-square"` \|
`"ease-in-sqrt"` \|
`"ease-out-sqrt"` \|
`"ease-in-exp"` \|
`"ease-out-exp"`)
: Ressampling method

samples
( [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))
: number of steps. Default: 15

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#resample-returns)

`ColorRamp`: The new color ramp

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#resample-example)

```js
// create a new color ramp.
const myColorRamp = ColorRampCollection.PORTLAND.scale(200, 2000).resample("ease-out-sqrt");
```

JavaScript

Copy

transparentStart
()

Makes a clone of this color ramp that is fully transparant at the begining of their range.

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#transparentStart-returns)

`ColorRamp`: The new color ramp

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#transparentStart-example)

```js
// create a new color ramp.
const myColorRamp = ColorRampCollection.PORTLAND.transparentStart();
```

JavaScript

Copy

hasTransparentStart
()

Check if this color ramp has a transparent start.

[Returns](https://docs.maptiler.com/sdk-js/api/color-ramp/#hasTransparentStart-returns)

`Boolean`: color ramp has a transparent start

[Example](https://docs.maptiler.com/sdk-js/api/color-ramp/#hasTransparentStart-example)

```js
// Check if this color ramp has a transparent start.
const isTransparent = ColorRampCollection.JET.hasTransparentStart();
```

JavaScript

Copy

## [Non-linear color ramps](https://docs.maptiler.com/sdk-js/api/color-ramp/\#color-ramp-non-linear)

In this section we will see how to use the `resample`
function of a color ramp to improve the visualization of data from a point layer.

We are using a large dataset containing all the [public schools](https://docs.maptiler.com/sdk-js/assets/schools.geojson) in the US.
We are using the `PORTLAND` color ramp:

For the purpose of visualising the number of students, we are going to scale the `PORTLAND`
color ramp on the range `300` to `4000`
as most schools will contains more than 300 students and less than 4000.

### [Linear](https://docs.maptiler.com/sdk-js/api/color-ramp/\#color-ramp-linear)

We used the following color ramp definition:

```js
import { ColorRampCollection } from "@maptiler/sdk";

const ramp = ColorRampCollection.PORTLAND.scale(300, 4000);
```

JavaScript

Copy

Here is how the data looks like over a New York City:

![NY schools linear color ramp data visualization](https://docs.maptiler.com/sdk-js/api/color-ramp/img/color-ramp-linear.webp)

It's not entirely bad, but only the very large schools stand out and it's quite difficult,
without looking at the numbers, to differentiate all the blue dots just from their color variations.

Generally speaking in data visualisation, small variations matter towards the lower bound and large variations
matter towards the upper bound. For this particular dataset, we would like a schools with 300 students to show
differently from a school with 500 (IOW, a small difference of 200 in the lower bound), but we would like a school
with 3800 students to look roughly the same as one with 4000 students (IOW, a small difference on the upper bound).
And this is where **non linear rescaling** or color ramps comes into play!

### [Non-linear: ease-out square-root](https://docs.maptiler.com/sdk-js/api/color-ramp/\#color-ramp-non-linear-ease-out-square-root)

_Easing-out_ is a way to say that something accelerates a lot at the beginning of a given interval
and slows down towards the end, while still increasing all the way (aka. monotonically increasing).

To perform the nonlinear rescaling of color ramps, MapTiler SDK performs some intermediate range changes so
that only the range `[0, 1]` is actually relevant to observe
(but then rescaled to its original range). Here is how the square root function looks like,
naturally being of the ease-out kind:

![Non-linear: ease-out square-root chart](https://docs.maptiler.com/sdk-js/api/color-ramp/img/ease-out-square-root.png)

To obtain a `PORTLAND` color ramp scaled with the square root method, we can do:

```js
import { ColorRampCollection } from "@maptiler/sdk";

const ramp = ColorRampCollection.PORTLAND.scale(300, 4000).resample("ease-out-sqrt");
```

JavaScript

Copy

This results in the following version of `PORTLAND`:

As we can see if we compare with its linear version, this resampled color ramp is slightly left-skewed
and shows much faster variations towards the beginning of the range. That's exactly what we want to leverage
to better visualise the differences between schools with fewer number of students.

Here is how the same data looks like now:

![NY schools non linear ease-out square-root color ramp data visualization](https://docs.maptiler.com/sdk-js/api/color-ramp/img/color-ramp-ease-out-square-root.webp)

It's no longer about blue dots everywhere! We can now fairly easily differentiate a school
with 400 students than one with 800.

### [Non-linear going too far: ease-out exponential](https://docs.maptiler.com/sdk-js/api/color-ramp/\#color-ramp-non-linear-ease-out-exp)

Some functions have a much steeper slope than the square root function and would emphasise the differences
even more on the lower bound, maybe a bit too much, at the expense of clarity for the rest of the range.

For very specific usages, the SDK features an exponential resampling.
Here is how its function looks like on `[0, 1]` range:

![Non-linear: ease-out-exp chart](https://docs.maptiler.com/sdk-js/api/color-ramp/img/ease-out-exp.png)

As we can see, starting from `x = 0.5` there is very little variation left.

Here is how to create the corresponding `PORTLAND` color ramp:

```js
import { ColorRampCollection } from "@maptiler/sdk";

const ramp = ColorRampCollection.PORTLAND.scale(300, 4000).resample("ease-out-exp");
```

JavaScript

Copy

The color ramp created looks very left-skewed:

And the map visualisation:

![NY schools non linear exponential color ramp data visualization](https://docs.maptiler.com/sdk-js/api/color-ramp/img/color-ramp-ease-out-exp.webp)

The South Bronx (north of Manhattan) contains many smaller schools that now look like they no longer have this
blue color representative of the lower bound from the Portland color ramp.
This is basically means we crossed a line in terms of resampling function and that our color ramp is no longer
suitable for our purpose.

Of course, knowing that the granularity of the color ramp on the second half is very poor,
we can change its range, maybe double it to `[300, 8000]`:

```js
import { ColorRampCollection } from "@maptiler/sdk";

const ramp = ColorRampCollection.PORTLAND.scale(300, 8000).resample("ease-out-exp");
```

JavaScript

Copy

And we would still obtain a decent visualisation:

![NY schools non linear exponential color ramp data visualization with a larger range](https://docs.maptiler.com/sdk-js/api/color-ramp/img/color-ramp-ease-out-exp-300-8000-range.png)

But then, the process is backward and means the data range is adapted based on the capabilities and limitations
of the color ramp. This adds an unnecessary overhead.

For this visualization we recommend using **Non-linear: ease-out square-root**`.resample("ease-out-sqrt)`.

## [Builtin color ramps](https://docs.maptiler.com/sdk-js/api/color-ramp/\#color-ramp-builtin)

The SDK includes many built-in ready to use color ramps as well as extra logic to manipulate them and create new ones,
here is the full list:

NULL (min: 0, max: 1)

GRAY (min: 0, max: 1)

JET (min: 0, max: 1)

HSV (min: 0, max: 1)

HOT (min: 0, max: 1)

SPRING (min: 0, max: 1)

SUMMER (min: 0, max: 1)

AUTOMN (min: 0, max: 1)

WINTER (min: 0, max: 1)

BONE (min: 0, max: 1)

COPPER (min: 0, max: 1)

GREYS (min: 0, max: 1)

YIGNBU (min: 0, max: 1)

GREENS (min: 0, max: 1)

YIORRD (min: 0, max: 1)

BLUERED (min: 0, max: 1)

RDBU (min: 0, max: 1)

PICNIC (min: 0, max: 1)

RAINBOW (min: 0, max: 1)

PORTLAND (min: 0, max: 1)

BLACKBODY (min: 0, max: 1)

EARTH (min: 0, max: 1)

ELECTRIC (min: 0, max: 1)

VIRIDIS (min: 0, max: 1)

INFERNO (min: 0, max: 1)

MAGMA (min: 0, max: 1)

PLASMA (min: 0, max: 1)

WARM (min: 0, max: 1)

COOL (min: 0, max: 1)

RAINBOW\_SOFT (min: 0, max: 1)

BATHYMETRY (min: 0, max: 1)

CDOM (min: 0, max: 1)

CHLOROPHYLL (min: 0, max: 1)

DENSITY (min: 0, max: 1)

FREESURFACE\_BLUE (min: 0, max: 1)

FREESURFACE\_RED (min: 0, max: 1)

OXYGEN (min: 0, max: 1)

PAR (min: 0, max: 1)

PHASE (min: 0, max: 1)

SALINITY (min: 0, max: 1)

TEMPERATURE (min: 0, max: 1)

TURBIDITY (min: 0, max: 1)

VELOCITY\_BLUE (min: 0, max: 1)

VELOCITY\_GREEN (min: 0, max: 1)

CUBEHELIX (min: 0, max: 1)

CIVIDIS (min: 0, max: 1)

TURBO (min: 0, max: 1)

ROCKET (min: 0, max: 1)

MAKO (min: 0, max: 1)

##### [Types and Interfaces](https://docs.maptiler.com/sdk-js/api/color-ramp/\#types)

###### [ColorStop](https://docs.maptiler.com/sdk-js/api/color-ramp/\#ColorStop)

```js
{
  value: number, // The "value" at which this ColorStop should be applied.
  color: string // GB[A] - Array of 3-4 numbers. 0-255 per channel.
}
```

JavaScript

Copy


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Parameters](https://docs.maptiler.com/sdk-js/api/color-ramp/#color-ramp-parameters)
- [Methods](https://docs.maptiler.com/sdk-js/api/color-ramp/#color-ramp-methods)
- [Non-linear color ramps](https://docs.maptiler.com/sdk-js/api/color-ramp/#color-ramp-non-linear)
- [Builtin color ramps](https://docs.maptiler.com/sdk-js/api/color-ramp/#color-ramp-builtin)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Color Ramp

Color Ramp

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)