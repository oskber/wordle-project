import mongoose from 'mongoose';

const Highscore = mongoose.model('Highscore', {
  name: String,
  guesses: Array,
  duration: String,
  settings: {
    uniqueLetters: Boolean,
    length: Number,
  },
  id: String,
});

export { Highscore };

const Games = mongoose.model('Games', {
  correctWord: Array,
  guessedWords: Array,
  attempts: Number,
  id: String,
  startTime: Date,
});

export { Games };
