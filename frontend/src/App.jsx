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
    return (
      <div class="flex items-center justify-center">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed"
          disabled="">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </button>
      </div>
    );
  }
}

export default App;
