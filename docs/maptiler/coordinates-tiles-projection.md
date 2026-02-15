---
title: "Tiles à la Google Maps: Coordinates, Tile Bounds and Projection | Guides | General | MapTiler"
source: "https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection"
description: "How does a zoomable map work? Coordinate systems and map projections, transform the shape of Earth into usable flat online maps."
---

# Tiles à la Google Maps

## Coordinates, Tile Bounds and Projection

Learn how zoomable maps works, what coordinate systems are, and how to convert between them.

![Pyramid](https://media.maptiler.com/old/img/tools/pyramid.png)

TIP: Click on the map to get details for a tile!

+–

⇧

i

- [© MapTiler](https://www.maptiler.com/copyright/) [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

⤢

256x256px512x512px

## How does a zoomable map work?

People have been using coordinate systems and map projections to transform the shape of Earth into usable flat maps for centuries.

A map of the entire world is too big to be directly displayed on a computer. Therefore, there is a clever mechanism for quick browsing and zooming on maps: the map tiles.

The world is divided into small squares, each with a fixed geographic area and scale. This clever trick allows you to browse just a small part of the planet without loading the whole map - and you still get an illusion of exploring
a single huge document.

## Spherical Mercator

### Pioneered by Google, now standardized.

Google Maps was one of the first systems for displaying dynamic maps on the web. They chose a Spherical Mercator projection because it preserves shape and angles. The entire world looks like a square, making it easy to work with on a computer.

Almost every open source (e.g., OpenStreetMap) and commercial Maps API provider (e.g., MapTiler) are now using this projection and tiling profile. The tiles are therefore compatible with each other.


![spherical mercator graph](https://media.maptiler.com/old/img/tools/mercator-epsg-img.png)

## Convert coordinates for using global map tiles

![Map of Earth](https://media.maptiler.com/old/img/tools/earth.png)

### **Degrees** Geodetic coordinates WGS84 (EPSG:4326)

**Longitude and latitude** coordinates are used by GPS devices for defining position on Earth using World Geodetic System defined in 1984 (WGS84).

_HINT: WGS84 geodetic datum specifies lon/lat (lambda/phi) coordinates on defined ellipsoid shape with defined origin (\[0,0\] on a prime meridian)._

![World displayed using mercator projection](https://media.maptiler.com/old/img/tools/world.png)

### **Meters** Projected coordinates Spherical Mercator (EPSG:3857)

**Global projected coordinates** in meters for the entire planet. Used for raster tile generation in GIS and WM(T)S services.

_HINT: Simpler spherical calculations are used instead of ellipsoidal. Mercator map projection deforms size (Greenland vs. Africa) and never shows poles._

![Pyramid with explanation of resolution and zoom levels](https://media.maptiler.com/old/img/tools/pyramid2.png)

### **Pixels** Screen coordinates XY pixels at zoom

Zoom-specific **pixel coordinates** for each level of the pyramid. Top level (zoom=0) has usually 256x256 pixels, next level 512x512, etc.

_Devices calculate pixel coordinates at defined zoom level and determine visible viewport for an area which should be loaded from servers._

![map tiles graph](https://media.maptiler.com/old/img/tools/mercator2.png)

### **Tiles** Tile coordinates Tile Map Service (ZXY)

Coordinates of a **tile in the pyramid.** There is one tile on the top of the pyramid, then 4 tiles, 16 tiles, etc. All raster tiles have the same size, usually 256x256 or 512x512 pixels. [Vector tiles work a bit differently](https://docs.maptiler.com/guides/general/raster-vs-vector-map-tiles-what-is-the-difference-between-the-two-data-types).

_Only the relevant tiles are loaded and displayed for the area of interest/viewport._

![maptiler-logo](https://media.maptiler.com/old/img/logos/maptiler-icon.svg)

## MapTiler Maps API as a platform for web and mobile devs

MapTiler makes it easy to build maps for your websites and mobile apps. Choose from street & satellite maps of the entire world or create a custom map design.

The platform is suitable for developers ranging from newbies to experts.

[Use maps via API](https://cloud.maptiler.com/) [Learn more](https://docs.maptiler.com/cloud/)

## Resolution and scales

### List of resolutions and scales of a pyramid in Spherical Mercator projection

256x256px512x512px

| Zoom level | Resolution (meters / pixel) | Map Scale (at 96 dpi) | Width and Height of map (pixels) |
| --- | --- | --- | --- |
| 0 | 156,543.0339 | 1 : 591,658,710.91 | 256 |
| 1 | 78,271.517 | 1 : 295,829,355.45 | 512 |
| 2 | 39,135.7585 | 1 : 147,914,677.73 | 1,024 |
| 3 | 19,567.8792 | 1 : 73,957,338.86 | 2,048 |
| 4 | 9,783.9396 | 1 : 36,978,669.43 | 4,096 |
| 5 | 4,891.9698 | 1 : 18,489,334.72 | 8,192 |
| 6 | 2,445.9849 | 1 : 9,244,667.36 | 16,384 |
| 7 | 1,222.9925 | 1 : 4,622,333.68 | 32,768 |
| 8 | 611.4962 | 1 : 2,311,166.84 | 65,536 |
| 9 | 305.7481 | 1 : 1,155,583.42 | 131,072 |
| 10 | 152.8741 | 1 : 577,791.71 | 262,144 |
| 11 | 76.437 | 1 : 288,895.85 | 524,288 |
| 12 | 38.2185 | 1 : 144,447.93 | 1,048,576 |
| 13 | 19.1093 | 1 : 72,223.96 | 2,097,152 |
| 14 | 9.5546 | 1 : 36,111.98 | 4,194,304 |
| 15 | 4.7773 | 1 : 18,055.99 | 8,388,608 |
| 16 | 2.3887 | 1 : 9,028 | 16,777,216 |
| 17 | 1.1943 | 1 : 4,514 | 33,554,432 |
| 18 | 0.5972 | 1 : 2,257 | 67,108,864 |
| 19 | 0.2986 | 1 : 1,128.5 | 134,217,728 |
| 20 | 0.1493 | 1 : 564.25 | 268,435,456 |
| 21 | 0.0746 | 1 : 282.12 | 536,870,912 |
| 22 | 0.0373 | 1 : 141.06 | 1,073,741,824 |
| 23 | 0.0187 | 1 : 70.53 | 2,147,483,648 |

Expand


## EPSG.io - Coordinate systems worldwide

Open Source project for the visualization of all coordinate systems in the world. Convert coordinated online, get coordinates from a map in different projections, browse the coordinate database.

Look at the Spherical Mercator in [EPSG.io](https://epsg.io/).

Batch transform coordinates [via API](https://docs.maptiler.com/cloud/api/coordinates/).

![](https://media.maptiler.com/old/img/tools/epsg.svg)

Source code for utilities for conversion between tiles and coordinates

Usage: `python globalmaptiles.py [zoom] [lat] [lon]`

This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
[Learn more about bidirectional Unicode characters](https://github.co/hiddenchars)

[Show hidden characters](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/)

|     |     |
| --- | --- |
|  | #!/usr/bin/env python |
|  | ############################################################################### |
|  | \# $Id$ |
|  | # |
|  | \# Project: GDAL2Tiles, Google Summer of Code 2007 & 2008 |
|  | \# Global Map Tiles Classes |
|  | \# Purpose: Convert a raster into TMS tiles, create KML SuperOverlay EPSG:4326, |
|  | \# generate a simple HTML viewers based on Google Maps and OpenLayers |
|  | \# Author: Klokan Petr Pridal, klokan at klokan dot cz |
|  | \# Web: http://www.klokan.cz/projects/gdal2tiles/ |
|  | # |
|  | ############################################################################### |
|  | \# Copyright (c) 2008 Klokan Petr Pridal. All rights reserved. |
|  | # |
|  | \# Permission is hereby granted, free of charge, to any person obtaining a |
|  | \# copy of this software and associated documentation files (the "Software"), |
|  | \# to deal in the Software without restriction, including without limitation |
|  | \# the rights to use, copy, modify, merge, publish, distribute, sublicense, |
|  | \# and/or sell copies of the Software, and to permit persons to whom the |
|  | \# Software is furnished to do so, subject to the following conditions: |
|  | # |
|  | \# The above copyright notice and this permission notice shall be included |
|  | \# in all copies or substantial portions of the Software. |
|  | # |
|  | \# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS |
|  | \# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, |
|  | \# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL |
|  | \# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER |
|  | \# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING |
|  | \# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER |
|  | \# DEALINGS IN THE SOFTWARE. |
|  | ############################################################################### |
|  |  |
|  | """ |
|  | globalmaptiles.py |
|  |  |
|  | Global Map Tiles as defined in Tile Map Service (TMS) Profiles |
|  | ============================================================== |
|  |  |
|  | Functions necessary for generation of global tiles used on the web. |
|  | It contains classes implementing coordinate conversions for: |
|  |  |
|  | \- GlobalMercator (based on EPSG:900913 = EPSG:3785) |
|  | for Google Maps, Yahoo Maps, Microsoft Maps compatible tiles |
|  | \- GlobalGeodetic (based on EPSG:4326) |
|  | for OpenLayers Base Map and Google Earth compatible tiles |
|  |  |
|  | More info at: |
|  |  |
|  | http://wiki.osgeo.org/wiki/Tile\_Map\_Service\_Specification |
|  | http://wiki.osgeo.org/wiki/WMS\_Tiling\_Client\_Recommendation |
|  | http://msdn.microsoft.com/en-us/library/bb259689.aspx |
|  | http://code.google.com/apis/maps/documentation/overlays.html#Google\_Maps\_Coordinates |
|  |  |
|  | Created by Klokan Petr Pridal on 2008-07-03. |
|  | Google Summer of Code 2008, project GDAL2Tiles for OSGEO. |
|  |  |
|  | In case you use this class in your product, translate it to another language |
|  | or find it usefull for your project please let me know. |
|  | My email: klokan at klokan dot cz. |
|  | I would like to know where it was used. |
|  |  |
|  | Class is available under the open-source GDAL license (www.gdal.org). |
|  | """ |
|  |  |
|  | importmath |
|  |  |
|  | classGlobalMercator(object): |
|  | """ |
|  | TMS Global Mercator Profile |
|  | --------------------------- |
|  |  |
|  | Functions necessary for generation of tiles in Spherical Mercator projection, |
|  | EPSG:900913 (EPSG:gOOglE, Google Maps Global Mercator), EPSG:3785, OSGEO:41001. |
|  |  |
|  | Such tiles are compatible with Google Maps, Microsoft Virtual Earth, Yahoo Maps, |
|  | UK Ordnance Survey OpenSpace API, ... |
|  | and you can overlay them on top of base maps of those web mapping applications. |
|  |  |
|  | Pixel and tile coordinates are in TMS notation (origin \[0,0\] in bottom-left). |
|  |  |
|  | What coordinate conversions do we need for TMS Global Mercator tiles:: |
|  |  |
|  | LatLon <-> Meters <-> Pixels <-> Tile |
|  |  |
|  | WGS84 coordinates Spherical Mercator Pixels in pyramid Tiles in pyramid |
|  | lat/lon XY in metres XY pixels Z zoom XYZ from TMS |
|  | EPSG:4326 EPSG:900913 |
|  | .\-\-\-\-. \-\-\-\-\-\-\-\-\- \-\- TMS |
|  | / \ <-> \| \| <-> /----/ <-\> Google |
|  | \ / \| \| /--------/ QuadTree |
|  | \-\-\-\-\- \-\-\-\-\-\-\-\-\- /------------/ |
|  | KML, public WebMapService Web Clients TileMapService |
|  |  |
|  | What is the coordinate extent of Earth in EPSG:900913? |
|  |  |
|  | \[-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244\] |
|  | Constant 20037508.342789244 comes from the circumference of the Earth in meters, |
|  | which is 40 thousand kilometers, the coordinate origin is in the middle of extent. |
|  | In fact you can calculate the constant as: 2 \* math.pi \* 6378137 / 2.0 |
|  | $ echo 180 85 \| gdaltransform -s\_srs EPSG:4326 -t\_srs EPSG:900913 |
|  | Polar areas with abs(latitude) bigger then 85.05112878 are clipped off. |
|  |  |
|  | What are zoom level constants (pixels/meter) for pyramid with EPSG:900913? |
|  |  |
|  | whole region is on top of pyramid (zoom=0) covered by 256x256 pixels tile, |
|  | every lower zoom level resolution is always divided by two |
|  | initialResolution = 20037508.342789244 \* 2 / 256 = 156543.03392804062 |
|  |  |
|  | What is the difference between TMS and Google Maps/QuadTree tile name convention? |
|  |  |
|  | The tile raster itself is the same (equal extent, projection, pixel size), |
|  | there is just different identification of the same raster tile. |
|  | Tiles in TMS are counted from \[0,0\] in the bottom-left corner, id is XYZ. |
|  | Google placed the origin \[0,0\] to the top-left corner, reference is XYZ. |
|  | Microsoft is referencing tiles by a QuadTree name, defined on the website: |
|  | http://msdn2.microsoft.com/en-us/library/bb259689.aspx |
|  |  |
|  | The lat/lon coordinates are using WGS84 datum, yeh? |
|  |  |
|  | Yes, all lat/lon we are mentioning should use WGS84 Geodetic Datum. |
|  | Well, the web clients like Google Maps are projecting those coordinates by |
|  | Spherical Mercator, so in fact lat/lon coordinates on sphere are treated as if |
|  | the were on the WGS84 ellipsoid. |
|  |  |
|  | From MSDN documentation: |
|  | To simplify the calculations, we use the spherical form of projection, not |
|  | the ellipsoidal form. Since the projection is used only for map display, |
|  | and not for displaying numeric coordinates, we don't need the extra precision |
|  | of an ellipsoidal projection. The spherical projection causes approximately |
|  | 0.33 percent scale distortion in the Y direction, which is not visually noticable. |
|  |  |
|  | How do I create a raster in EPSG:900913 and convert coordinates with PROJ.4? |
|  |  |
|  | You can use standard GIS tools like gdalwarp, cs2cs or gdaltransform. |
|  | All of the tools supports -t\_srs 'epsg:900913'. |
|  |  |
|  | For other GIS programs check the exact definition of the projection: |
|  | More info at http://spatialreference.org/ref/user/google-projection/ |
|  | The same projection is degined as EPSG:3785. WKT definition is in the official |
|  | EPSG database. |
|  |  |
|  | Proj4 Text: |
|  | +proj=merc +a=6378137 +b=6378137 +lat\_ts=0.0 +lon\_0=0.0 +x\_0=0.0 +y\_0=0 |
|  | +k=1.0 +units=m +nadgrids=@null +no\_defs |
|  |  |
|  | Human readable WKT format of EPGS:900913: |
|  | PROJCS\["Google Maps Global Mercator", |\
|  | GEOGCS\["WGS 84", |\
|  | DATUM\["WGS\_1984", |\
|  | SPHEROID\["WGS 84",6378137,298.2572235630016, |\
|  | AUTHORITY\["EPSG","7030"\]\], |\
|  | AUTHORITY\["EPSG","6326"\]\], |\
|  | PRIMEM\["Greenwich",0\], |\
|  | UNIT\["degree",0.0174532925199433\], |\
|  | AUTHORITY\["EPSG","4326"\]\], |\
|  | PROJECTION\["Mercator\_1SP"\], |\
|  | PARAMETER\["central\_meridian",0\], |\
|  | PARAMETER\["scale\_factor",1\], |\
|  | PARAMETER\["false\_easting",0\], |\
|  | PARAMETER\["false\_northing",0\], |\
|  | UNIT\["metre",1, |\
|  | AUTHORITY\["EPSG","9001"\]\]\] |
|  | """ |
|  |  |
|  | def\_\_init\_\_(self, tileSize=256): |
|  | "Initialize the TMS Global Mercator pyramid" |
|  | self.tileSize=tileSize |
|  | self.initialResolution=2\*math.pi\*6378137/self.tileSize |
|  | \# 156543.03392804062 for tileSize 256 pixels |
|  | self.originShift=2\*math.pi\*6378137/2.0 |
|  | \# 20037508.342789244 |
|  |  |
|  | defLatLonToMeters(self, lat, lon ): |
|  | "Converts given lat/lon in WGS84 Datum to XY in Spherical Mercator EPSG:900913" |
|  |  |
|  | mx=lon\*self.originShift/180.0 |
|  | my=math.log( math.tan((90+lat) \*math.pi/360.0 )) / (math.pi/180.0) |
|  |  |
|  | my=my\*self.originShift/180.0 |
|  | returnmx, my |
|  |  |
|  | defMetersToLatLon(self, mx, my ): |
|  | "Converts XY point from Spherical Mercator EPSG:900913 to lat/lon in WGS84 Datum" |
|  |  |
|  | lon= (mx/self.originShift) \*180.0 |
|  | lat= (my/self.originShift) \*180.0 |
|  |  |
|  | lat=180/math.pi\* (2\*math.atan( math.exp( lat\*math.pi/180.0)) -math.pi/2.0) |
|  | returnlat, lon |
|  |  |
|  | defPixelsToMeters(self, px, py, zoom): |
|  | "Converts pixel coordinates in given zoom level of pyramid to EPSG:900913" |
|  |  |
|  | res=self.Resolution( zoom ) |
|  | mx=px\*res-self.originShift |
|  | my=py\*res-self.originShift |
|  | returnmx, my |
|  |  |
|  | defMetersToPixels(self, mx, my, zoom): |
|  | "Converts EPSG:900913 to pyramid pixel coordinates in given zoom level" |
|  |  |
|  | res=self.Resolution( zoom ) |
|  | px= (mx+self.originShift) /res |
|  | py= (my+self.originShift) /res |
|  | returnpx, py |
|  |  |
|  | defPixelsToTile(self, px, py): |
|  | "Returns a tile covering region in given pixel coordinates" |
|  |  |
|  | tx=int( math.ceil( px/float(self.tileSize) ) -1 ) |
|  | ty=int( math.ceil( py/float(self.tileSize) ) -1 ) |
|  | returntx, ty |
|  |  |
|  | defPixelsToRaster(self, px, py, zoom): |
|  | "Move the origin of pixel coordinates to top-left corner" |
|  |  |
|  | mapSize=self.tileSize<<zoom |
|  | returnpx, mapSize-py |
|  |  |
|  | defMetersToTile(self, mx, my, zoom): |
|  | "Returns tile for given mercator coordinates" |
|  |  |
|  | px, py=self.MetersToPixels( mx, my, zoom) |
|  | returnself.PixelsToTile( px, py) |
|  |  |
|  | defTileBounds(self, tx, ty, zoom): |
|  | "Returns bounds of the given tile in EPSG:900913 coordinates" |
|  |  |
|  | minx, miny=self.PixelsToMeters( tx\*self.tileSize, ty\*self.tileSize, zoom ) |
|  | maxx, maxy=self.PixelsToMeters( (tx+1)\*self.tileSize, (ty+1)\*self.tileSize, zoom ) |
|  | return ( minx, miny, maxx, maxy ) |
|  |  |
|  | defTileLatLonBounds(self, tx, ty, zoom ): |
|  | "Returns bounds of the given tile in latutude/longitude using WGS84 datum" |
|  |  |
|  | bounds=self.TileBounds( tx, ty, zoom) |
|  | minLat, minLon=self.MetersToLatLon(bounds\[0\], bounds\[1\]) |
|  | maxLat, maxLon=self.MetersToLatLon(bounds\[2\], bounds\[3\]) |
|  |  |
|  | return ( minLat, minLon, maxLat, maxLon ) |
|  |  |
|  | defResolution(self, zoom ): |
|  | "Resolution (meters/pixel) for given zoom level (measured at Equator)" |
|  |  |
|  | \# return (2 \* math.pi \* 6378137) / (self.tileSize \* 2\*\*zoom) |
|  | returnself.initialResolution/ (2\*\*zoom) |
|  |  |
|  | defZoomForPixelSize(self, pixelSize ): |
|  | "Maximal scaledown zoom of the pyramid closest to the pixelSize." |
|  |  |
|  | foriinrange(30): |
|  | ifpixelSize>self.Resolution(i): |
|  | returni-1ifi!=0else0\# We don't want to scale up |
|  |  |
|  | defGoogleTile(self, tx, ty, zoom): |
|  | "Converts TMS tile coordinates to Google Tile coordinates" |
|  |  |
|  | \# coordinate origin is moved from bottom-left to top-left corner of the extent |
|  | returntx, (2\*\*zoom-1) -ty |
|  |  |
|  | defQuadTree(self, tx, ty, zoom ): |
|  | "Converts TMS tile coordinates to Microsoft QuadTree" |
|  |  |
|  | quadKey="" |
|  | ty= (2\*\*zoom-1) -ty |
|  | foriinrange(zoom, 0, -1): |
|  | digit=0 |
|  | mask=1<< (i-1) |
|  | if (tx&mask) !=0: |
|  | digit+=1 |
|  | if (ty&mask) !=0: |
|  | digit+=2 |
|  | quadKey+=str(digit) |
|  |  |
|  | returnquadKey |
|  |  |
|  | #--------------------- |
|  |  |
|  | classGlobalGeodetic(object): |
|  | """ |
|  | TMS Global Geodetic Profile |
|  | --------------------------- |
|  |  |
|  | Functions necessary for generation of global tiles in Plate Carre projection, |
|  | EPSG:4326, "unprojected profile". |
|  |  |
|  | Such tiles are compatible with Google Earth (as any other EPSG:4326 rasters) |
|  | and you can overlay the tiles on top of OpenLayers base map. |
|  |  |
|  | Pixel and tile coordinates are in TMS notation (origin \[0,0\] in bottom-left). |
|  |  |
|  | What coordinate conversions do we need for TMS Global Geodetic tiles? |
|  |  |
|  | Global Geodetic tiles are using geodetic coordinates (latitude,longitude) |
|  | directly as planar coordinates XY (it is also called Unprojected or Plate |
|  | Carre). We need only scaling to pixel pyramid and cutting to tiles. |
|  | Pyramid has on top level two tiles, so it is not square but rectangle. |
|  | Area \[-180,-90,180,90\] is scaled to 512x256 pixels. |
|  | TMS has coordinate origin (for pixels and tiles) in bottom-left corner. |
|  | Rasters are in EPSG:4326 and therefore are compatible with Google Earth. |
|  |  |
|  | LatLon <-> Pixels <-> Tiles |
|  |  |
|  | WGS84 coordinates Pixels in pyramid Tiles in pyramid |
|  | lat/lon XY pixels Z zoom XYZ from TMS |
|  | EPSG:4326 |
|  | .\-\-\-\-. \-\-\-\- |
|  | / \ <-> /--------/ <-\> TMS |
|  | \ / /--------------/ |
|  | \-\-\-\-\- /--------------------/ |
|  | WMS, KML Web Clients, Google Earth TileMapService |
|  | """ |
|  |  |
|  | def\_\_init\_\_(self, tileSize=256): |
|  | self.tileSize=tileSize |
|  |  |
|  | defLatLonToPixels(self, lat, lon, zoom): |
|  | "Converts lat/lon to pixel coordinates in given zoom of the EPSG:4326 pyramid" |
|  |  |
|  | res=180/256.0/2\*\*zoom |
|  | px= (180+lat) /res |
|  | py= (90+lon) /res |
|  | returnpx, py |
|  |  |
|  | defPixelsToTile(self, px, py): |
|  | "Returns coordinates of the tile covering region in pixel coordinates" |
|  |  |
|  | tx=int( math.ceil( px/float(self.tileSize) ) -1 ) |
|  | ty=int( math.ceil( py/float(self.tileSize) ) -1 ) |
|  | returntx, ty |
|  |  |
|  | defResolution(self, zoom ): |
|  | "Resolution (arc/pixel) for given zoom level (measured at Equator)" |
|  |  |
|  | return180/256.0/2\*\*zoom |
|  | #return 180 / float( 1 << (8+zoom) ) |
|  |  |
|  | defTileBounds(tx, ty, zoom): |
|  | "Returns bounds of the given tile" |
|  | res=180/256.0/2\*\*zoom |
|  | return ( |
|  | tx\*256\*res-180, |
|  | ty\*256\*res-90, |
|  | (tx+1)\*256\*res-180, |
|  | (ty+1)\*256\*res-90 |
|  | ) |
|  |  |
|  | if\_\_name\_\_=="\_\_main\_\_": |
|  | importsys, os |
|  |  |
|  | defUsage(s=""): |
|  | print"Usage: globalmaptiles.py \[-profile 'mercator'\|'geodetic'\] zoomlevel lat lon \[latmax lonmax\]" |
|  | print |
|  | ifs: |
|  | prints |
|  | print |
|  | print"This utility prints for given WGS84 lat/lon coordinates (or bounding box) the list of tiles" |
|  | print"covering specified area. Tiles are in the given 'profile' (default is Google Maps 'mercator')" |
|  | print"and in the given pyramid 'zoomlevel'." |
|  | print"For each tile several information is printed including bonding box in EPSG:900913 and WGS84." |
|  | sys.exit(1) |
|  |  |
|  | profile='mercator' |
|  | zoomlevel=None |
|  | lat, lon, latmax, lonmax=None, None, None, None |
|  | boundingbox=False |
|  |  |
|  | argv=sys.argv |
|  | i=1 |
|  | whilei<len(argv): |
|  | arg=argv\[i\] |
|  |  |
|  | ifarg=='-profile': |
|  | i=i+1 |
|  | profile=argv\[i\] |
|  |  |
|  | ifzoomlevelisNone: |
|  | zoomlevel=int(argv\[i\]) |
|  | eliflatisNone: |
|  | lat=float(argv\[i\]) |
|  | eliflonisNone: |
|  | lon=float(argv\[i\]) |
|  | eliflatmaxisNone: |
|  | latmax=float(argv\[i\]) |
|  | eliflonmaxisNone: |
|  | lonmax=float(argv\[i\]) |
|  | else: |
|  | Usage("ERROR: Too many parameters") |
|  |  |
|  | i=i+1 |
|  |  |
|  | ifprofile!='mercator': |
|  | Usage("ERROR: Sorry, given profile is not implemented yet.") |
|  |  |
|  | ifzoomlevel==Noneorlat==Noneorlon==None: |
|  | Usage("ERROR: Specify at least 'zoomlevel', 'lat' and 'lon'.") |
|  | iflatmaxisnotNoneandlonmaxisNone: |
|  | Usage("ERROR: Both 'latmax' and 'lonmax' must be given.") |
|  |  |
|  | iflatmax!=Noneandlonmax!=None: |
|  | iflatmax<lat: |
|  | Usage("ERROR: 'latmax' must be bigger then 'lat'") |
|  | iflonmax<lon: |
|  | Usage("ERROR: 'lonmax' must be bigger then 'lon'") |
|  | boundingbox= (lon, lat, lonmax, latmax) |
|  |  |
|  | tz=zoomlevel |
|  | mercator=GlobalMercator() |
|  |  |
|  | mx, my=mercator.LatLonToMeters( lat, lon ) |
|  | print"Spherical Mercator (ESPG:900913) coordinates for lat/lon: " |
|  | print (mx, my) |
|  | tminx, tminy=mercator.MetersToTile( mx, my, tz ) |
|  |  |
|  | ifboundingbox: |
|  | mx, my=mercator.LatLonToMeters( latmax, lonmax ) |
|  | print"Spherical Mercator (ESPG:900913) cooridnate for maxlat/maxlon: " |
|  | print (mx, my) |
|  | tmaxx, tmaxy=mercator.MetersToTile( mx, my, tz ) |
|  | else: |
|  | tmaxx, tmaxy=tminx, tminy |
|  |  |
|  | fortyinrange(tminy, tmaxy+1): |
|  | fortxinrange(tminx, tmaxx+1): |
|  | tilefilename="%s/%s/%s"% (tz, tx, ty) |
|  | printtilefilename, "( TileMapService: z / x / y )" |
|  |  |
|  | gx, gy=mercator.GoogleTile(tx, ty, tz) |
|  | print"\\tGoogle:", gx, gy |
|  | quadkey=mercator.QuadTree(tx, ty, tz) |
|  | print"\\tQuadkey:", quadkey, '(',int(quadkey, 4),')' |
|  | bounds=mercator.TileBounds( tx, ty, tz) |
|  | print |
|  | print"\\tEPSG:900913 Extent: ", bounds |
|  | wgsbounds=mercator.TileLatLonBounds( tx, ty, tz) |
|  | print"\\tWGS84 Extent:", wgsbounds |
|  | print"\\tgdalwarp -ts 256 256 -te %s %s %s %s %s %s\_%s\_%s.tif"% ( |
|  | bounds\[0\], bounds\[1\], bounds\[2\], bounds\[3\], "<your-raster-file-in-epsg900913.ext>", tz, tx, ty) |
|  | print |

[view raw](https://gist.github.com/maptiler/fddb5ce33ba995d5523de9afdf8ef118/raw/d7565390d2480bfed3c439df5826f1d9e4b41761/globalmaptiles.py) [globalmaptiles.py](https://gist.github.com/maptiler/fddb5ce33ba995d5523de9afdf8ef118#file-globalmaptiles-py)
hosted with ❤ by [GitHub](https://github.com/)

Other people ported this code to additional programming languages

[JavaScript](https://github.com/datalyze-solutions/globalmaptiles/blob/master/globalmaptiles.js) \|
[CSharp](https://github.com/AliFlux/VectorTileRenderer/blob/master/VectorTileRenderer/GlobalMercator.cs) \|
[PHP](https://github.com/Tetramatrix/monstercurves/blob/master/GlobalMapTiles.php) \|
[Java](https://github.com/scaleset/scaleset-geo/blob/master/src/main/java/com/scaleset/geo/math/GoogleMapsTileMath.java) \|
[Ruby](https://github.com/x4d3/global_map_tiles/blob/master/lib/global_map_tiles/global_mercator.rb)

## Try MapTiler now!

Free account for personal use and evaluation.

API documentation for developers.

[Start for free](https://cloud.maptiler.com/)

On this page

- [Coordinates, Tile Bounds and Projection](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/#Coordinates,_Tile_Bounds_and_Projection)
- [How does a zoomable map work?](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/#How_does_a_zoomable_map_work?)
- [Spherical Mercator](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/#Spherical_Mercator)
- [Convert coordinates for using global map tiles](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/#Convert_coordinates_for_using_global_map_tiles)
- [MapTiler Maps API as a platform for web and mobile devs](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/#MapTiler_Maps_API_as_a_platform_for_web_and_mobile_devs)
- [Resolution and scales](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/#resolution-and-scales)
- [EPSG.io - Coordinate systems worldwide](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/#EPSG.io_-_Coordinate_systems_worldwide)
- [Try MapTiler now!](https://docs.maptiler.com/google-maps-coordinates-tile-bounds-projection/#Try_MapTiler_now!)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

General guides


Tiles à la Google Maps: Coordinates, Tile Bounds and Projection

Tiles à la Google Maps

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)