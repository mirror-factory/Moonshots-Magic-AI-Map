# Map usage: Sessions vs requests

MapTiler offers two models of measuring map traffic: **map sessions** and **tile requests**. Each [pricing plan](https://www.maptiler.com/cloud/pricing/) including the free one defines a monthly limit on sessions and requests. When you hit either of these two limits, you get charged extra (on a paid plan) or your maps get suspended for the rest of the month (on a free plan).

To see which plan you're on and how many sessions and requests you get, go to your [Account settings](https://cloud.maptiler.com/account/settings). To check your current usage stats, see the [Analytics](https://cloud.maptiler.com/account/analytics) page.

## Tile requests

A tile request counts each individual request for map tiles. When the user is moving around the map and zooming in and out, the map application needs to load more [map tiles](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/) (pieces of the map) to show the required areas or details. This happens by requesting new tiles via an API call, and each of these API calls counts as a tile request. To see how exactly it works, check out our interactive [**tile request counter**](https://www.maptiler.com/cloud/requests/).

Request types and how they're counted


This table lists all API requests, including tile requests and other types, and how they're counted against [your API quota](https://cloud.maptiler.com/account/).

| **Type** | **Requests** |
| --- | --- |
| TileJSONs, Style JSONs, Fonts, Viewers, XMLs | Free |
| Vector tile | 1 |
| Rendered raster 512x512px tile including HiDPI/retina | 4 |
| Rendered raster 256x256px tile including HiDPI/retina | 1 |
| Single tile served from .mbtiles | 1 |
| Static maps API image | 15 |
| Vector data (GeoJSON) | 1 |
| Geocoding<br>_Batch geocoding: per each query in a batch_ \* | 1 |
| Elevation<br>_Batch elevation retrieval: per each query in a batch_ \* | 1 |
| Coordinates conversion<br>_Batch conversion: per each query in a batch_ \* | 1 |
| Export | 50× |

\\* _If a single API request contains multiple queries, each counts separately. For example, a batch of 20 queries counts as 20 requests, even though it’s technically one API call._

## Map sessions

A map session, sometimes also called **map load**, starts when a user opens a webpage with your map. Then the user can interact with the map, zoom, pan, change map theme, and it counts as a single map session. A new session starts either when the user reloads the page (with F5, Ctrl+R, Reload button), or after **6 hours** of a single session running.

Map sessions are generally much easier to estimate: One session equals one page view, so it’s easy to check your web analytics and estimate map traffic costs. Sessions also tend to be more cost-effective than tile requests, because a single map session typically includes many tile requests: a few tiles to load the initial map view, and then additional tiles as needed when the user interacts with the map.

## Comparison

|  | **Map sessions** | **Tile requests** |
| --- | --- | --- |
| **What’s measured** | Map (re)load on a web page | Each individual API call for a map tile |
| **Duration** | Until page refresh (F5, Ctrl+R) or up to 6 hours | N/A (usage is per request) |
| **Availability** | Only with MapTiler SDK JS or MapTiler plugin for Leaflet | General availability with MapTiler API |
| **Benefits** | Much easier to calculate and predict | More granular |
| **Best use case** | Applications with heavy user interaction per map view | Many map page views with little user interaction |

## Are you using sessions or requests?

Each of your maps can be measured differently, per session or per request; there’s no global setting for the model used. So which one applies? That depends on implementation:

- If a map is implemented with [MapTiler SDK JS](https://docs.maptiler.com/sdk-js/) (or the [MapTiler plugin for the Leaflet library](https://github.com/maptiler/leaflet-maptilersdk) which also uses the MapTiler SDK), then the map traffic is by default tracked **by session**. For special use cases where it makes sense, you can optionally [switch to requests](https://docs.maptiler.com/guides/maps-apis/maps-platform/tile-requests-and-map-sessions-compared/#switch).

- If you built your map using [MapTiler API](https://docs.maptiler.com/cloud/api/) combined with 3rd party clients and libraries, then the traffic is tracked **by request**. Switching to sessions is not technically possible in this case.


## Switching to requests in MapTiler SDK

If you’re using [**MapTiler SDK JS**](https://docs.maptiler.com/sdk-js/), you can optionally switch from map sessions to tile requests. This might be the preferred way to track your map usage in special cases where you expect many map views with little interaction. For example, you’re building a holiday booking app in which users browse many pages to see available options, but they don’t interact with the maps on those pages.

Switching from sessions to requests is done per map. Use the map config option [session](https://docs.maptiler.com/sdk-js/api/config/#session) and add this line to the code of each map which you want tracked per request: `maptilersdk.config.session = false`

See where it fits in the code


Here are some examples of a map configured to use requests instead of sessions. We've included just the body part of a fullscreen web app code to show you where the config belongs.

A map implemented with [MapTiler SDK JS](https://docs.maptiler.com/sdk-js/):

```html
<body>
<div id="map"></div>
<script>
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
  maptilersdk.config.session = false;
  const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [16.62662018, 49.2125578],
    zoom: 14
  });
</script>
</body>
```

HTML

Copy

A map implemented with [MapTiler plugin for the Leaflet library](https://github.com/maptiler/leaflet-maptilersdk):

```html
<body>
<script>
    const key = 'key';
    maptilersdk.config.session = false;
    const map = L.map('map').setView([0, 0], 1);
    const mtLayer = L.maptiler.maptilerLayer({
      apiKey: key,
      style: L.maptiler.MapStyle.STREETS,
    }).addTo(map);
</script>
</body>
```

HTML

Copy

## Useful links

- [Tile request counter](https://www.maptiler.com/cloud/requests/)
- [MapTiler pricing](https://www.maptiler.com/cloud/pricing/)
- [How to use your traffic analytics](https://docs.maptiler.com/guides/maps-apis/maps-platform/usage-analytics-for-sessions-and-requests/)
- [How to control your expenses](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-control-expenses-in-your-user-account)
- [SDK JS reference: sessions config](https://docs.maptiler.com/sdk-js/api/config/#session)

On this page

- [Tile requests](https://docs.maptiler.com/guides/maps-apis/maps-platform/tile-requests-and-map-sessions-compared/#tile-requests)
- [Map sessions](https://docs.maptiler.com/guides/maps-apis/maps-platform/tile-requests-and-map-sessions-compared/#map-sessions)
- [Comparison](https://docs.maptiler.com/guides/maps-apis/maps-platform/tile-requests-and-map-sessions-compared/#comparison)
- [Are you using sessions or requests?](https://docs.maptiler.com/guides/maps-apis/maps-platform/tile-requests-and-map-sessions-compared/#are-you-using-sessions-or-requests)
- [Switching to requests in MapTiler SDK](https://docs.maptiler.com/guides/maps-apis/maps-platform/tile-requests-and-map-sessions-compared/#switching-to-requests-in-maptiler-sdk)
- [Useful links](https://docs.maptiler.com/guides/maps-apis/maps-platform/tile-requests-and-map-sessions-compared/#useful-links)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

Maps platform guides


Map usage: Sessions vs requests

Sessions vs requests

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)