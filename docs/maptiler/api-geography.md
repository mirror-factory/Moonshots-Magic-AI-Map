# Coordinates

General utilities and types that relate to working with and manipulating geographic information or geometries.


## [LngLat](https://docs.maptiler.com/sdk-js/api/geography/\#lnglat)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/geo/lng\_lat.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/geo/lng_lat.ts#L31-L151)

A `LngLat` object represents a given longitude and latitude coordinate, measured in degrees.
These coordinates are based on the [WGS84\\
(EPSG:4326) standard](https://en.wikipedia.org/wiki/World_Geodetic_System#WGS84).

SDK JS uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match the
[GeoJSON specification](https://tools.ietf.org/html/rfc7946).


Note that any SDK JS method that accepts a `LngLat` object as an argument or option
can also accept an `Array` of two numbers and will perform an implicit conversion.
This flexible type is documented as [LngLatLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike).

### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#lnglat-example)

```js
const ll = new maptilersdk.LngLat(-123.9749, 40.7736);
ll.lng; // = -123.9749
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#lnglat-parameters)

lng`(number)`Longitude,
measured in degrees.


lat`(number)`Latitude,
measured in degrees.


### [Static Members](https://docs.maptiler.com/sdk-js/api/geography/\#lnglat-static-members)

convert(input)

Converts an array of two numbers or an object with `lng` and `lat` or
`lon` and `lat` properties
to a `LngLat` object.

If a `LngLat` object is passed in, the function returns it unchanged.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#convert-lnglat-parameters)

input`(LngLatLike)`An
array of two numbers or object to convert, or a
`LngLat`
object to return.


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#convert-lnglat-returns)

`LngLat`: A new
`LngLat`
object, if a conversion occurred, or the original
`LngLat`
object.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#convert-lnglat-example)

```js
const arr = [-73.9749, 40.7736];
const ll = maptilersdk.LngLat.convert(arr);
ll;   // = LngLat {lng: -73.9749, lat: 40.7736}
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/geography/\#lnglat-instance-members)

distanceTo(lngLat)

Returns the approximate distance between a pair of coordinates in meters
Uses the Haversine Formula (from R.W. Sinnott, "Virtues of the Haversine", Sky and Telescope, vol. 68, no.
2, 1984, p. 159)

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#distanceto-parameters)

lngLat`(LngLat)`coordinates
to compute the distance to


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#distanceto-returns)

`number`:
Distance in meters between the two coordinates.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#distanceto-example)

```js
const new_york = new maptilersdk.LngLat(-74.0060, 40.7128);
const los_angeles = new maptilersdk.LngLat(-118.2437, 34.0522);
new_york.distanceTo(los_angeles); // = 3935751.690893987, "true distance" using a non-spherical approximation is ~3966km
```

JavaScript

Copy

toArray()

Returns the coordinates represented as an array of two numbers.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#toarray-lnglat-returns)

`Array<number>`:
The coordinates represeted as an array of longitude and latitude.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#toarray-lnglat-example)

```js
const ll = new maptilersdk.LngLat(-73.9749, 40.7736);
ll.toArray(); // = [-73.9749, 40.7736]
```

JavaScript

Copy

toString()

Returns the coordinates represent as a string.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#tostring-lnglat-returns)

`string`:
The coordinates represented as a string of the format
`'LngLat(lng, lat)'`
.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#tostring-lnglat-example)

```js
const ll = new maptilersdk.LngLat(-73.9749, 40.7736);
ll.toString(); // = "LngLat(-73.9749, 40.7736)"
```

JavaScript

Copy

wrap()

Returns a new `LngLat` object whose longitude is wrapped to the range (-180, 180).

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#wrap-returns)

`LngLat`:
The wrapped
`LngLat`
object.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#wrap-example)

```js
const ll = new maptilersdk.LngLat(286.0251, 40.7736);
const wrapped = ll.wrap();
wrapped.lng; // = -73.9749
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/geography/\#lnglat-related)

- [Get coordinates of the mouse\\
pointer](https://docs.maptiler.com/sdk-js/examples/mouse-position/)
- [Display a popup](https://docs.maptiler.com/sdk-js/examples/popup/)
- [Create a timeline\\
animation](https://docs.maptiler.com/sdk-js/examples/timeline-animation/)

## [Point](https://docs.maptiler.com/sdk-js/api/geography/\#point)![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/Point.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/Point.ts)

A [Point](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/Point.ts) two numbers representing
`x` and `y` screen coordinates in pixels.

### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#point-example)

```js
const p1 = new Point(-77, 38);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#point-parameters)

x`(number)`Longitude,
measured in degrees.


y`(number)`Latitude,
measured in degrees.


### [Static Members](https://docs.maptiler.com/sdk-js/api/geography/\#point-static-members)

convert(a \| p)

Construct a point from an array if necessary, otherwise if the input is already a Point, or an unknown type, return it unchanged.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#convert-point-parameters)

a`(Array[number])`An array of two numbers


p`(Point)`the point to return


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#convert-point-returns)

`Point`:
The new constructed point, or passed-through value..


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#convert-point-example)

```js
const new_york = maptilersdk.Point.convert([-74.0060, 40.7128]);

// is equivalent to
const new_york = new maptilersdk.Point(-74.0060, 40.7128)
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/geography/\#point-instance-members)

add(p)

Add this point's x & y coordinates to another point, yielding a new point.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#add-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#add-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#add-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.add(los_angeles);
```

JavaScript

Copy

angle()

Get the angle from the 0, 0 coordinate to this point, in radians coordinates.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#angle-returns)

`number`:
The angle in radians.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#angle-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.angle();
```

JavaScript

Copy

angleTo(p)

Get the angle from this point to another point, in radians

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#angleTo-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#angleTo-returns)

`number`:
The angle in radians.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#angleTo-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.angleTo(los_angeles);
```

JavaScript

Copy

angleWith(p)

Get the angle between this point and another point, in radians

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#angleWith-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#angleWith-returns)

`number`:
The angle in radians.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#angleWith-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.angleWith(los_angeles);
```

JavaScript

Copy

angleWithSep(x, y)

Find the angle of the two vectors, solving the formula for the cross product a x b = \|a\|\|b\|sin(θ) for θ.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#angleWithSep-parameters)

x`(number)`the x-coordinate


y`(number)`the y-coordinate


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#angleWithSep-returns)

`number`:
The angle in radians.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#angleWithSep-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.angleWithSep(-118.2437, 34.0522);
```

JavaScript

Copy

clone()

Clone this point, returning a new point that can be modified without affecting the old one.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#clone-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#clone-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.clone();
```

JavaScript

Copy

dist(p)

Calculate the distance from this point to another point.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#dist-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#dist-returns)

`number`:
The distance.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#dist-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.dist(los_angeles);
```

JavaScript

Copy

distSqr(p)

Calculate the distance from this point to another point, without the square root step. Useful if you're comparing relative distances.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#distSqr-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#distSqr-returns)

`number`:
The distance.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#distSqr-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.distSqr(los_angeles);
```

JavaScript

Copy

div(k)

Divide this point's x & y coordinates by a factor, yielding a new point.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#div-parameters)

k`(number)`the factor


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#div-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#div-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.div(2);
```

JavaScript

Copy

divByPoint(p)

Divide this point's x & y coordinates by point, yielding a new point.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#divByPoint-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#divByPoint-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#divByPoint-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.divByPoint(los_angeles);
```

JavaScript

Copy

equals(p)

Judge whether this point is equal to another point, returning true or false.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#equals-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#equals-returns)

`boolean`:
Whether the points are equal.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#equals-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.equals(los_angeles);
```

JavaScript

Copy

mag()

Return the magnitude of this point: this is the Euclidean distance from the 0, 0 coordinate to this point's x and y coordinates.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#mag-returns)

`number`:
The magnitude.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#mag-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.mag();
```

JavaScript

Copy

matMult(m)

Multiply this point by a 4x1 transformation matrix.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#matMult-parameters)

m`(Matrix2)`Transformation matrix


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#matMult-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#matMult-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.matMult([1, 0, 1, 0]);
```

JavaScript

Copy

mult(k)

Multiply this point's x & y coordinates by a factor, yielding a new point.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#mult-parameters)

k`(number)`the factor


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#mult-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#mult-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.mult(2);
```

JavaScript

Copy

multByPoint(p)

Multiply this point's x & y coordinates by point, yielding a new point.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#multByPoint-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#multByPoint-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#multByPoint-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.multByPoint(los_angeles);
```

JavaScript

Copy

perp()

Compute a perpendicular point, where the new y coordinate is the old x coordinate and the new x coordinate is the old y coordinate multiplied by -1.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#perp-returns)

`Point`:
The perpendicular point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#perp-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.perp();
```

JavaScript

Copy

rotate(a)

Rotate this point around the 0, 0 origin by an angle a, given in radians.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#rotate-parameters)

a`(number)`angle to rotate around, in radians


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#rotate-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#rotate-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.rotate(2);
```

JavaScript

Copy

rotateAround(a, p)

Rotate this point around p point by an angle a, given in radians.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#rotateAround-parameters)

a`(number)`angle to rotate around, in radians


p`(Point)`Point to rotate around


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#rotateAround-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#rotateAround-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
          const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.rotateAround(2, los_angeles);
```

JavaScript

Copy

round()

Return a version of this point with the x & y coordinates rounded to integers.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#round-returns)

`Point`:
The new rounded point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#round-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.round();
```

JavaScript

Copy

sub(p)

Subtract this point's x & y coordinates to from point, yielding a new point.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#sub-parameters)

p`(Point)`the other point


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#sub-returns)

`Point`:
The new point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#sub-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
const los_angeles = new maptilersdk.Point(-118.2437, 34.0522);
new_york.sub(los_angeles);
```

JavaScript

Copy

unit()

Calculate this point but as a unit vector from 0, 0, meaning that the distance from the resulting point to the 0, 0 coordinate will be equal to 1 and the angle from the resulting point to the 0, 0 coordinate will be the same as before.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#unit-returns)

`Point`:
The unit vector point.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#unit-example)

```js
const new_york = new maptilersdk.Point(-74.0060, 40.7128);
new_york.unit();
```

JavaScript

Copy

## [LngLatBounds](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatbounds)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/geo/lng\_lat\_bounds.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/geo/lng_lat_bounds.ts#L22-L258)

A `LngLatBounds` object represents a geographical bounding box,
defined by its southwest and northeast points in longitude and latitude.

If no arguments are provided to the constructor, a `null` bounding box is created.

Note that any GL method that accepts a `LngLatBounds` object as an argument or option
can also accept an `Array` of two [LngLatLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike) constructs and will perform an implicit
conversion.
This flexible type is documented as [LngLatBoundsLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatboundslike).

### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatbounds-example)

```js
const sw = new maptilersdk.LngLat(-73.9876, 40.7661);
const ne = new maptilersdk.LngLat(-73.9397, 40.8002);
const llb = new maptilersdk.LngLatBounds(sw, ne);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatbounds-parameters)

sw`(LngLatLike?)`The
southwest corner of the bounding box.


ne`(LngLatLike?)`The
northeast corner of the bounding box.


### [Static Members](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatbounds-static-members)

convert(input)

Converts an array to a `LngLatBounds` object.

If a `LngLatBounds` object is passed in, the function returns it unchanged.

Internally, the function calls `LngLat#convert` to convert arrays to `LngLat`
values.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#convert-lnglatbounds-parameters)

input`(LngLatBoundsLike)`An
array of two coordinates to convert, or a
`LngLatBounds`
object to return.


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#convert-lnglatbounds-returns)

`LngLatBounds`:
A new
`LngLatBounds`
object, if a conversion occurred, or the original
`LngLatBounds`
object.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#convert-lnglatbounds-example)

```js
const arr = [[-73.9876, 40.7661], [-73.9397, 40.8002]];
const llb = maptilersdk.LngLatBounds.convert(arr);
llb;   // = LngLatBounds {_sw: LngLat {lng: -73.9876, lat: 40.7661}, _ne: LngLat {lng: -73.9397, lat: 40.8002}}
```

JavaScript

Copy

fromLngLat(center, radius)

Returns a `LngLatBounds` from the coordinates extended by a given `radius`. The
returned `LngLatBounds` completely contains the `radius`.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#fromLngLat-lnglatbounds-parameters)

center`(LngLat)`(default
`undefined`)Center coordinates of the new bounds.


radius`(number)`(default
`0`)Distance in meters from the coordinates to extend the bounds.


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#fromLngLat-lnglatbounds-returns)

`LngLatBounds`:
A new
`LngLatBounds`
object representing the coordinates extended by the
`radius`
.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#fromLngLat-lnglatbounds-example)

```js
const center = new maptilersdk.LngLat(-73.9749, 40.7736);
const ll = maptilersdk.LngLatBounds.fromLngLat(center, 100).toArray(); // = [[-73.97501862141328, 40.77351016847229], [-73.97478137858673, 40.77368983152771]]
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatbounds-instance-members)

contains(lnglat)

Check if the point is within the bounding box.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#contains-parameters)

lnglat`(LngLatLike)`geographic
point to check against.


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#contains-returns)

`boolean`:
True if the point is within the bounding box.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#contains-example)

```js
const llb = new maptilersdk.LngLatBounds(
  new maptilersdk.LngLat(-73.9876, 40.7661),
  new maptilersdk.LngLat(-73.9397, 40.8002)
);

const ll = new maptilersdk.LngLat(-73.9567, 40.7789);

console.log(llb.contains(ll)); // = true
```

JavaScript

Copy

extend(obj)

Extend the bounds to include a given LngLatLike or LngLatBoundsLike.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#extend-parameters)

obj`((LngLatLike | LngLatBoundsLike))`object
to extend to


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#extend-returns)

`LngLatBounds`:
`this`

getCenter()

Returns the geographical coordinate equidistant from the bounding box's corners.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getcenter-lnglatbounds-returns)

`LngLat`: The
bounding box's center.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#getcenter-lnglatbounds-example)

```js
const llb = new maptilersdk.LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002]);
llb.getCenter(); // = LngLat {lng: -73.96365, lat: 40.78315}
```

JavaScript

Copy

getEast()

Returns the east edge of the bounding box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#geteast-returns)

`number`:
The east edge of the bounding box.


getNorth()

Returns the north edge of the bounding box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getnorth-returns)

`number`:
The north edge of the bounding box.


getNorthEast()

Returns the northeast corner of the bounding box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getnortheast-returns)

`LngLat`: The
northeast corner of the bounding box.


getNorthWest()

Returns the northwest corner of the bounding box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getnorthwest-returns)

`LngLat`: The
northwest corner of the bounding box.


getSouth()

Returns the south edge of the bounding box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getsouth-returns)

`number`:
The south edge of the bounding box.


getSouthEast()

Returns the southeast corner of the bounding box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getsoutheast-returns)

`LngLat`: The
southeast corner of the bounding box.


getSouthWest()

Returns the southwest corner of the bounding box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getsouthwest-returns)

`LngLat`: The
southwest corner of the bounding box.


getWest()

Returns the west edge of the bounding box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getwest-returns)

`number`:
The west edge of the bounding box.


isEmpty()

Check if the bounding box is an empty/`null`-type box.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#isempty-returns)

`boolean`:
True if bounds have been defined, otherwise false.


setNorthEast(ne)

Set the northeast corner of the bounding box

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#setnortheast-parameters)

ne`(LngLatLike)`a
[LngLatLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike)
object describing the northeast corner of the bounding box.


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#setnortheast-returns)

`LngLatBounds`:
`this`

setSouthWest(sw)

Set the southwest corner of the bounding box

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#setsouthwest-parameters)

sw`(LngLatLike)`a
[LngLatLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike)
object describing the southwest corner of the bounding box.


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#setsouthwest-returns)

`LngLatBounds`:
`this`

toArray()

Returns the bounding box represented as an array.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#toarray-lnglatbounds-returns)

`Array<Array<number>>`:
The bounding box represented as an array, consisting of the
southwest and northeast coordinates of the bounding represented as arrays of numbers.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#toarray-lnglatbounds-example)

```js
const llb = new maptilersdk.LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002]);
llb.toArray(); // = [[-73.9876, 40.7661], [-73.9397, 40.8002]]
```

JavaScript

Copy

toString()

Return the bounding box represented as a string.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#tostring-lnglatbounds-returns)

`string`:
The bounding box represents as a string of the format

`'LngLatBounds(LngLat(lng, lat), LngLat(lng, lat))'`
.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#tostring-lnglatbounds-example)

```js
const llb = new maptilersdk.LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002]);
llb.toString(); // = "LngLatBounds(LngLat(-73.9876, 40.7661), LngLat(-73.9397, 40.8002))"
```

JavaScript

Copy

## [LngLatLike](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatlike)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/geo/lng\_lat.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/geo/lng_lat.ts#L153-L162)

A [LngLat](https://docs.maptiler.com/sdk-js/api/geography/#lnglat) object, an array of two numbers representing
longitude and latitude,
or an object with `lng` and `lat` or `lon` and `lat` properties.

### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatlike-example)

```js
const v1 = new maptilersdk.LngLat(-122.420679, 37.772537);
const v2 = [-122.420679, 37.772537];
const v3 = {lon: -122.420679, lat: 37.772537};
```

JavaScript

Copy

## [PointLike](https://docs.maptiler.com/sdk-js/api/geography/\#pointlike)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/ui/camera.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/ui/camera.ts#L17-L24)

A [Point](https://github.com/mapbox/point-geometry) or an array of two numbers representing
`x` and `y` screen coordinates in pixels.

### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#pointlike-example)

```js
const p1 = new Point(-77, 38); // a PointLike which is a Point
const p2 = [-77, 38]; // a PointLike which is an array of two numbers
```

JavaScript

Copy

## [LngLatBoundsLike](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatboundslike)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/geo/lng\_lat\_bounds.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/geo/lng_lat_bounds.ts#L260-L272)

A [LngLatBounds](https://docs.maptiler.com/sdk-js/api/geography/#lnglatbounds) object, an array of [LngLatLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike) objects in \[sw, ne\] order,
or an array of numbers in \[west, south, east, north\] order.

### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#lnglatboundslike-example)

```js
const v1 = new maptilersdk.LngLatBounds(
  new maptilersdk.LngLat(-73.9876, 40.7661),
  new maptilersdk.LngLat(-73.9397, 40.8002)
);
const v2 = new maptilersdk.LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002])
const v3 = [[-73.9876, 40.7661], [-73.9397, 40.8002]];
```

JavaScript

Copy

## [MercatorCoordinate](https://docs.maptiler.com/sdk-js/api/geography/\#mercatorcoordinate)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/geo/mercator\_coordinate.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/geo/mercator_coordinate.ts#L77-L146)

A `MercatorCoordinate` object represents a projected three dimensional position.

`MercatorCoordinate` uses the web mercator projection ( [EPSG:3857](https://epsg.io/3857))
with slightly different units:

- the size of 1 unit is the width of the projected world instead of the "mercator meter"
- the origin of the coordinate space is at the north-west corner instead of the middle

For example, `MercatorCoordinate(0, 0, 0)` is the north-west corner of the mercator world and
`MercatorCoordinate(1, 1, 0)` is the south-east corner. If you are familiar with
[vector tiles](https://github.com/mapbox/vector-tile-spec) it may be helpful to think
of the coordinate space as the `0/0/0` tile with an extent of `1`.


The `z` dimension of `MercatorCoordinate` is conformal. A cube in the mercator coordinate
space would be rendered as a cube.

### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#mercatorcoordinate-example)

```js
const nullIsland = new maptilersdk.MercatorCoordinate(0.5, 0.5, 0);
```

JavaScript

Copy

### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#mercatorcoordinate-parameters)

x`(number)`The
x component of the position.


y`(number)`The
y component of the position.


z`(number)`(default
`0`)The z component of the position.


### [Static Members](https://docs.maptiler.com/sdk-js/api/geography/\#mercatorcoordinate-static-members)

fromLngLat(lngLatLike,
altitude)

Project a `LngLat` to a `MercatorCoordinate`.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#fromlnglat-mercatorcoordinate-parameters)

lngLatLike`(LngLatLike)`The
location to project.


altitude`(number)`(default
`0`)The altitude in meters of the position.


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#fromlnglat-mercatorcoordinate-returns)

`MercatorCoordinate`:
The projected mercator coordinate.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#fromlnglat-mercatorcoordinate-example)

```js
const coord = maptilersdk.MercatorCoordinate.fromLngLat({ lng: 0, lat: 0}, 0);
coord; // MercatorCoordinate(0.5, 0.5, 0)
```

JavaScript

Copy

### [Methods](https://docs.maptiler.com/sdk-js/api/geography/\#mercatorcoordinate-instance-members)

meterInMercatorCoordinateUnits()

Returns the distance of 1 meter in `MercatorCoordinate` units at this latitude.

For coordinates in real world units using meters, this naturally provides the scale
to transform into `MercatorCoordinate`s.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#meterinmercatorcoordinateunits-returns)

`number`:
Distance of 1 meter in
`MercatorCoordinate`
units.


toAltitude()

Returns the altitude in meters of the coordinate.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#toaltitude-returns)

`number`:
The altitude in meters.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#toaltitude-example)

```js
const coord = new maptilersdk.MercatorCoordinate(0, 0, 0.02);
coord.toAltitude(); // 6914.281956295339
```

JavaScript

Copy

toLngLat()

Returns the `LngLat` for the coordinate.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#tolnglat-returns)

`LngLat`: The
`LngLat`
object.


##### [Example](https://docs.maptiler.com/sdk-js/api/geography/\#tolnglat-example)

```js
const coord = new maptilersdk.MercatorCoordinate(0.5, 0.5, 0);
const lngLat = coord.toLngLat(); // LngLat(0, 0)
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/geography/\#mercatorcoordinate-related)

- [Add a custom style\\
layer](https://docs.maptiler.com/sdk-js/examples/custom-style-layer/)

## [EdgeInsets](https://docs.maptiler.com/sdk-js/api/geography/\#edgeinsets)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/geo/edge\_insets.ts](https://github.com/maplibre/maplibre-gl-js/tree/v5.14.0/src/geo/edge_insets.ts#L15-L97)

An `EdgeInset` object represents screen space padding applied to the edges of the viewport.
This shifts the apprent center or the vanishing point of the map. This is useful for adding floating UI elements
on top of the map and having the vanishing point shift as UI elements resize.

### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#edgeinsets-parameters)

top`(number)`(default
`0`)

bottom`(number)`(default
`0`)

left`(number)`(default
`0`)

right`(number)`(default
`0`)

### [Static Members](https://docs.maptiler.com/sdk-js/api/geography/\#edgeinsets-static-members)

getCenter(width, height)

Utility method that computes the new apprent center or vanishing point after applying insets.
This is in pixels and with the top left being (0.0) and +y being downwards.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#getcenter-edgeinsets-parameters)

width`(number)`the
width


height`(number)`the
height


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#getcenter-edgeinsets-returns)

`Point`: the point


interpolate(start, target, t)

Interpolates the inset in-place.
This maintains the current inset value for any inset not present in `target`.

##### [Parameters](https://docs.maptiler.com/sdk-js/api/geography/\#interpolate-parameters)

start`((PaddingOptions | EdgeInsets))`interpolation
start


target`(PaddingOptions)`interpolation
target


t`(number)`interpolation
step/weight


##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#interpolate-returns)

`EdgeInsets`:
the insets


toJSON()

Returns the current state as json, useful when you want to have a
read-only representation of the inset.

##### [Returns](https://docs.maptiler.com/sdk-js/api/geography/\#tojson-returns)

`PaddingOptions`:
state as json



Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [LngLat](https://docs.maptiler.com/sdk-js/api/geography/#lnglat)
  - [Example](https://docs.maptiler.com/sdk-js/api/geography/#lnglat-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/geography/#lnglat-parameters)
  - [Static Members](https://docs.maptiler.com/sdk-js/api/geography/#lnglat-static-members)
  - [Methods](https://docs.maptiler.com/sdk-js/api/geography/#lnglat-instance-members)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/geography/#lnglat-related)
- [Point](https://docs.maptiler.com/sdk-js/api/geography/#point)
  - [Example](https://docs.maptiler.com/sdk-js/api/geography/#point-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/geography/#point-parameters)
  - [Static Members](https://docs.maptiler.com/sdk-js/api/geography/#point-static-members)
  - [Methods](https://docs.maptiler.com/sdk-js/api/geography/#point-instance-members)
- [LngLatBounds](https://docs.maptiler.com/sdk-js/api/geography/#lnglatbounds)
  - [Example](https://docs.maptiler.com/sdk-js/api/geography/#lnglatbounds-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/geography/#lnglatbounds-parameters)
  - [Static Members](https://docs.maptiler.com/sdk-js/api/geography/#lnglatbounds-static-members)
  - [Methods](https://docs.maptiler.com/sdk-js/api/geography/#lnglatbounds-instance-members)
- [LngLatLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike)
  - [Example](https://docs.maptiler.com/sdk-js/api/geography/#lnglatlike-example)
- [PointLike](https://docs.maptiler.com/sdk-js/api/geography/#pointlike)
  - [Example](https://docs.maptiler.com/sdk-js/api/geography/#pointlike-example)
- [LngLatBoundsLike](https://docs.maptiler.com/sdk-js/api/geography/#lnglatboundslike)
  - [Example](https://docs.maptiler.com/sdk-js/api/geography/#lnglatboundslike-example)
- [MercatorCoordinate](https://docs.maptiler.com/sdk-js/api/geography/#mercatorcoordinate)
  - [Example](https://docs.maptiler.com/sdk-js/api/geography/#mercatorcoordinate-example)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/geography/#mercatorcoordinate-parameters)
  - [Static Members](https://docs.maptiler.com/sdk-js/api/geography/#mercatorcoordinate-static-members)
  - [Methods](https://docs.maptiler.com/sdk-js/api/geography/#mercatorcoordinate-instance-members)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/geography/#mercatorcoordinate-related)
- [EdgeInsets](https://docs.maptiler.com/sdk-js/api/geography/#edgeinsets)
  - [Parameters](https://docs.maptiler.com/sdk-js/api/geography/#edgeinsets-parameters)
  - [Static Members](https://docs.maptiler.com/sdk-js/api/geography/#edgeinsets-static-members)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Coordinates

Coordinates

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)