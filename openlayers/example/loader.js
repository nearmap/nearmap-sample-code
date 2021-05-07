
function fetchImageData(url) {
  return fetch(url, { redirect: 'manual' })
    .then(function(resp) {
      if (resp.status === 200) {
          return resp.blob()
            .then(function(data) {
              return window.URL.createObjectURL(data);
            });
      }

      // Handle other http status cases here
      return null;
    })
    .catch(function(reason) {
      // Handle exceptions here
      return null;
    });
}

function loadImage(data) {
  return new Promise(function(resolve) {
    var img = document.createElement('img');
    img.addEventListener('load',function() { resolve(img); });
    // Falling back to an empty image in case of any errors
    img.addEventListener('error', function() { resolve(img); });

    // Assign image data
    img.src = data;
  });
}

function rotateImage(ctx, img, tileWidth, tileHeight, heading) {
  var rotation = degreesToRadians(heading);

  ctx.save();

  ctx.translate(tileWidth / 2, tileHeight / 2);
  ctx.rotate(rotation);

  switch (heading) {
    case NORTH:
    case SOUTH:
      ctx.drawImage(img, -tileWidth / 2, -tileHeight / 2, tileWidth, tileHeight);
      break;
    case EAST:
    case WEST:
      ctx.drawImage(img, -tileHeight / 2, -tileWidth / 2, tileHeight, tileWidth);
      break;
  }

  ctx.restore();
}

function createCanvas(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return [canvas, canvas.getContext('2d')];
}

function rotateTile(data, tileDims, heading) {
  var tileWidth = tileDims[0];
  var tileHeight = tileDims[1];
  var canvasAndCtx = createCanvas(tileWidth, tileHeight);
  var canvas = canvasAndCtx[0];
  var ctx = canvasAndCtx[1];

  return loadImage(data)
    .then(function(img) {
      rotateImage(ctx, img, tileWidth, tileHeight, heading);

      return canvas.toDataURL();
    });
}
