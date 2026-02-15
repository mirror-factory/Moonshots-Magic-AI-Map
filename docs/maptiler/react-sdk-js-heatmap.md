# Map in React JS create a heatmap

#### Maps in React series

In this series, we will learn how to create a map app in React with popups, a visualization switcher, geocoding control, 3D terrain, and a sidebar.

- Episode 0: [Map in React JS with Material UI](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/)
- Episode 1: [Map in React JS point data from geojson data](https://docs.maptiler.com/react/sdk-js/geojson-points/)
- **Episode 2: Map in React JS create a heatmap**
- Episode 3: [Map in React js with popup and sidebar](https://docs.maptiler.com/react/sdk-js/popup-sidebar/)
- Episode 4: [Map in React js with geocoding control](https://docs.maptiler.com/react/sdk-js/geocoding-control/)
- Episode 5: [3D Map in React js with geocoding control](https://docs.maptiler.com/react/sdk-js/3d-map/)

This example is the **Episode 2** of the Maps in React series. In this step-by-step tutorial, you’ll learn how to create a heatmap in your React JS map using the MapTiler SDK JS [heatmap helper](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap).

In this example, I’ll show you how to create a heatmap visualization of a point dataset and how to switch between this and the points.

By the end of this tutorial, you will be able to create a heatmap. With your newfound knowledge, you will be able to create visually stunning maps with React + Heatmap + MapTiler SDK. Take a look at the final output of this tutorial below:

Honolulu Accommodation

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

Change to heatmap

01. This tutorial builds on [Map in React JS point data from geojson data](https://docs.maptiler.com/react/sdk-js/geojson-points/) code. (That tutorial shows how to build a simple full-screen map application with hundreds of points.) Heatmap is a visualization method that shows the spatial density of point data based on attribute weight or simply by spatial distribution.

02. Create a new layer with the heatmap helper. Open the `/src/components/Map/map.jsx` file and add the highlighted lines:



    ```jsx

    ```





    React JSX



    Copy

03. When use the heatmap visualization on the accommodation dataset for Hawaii, it shows that most of the accommodation is concentrated around the coast. It does this clearly without crowding the map with overlapping points.

    ![React JS heatmap](https://docs.maptiler.com/react/sdk-js/heatmap/heatmap.png)

04. Create a heatmap of accommodation based on the minimum nights’ stay attribute. We can do this by setting up property and weight. In this example, we will exclude accommodation that can only be rented for more than 30 days.



    ```jsx

    ```





    React JSX



    Copy

05. Refresh the page and see that some points are now not being included in the calculations for the heatmap. But all the points have the same radius.

    ![React JS heatmap weight by property](https://docs.maptiler.com/react/sdk-js/heatmap/heatmap_weight.png)

06. We will make the radius of the heatmap points also determined by a value of the property defined above.



    ```jsx

    ```





    React JSX



    Copy

07. **Optional**. If you would like to play with heatmap opacity or styling across zoom levels, look at the [heatmap helper documentation](https://docs.maptiler.com/sdk-js/api/helpers/#heatmap).

08. Let’s create the visualization switcher. This will allow users to turn the heatmap back into points, letting them zoom in and identify individual locations.

09. Import the Material UI `Button` component.



    ```jsx

    ```





    React JSX



    Copy

10. Create a button. We will use Material UI to style it.



    ```jsx

    ```





    React JSX



    Copy

11. In the `handleVisualizationChange` function, we want to change the selected layer.



    ```jsx

    ```





    React JSX



    Copy

12. Create `selectedMapLayer` state to show the selected layer.



    ```jsx

    ```





    React JSX



    Copy

13. In order to switch between visualizations, we need to be able to make layers created by the MapTilerSDK helpers visible or invisible. This means we’ll need to know the ID of each layer. Check out the [MapTiler SDK helpers](https://docs.maptiler.com/sdk-js/api/helpers/) documentation to learn how to get the IDs of each layers.

14. We will use states to prevent errors caused by setting the visibility of a nonexistent layer.



    ```jsx

    ```





    React JSX



    Copy

15. Now let’s set the IDs of individual layers.



    ```jsx

    ```





    React JSX



    Copy

16. Change layers visibility only after the map is loaded. `setLayoutProperties` has 3 arguments `layerId`, `name`, and `value`. If the layer is selected, then the visibility should be set to `visible` otherwise it should be `none`.



    ```jsx

    ```





    React JSX



    Copy

17. Congratulations! You have created a heatmap, and added a button to your application to switch between displaying the point layer or the heatmap.

    ![Display heatmap and GeoJSON point map using React JS with Material UI](https://docs.maptiler.com/react/sdk-js/heatmap/final_map.png)


### Full code to download

We have created a repository with the result of this tutorial that will serve as a basis to build future applications. You can access the repository at ![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[Maps in React](https://github.com/maptiler/maps-in-react/tree/E2-heatmap).

## Next episode

Continue to [Episode 3: Map in React js with popup and sidebar](https://docs.maptiler.com/react/sdk-js/popup-sidebar/) to learn how to create a map with a sidebar and popup in your React JS map using the MapTiler SDK JS.

## Related examples

[![React JS with MapTiler maps](https://docs.maptiler.com/assets/img/example-card.png)**Learn the basics - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a React JS component to render a map using MapTiler SDK JS.](https://docs.maptiler.com/react/)

[![MapTiler SDK JS geocoding component how to search places using React JS](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding component - React** Example\\
This tutorial shows how to search for places using the Geocoding control component in React JS](https://docs.maptiler.com/react/sdk-js/geocoding-component/)

[![Map in React JS with Material UI](https://docs.maptiler.com/assets/img/example-card.png)**Map with Material UI** Example\\
In this step-by-step tutorial, you’ll learn how to create a application in React JS with Material UI (MUI) to render a map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/)

[![Map in React JS point data from geojson data](https://docs.maptiler.com/assets/img/example-card.png)**Points from geojson - React** Example\\
In this step-by-step tutorial, you’ll learn how to add geojson points to your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/geojson-points/)

[![Map in React js with popup and sidebar](https://docs.maptiler.com/assets/img/example-card.png)**Popup and sidebar - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a map with a sidebar and popup in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/popup-sidebar/)

[![Map in React js with geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding control - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a map with a geocoding control in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/geocoding-control/)

[![3D Map in React js with geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**3D Terrain Map** Example\\
In this step-by-step tutorial, you’ll learn how to create a 3D terrain map with a geocoding control in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/3d-map/)

##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Next episode](https://docs.maptiler.com/react/sdk-js/heatmap/#next-episode)
- [Related examples](https://docs.maptiler.com/react/sdk-js/heatmap/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

React


MapTiler SDK JS


Heatmap layers in React JS

Heatmap in React JS

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)