import express from 'express';

const app = express();

const words = ['hello', 'world', 'foo', 'bar', 'baz'];

app.get('/api/words', (req, res) => {
  res.json({ words });
});

app.get('/api/highscore', (req, res) => {
  res.json({ highscore: 0 });
});

app.listen(5080);
