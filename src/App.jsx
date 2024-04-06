import React, { useState, useEffect } from 'react';
import './App.css';
import BoardGrid from './components/BoardGrid';
import GuessInput from './components/GuessInput';
import LettersLength from './components/LettersLength';
import UniqueLetters from './components/UniqueLetters';
import Game from './components/Game';

function App({
  gameState,
  selectedLength,
  handleSelectedLength,
  uniqueLetters,
  handleOnGuess,
  handleOnFeedback,
  letters,
  handleOnReset,
}) {
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    const startGame = async () => {
      const res = await fetch('http://localhost:5080/api/games', {
        method: 'post',
      });
      const data = await res.json();
      setGameId(data.id);
    };

    startGame();
  }, []);

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
