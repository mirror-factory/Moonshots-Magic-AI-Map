# 3D Map in React js with geocoding control

#### Maps in React series

In this series, we will learn how to create a map app in React with popups, a visualization switcher, geocoding control, 3D terrain, and a sidebar.

- Episode 0: [Map in React JS with Material UI](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/)
- Episode 1: [Map in React JS point data from geojson data](https://docs.maptiler.com/react/sdk-js/geojson-points/)
- Episode 2: [Map in React JS create a heatmap](https://docs.maptiler.com/react/sdk-js/heatmap/)
- Episode 3: [Map in React js with popup and sidebar](https://docs.maptiler.com/react/sdk-js/popup-sidebar/)
- Episode 4: [Map in React js with geocoding control](https://docs.maptiler.com/react/sdk-js/geocoding-control/)
- **Episode 5: 3D Map in React js with geocoding control**

This example is the **Episode 5** of the Maps in React series. In this step-by-step tutorial, you’ll learn how to a 3D terrain map in your React JS map using the MapTiler SDK JS.

In this example, I’ll focus on adding the 3D terrain to our React + MUI map. You will also learn to add custom map and show the map labels before your data visualization layer.

By the end of this tutorial, you will be able to create a 3D terrain custom map with a geocoding control. With your newfound knowledge, you will be able to create visually stunning 3D maps with React + MapTiler SDK. Take a look at the final output of this tutorial below:

Honolulu Accommodation

Click to point to see more details

Change to heatmap

01. This tutorial builds on [Map in React js with geocoding control](https://docs.maptiler.com/react/sdk-js/geocoding-control/) code. (That tutorial shows how to create a map with a geocoding control to search places).

02. Change the map style. To see the 3D terrain relief better, we need a map style with some visualization of the terrain. The best choices from the standard maps offered by MapTiler are Backdrop or Outdoor.



    ```jsx

    ```





    React JSX



    Copy

03. As you can see, Backdrop has a strong coast line and small labels. To make our map more visually attractive we can customize it. If you would like to know how to customize MapTiler maps, read about [Maps & styles basics](https://docs.maptiler.com/guides/map-design/maps-and-styles-basics).

    ![MapTiler SDK JS Backdrop map](https://docs.maptiler.com/react/sdk-js/3d-map/backdrop_map.png)

04. Change the map style to your custom map. In this example we are going to use a custom map that better suits the visualization of our data. To add a custom map, you need to know its id. Go to your MapTiler account and select a map you want to use. Scroll to vector style and copy its ID.



    ```jsx

    ```





    React JSX



    Copy





    Replace `YOUR_CUSTOM_MAP_ID` with your actual MapTiler map ID.

05. Let’s show the labels before our data layers. That is great for orientation in the map. All MapTiler SDK helper layers have a `beforeId` option where you can specify the ID of an existing layer before which the new layer will be inserted. To find the ID of this layer, you need to go to MapTiler and **select the map** you are using in your application. Then press the **Customize button**. In the Map Designer application go to the **Layers tab** then change to the **Verticality tab** and **find the layer** you are interested in. Click on the layer and **open the JSON editor** and **copy the layer ID**, in our case, “Ocean labels”.

    ![MapTiler Map Designer get layer ID](https://docs.maptiler.com/react/sdk-js/3d-map/customize_layer_id.png)

06. Add the `beforeId` option to the points and heatmap layers.



    ```jsx

    ```





    React JSX



    Copy

07. Add the terrain to the map. Just add the `terrain: true` to the map constructor options.



    ```jsx

    ```





    React JSX



    Copy

08. Rotate and tilt the map to check that 3D terrain is present.

    ![MapTiler 3D customize map](https://docs.maptiler.com/react/sdk-js/3d-map/3d_map_view.png)

09. Add the Terrain control to enable/disable the 3D terrain. Again, this can be done by just adding the `terrainControl` option in the map.



    ```jsx

    ```





    React JSX



    Copy

10. Tilt/Untilt the map when the users click on the terrain control. The 3D terrain is truly visible only when the map is tilted.



    ```jsx

    ```





    React JSX



    Copy

11. Reload the map on your page and use the terrain control to toggle the terrain on and off. We can now see the effect of the transition between the map with 3D terrain and the map without terrain.

12. Let’s adjust the animation speed so that the transition is slower.



    ```jsx

    ```





    React JSX



    Copy

13. Congratulations! You have created a 3D map in React JS.

    ![Display MapTiler SDK JS 3D map using React JS with Material UI](https://docs.maptiler.com/react/sdk-js/3d-map/final_map.png)


### Full code to download

We have created a repository with the result of this tutorial that will serve as a basis to build future applications. You can access the repository at ![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[Maps in React](https://github.com/maptiler/maps-in-react/tree/E5-3D-terrain).

## Related examples

[![React JS with MapTiler maps](https://docs.maptiler.com/assets/img/example-card.png)**Learn the basics - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a React JS component to render a map using MapTiler SDK JS.](https://docs.maptiler.com/react/)

[![MapTiler SDK JS geocoding component how to search places using React JS](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding component - React** Example\\
This tutorial shows how to search for places using the Geocoding control component in React JS](https://docs.maptiler.com/react/sdk-js/geocoding-component/)

[![Map in React JS with Material UI](https://docs.maptiler.com/assets/img/example-card.png)**Map with Material UI** Example\\
In this step-by-step tutorial, you’ll learn how to create a application in React JS with Material UI (MUI) to render a map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/)

[![Map in React JS point data from geojson data](https://docs.maptiler.com/assets/img/example-card.png)**Points from geojson - React** Example\\
In this step-by-step tutorial, you’ll learn how to add geojson points to your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/geojson-points/)

[![Map in React JS create a heatmap](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap in React JS** Example\\
In this step-by-step tutorial, you’ll learn how to create a heatmap in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/heatmap/)

[![Map in React js with popup and sidebar](https://docs.maptiler.com/assets/img/example-card.png)**Popup and sidebar - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a map with a sidebar and popup in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/popup-sidebar/)

[![Map in React js with geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding control - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a map with a geocoding control in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/geocoding-control/)

##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/react/sdk-js/3d-map/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

React


MapTiler SDK JS


3D Map in React js with geocoding control

3D Terrain Map

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)