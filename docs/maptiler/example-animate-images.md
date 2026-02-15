# Animate a series of images

Create an animation by utilizing a collection of [image sources](https://docs.maptiler.com/gl-style-specification/sources/#image) to form a sequence.

Animate a series of images

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Animate a series of images</title>
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
        style: maptilersdk.MapStyle.STREETS,
        maxZoom: 5.99,
        minZoom: 4,
        zoom: 5,
        center: [-75.789, 41.874]
    });

    const frameCount = 5;
    let currentImage = 0;

    function getPath() {
        return (
            'https://docs.maptiler.com/sdk-js/assets/radar' +
            currentImage +
            '.gif'
        );
    }

    map.on('load', function () {
        map.addSource('radar', {
            type: 'image',
            url: getPath(),
            coordinates: [\
                [-80.425, 46.437],\
                [-71.516, 46.437],\
                [-71.516, 37.936],\
                [-80.425, 37.936]\
            ]
        });
        map.addLayer({
            id: 'radar-layer',
            'type': 'raster',
            'source': 'radar',
            'paint': {
                'raster-fade-duration': 0
            }
        });

        setInterval(function () {
            currentImage = (currentImage + 1) % frameCount;
            map.getSource('radar').updateImage({ url: getPath() });
        }, 200);
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
    style: MapStyle.STREETS,
    maxZoom: 5.99,
    minZoom: 4,
    zoom: 5,
    center: [-75.789, 41.874]
});

const frameCount = 5;
let currentImage = 0;

function getPath() {
    return (
        'https://docs.maptiler.com/sdk-js/assets/radar' +
        currentImage +
        '.gif'
    );
}

map.on('load', function () {
    map.addSource('radar', {
        type: 'image',
        url: getPath(),
        coordinates: [\
            [-80.425, 46.437],\
            [-71.516, 46.437],\
            [-71.516, 37.936],\
            [-80.425, 37.936]\
        ]
    });
    map.addLayer({
        id: 'radar-layer',
        'type': 'raster',
        'source': 'radar',
        'paint': {
            'raster-fade-duration': 0
        }
    });

    setInterval(function () {
        currentImage = (currentImage + 1) % frameCount;
        map.getSource('radar').updateImage({ url: getPath() });
    }, 200);
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
  <title>Animate a series of images</title>
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

[![Show raster image on the map](https://docs.maptiler.com/assets/img/example-card.png)**Raster layer** Example\\
This tutorial shows how to add a raster image overlay to the map.](https://docs.maptiler.com/sdk-js/examples/raster-layer/)

[![Weather wind layer](https://docs.maptiler.com/assets/img/example-card.png)**Weather wind layer** Example\\
Visualize weather wind layer from MapTiler Weather Wind dataset and get the wind speed at the point under the cursor.](https://docs.maptiler.com/sdk-js/examples/weather-wind/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/animate-images/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Animate a series of images

Animate a series of images

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)