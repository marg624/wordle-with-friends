    import { useState } from 'react';
    import utilStyles from '../styles/utils.module.css';
    import dictionary from '../resources/5-letter-words.js';
    import Board from '../components/Board';
    import InitialOptions from '../components/InitialOptions';
    import logo from '../resources/logo.png';
    import refresh from '../resources/refresh.png';
    import { readGame, createGame, updateGame } from '../utils/utils';
    import * as uuid from 'uuid';


    const gameIdCreate = Math.floor(Math.random() * 5758);
    const winningWordCreate = dictionary.words[gameIdCreate];

    export default function Index() {
      const [initialState, setInitialState] = useState(null);

      function newGame() {
        window.location.reload(false);
      }

      function startGame(gameId, isSinglePlayer, playerName) {
          let newArr = gameId ? {"gameId":gameId, "winningWord":dictionary.words[gameId].toUpperCase(), "singlePlayer":isSinglePlayer, "playerName":playerName, "isFirst":false} 
                              : {"gameId":gameIdCreate, "winningWord":winningWordCreate.toUpperCase(), "singlePlayer":isSinglePlayer, "playerName":playerName, "isFirst":true};
          if (!isSinglePlayer) {
              if (gameId) {
                // join existing game
                updateGame(gameId, playerName, null);
              } else {
                // create game
                createGame(gameIdCreate, winningWordCreate.toUpperCase(), playerName);
              }
          }
          setInitialState(newArr);
      }

      return ( <div className={utilStyles.center}>  <meta name="viewport" content="width=device-width, initial-scale=1" />
        <span className={utilStyles.left}><button className={utilStyles.noStyle} title="refresh" onClick={newGame}><img src={refresh.src} height="25" /></button> </span> 
        <img src={logo.src} width="160" /> <div className={utilStyles.topLine} /> <br/>
        { initialState && <Board winningWord={initialState["winningWord"]} gameId={initialState["gameId"]} isSinglePlayer={initialState["singlePlayer"]} playerName={initialState["playerName"]}  isFirst={initialState["isFirst"]} /> }
        { !initialState && <InitialOptions startGame={startGame} />}
    </div> )
}
