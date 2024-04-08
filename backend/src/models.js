import mongoose from 'mongoose';

const Highscore = mongoose.model('Highscore', {
  name: String,
  guesses: Array,
  uniqueLetters: Boolean,
  length: Number,
  id: String,
  startTime: Date,
  endTime: Date,
});

export { Highscore };

const Game = mongoose.model('Game', {
  correctWord: String,
  guesses: Array,
  attempts: Number,
  uniqueLetters: Boolean,
  length: Number,
  id: String,
  startTime: Date,
  endTime: Date,
});

export { Game };
