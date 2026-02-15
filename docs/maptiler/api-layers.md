# Layers

A **layer**, also known as a **style layer**, provides style instructions that describe the visual properties that apply when rendering the layer on a map.
The required properties and available options are defined by the [GL Style Specification](https://docs.maptiler.com/gl-style-specification/layers/).


Except for layers of the background type, each layer needs to refer to a source. Layers take the data that they get from a source, optionally filter features, and then define how those features are styled.


## [fill](https://docs.maptiler.com/sdk-js/api/layers/\#fill)

The [fill](https://docs.maptiler.com/gl-style-specification/layers/#fill) style layer renders one or more filled (and optionally
stroked) polygons on a map. You can use a fill layer to configure the visual appearance of polygon or multipolygon
features.
Check out all the [fill](https://docs.maptiler.com/gl-style-specification/layers/#fill) layer options and properties.


Source types: [GeoJSONSource](https://docs.maptiler.com/sdk-js/api/layers/#geojsonsource) \| [Vector](https://docs.maptiler.com/gl-style-specification/sources/#vector)

### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#fill-example)

```js
//first add the source with the "square" id to the map
map.addSource('square', {
  type: 'geojson',
  data: {
    "type": "FeatureCollection",
    "features": [\
      {\
        "type": "Feature",\
        "properties": {},\
        "geometry": {\
          "coordinates": [[[-2.2240348228768596, 45.20404531546535], [-2.2240348228768596, 38.55848603574671], [7.2012758848702845, 38.55848603574671], [7.2012758848702845, 45.20404531546535], [-2.2240348228768596, 45.20404531546535]]],\
          "type": "Polygon"\
        }\
      }\
    ]
  }
});

//then add the layer to the map. Display the "square" source data
map.addLayer({
  "id": "square-region",
  "source": "square",
  "type": "fill",
  "paint": {
    "fill-color": "#00ffff"
  }
});
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/layers/\#fill-related)

- [GeoJSON polygon layer](https://docs.maptiler.com/sdk-js/examples/geojson-polygon/)
- [Show polygon information on click](https://docs.maptiler.com/sdk-js/examples/polygon-popup-on-click/)
- [Add a pattern to a polygon](https://docs.maptiler.com/sdk-js/examples/fill-pattern/)
- [Choropleth GeoJSON](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/)

## [line](https://docs.maptiler.com/sdk-js/api/layers/\#line)

The [line](https://docs.maptiler.com/gl-style-specification/layers/#line) style layer renders one or more stroked polylines on the
map. You can use a line layer to configure the visual appearance of polyline or multipolyline features.
Check out all the [line](https://docs.maptiler.com/gl-style-specification/layers/#line) layer options and properties.


Source types: [GeoJSONSource](https://docs.maptiler.com/sdk-js/api/layers/#geojsonsource) \| [Vector](https://docs.maptiler.com/gl-style-specification/sources/#vector)

### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#line-example)

```js
//first add the source with the "route" id to the map
map.addSource('route', {
  'type': 'geojson',
  'data': {
    'type': 'Feature',
    'properties': {},
    'geometry': {
      'type': 'LineString',
      'coordinates': [ [-122.48369693756104, 37.83381888486939], [-122.48348236083984, 37.83317489144141], [-122.48339653015138, 37.83270036637107], [-122.48356819152832, 37.832056363179625], [-122.48404026031496, 37.83114119107971], [-122.48404026031496, 37.83049717427869], [-122.48348236083984, 37.829920943955045], [-122.48356819152832, 37.82954808664175], [-122.48507022857666, 37.82944639795659], [-122.48610019683838, 37.82880236636284], [-122.48695850372314, 37.82931081282506], [-122.48700141906738, 37.83080223556934], [-122.48751640319824, 37.83168351665737], [-122.48803138732912, 37.832158048267786], [-122.48888969421387, 37.83297152392784], [-122.48987674713133, 37.83263257682617], [-122.49043464660643, 37.832937629287755], [-122.49125003814696, 37.832429207817725], [-122.49163627624512, 37.832564787218985], [-122.49223709106445, 37.83337825839438], [-122.49378204345702, 37.83368330777276] ]
    }
  }
});

//then add the layer to the map. Display the "route" source data
map.addLayer({
  'id': 'route',
  'type': 'line',
  'source': 'route',
  'layout': {
    'line-join': 'round',
    'line-cap': 'round'
  },
  'paint': {
    'line-color': '#888',
    'line-width': 8
  }
});
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/layers/\#line-related)

- [GeoJSON line layer](https://docs.maptiler.com/sdk-js/examples/geojson-line/)
- [Add a vector tile source](https://docs.maptiler.com/sdk-js/examples/vector-source/)
- [Animate a line](https://docs.maptiler.com/sdk-js/examples/animate-a-line/)
- [Create a gradient line using an expression](https://docs.maptiler.com/sdk-js/examples/line-gradient/)
- [Style lines with a data-driven property](https://docs.maptiler.com/sdk-js/examples/data-driven-lines/)
- [Update a feature in realtime](https://docs.maptiler.com/sdk-js/examples/live-update-feature/)

## [symbol](https://docs.maptiler.com/sdk-js/api/layers/\#symbol)

The [symbol](https://docs.maptiler.com/gl-style-specification/layers/#symbol) style layer renders icon and text labels at points
or along lines on a map. You can use a symbol layer to configure the visual appearance of labels for features in
vector tiles.
Check out all the [symbol](https://docs.maptiler.com/gl-style-specification/layers/#symbol) layer options and properties.


Source types: [GeoJSONSource](https://docs.maptiler.com/sdk-js/api/layers/#geojsonsource) \| [Vector](https://docs.maptiler.com/gl-style-specification/sources/#vector)

### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#symbol-example)

```js
//first add the source with the "airports" id to the map
map.addSource('airports', {
  type: 'geojson',
  data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson'
});

//load the icon image or use an image defined in the sprite
const image = await map.loadImage('https://docs.maptiler.com/sdk-js/examples/geojson-point/icon-plane-512.png');
map.addImage('plane', image.data);

//then add the layer to the map. Display the "airports" source data
map.addLayer({
  'id': 'airports',
  'type': 'symbol',
  'source': 'airports',
  'layout': {
    'icon-image': 'plane',
    'icon-size': ['*', ['get', 'scalerank'] ,0.01]
  },
  'paint': {}
});
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/layers/\#symbol-related)

- [GeoJSON point layer](https://docs.maptiler.com/sdk-js/examples/geojson-point/)
- [Add a generated icon to the map](https://docs.maptiler.com/sdk-js/examples/add-image-generated/)
- [Add an animated icon to the map](https://docs.maptiler.com/sdk-js/examples/add-image-animated/)
- [HTML clusters with custom properties](https://docs.maptiler.com/sdk-js/examples/cluster-html/)
- [Filter symbols by text input](https://docs.maptiler.com/sdk-js/examples/filter-markers-by-input/)
- [Filter symbols by toggling a list](https://docs.maptiler.com/sdk-js/examples/filter-markers/)
- [Use a fallback image](https://docs.maptiler.com/sdk-js/examples/fallback-image/)

## [raster](https://docs.maptiler.com/sdk-js/api/layers/\#raster)

The [raster](https://docs.maptiler.com/gl-style-specification/layers/#raster) style layer renders icon and text labels at points
or along lines on a map. You can use a symbol layer to configure the visual appearance of labels for features in
vector tiles.
Check out all the [raster](https://docs.maptiler.com/gl-style-specification/layers/#raster) layer options and properties.


Source types: [ImageSource](https://docs.maptiler.com/sdk-js/api/layers/#imagesource) \| [Raster](https://docs.maptiler.com/gl-style-specification/sources/#raster)
\| [VideoSource](https://docs.maptiler.com/sdk-js/api/layers/#videosource)

### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#raster-example)

```js
//first add the source with the "aerial-source" id to the map
map.addSource("aerial-source", {
    "type": "image",
    "url": "https://docs.maptiler.com/sdk-js/examples/raster-layer/img/aerial_wgs84.png",
    "coordinates": [\
        [4.639663696289062, 50.900867668253724],\
        [4.642066955566406, 50.900867668253724],\
        [4.642066955566406, 50.89935199434383],\
        [4.639663696289062, 50.89935199434383]\
    ]
});

//then add the layer to the map. Display the "aerial-source" source data
map.addLayer({
    "id": "overlay",
    "source": "aerial-source",
    "type": "raster",
    "paint": {
        "raster-opacity": 0.85
    }
});
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/layers/\#raster-related)

- [Raster layer](https://docs.maptiler.com/sdk-js/examples/raster-layer/)
- [Add a WMS source](https://docs.maptiler.com/sdk-js/examples/wms/)
- [Add a raster tile source](https://docs.maptiler.com/sdk-js/examples/map-tiles/)
- [Add a video](https://docs.maptiler.com/sdk-js/examples/video-on-a-map/)

## [circle](https://docs.maptiler.com/sdk-js/api/layers/\#circle)

The [circle](https://docs.maptiler.com/gl-style-specification/layers/#circle) style layer renders one or more filled circles on a
map. You can use a circle layer to configure the visual appearance of point or point collection features in vector
tiles. A circle layer renders circles whose radii are measured in screen units.
Check out all the [circle](https://docs.maptiler.com/gl-style-specification/layers/#circle) layer options and properties.


Source types: [GeoJSONSource](https://docs.maptiler.com/sdk-js/api/layers/#geojsonsource) \| [Vector](https://docs.maptiler.com/gl-style-specification/sources/#vector)

### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#circle-example)

```js
//first add the source with the "null-island" id to the map
map.addSource('null-island', {
  type: 'geojson',
  data: {
    "type": "FeatureCollection",
    "features": [{\
        "type": "Feature",\
        "properties": { "name": "Null Island" },\
        "geometry": {\
            "type": "Point",\
            "coordinates": [ 0, 0 ]\
        }\
    }]
  }
});

//then add the layer to the map. Display the "null-island" source data
map.addLayer({
    'id': 'point',
    'source': 'null-island',
    'type': 'circle',
    'paint': {
        'circle-radius': 10,
        'circle-color': '#007cbf'
    }
});
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/layers/\#circle-related)

- [Create a draggable point](https://docs.maptiler.com/sdk-js/examples/drag-a-point/)
- [Animate a point](https://docs.maptiler.com/sdk-js/examples/animate-point-along-line/)
- [Create a time slider](https://docs.maptiler.com/sdk-js/examples/timeline-animation/)
- [Geocoding](https://docs.maptiler.com/sdk-js/examples/geocoding/)
- [Create and style clusters](https://docs.maptiler.com/sdk-js/examples/cluster/)

## [fill-extrusion](https://docs.maptiler.com/sdk-js/api/layers/\#fill-extrusion)

The [fill-extrusion](https://docs.maptiler.com/gl-style-specification/layers/#fill-extrusion) style layer renders one or more
filled (and optionally stroked) extruded (3D) polygons on a map. You can use a fill-extrusion layer to configure the
extrusion and visual appearance of polygon or multipolygon features.
Check out all the [fill-extrusion](https://docs.maptiler.com/gl-style-specification/layers/#fill-extrusion) layer options and
properties.


Source types: [GeoJSONSource](https://docs.maptiler.com/sdk-js/api/layers/#geojsonsource) \| [Vector](https://docs.maptiler.com/gl-style-specification/sources/#vector)

### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#fill-extrusion-example)

```js
//first add the source with the "floorplan" id to the map
map.addSource('floorplan', {
  // GeoJSON Data source used in vector tiles, documented at
  // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
  'type': 'geojson',
  'data': 'https://docs.maptiler.com/sdk-js/assets/indoor-3d-map.geojson'
  });

//then add the layer to the map. Display the floorplan" source data
map.addLayer({
  'id': 'room-extrusion',
  'type': 'fill-extrusion',
  'source': 'floorplan',
  'paint': {
  // See the GL Style Specification for details on data expressions.
  // https://docs.maptiler.com/gl-style-specification/expressions/

  // Get the fill-extrusion-color from the source 'color' property.
  'fill-extrusion-color': ['get', 'color'],

  // Get fill-extrusion-height from the source 'height' property.
  'fill-extrusion-height': ['get', 'height'],

  // Get fill-extrusion-base from the source 'base_height' property.
  'fill-extrusion-base': ['get', 'base_height'],

  // Make extrusions slightly opaque for see through indoor walls.
  'fill-extrusion-opacity': 0.5
  }
});
```

JavaScript

Copy

### [Related\  examples](https://docs.maptiler.com/sdk-js/api/layers/\#fill-extrusion-related)

- [Create a map of Europe with countries extruded](https://docs.maptiler.com/sdk-js/examples/fill-extrusion/)
- [Extrude polygons for 3D indoor mapping](https://docs.maptiler.com/sdk-js/examples/3d-extrusion-floorplan/)
- [Display buildings in 3D](https://docs.maptiler.com/sdk-js/examples/3d-buildings/)

## [heatmap](https://docs.maptiler.com/sdk-js/api/layers/\#heatmap)

The [heatmap](https://docs.maptiler.com/gl-style-specification/layers/#heatmap) style layer renders a range of colors to represent
the density of points in an area.
Check out all the [heatmap](https://docs.maptiler.com/gl-style-specification/layers/#heatmap) layer options and properties.


Source types: [GeoJSONSource](https://docs.maptiler.com/sdk-js/api/layers/#geojsonsource) \| [Vector](https://docs.maptiler.com/gl-style-specification/sources/#vector)

### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#heatmap-example)

```js
//first add the source with the "earthquakes" id to the map
// Add a geojson point source.
// Heatmap layers also work with a vector tile source.
map.addSource('earthquakes', {
  'type': 'geojson',
  'data':
    'https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson'
});

//then add the layer to the map. Display the "earthquakes" source data
map.addLayer(
  {
    'id': 'earthquakes-heat',
    'type': 'heatmap',
    'source': 'earthquakes',
    'maxzoom': 9,
    'paint': {
      // Increase the heatmap weight based on frequency and property magnitude
      'heatmap-weight': [\
        'interpolate',\
        ['linear'],\
        ['get', 'mag'],\
        0,\
        0,\
        6,\
        1\
      ],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        0,\
        1,\
        9,\
        3\
      ],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': [\
        'interpolate',\
        ['linear'],\
        ['heatmap-density'],\
        0,\
        'rgba(33,102,172,0)',\
        0.2,\
        'rgb(103,169,207)',\
        0.4,\
        'rgb(209,229,240)',\
        0.6,\
        'rgb(253,219,199)',\
        0.8,\
        'rgb(239,138,98)',\
        1,\
        'rgb(178,24,43)'\
      ],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        0,\
        2,\
        9,\
        20\
      ],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': [\
        'interpolate',\
        ['linear'],\
        ['zoom'],\
        7,\
        1,\
        9,\
        0\
      ]
    }
  }
);
```

JavaScript

Copy

### [Related examples](https://docs.maptiler.com/sdk-js/api/layers/\#heatmap-related)

- [Create a heatmap layer](https://docs.maptiler.com/sdk-js/examples/heatmap-layer/)

## [hillshade](https://docs.maptiler.com/sdk-js/api/layers/\#hillshade)

The [hillshade](https://docs.maptiler.com/gl-style-specification/layers/#hillshade) style layer renders digital elevation model
(DEM) data on the client-side. The implementation only supports Terrain RGB and Mapzen Terrarium tiles.
Check out all the [hillshade](https://docs.maptiler.com/gl-style-specification/layers/#hillshade) layer options and properties.


Source types: [Raster DEM](https://docs.maptiler.com/gl-style-specification/sources/#raster-dem)

### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#hillshade-example)

```js
const key = "YOUR_MAPTILER_API_KEY_HERE";
//first add the source with the "hillshadeSource" id to the map
map.addSource("hillshadeSource", {
  "type": "raster-dem",
  "url": `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}`
});

//then add the layer to the map. Display the "hillshadeSource" source data
map.addLayer({
  id: 'hills',
  type: 'hillshade',
  source: 'hillshadeSource',
  layout: { visibility: 'visible' },
  paint: { 'hillshade-shadow-color': '#473B24' }
});
```

JavaScript

Copy

### [Related\  examples](https://docs.maptiler.com/sdk-js/api/layers/\#hillshade-related)

- [Add hillshading](https://docs.maptiler.com/sdk-js/examples/hillshade/)

- [Add dynamic hillshading](https://docs.maptiler.com/sdk-js/examples/dynamic-hillshade/)

## [background](https://docs.maptiler.com/sdk-js/api/layers/\#background)

The [background](https://docs.maptiler.com/gl-style-specification/layers/#background) style layer covers the entire map. Use a
background style layer to configure a color or pattern to show below all other map content.
Check out all the [background](https://docs.maptiler.com/gl-style-specification/layers/#background) layer options and properties.


### [Example](https://docs.maptiler.com/sdk-js/api/layers/\#background-example)

```js
map.addLayer({
  "id": "background",
  "type": "background",
  "layout": {
    "visibility": "visible"
  },
  "paint": {
    "background-color": {
      "stops": [\
        [\
          6,\
          "hsl(60,20%,85%)"\
        ],\
        [\
          20,\
          "hsl(60,24%,90%)"\
        ]\
      ]
    }
  }
});
```

JavaScript

Copy


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [fill](https://docs.maptiler.com/sdk-js/api/layers/#fill)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#fill-example)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/layers/#fill-related)
- [line](https://docs.maptiler.com/sdk-js/api/layers/#line)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#line-example)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/layers/#line-related)
- [symbol](https://docs.maptiler.com/sdk-js/api/layers/#symbol)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#symbol-example)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/layers/#symbol-related)
- [raster](https://docs.maptiler.com/sdk-js/api/layers/#raster)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#raster-example)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/layers/#raster-related)
- [circle](https://docs.maptiler.com/sdk-js/api/layers/#circle)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#circle-example)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/layers/#circle-related)
- [fill-extrusion](https://docs.maptiler.com/sdk-js/api/layers/#fill-extrusion)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#fill-extrusion-example)
  - [Related\\
     examples](https://docs.maptiler.com/sdk-js/api/layers/#fill-extrusion-related)
- [heatmap](https://docs.maptiler.com/sdk-js/api/layers/#heatmap)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#heatmap-example)
  - [Related examples](https://docs.maptiler.com/sdk-js/api/layers/#heatmap-related)
- [hillshade](https://docs.maptiler.com/sdk-js/api/layers/#hillshade)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#hillshade-example)
  - [Related\\
     examples](https://docs.maptiler.com/sdk-js/api/layers/#hillshade-related)
- [background](https://docs.maptiler.com/sdk-js/api/layers/#background)
  - [Example](https://docs.maptiler.com/sdk-js/api/layers/#background-example)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Layers

Layers

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)