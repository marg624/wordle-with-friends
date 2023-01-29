import { useState } from 'react';
import utilStyles from '../styles/utils.module.css';
import readGame from '../utils/utils';


function InitialOptions(props) {

  const [gameId, setGameId] = useState("");
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  const [player, setPlayer] = useState("");

  const handleSumbitExisting = (event) => {
    event.preventDefault();
    const re = /^[0-9\b]+$/;
    console.log(`game id entered: ${gameId}`)
    let id = gameId
    let resp = readGame(id);
    if (re.test(id)) { 
      props.startGame(id, false, player);
    } else {
      alert("Invalid Game Id: " + id + ". Must contain only numbers.")
    }
  }

  const handleSumbitNewGame = (event) => {
    props.startGame(null, isSinglePlayer, player);
  }

  return (
    <div className={utilStyles.center}>Welcome!<br/><br/>
      Player Name:
      <input className={utilStyles.inputBox} type="text" value={player} onChange={(e) => setPlayer(e.target.value)} />
      <br/><br/>Please choose a play option from the following:

      <table className={utilStyles.tableStyle}> <tbody>
        <tr>
        <td>
          <form className={utilStyles.formStyle} onSubmit={handleSumbitNewGame}>
          <label> 
          <input className={utilStyles.inputBox} type="checkbox" value={isSinglePlayer} onChange={(e) => setIsSinglePlayer(e.target.checked)}/>
          </label> Single Player Mode <br/>
          <input className={utilStyles.button} type="submit" value="New Game" />
          </form> 
        </td> 
        <th> OR </th>
        <th>
          <form className={utilStyles.formStyle} onSubmit={handleSumbitExisting}>
          <input className={utilStyles.inputBox} type="text" value={gameId} onChange={(e) => setGameId(e.target.value)} /><br/>
          <input className={utilStyles.button} type="submit" value="Join Existing Game" />
          </form> 
        </th> 
        </tr>
      </tbody></table>
    </div>
    );

}


export default InitialOptions;