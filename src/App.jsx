import React, { useState, useEffect } from 'react';
import './App.css';
import BoardGrid from './components/BoardGrid';
import GuessInput from './components/GuessInput';
import LettersLength from './components/LettersLength';
import UniqueLetters from './components/UniqueLetters';
import GameOver from './components/GameOver';

function App() {
  const [selectedLength, setSelectedLength] = useState(5);
  const [uniqueLetters, setUniqueLetters] = useState(false);
  const [letters, setLetters] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [correctWord, setCorrectWord] = useState([]);
  const [originalWordList, setOriginalWordList] = useState({});
  const [filteredWordList, setFilteredWordList] = useState({});
  const [currentAttempt, setCurrentAttempt] = useState({
    attempt: 0,
  });
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });

  useEffect(() => {
    async function fetchWords() {
      const response = await fetch('/api/words');

      const payload = await response.json();
      setOriginalWordList(payload);
    }

    fetchWords();
  }, []);

  useEffect(() => {
    function waitOnReset() {
      setTimeout(() => {
        console.log('waited 1 seconds');

        handleRandomWord(selectedLength, uniqueLetters);
      }, 1000);
    }
    waitOnReset();
  }, [originalWordList]);

  useEffect(() => {
    if (originalWordList.length > 0) {
      handleSelectUnique(originalWordList, length);
    }
  }, [originalWordList]);

  useEffect(() => {
    setLetters([]);
    setCurrentRowIndex(0);
  }, [selectedLength]);

  function handleSelectedLength(selectedLength) {
    const filteredListByLength = originalWordList.words.filter(
      (word) => word.length === selectedLength
    );
    setSelectedLength(selectedLength);
    setFilteredWordList({ words: filteredListByLength });
    handleRandomWord(selectedLength, uniqueLetters);
  }

  function handleOnGuess(guessedWord) {
    if (guessedWord.match(/[A-Z]/)) {
      const onGuess = guessedWord.split('');
      const feedback = handleOnFeedback(onGuess, correctWord);
      setLetters((prevLetters) => {
        const newLetters = [...prevLetters];
        newLetters[currentRowIndex] = feedback;
        return newLetters;
      });
      setCurrentRowIndex(currentRowIndex + 1);
      setCurrentAttempt({ attempt: currentAttempt.attempt + 1 });

      if (currentAttempt.attempt < 5 && guessedWord === correctWord.join('')) {
        console.log('You guessed the word!');
        setGameOver({ gameOver: true, guessedWord: true });
        return;
      } else if (currentAttempt.attempt === 5) {
        console.log('Game Over');
        setGameOver({ gameOver: true, guessedWord: false });
        setCurrentAttempt({ attempt: 0 });
        return;
      } else {
        return;
      }
    }
  }

  function handleOnFeedback(guessedWord) {
    let result = [];
    let duplicateCounter = 0;
    for (let i = 0; i < guessedWord.length; i++) {
      if (correctWord[i] === guessedWord[i]) {
        result.push({ letter: guessedWord[i], result: 'correct' });
      } else if (correctWord.includes(guessedWord[i])) {
        if (
          guessedWord.filter((char) => char === guessedWord[i]).length >
          correctWord.filter((char) => char === guessedWord[i]).length +
            duplicateCounter
        ) {
          duplicateCounter++;
          result.push({ letter: guessedWord[i], result: 'incorrect' });
        } else {
          result.push({ letter: guessedWord[i], result: 'misplaced' });
        }
      } else {
        result.push({ letter: guessedWord[i], result: 'incorrect' });
      }
    }
    console.log('result: ', result);
    return result;
  }

  function handleSelectUnique(uniqueLetters) {
    if (uniqueLetters === true) {
      const updatedWords = originalWordList.words.filter(
        (word) => new Set(word).size === word.length
      );
      setUniqueLetters(true);
      setFilteredWordList({ words: updatedWords });
      handleRandomWord();
    }
  }

  function handleRandomWord(selectedLength, uniqueLetters) {
    const filteredWords = originalWordList.words.filter(
      (word) =>
        word.length === selectedLength &&
        (uniqueLetters === true ? new Set(word).size === word.length : true)
    );

    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const randomWord = filteredWords[randomIndex].toUpperCase().split('');
      setCorrectWord(randomWord);
    } else {
      console.log('No words of the selected length and uniqueness');
    }
  }

  function handleOnReset() {
    setGameOver({ gameOver: false, guessedWord: false });
    setCurrentAttempt({ attempt: 0 });
    setCurrentRowIndex(0);
    setLetters([]);
  }

  //CONSOLE LOGS
  useEffect(() => {
    console.log('original: ', originalWordList);
  }, [originalWordList]);
  useEffect(() => {
    console.log('filtered: ', filteredWordList);
  }, [filteredWordList]);
  useEffect(() => {
    console.log('correctword: ', correctWord);
  }, [correctWord]);

  useEffect(() => {
    console.log('currentattempt: ', currentAttempt);
  }, [currentAttempt]);

  //END CONSOLE LOGS

  return (
    <div className="App">
      <h1 className="mb-5 font-bold text-3xl">Wordle</h1>
      <div className="flex justify-center gap-5">
        <LettersLength
          onSelectLength={handleSelectedLength}
          selectedValue={selectedLength}
        />
        <UniqueLetters
          onSelectedValue={uniqueLetters}
          onSelectUnique={handleSelectUnique}
        />
      </div>

      <GuessInput
        onGuessInput={handleOnGuess}
        selectedLength={selectedLength}
        onFeedback={handleOnFeedback}
      />
      <BoardGrid letters={letters} length={selectedLength} />
      {gameOver.gameOver ? (
        <GameOver
          gameOver={gameOver}
          correctWord={correctWord}
          currentAttempt={currentAttempt}
          onReset={handleOnReset}
        />
      ) : null}
    </div>
  );
}

export default App;
