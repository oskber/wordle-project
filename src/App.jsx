import React, { useState, useEffect } from 'react';
import './App.css';
import BoardGrid from './components/BoardGrid';
import GuessInput from './components/GuessInput';
import LettersLength from './components/LettersLength';
import UniqueLetters from './components/UniqueLetters';

function App() {
  const [selectedLength, setSelectedLength] = useState(0);
  const [letters, setLetters] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [correctWord, setCorrectWord] = useState(['A', 'B', 'C', 'D', 'E']);

  useEffect(() => {
    setLetters([]);
    setCurrentRowIndex(0);
  }, [selectedLength]);

  function handleSelectedLength(length) {
    setSelectedLength(length);
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

  function handleOnFeedback(text, correctWord) {
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
    console.log(text, correctWord, result);
    return result;
  }

  return (
    <div className="App">
      <h1 className="mb-5 font-bold text-3xl">Wordle</h1>
      <div className="flex justify-center gap-5">
        <LettersLength onSelectLength={handleSelectedLength} />
        <UniqueLetters />
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
