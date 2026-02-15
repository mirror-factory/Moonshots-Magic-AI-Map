# Cooperative gestures

This example shows how to enable cooperative gestures with a specific language.

Cooperative gestures

Utilice Ctrl + desplazamiento para hacer zoom en el mapa.

Usa dos dedos para mover el mapa.

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

See how it behaves: on desktop, zoom using the mouse wheel. On mobile, touch and move the map.

Windows: Use Ctrl + scroll to zoom the map.

Mac: Use ⌘ + scroll to zoom the map.

Mobile: Use two fingers to move the map.

- NPM module
- Basic JavaScript

```html
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cooperative gestures</title>
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
      center: [-77.04, 38.907],
      zoom: 11.15,
      cooperativeGestures: true,
      locale: {
        'CooperativeGesturesHandler.WindowsHelpText': 'Utilice Ctrl + desplazamiento para hacer zoom en el mapa.',
        'CooperativeGesturesHandler.MacHelpText': 'Usa ⌘ + desplazamiento para hacer zoom en el mapa.',
        'CooperativeGesturesHandler.MobileHelpText': 'Usa dos dedos para mover el mapa.',
      },
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
  center: [-77.04, 38.907],
  zoom: 11.15,
  cooperativeGestures: true,
  locale: {
    'CooperativeGesturesHandler.WindowsHelpText': 'Utilice Ctrl + desplazamiento para hacer zoom en el mapa.',
    'CooperativeGesturesHandler.MacHelpText': 'Usa ⌘ + desplazamiento para hacer zoom en el mapa.',
    'CooperativeGesturesHandler.MobileHelpText': 'Usa dos dedos para mover el mapa.',
  },
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
  <title>Cooperative gestures</title>
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

## Related examples

[![Hide map navigation controls](https://docs.maptiler.com/assets/img/example-card.png)**Hide map navigation controls** Example\\
This tutorial shows how to hide the navigation control (zoom and rotation controls to the map).](https://docs.maptiler.com/sdk-js/examples/navigation/)

[![Create a non-interactive map](https://docs.maptiler.com/assets/img/example-card.png)**Create a non-interactive map** Example\\
Disable interactivity to create a static map.](https://docs.maptiler.com/sdk-js/examples/interactive-false/)

[![Disable scroll zoom](https://docs.maptiler.com/assets/img/example-card.png)**Disable scroll zoom** Example\\
Prevent scroll from zooming a map.](https://docs.maptiler.com/sdk-js/examples/disable-scroll-zoom/)

[![Toggle interactions](https://docs.maptiler.com/assets/img/example-card.png)**Toggle interactions** Example\\
Enable or disable UI handlers on a map.](https://docs.maptiler.com/sdk-js/examples/toggle-interaction-handlers/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/cooperative-gestures/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Cooperative gestures

Cooperative gestures

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)