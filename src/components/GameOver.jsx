import { useState, useEffect } from 'react';

export default function GameOver({
  gameOver = {},
  correctWord,
  currentAttempt,
  onReset,
  stopTime,
  seconds,
  minutes,
  onCreateHighscoreItem,
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    stopTime();
  }, [stopTime]);

  return (
    <div className="gameOver">
      <h1>{gameOver.guessedWord ? 'Congrats!' : 'You failed...'}</h1>
      <h2>Correct word: {correctWord}</h2>
      {gameOver.guessedWord && (
        <h3>You guessed in {currentAttempt.attempt} attempts</h3>
      )}
      <div className="stopwatch-container ">
        <div className="flex gap-2 justify-center">
          <h3>Your time:</h3>
          <p className="stopwatch-time">
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}:
          </p>
        </div>
      </div>
      <button
        onClick={() => onReset()}
        className="select-none rounded bg-yellow-500 m-2 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-yellow-500/20 transition-all hover:shadow-lg hover:shadow-yellow-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-yellow-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none">
        reset
      </button>
      <div className="flex flex-row justify-center items-center gap-1 m-5">
        <form
          className="relative flex h-10 w-80 min-w-[200px] max-w-[24rem]"
          onSubmit={(ev) => {
            ev.preventDefault();
            onCreateHighscoreItem(name);
          }}>
          <button
            className="!absolute right-1 top-1 z-10 select-none rounded bg-blue-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
            type="submit"
            data-ripple-light="true">
            SEND
          </button>
          <input
            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Type your name and post your score!
          </label>
        </form>
      </div>
    </div>
  );
}
