import utilStyles from '../styles/utils.module.css';
import { evaluations, isWord, updateGame, readGame, currTurn } from '../utils/utils';
import {
  useState,
  useRef,
  useEffect
} from 'react';


function Row(props) {
  const winningWord = props.winningWord;
  const winningWordArray = Object.assign([], winningWord);
  const currRowNum = props.rowNum;
  const boardStateReadOnly = props.boardState[currRowNum].readOnly;
  const boardStateGuess = props.boardState[currRowNum].guess;
  const boardStateEvaluation = props.boardState[currRowNum].evaluation;
  const myName = props.myName;
  const gameId = props.gameId;
  const isSinglePlayer = props.isSinglePlayer;

  const [textArray, setTextArray] = useState(['', '', '', '', '']);
  const next0 = useRef();
  const next1 = useRef();
  const next2 = useRef();
  const next3 = useRef();
  const next4 = useRef();
  const row0 = useRef({ 0: next0, 1: next1, 2: next2, 3: next3, 4: next4 });
  const [evalArray0, setEvalArray0] = (boardStateEvaluation) ? useState(boardStateEvaluation) : useState(['', '', '', '', '']);
  const [evals, setEvals] = useState(['','','','','']);
  let [readOnly, setReadOnly] = useState(boardStateReadOnly === true);
  const guess = Object.assign([], boardStateGuess);

  useEffect(() => {
    if (props.isMyTurn && currTurn(props.boardState) == currRowNum) {
      setReadOnly(false);
      if (!readOnly && !next0.current.value) {
        next0.current.focus();
      }
    }
  });

  function handleKeyDown(e, index) {
    handleOps(e, index, row0, currRowNum, true)
  }

  function handleKeyPress(e, index) {
    handleOps(e, index, row0, currRowNum, false)
  }

  function handleOnChange(e, index) {
    handleOps(e, index, row0, currRowNum, false)
  }

  function handleOps(e, index, row, rowNum, isKeyDown) {
        // reset evaluations 
    let ev2 = setEmptyEvals();
    setEvalArray0(ev2);

    const refPrev = (index == 0) ? row.current[index] : row.current[index - 1];
    const refNext = (index == 4) ? row.current[index] : row.current[index + 1];

    var regex = /[a-zA-Z]/;
    let val = e.target.value;

        // if they submitted a word, then validate it
    if ((index == 4) && e.charCode == 13 || e.keyCode == 13) {
      const stringData = textArray.join("");
      if (isWord(stringData)) {
        let ev = evaluations(textArray, winningWord, winningWordArray);
        setEvalArray0(ev);
        let resp = true;
        if (!isSinglePlayer) {
          resp = updateGame(gameId, myName, stringData);
        }
        if (resp) {
          props.focusNextFunc(rowNum, stringData.toUpperCase(), ev);
        }
      } else {
        let ev = setNotAWordEvals();
        setEvalArray0(ev);
      }
    } else if (isKeyDown) {
          // delete logic - need to change the focus to previous cell
      if (e.key == 'Backspace') {
        if (regex.test(val)) {
          let newArr = [...textArray];
          newArr[index] = '';
          setTextArray(newArr);
        } else if (val == '') {
          let newArr = [...textArray];
          newArr[index] = val;
          setTextArray(newArr);
          refPrev.current.focus();
        } 
      } else if (regex.test(val) && regex.test(textArray[index])) {
        refNext.current.focus();
      }
    } else {
      if (regex.test(val)) {
        let newArr = [...textArray];
        newArr[index] = val;
        setTextArray(newArr);
        refNext.current.focus();
      }
    }
  }


  function setEmptyEvals() {
    const state = evals.map((c, index) => {
      return "";
    });
    setEvals(state);
    return state;
  }

  function setNotAWordEvals() {
    const state = evals.map((c, index) => {
      return utilStyles.wordNotValidShake;
    });
    setEvals(state);
    return state;
  }


  return ( 
    <div>
      <input maxLength="1" type="text" value={guess[0]} className={utilStyles.wordBox + " " + evalArray0[0]} ref={next0} readOnly={readOnly} onChange={(e) => handleOnChange(e, 0)} onKeyDown={(e) => handleKeyDown(e, 0)}  />
      <input maxLength="1" type="text" value={guess[1]} className={utilStyles.wordBox + " " + evalArray0[1]} ref={next1} readOnly={readOnly} onChange={(e) => handleOnChange(e, 1)} onKeyDown={(e) => handleKeyDown(e, 1)} />
      <input maxLength="1" type="text" value={guess[2]} className={utilStyles.wordBox + " " + evalArray0[2]} ref={next2} readOnly={readOnly} onChange={(e) => handleOnChange(e, 2)} onKeyDown={(e) => handleKeyDown(e, 2)} />
      <input maxLength="1" type="text" value={guess[3]} className={utilStyles.wordBox + " " + evalArray0[3]} ref={next3} readOnly={readOnly} onChange={(e) => handleOnChange(e, 3)} onKeyDown={(e) => handleKeyDown(e, 3)} />
      <input maxLength="1" type="text" value={guess[4]} className={utilStyles.wordBox + " " + evalArray0[4]} ref={next4} readOnly={readOnly} onChange={(e) => handleOnChange(e, 4)} onKeyPress={(e) => handleKeyPress(e, 4)} onKeyDown={(e) => handleKeyDown(e, 4)} />
    </div>
    )
  }

  export default Row;