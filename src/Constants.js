export const distance = (x1, y1, x2, y2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
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
  }
}
