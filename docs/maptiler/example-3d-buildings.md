# Display buildings in 3D

Display the height of buildings in 3D using [extrusions](https://docs.maptiler.com/gl-style-specification/layers/#fill-extrusion).

Display buildings in 3D

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Display buildings in 3D</title>
    <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
    <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
    <style>
        body {
            margin: 0;
            padding: 0;
        }

        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
        }
    </style>
</head>

<body>
    <div id="map"></div>
    <script>
        maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
        const map = new maptilersdk.Map({
            container: 'map',
            style: maptilersdk.MapStyle.BASIC,
            center: [-74.0066, 40.7135],
            zoom: 15.5,
            pitch: 45,
            bearing: -17.6,
        });

        // The 'building' layer in the MapTiler Planet vector source contains building-height
        // MapTiler Planet: https://www.maptiler.com/planet/.
        map.on('load', function () {
            // Insert the layer beneath any symbol layer.
            // Learn how to find specific layer id https://docs.maptiler.com/sdk-js/examples/geojson-layer-in-stack/#learn-more
            const layers = map.getStyle().layers;

            let labelLayerId;
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            map.addLayer(
                {
                    "id": "Building 3D",
                    "source": "maptiler_planet", // read more about MapTiler Planet: https://docs.maptiler.com/schema/planet/
                    "type": "fill-extrusion",
                    "source-layer": "building",
                    "filter": [\
                        "!has",\
                        "hide_3d"\
                    ], // filter out buildings that should not be displayed in 3D
                    "minzoom": 15,
                    "paint": {
                        "fill-extrusion-base": {
                            "property": "render_min_height",
                            "type": "identity"
                        },
                        "fill-extrusion-color": "hsl(44,14%,79%)",
                        "fill-extrusion-height": {
                            "property": "render_height",
                            "type": "identity"
                        },
                        "fill-extrusion-opacity": 0.4
                    },

                }, labelLayerId
            );
        });
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
    style: MapStyle.BASIC,
    center: [-74.0066, 40.7135],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6
});

    // The 'building' layer in the streets vector source contains building-height
    // data from MapTiler Planet: https://www.maptiler.com/planet/.
map.on('load', function () {
    // Insert the layer beneath any symbol layer.
    // Learn how to find specific layer id https://docs.maptiler.com/sdk-js/examples/geojson-layer-in-stack/#learn-more
    const layers = map.getStyle().layers;

    let labelLayerId;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addLayer(
    {
        "id": "Building 3D",
        "source": "maptiler_planet", // read more about MapTiler Planet: https://docs.maptiler.com/schema/planet/
        "type": "fill-extrusion",
        "source-layer": "building",
        "filter": [\
            "!has",\
            "hide_3d"\
        ], // filter out buildings that should not be displayed in 3D
        "minzoom": 15,
        "paint": {
            "fill-extrusion-base": {
                "property": "render_min_height",
                "type": "identity"
            },
            "fill-extrusion-color": "hsl(44,14%,79%)",
            "fill-extrusion-height": {
                "property": "render_height",
                "type": "identity"
            },
            "fill-extrusion-opacity": 0.4
        },

    }, labelLayerId
);

});
```

JavaScript

Copy

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Display buildings in 3D</title>
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
✖ Error: File does not exist or is empty✖ Error: File does not exist or is empty
```

CSS

Copy


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Display buildings in 3D

Display buildings in 3D

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)