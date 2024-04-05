import mongoose from 'mongoose';

const Highscore = mongoose.model('Highscore', {
  name: String,
  guesses: Array,
  duration: String,
  settings: {
    uniqueLetters: Boolean,
    length: Number,
  },
});

export { Highscore };
