import useState from 'react';
import { handleOnGuess } from '../../backend/src/utils';

export default function Game({ gameId }) {
  const [gameState, setGameState] = useState('playing');
  const [inputText, setInputText] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [result, setResult] = useState(null);
  const [name, setName] = useState('');
  const [selectedLength, setSelectedLength] = useState(5);
  const [uniqueLetters, setUniqueLetters] = useState(false);
  const [letters, setLetters] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState({
    attempt: 0,
  });

  function handleOnReset() {
    setCurrentAttempt({ attempt: 0 });
    setCurrentRowIndex(0);
    setLetters([]);
    setGuesses([]);
  }

  const handleKeyUp = async (keyCode) => {
    if (keyCode === 'Enter') {
      setInputText('');

      const res = await fetch(
        `http://localhost:5080/api/games/${gameId}/guesses`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guess: inputText,
            length: selectedLength,
            uniqueLetters: uniqueLetters,
          }),
        }
      );

      const data = await res.json();

      handleOnGuess(data.guesses);

      setLetters((prevLetters) => [...prevLetters, data.guesses]);
      setCurrentRowIndex(currentRowIndex + 1);
      setCurrentAttempt({
        attempt: currentAttempt.attempt + 1,
      });

      if (data.correct) {
        console.log(data.guesses);
        setResult(data.result);
        setGameState('won');
      }

      setGuesses(data.guesses);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const highscore = {
      name,
    };

    await fetch(`http://localhost:5080/api/games/${gameId}/highscore`, {
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
          onClick={() => onReset(handleOnReset)}
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
      <input
        value={inputText}
        onChange={(ev) => setInputText(ev.target.value)}
        onKeyUp={(ev) => handleKeyUp(ev.code)}
      />
      <ul>
        {guesses.map((guess, index) => (
          <li key={index}>{guess}</li>
        ))}
      </ul>
    </div>
  );
}
