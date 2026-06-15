# ArcGIS JavaScript SDK samples

Connect the ArcGIS Maps SDK for JavaScript to Nearmap imagery using the Nearmap Tile, WMS, and WMTS APIs.

## Timeline and Panorama sample

[Nearmap ArcGIS Timeline and Panorama.html](<Nearmap ArcGIS Timeline and Panorama.html>) shows Nearmap vertical and panorama (oblique) imagery across multiple survey dates, similar to the [OpenLayers advanced example](../openlayers/example/):

- A TimeSlider widget lists the survey dates available for the current view (from the Coverage API); picking a date reloads the imagery for that survey.
- Direction buttons switch between `Vertical`, `North`, `East`, `South` and `West` imagery. The reusable custom layer in [NearmapTileLayer.js](<NearmapTileLayer.js>) rotates the oblique tiles onto square Web Mercator tiles and the view is rotated to match the heading. Load that file alongside the HTML (it is referenced via `<script src="NearmapTileLayer.js">`).

Notes:
- Oblique imagery appears stretched 4/3 along the look direction compared to Nearmap's native viewer; ArcGIS cannot represent Nearmap's non-square oblique tile grid exactly.
- The sample embeds the API key in client-side code for demo simplicity. This exposes the key to anyone using the page, so it is not safe for a public-facing deployment. To reduce exposure, add [referrer restrictions](https://help.nearmap.com/kb/articles/666-manage-api-applications) to your API key (available on all Nearmap plans) so it only works from your own domains, and/or proxy Nearmap requests through a server that injects the key. See the security note at the top of the HTML source.

## Archive (unmaintained)

The samples in [archive/](<archive/>) and the CodePen pens below target older ArcGIS SDK versions and are no longer maintained. They are kept for reference only.

Files in [archive/](<archive/>):

- Nearmap Tile API ArcGIS JavaScript SDK 4.22 2D Sample.html
- Nearmap Tile API ArcGIS JavaScript SDK 4.22 2D and 3D Sample.html
- Nearmap Tile API ArcGIS JavaScript SDK 4.22 Swipe Sample.html
- Nearmap Tile API ArcGIS JavaScript SDK 3.38 2D Sample.html
- Nearmap WMS API ArcGIS JavaScript SDK 2D & 3D Sample.html
- Nearmap WMTS API ArcGIS JavaScript SDK 2D & 3D Sample.html

CodePen pens (unmaintained):

- Tile API:
  - [Nearmap Tile API | ArcGIS JavaScript SDK 4.21 (2D + 3D)](https://codepen.io/geoffhtaylor3d/pen/PojVvjd)
  - [Nearmap Tiles API | ArcGIS JavaScript SDK 4.21 (2D Only)](https://codepen.io/geoffhtaylor3d/pen/ExvaGqg)
  - [Nearmap Tiles API | ArcGIS JavaScript SDK 4.22 (Swipe)](https://codepen.io/geoffhtaylor3d/pen/gOXbXoV)
  - [Nearmap Tiles API | ArcGIS JavaScript SDK 3.36 (2D Only)](https://codepen.io/geoffhtaylor3d/pen/MWvYZXM)
- WMS API:
  - [Nearmap WMS API | ArcGIS JavaScript SDK 4.21 (2D + 3D)](https://codepen.io/geoffhtaylor3d/pen/XWgGRGp)
- WMTS API:
  - [Nearmap WMTS API | ArcGIS JavaScript SDK 4.21 (2D + 3D)](https://codepen.io/geoffhtaylor3d/pen/ZEvGXwJ)
