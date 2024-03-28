import React, { useState, useEffect } from 'react';
import './App.css';
import BoardGrid from './components/BoardGrid';
import GuessInput from './components/GuessInput';
import LettersLength from './components/LettersLength';
import UniqueLetters from './components/UniqueLetters';
import StartGame from './components/StartGame';

function App() {
  const [selectedLength, setSelectedLength] = useState(3);
  const [selectedUnique, setSelectedUnique] = useState(true);
  const [selectedValue, setSelectedValue] = useState('true');
  const [letters, setLetters] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [correctWord, setCorrectWord] = useState('');
  const [wordList, setWordList] = useState({});

  useEffect(() => {
    async function fetchWords() {
      const response = await fetch('/api/words');

      const payload = await response.json();
      setWordList(payload);
    }

    fetchWords();
  }, []);

  useEffect(() => {
    if (wordList.length > 0) {
      handleSelectUnique(wordList, length);
    }
  }, [wordList]);

  useEffect(() => {
    setLetters([]);
    setCurrentRowIndex(0);
  }, [selectedLength]);

  function handleSelectedLength(selectedLength) {
    setSelectedLength(selectedLength);
  }

  function handleOnGuess(text) {
    if (!text || text.match(/[0-9]/)) return;
    const onGuess = text.split('');
    const feedback = handleOnFeedback(onGuess, correctWord);
    setLetters((prevLetters) => {
      const newLetters = [...prevLetters];
      newLetters[currentRowIndex] = feedback;
      return newLetters;
    });
    setCurrentRowIndex(currentRowIndex + 1);
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
    return result;
  }

  function handleSelectUnique(selectedValue) {
    if (selectedValue === 'true') {
      const updatedWords = wordList.words.filter(
        (word) => new Set(word).size === word.length
      );
      setSelectedValue(true);
      setSelectedUnique(true);
      setWordList({ words: updatedWords });
    } else {
      setSelectedValue(false);
      setSelectedUnique(false);
      setWordList({ words: wordList.words });
    }
  }

  function handleRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.words.length);
    const randomWord = wordList.words[randomIndex].split('');
    console.log('randomWord: ', randomWord);
    setCorrectWord(randomWord);
  }

  return (
    <div className="App">
      <h1 className="mb-5 font-bold text-3xl">Wordle</h1>
      <div className="flex justify-center gap-5">
        <LettersLength
          onSelectLength={handleSelectedLength}
          selectedValue={selectedLength}
        />
        <UniqueLetters
          onSelectedValue={selectedValue}
          onSelectUnique={handleSelectUnique}
        />
      </div>
      <StartGame
        onStart={handleRandomWord}
        onUnique={handleSelectUnique}
        selectedLength={handleSelectedLength}
      />
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
