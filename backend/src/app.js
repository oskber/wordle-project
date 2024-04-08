import express from 'express';
import mongoose from 'mongoose';
import { getRandomWord, handleFeedback, handleOnGuess } from './utils.js';
import { Highscore, Game } from './models.js';
import * as uuid from 'uuid';
import fs from 'fs/promises';

mongoose.connect('mongodb://127.0.0.1:27017/wordle');

const app = express();
app.use(express.json());

app.post('/api/games', async (req, res) => {
  const game = {
    correctWord: await getRandomWord(req.body.length, req.body.uniqueLetters),
    guesses: [],
    attempts: 0,
    uniqueLetters: req.body.uniqueLetters,
    length: req.body.length,
    id: uuid.v4(),
    startTime: new Date(),
  };
  console.log('game: ', game);
  const gameModel = new Game(game);
  await gameModel.save();

  res.status(201).json({ id: game.id });
});

app.post('/api/games/:id/guesses', async (req, res) => {
  const game = await Game.findOne({ id: req.params.id });
  if (game) {
    const guess = req.body.guess;
    game.guesses.push(guess);
    game.attempts++;
    game.markModified('guesses');

    const feedback = await handleFeedback(guess, game.correctWord);

    await game.save();

    if (guess === game.correctWord) {
      game.endTime = new Date();
      res.status(201).json({
        result: game,
        guesses: game.guesses,
        correct: true,
        feedback,
      });
    } else {
      res.status(201).json({
        guesses: game.guesses,
        correct: false,
        feedback,
      });
    }
  } else {
    res.status(404).end();
  }
});

app.post('/api/games/:id/highscore', async (req, res) => {
  const game = await Game.findOne({ id: req.params.id });
  if (game) {
    console.log('game: ', game);
    const name = req.body.name;
    const guesses = game.guesses.map((guessObject) =>
      typeof guessObject === 'string' ? guessObject : guessObject.guess
    );
    const highscoreData = { ...game._doc, name, guesses };
    const highscoreModel = new Highscore(highscoreData);
    await highscoreModel.save();
    console.log('highscoreData: ', highscoreData);
    res.status(201).json({ highscore: highscoreData });
  } else {
    res.status(404).end();
  }
});

app.get('/api/highscores', async (req, res) => {
  const highscores = await Highscore.find();
  res.json({
    highscores: highscores.map((entry) => ({
      ...entry,
      duration: new Date(entry.endTime) - new Date(entry.startTime),
    })),
  });
});

app.get('/', async (req, res) => {
  const html = await fs.readFile('../dist/index.html');
  res.type('html').send(html);
});

app.use('/assets', express.static('../dist/assets'));

export default app;
