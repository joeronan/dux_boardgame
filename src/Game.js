import { PlayerView } from 'boardgame.io/core';
import { distance, dux, hastati, principes, equites } from './Constants.js'

export const InfoGame = {
  setup: () => {
    const units = [dux(0, 0, [0, 4]), dux(1, 1, [8, 4]), hastati(2, 0, [2, 2])]

    const playerUnits = units.map(unit => Object.assign({}, unit, { lastSeen: 0 }))

    return {
      secret: { units: units },

      players: {
        '0': { units: playerUnits, newOrders: [] },
        '1': { units: playerUnits, newOrders: [] },
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
          steps: steps,
        })
      }

      // Implement speculatores

      // Introduce checks that steps & messenger step are both valid
    },

    sendSpeculatores: (G, ctx, unit, x, y) => {
      // Implement scouting for speculatores
    },

    moveDux: (G, ctx, unit, steps) => {
      if (unit.playerId != ctx.currentPlayer) {
        return
      }

      if (G.players[ctx.currentPlayer].newOrders.filter(x => x.unit.unitId === unit.unitId).length === 0) {
        G.players[ctx.currentPlayer].newOrders.push({
          unitId: unit.unitId,
          steps: steps,
        })
      }
    }
  },

  turn: {
    onEnd: (G, ctx) => {

      // Adding orders to units
      G.players[ctx.currentPlayer].newOrders.forEach((order) => {
        G.secret.units.filter((unit) => unit.unitId == order.unitId)[0].orders = G.secret.units.filter((unit) => unit.unitId == order.unitId)[0].orders.concat(order.steps)
      })
      G.players[ctx.currentPlayer].newOrders = []

      // Carrying out orders
      G.secret.units.forEach((unit) => {
        if (unit.playerId == ctx.currentPlayer && unit.orders.length > 0) {
          const tile = unit.orders.shift()
          unit.tile = tile
        }
      })

      // Updating player vision
      for (const [playerId, player] of Object.entries(G.players)) {
        G.secret.units.forEach((unit) => {
          // Needs to be changed to access the duces better
          console.log(unit.tile)
          console.log(distance(unit.tile[0], unit.tile[1], G.secret.units[playerId].tile[0], G.secret.units[playerId].tile[1]))
          if (distance(unit.tile[0], unit.tile[1], G.secret.units[playerId].tile[0], G.secret.units[playerId].tile[1]) < 5) {
            console.log(unit.unitType, unit.playerId)
            player.units.filter((x) => x.unitId == unit.unitId)[0].tile = unit.tile
            player.units.filter((x) => x.unitId == unit.unitId)[0].lastSeen = ctx.turn
          }
        })

        // Add updating player vision from Speculatores here

        // Change it so that player vision shows the last place a unit was seen, in case a unit walks away in a certain direction
      }

      return G
    }
  },

  // playerView: PlayerView.STRIP_SECRETS,
};