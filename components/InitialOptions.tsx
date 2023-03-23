import { useState } from 'react';
import utilStyles from '../styles/utils.module.css';
import { readGame } from '../utils/utils';
import mainImage from '../public/assets/cover.png';


function InitialOptions(props) {
  const [player, setPlayer] = useState("Player" + Math.floor(Math.random() * 1000000));

  const handleSumbitExisting = async(event) => {
    event.preventDefault();
    const gameId = prompt('Please enter id of game to join')
    const re = /^[0-9\b]+$/;
    let id = gameId
    let resp = await readGame(id);
    if (resp == null) {
      id = await readGame(id);
    }

    if (re.test(id)) { 
      props.startGame(id, false, player);
    } else {
      alert("Invalid Game Id: " + gameId + "\nPlease create a new game.")
    }
  }

  const handleSumbitNewGame = (event) => {
    props.startGame(null, false, player);
  }

  const handleSumbitNewGameSingle = (event) => {
    props.startGame(null, true, player);
  }

  return (
    <div className="flex justify-center" >
      <h1 className="text-7md mb-4 leading-snug">
        <img src={mainImage.src} width="100%" className="opacity-100" /> 
        <div className="bg-white bg-opacity-50" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%'
        }}>

    <div className={utilStyles.center}><br/>
      1. Player Name:
      
      <input className={utilStyles.inputBox} type="text" value={player} onChange={(e) => setPlayer(e.target.value)} />
       <br/> 2. Please choose a play option from the following: <br/><br/> 

      <div className="flex justify-center">
      <table className="{utilStyles.tableStyle}"> <tbody>
        <tr>

          <th className="justify-between ">  
            <span className="inline-block align-middle ">
             [ w/ friends ]</span>
            <div className="text-center flex space-x-4 py-4">

              <button className={utilStyles.button} onClick={handleSumbitNewGame}>
                Create New Game
              </button> 
              <button className={utilStyles.button} onClick={handleSumbitExisting}>
                Join Existing Game
              </button>

            </div>
          </th> 
        </tr>  
        <tr>
          <th className="text-center justify-between"> 
            <br/><em>OR </em> 
          </th> 
        </tr>
        <tr>
          <th className="justify-between py-9">  
            <span className="inline-block align-middle ">
             [ alone ]</span>
            <div className="text-center space-y-4 py-4">
              <button className={utilStyles.button} onClick={handleSumbitNewGameSingle}>
                Play Solo
              </button>

             </div> 
          </th>
          </tr>
      </tbody></table>

      </div>
    </div>

      </div> 
      </h1>
    </div>  
    );

}



export default InitialOptions;