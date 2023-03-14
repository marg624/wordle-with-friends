import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import React, {useState} from 'react'
import howtoGray from '../public/assets/howto/gray.png';
import howtoGreen from '../public/assets/howto/green.png';
import howtoYellow from '../public/assets/howto/yellow.png';


const HowTo = () => {

  return (
           <div>
              <h3 className="text-3xl mb-4 leading-snug">
              How To Play
              </h3>
              <h2 className="text-xl mb-2 leading-snug">
              Choose play style.
              </h2>

              1. <strong>[w/ friends]</strong><br/> This is the multiplayer version. You can either create a new game to then share the game id with a friend OR join an existing game by entering a game id when prompted. Once the game is started, players will take turn guessing on the board.
              <br/> 
              2. <strong>[alone]</strong><br/> This is the single player version. Like the classic Wordle, you will be guessing solo at your leisure.


              <h2 className="text-xl mb-2 leading-snug">
              <br/>Make A Guess
              </h2>
              Guess a 5 letter word on your turn. There are 6 turns total. The board tiles will change colors based on how close your guess is to the winning word.
              <br/> <br/> <strong>For example:</strong>
              <br/>
                <img src={howtoGreen.src} width="200px" />  <strong>E</strong> is in the word and in the corrent spot.
              <br/>
              <img src={howtoYellow.src} width="200px"  />   <strong>S</strong> is in the word but in the wrong spot.
              <br/>
              <img src={howtoGray.src} width="200px"  /> <strong>S, O, U, R</strong> are not in the word in any spot.
              <br/>

          </div>
  )
}

export default HowTo
