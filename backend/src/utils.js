import fs from 'fs/promises';

async function getRandomWord() {
  const payload = await fs.readFile('./data/words_dictionary.json');
  const data = JSON.parse(payload.toString());
  const WORDS = data.words;
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const randomWord = WORDS[randomIndex].toUpperCase();
  console.log(randomWord);
  return randomWord;
}

export { getRandomWord };
