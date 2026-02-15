# How to make a map of US election results

This tutorial demonstrates how to make a map of US election results. You can also:

- Read about [election mapping with MapTiler](https://www.maptiler.com/elections/)
- See a [full screen Demo](https://labs.maptiler.com/showcase/election-map-us/index.html#3/35.78/-98.73)

In this tutorial, we will create a map to show the results of the 2020 elections in the US. We have obtained the data from [Hardvard Dataverse](https://dataverse.harvard.edu/dataverse/medsl_president). To use this data in our application we have transformed the downloaded CSV files into JSON. Here you can download the transformed JSON files [2020 president by state](https://docs.maptiler.com/sdk-js/examples/election-map-usa/2020-president.json) y [2020 president by county](https://docs.maptiler.com/sdk-js/examples/election-map-usa/2020-county-president.json)

US election map

Click on the map to get the election results. Zoom in to view results by county

- NPM module
- Basic JavaScript

1. Copy the following code, paste it into your favorite text editor, and save it as a `.html` file.



```html

```





HTML



Copy


1. Install the npm package.



```bash
npm install --save @maptiler/sdk
```





Bash



Copy

2. Include the CSS file.

If you have a bundler that can handle CSS, you can [`import`](https://docs.maptiler.com/sdk-js/examples/election-map-usa/#) the CSS or include it with a [`<link>`](https://docs.maptiler.com/sdk-js/examples/election-map-usa/#) in the head of the document via the CDN



```js
import "@maptiler/sdk/dist/maptiler-sdk.css";
```





JavaScript



Copy







```html
<link href='https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css' rel='stylesheet' />
```





HTML



Copy

3. Include the following code in your JavaScript file (Example: app.js).



```js

```





JavaScript



Copy


4. Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

5. The next is up to you. You can center your map wherever you desire (modifying the `starting position`) and set an appropriate zoom level (modifying the `starting zoom`) to match your users’ needs. Additionally, you can change the map’s look (by updating the `source URL`); choose from a range of visually appealing map styles from our extensive [MapTiler standard maps](https://cloud.maptiler.com/maps/), or create your own to truly differentiate your application.


06. Add an event handler for the map `ready` event. You will add code to create your map in this handler.



    ```js

    ```





    JavaScript



    Copy

07. Add the [MapTiler countries](https://www.maptiler.com/countries/) data source.



    ```js

    ```





    JavaScript



    Copy

08. Find the id of the first symbol (text) layer in the map style. This is useful for adding polygon or line layers below the map labels.



    ```js

    ```





    JavaScript



    Copy

09. Add the US state’s layer



    ```js

    ```





    JavaScript



    Copy

10. Load the US election results data by states



    ```js

    ```





    JavaScript



    Copy





    `...`



    ```js

    ```





    JavaScript



    Copy





    `...`



    ```js

    ```





    JavaScript



    Copy

11. Add the election result data to the states layer features. We will use the `sourcedata` event to know when the data loading into the map is finished.



    ```js

    ```





    JavaScript



    Copy





    `...`



    ```js

    ```





    JavaScript



    Copy





    `...`



    ```js

    ```





    JavaScript



    Copy

12. Change the US state’s layer `fill-color` to the color of the winning party.



    ```js

    ```





    JavaScript



    Copy

13. Reload the page to see the map with the states colored according to the winner.

14. In the previous step, we have assigned the election results to the states. We’ve only done this for the states that are visible on the map. If we move the map towards Alaska we will see that the state remains in gray (it does not have any electoral results assigned). To avoid this we are going to use the `move` and `idle` events to assign the results to the rest of the states as we move around the map.



    ```js

    ```





    JavaScript



    Copy

15. The last thing we will do is use the map’s `click` event to show the election results corresponding to the state where the user clicks.



    ```js

    ```





    JavaScript



    Copy

16. To display the information we will use a popup.



    ```js

    ```





    JavaScript



    Copy

17. We will create the popup content with the `showInfo` function. The information displayed is the name of the state, a table showing the results according to the candidates and a graph showing the percentages of votes obtained and the winner’s margin of victory.



    ```js

    ```





    JavaScript



    Copy

18. To create the graph we need to load the d3.js library.



    ```html

    ```





    HTML



    Copy

19. Create the graph.



    ```js

    ```





    JavaScript



    Copy

20. Finally, style the information displayed in the popup so that it is more attractive and easier to understand.



    ```css

    ```





    CSS



    Copy

21. Reload the map and click on a state to see the election results.

22. Congratulations, you have made a map that shows the US election results by state.


View complete source code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>US election map</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
    .pop-header {
      font-family: "Noto Sans", "Ubuntu", sans-serif;
      font-size: 24px;
      font-weight: 500;
    }
    .popup-results {
      display: flex;
    }
    .maplibregl-popup {
      max-width: unset !important;
    }
    .maplibregl-popup-close-button {
      font-size: 24px;
      padding: 26px;
    }
    .maplibregl-popup-content {
      padding: 26px;
      border-radius: 8px;
    }
    .chart {
      position: relative;
      text-align: center;
    }
    .margin {
      display: flex;
      flex-direction: column;
      justify-items: center;
      align-content: center;
      font-size: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: "Noto Sans", "Ubuntu", sans-serif;
    }
    .margin div:nth-child(2) {
      color: #aeb6c7;
      text-transform: uppercase;
      margin: auto;
      font-size: 0.7rem;
    }
    .margin div:nth-child(1) {
      margin: auto;
      font-weight: 600;
      font-size: 1rem;
    }
    .margin.rep div:nth-child(1) {
      color: #b51800;
    }
    .margin.dem div:nth-child(1) {
      color: #005689;
    }
    .margin div:nth-child(1)::after {
      content: '%';
    }
    .popup-results table {
      width: 200px;
      font-family: "Noto Sans", "Ubuntu", sans-serif;
    }
    .popup-results table thead tr {
      color: #aeb6c7;
      text-transform: uppercase;
      border-color: #dfe1e6;
    }
    .popup-results table td:nth-child(2) {
      text-align: right;
      padding-right: 10px;
    }
    .popup-results table td:nth-child(3) {
      text-align: right;
      padding-right: 5px;
    }
    .popup-results table tbody tr {
      border-color: #dfe1e6;
    }
    .popup-results table tbody td:first-child {
      padding-right: 10px;
      width: 75px;
    }
    .popup-results table tbody td:nth-child(3) {
      font-weight: 600;
      text-align: right;
    }
    .popup-results table tbody td:nth-child(3)::after {
      content: '%';
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      let resultsStates;
      const colors = {
        republicans: '#D61822',
        democrats: '#0A3B7E',
        nodata: '#DEDEDE'
      }
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
        center: [-96.05, 36.79], // starting position [lng, lat]
        zoom: 4, // starting zoom
      });
      const popup = new maptilersdk.Popup({closeOnClick: false}).setLngLat([0, 0]);

      map.on('load', async () => {
        map.addSource('countries', {
          type: 'vector',
          url: `https://api.maptiler.com/tiles/countries/tiles.json`
        });

        const firstSymbolId = findFirstSymbolLayer(map);

        map.addLayer(
          {
            'id': 'states',
            'source': 'countries',
            'source-layer': 'administrative',
            'type': 'fill',
            'maxzoom': 7,
            'filter': [\
              'all',\
              ['==', 'level', 1],\
              ['==', 'level_0', 'US']\
            ],
            'paint': {
              'fill-opacity': 1,
              'fill-outline-color': '#fff',
              'fill-color': getStyleColorByParty(),
            }
          },
          firstSymbolId
        );

        resultsStates = await getStatesResults();

        map.on('sourcedata', getSourceData);

        map.on('move', (e) => {
          updatePolygonFeatures();
        });

        // just before the map enters an "idle" state.
        map.on('idle', function() {
          updatePolygonFeatures();
        });

        map.on('click', (e) => {
          const features = map.queryRenderedFeatures(e.point, {layers: ['states']});
          if (features.length){
            showInfo(e, features[0], map, popup);
          }
        });

      });

      function findFirstSymbolLayer() {
        const layers = map.getStyle().layers;
        const firstSymbolId = layers.find(layer => layer.type === 'symbol').id;
        return firstSymbolId;
      }

      async function getStatesResults() {
        const response = await fetch("https://docs.maptiler.com/sdk-js/examples/election-map-usa/2020-president.json");
        const data = await response.json();
        return data;
      }

      async function getSourceData(e) {
        if (e.isSourceLoaded && e.dataType === 'source') {
          const {sourceId} = e;
          // Do something when the source has finished loading
          if (sourceId === 'countries') {
            map.off('sourcedata', getSourceData);
            await updatePolygonFeatures();
            map.redraw();
            //map.panBy([0,0]);
          }
        }
      }

      async function updatePolygonFeatures() {
        const features = map.queryRenderedFeatures({layers:['states']});
        const filteredFeatutes = filterFeaturesNoFeatureState(features, map);
        filteredFeatutes.forEach(item => {
          const resultsData = resultsStates;
          const source = {
            source: item.source,
            sourceLayer: item.sourceLayer
          }
          addResultToFeature(item, resultsData, source, map);
        });
      }

      function filterFeaturesNoFeatureState(features, map) {
        const noStateFeatures = features.filter(item => {
          const fState = map.getFeatureState({
            source: item.source,
            sourceLayer: item.sourceLayer,
            id: item.id,
          });
          return !Object.keys(fState).length
        });
        return noStateFeatures
      }

      function addResultToFeature(feature, resultsData, source, map){
        const code = getCode(feature);
        const result = resultsData[code];
        if (!result) return;
        const {winner, winner_percentage, loser_percentage} = getWinner(result);
        if (source) {
          const fState = map.getFeatureState({
            ...source,
            id: feature.id,
          });
          if (!fState?.winner) {
            map.setFeatureState({
              ...source,
              id: feature.id,
            }, {
              totalvotes: result.totalvotes,
              trump: result.trump,
              biden: result.biden,
              winner: winner,
              winner_percentage: winner_percentage,
              loser_percentage: loser_percentage
            });
          }
        } else {
          const {properties} = feature;
          feature.properties = {...properties,
            totalvotes: result.totalvotes,
            trump: result.trump,
            biden: result.biden,
            winner: winner,
            winner_percentage: winner_percentage,
            loser_percentage: loser_percentage
          }
        }
      }

      function getCode(feature) {
        if (feature?.properties?.ste_stusps_code || feature?.properties?.coty_code) {
          return feature?.properties?.ste_stusps_code || feature?.properties?.coty_code.replace(/^\(1:|\)$/g, "").replace(/^0+/, "");
        } else {
          return feature.properties.code.replace('US-','').replace(/^0+/, "");
        }
      }

      function getWinner(result){
        if (!result) return {winner: '', winner_percentage: 0};
        if (parseInt(result.trump) > parseInt(result.biden)) {
          return {winner: 'trump',
            winner_percentage: percentage(result.trump, result.totalvotes),
            loser_percentage: percentage(result.biden, result.totalvotes)}
        } else {
          return {winner: 'biden',
            winner_percentage: percentage(result.biden, result.totalvotes),
            loser_percentage: percentage(result.trump, result.totalvotes)
          }
        }
      }

      function percentage(partialValue, totalValue) {
        return Math.round((100 * partialValue) / totalValue);
      }

      function getStyleColorByParty() {
        return ['case',\
          ['==', ['feature-state', 'winner'], 'biden'],\
          colors.democrats,\
          ['==', ['feature-state', 'winner'], 'trump'],\
          colors.republicans,\
          colors.nodata\
        ];
      }

      function showInfo(e, feature, map, popup) {
        const {lng, lat} = e.lngLat;
        const info = [];
        if (feature?.properties?.name) {
          info.push(`<h2 class="pop-header">${feature.properties.name}</h2>`);
        }
        const {state} = feature;
        if (state.winner === 'trump') {
          state.loser_percentage = percentage(state.biden, state.totalvotes);
        } else  {
          state.loser_percentage = percentage(state.trump, state.totalvotes);
        }
        state.margin = state.winner_percentage - state.loser_percentage;
        const data = {};
        if (state.winner === 'trump') {
          data.winner = {
            name: 'Donald J. Trump',
            votes: state.trump,
            pct: state.winner_percentage
          }
          data.loser = {
            name: 'Joseph R. Biden',
            votes: state.biden,
            pct: state.loser_percentage
          }
        } else {
          data.winner = {
            name: 'Joseph R. Biden',
            votes: state.biden,
            pct: state.winner_percentage
          }
          data.loser = {
            name: 'Donald J. Trump',
            votes: state.trump,
            pct: state.loser_percentage
          }
        }
        data.margin = state.margin;

        info.push(`<div class="popup-results">
          <div class="table">
            <table>
                <thead>
                  <tr>
                    <td>Candidate</td>
                    <td>Votes</td>
                    <td>%.</td>
                  </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="name">
                    ${data.winner.name}
                  </td>
                  <td class="votes">
                    ${data.winner.votes}
                  </td>
                  <td class="pct">
                    ${data.winner.pct}
                  </td>
                </tr>
                <tr>
                  <td class="name">
                    ${data.loser.name}
                  </td>
                  <td class="votes">
                    ${data.loser.votes}
                  </td>
                  <td class="pct">
                    ${data.loser.pct}
                  </td>
                </tr>
                </tbody>
            </table>
          </div>
        </div>`);

        info.push(`<div class="chart">
          <div class="margin ${state.winner === 'trump'? 'rep' : 'dem'}">
            <div>${data.margin}</div>
            <div>Margin</div>
          </div>
        </div>`);

        const html = info.join("");

        popup.setLngLat([lng, lat])
          .setHTML(html)
          .addTo(map);

        const svg = createChart(data, state.winner);

        const charContainer = document.querySelector(".chart");
        charContainer.appendChild(svg);

      }

      function createChart(results, winner) {
        const data = [\
          {votes: results.winner.pct, init: 0},\
          {votes: results.loser.pct, init: 0},\
          {votes: 0, init: 100},\
          ["votes", "init"]\
        ]
        const width = 700;
        const height = Math.min(width, width / 2);
        const outerRadius = height / 2 - 10;
        const innerRadius = outerRadius * 0.75;
        const tau = 2 * Math.PI;
        const color = function(i) {
          if (i === 0) {
            if (winner === 'trump') {
              return colors.republicans
            } else {
              return colors.democrats
            }
          } else if (i === 1) {
            if (winner === 'trump') {
              return colors.democrats
            } else {
              return colors.republicans
            }
          } else {
            return colors.nodata
          }
        };

        const svg = d3.create("svg")
            .attr("viewBox", [-width/2, -height/2, width, height]);

        const arc = d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);

        const pie = d3.pie().sort(null).value((d) => {
          return d["init"]
        });

        const path = svg.datum(data).selectAll("path")
            .data(pie)
          .join("path")
            .attr("fill", (d, i) => {
              return color(i)
            })
            .attr("d", arc)
            .each(function(d) { this._current = d; }); // store the initial angles

        function change(value) {
          pie.value((d) => d[value]); // change the value function
          path.data(pie); // compute the new angles
          path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
        }

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        function arcTween(a) {
          const i = d3.interpolate(this._current, a);
          this._current = i(0);
          return (t) => arc(i(t));
        }

        setTimeout(() => {
          change('votes');
        }, 300);

        // Return the svg node to be displayed.
        return Object.assign(svg.node(), {change});
      }

  </script>
</body>
</html>
```

HTML

Copy

### Optional: add the county layer

Below we will explain the steps to add the results by county to the map.

Look the steps to add the results by county


1. Add the US counties layer



```js

```





JavaScript



Copy

2. Load the US election results data by county



```js

```





JavaScript



Copy




`...`


```js

```





JavaScript



Copy




`...`


```js

```





JavaScript



Copy

3. Add the election result data to the county layer features.



```js

```





JavaScript



Copy

4. Show the election results corresponding to the county where the user clicks.



```js

```





JavaScript



Copy

5. Animate the transition between the state and county visualization.



```js

```





JavaScript



Copy




`...`


```js

```





JavaScript



Copy

6. Congratulations, you have made a map that shows the US election results by state and county.


View complete source code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>US election map</title>
  <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.umd.min.js"></script>
  <link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.10.2/maptiler-sdk.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
    .pop-header {
      font-family: "Noto Sans", "Ubuntu", sans-serif;
      font-size: 24px;
      font-weight: 500;
    }
    .popup-results {
      display: flex;
    }
    .maplibregl-popup {
      max-width: unset !important;
    }
    .maplibregl-popup-close-button {
      font-size: 24px;
      padding: 26px;
    }
    .maplibregl-popup-content {
      padding: 26px;
      border-radius: 8px;
    }
    .chart {
      position: relative;
      text-align: center;
    }
    .margin {
      display: flex;
      flex-direction: column;
      justify-items: center;
      align-content: center;
      font-size: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: "Noto Sans", "Ubuntu", sans-serif;
    }
    .margin div:nth-child(2) {
      color: #aeb6c7;
      text-transform: uppercase;
      margin: auto;
      font-size: 0.7rem;
    }
    .margin div:nth-child(1) {
      margin: auto;
      font-weight: 600;
      font-size: 1rem;
    }
    .margin.rep div:nth-child(1) {
      color: #b51800;
    }
    .margin.dem div:nth-child(1) {
      color: #005689;
    }
    .margin div:nth-child(1)::after {
      content: '%';
    }
    .popup-results table {
      width: 200px;
      font-family: "Noto Sans", "Ubuntu", sans-serif;
    }
    .popup-results table thead tr {
      color: #aeb6c7;
      text-transform: uppercase;
      border-color: #dfe1e6;
    }
    .popup-results table td:nth-child(2) {
      text-align: right;
      padding-right: 10px;
    }
    .popup-results table td:nth-child(3) {
      text-align: right;
      padding-right: 5px;
    }
    .popup-results table tbody tr {
      border-color: #dfe1e6;
    }
    .popup-results table tbody td:first-child {
      padding-right: 10px;
      width: 75px;
    }
    .popup-results table tbody td:nth-child(3) {
      font-weight: 600;
      text-align: right;
    }
    .popup-results table tbody td:nth-child(3)::after {
      content: '%';
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      let resultsStates;
      let resultsCounty;
      const colors = {
        republicans: '#D61822',
        democrats: '#0A3B7E',
        nodata: '#DEDEDE'
      }
      maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
        center: [-96.05, 36.79], // starting position [lng, lat]
        zoom: 4, // starting zoom
      });
      const popup = new maptilersdk.Popup({closeOnClick: false}).setLngLat([0, 0]);

      map.on('load', async () => {
        map.addSource('countries', {
          type: 'vector',
          url: `https://api.maptiler.com/tiles/countries/tiles.json`
        });

        const firstSymbolId = findFirstSymbolLayer(map);

        map.addLayer(
          {
            'id': 'county',
            'source': 'countries',
            'source-layer': 'administrative',
            'type': 'fill',
            'minzoom': 5,
            'filter': [\
              'all',\
              ['==', 'level', 2],\
              ['==', 'level_0', 'US']\
            ],
            'paint': {
              'fill-opacity': 1,
              'fill-outline-color': '#262626',
              'fill-color': getStyleColorByParty(),

            }
          },
          firstSymbolId
        );

        map.addLayer(
          {
            'id': 'states',
            'source': 'countries',
            'source-layer': 'administrative',
            'type': 'fill',
            'maxzoom': 7,
            'filter': [\
              'all',\
              ['==', 'level', 1],\
              ['==', 'level_0', 'US']\
            ],
            'paint': {
              'fill-opacity': 1,
              'fill-outline-color': '#fff',
              'fill-color': getStyleColorByParty(),
              'fill-opacity-transition': { duration: 300 }
            }
          },
          firstSymbolId
        );

        resultsStates = await getStatesResults();
        resultsCounty = await getCountiesResults();

        map.on('sourcedata', getSourceData);

        map.on('move', (e) => {
          updatePolygonFeatures();
        });

        // just before the map enters an "idle" state.
        map.on('idle', function() {
          updatePolygonFeatures();
        });

        map.on('click', (e) => {
          const features = map.queryRenderedFeatures(e.point, {layers: ['states']});
          if (features.length){
            showInfo(e, features[0], map, popup);
          }
        });

        map.on('zoom', (e) => {
          if (map.getZoom() >= 6) {
            if (map.getPaintProperty('states', 'fill-opacity') === 1) {
              map.setPaintProperty('states', 'fill-opacity', 0);
              setTimeout(() => {
                map.setLayoutProperty('states', 'visibility', 'none');
              },400);
            }
          } else {
            if (map.getPaintProperty('states', 'fill-opacity') === 0) {
              map.setLayoutProperty('states', 'visibility', 'visible');
              map.setPaintProperty('states', 'fill-opacity', 1);
            }
          }
        });

      });

      function findFirstSymbolLayer() {
        const layers = map.getStyle().layers;
        const firstSymbolId = layers.find(layer => layer.type === 'symbol').id;
        return firstSymbolId;
      }

      async function getStatesResults() {
        const response = await fetch("https://docs.maptiler.com/sdk-js/examples/election-map-usa/2020-president.json");
        const data = await response.json();
        return data;
      }

      async function getCountiesResults() {
        const response = await fetch("https://docs.maptiler.com/sdk-js/examples/election-map-usa/2020-county-president.json");
        const data = await response.json();
        return data;
      }

      async function getSourceData(e) {
        if (e.isSourceLoaded && e.dataType === 'source') {
          const {sourceId} = e;
          // Do something when the source has finished loading
          if (sourceId === 'countries') {
            map.off('sourcedata', getSourceData);
            await updatePolygonFeatures();
            map.redraw();
            //map.panBy([0,0]);
          }
        }
      }

      async function updatePolygonFeatures() {
        const features = map.queryRenderedFeatures({layers:['states', 'county']});
        const filteredFeatutes = filterFeaturesNoFeatureState(features, map);
        filteredFeatutes.forEach(item => {
          const resultsData = (item.layer.id === 'states') ? resultsStates : resultsCounty;
          const source = {
            source: item.source,
            sourceLayer: item.sourceLayer
          }
          addResultToFeature(item, resultsData, source, map);
        });
      }

      function filterFeaturesNoFeatureState(features, map) {
        const noStateFeatures = features.filter(item => {
          const fState = map.getFeatureState({
            source: item.source,
            sourceLayer: item.sourceLayer,
            id: item.id,
          });
          return !Object.keys(fState).length
        });
        return noStateFeatures
      }

      function addResultToFeature(feature, resultsData, source, map){
        const code = getCode(feature);
        const result = resultsData[code];
        if (!result) return;
        const {winner, winner_percentage, loser_percentage} = getWinner(result);
        if (source) {
          const fState = map.getFeatureState({
            ...source,
            id: feature.id,
          });
          if (!fState?.winner) {
            map.setFeatureState({
              ...source,
              id: feature.id,
            }, {
              totalvotes: result.totalvotes,
              trump: result.trump,
              biden: result.biden,
              winner: winner,
              winner_percentage: winner_percentage,
              loser_percentage: loser_percentage
            });
          }
        } else {
          const {properties} = feature;
          feature.properties = {...properties,
            totalvotes: result.totalvotes,
            trump: result.trump,
            biden: result.biden,
            winner: winner,
            winner_percentage: winner_percentage,
            loser_percentage: loser_percentage
          }
        }
      }

      function getCode(feature) {
        if (feature?.properties?.ste_stusps_code || feature?.properties?.coty_code) {
          return feature?.properties?.ste_stusps_code || feature?.properties?.coty_code.replace(/^\(1:|\)$/g, "").replace(/^0+/, "");
        } else {
          return feature.properties.code.replace('US-','').replace(/^0+/, "");
        }
      }

      function getWinner(result){
        if (!result) return {winner: '', winner_percentage: 0};
        if (parseInt(result.trump) > parseInt(result.biden)) {
          return {winner: 'trump',
            winner_percentage: percentage(result.trump, result.totalvotes),
            loser_percentage: percentage(result.biden, result.totalvotes)}
        } else {
          return {winner: 'biden',
            winner_percentage: percentage(result.biden, result.totalvotes),
            loser_percentage: percentage(result.trump, result.totalvotes)
          }
        }
      }

      function percentage(partialValue, totalValue) {
        return Math.round((100 * partialValue) / totalValue);
      }

      function getStyleColorByParty() {
        return ['case',\
          ['==', ['feature-state', 'winner'], 'biden'],\
          colors.democrats,\
          ['==', ['feature-state', 'winner'], 'trump'],\
          colors.republicans,\
          colors.nodata\
        ];
      }

      function showInfo(e, feature, map, popup) {
        const {lng, lat} = e.lngLat;
        const info = [];
        if (feature?.properties?.name) {
          info.push(`<h2 class="pop-header">${feature.properties.name}</h2>`);
        }
        const {state} = feature;
        if (state.winner === 'trump') {
          state.loser_percentage = percentage(state.biden, state.totalvotes);
        } else  {
          state.loser_percentage = percentage(state.trump, state.totalvotes);
        }
        state.margin = state.winner_percentage - state.loser_percentage;
        const data = {};
        if (state.winner === 'trump') {
          data.winner = {
            name: 'Donald J. Trump',
            votes: state.trump,
            pct: state.winner_percentage
          }
          data.loser = {
            name: 'Joseph R. Biden',
            votes: state.biden,
            pct: state.loser_percentage
          }
        } else {
          data.winner = {
            name: 'Joseph R. Biden',
            votes: state.biden,
            pct: state.winner_percentage
          }
          data.loser = {
            name: 'Donald J. Trump',
            votes: state.trump,
            pct: state.loser_percentage
          }
        }
        data.margin = state.margin;

        info.push(`<div class="popup-results">
          <div class="table">
            <table>
                <thead>
                  <tr>
                    <td>Candidate</td>
                    <td>Votes</td>
                    <td>%.</td>
                  </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="name">
                    ${data.winner.name}
                  </td>
                  <td class="votes">
                    ${data.winner.votes}
                  </td>
                  <td class="pct">
                    ${data.winner.pct}
                  </td>
                </tr>
                <tr>
                  <td class="name">
                    ${data.loser.name}
                  </td>
                  <td class="votes">
                    ${data.loser.votes}
                  </td>
                  <td class="pct">
                    ${data.loser.pct}
                  </td>
                </tr>
                </tbody>
            </table>
          </div>
        </div>`);

        info.push(`<div class="chart">
          <div class="margin ${state.winner === 'trump'? 'rep' : 'dem'}">
            <div>${data.margin}</div>
            <div>Margin</div>
          </div>
        </div>`);

        const html = info.join("");

        popup.setLngLat([lng, lat])
          .setHTML(html)
          .addTo(map);

        const svg = createChart(data, state.winner);

        const charContainer = document.querySelector(".chart");
        charContainer.appendChild(svg);

      }

      function createChart(results, winner) {
        const data = [\
          {votes: results.winner.pct, init: 0},\
          {votes: results.loser.pct, init: 0},\
          {votes: 0, init: 100},\
          ["votes", "init"]\
        ]
        const width = 700;
        const height = Math.min(width, width / 2);
        const outerRadius = height / 2 - 10;
        const innerRadius = outerRadius * 0.75;
        const tau = 2 * Math.PI;
        const color = function(i) {
          if (i === 0) {
            if (winner === 'trump') {
              return colors.republicans
            } else {
              return colors.democrats
            }
          } else if (i === 1) {
            if (winner === 'trump') {
              return colors.democrats
            } else {
              return colors.republicans
            }
          } else {
            return colors.nodata
          }
        };

        const svg = d3.create("svg")
            .attr("viewBox", [-width/2, -height/2, width, height]);

        const arc = d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);

        const pie = d3.pie().sort(null).value((d) => {
          return d["init"]
        });

        const path = svg.datum(data).selectAll("path")
            .data(pie)
          .join("path")
            .attr("fill", (d, i) => {
              return color(i)
            })
            .attr("d", arc)
            .each(function(d) { this._current = d; }); // store the initial angles

        function change(value) {
          pie.value((d) => d[value]); // change the value function
          path.data(pie); // compute the new angles
          path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
        }

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        function arcTween(a) {
          const i = d3.interpolate(this._current, a);
          this._current = i(0);
          return (t) => arc(i(t));
        }

        setTimeout(() => {
          change('votes');
        }, 300);

        // Return the svg node to be displayed.
        return Object.assign(svg.node(), {change});
      }

  </script>
</body>
</html>
```

HTML

Copy

## Related examples

[![How to create a choropleth Map from GeoJSON](https://docs.maptiler.com/assets/img/example-card.png)**Choropleth GeoJSON** Example\\
This tutorial shows how to add a styled GeoJSON overlay to the map, display a popup on click, and create a map legend.](https://docs.maptiler.com/sdk-js/examples/choropleth-geojson/)

[![Interactive choropleth map](https://docs.maptiler.com/assets/img/example-card.png)**Interactive choropleth map** Example\\
Use events and feature states to create a interactive choropleth map.](https://docs.maptiler.com/sdk-js/examples/interactive-choropleth/)

[![Show polygon information on click](https://docs.maptiler.com/assets/img/example-card.png)**Show polygon information on click** Example\\
When a user clicks a polygon, display a popup containing more information.](https://docs.maptiler.com/sdk-js/examples/polygon-popup-on-click/)

[![Display a popup on hover](https://docs.maptiler.com/assets/img/example-card.png)**Display a popup on hover** Example\\
When a user hovers over a custom marker, show a popup containing more information.](https://docs.maptiler.com/sdk-js/examples/popup-on-hover/)


An extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/examples/election-map-usa/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Examples


How to make a map of US election results

US election map

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)