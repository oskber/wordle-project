import { useState, useEffect } from 'react'
import './App.css'
import BoardGrid from './components/BoardGrid'
import GuessInput from './components/GuessInput'
import LettersLength from './components/LettersLength';

function App() {
  const [selectedLength, setSelectedLength] = useState(0);
  const [letters, setLetters] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  useEffect(() => {
    setLetters([]);
    setCurrentRowIndex(0);
  }, [selectedLength]);

  function handleSelectedLength(length) {
    setSelectedLength(length);
  }

  function handleOnGuess(text) {
    if (!text) return;
    const onGuess = text.split("");
    setLetters(prevLetters => {
      const newLetters = [...prevLetters];
      newLetters[currentRowIndex] = onGuess;
      return newLetters;
    });
    setCurrentRowIndex(currentRowIndex + 1);
}

  return (
    <div className="App">
      <LettersLength onSelectLength={handleSelectedLength}/>
      <GuessInput onGuessInput={handleOnGuess} selectedLength={selectedLength} />
      <BoardGrid letters={letters} length={selectedLength}/>
    </div>
  )
}

export default App