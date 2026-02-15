# Add a canvas source

Add a [`CanvasSource`](https://docs.maptiler.com/sdk-js/api/sources/#canvassource) to the map.

Add a canvas sourceCanvas not supported

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Add a canvas source</title>
<script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
<link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
<style>
  body {margin: 0; padding: 0;}
  #map {position: absolute; top: 0; bottom: 0; width: 100%;}
</style>
</head>
<body>
<canvas id="canvasID" width="400" height="400">Canvas not supported</canvas>
<div id="map"></div>
<script>
    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
    //Animation from https://javascript.tutorials24x7.com/blog/how-to-draw-animated-circles-in-html5-canvas
    const canvas = document.getElementById('canvasID');
    const ctx = canvas.getContext('2d');
    const circles = [];
    const radius = 20;

    function Circle(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;

        this.radius = radius;

        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.strokeStyle = color;
            ctx.stroke();
        };

        this.update = function () {
            if (this.x + this.radius > 400 || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }

            if (this.y + this.radius > 400 || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }

            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        };
    }

    for (let i = 0; i < 5; i++) {
        const color =
            '#' +
            (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
        const  x = Math.random() * (400 - radius * 2) + radius;
        const  y = Math.random() * (400 - radius * 2) + radius;

        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;

        circles.push(new Circle(x, y, dx, dy, radius, color));
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, 400, 400);

        for (let r = 0; r < 5; r++) {
            circles[r].update();
        }
    }

    animate();

    const map = new maptilersdk.Map({
        container: 'map',
        zoom: 5,
        minZoom: 4,
        center: [95.899147, 18.088694],
        style: maptilersdk.MapStyle.STREETS
    });

    map.on('load', function () {
        map.addSource('canvas-source', {
            type: 'canvas',
            canvas: 'canvasID',
            coordinates: [\
                [91.4461, 21.5006],\
                [100.3541, 21.5006],\
                [100.3541, 13.9706],\
                [91.4461, 13.9706]\
            ],
            // Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
            animate: true
        });

        map.addLayer({
            id: 'canvas-layer',
            type: 'raster',
            source: 'canvas-source'
        });
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
//Animation from https://javascript.tutorials24x7.com/blog/how-to-draw-animated-circles-in-html5-canvas
const canvas = document.getElementById('canvasID');
const ctx = canvas.getContext('2d');
const circles = [];
const radius = 20;

function Circle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;

    this.radius = radius;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = color;
        ctx.stroke();
    };

    this.update = function () {
        if (this.x + this.radius > 400 || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > 400 || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    };
}

for (let i = 0; i < 5; i++) {
    const color =
        '#' +
        (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    const  x = Math.random() * (400 - radius * 2) + radius;
    const  y = Math.random() * (400 - radius * 2) + radius;

    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;

    circles.push(new Circle(x, y, dx, dy, radius, color));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, 400, 400);

    for (let r = 0; r < 5; r++) {
        circles[r].update();
    }
}

animate();

const map = new Map({
    container: 'map',
    zoom: 5,
    minZoom: 4,
    center: [95.899147, 18.088694],
    style: MapStyle.STREETS
});

map.on('load', function () {
    map.addSource('canvas-source', {
        type: 'canvas',
        canvas: 'canvasID',
        coordinates: [\
            [91.4461, 21.5006],\
            [100.3541, 21.5006],\
            [100.3541, 13.9706],\
            [91.4461, 13.9706]\
        ],
        // Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
        animate: true
    });

    map.addLayer({
        id: 'canvas-layer',
        type: 'raster',
        source: 'canvas-source'
    });
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
  <title>Add a canvas source</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <canvas id="canvasID" width="400" height="400">Canvas not supported</canvas>
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

## Related examples

[![Add an animated icon to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add an animated icon to the map** Example\\
Add an animated icon to the map that was generated at runtime with the Canvas API.](https://docs.maptiler.com/sdk-js/examples/add-image-animated/)

[![Add a custom style layer](https://docs.maptiler.com/assets/img/example-card.png)**Add a custom style layer** Example\\
Use a custom style layer to render custom WebGL content.](https://docs.maptiler.com/sdk-js/examples/custom-style-layer/)

[![Add a generated icon to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add a generated icon to the map** Example\\
Add an icon to the map that was generated at runtime.](https://docs.maptiler.com/sdk-js/examples/add-image-generated/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/canvas-source/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add a canvas source

Add a canvas source

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)