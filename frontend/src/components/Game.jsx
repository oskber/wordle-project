import React, { useEffect, useState } from 'react';
import GuessInput from './GuessInput';
import BoardGrid from './BoardGrid';

export default function Game({ gameId, selectedLength, uniqueLetters }) {
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

  const handleSubmitGuess = async (inputText) => {
    if (gameState === 'won') {
      return;
    }
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
      setResult(data.result);
      setGameState('won');
    }

    setGuesses((oldGuesses) => [
      ...oldGuesses,
      { guess: inputText, feedback: data.feedback },
    ]);
    setFeedback(data.feedback);
    setLetters(inputText.split(''));
    setCurrentRowIndex(currentRowIndex + 1);
    setCurrentAttempt({ attempt: currentAttempt.attempt + 1 });
  };

  const handleSubmitHighscore = async (ev) => {
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

  const resetGame = () => {
    setGuesses([]);
    setFeedback([]);
    setLetters([]);
    setCurrentRowIndex(0);
    setCurrentAttempt({ attempt: 0 });
    setGameState('playing');
  };

  useEffect(() => {
    resetGame();
  }, [selectedLength, uniqueLetters]);

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

      {gameState === 'won' &&
        (() => {
          const duration =
            (new Date(result.endTime) - new Date(result.startTime)) / 1000;
          return (
            <div className="game mt-3">
              <h1 className="m-2 font-bold text-2xl text-yellow-500">
                Congratulations!
              </h1>
              <p className="font-bold">
                The correct word was:{' '}
                <span className="text-blue-500">{guesses.at(-1).guess}</span>
              </p>
              <p className="font-bold">Guesses: {guesses.length}</p>
              <p className="font-bold">Duration: {duration} seconds</p>
              <h2 className="font-bold mt-5">Add to highscore</h2>
              <div className="flex flex-row justify-center items-center gap-1 mb-3">
                <form
                  className="m-3 relative flex h-10 w-80 min-w-[200px] max-w-[24rem]"
                  onSubmit={handleSubmitHighscore}>
                  <button
                    className="!absolute right-1 top-1 z-10 select-none rounded bg-blue-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
                    type="submit"
                    data-ripple-light="true">
                    Submit
                  </button>
                  <input
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    placeholder=" "
                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Your name
                  </label>
                </form>
              </div>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="select-none rounded bg-yellow-500 m-2 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-yellow-500/20 transition-all hover:shadow-lg hover:shadow-yellow-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-yellow-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none">
                reset
              </button>
            </div>
          );
        })()}
      {currentAttempt.attempt > 5 && gameState !== 'won' && (
        <div className="game">
          <h1>Game over!</h1>
          <p>Reset and try again!</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="select-none rounded bg-yellow-500 m-2 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-yellow-500/20 transition-all hover:shadow-lg hover:shadow-yellow-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-yellow-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none">
            reset
          </button>
        </div>
      )}
      {gameState === 'end' && (
        <div className="game">
          <h1>Done!</h1>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="select-none rounded bg-yellow-500 m-2 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-yellow-500/20 transition-all hover:shadow-lg hover:shadow-yellow-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-yellow-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none">
            reset
          </button>
        </div>
      )}
    </div>
  );
}
