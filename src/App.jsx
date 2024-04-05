import React, { useState, useEffect } from 'react';
import './App.css';
import BoardGrid from './components/BoardGrid';
import GuessInput from './components/GuessInput';
import LettersLength from './components/LettersLength';
import UniqueLetters from './components/UniqueLetters';
import Game from './components/Game';
function App({ gameState }) {
  const [gameId, setGameId] = useState(null);

  const [selectedLength, setSelectedLength] = useState(5);
  const [uniqueLetters, setUniqueLetters] = useState(false);
  const [letters, setLetters] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [correctWord, setCorrectWord] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState({
    attempt: 0,
  });
  const [guessedWords, setGuessedWords] = useState([]);

  useEffect(() => {
    const startGame = async () => {
      const res = await fetch('http://localhost:5080/api/games', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueLetters: true,
          length: 5,
        }),
      });
      const data = await res.json();
      setGameId(data.id);
    };

    startGame();
  }, []);
  function handleSelectedLength(selectedLength) {
    const filteredListByLength = WORDS.filter(
      (word) => word.length === selectedLength
    );
    handleOnReset();
    setSelectedLength(selectedLength);
  }

  function handleOnGuess(guessedWord) {
    const uppercaseWordlist = WORDS.map((word) => word.toUpperCase());
    if (guessedWord.match(/[A-Z]/) && uppercaseWordlist.includes(guessedWord)) {
      const onGuess = guessedWord.split('');
      const feedback = handleOnFeedback(onGuess, correctWord);
      setLetters((prevLetters) => {
        const newLetters = [...prevLetters];
        newLetters[currentRowIndex] = feedback;
        return newLetters;
      });
      setCurrentRowIndex(currentRowIndex + 1);
      setCurrentAttempt({
        attempt: currentAttempt.attempt + 1,
      });
      setGuessedWords([...guessedWords, guessedWord]);

      if (currentAttempt.attempt < 5 && guessedWord === correctWord.join('')) {
        return;
      } else if (currentAttempt.attempt === 5) {
        setCurrentAttempt({ attempt: 0 });
        return;
      } else {
        return;
      }
    } else {
      alert('Please enter a valid word');
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
    return result;
  }

  function handleOnReset() {
    setCurrentAttempt({ attempt: 0 });
    setCurrentRowIndex(0);
    setLetters([]);
    setGuessedWords([]);
  }

  if (!gameId) {
    return (
      <div className="App">
        <h1 className="mb-5 font-bold text-3xl">Wordle</h1>
        <div className="flex justify-center gap-5">
          <LettersLength
            onSelectLength={handleSelectedLength}
            selectedValue={selectedLength}
          />
          <UniqueLetters onSelectedValue={uniqueLetters} />
        </div>
        <GuessInput
          onGuessInput={handleOnGuess}
          selectedLength={selectedLength}
          onFeedback={handleOnFeedback}
        />
        <BoardGrid letters={letters} length={selectedLength} />

        {gameState === 'won' && <Game onReset={handleOnReset} />}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
