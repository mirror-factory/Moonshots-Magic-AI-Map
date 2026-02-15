# MapLibre GL JS geocoding control how to search places using React JS

This tutorial shows how to search for places using the [Geocoding control](https://www.npmjs.com/package/@maptiler/geocoding-control). The geocoder component facilitates the use of the [MapTiler Geocoding API](https://www.maptiler.com/cloud/geocoding/).

![Display Geocoding control using React JS](https://docs.maptiler.com/react/maplibre-gl-js/geocoding-control/final_map_geocoding.png)

1. Follow the [How to display MapLibre GL JS map using React JS](https://docs.maptiler.com/react/maplibre-gl-js/how-to-use-maplibre-gl-js/) tutorial to create a simple fullscreen map application. You **do not need** to add the marker to the map.

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

5. Set the mapController. Use the current MapLibre map.



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

On this page

- [Learn more](https://docs.maptiler.com/react/maplibre-gl-js/geocoding-control/#learn-more)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

React


MapLibre GL


MapLibre GL JS geocoding control how to search places using React JS

Geocoding control - React

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)