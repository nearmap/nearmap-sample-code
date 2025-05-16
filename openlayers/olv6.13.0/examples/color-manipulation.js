"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[1135],{

/***/ 1520:
/***/ (function(__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _src_ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6291);
/* harmony import */ var _src_ol_Map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1376);
/* harmony import */ var _src_ol_View_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4354);
/* harmony import */ var _src_ol_source_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7486);
/* harmony import */ var _src_ol_source_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4703);




/**
 * Color manipulation functions below are adapted from
 * https://github.com/d3/d3-color.
 */

var Xn = 0.95047;
var Yn = 1;
var Zn = 1.08883;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;
var twoPi = 2 * Math.PI;
/**
 * Convert an RGB pixel into an HCL pixel.
 * @param {Array<number>} pixel A pixel in RGB space.
 * @return {Array<number>} A pixel in HCL space.
 */

function rgb2hcl(pixel) {
  var red = rgb2xyz(pixel[0]);
  var green = rgb2xyz(pixel[1]);
  var blue = rgb2xyz(pixel[2]);
  var x = xyz2lab((0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / Xn);
  var y = xyz2lab((0.2126729 * red + 0.7151522 * green + 0.072175 * blue) / Yn);
  var z = xyz2lab((0.0193339 * red + 0.119192 * green + 0.9503041 * blue) / Zn);
  var l = 116 * y - 16;
  var a = 500 * (x - y);
  var b = 200 * (y - z);
  var c = Math.sqrt(a * a + b * b);
  var h = Math.atan2(b, a);

  if (h < 0) {
    h += twoPi;
  }

  pixel[0] = h;
  pixel[1] = c;
  pixel[2] = l;
  return pixel;
}
/**
 * Convert an HCL pixel into an RGB pixel.
 * @param {Array<number>} pixel A pixel in HCL space.
 * @return {Array<number>} A pixel in RGB space.
 */


function hcl2rgb(pixel) {
  var h = pixel[0];
  var c = pixel[1];
  var l = pixel[2];
  var a = Math.cos(h) * c;
  var b = Math.sin(h) * c;
  var y = (l + 16) / 116;
  var x = isNaN(a) ? y : y + a / 500;
  var z = isNaN(b) ? y : y - b / 200;
  y = Yn * lab2xyz(y);
  x = Xn * lab2xyz(x);
  z = Zn * lab2xyz(z);
  pixel[0] = xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
  pixel[1] = xyz2rgb(-0.969266 * x + 1.8760108 * y + 0.041556 * z);
  pixel[2] = xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
  return pixel;
}

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function rgb2xyz(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function xyz2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

var raster = new _src_ol_source_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP({
  sources: [new _src_ol_source_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z({
    layer: 'watercolor'
  })],
  operation: function operation(pixels, data) {
    var hcl = rgb2hcl(pixels[0]);
    var h = hcl[0] + Math.PI * data.hue / 180;

    if (h < 0) {
      h += twoPi;
    } else if (h > twoPi) {
      h -= twoPi;
    }

    hcl[0] = h;
    hcl[1] *= data.chroma / 100;
    hcl[2] *= data.lightness / 100;
    return hcl2rgb(hcl);
  },
  lib: {
    rgb2hcl: rgb2hcl,
    hcl2rgb: hcl2rgb,
    rgb2xyz: rgb2xyz,
    lab2xyz: lab2xyz,
    xyz2lab: xyz2lab,
    xyz2rgb: xyz2rgb,
    Xn: Xn,
    Yn: Yn,
    Zn: Zn,
    t0: t0,
    t1: t1,
    t2: t2,
    t3: t3,
    twoPi: twoPi
  }
});
var controls = {};
raster.on('beforeoperations', function (event) {
  var data = event.data;

  for (var id in controls) {
    data[id] = Number(controls[id].value);
  }
});
var map = new _src_ol_Map_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z({
  layers: [new _src_ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z({
    source: raster
  })],
  target: 'map',
  view: new _src_ol_View_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .ZP({
    center: [0, 2500000],
    zoom: 2,
    maxZoom: 18
  })
});
var controlIds = ['hue', 'chroma', 'lightness'];
controlIds.forEach(function (id) {
  var control = document.getElementById(id);
  var output = document.getElementById(id + 'Out');

  var listener = function listener() {
    output.innerText = control.value;
    raster.changed();
  };

  control.addEventListener('input', listener);
  control.addEventListener('change', listener);
  output.innerText = control.value;
  controls[id] = control;
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(9877), __webpack_exec__(1520));
/******/ }
]);
//# sourceMappingURL=color-manipulation.js.map