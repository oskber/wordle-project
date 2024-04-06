import React from 'react';

import BoardRow from './BoardRow';

export default function Board({ selectedLength, letters = [] }) {
  const rows = [1, 2, 3, 4, 5, 6];
  return (
    <div className="m-4">
      {rows.map((row, index) => (
        <BoardRow
          key={index}
          letters={letters[index] || []}
          length={selectedLength}
        />
      ))}
    </div>
  );
}
