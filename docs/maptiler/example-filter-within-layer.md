# Filter within a Layer

This example shows how to filter a layer based on user input using `setFilter()`. Download the [earthquake sample data](https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson).

Filter within a Layer

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

- NPM module
- Basic JavaScript

```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Filter within a Layer</title>
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

    .map-overlay {
      font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
      position: absolute;
      width: 31.8%;
      top: 0;
      left: 0;
      padding: 10px;
    }

    .map-overlay .map-overlay-inner {
      background-color: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      padding: 10px;
      margin-bottom: 10px;
    }

    .map-overlay input {
      margin: 2px;
    }

    input[type=number] {
      width: 25%
    }

    #filter-result {
      font-size: 8px;
      font-family: "Courier New";
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <div class="map-overlay top">
    <div class="map-overlay-inner">
      <nav id="nav-filter">
        <fieldset>
          <legend>🫨 Earthquake <code>felt</code>?</legend>
          <div>
            <input id="felt" type="checkbox" />
            <label for="felt">Apply <code>felt</code> Filter</label>
            <div>
              <div>
                <label for="operator-select">Operator:</label>
                <select name="operator" id="operator-felt">
                  <option value=">">></option>
                  <option value="==" selected>==</option>
                  <option value="<">
                    << /option>
                </select>
                <br>
                <label for="range">Felt:</label>
                <input type="number" id="range-felt" name="range" value="4" min="1.0" max="10000" />
              </div>
            </div>
        </fieldset>

        <fieldset>
          <legend>📈 Magnitude</legend>
          <div>
            <input id="mag" type="checkbox" />
            <label for="mag">Apply <code>magnitude</code> Filter</label>
            <div>
              <div>
                <label for="operator-select">Operator:</label>
                <select name="operator" id="operator-mag">
                  <option value=">">></option>
                  <option value="==" selected>==</option>
                  <option value="<">
                    << /option>
                </select>
                <br>
                <label for="range">Magnitude:</label>
                <input type="number" id="range-mag" name="range" value="2.71" min="0.0" max="100" />
              </div>
            </div>
        </fieldset>

        <fieldset>
          <legend>🌊 Tsunami (0 or 1)</legend>
          <input id="tsunami" type="checkbox" /> <label>Apply <code>tsunami</code> filter</label>
          <div id="radio-tsunamis">
            <input type="radio" id="t0" name="tsunami" value="0" /><label>0</label>
            <input type="radio" id="t1" name="tsunami" value="1" /><label>1</label>
          </div>
        </fieldset>
      </nav>
      <hr />
      <div id='filter-result'>["all"]</div>
    </div>
  </div>

  <script>

    maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

    const data = {};

    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: [-156.6, 44],
      zoom: 1.6,
    });

    map.on('load', async function () {
      await maptilersdk.helpers.addPoint(map, {
        layerId: 'earthquakes',
        data: 'YOUR_MAPTILER_DATASET_ID_HERE',
        pointColor: '#FB3A1B',
        pointRadius: 40
      });

    });

    document.getElementById('nav-filter').addEventListener('change', (e) => {
      let filterOnValue = ['all'];
      let operator = '==';

      switch (e.target.id) {
        /// example: `map.setFilter("earthquakes", ["any", [">", "felt", 16.0]])`
        case 'felt':
          operatorFelt = document.getElementById('operator-felt');
          felt = document.getElementById('range-felt');
          operator = operatorFelt.value;

          // eslint-disable-next-line no-unused-expressions
          e.target.checked ? data.felt = Number(felt.value) : delete data['felt'];

          break;

        /// example: `map.setFilter("earthquakes", ["any", [">", "mag", 5.0]])`
        case 'mag':
          operatorMag = document.getElementById('operator-mag');
          mag = document.getElementById('range-mag');
          operator = operatorMag.value;

          // eslint-disable-next-line no-unused-expressions
          e.target.checked ? data.mag = Number(mag.value) : delete data['mag'];

          break;

        /// example: `map.setFilter("earthquakes", ["any", [">", "tsunami", 0]])`
        case 'tsunami':
          // eslint-disable-next-line @typescript-eslint/quotes
          tsunami = document.querySelector("input[type='radio'][name=tsunami]:checked");
          operator = '==';

          // eslint-disable-next-line no-unused-expressions
          e.target.checked ? data.tsunami = Number(tsunami.value) : delete data['tsunami'];

          break;
        default:
          console.log('default');
      }

      filterOnValue = Object.keys(data);

      mapLibreFilterSpread = ['all', ...filterOnValue.map(id => [operator, id, data[id]])];
      mapLibreFilter = mapLibreFilterSpread;

      document.getElementById('filter-result').textContent = JSON.stringify(mapLibreFilter);

      map.setFilter('earthquakes', mapLibreFilter);
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

const data = {};

const map = new Map({
  container: 'map',
  style: MapStyle.DATAVIZ.DARK,
  center: [-156.6, 44],
  zoom: 1.6,
});

map.on('load', async function () {
  await maptilersdk.helpers.addPoint(map, {
    layerId: 'earthquakes',
    data: 'YOUR_MAPTILER_DATASET_ID_HERE',
    pointColor: '#FB3A1B',
    pointRadius: 40
  });

});

document.getElementById('nav-filter').addEventListener('change', (e) => {
  let filterOnValue = ['all'];
  let operator = '==';

  switch (e.target.id) {
    /// example: `map.setFilter("earthquakes", ["any", [">", "felt", 16.0]])`
    case 'felt':
      operatorFelt = document.getElementById('operator-felt');
      felt = document.getElementById('range-felt');
      operator = operatorFelt.value;

      // eslint-disable-next-line no-unused-expressions
      e.target.checked ? data.felt = Number(felt.value) : delete data['felt'];

      break;

    /// example: `map.setFilter("earthquakes", ["any", [">", "mag", 5.0]])`
    case 'mag':
      operatorMag = document.getElementById('operator-mag');
      mag = document.getElementById('range-mag');
      operator = operatorMag.value;

      // eslint-disable-next-line no-unused-expressions
      e.target.checked ? data.mag = Number(mag.value) : delete data['mag'];

      break;

    /// example: `map.setFilter("earthquakes", ["any", [">", "tsunami", 0]])`
    case 'tsunami':
      // eslint-disable-next-line @typescript-eslint/quotes
      tsunami = document.querySelector("input[type='radio'][name=tsunami]:checked");
      operator = '==';

      // eslint-disable-next-line no-unused-expressions
      e.target.checked ? data.tsunami = Number(tsunami.value) : delete data['tsunami'];

      break;
    default:
      console.log('default');
  }

  filterOnValue = Object.keys(data);

  mapLibreFilterSpread = ['all', ...filterOnValue.map(id => [operator, id, data[id]])];
  mapLibreFilter = mapLibreFilterSpread;

  document.getElementById('filter-result').textContent = JSON.stringify(mapLibreFilter);

  map.setFilter('earthquakes', mapLibreFilter);
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
  <title>Filter within a Layer</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <style>
  .map-overlay {
    font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    position: absolute;
    width: 31.8%;
    top: 0;
    left: 0;
    padding: 10px;
  }

  .map-overlay .map-overlay-inner {
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .map-overlay input {
    margin: 2px;
  }

  input[type=number] {
    width: 25%
  }

  #filter-result {
    font-size: 8px;
    font-family: "Courier New";
  }
  </style>
  <div id="map"></div>
  <div class="map-overlay top">
  <div class="map-overlay-inner">
      <nav id="nav-filter">
          <fieldset>
              <legend>🫨 Earthquake <code>felt</code>?</legend>
              <div>
                  <input id="felt" type="checkbox" />
                  <label for="felt">Apply <code>felt</code> Filter</label>
                  <div>
                      <div>
                          <label for="operator-select">Operator:</label>
                          <select name="operator" id="operator-felt">
                              <option value=">">></option>
                              <option value="==" selected>==</option>
                              <option value="<"><</option>
                          </select>
                          <br>
                          <label for="range">Felt:</label>
                          <input type="number" id="range-felt" name="range" value="4" min="1.0" max="10000" />
                      </div>
                  </div>
          </fieldset>

          <fieldset>
              <legend>📈 Magnitude</legend>
              <div>
                  <input id="mag" type="checkbox" />
                  <label for="mag">Apply <code>magnitude</code> Filter</label>
                  <div>
                      <div>
                          <label for="operator-select">Operator:</label>
                          <select name="operator" id="operator-mag">
                              <option value=">">></option>
                              <option value="==" selected>==</option>
                              <option value="<"><</option>
                          </select>
                          <br>
                          <label for="range">Magnitude:</label>
                          <input type="number" id="range-mag" name="range" value="2.71" min="0.0" max="100" />
                      </div>
                  </div>
          </fieldset>

          <fieldset>
              <legend>🌊 Tsunami (0 or 1)</legend>
              <input id="tsunami" type="checkbox" /> <label>Apply <code>tsunami</code> filter</label>
              <div id="radio-tsunamis">
                  <input type="radio" id="t0" name="tsunami" value="0" /><label>0</label>
                  <input type="radio" id="t1" name="tsunami" value="1" /><label>1</label>
              </div>
          </fieldset>
      </nav>
      <hr />
      <div id='filter-result'>["all"]</div>
  </div>
  </div>
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

[![Filter symbols by text input](https://docs.maptiler.com/assets/img/example-card.png)**Filter symbols by text input** Example\\
Filter symbols by icon name by typing in a text input.](https://docs.maptiler.com/sdk-js/examples/filter-markers-by-input/)

[![Point filtering by property](https://docs.maptiler.com/assets/img/example-card.png)**Point filtering by property** Example\\
Filter thousands of features in real time to quickly and easily find those with a property that meets your search criteria.](https://docs.maptiler.com/sdk-js/examples/point-filtering/)

[![Create a time slider](https://docs.maptiler.com/assets/img/example-card.png)**Create a time slider** Example\\
Visualize and filter earthquakes with a range slider.](https://docs.maptiler.com/sdk-js/examples/timeline-animation/)

[![Point layer colored and sized according to a property (point helper)](https://docs.maptiler.com/assets/img/example-card.png)**Point layer colored and sized according to a property (point helper)** Example\\
This example shows how to add a point layer colored and sized according to the property "mag" (= earthquake magnitude) to the map using the point layer helper.](https://docs.maptiler.com/sdk-js/examples/helper-point-property-style/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/filter-within-layer/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


Filter within a Layer

Filter within a Layer

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)