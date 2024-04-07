import React, { useEffect, useState } from 'react';
import GuessInput from './GuessInput';
import BoardGrid from './BoardGrid';

export default function Game({
  gameId,
  selectedLength,
  setSelectedLength,
  uniqueLetters,
  setUniqueLetters,
}) {
  const [gameState, setGameState] = useState('playing');
  const [inputText, setInputText] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [result, setResult] = useState(null);
  const [name, setName] = useState('');
  const [letters, setLetters] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState({
    attempt: 0,
  });

  useEffect(() => {
    setFeedback([]);
  }, [selectedLength, uniqueLetters]);

  const handleSubmitGuess = async (inputText) => {
    setInputText('');

    const res = await fetch(`/api/games/${gameId}/guesses`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guess: inputText,
        length: selectedLength,
        uniqueLetters: uniqueLetters,
      }),
    });

    const data = await res.json();

    if (data.correct) {
      console.log(data.guesses);
      setResult(data.result);
      setGameState('won');
    }

    setGuesses((oldGuesses) => [
      ...oldGuesses,
      { guess: inputText, feedback: data.feedback },
    ]);
    setFeedback(data.feedback);
    console.log(data.feedback);
    setLetters(inputText.split(''));
    setCurrentRowIndex(currentRowIndex + 1);
    setCurrentAttempt({ attempt: currentAttempt.attempt + 1 });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const highscore = {
      name,
    };

    await fetch(`/api/games/${gameId}/highscore`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(highscore),
    });

    setGameState('end');
  };

  if (gameState === 'won') {
    const duration =
      (new Date(result.endTime) - new Date(result.startTime)) / 1000;
    return (
      <div className="game">
        <h1>Congrats!</h1>
        <p>The correct word was {guesses.at(-1)}</p>
        <p>Guesses: {guesses.length}</p>
        <p>Duration: {duration}s</p>
        <h2>Add to highscore</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Your name"
          />
          <input type="submit" />
        </form>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="select-none rounded bg-yellow-500 m-2 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-yellow-500/20 transition-all hover:shadow-lg hover:shadow-yellow-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-yellow-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none">
          reset
        </button>
      </div>
    );
  } else if (gameState === 'end') {
    return (
      <div className="Game">
        <h1>Done!</h1>
      </div>
    );
  }

  return (
    <div className="Game">
      <GuessInput
        inputText={inputText}
        setInputText={setInputText}
        selectedLength={selectedLength}
        handleSubmitGuess={handleSubmitGuess}
      />
      <BoardGrid
        letters={letters}
        selectedLength={selectedLength}
        feedback={feedback}
        guesses={guesses}
      />
    </div>
  );
}
