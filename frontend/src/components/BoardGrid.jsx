import React from 'react';
import BoardRow from './BoardRow';

export default function Board({ selectedLength, guesses }) {
  const rows = Array.from(
    { length: 6 },
    (_, index) =>
      guesses[index] || {
        guess: ' '.repeat(selectedLength),
        feedback: Array(selectedLength).fill({}),
      }
  );

  return (
    <div>
      {rows.map((row, index) => (
        <BoardRow key={index} guess={row.guess} feedback={row.feedback} />
      ))}
    </div>
  );
}
