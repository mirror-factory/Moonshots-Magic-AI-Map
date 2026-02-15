# Map in React JS point data from geojson data

#### Maps in React series

In this series, we will learn how to create a map app in React with popups, a visualization switcher, geocoding control, 3D terrain, and a sidebar.

- Episode 0: [Map in React JS with Material UI](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/)
- **Episode 1: Map in React JS point data from geojson data**
- Episode 2: [Map in React JS create a heatmap](https://docs.maptiler.com/react/sdk-js/heatmap/)
- Episode 3: [Map in React js with popup and sidebar](https://docs.maptiler.com/react/sdk-js/popup-sidebar/)
- Episode 4: [Map in React js with geocoding control](https://docs.maptiler.com/react/sdk-js/geocoding-control/)
- Episode 5: [3D Map in React js with geocoding control](https://docs.maptiler.com/react/sdk-js/3d-map/)

This example is the **Episode 1** of the Maps in React series. In this step-by-step tutorial, you’ll learn how to add geojson points to your React JS map using the MapTiler SDK JS point helper.

By the end of this tutorial, you will be able to create a map with hundreds of points. With your newfound knowledge, you will be able to create visually stunning maps with React + GeoJSON + MapTiler SDK. Take a look at the final output of this tutorial:

Honolulu Accommodation

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

In this example we are going to use [Airbnb accommodation data from Honolulu](https://docs.maptiler.com/sdk-js/assets/Honolulu_Arbnb.geojson). We have cleaned up the data and selected only a few properties for the practical purposes of the example.

01. Follow the [Map in React JS with Material UI](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/) tutorial to create a simple full-screen map application.

02. Change the basemap to Dataviz Light. This style is specially made for dashboards, so the data will shine more on it than on the street style, which was made primarily for navigation apps. You can find the [full list of standard maps](https://docs.maptiler.com/sdk-js/api/map-styles/) in the MapTiler SDK documentation. Modify the map component `src/components/Map/map.jsx`.



    ```jsx

    ```





    React JSX



    Copy

03. Remove the marker from the map. In this example we are going to add data to the map from a GeoJSON so we will not need the marker anymore. Delete the following lines:



    ```diff-jsx

    ```





    Diff-jsx



    Copy

04. Change the title of the page. Open the `index.html` file



    ```html

    ```





    HTML



    Copy

05. Upload the GeoJSON file to the MapTiler cloud. Check out the [How to Upload GeoJSON to MapTiler](https://docs.maptiler.com/guides/maps-apis/maps-platform/prepare-geojson-with-attributes-for-choropleth-map-and-upload-geojson-to-maptiler-cloud) tutorial to learn how to do it. Publish the dataset and copy the dataset ID.

06. Update the `src/config.js` file.



    ```js

    ```





    JavaScript



    Copy





    Here you will need to replace `YOUR_DATASET_ID_HERE` with your actual [MapTiler dataset ID](https://cloud.maptiler.com/data).

07. Modify the map component `map.jsx` file. Create a variable where we will store the ID of our dataset.



    ```jsx

    ```





    React JSX



    Copy

08. Add event handler for map load event. You will add code to load a GeoJSON layer in this handler.



    ```jsx

    ```





    React JSX



    Copy

09. Use the [Point Layer Helper](https://docs.maptiler.com/sdk-js/api/helpers/#point) to load and style the GeoJSON point layer.



    ```jsx

    ```





    React JSX



    Copy

10. Set the points color to red (if no color is specified, a random color is used) and specify the opacity as well. This can make the points a little less intense and easier on the eye.



    ```jsx

    ```





    React JSX



    Copy

11. Reload the page, now we can see our red dot maps with transparency.

    ![GeoJSON React JS maps of points](https://docs.maptiler.com/react/sdk-js/geojson-points/map-points-red.png)

12. Let’s color each point based on the value of an attribute in the data. In the example we will use the `minimum_nights` attribute. The MapTiler SDK comes with several [built-in color Ramps](https://docs.maptiler.com/sdk-js/api/color-ramp/). We are going to use the COOL color ramp. By setting the `scale` from 0 to 30 and applying the `reverse` method. You should be able to see the Airbnb that you can only rent for more than a month (the purples ones).



    ```jsx

    ```





    React JSX



    Copy

13. This is good for an overview, but we’d like to see the exact number of minimum nights, so let’s add some labels.



    ```jsx

    ```





    React JSX



    Copy

14. That’s better, but you can’t really read the labels on the green dots, so let’s change the color of the labels to black.



    ```jsx

    ```





    React JSX



    Copy

15. As you can see the size of the dots depends on the length of the minimum stays. We don’t need this when the color already shows it. Therefore, we will set the radius of the dots to 12.



    ```jsx

    ```





    React JSX



    Copy

16. With everything done up until now, you should be able see your beautiful map in your browser.

    ![GeoJSON React JS choropleth maps of points ](https://docs.maptiler.com/react/sdk-js/geojson-points/final_map.png)


**Optional**. Point helpers can also create clusters, so you don’t need to use anything like a 3rd party plugin to do this. Simply set Cluster to be true! It couldn’t be easier!

```jsx

```

React JSX

Copy

This is how the cluster map would look. In this visualization, the size of the circles corresponds to the number of accommodations, and the labels also show the number of accommodations in the cluster.

![GeoJSON React JS cluster maps of points](https://docs.maptiler.com/react/sdk-js/geojson-points/cluster.png)

### Full code to download

We have created a repository with the result of this tutorial that will serve as a basis to build future applications. You can access the repository at ![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[Maps in React](https://github.com/maptiler/maps-in-react/tree/E1-Add-geojson-data).

## Next episode

Continue to [Episode 2: Map in React JS create a heatmap](https://docs.maptiler.com/react/sdk-js/heatmap/) to learn how to create a heatmap in your React JS map using the MapTiler SDK JS.

## Related examples

[![React JS with MapTiler maps](https://docs.maptiler.com/assets/img/example-card.png)**Learn the basics - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a React JS component to render a map using MapTiler SDK JS.](https://docs.maptiler.com/react/)

[![MapTiler SDK JS geocoding component how to search places using React JS](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding component - React** Example\\
This tutorial shows how to search for places using the Geocoding control component in React JS](https://docs.maptiler.com/react/sdk-js/geocoding-component/)

[![Map in React JS with Material UI](https://docs.maptiler.com/assets/img/example-card.png)**Map with Material UI** Example\\
In this step-by-step tutorial, you’ll learn how to create a application in React JS with Material UI (MUI) to render a map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/)

[![Map in React JS create a heatmap](https://docs.maptiler.com/assets/img/example-card.png)**Heatmap in React JS** Example\\
In this step-by-step tutorial, you’ll learn how to create a heatmap in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/heatmap/)

[![Map in React js with popup and sidebar](https://docs.maptiler.com/assets/img/example-card.png)**Popup and sidebar - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a map with a sidebar and popup in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/popup-sidebar/)

[![Map in React js with geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**Geocoding control - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a map with a geocoding control in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/geocoding-control/)

[![3D Map in React js with geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**3D Terrain Map** Example\\
In this step-by-step tutorial, you’ll learn how to create a 3D terrain map with a geocoding control in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/3d-map/)

##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Next episode](https://docs.maptiler.com/react/sdk-js/geojson-points/#next-episode)
- [Related examples](https://docs.maptiler.com/react/sdk-js/geojson-points/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

React


MapTiler SDK JS


Map in React JS point data from geojson data

Points from geojson - React

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)