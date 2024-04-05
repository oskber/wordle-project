import fs from 'fs/promises';

export default async function getRandomWord() {
  const payload = await fs.readFile('./data/words_dictionary.json');
  const WORDS = JSON.parse(payload.toString());
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const randomWord = WORDS[randomIndex].toUpperCase().split('');
  return randomWord;
}
