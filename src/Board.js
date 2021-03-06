import React from 'react';
import { distance, line } from './Constants.js'

const tileStyle = {
  border: '1px solid #555',
  width: '50px',
  height: '50px',
  lineHeight: '50px',
  textAlign: 'center',
};

const tileStyleDark = Object.assign({}, tileStyle, { backgroundColor: 'hsla(0, 3%, 50%, 0.1)' })

const tileStyleHover = Object.assign({}, tileStyle, { backgroundColor: 'hsla(0, 3%, 50%, 0.3)' })

const InfoGameBoard = ({ ctx, G, moves, events }) => {

  const [orderStage, setOrderStage] = React.useState(0)
  const [orderUnit, setOrderUnit] = React.useState(null)
  const [orderSteps, setOrderSteps] = React.useState([])
  const [orderSpeculatorSteps, setOrderSpeculatorSteps] = React.useState([])
  const [hoverTiles, setHoverTiles] = React.useState([])

  const onClick = (tile) => {
    switch (orderStage) {
      case 0:
        const unitList = G.players[ctx.currentPlayer].units.filter((unit) => (unit.tile[0] === tile[0]) && (unit.tile[1] === tile[1]))

        if (unitList.length > 0) {
          setOrderUnit(unitList[0])
          if (unitList[0].unitType === 'dux') {
            setOrderStage(-1)
          } else {
            setOrderStage(1)
          }
        } else {
          setOrderStage(-2)
          setOrderSpeculatorSteps(hoverTiles)
        }
        break;
      case 1:
        setOrderSteps(hoverTiles)
        break;
      case 2:
        setOrderSpeculatorSteps(hoverTiles)
        break;
      case -1:
        setOrderSteps(hoverTiles)
        break;
      case -2:
        setOrderSpeculatorSteps(hoverTiles)
        break;
      default:
        console.log('ERROR: ORDER STAGE BROKEN')
        break;
    }
  }

  const onSubmitClick = () => {
    switch (orderStage) {
      case 0:
        break;
      case 1:
        setOrderStage(2)
        break;
      case 2:
        moves.sendOrder(orderUnit, orderSteps, orderSpeculatorSteps);
        setOrderUnit(null)
        setOrderSteps([])
        setOrderSpeculatorSteps([])
        setOrderStage(0)
        break;
      case -1:
        moves.moveDux(orderUnit, orderSteps);
        setOrderUnit(null)
        setOrderSteps([])
        setOrderSpeculatorSteps([])
        setOrderStage(0)
        break;
      case -2:
        console.log(orderSpeculatorSteps)
        moves.sendSpeculator(orderSpeculatorSteps);
        setOrderSpeculatorSteps([])
        setOrderStage(0)
        break;
      default:
        console.log('ERROR: ORDER STAGE BROKEN')
        break;
    }
  }

  // Note: This way of getting duxTile is bad as we need to use client player id, not ctx.currentPlayer
  const onMouseEnter = (tile) => {
    switch (orderStage) {
      case 0:
        const duxTile = G.players[ctx.currentPlayer].units[ctx.currentPlayer].tile
        setHoverTiles(line(duxTile[0], duxTile[1], tile[0], tile[1]))
        break;
      case 1:
        if (orderSteps.length > 0) {
          setHoverTiles(orderSteps.concat(line(orderSteps.at(-1)[0], orderSteps.at(-1)[1], tile[0], tile[1])))
        } else {
          setHoverTiles(line(orderUnit.tile[0], orderUnit.tile[1], tile[0], tile[1]))
        }
        break;
      case 2:
        if (orderSpeculatorSteps.length > 0) {
          setHoverTiles(orderSpeculatorSteps.concat(line(orderSpeculatorSteps.at(-1)[0], orderSpeculatorSteps.at(-1)[1], tile[0], tile[1])))
        } else {
          const duxTile = G.players[ctx.currentPlayer].units[ctx.currentPlayer].tile
          setHoverTiles(line(duxTile[0], duxTile[1], tile[0], tile[1]))
        }
        break;
      case -1:
        if (orderSteps.length > 0) {
          setHoverTiles(orderSteps.concat(line(orderSteps.at(-1)[0], orderSteps.at(-1)[1], tile[0], tile[1])))
        } else {
          setHoverTiles(line(orderUnit.tile[0], orderUnit.tile[1], tile[0], tile[1]))
        }
        break;
      case -2:
        setHoverTiles(orderSpeculatorSteps.concat(line(orderSpeculatorSteps.at(-1)[0], orderSpeculatorSteps.at(-1)[1], tile[0], tile[1])))
        break;
      default:
        console.log('ERROR: ORDER STAGE BROKEN')
        break;
    }
  }

  const setStyle = (i, j, spectator) => {
    if (hoverTiles.filter(tile => (tile[0] === i) && (tile[1] === j)).length > 0) {
      return tileStyleHover
    } else {
      if ((distance(i, j, G.players[ctx.currentPlayer].units[ctx.currentPlayer].tile[0], G.players[ctx.currentPlayer].units[ctx.currentPlayer].tile[1]) < 5) || (spectator)) {
        return tileStyle
      } else {
        return tileStyleDark
      }
    }
  }

  const getBoard = (units, speculatores, spectator) => {

    const tiles = new Array(9);
    for (var i = 0; i < 9; i++) {
      tiles[i] = new Array(9).fill({ unit: null, speculatores: null });
    }

    units.forEach((unit) => {
      tiles[unit.tile[0]][unit.tile[1]] = { unit: unit, speculatores: tiles[unit.tile[0]][unit.tile[1]].speculatores }
    })

    speculatores.forEach((speculator) => {
      if (speculator.tile !== null) {
        tiles[speculator.tile[0]][speculator.tile[1]] = { unit: tiles[speculator.tile[0]][speculator.tile[1]].unit, speculatores: speculator }
      }
    })

    let tbody = [];
    for (let i = 0; i < 9; i++) {
      let trow = [];
      for (let j = 0; j < 9; j++) {
        trow.push(
          <td key={([i, j])}
            style={setStyle(i, j, spectator)}
            onClick={() => onClick([i, j])}
            onMouseEnter={() => onMouseEnter([i, j])}
            onMouseLeave={() => setHoverTiles([])}>
            {(tiles[i][j].unit !== null) && `${tiles[i][j].unit.unitTypeShort}${tiles[i][j].unit.playerId}`}
            {((tiles[i][j].unit !== null) && !spectator) && `T${Math.floor((ctx.turn - tiles[i][j].unit.lastSeen) / ctx.numPlayers)}`}
            {(tiles[i][j].speculatores !== null) && ` s`}
            {/* {((tiles[i][j].speculatores !== null) && !spectator) && `T${Math.floor((ctx.turn - tiles[i][j].speculatores.lastSeen) / ctx.numPlayers)}`} */}
          </td>
        )
      }
      tbody.push(<tr key={i}>{trow}</tr>);
    }

    return tbody
  }

  const playerTbody = getBoard(G.players[ctx.currentPlayer].units, G.players[ctx.currentPlayer].speculatores, false)
  const secretTbody = getBoard(G.secret.units, G.secret.speculatores, true)

  return (
    <>
      <div>
        <table id="board">
          <tbody>{playerTbody}</tbody>
        </table>
        <button onClick={() => { events.endTurn() }}>End Turn</button>
        <button onClick={() => { onSubmitClick() }}>Submit Stage {orderStage}</button>
        {(orderUnit !== null) && <p>{orderUnit.unitTypeShort}{orderUnit.playerId}</p>}
      </div>

      <div style={{ position: 'absolute', left: 570, top: 0 }}>
        <table id="board">
          <tbody>{secretTbody}</tbody>
        </table>
      </div>
    </>
  );
}

export default InfoGameBoard