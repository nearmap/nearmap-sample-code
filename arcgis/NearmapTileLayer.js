/*
 * NearmapTileLayer - a custom ArcGIS Maps SDK for JavaScript (4.x) tile layer for
 * Nearmap vertical and panorama (oblique) imagery.
 *
 * Learn more about the Nearmap Tile API: https://docs.nearmap.com/display/ND/Tile+API
 *
 * Why a custom layer?
 *   Nearmap oblique (panorama) tiles are served as non-square images (256x192 for
 *   North/South, 192x256 for East/West) whose content is oriented towards the viewing
 *   direction. The stock WebTileLayer cannot display them. The oblique tile indices do,
 *   however, line up exactly with the standard Web Mercator XYZ grid, so each tile only
 *   needs to be rotated to north-up and stretched to fill a square 256x256 tile. This
 *   layer does that compositing in fetchTile().
 *
 * Limitation:
 *   Oblique imagery ends up stretched 4/3 along the look direction compared to Nearmap's
 *   native viewer. ArcGIS LODs use a single resolution per level, so the non-square
 *   oblique tile grid cannot be represented exactly. Pair this layer with a 2D MapView
 *   and set view.rotation = (360 - heading) % 360 so the imagery reads naturally.
 *
 * Usage (inside an AMD require callback that has loaded esri/layers/BaseTileLayer):
 *   const NearmapTileLayer = createNearmapTileLayer(BaseTileLayer);
 *   const layer = new NearmapTileLayer({ apiKey, tileInfo, direction: "Vert" });
 *   layer.direction = "South";   // then call layer.refresh()
 *   layer.until = "2024-10-13";  // then call layer.refresh()
 *
 * BaseTileLayer is passed in rather than imported here so this file stays a plain script
 * with an explicit dependency and no AMD/dojoConfig setup, making it easy to copy.
 */
function createNearmapTileLayer(BaseTileLayer) {
  const TILE_SIZE = 256;

  // Imagery heading in degrees for each direction. Oblique tile images are oriented
  // towards the viewing direction and need rotating by this angle to become north-up.
  const HEADINGS = {
    Vert: 0,
    North: 0,
    East: 90,
    South: 180,
    West: 270
  };

  return BaseTileLayer.createSubclass({
    properties: {
      apiKey: null,
      direction: "Vert",
      until: null,
      tertiary: "satellite"
    },

    getTileUrl: function (level, row, col) {
      // ArcGIS passes (level, row, col); the Nearmap Tile API path is /{z}/{x}/{y}
      // where x = col and y = row.
      const untilParam = this.until ? `&until=${this.until}` : "";
      return `https://api.nearmap.com/tiles/v3/${this.direction}/${level}/${col}/${row}` +
        `.img?tertiary=${this.tertiary}&apikey=${this.apiKey}${untilParam}`;
    },

    fetchTile: function (level, row, col, options) {
      const heading = HEADINGS[this.direction] || 0;
      const url = this.getTileUrl(level, row, col);

      // redirect: "manual" stops fetch from following Nearmap's "no imagery here"
      // redirect. Such a tile comes back as an opaque-redirect (status 0) or a non-200
      // response; either way we render an empty (transparent) tile instead of an error.
      return fetch(url, { redirect: "manual", signal: options && options.signal })
        .then((response) => (response.status === 200 ? response.blob() : null))
        .then((blob) => (blob ? createImageBitmap(blob) : null))
        .then((bitmap) => {
          const canvas = document.createElement("canvas");
          canvas.width = TILE_SIZE;
          canvas.height = TILE_SIZE;

          if (bitmap) {
            const ctx = canvas.getContext("2d");
            ctx.translate(TILE_SIZE / 2, TILE_SIZE / 2);
            ctx.rotate(heading * (Math.PI / 180));
            // Drawing the (possibly non-square) bitmap to fill the whole square in the
            // rotated frame applies both the orientation fix and the 4/3 stretch at once.
            ctx.drawImage(bitmap, -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
          }

          return canvas;
        });
    }
  });
}
