
const VERT = 0;
const NORTH = 0;
const EAST = 90;
const SOUTH = 180;
const WEST = 270;

const HEADINGS = {
  Vert: VERT,
  North: NORTH,
  East: EAST,
  South: SOUTH,
  West: WEST
};

function addProj(code, worldWidth, worldHeight) {
  const projection = new ol.proj.Projection({
    code: code,
    // The extent is used to determine zoom level 0. Recommended values for a
    // projection's validity extent can be found at https://epsg.io/.
    extent: [0, 0, worldWidth, worldHeight],
    worldExtent: [-180, -85, 180, 85],
    // 'degrees', 'ft', 'm', 'pixels', 'tile-pixels' or 'us-ft'
    units: 'pixels'
  });

  ol.proj.addProjection(projection);

  const cx = worldWidth / 2;
  const cy = worldHeight / 2;

  const pixelsPerLonDegree = worldWidth / 360;
  const pixelsPerLatRadian = worldHeight / (2 * Math.PI);

  ol.proj.addCoordinateTransforms(
    'EPSG:4326',
    projection,
    function(coord) {
      const lng = coord[0];
      const lat = coord[1];

      /**
       *  Mercator Projection
       *  https://en.wikipedia.org/wiki/Mercator_projection
       *
       *   x = longtitude * PI / 180
       *
       *   y = ln(tan( PI/4 + θ/2)) (NOTES: θ = latitude * PI / 180)
       *     = ln(tan(θ) + sec(θ))
       */

      const x = cx + lng * pixelsPerLonDegree;

      const theta = degreesToRadians(lat);
      const tanTheta = Math.tan(theta);
      const secTheta = 1 / Math.cos(theta);
      const latRadians = Math.log(tanTheta + secTheta);
      const y = cy + latRadians * pixelsPerLatRadian;

      return [x, y];
    },
    function(coord) {
      const x = coord[0];
      const y = coord[1];

      const lng = (x - cx) / pixelsPerLonDegree;
      const latRadians = (y - cy) / -pixelsPerLatRadian;
      const lat = -radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);

      return [lng, lat];
    }
  );
}

addProj('NMV:000', 256, 256);
addProj('NMO:NS', 256, 192);
addProj('NMO:EW', 192, 256);

const ProjLatLng = ol.proj.get('EPSG:4326');
const ProjVertical = ol.proj.get('NMV:000');
const ProjObliqueNS = ol.proj.get('NMO:NS');
const ProjObliqueEW = ol.proj.get('NMO:EW');

const PROJECTIONS = {
  North: ProjObliqueNS,
  East: ProjObliqueEW,
  South: ProjObliqueNS,
  West: ProjObliqueEW,
  Vert: ProjVertical
};
