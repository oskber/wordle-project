import fs from 'fs/promises';

async function getRandomWord(length, uniqueLetters) {
  const payload = await fs.readFile('./data/words_dictionary.json');
  const data = JSON.parse(payload.toString());
  let words = data.words;

  if (length) {
    words = words.filter((word) => word.length === Number(length));
  }

  if (uniqueLetters === 'true') {
    words = words.filter(
      (word) => new Set(word.split('')).size === word.length
    );
  }

  const randomIndex = Math.floor(Math.random() * words.length);
  const randomWord = words[randomIndex].toUpperCase();
  console.log(randomWord);
  return randomWord;
}

export { getRandomWord };

async function handleFeedback(guesses, correctWord) {
  const feedback = [];
  let guess = guesses.split('');
  let correct = correctWord.split('');
  let duplicateCounter = 0;
  for (let i = 0; i < guess.length; i++) {
    if (correct[i] === guess[i]) {
      feedback.push({ letter: guess[i], result: 'correct' });
    } else if (correct.includes(guess[i])) {
      if (
        guess.filter((char) => char === guess[i]).length >
        correct.filter((char) => char === guess[i]).length + duplicateCounter
      ) {
        duplicateCounter++;
        feedback.push({ letter: guess[i], result: 'incorrect' });
      } else {
        feedback.push({ letter: guess[i], result: 'misplaced' });
      }
    } else {
      feedback.push({ letter: guess[i], result: 'incorrect' });
    }
  }
  return feedback;
}

export { handleFeedback };

async function handleOnGuess(guesses) {
  if (typeof guesses !== 'string') {
    throw new Error('guesses must be a string');
  }

  const payload = await fs.readFile('./data/words_dictionary.json');
  const data = JSON.parse(payload.toString());
  let words = data.words;
  const letters = [];
  words.map((word) => word);
  if (guesses.match(/[A-Z]/) && words.includes(guesses)) {
    letters.push(guesses.map((letter) => letter.toUpperCase()));
    return letters;
  } else {
    return alert('Please enter a valid letter');
  }
}

export { handleOnGuess };
