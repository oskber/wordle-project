import React, { useState, useEffect } from 'react';
import './App.css';
import BoardGrid from './components/BoardGrid';
import GuessInput from './components/GuessInput';
import LettersLength from './components/LettersLength';
import UniqueLetters from './components/UniqueLetters';
import Game from './components/Game';

function App({}) {
  const [gameId, setGameId] = useState(null);
  const [uniqueLetters, setUniqueLetters] = useState(false);
  const [selectedLength, setSelectedLength] = useState(5);
  const [inputText, setInputText] = useState('');
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const startGame = async () => {
      try {
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

        if (!res.ok) {
          console.error(`Server responded with status ${res.status}`);
          const errorBody = await res.text();
          console.error(`Server responded with body ${errorBody}`);
          return;
        }

        const data = await res.json();
        setGameId(data.id);
      } catch (error) {
        console.error('Error:', error);
      }
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
        <GuessInput
          onGuessInput={setInputText}
          onWordLengthChange={selectedLength}
        />
        <BoardGrid letters={letters} length={selectedLength} />

        <Game gameId={gameId} />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
