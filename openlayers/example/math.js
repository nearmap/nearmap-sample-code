/** Convert degress to radians */
function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

/** Convert radians to degrees */
function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}

/** Calculate the angle remainder from 360 */
function modulus360(deg) {
  if (deg < 0) {
    return 360 + (deg % 360);
  }

  return deg % 360;
}
