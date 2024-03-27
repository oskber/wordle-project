import React from 'react';

import BoardTile from './BoardTile';

export default function BoardRow({ length, letters }) {
  return (
    <div className="flex flex-row justify-center items-center">
      {Array.from({ length }).map((_, index) => {
        const letterObj = letters[index];
        return (
          <BoardTile
            key={index}
            letter={letterObj ? letterObj.letter : ''}
            result={letterObj ? letterObj.result : ''}
          />
        );
      })}
    </div>
  );
}

/* export default function BoardRow({ length, letters }) {
  return (
    <div className="flex flex-row justify-center items-center">
      {Array.from({ length: Number(length) }).map((letterObj, index) => (
        <BoardTile
          key={index}
          letter={letterObj.letter}
          result={letter.result}
        />
      ))}
    </div>
  );
} */
