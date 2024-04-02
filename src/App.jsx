import React, { useState, useEffect } from 'react';
import './App.css';
import BoardGrid from './components/BoardGrid';
import GuessInput from './components/GuessInput';
import LettersLength from './components/LettersLength';
import UniqueLetters from './components/UniqueLetters';

function App() {
  const [selectedLength, setSelectedLength] = useState(5);
  const [uniqueLetters, setUniqueLetters] = useState(true);
  const [letters, setLetters] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [correctWord, setCorrectWord] = useState([]);
  const [originalWordList, setOriginalWordList] = useState({});
  const [filteredWordList, setFilteredWordList] = useState({});

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

  function handleOnGuess(text) {
    if (text.match(/[A-Z]/)) {
      const onGuess = text.split('');
      const feedback = handleOnFeedback(onGuess, correctWord);
      setLetters((prevLetters) => {
        const newLetters = [...prevLetters];
        newLetters[currentRowIndex] = feedback;
        return newLetters;
      });
      setCurrentRowIndex(currentRowIndex + 1);
    } else {
      return;
    }
  }

  function handleOnFeedback(text) {
    let result = [];
    let duplicateCounter = 0;
    for (let i = 0; i < text.length; i++) {
      if (correctWord[i] === text[i]) {
        result.push({ letter: text[i], result: 'correct' });
      } else if (correctWord.includes(text[i])) {
        if (
          text.filter((char) => char === text[i]).length >
          correctWord.filter((char) => char === text[i]).length +
            duplicateCounter
        ) {
          duplicateCounter++;
          result.push({ letter: text[i], result: 'incorrect' });
        } else {
          result.push({ letter: text[i], result: 'misplaced' });
        }
      } else {
        result.push({ letter: text[i], result: 'incorrect' });
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
    </div>
  );
}

export default App;
