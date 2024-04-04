import { useEffect } from 'react';

export default function GameOver({
  gameOver = {},
  correctWord,
  currentAttempt,
  onReset,
  stopTime,
}) {
  useEffect(() => {
    stopTime();
  }, [stopTime]);

  return (
    <div className="gameOver">
      <h3>{gameOver.guessedWord ? 'Congrats!' : 'You failed...'}</h3>
      <h1>Correct word: {correctWord}</h1>
      {gameOver.guessedWord && (
        <h3>You guessed in {currentAttempt.attempt} attempts</h3>
      )}
      <button
        onClick={() => onReset()}
        className="select-none rounded bg-yellow-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-yellow-500/20 transition-all hover:shadow-lg hover:shadow-yellow-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-yellow-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none">
        reset
      </button>
    </div>
  );
}
