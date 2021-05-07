# openlayers-nearmap
Use OpenLayers library with Nearmap APIs.

### Quick Start
Below you'll find a complete working example showcasing OpenLayers with Nearmap imagery.

```html
<!DOCTYPE html>
<html style="width: 100%; height: 100%;">
  <head>
    <title>OpenLayers Nearmap Example</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList"></script>

    <!--
      OpenLayers cdn distributable from:
      https://openlayers.org/en/latest/doc/quickstart.html
    -->
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.1.1/build/ol.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.1.1/css/ol.css" type="text/css">
  </head>

  <body>
    <div id="map" style="position:absolute; top:0; right: 0; bottom: 0; left:0;"></div>

    <script type="text/javascript">
      var API_KEY = 'YOUR_API_KEY';
      var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: 'https://api.nearmap.com/tiles/v3/Vert/{z}/{x}/{y}.img?tertiary=satellite&apikey=' + API_KEY
            })
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([138.595637, -34.915302]),
          zoom: 13
        })
      });
    </script>
  </body>
</html>
```

### Advanced Example

The example in the [`example` folder](./example/) shows how to set up a OpenLayers map using Nearmap vertical and panorama imagery across multiple survey dates.

You can change the panorama imagery type by clicking heading buttons:

- `Vertical`
- `North`
- `East`
- `South`
- `West`

You can change the survey dates by selecting different dates in the dropdown.

> How it works?
>
> 1. Survey dates will vary in different locations and so the available survey list may change when moving around the map. 
> 2. The selected date will be displayed as long as it exists in the available survey list for the location being viewed. 
> 3. If the selected date does not exist in that location, then the next closest previous survey date in the available survey list will be displayed.
> 4. If there is no closest previous date, then the last available survey in the list will be displayed.
> 5. The latest available survey date will always be displayed if no date has been selected.

ℹ️ Make sure you provide your API key in the [config](./example/config.js) file.
