
var VERT = 0;
var NORTH = 0;
var EAST = 90;
var SOUTH = 180;
var WEST = 270;

var HEADINGS = {
  Vert: VERT,
  North: NORTH,
  East: EAST,
  South: SOUTH,
  West: WEST
};

function addProj(code, worldWidth, worldHeight) {
  var projection = new ol.proj.Projection({
    code: code,
    // The extent is used to determine zoom level 0. Recommended values for a
    // projection's validity extent can be found at https://epsg.io/.
    extent: [0, 0, worldWidth, worldHeight],
    worldExtent: [-180, -85, 180, 85],
    // 'degrees', 'ft', 'm', 'pixels', 'tile-pixels' or 'us-ft'
    units: 'pixels'
  });

  ol.proj.addProjection(projection);

  var cx = worldWidth / 2;
  var cy = worldHeight / 2;

  var pixelsPerLonDegree = worldWidth / 360;
  var pixelsPerLatRadian = worldHeight / (2 * Math.PI);

  ol.proj.addCoordinateTransforms(
    'EPSG:4326',
    projection,
    function(coord) {
      var lng = coord[0];
      var lat = coord[1];

      /**
       *  Mercator Projection
       *  https://en.wikipedia.org/wiki/Mercator_projection
       *
       *   x = longtitude * PI / 180
       *
       *   y = ln(tan( PI/4 + θ/2)) (NOTES: θ = latitude * PI / 180)
       *     = ln(tan(θ) + sec(θ))
       */

      var x = cx + lng * pixelsPerLonDegree;

      var theta = degreesToRadians(lat);
      var tanTheta = Math.tan(theta);
      var secTheta = 1 / Math.cos(theta);
      var latRadians = Math.log(tanTheta + secTheta);
      var y = cy + latRadians * pixelsPerLatRadian;

      return [x, y];
    },
    function(coord) {
      var x = coord[0];
      var y = coord[1];

      var lng = (x - cx) / pixelsPerLonDegree;
      var latRadians = (y - cy) / -pixelsPerLatRadian;
      var lat = -radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);

      return [lng, lat];
    }
  );
};

addProj('NMV:000', 256, 256);
addProj('NMO:NS', 256, 192);
addProj('NMO:EW', 192, 256);

var ProjLatLng = ol.proj.get('EPSG:4326');
var ProjVertical = ol.proj.get('NMV:000');
var ProjObliqueNS = ol.proj.get('NMO:NS');
var ProjObliqueEW = ol.proj.get('NMO:EW');

var PROJECTIONS = {
  North: ProjObliqueNS,
  East: ProjObliqueEW,
  South: ProjObliqueNS,
  West: ProjObliqueEW,
  Vert: ProjVertical
};
