# MapTiler SDK JS geocoding component how to search places using React JS

This tutorial shows how to search for places using the [Geocoding control](https://www.npmjs.com/package/@maptiler/geocoding-control). The geocoder component facilitates the use of the [MapTiler Geocoding API](https://www.maptiler.com/cloud/geocoding/).

![Display Geocoding control using React JS](https://docs.maptiler.com/react/sdk-js/geocoding-component/final_map_geocoding.png)

1. Follow the [React JS with MapTiler maps](https://docs.maptiler.com/react/) tutorial to create a simple fullscreen map application. You **do not need** to add the marker to the map.

2. Install the Geocoding control module







```bash
npm install --save @maptiler/geocoding-control
```





Bash



Copy

3. Import the Geocoding control and the required React functions. Add these lines on top of `map.jsx` file.



```jsx

```





React JSX



Copy

4. Create the mapController state



```jsx

```





React JSX



Copy

5. Set the mapController. Use the current MapTiler SDK map.



```jsx

```





React JSX



Copy

6. Add the `GeocodingControl` component to the map.



```jsx

```





React JSX



Copy

7. We’ll need a simple style to correctly render the Geocoding control on the map. Add the following to the end of the `map.css` file.







```css
.geocoding {
     position: absolute;
     top: 10px;
     left: 10px;
}
```





CSS



Copy


We are finished, your `map.jsx` file should look like this:

```jsx

```

React JSX

Copy

your `map.ccs` file should look like this:

```css

```

CSS

Copy

The library also has types defined to be used in **TypeScript**.

```jsx
import type { MapController } from "@maptiler/geocoding-control/types";
...
...
...
const [mapController, setMapController] = useState<MapController>();
```

React JSX

Copy

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[MapTiler Geocoding control on GitHub](https://github.com/maptiler/maptiler-geocoding-control)

## Learn more

Visit the [MapTiler Geocoding API reference](https://docs.maptiler.com/cloud/api/geocoding/) for all search options. For example specifying the language of the results, etc.

## Related examples

[![React JS with MapTiler maps](https://docs.maptiler.com/assets/img/example-card.png)**Learn the basics - React** Example\\
In this step-by-step tutorial, you’ll learn how to create a React JS component to render a map using MapTiler SDK JS.](https://docs.maptiler.com/react/)

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

[![3D Map in React js with geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**3D Terrain Map** Example\\
In this step-by-step tutorial, you’ll learn how to create a 3D terrain map with a geocoding control in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/3d-map/)

##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Learn more](https://docs.maptiler.com/react/sdk-js/geocoding-component/#learn-more)
- [Related examples](https://docs.maptiler.com/react/sdk-js/geocoding-component/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

React


MapTiler SDK JS


MapTiler SDK JS geocoding component how to search places using React JS

Geocoding component - React

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)