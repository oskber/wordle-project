export default function BoardTile({ letter, result }) {
  let color;
  switch (result) {
    case 'correct':
      color = 'bg-green-500';
      break;
    case 'misplaced':
      color = 'bg-yellow-500';
      break;
    case 'incorrect':
      color = 'bg-red-500';
      break;
    default:
      color = 'bg-white text-black';
      break;
  }

  return (
    <div
      className={`flex justify-center my[2px] m-[2px] items-center w-[62px] h-[62px] border-2 ${color}`}>
      <p className="flex self-center mb-2 font-bold text-5xl">{letter}</p>
    </div>
  );
}
