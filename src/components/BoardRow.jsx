import React from 'react';

import BoardTile from './BoardTile';

export default function BoardRow({ length, feedback, guess }) {
  const letters = guess ? guess.split('') : new Array(length).fill('');

  return (
    <div className="flex flex-row justify-center items-center">
      {letters.map((letter, index) => (
        <BoardTile
          key={index}
          letter={letter}
          result={feedback[index]?.result}
        />
      ))}
    </div>
  );
}
