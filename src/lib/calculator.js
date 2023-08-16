export function getLocationFromOldScale(newScale, oldScale, location, scalePoint){
    const deltaX = (scalePoint.x * newScale) - (scalePoint.x * oldScale);
    const deltaY = (scalePoint.y * newScale) - (scalePoint.y * oldScale);

    location.x -= deltaX;
    location.y -= deltaY;

    return location
}

export function getRelativeLocationFromAbsolute(X, Y, scale, location){
    let x = X - location.x;
    let y = Y - location.y

    x /= scale
    y /= scale

    return {x, y}
}

export function getAbsoluteLocationFromRelative(X, Y, scale, location){
    const x = location.x + (X * scale)
    const y = location.y + (Y * scale)

    return {x, y}
}

export function isOnCanvas(x, y, scale, location, min_dimensions){
    if(location.x + (scale * min_dimensions.width) < x)
      return false

    if(location.y + (scale * min_dimensions.height) < y)
      return false
    
    if(x < location.x)
      return false

    if(y < location.y)
      return false

    return true
  }
