import fs from 'fs/promises';

async function getRandomWord(selectedLength, uniqueLetters) {
  const payload = await fs.readFile('./data/words_dictionary.json');
  const data = JSON.parse(payload.toString());
  const WORDS = data.words;

  if (selectedLength) {
    const filteredListByLength = WORDS.filter(
      (word) => word.length === selectedLength
    );

    WORDS = filteredListByLength;
  }

  if (uniqueLetters === true) {
    const filteredListByUniqueLetters = WORDS.filter(
      (word) => new Set(word).size === word.length
    );
    WORDS = filteredListByUniqueLetters;
  }

  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const randomWord = WORDS[randomIndex].toUpperCase();
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
