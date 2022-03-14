
let olMap = null;
let layerType = 'Vert';
let availableSurveys = [];
let dropdownElement = null;
let selectedDisplayElement = null;
let displayedDisplayElement = null;
let northElement = null;
let westElement = null;
let southElement = null;
let eastElement = null;
let vertElement = null;

let selectedSurvey = {
  survey: null,
  get value() {
    return this.survey;
  },
  set value(value) {
    this.survey = value;
    selectedDisplayElement.innerHTML = value;
  }
};

let displayedSurvey = {
  survey: null,
  get value() {
    return this.survey;
  },
  set value(value) {
    this.survey = value;
    displayedDisplayElement.innerHTML = value;
  }
};

const TILE_SIZES = {
  North: [256, 192],
  East: [192, 256],
  South: [256, 192],
  West: [192, 256],
  Vertical: [256, 256]
};

function toViewRotation(heading) {
  return degreesToRadians(modulus360(360 - heading));
}

/**
 * Provides Nearmap tile URL whenever for selected survey date and layer type
 */
function tileUrlFunction(tileCoord) {
  let z = tileCoord[0];
  let x = tileCoord[1];
  let y = tileCoord[2];

  return urlTemplate(z, x, y, displayedSurvey.value, layerType);
}

/**
 * Provides Nearmap tile rotation mechanism
 */
function tileLoadFunction(imageTile, src) {
  let img = imageTile.getImage();

  fetchImageData(src)
    .then(function(imgData) {
      if (imgData && layerType !== 'Vert') {
        rotateTile(imgData, TILE_SIZES[layerType], HEADINGS[layerType])
          .then(function(rotatedImgData) {
            img.src = rotatedImgData || '';
          });
      }

      img.src = imgData || '';
    });
}

/**
 * Create Openlayers projection with corresponding rotation and projection
 */
function createView(zoom, center) {
  zoom = zoom || ZOOM;
  center = center || CENTER;

  return new ol.View({
    projection: PROJECTIONS[layerType],
    rotation: toViewRotation(HEADINGS[layerType]),
    center: ol.proj.fromLonLat(center, PROJECTIONS[layerType]),
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    zoom: zoom
  });
}

/**
 * Create Openlayers tileLayer with corresponding tileSize and projection
 */
function createLayer() {
  return new ol.layer.Tile({
    source: new ol.source.XYZ({
      projection: PROJECTIONS[layerType],
      tileSize: TILE_SIZES[layerType],
      tileUrlFunction: tileUrlFunction,
      tileLoadFunction: tileLoadFunction
    })
  });
}

/**
 * Calculates view bounds [minX, minY, maxX, maxY] for Nearmap coverage API.
 * Above coordinates are internally called [west, south, east, north].
 */
function getBounds() {
  let view = olMap.getView();
  let projection = view.getProjection();
  let extent = view.calculateExtent(olMap.getSize());
  extent = ol.proj.transformExtent(extent, projection, ol.proj.get('EPSG:4326'));
  let west = extent[0];
  let south = extent[1];
  let east = extent[2];
  let north = extent[3];

  return { north: north, east: east, west: west, south: south };
}

/**
 * Called when the selected survey date does not exist in the current list of available survey dates.
 * It returns the closest available date.
 *
 * @param {*} surveys            available surveys returned by the coverage API
 * @param {*} selectedDate       user's selected survey date
 */
function findClosestDate(surveys, selectedDate) {
  let selectedDateInMs = selectedDate ? +new Date(selectedDate) : +new Date();
  let deltaInMs = surveys.map(function(survey) {
    let surveyDateInMs = +new Date(survey.captureDate);
    return Math.abs(selectedDateInMs - surveyDateInMs);
  });

  let closestDateInMs = Math.min.apply(null, deltaInMs);
  return surveys[deltaInMs.findIndex(function(ms) { return ms === closestDateInMs; })].captureDate;
}

/**
 * @param {*} availableSurveys    available surveys returned by the coverage API
 * @param {*} selectedDate        user's selected survey date
 */
function getSurveyDate(availableSurveys, selectedDate) {
  // No dates available
  if (availableSurveys.length === 0) {
    return null;
  }

  // Selects the selected survey date when available
  if (availableSurveys.find(function(survey) { return selectedDate === survey.captureDate; })) {
    return selectedDate;
  }

  // Searches for the closest available survey date when not available
  return findClosestDate(availableSurveys, selectedDate);
}

/**
 * Fetches Nearmap coverage API.
 */
function fetchCoverage() {
  let bounds = getBounds(olMap);
  let coverageUrl = coverageUrlTemplate(bounds.east, bounds.west, bounds.north, bounds.south);

  return fetch(coverageUrl)
    .then(function(response) {
      return response.json();
    });
}

/**
 * Refreshes the map tiles whenever the selected survey date changes.
 */
function refreshTiles() {
  olMap
    .getLayers()
    .item(0)
    .getSource()
    .refresh();
}

/**
 * Refreshes the map tiles whenever projection changes.
 */
function refreshView() {
  let currentProject = olMap.getView().getProjection();
  let currentCenter = olMap.getView().getCenter();
  let zoom = olMap.getView().getZoom();
  let center = ol.proj.toLonLat(currentCenter, currentProject);

  return updateSurveys().then(function(){
      olMap.setView(createView(zoom, center));
      olMap.getLayers().clear();
      olMap.getLayers().push(createLayer());
  });
}

/**
 * updateSurveys contains logics how to deal with coverage api while map is moving
 */
function updateSurveys() {
  // Fetches Nearmap coverage API based current view port
  return fetchCoverage()
    .then(function(response) {
      // Updates internal `availableSurveys` and `displayedSurvey` members
      availableSurveys = getAvailableSurveyDates(response);
      displayedSurvey.value = getSurveyDate(availableSurveys, selectedSurvey.value);

      // Updates available surveys dropdown options
      updateDropDown();
    });
}

/**
 * Displays all available survey dates in a dropdown.
 */
function updateDropDown() {
  // Clears up previous options
  dropdownElement.innerHTML = '';

  // Creates the content of options for select element
  availableSurveys.forEach(function(survey) {
    let optionElement = document.createElement('option');
    optionElement.setAttribute('value', survey.captureDate);
    optionElement.innerText = survey.captureDate;

    dropdownElement.add(optionElement);
  });

  // Assigns default select value
  dropdownElement.value = displayedSurvey.value;
}

/**
 * Extracts out surveys which contain corresponding tile type
 *
 * e.g
 *  resources:
 *    tiles:
 *      0: {id: "100-24daeea2-b95e-11e7-b260-63f23522198a", scale: 21, type: "South"}
 *      1: {id: "100-24dd2c4e-b95e-11e7-b262-7fb6c449b1f8", scale: 20, type: "West"}
 *      2: {id: "100-24d9cb12-b95e-11e7-b25f-9be25dc20646", scale: 21, type: "North"}
 *      3: {id: "100-24cf92b4-b95e-11e7-b25d-5fce962b39a4", scale: 21, type: "Vert"}
 *      4: {id: "100-24dc01fc-b95e-11e7-b261-4395884423ee", scale: 20, type: "East"}
 */
function getAvailableSurveyDates(response) {
  let surveys = response && response.surveys ? response.surveys : [];

  return surveys.filter(function(survey) {
    return (survey.resources.tiles || [])
      .some(function(tile) { return tile.type === layerType; });
  });
}

function onMapMoveHandler() {
    updateSurveys();
}

function initUiElements() {
  dropdownElement = document.querySelector('select');
  selectedDisplayElement = document.querySelector('#selectedSurveyElementId');
  displayedDisplayElement = document.querySelector('#displayedSurveyElementId');

  northElement = document.querySelector('#northElementId');
  westElement = document.querySelector('#westElementId');
  southElement = document.querySelector('#southElementId');
  eastElement = document.querySelector('#eastElementId');
  vertElement = document.querySelector('#vertElementId');
}

/**
 * Adds event listeners to map instance and UI elements.
 */
function addEventListeners() {
  // Adds map moving (panning and zooming) listener
  olMap.on('moveend', function() {
    onMapMoveHandler(dropdownElement);
  });

  // Adds "onChange" listener to the dropdown
  dropdownElement.addEventListener('change', function(evt) {
    selectedSurvey.value = evt.target.value;
    displayedSurvey.value = evt.target.value;

    refreshTiles();
  });

  [northElement, westElement, southElement, eastElement, vertElement]
    .forEach(function(element) {
      element.addEventListener('click', function(evt) {
        layerType = evt.target.value;

        refreshView();
      });
    });
}

function initMap() {
  olMap = new ol.Map({
    target: 'map',
    controls: [new ol.control.Zoom()],
    layers: [createLayer()],
    view: createView()
  });

  initUiElements();
  addEventListeners();
}

initMap();
