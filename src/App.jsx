import React, { useState, useEffect } from 'react';
import './App.css';
import LettersLength from './components/LettersLength';
import UniqueLetters from './components/UniqueLetters';
import Game from './components/Game';

function App({}) {
  const [gameId, setGameId] = useState(null);
  const [uniqueLetters, setUniqueLetters] = useState(false);
  const [selectedLength, setSelectedLength] = useState(5);

  useEffect(() => {
    const startGame = async () => {
      const res = await fetch('/api/games', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length: selectedLength,
          uniqueLetters: uniqueLetters,
        }),
      });

      const data = await res.json();
      setGameId(data.id);
    };

    startGame();
  }, [uniqueLetters, selectedLength]);

  if (gameId) {
    return (
      <div className="App">
        <h1 className="mb-5 font-bold text-3xl">Wordle</h1>
        <div className="flex justify-center gap-5">
          <LettersLength onWordLengthChange={setSelectedLength} />
          <UniqueLetters onUniqueLettersChange={setUniqueLetters} />
        </div>

        <Game
          gameId={gameId}
          selectedLength={selectedLength}
          onWordLengthChange={setSelectedLength}
          uniqueLetters={uniqueLetters}
          onUniqueLettersChange={setUniqueLetters}
        />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
