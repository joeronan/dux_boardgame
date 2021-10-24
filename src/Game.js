import { PlayerView } from 'boardgame.io/core';

const general = (unitId, playerId, tile) => {
  return {
    unitType: 'general',
    unitTypeShort: 'g',
    playerId: playerId,
    unitId: playerId,
    tile: tile
  }
}

const hastati = (unitId, playerId, tile) => {
  return {
    unitType: 'hastati',
    unitTypeShort: 'h',
    playerId: playerId,
    unitId: 2,
    tile: tile
  }
}

const principes = (unitId, playerId, tile) => {
  return {
    unitType: 'principes',
    unitTypeShort: 'p',
    playerId: playerId,
    unitId: 2,
    tile: tile
  }
}

const equites = (unitId, playerId, tile) => {
  return {
    unitType: 'equites',
    unitTypeShort: 'e',
    playerId: playerId,
    unitId: 2,
    tile: tile
  }
}

const speculatores = () => {
  // 
}

const distance = (x1, y1, x2, y2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

export const InfoGame = {
  setup: () => {
    const units = [general(0, 0, [0, 4]), general(1, 1, [8, 4]), hastati(2, 0, [2, 2])]

    return {
      secret: { units: units },

      players: {
        '0': { units: units, orders: [], newOrders: [] },
        '1': { units: units, orders: [], newOrders: [] },
      }
    }
  },

  moves: {
    sendOrder: (G, ctx, unit, steps, messengerSteps) => {
      if (unit.playerId != ctx.currentPlayer) {
        return
      }

      if (G.players[ctx.currentPlayer].newOrders.filter(x => x.unit.unitId === unit.unitId).length === 0) {
        G.players[ctx.currentPlayer].newOrders.push({
          unitId: unit.unitId,
          x: steps.map(step => step[0]),
          y: steps.map(step => step[1]),
        })
      }

      // Implement speculatores

      // Introduce checks that steps & messenger step are both valid
    },

    sendScout: (G, ctx, unit, x, y) => {
      // Implement scouting for speculatores
    },

    moveGeneral: (G, ctx, unit, steps) => {
      if (unit.playerId != ctx.currentPlayer) {
        return
      }

      if (G.players[ctx.currentPlayer].newOrders.filter(x => x.unit.unitId === unit.unitId).length === 0) {
        G.players[ctx.currentPlayer].newOrders.push({
          unitId: unit.unitId,
          x: steps.map(step => step[0]),
          y: steps.map(step => step[1]),
        })
      }
    }
  },

  turn: {
    onEnd: (G, ctx) => {

      G.players[ctx.currentPlayer].orders = G.players[ctx.currentPlayer].orders.concat(G.players[ctx.currentPlayer].newOrders)
      G.players[ctx.currentPlayer].newOrders = []

      G.players[ctx.currentPlayer].orders.forEach((order) => {
        const x = order.x.shift()
        const y = order.y.shift()
        G.secret.units.filter((unit) => unit.unitId == order.unitId)[0].tile = [x, y]
      })

      G.players[ctx.currentPlayer].orders = G.players[ctx.currentPlayer].orders.filter((order) => order.x.length > 0)

      for (const [playerId, player] of Object.entries(G.players)) {
        G.secret.units.forEach((unit) => {
          // Needs to be changed to access the generals better
          console.log(distance(unit.tile[0], unit.tile[1], G.secret.units[playerId].tile[0], G.secret.units[playerId].tile[1]))
          if (distance(unit.tile[0], unit.tile[1], G.secret.units[playerId].tile[0], G.secret.units[playerId].tile[1]) < 5) {
            console.log(unit.unitType, unit.playerId)
            player.units.filter((x) => x.unitId == unit.unitId)[0].tile = unit.tile
          }
        })

        // Add updating player vision from Speculatores here

        // Change it so that player vision shows the last place a unit was seen, in case a unit walks away in a certain direction

        // player.units = G.secret.units
      }

      return G
    }
  },

  // playerView: PlayerView.STRIP_SECRETS,
};