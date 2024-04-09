import express from 'express';
import mongoose from 'mongoose';
import { getRandomWord, handleFeedback, handleOnGuess } from './utils.js';
import { Highscore, Game } from './models.js';
import * as uuid from 'uuid';
import fs from 'fs/promises';
import { engine } from 'express-handlebars';

mongoose.connect('mongodb://127.0.0.1:27017/wordle');

const app = express();
app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const MENU = [
  {
    label: 'New Game',
    link: '/',
  },
  {
    label: 'Highscores',
    link: '/highscores',
  },
  {
    label: 'About',
    link: '/about',
  },
];

async function renderPage(res, page) {
  const currentPath = page == 'index' ? '/' : `/${page}`;

  res.render(page, {
    menuItems: MENU.map((item) => {
      return {
        active: currentPath == item.link,
        label: item.label,
        link: item.link,
      };
    }),
  });
}
async function renderHighscore(res, page) {
  const currentPath = page == 'index' ? '/' : `/${page}`;
  const highscores = await Highscore.find();

  res.render(page, {
    menuItems: MENU.map((item) => {
      return {
        active: currentPath == item.link,
        label: item.label,
        link: item.link,
      };
    }),
    highscores: highscores.map((entry) => {
      return {
        ...entry.toObject(),
      };
    }),
  });
}

app.get('/highscores', async (req, res) => {
  renderHighscore(res, 'highscores');
});

app.get('/', async (request, response) => {
  renderPage(response, 'index');
});

app.get('/about', async (request, response) => {
  renderPage(response, 'about');
});

app.post('/api/games', async (req, res) => {
  const game = {
    correctWord: await getRandomWord(req.body.length, req.body.uniqueLetters),
    guesses: [],
    attempts: 0,
    uniqueLetters: req.body.uniqueLetters,
    length: req.body.length,
    id: uuid.v4(),
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

    if (game.attempts === 1) {
      game.startTime = new Date();
    }
    await game.save();

    const feedback = await handleFeedback(guess, game.correctWord);

    if (guess === game.correctWord) {
      game.endTime = new Date();
      await game.save();
      res.status(201).json({
        result: game,
        guesses: game.guesses,
        correct: true,
        feedback,
        duration: game.endTime - game.startTime,
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
    const name = req.body.name;
    const guesses = game.guesses.map((guessObject) =>
      typeof guessObject === 'string' ? guessObject : guessObject.guess
    );
    const duration = (game.endTime - game.startTime) / 1000;

    await game.save();
    const highscoreData = {
      ...game._doc,
      name,
      guesses,
      duration,
    };
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
      duration: entry.endTime
        ? new Date(entry.endTime).getTime() -
          new Date(entry.startTime).getTime()
        : 0,
    })),
  });
});

app.get('/', async (req, res) => {
  const html = await fs.readFile('../frontend/dist/index.html');
  res.type('html').send(html);
});

app.use('/assets', express.static('../frontend/dist/assets'));
app.use(express.static('public'));

export default app;
