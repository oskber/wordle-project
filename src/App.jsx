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
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTime = () => {
    setIsRunning(true);
  };
  const stopTime = () => {
    setIsRunning(false);
  };

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  useEffect(() => {
    async function fetchWords() {
      const response = await fetch('/api/words');

      const payload = await response.json();
      setOriginalWordList(payload);
    }

    fetchWords();
  }, []);

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
        setGameOver({ gameOver: true, guessedWord: true });
        return;
      } else if (currentAttempt.attempt === 5) {
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
      const filteredListByUnique = originalWordList.words.filter(
        (word) => new Set(word).size === word.length
      );
      setUniqueLetters(true);
      setFilteredWordList({ words: filteredListByUnique });
      handleRandomWord(selectedLength, uniqueLetters);
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
    setTime(0);
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
        startTime={startTime}
      />
      <BoardGrid letters={letters} length={selectedLength} />
      <div className="stopwatch-container">
        <p className="stopwatch-time">
          {hours}:{minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}:
          {milliseconds.toString().padStart(2, '0')}
        </p>
      </div>{' '}
      {gameOver.gameOver ? (
        <GameOver
          gameOver={gameOver}
          correctWord={correctWord}
          currentAttempt={currentAttempt}
          onReset={handleOnReset}
          stopTime={stopTime}
        />
      ) : null}
    </div>
  );
}

export default App;

/* 
<div className="stopwatch-container">
      <p className="stopwatch-time">
        {hours}:{minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}:
        {milliseconds.toString().padStart(2, '0')}
      </p>
      <div className="stopwatch-buttons">
        <button className="stopwatch-button" onClick={startAndStop}>
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button className="stopwatch-button" onClick={reset}>
          Reset
        </button>
      </div>
    </div> */
