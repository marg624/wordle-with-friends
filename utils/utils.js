import utilStyles from '../styles/utils.module.css';
import dictionary from '../resources/5-letter-words.js';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY
  },
  region: process.env.NEXT_PUBLIC_REGION
});

export const getOccurrences = (letter, word) => {
    var count = (word.split(letter)).length - 1;
    return count;
}

export const evaluation = (index, wordArray, winningWord, winningWordArray) => {
    let letter = wordArray[index]
    // if letter is in the right spot - correct
    if (winningWordArray[index] == letter) {
        return utilStyles.wordBoxCorrect;
    }

    // if letter is there but wrong spot - present
    if (winningWord.includes(letter)) {
        var letterOccur = getOccurrences(letter, winningWord);
        var wordCut = wordArray.slice(0, index).join("");
        var letterSeen = getOccurrences(letter, wordCut);
        if (letterSeen < letterOccur) {
         return utilStyles.wordBoxPresent;
     }
 }

    // if letter is not there - absent
 return utilStyles.wordBoxAbsent;
}

export const evaluations = (wordArray, winningWord, winningWordArray) => {
    let evals = ['','','','',''];
    const word = wordArray.join("").toUpperCase();

    let i = 0;
    const state = evals.map((c, index) => {
        if (i === index) {
            let a = evaluation(i, wordArray, winningWord, winningWordArray);
            i++;
            return a;
        } else {
            i++;
            return c;
        }
    });

    return state;
}

export const isWord = (word) => {
    return dictionary.words.includes(word.toLowerCase()) || dictionary.words.includes(word.toUpperCase());
}

export const currTurn = (boardStateGuesses) => {
    for (let i=0; i < 6; i++) {
        if(boardStateGuesses[i].guess=="" || boardStateGuesses[i].guess==null) {
            return i;
        }
    }
    return null;
}

export const readGame = async(gameId) => {
    let { Item } = await client.send(
      new GetItemCommand({
        TableName: "game",
        Key: {
          id: { S: "g" + gameId}
        }
      })
    );
    if (Item == null || Item.content == null || Item.content.S == null) {
        return null;
    }
    return JSON.parse(Item.content.S);
}

export const createGame = async (gameId, word, player) => {
  const state = {
    player0: player,
    winningWord: word,
    guesses: []
    };
   let bodyJson = JSON.stringify(state)
   let { Item } = await client.send(
      new PutItemCommand({
        TableName: "game",
        Item: {
          id: { S: "g" + gameId },
          content: { S: bodyJson }
        }
      })
    );
    return Item;
}


export const updateGame = (gameId, playerName, guessedWord) => {
    let resp = true;
    updateGameHelper(gameId, playerName, guessedWord)
    .then(
        (response) => {
            resp = true;
        })
    .catch((err) => {
        resp = false;
    });  
    return resp;
}

export const updateGameHelper = async (gameId, playerName, guessedWord) => {
    let currJson = await readGame(gameId);
    // update player 2
    if (guessedWord == null && currJson.player1 == null) {
        currJson.player1 = playerName;
    } else if (guessedWord != null){
        let newData = [...currJson.guesses, guessedWord] 
        currJson.guesses = newData;
    }

    let bodyJson = JSON.stringify(currJson)
    let resp = true;

    let { Attributes } = await client.send(
      new UpdateItemCommand({
        TableName: "game",
        Key: {
          id: { S: "g" + gameId }
        },
        UpdateExpression: 'set content = :c',
        ExpressionAttributeValues: {
          ':c': { S: bodyJson }
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    return Attributes;
}


