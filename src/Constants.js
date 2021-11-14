export const distance = (x1, y1, x2, y2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

// Adapted from https://www.redblobgames.com/grids/line-drawing.html
export const line = (x1, y1, x2, y2) => {
  let dx = x2 - x1, dy = y2 - y1;
  let nx = Math.abs(dx), ny = Math.abs(dy);
  let sign_x = dx > 0 ? 1 : -1, sign_y = dy > 0 ? 1 : -1;

  let p = [x1, y1];
  let points = [[x1, y1]];
  for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
    if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
      p[0] += sign_x;
      ix++;
    } else {
      p[1] += sign_y;
      iy++;
    }
    points.push([p[0], p[1]]);
  }
  return points.slice(1);
}

export const unitSettings = {
  dux: {
    viewDistance: 5,
  },
  speculator: {
    viewDistance: 5,
  }
}

export const dux = (unitId, playerId, tile) => {
  return {
    unitType: 'dux',
    unitTypeShort: 'd',
    playerId: playerId,
    unitId: unitId,
    tile: tile,
    orders: [],
  }
}

export const hastati = (unitId, playerId, tile) => {
  return {
    unitType: 'hastati',
    unitTypeShort: 'h',
    playerId: playerId,
    unitId: unitId,
    tile: tile,
    orders: [],
  }
}

export const principes = (unitId, playerId, tile) => {
  return {
    unitType: 'principes',
    unitTypeShort: 'p',
    playerId: playerId,
    unitId: unitId,
    tile: tile,
    orders: [],
  }
}

export const equites = (unitId, playerId, tile) => {
  return {
    unitType: 'equites',
    unitTypeShort: 'e',
    playerId: playerId,
    unitId: unitId,
    tile: tile,
    orders: [],
  }
}

export const speculator = (speculatorId, playerId) => {
  return {
    playerId: playerId,
    speculatorId: speculatorId,
    tile: null,
    destinationUnit: null,
    awayRoute: [],
    returnRoute: [],
    units: [],
    speculatores: [],
  }
}
