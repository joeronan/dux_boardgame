import React from 'react';
import { distance } from './Constants.js'

const tileStyle = {
  border: '1px solid #555',
  width: '50px',
  height: '50px',
  lineHeight: '50px',
  textAlign: 'center',
};

const tileStyleDark = Object.assign({}, tileStyle, { backgroundColor: '#ccc' })

const InfoGameBoard = ({ ctx, G, moves, events }) => {

  const [orderStage, setOrderStage] = React.useState(0)
  const [orderUnit, setOrderUnit] = React.useState(null)
  const [orderSteps, setOrderSteps] = React.useState([])
  const [orderMessengerSteps, setOrderMessengerSteps] = React.useState([])

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
          // Handle if they haven't clicked a tile with a person on it
        }
        break;
      case 1:
        setOrderSteps(orderSteps.concat([tile]))
        break;
      case 2:
        setOrderMessengerSteps(orderMessengerSteps.concat([tile]))
        setOrderStage(0)
        break;
      case -1:
        setOrderSteps(orderSteps.concat([tile]))
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
        moves.sendOrder(orderUnit, orderSteps, orderMessengerSteps);
        setOrderUnit(null)
        setOrderSteps([])
        setOrderMessengerSteps([])
        setOrderStage(0)
        break;
      case -1:
        moves.moveDux(orderUnit, orderSteps);
        setOrderUnit(null)
        setOrderSteps([])
        setOrderMessengerSteps([])
        setOrderStage(0)
        break;
    }
  }

  const getBoard = (units, spectator) => {

    const tiles = new Array(9);
    for (var i = 0; i < 9; i++) {
      tiles[i] = new Array(9).fill({ unit: null });
    }

    units.forEach((unit) => {
      tiles[unit.tile[0]][unit.tile[1]] = { unit: unit }
    })

    let tbody = [];
    for (let i = 0; i < 9; i++) {
      let trow = [];
      for (let j = 0; j < 9; j++) {
        trow.push(
          <td key={([i, j])}
            style={(distance(i, j, G.players[ctx.currentPlayer].units[ctx.currentPlayer].tile[0], G.players[ctx.currentPlayer].units[ctx.currentPlayer].tile[1]) < 5) || (spectator) ? tileStyle : tileStyleDark}
            onClick={() => onClick([i, j])}>
            {(tiles[i][j].unit !== null) && `${tiles[i][j].unit.unitTypeShort}${tiles[i][j].unit.playerId}`}
            {((tiles[i][j].unit !== null) && !spectator) && `T${Math.floor((ctx.turn - tiles[i][j].unit.lastSeen) / ctx.numPlayers)}`}
          </td>
        )
      }
      tbody.push(<tr key={i}>{trow}</tr>);
    }

    return tbody
  }

  const playerTbody = getBoard(G.players[ctx.currentPlayer].units, false)
  const secretTbody = getBoard(G.secret.units, true)

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