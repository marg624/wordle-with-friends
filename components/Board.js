import utilStyles from '../styles/utils.module.css';
import React from 'react';
import {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  forwardRef
} from 'react';
import Row from './Row';
import BoardTask from './BoardTask';
import Confetti from 'react-confetti'
import { useAlert } from 'react-alert-with-buttons'
import { readGame, updateGame, evaluations } from '../utils/utils';

class Board extends React.Component {

  constructor(props) {
    super(props);
    const boardState1 = {
      0: {readOnly: !this.props.isFirst, guess: null, evaluation: null},
      1: {readOnly: true, guess: null, evaluation: null},
      2: {readOnly: true, guess: null, evaluation: null},
      3: {readOnly: true, guess: null, evaluation: null},
      4: {readOnly: true, guess: null, evaluation: null},
      5: {readOnly: true, guess: null, evaluation: null}
    };
    let alphabetState1 = {"A": "", "B":"", "C":"", "D":"", "E":"", "F":"", "G":"", "H":"", "I":"", "J":"", "K":"", "L":"", "M":"", "N":"", "O":"", "P":"", "Q":"", "R":"", "S":"", "T":"", "U":"", "V":"", "W":"", "X":"", "Y":"", "Z":""};
    let win1 = false
    let isSinglePlayer1 = this.props.isSinglePlayer;
    let winningWord1 = this.props.winningWord;
    let playerName1 = this.props.playerName;
    let gameId1 = this.props.gameId;
    let isFirst1 = this.props.isFirst;
    let player01 = null;
    let player11 = null;
    if (isFirst1) {
      player01 = playerName1;
    }
    this.state = {boardState: boardState1, alphabetState:alphabetState1, win:win1, isSinglePlayer:isSinglePlayer1, winningWord: winningWord1, playerName: playerName1, gameId: gameId1, isFirst: isFirst1, player0:player01, player1:player11, waitingFor:""};
    this.focusNext = this.focusNext.bind(this);
    this.updateState = this.updateState.bind(this);
    this.alphaHelper = this.alphaHelper.bind(this);
  }

  // reads game from DB and sees if other player played a word
  async updateState(meFirst) {
    if (!this.state.isSinglePlayer) {
      let game = await readGame(this.state.gameId);
      if (game == null) {return false;}

      if (this.state.player0 == null && game.player0 != null) {
        this.state.player0 = game.player0;
        this.setState(this.state);
      }

      if (this.state.player1 == null && game.player1 != null) {
        this.state.player1 = game.player1;
        this.setState(this.state);
      }


      if (this.state.player1 == null) {
        this.state.waitingFor = "another player to join"
      } else if ((game.guesses.length) % 2 == 0) { 
        if (this.state.waitingFor != game.player0) {
          this.state.waitingFor = game.player0;
          this.setState(this.state);
        }
      } else {
        if (this.state.waitingFor != game.player1) {
          this.state.waitingFor = game.player1;
          this.setState(this.state);
        }
      }
      
      for (let i = 0; i < game.guesses.length; i++) {
        let currWordGuess = this.state.boardState[i].guess;
        let dbGameGuess = game.guesses[i];       
        if (currWordGuess != null) {
          if (currWordGuess.toUpperCase() != dbGameGuess.toUpperCase()) {
            console.log("   Doesn't match with DB: (boardState)" + currWordGuess + " : (db)"+ dbGameGuess);
          } 
        } else {
          this.state.boardState[i].guess = dbGameGuess;
          let evaluationWord = evaluations(Object.assign([], dbGameGuess), this.state.winningWord, Object.assign([], this.state.winningWord)); 
          this.state.boardState[i].evaluation = evaluationWord;
          this.alphaHelper(dbGameGuess.toUpperCase(), evaluationWord);

          let correct = utilStyles.wordBoxCorrect;
          if (evaluationWord[0] == correct && evaluationWord[1] == correct && evaluationWord[2] == correct && evaluationWord[3] == correct && evaluationWord[4] == correct) {
              // check if it was my guess
            if (i % 2 == 0 && meFirst) { 
              this.state.win = true;
              this.setState(this.state);
              let tries = i+1;
              alert("Congrats, you win!\nYou guessed " + this.props.winningWord.toUpperCase() + " in " + tries + " tries.")  
            } else {
              let p = game.player1;
              if (meFirst) {
                p = game.player0;
              }
              alert("You lose! The word was " + this.props.winningWord.toUpperCase())
            }
            return true;
          } else if (i > 5) {
            alert("You both lose! The word was " + this.props.winningWord.toUpperCase());
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }

  focusNext(rowNum, guessedWord, evaluationWord) {
    let currRow = rowNum; 
    rowNum++; 
    let nextRow = rowNum;
    let newArr = { ... this.state.boardState };
    this.state.boardState[currRow].readOnly = true;
    this.state.boardState[currRow].guess = guessedWord;
    this.state.boardState[currRow].evaluation = evaluationWord;

    this.alphaHelper(guessedWord.toUpperCase(), evaluationWord);

    let correct = utilStyles.wordBoxCorrect;
    if (evaluationWord[0] == correct && evaluationWord[1] == correct && evaluationWord[2] == correct && evaluationWord[3] == correct && evaluationWord[4] == correct) {
      this.state.win = true;
      this.setState(this.state);
      alert("Congrats, you win!\nYou guessed " + this.props.winningWord.toUpperCase() + " in " + rowNum + " tries.")
    } else if (nextRow < 6) {
      if (this.state.isSinglePlayer) {
       this.state.boardState[nextRow].readOnly = false;
     }
     this.setState(this.state);
   } else {
    alert("You lose! The word was " + this.props.winningWord.toUpperCase())
  }
  this.state.boardState = newArr;
  this.setState(this.state);
}

alphaHelper(guessedWord, evaluationWord) {
  let newArr2 = { ... this.state.alphabetState };
  let correct = utilStyles.wordBoxCorrect;
  let present = utilStyles.wordBoxPresent;
  let absent = utilStyles.wordBoxAbsent;
  for (let i=0; i < 5; i++) {
    let letter = guessedWord.charAt(i);
    let evaluation = evaluationWord[i];
    let existingEvaluation = this.state.alphabetState[letter];
    if (existingEvaluation != "") {
      if ((existingEvaluation == correct) || (existingEvaluation == present && evaluation == absent)) {
                    // do nothing
      } else {
        newArr2[letter] = evaluation;
      }
    } else {
      newArr2[letter] = evaluation;
    }
  }
  this.state.alphabetState = newArr2;
  this.setState(this.state);
}


render() {
  this.updateState(this.props.isFirst);
  let even = true;
  let odd = false;  
  if (this.props.isSinglePlayer) {
    odd = true;
  } else if (!this.props.isFirst) {
    even = false;
    odd = true;
  }

  const Row0 = forwardRef((props, ref) => (
    <Row rowNum="0" ref={ref} gameId={this.props.gameId} winningWord={this.props.winningWord} boardState={this.state.boardState} updateStateFunc={this.updateState} focusNextFunc={this.focusNext} myName={this.props.playerName} isMyTurn={even} isSinglePlayer={this.props.isSinglePlayer} /> ));
  const Row1 = forwardRef((props, ref) => (
    <Row rowNum="1" ref={ref} gameId={this.props.gameId} winningWord={this.props.winningWord} boardState={this.state.boardState} updateStateFunc={this.updateState} focusNextFunc={this.focusNext} myName={this.props.playerName} isMyTurn={odd} isSinglePlayer={this.props.isSinglePlayer}  /> ));
  const Row2 = forwardRef((props, ref) => (
    <Row rowNum="2" ref={ref} gameId={this.props.gameId} winningWord={this.props.winningWord} boardState={this.state.boardState} updateStateFunc={this.updateState} focusNextFunc={this.focusNext} myName={this.props.playerName} isMyTurn={even} isSinglePlayer={this.props.isSinglePlayer}  /> ));
  const Row3 = forwardRef((props, ref) => (
    <Row rowNum="3" ref={ref} gameId={this.props.gameId} winningWord={this.props.winningWord} boardState={this.state.boardState} updateStateFunc={this.updateState} focusNextFunc={this.focusNext} myName={this.props.playerName} isMyTurn={odd} isSinglePlayer={this.props.isSinglePlayer}  /> ));
  const Row4 = forwardRef((props, ref) => (
    <Row rowNum="4" ref={ref} gameId={this.props.gameId} winningWord={this.props.winningWord} boardState={this.state.boardState} updateStateFunc={this.updateState} focusNextFunc={this.focusNext} myName={this.props.playerName} isMyTurn={even} isSinglePlayer={this.props.isSinglePlayer}  /> ));
  const Row5 = forwardRef((props, ref) => (
    <Row rowNum="5" ref={ref} gameId={this.props.gameId} winningWord={this.props.winningWord} boardState={this.state.boardState} updateStateFunc={this.updateState} focusNextFunc={this.focusNext} myName={this.props.playerName} isMyTurn={odd} isSinglePlayer={this.props.isSinglePlayer}  /> ));   

  let player0 = this.state.player0;
  let player1 = this.state.player1;

  return (
      <div className={utilStyles.center}> 
        {this.state.win && <Confetti run="false" />}
        Game ID: {this.props.gameId} <br/>
        Players: <br/>
        {player0} <br/>
        {player1} <br/>

        {!this.props.isSinglePlayer  &&  <em>waiting on {this.state.waitingFor}.... </em>}

        {!this.props.isSinglePlayer  &&  <BoardTask updateStateFunc={this.updateState} meFirst={this.props.isFirst} player0={player0}  player1={player1} /> }
        <Row0 /> 
        <Row1 />
        <Row2 /> 
        <Row3 /> 
        <Row4 />
        <Row5 /> 
        <br/><br/>
        <div className={utilStyles.center }><br/>
          {Object.keys(this.state.alphabetState).map((key, index) => {
            let addBreak = (index == 12) ? <br/> : ""
            let state1 = this.state.alphabetState[key]
            return ( 
             <span key={key}>
             <span className={utilStyles.alphabetBox + " " + state1}>{key}</span> 
             {addBreak}{addBreak}{addBreak}
             </span>
             );
          })}
        </div>  
      </div>
    );
}
}

export default Board;
