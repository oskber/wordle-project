import fetchWords from './api/apiAdapter.js';
import express from 'express';
import fs from 'fs/promises';

const app = express();
app.use(express.json());

/* app.get('/', async (req, res) => {
  const html = await fs.readFile('../dist/index.html');
  res.type('html').send(html);
}); */

app.get('/api/words', async (req, res) => {
  const words = await fetchWords();
  res.status(200).json(words);
});

// app.use('/assets', express.static('../dist/assets'));

app.listen(5080);
