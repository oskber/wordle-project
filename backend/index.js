import express from 'express';

const app = express();

const words = ['hello', 'world', 'foo', 'bar', 'baz'];

app.get('/api/words', (req, res) => {
  res.json({ words });
});

app.listen(5080);
