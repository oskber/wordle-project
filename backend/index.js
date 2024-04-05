import fetchWords from './api/apiAdapter.js';
import express from 'express';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import { Highscore } from './src/models.js';

mongoose.connect('mongodb://127.0.0.1:27017/wordle');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  const html = await fs.readFile('../dist/index.html');
  res.type('html').send(html);
});

app.get('/leaderboard', async (req, res) => {
  const highscore = await Highscore.find();
  res.json({ highscore });
});

app.post('/api/leaderboard', async (req, res) => {
  const highscoreData = req.body;
  console.log(req.body);

  const highscoreModel = new Highscore(highscoreData);
  await highscoreModel.save();

  res.status(201).json(highscoreModel);
});

app.get('/api/words', async (req, res) => {
  const words = await fetchWords();
  res.status(200).json(words);
});

app.use('/assets', express.static('../dist/assets'));
app.listen(5080);
