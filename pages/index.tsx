import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'
import React, {useState} from 'react';
import StartGame from '../components/start-game'
import utilStyles from '../styles/utils.module.css';
import dictionary from '../resources/5-letter-words.js';
import Board from '../components/Board';
import InitialOptions from '../components/InitialOptions';
import logo from '../resources/logo.png';
import refresh from '../resources/refresh.png';
import { readGame, createGame, updateGame } from '../utils/utils';
import * as uuid from 'uuid';
import OptionsButton from '../components/options-button'


const gameIdCreate = Math.floor(Math.random() * 5758);
const winningWordCreate = dictionary.words[gameIdCreate];

export default function Index() {

  const [initialState, setInitialState] = useState(null);
  const [ready, setReady] = useState(false);


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

  function hitReady() {
    setReady(true)
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Wordle w/ friends</title>
        </Head>
        <Container>
          <Intro />
          { (ready && initialState) && <Board winningWord={initialState["winningWord"]} gameId={initialState["gameId"]} isSinglePlayer={initialState["singlePlayer"]} playerName={initialState["playerName"]}  isFirst={initialState["isFirst"]} /> }
          { (ready && !initialState) && <InitialOptions startGame={startGame} /> }
          { !ready && <StartGame onClick={hitReady} /> }
          <OptionsButton />
        </Container>
      </Layout>
    </>
    )
}


