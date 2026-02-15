# Display HTML clusters with custom properties

This advanced example showcases the implementation of MapTiler SDK JS clustering by using HTML markers and custom property expressions. To substitute a MapTiler layer with HTML or SVG for clusters, it is necessary to manually synchronize the clustered source with a collection of marker objects that consistently update as the map view changes.

Display HTML clusters with custom properties

527

8

39

8

8

14

2

251

40

2

5,000

208

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Display HTML clusters with custom properties</title>
<script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
<link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
<style>
  body {margin: 0; padding: 0;}
  #map {position: absolute; top: 0; bottom: 0; width: 100%;}
</style>
</head>
<body>
<div id="map"></div>

<script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    const map = new maptilersdk.Map({
        container: 'map',
        zoom: 0.3,
        center: [0, 20],
        style: maptilersdk.MapStyle.DATAVIZ.DARK
    });

    // filters for classifying earthquakes into five categories based on magnitude
    const mag1 = ['<', ['get', 'mag'], 2];
    const mag2 = ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 3]];
    const mag3 = ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 4]];
    const mag4 = ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 5]];
    const mag5 = ['>=', ['get', 'mag'], 5];

    // colors to use for the categories
    const colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'];

    map.on('load', function () {
        // add a clustered GeoJSON source for a sample set of earthquakes
        map.addSource('earthquakes', {
            'type': 'geojson',
            'data':
                'https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson',
            'cluster': true,
            'clusterRadius': 80,
            'clusterProperties': {
                // keep separate counts for each magnitude category in a cluster
                'mag1': ['+', ['case', mag1, 1, 0]],
                'mag2': ['+', ['case', mag2, 1, 0]],
                'mag3': ['+', ['case', mag3, 1, 0]],
                'mag4': ['+', ['case', mag4, 1, 0]],
                'mag5': ['+', ['case', mag5, 1, 0]]
            }
        });
        // circle and symbol layers for rendering individual earthquakes (unclustered points)
        map.addLayer({
            'id': 'earthquake_circle',
            'type': 'circle',
            'source': 'earthquakes',
            'filter': ['!=', 'cluster', true],
            'paint': {
                'circle-color': [\
                    'case',\
                    mag1,\
                    colors[0],\
                    mag2,\
                    colors[1],\
                    mag3,\
                    colors[2],\
                    mag4,\
                    colors[3],\
                    colors[4]\
                ],
                'circle-opacity': 0.6,
                'circle-radius': 12
            }
        });
        map.addLayer({
            'id': 'earthquake_label',
            'type': 'symbol',
            'source': 'earthquakes',
            'filter': ['!=', 'cluster', true],
            'layout': {
                'text-field': [\
                    'number-format',\
                    ['get', 'mag'],\
                    { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }\
                ],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-size': 10
            },
            'paint': {
                'text-color': [\
                    'case',\
                    ['<', ['get', 'mag'], 3],\
                    'black',\
                    'white'\
                ]
            }
        });

        // objects for caching and keeping track of HTML marker objects (for performance)
        const markers= {};
        const markersOnScreen = {};

        function updateMarkers() {
            const newMarkers = {};
            const features = map.querySourceFeatures('earthquakes');

            // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
            // and add it to the map if it's not there already
            for (let i = 0; i < features.length; i++) {
                const coords = features[i].geometry.coordinates;
                const props = features[i].properties;
                if (!props.cluster) continue;
                const id = props.cluster_id;

                let marker = markers[id];
                if (!marker) {
                    const el = createDonutChart(props);
                    marker = markers[id] = new maptilersdk.Marker({
                        element: el
                    }).setLngLat(coords);
                }
                newMarkers[id] = marker;

                if (!markersOnScreen[id]) marker.addTo(map);
            }
            // for every marker we've added previously, remove those that are no longer visible
            for (id in markersOnScreen) {
                if (!newMarkers[id]) markersOnScreen[id].remove();
            }
            markersOnScreen = newMarkers;
        }

        // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
        map.on('data', function (e) {
            if (e.sourceId !== 'earthquakes' || !e.isSourceLoaded) return;

            map.on('move', updateMarkers);
            map.on('moveend', updateMarkers);
            updateMarkers();
        });
    });

    // code for creating an SVG donut chart from feature properties
    function createDonutChart(props) {
        const offsets = [];
        const counts = [\
            props.mag1,\
            props.mag2,\
            props.mag3,\
            props.mag4,\
            props.mag5\
        ];
        let total = 0;
        for (let i = 0; i < counts.length; i++) {
            offsets.push(total);
            total += counts[i];
        }
        const fontSize =
            total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
        const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
        const r0 = Math.round(r * 0.6);
        const w = r * 2;

        let html =
            '<div><svg width="' +
            w +
            '" height="' +
            w +
            '" viewbox="0 0 ' +
            w +
            ' ' +
            w +
            '" text-anchor="middle" style="font: ' +
            fontSize +
            'px sans-serif; display: block">';

        for (i = 0; i < counts.length; i++) {
            html += donutSegment(
                offsets[i] / total,
                (offsets[i] + counts[i]) / total,
                r,
                r0,
                colors[i]
            );
        }
        html +=
            '<circle cx="' +
            r +
            '" cy="' +
            r +
            '" r="' +
            r0 +
            '" fill="white" /><text dominant-baseline="central" transform="translate(' +
            r +
            ', ' +
            r +
            ')">' +
            total.toLocaleString() +
            '</text></svg></div>';

        const el = document.createElement('div');
        el.innerHTML = html;
        return el.firstChild;
    }

    function donutSegment(start, end, r, r0, color) {
        if (end - start === 1) end -= 0.00001;
        const a0 = 2 * Math.PI * (start - 0.25);
        const a1 = 2 * Math.PI * (end - 0.25);
        const x0 = Math.cos(a0),
            y0 = Math.sin(a0);
        const x1 = Math.cos(a1),
            y1 = Math.sin(a1);
        const largeArc = end - start > 0.5 ? 1 : 0;

        return [\
            '<path d="M',\
            r + r0 * x0,\
            r + r0 * y0,\
            'L',\
            r + r * x0,\
            r + r * y0,\
            'A',\
            r,\
            r,\
            0,\
            largeArc,\
            1,\
            r + r * x1,\
            r + r * y1,\
            'L',\
            r + r0 * x1,\
            r + r0 * y1,\
            'A',\
            r0,\
            r0,\
            0,\
            largeArc,\
            0,\
            r + r0 * x0,\
            r + r0 * y0,\
            '" fill="' + color + '" />'\
        ].join(' ');
    }
</script>
</body>
</html>
```

HTML

Copy

```bash
npm install --save @maptiler/sdk
```

Bash

Copy

main.js

```javascript
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = new Map({
    container: 'map',
    zoom: 0.3,
    center: [0, 20],
    style: MapStyle.DATAVIZ.DARK
});

// filters for classifying earthquakes into five categories based on magnitude
const mag1 = ['<', ['get', 'mag'], 2];
const mag2 = ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 3]];
const mag3 = ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 4]];
const mag4 = ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 5]];
const mag5 = ['>=', ['get', 'mag'], 5];

// colors to use for the categories
const colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'];

map.on('load', function () {
    // add a clustered GeoJSON source for a sample set of earthquakes
    map.addSource('earthquakes', {
        'type': 'geojson',
        'data':
            'https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson',
        'cluster': true,
        'clusterRadius': 80,
        'clusterProperties': {
            // keep separate counts for each magnitude category in a cluster
            'mag1': ['+', ['case', mag1, 1, 0]],
            'mag2': ['+', ['case', mag2, 1, 0]],
            'mag3': ['+', ['case', mag3, 1, 0]],
            'mag4': ['+', ['case', mag4, 1, 0]],
            'mag5': ['+', ['case', mag5, 1, 0]]
        }
    });
    // circle and symbol layers for rendering individual earthquakes (unclustered points)
    map.addLayer({
        'id': 'earthquake_circle',
        'type': 'circle',
        'source': 'earthquakes',
        'filter': ['!=', 'cluster', true],
        'paint': {
            'circle-color': [\
                'case',\
                mag1,\
                colors[0],\
                mag2,\
                colors[1],\
                mag3,\
                colors[2],\
                mag4,\
                colors[3],\
                colors[4]\
            ],
            'circle-opacity': 0.6,
            'circle-radius': 12
        }
    });
    map.addLayer({
        'id': 'earthquake_label',
        'type': 'symbol',
        'source': 'earthquakes',
        'filter': ['!=', 'cluster', true],
        'layout': {
            'text-field': [\
                'number-format',\
                ['get', 'mag'],\
                { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }\
            ],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-size': 10
        },
        'paint': {
            'text-color': [\
                'case',\
                ['<', ['get', 'mag'], 3],\
                'black',\
                'white'\
            ]
        }
    });

    // objects for caching and keeping track of HTML marker objects (for performance)
    const markers= {};
    const markersOnScreen = {};

    function updateMarkers() {
        const newMarkers = {};
        const features = map.querySourceFeatures('earthquakes');

        // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
        // and add it to the map if it's not there already
        for (let i = 0; i < features.length; i++) {
            const coords = features[i].geometry.coordinates;
            const props = features[i].properties;
            if (!props.cluster) continue;
            const id = props.cluster_id;

            let marker = markers[id];
            if (!marker) {
                const el = createDonutChart(props);
                marker = markers[id] = new maptilersdk.Marker({
                    element: el
                }).setLngLat(coords);
            }
            newMarkers[id] = marker;

            if (!markersOnScreen[id]) marker.addTo(map);
        }
        // for every marker we've added previously, remove those that are no longer visible
        for (id in markersOnScreen) {
            if (!newMarkers[id]) markersOnScreen[id].remove();
        }
        markersOnScreen = newMarkers;
    }

    // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
    map.on('data', function (e) {
        if (e.sourceId !== 'earthquakes' || !e.isSourceLoaded) return;

        map.on('move', updateMarkers);
        map.on('moveend', updateMarkers);
        updateMarkers();
    });
});

// code for creating an SVG donut chart from feature properties
function createDonutChart(props) {
    const offsets = [];
    const counts = [\
        props.mag1,\
        props.mag2,\
        props.mag3,\
        props.mag4,\
        props.mag5\
    ];
    let total = 0;
    for (let i = 0; i < counts.length; i++) {
        offsets.push(total);
        total += counts[i];
    }
    const fontSize =
        total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
    const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
    const r0 = Math.round(r * 0.6);
    const w = r * 2;

    let html =
        '<div><svg width="' +
        w +
        '" height="' +
        w +
        '" viewbox="0 0 ' +
        w +
        ' ' +
        w +
        '" text-anchor="middle" style="font: ' +
        fontSize +
        'px sans-serif; display: block">';

    for (i = 0; i < counts.length; i++) {
        html += donutSegment(
            offsets[i] / total,
            (offsets[i] + counts[i]) / total,
            r,
            r0,
            colors[i]
        );
    }
    html +=
        '<circle cx="' +
        r +
        '" cy="' +
        r +
        '" r="' +
        r0 +
        '" fill="white" /><text dominant-baseline="central" transform="translate(' +
        r +
        ', ' +
        r +
        ')">' +
        total.toLocaleString() +
        '</text></svg></div>';

    const el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
}

function donutSegment(start, end, r, r0, color) {
    if (end - start === 1) end -= 0.00001;
    const a0 = 2 * Math.PI * (start - 0.25);
    const a1 = 2 * Math.PI * (end - 0.25);
    const x0 = Math.cos(a0),
        y0 = Math.sin(a0);
    const x1 = Math.cos(a1),
        y1 = Math.sin(a1);
    const largeArc = end - start > 0.5 ? 1 : 0;

    return [\
        '<path d="M',\
        r + r0 * x0,\
        r + r0 * y0,\
        'L',\
        r + r * x0,\
        r + r * y0,\
        'A',\
        r,\
        r,\
        0,\
        largeArc,\
        1,\
        r + r * x1,\
        r + r * y1,\
        'L',\
        r + r0 * x1,\
        r + r0 * y1,\
        'A',\
        r0,\
        r0,\
        0,\
        largeArc,\
        0,\
        r + r0 * x0,\
        r + r0 * y0,\
        '" fill="' + color + '" />'\
    ].join(' ');
}
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Display HTML clusters with custom properties</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div id="map"></div>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

HTML

Copy

style.css

```css
✖ Error: File does not exist or is empty
```

CSS

Copy

## Related examples

[![Create and style clusters](https://docs.maptiler.com/assets/img/example-card.png)**Create and style clusters** Example\\
Use SDK JS built-in functions to visualize points as clusters.](https://docs.maptiler.com/sdk-js/examples/cluster/)

[![Point layer cluster (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer cluster (point helper)** Example\\
This example shows how to add a point layer cluster to the map using the point layer helper with the default values.](https://docs.maptiler.com/sdk-js/examples/helper-point-cluster/)

[![Heatmap layer (heatmap helper)](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap layer (heatmap helper)** Example\\
This example shows how to add a heatmap layer to the map using the heatmap layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-heatmap-minimal/)

[![Point filtering by property](https://docs.maptiler.com/assets/img/example-card.png)**Point filtering by property** Example\\
Filter thousands of features in real time to quickly and easily find those with a property that meets your search criteria.](https://docs.maptiler.com/sdk-js/examples/point-filtering/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/cluster-html/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Display HTML clusters with custom properties

HTML clusters with custom properties

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)