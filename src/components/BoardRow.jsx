import BoardTile from "./BoardTile";

export default function BoardRow({length, letters}) {
  return (
    <div className="flex flex-row justify-center items-center">
      {Array.from({ length: Number(length) }).map((_, index) => (
        <BoardTile key={index} letter={letters[index]} />
      ))}
    </div>
  )
}