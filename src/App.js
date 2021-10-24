import { Client } from 'boardgame.io/react';
import { InfoGame } from './Game';
import InfoGameBoard from './Board';

const App = Client({
  game: InfoGame,
  board: InfoGameBoard,
});

export default App;