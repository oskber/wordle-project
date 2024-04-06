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
  let duplicateCounter = 0;
  for (let i = 0; i < guesses.length; i++) {
    if (correctWord[i] === guesses[i]) {
      feedback.push({ letter: guesses[i], result: 'correct' });
    } else if (correctWord.includes(guesses[i])) {
      if (
        guesses.filter((char) => char === guesses[i]).length >
        correctWord.filter((char) => char === guesses[i]).length +
          duplicateCounter
      ) {
        duplicateCounter++;
        feedback.push({ letter: guesses[i], result: 'incorrect' });
      } else {
        feedback.push({ letter: guesses[i], result: 'misplaced' });
      }
    } else {
      feedback.push({ letter: guesses[i], result: 'incorrect' });
    }
  }
  return feedback;
}

export { handleFeedback };

function handleOnGuess(guesses) {
  const letters = [];
  const WORDS = WORDS.map((word) => word);
  if (guesses.match(/[A-Z]/) && WORDS.includes(guesses)) {
    letters.push(guesses.map((letter) => letter.toUpperCase()));
    return letters;
  } else {
    return alert('Please enter a valid letter');
  }
}

export { handleOnGuess };
