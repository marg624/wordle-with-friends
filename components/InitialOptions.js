import { useState } from 'react';
import utilStyles from '../styles/utils.module.css';
import { readGame } from '../utils/utils';


function InitialOptions(props) {
  const [player, setPlayer] = useState("Player" + Math.floor(Math.random() * 1000000));

  const handleSumbitExisting = (event) => {
    event.preventDefault();
    const gameId = prompt('Please enter id of game to join')
    const re = /^[0-9\b]+$/;
    console.log("game id entered: " + gameId)
    let id = gameId
    let resp = readGame(id);
    if (resp == null) {
      resp = readGame(id);
    }
    if (re.test(id)) { 
      props.startGame(id, false, player);
    } else {
      alert("Invalid Game Id: " + id + ". Must contain only numbers.")
    }
  }

  const handleSumbitNewGame = (event) => {
    props.startGame(null, false, player);
  }

  const handleSumbitNewGameSingle = (event) => {
    props.startGame(null, true, player);
  }

  return (
    <div className={utilStyles.center}>Welcome!<br/><br/>
      Player Name:
      <input className={utilStyles.inputBox} type="text" value={player} onChange={(e) => setPlayer(e.target.value)} />
      <br/><br/>Please choose a play option from the following:
      <table className={utilStyles.tableStyle}> <tbody>
        <tr>
          <th> 
            <button className={utilStyles.button} onClick={handleSumbitNewGame}>
              Create New Game
            </button>
          </th> 
        </tr>
        <tr>
          <th> 
            <button className={utilStyles.button} onClick={handleSumbitExisting}>
              Join Existing Game
            </button>
          </th> 
        </tr>
        <tr>
          <th> 
            <button className={utilStyles.button} onClick={handleSumbitNewGameSingle}>
              Play Solo
            </button>
          </th>
        </tr>
      </tbody></table>
    </div>
    );

}



export default InitialOptions;