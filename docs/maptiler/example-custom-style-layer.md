# Add a custom style layer

Use a custom style layer to render custom WebGL content.

Add a custom style layer

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Add a custom style layer</title>
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
    const map = (window.map = new maptilersdk.Map({
        container: 'map',
        zoom: 3,
        center: [7.5, 58],
        style: maptilersdk.MapStyle.STREETS,
        canvasContextAttributes: {antialias: true}  // create the gl context with MSAA antialiasing, so custom layers are antialiased
    }));

    // create a custom style layer to implement the WebGL content
    const highlightLayer = {
        id: 'highlight',
        type: 'custom',

        // method called when the layer is added to the map
        // Search for StyleImageInterface in https://maplibre.org/maplibre-gl-js/docs/API/
        onAdd (map, gl) {
        // create GLSL source for vertex shader
            const vertexSource = `#version 300 es

            uniform mat4 u_matrix;
            in vec2 a_pos;
            void main() {
                gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
            }`;

            // create GLSL source for fragment shader
            const fragmentSource = `#version 300 es

            out highp vec4 fragColor;
            void main() {
                fragColor = vec4(1.0, 0.0, 0.0, 0.5);
            }`;

            // create a vertex shader
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexSource);
            gl.compileShader(vertexShader);

            // create a fragment shader
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentSource);
            gl.compileShader(fragmentShader);

            // link the two shaders into a WebGL program
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);

            this.aPos = gl.getAttribLocation(this.program, 'a_pos');

            // define vertices of the triangle to be rendered in the custom style layer
            const helsinki = maptilersdk.MercatorCoordinate.fromLngLat({
                lng: 25.004,
                lat: 60.239
            });
            const berlin = maptilersdk.MercatorCoordinate.fromLngLat({
                lng: 13.403,
                lat: 52.562
            });
            const kyiv = maptilersdk.MercatorCoordinate.fromLngLat({
                lng: 30.498,
                lat: 50.541
            });

            // create and initialize a WebGLBuffer to store vertex and color data
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([\
                    helsinki.x,\
                    helsinki.y,\
                    berlin.x,\
                    berlin.y,\
                    kyiv.x,\
                    kyiv.y\
                ]),
                gl.STATIC_DRAW
            );
        },

        // method fired on each animation frame
        render (gl, args) {
            gl.useProgram(this.program);
            gl.uniformMatrix4fv(
                gl.getUniformLocation(this.program, 'u_matrix'),
                false,
                args.defaultProjectionData.mainMatrix
            );
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.enableVertexAttribArray(this.aPos);
            gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
        }
    };

    // add the custom style layer to the map
    map.on('load', () => {
        map.addLayer(highlightLayer, 'Building');
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
import { Map, MapStyle, config, MercatorCoordinate } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
const map = (window.map = new Map({
    container: 'map',
    zoom: 3,
    center: [7.5, 58],
    style: MapStyle.STREETS,
    canvasContextAttributes: {antialias: true}  // create the gl context with MSAA antialiasing, so custom layers are antialiased
}));

// create a custom style layer to implement the WebGL content
const highlightLayer = {
    id: 'highlight',
    type: 'custom',

    // method called when the layer is added to the map
    // Search for StyleImageInterface in https://maplibre.org/maplibre-gl-js/docs/API/
    onAdd (map, gl) {
    // create GLSL source for vertex shader
        const vertexSource = `#version 300 es

        uniform mat4 u_matrix;
        in vec2 a_pos;
        void main() {
            gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
        }`;

        // create GLSL source for fragment shader
        const fragmentSource = `#version 300 es

        out highp vec4 fragColor;
        void main() {
            fragColor = vec4(1.0, 0.0, 0.0, 0.5);
        }`;

        // create a vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        // create a fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        // link the two shaders into a WebGL program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        this.aPos = gl.getAttribLocation(this.program, 'a_pos');

        // define vertices of the triangle to be rendered in the custom style layer
        const helsinki = MercatorCoordinate.fromLngLat({
            lng: 25.004,
            lat: 60.239
        });
        const berlin = MercatorCoordinate.fromLngLat({
            lng: 13.403,
            lat: 52.562
        });
        const kyiv = MercatorCoordinate.fromLngLat({
            lng: 30.498,
            lat: 50.541
        });

        // create and initialize a WebGLBuffer to store vertex and color data
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([\
                helsinki.x,\
                helsinki.y,\
                berlin.x,\
                berlin.y,\
                kyiv.x,\
                kyiv.y\
            ]),
            gl.STATIC_DRAW
        );
    },

    // method fired on each animation frame
    render (gl, args) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(
            gl.getUniformLocation(this.program, 'u_matrix'),
            false,
            args.defaultProjectionData.mainMatrix
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.enableVertexAttribArray(this.aPos);
        gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    }
};

// add the custom style layer to the map
map.on('load', () => {
    map.addLayer(highlightLayer, 'Building');
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
  <title>Add a custom style layer</title>
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

[![Add an animated icon to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add an animated icon to the map** Example\\
Add an animated icon to the map that was generated at runtime with the Canvas API.](https://docs.maptiler.com/sdk-js/examples/add-image-animated/)

[![Add a canvas source](https://docs.maptiler.com/assets/img/example-card.png)**Add a canvas source** Example\\
Add a canvas source to the map.](https://docs.maptiler.com/sdk-js/examples/canvas-source/)

[![Add a generated icon to the map](https://docs.maptiler.com/assets/img/example-card.png)**Add a generated icon to the map** Example\\
Add an icon to the map that was generated at runtime.](https://docs.maptiler.com/sdk-js/examples/add-image-generated/)

[![Generate and add a missing icon to the map](https://docs.maptiler.com/assets/img/example-card.png)**Generate a missing icon to the map** Example\\
Dynamically generate a missing icon at runtime and add it to the map.](https://docs.maptiler.com/sdk-js/examples/add-image-missing-generated/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/custom-style-layer/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Add a custom style layer

Add a custom style layer

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)