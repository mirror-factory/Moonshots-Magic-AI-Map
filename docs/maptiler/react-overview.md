# React JS with MapTiler maps

In this step-by-step tutorial, you’ll learn how to create a React JS component that leverages the power of MapTiler SDK JS mapping library to render maps. Together we will build a simple full-screen map application, serving as a practical example of how to seamlessly integrate MapTiler maps into your own React app.

By the end of this tutorial, you will be able to create a full-screen map with a marker placed at a specified location. With your newfound knowledge, you will be able to create visually stunning maps within your React projects. Take a sneak peek at the final output of this tutorial below:

![Display MapTiler SDK JS map using React JS](https://docs.maptiler.com/react/sdk-js/how-to-use-sdk-js/final_map.png)

## Getting started

_Minimal requirements for completing this tutorial._

- **Basic React JS knowledge.** You don’t need a lot of experience using [React](https://reactjs.org/) for this tutorial, but you should be familiar with basic concepts and workflow.

- **MapTiler API key.** Your MapTiler account access key is on your MapTiler [Cloud](https://cloud.maptiler.com/account/keys) account page or [Get API key for FREE](https://cloud.maptiler.com/account/keys).

- **MapTiler SDK JS.** JavaScript library for building web maps. In this tutorial, you will learn how to install it.

- **Node.js and npm.** Necessary to run your React app locally. [Node.js](https://nodejs.org/en/)


## Create an app

In this step, we are going to learn how to create a React app.

To create a new react project run in your command-line:

```bash
npm create vite my-react-map -- --template react
```

Bash

Copy

`create vite` will create a simple one-page application in React. For more information follow [Scaffolding Your First Vite Project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

Navigate to the newly created project folder `my-react-map`

```bash
cd my-react-map
```

Bash

Copy

Inside the newly created project, run `npm install` to install the dependencies.

To start your local environment, run `npm run dev`. You will find your app running on the address `http://localhost:5173/`.

Now you should see the app in your browser.

![Vite + React app](https://docs.maptiler.com/react/sdk-js/how-to-use-sdk-js/vite.png)

### Installation and setting up

To install MapTiler SDK JS library, navigate to your project folder and run the command:

```bash
npm i @maptiler/sdk
```

Bash

Copy

Navigate to the `src` folder and delete all the contents of the `index.css` file.

Navigate to the `src` folder and replace all the contents of the `App.css` file with the following lines:

```css
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
  monospace;
}
```

CSS

Copy

Replace all the contents of the `App.jsx` file with the following lines:

```jsx
import './App.css';

function App() {
  return (
    <div className="App">
    This is my map App
    </div>
  );
}

export default App;
```

React JSX

Copy

Now you should see “This is my map App“ in your browser.

### Create a navbar component

In this step, we will create a simple heading navbar component.

Create a new folder called `components` inside the `src` folder.

Create a new file called `navbar.jsx` inside the `components` folder and write these lines:

```jsx
import React from 'react';
import './navbar.css';

export default function Navbar(){
  return (
    <div className="heading">
    <h1>This is my map App</h1>
    </div>
  );
}
```

React JSX

Copy

Create a new file called `navbar.css` inside the `components` folder and write these lines:

```css
.heading {
  margin: 0;
  padding: 0px;
  background-color: black;
  color: white;
  text-align: center;
}

.heading > h1 {
  padding: 20px;
  margin: 0;
}
```

CSS

Copy

Finally, to display the `Navbar` we need to import the Navbar component and add it to our main component `App.jsx`.

Import the navbar component into `App.jsx` write the following line at the beginning of the file

```jsx
import Navbar from './components/navbar.jsx';
```

React JSX

Copy

Replace the text _This is my map App_ with `<Navbar />`. Your `App.jsx` file should look like this:

```jsx

```

React JSX

Copy

Now you should see the black navbar at the top of your browser.

![App navigation bar](https://docs.maptiler.com/react/sdk-js/how-to-use-sdk-js/navbar.png)

### Create a map component

In this step, we will create a simple map component.

Create a new file called `map.jsx` inside the `components` folder.

First, we’ll import MapTiler SDK JS and the required React functions. Add these lines on top of `map.jsx` file.

```jsx

```

React JSX

Copy

Now we will create a function as our map component.

```jsx

```

React JSX

Copy

And set up your map’s default state.

```jsx

```

React JSX

Copy

The state stores the map object, its container. Longitude, latitude, and zoom for the map will all change as your user interacts with the map.

Replace `YOUR_MAPTILER_API_KEY_HERE` with [your own API key](https://cloud.maptiler.com/account/keys/). Make sure to [protect the key](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key/) before you publish it!

In the next step, we will initialize the map in the `Map()` function.

```jsx

```

React JSX

Copy

This code will be right after the component is inserted into the DOM tree. We initialize the map using React effect hook and we also set up some basic options of the map:

1. The `container` option sets the DOM element in which will the map be rendered. We will assign the `ref` our component expects to an HTML element, which will act as a container, later in this tutorial.

2. The `style` option defines what style is the map going to use.

3. The `center` and `zoom` options set the starting position of the map.


Now, we will add the `return` statement to your `Map()` function. Add the following code to your component above the closing curly brace of `Map()`:

```jsx

```

React JSX

Copy

The `ref={mapContainer}` specifies that App should be drawn to the HTML page in the `<div>` element.

We are finished with our basic map component, your `map.jsx` file should look like this:

```jsx

```

React JSX

Copy

Now we will need simple styling to render the map correctly. Create a file named `map.css` in `components` folder for the map component style and write the following code to your `map.css` file:

```css
.map-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
```

CSS

Copy

We use `position: absolute` on the map itself and `position: relative` on the wrap around the map for more possibilities in future styling.

### Render a map

Now we will import the map component into your app, add the following line to the top of the `App.jsx`.

```jsx
import Map from './components/map.jsx';
```

React JSX

Copy

And then, add the imported `<Map/>` component in your `App()` function. Your `App.jsx` file should then look like this:

```jsx

```

React JSX

Copy

With everything done up until now, you should be able see your beautiful map in your browser.

![Full-screen map](https://docs.maptiler.com/react/sdk-js/how-to-use-sdk-js/map.png)

### Map marker

Another basic thing to add to your map could be a [marker](https://docs.maptiler.com/sdk-js/api/markers/#marker) of some location.

In the next line where we declare the navigation control we add these lines:

```jsx

```

React JSX

Copy

We create a new marker using the `.marker` function. We added the color option to make it red, then set Lng/Lat of the marker using `.setLngLat()` function , and finally added it to the current map using `.addTo()` function.

We are finished with our basic map objects, your `map.js` file should look like this:

```jsx

```

React JSX

Copy

![Display MapTiler SDK JS map using React JS](https://docs.maptiler.com/react/sdk-js/how-to-use-sdk-js/final_map.png)

## What’s next

To enhance your map app, check out our **series on maps in React**. In the episodes, you’ll learn how to add popups, a visualization switcher, geocoding control, 3D terrain, and a sidebar:

1. [Build a map app with Material UI](https://docs.maptiler.com/react/sdk-js/get-started-material-ui/)
2. [Add points from GeoJSON](https://docs.maptiler.com/react/sdk-js/geojson-points/)
3. [Create a heatmap](https://docs.maptiler.com/react/sdk-js/heatmap/)
4. [Add popups and sidebar](https://docs.maptiler.com/react/sdk-js/popup-sidebar/)
5. [Add place search (geocoding control) to a map](https://docs.maptiler.com/react/sdk-js/geocoding-control/)
6. [Create a 3D terrain map with place search](https://docs.maptiler.com/react/sdk-js/geocoding-control/)

Also, you can check [more than 200 SDK JS examples](https://docs.maptiler.com/sdk-js/examples/) to see the limitless possibilities of MapTiler SDK JS and unlock the full potential of your React applications. It offers easy terrain, built-in styles, language switching, geocoding, TypeScript power, optional IP geolocation, etc.

## Useful links

- [MapTiler SDK JS API](https://docs.maptiler.com/sdk-js/)
- [NPM - MapTiler SDK JS](https://www.npmjs.com/package/@maptiler/sdk)
- [Vite - Getting Started](https://vitejs.dev/guide/)
- [MapTiler - Map Designer](https://www.maptiler.com/cloud/customize/)

## Related examples

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

[![3D Map in React js with geocoding control](https://docs.maptiler.com/assets/img/example-card.png)**3D Terrain Map** Example\\
In this step-by-step tutorial, you’ll learn how to create a 3D terrain map with a geocoding control in your React JS map using the MapTiler SDK JS](https://docs.maptiler.com/react/sdk-js/3d-map/)

##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Getting started](https://docs.maptiler.com/react/#getting-started)
- [Create an app](https://docs.maptiler.com/react/#create-an-app)
- [What’s next](https://docs.maptiler.com/react/#whats-next)
- [Useful links](https://docs.maptiler.com/react/#useful-links)
- [Related examples](https://docs.maptiler.com/react/#related-examples)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

React JS with MapTiler maps

Learn the basics - React

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)