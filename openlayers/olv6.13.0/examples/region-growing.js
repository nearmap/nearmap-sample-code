"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[9148],{

/***/ 9447:
/***/ (function(__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _src_ol_Map_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1376);
/* harmony import */ var _src_ol_source_Raster_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7486);
/* harmony import */ var _src_ol_View_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4354);
/* harmony import */ var _src_ol_source_XYZ_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1998);
/* harmony import */ var _src_ol_layer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2010);
/* harmony import */ var _src_ol_layer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6291);
/* harmony import */ var _src_ol_proj_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2810);







function growRegion(inputs, data) {
  var image = inputs[0];
  var seed = data.pixel;
  var delta = parseInt(data.delta);

  if (!seed) {
    return image;
  }

  seed = seed.map(Math.round);
  var width = image.width;
  var height = image.height;
  var inputData = image.data;
  var outputData = new Uint8ClampedArray(inputData);
  var seedIdx = (seed[1] * width + seed[0]) * 4;
  var seedR = inputData[seedIdx];
  var seedG = inputData[seedIdx + 1];
  var seedB = inputData[seedIdx + 2];
  var edge = [seed];

  while (edge.length) {
    var newedge = [];

    for (var i = 0, ii = edge.length; i < ii; i++) {
      // As noted in the Raster source constructor, this function is provided
      // using the `lib` option. Other functions will NOT be visible unless
      // provided using the `lib` option.
      var next = next4Edges(edge[i]);

      for (var j = 0, jj = next.length; j < jj; j++) {
        var s = next[j][0];
        var t = next[j][1];

        if (s >= 0 && s < width && t >= 0 && t < height) {
          var ci = (t * width + s) * 4;
          var cr = inputData[ci];
          var cg = inputData[ci + 1];
          var cb = inputData[ci + 2];
          var ca = inputData[ci + 3]; // if alpha is zero, carry on

          if (ca === 0) {
            continue;
          }

          if (Math.abs(seedR - cr) < delta && Math.abs(seedG - cg) < delta && Math.abs(seedB - cb) < delta) {
            outputData[ci] = 255;
            outputData[ci + 1] = 0;
            outputData[ci + 2] = 0;
            outputData[ci + 3] = 255;
            newedge.push([s, t]);
          } // mark as visited


          inputData[ci + 3] = 0;
        }
      }
    }

    edge = newedge;
  }

  return {
    data: outputData,
    width: width,
    height: height
  };
}

function next4Edges(edge) {
  var x = edge[0];
  var y = edge[1];
  return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
}

var key = 'get_your_own_D6rA4zTHduk6KOKTXzGB';
var attributions = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' + '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
var imagery = new _src_ol_layer_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z({
  source: new _src_ol_source_XYZ_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z({
    attributions: attributions,
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20,
    crossOrigin: ''
  })
});
var raster = new _src_ol_source_Raster_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .ZP({
  sources: [imagery.getSource()],
  operationType: 'image',
  operation: growRegion,
  // Functions in the `lib` object will be available to the operation run in
  // the web worker.
  lib: {
    next4Edges: next4Edges
  }
});
var rasterImage = new _src_ol_layer_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z({
  opacity: 0.7,
  source: raster
});
var map = new _src_ol_Map_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z({
  layers: [imagery, rasterImage],
  target: 'map',
  view: new _src_ol_View_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .ZP({
    center: (0,_src_ol_proj_js__WEBPACK_IMPORTED_MODULE_0__/* .fromLonLat */ .mi)([-119.07, 47.65]),
    zoom: 11
  })
});
var coordinate;
map.on('click', function (event) {
  coordinate = event.coordinate;
  raster.changed();
});
var thresholdControl = document.getElementById('threshold');
raster.on('beforeoperations', function (event) {
  // the event.data object will be passed to operations
  var data = event.data;
  data.delta = thresholdControl.value;

  if (coordinate) {
    data.pixel = map.getPixelFromCoordinate(coordinate);
  }
});

function updateControlValue() {
  document.getElementById('threshold-value').innerText = thresholdControl.value;
}

updateControlValue();

var listener = function listener() {
  updateControlValue();
  raster.changed();
};

thresholdControl.addEventListener('input', listener);
thresholdControl.addEventListener('change', listener);

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(9877), __webpack_exec__(9447));
/******/ }
]);
//# sourceMappingURL=region-growing.js.map