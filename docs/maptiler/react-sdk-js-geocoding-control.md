# Map in React js with geocoding control

#### Maps in React series

In this series, we will learn how to create a map app in React with popups, a visualization switcher, geocoding control, 3D terrain, and a sidebar.

- Episode 0: [Map in React JS with Material UI](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/)
- Episode 1: [Map in React JS point data from geojson data](https://docs.maptiler.com/react/sdk-js/geojson-points/)
- Episode 2: [Map in React JS create a heatmap](https://docs.maptiler.com/react/sdk-js/heatmap/)
- Episode 3: [Map in React js with popup and sidebar](https://docs.maptiler.com/react/sdk-js/popup-sidebar/)
- **Episode 4: Map in React js with geocoding control**
- Episode 5: [3D Map in React js with geocoding control](https://docs.maptiler.com/react/sdk-js/3d-map/)

This example is the **Episode 4** of the Maps in React series. In this step-by-step tutorial, you’ll learn how to create a map with a geocoding control in your React JS map using the MapTiler SDK JS. The [geocoding control](https://docs.maptiler.com/sdk-js/modules/geocoding/) facilitates the use of the [MapTiler Geocoding API](https://www.maptiler.com/cloud/geocoding/) to search places (States, Cities, Streets, Addresses, POIs, …).

In this example, I’ll focus on adding the geocoding control to our React + MUI map.

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[MapTiler Geocoding control on GitHub](https://github.com/maptiler/maptiler-geocoding-control)

By the end of this tutorial, you will be able to create a map with a geocoding control. With your newfound knowledge, you will be able to create visually stunning maps with React + Geocoding Control + MapTiler SDK. Take a look at the final output of this tutorial below:

Honolulu Accommodation

Click to point to see more details

Change to heatmap

[© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

01. This tutorial builds on [Map in React js with popup and sidebar](https://docs.maptiler.com/react/sdk-js/popup-sidebar/) code. (That tutorial shows how to create a map with a sidebar and popup).

02. Install MapTiler Geocoding control library, navigate to your project folder and run the command:







    ```bash
    npm i @maptiler/geocoding-control
    ```





    Bash



    Copy

03. Import the `geocodingControl` and its styles into the `src/components/Map/map.jsx` component. In this example we will not be using the geocodingControl React component. In the example [MapTiler SDK JS geocoding component how to search places using React JS](https://docs.maptiler.com/react/sdk-js/geocoding-component/) you can see how to use the component on a map. You can also use the geocodingControl component if you need the geocoding control without a map.



    ```jsx

    ```





    React JSX



    Copy

04. Add the `geocodingControl` to the map.



    ```jsx

    ```





    React JSX



    Copy

05. We already have the geocoding control working on our map.

    ![Geocoding control using React JS with Material UI](https://docs.maptiler.com/react/sdk-js/geocoding-control/geocoding-control.png)

06. Let’s add some options to the `geocodingControl` to improve the results. Limit the number of results to 3.



    ```jsx

    ```





    React JSX



    Copy

07. Limit the results to a specific country. Since our map is in Honolulu we will limit the results to the United States of America.



    ```jsx

    ```





    React JSX



    Copy

08. Now the results are only from the USA.

    ![Geocoding control results only from USA](https://docs.maptiler.com/react/sdk-js/geocoding-control/geocoding-control-usa.png)

09. That removes the other countries from the results, but we still don’t get the results for Honolulu first. To fix this we can either set a fixed proximity or specify the center of my map. In the example we’re going to use the center of the map.



    ```jsx

    ```





    React JSX



    Copy

10. We now have the results prioritized by proximity to the center of the map, which shows us the results for Honolulu first. Let’s refine the search a little further by specifying the type of results we want. In this case, we are only interested in addresses.



    ```jsx

    ```





    React JSX



    Copy





    ![Geocoding control results by map center using React JS with Material UI](https://docs.maptiler.com/react/sdk-js/geocoding-control/geocoding-control-map-center.png)

11. Congratulations! You have created a map with a geocoding control to search places. Have a look at the [Geocoding Control API reference](https://docs.maptiler.com/sdk-js/modules/geocoding/api/api-reference/) to learn more about the control options and events.

    ![Display a geocoding control in a map using React JS with Material UI](https://docs.maptiler.com/react/sdk-js/geocoding-control/final_map.png)


### Full code to download

We have created a repository with the result of this tutorial that will serve as a basis to build future applications. You can access the repository at ![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[Maps in React](https://github.com/maptiler/maps-in-react/tree/E4-geocoding).

## Next episode

Continue to [Episode 5: 3D Map in React js with geocoding control](https://docs.maptiler.com/react/sdk-js/3d-map/) to learn how to a 3D terrain map in your React JS map using the MapTiler SDK JS.

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

[![3D Map in React js with geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**3D Terrain Map** Example\\
In this step-by-step tutorial, you’ll learn how to create a 3D terrain map with a geocoding control in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/3d-map/)

##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Next episode](https://docs.maptiler.com/react/sdk-js/geocoding-control/#next-episode)
- [Related examples](https://docs.maptiler.com/react/sdk-js/geocoding-control/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

React


MapTiler SDK JS


Map in React js with geocoding control

Geocoding control - React

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)