// import { PlayerView } from 'boardgame.io/core';
import { distance, dux, hastati, principes, equites, speculator } from './Constants.js'

export const InfoGame = {
  setup: () => {
    const units = [dux(0, '0', [0, 4]), dux(1, '1', [8, 4]), hastati(2, '0', [2, 2])]
    const speculatores = [speculator(0, '0'), speculator(1, '1')]

    const playerUnits = units.map(unit => Object.assign({}, unit, { lastSeen: 0 }))
    const playerSpeculatores = speculatores.map(speculator => Object.assign({}, speculator, { lastSeen: 0 }))

    return {
      secret: { units: units, speculatores: speculatores },

      players: {
        '0': { units: playerUnits, speculatores: playerSpeculatores, newOrders: [] },
        '1': { units: playerUnits, speculatores: playerSpeculatores, newOrders: [] },
      }
    }
  },

  moves: {
    sendOrder: (G, ctx, unit, steps, speculatorSteps) => {
      if (unit.playerId !== ctx.currentPlayer) {
        return
      }

      if (G.players[ctx.currentPlayer].newOrders.filter(x => x.unit.unitId === unit.unitId).length === 0) {
        G.players[ctx.currentPlayer].newOrders.push({
          unitId: unit.unitId,
          steps: steps,
        })
      }

      // Implement speculatores

      // Introduce checks that steps & speculator step are both valid
    },

    sendSpeculator: (G, ctx, steps) => {
      const availableSpeculatores = G.secret.speculatores.filter(x => (x.playerId === ctx.currentPlayer) && (x.tile === null))
      if (availableSpeculatores.length > 0) {
        availableSpeculatores[0].awayRoute = steps
        // Needs to be changed to access the duces better
        availableSpeculatores[0].returnRoute = steps.slice(0, -1).reverse().concat([G.secret.units[ctx.currentPlayer].tile])
        availableSpeculatores[0].tile = G.secret.units[ctx.currentPlayer].tile
      }
    },

    moveDux: (G, ctx, unit, steps) => {
      if (unit.playerId !== ctx.currentPlayer) {
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
        G.secret.units.filter((unit) => unit.unitId === order.unitId)[0].orders = G.secret.units.filter((unit) => unit.unitId === order.unitId)[0].orders.concat(order.steps)
      })
      G.players[ctx.currentPlayer].newOrders = []

      // Carrying out orders
      G.secret.units.forEach((unit) => {
        if (unit.playerId === ctx.currentPlayer && unit.orders.length > 0) {
          const tile = unit.orders.shift()
          unit.tile = tile
        }
      })

      G.secret.speculatores.forEach((speculator) => {
        // Moving speculatores
        if (speculator.playerId === ctx.currentPlayer && speculator.awayRoute.length > 0) {
          const tile = speculator.awayRoute.shift()
          speculator.tile = tile
        } else if (speculator.playerId === ctx.currentPlayer && speculator.awayRoute.length === 0 && speculator.returnRoute.length > 0) {
          const tile = speculator.returnRoute.shift()
          speculator.tile = tile

          // Add picking up speculators upon their return, below is not a smart approach
          // if (speculator.tile[0] === G.secret.units[speculator.playerId].tile[0] && speculator.tile[1] === G.secret.units[speculator.playerId].tile[1]) {
          //   speculator.tile = null
          //   speculator.destinationUnit = null
          //   speculator.returnRoute = []
          // }
        }
      })

      // Updating player vision
      for (const [playerId, player] of Object.entries(G.players)) {
        G.secret.units.forEach((unit) => {
          if (distance(unit.tile[0], unit.tile[1], G.secret.units[playerId].tile[0], G.secret.units[playerId].tile[1]) < 5) {
            player.units.filter((x) => x.unitId === unit.unitId)[0].tile = unit.tile
            player.units.filter((x) => x.unitId === unit.unitId)[0].lastSeen = ctx.turn
          }
        })

        G.secret.speculatores.forEach((speculator) => {
          if (speculator.tile !== null) {
            if (distance(speculator.tile[0], speculator.tile[1], G.secret.units[playerId].tile[0], G.secret.units[playerId].tile[1]) < 5) {
              player.speculatores.filter((x) => x.speculatorId === speculator.speculatorId)[0].tile = speculator.tile
              player.speculatores.filter((x) => x.speculatorId === speculator.speculatorId)[0].lastSeen = ctx.turn
            }
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