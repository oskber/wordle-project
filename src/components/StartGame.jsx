export default function StartGame({
  onStart,
  onUnique,
  selectedLength,
  selectedValue,
}) {
  return (
    <div>
      <button
        className="select-none rounded bg-yellow-500 mb-5 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-yellow-500/20 transition-all hover:shadow-lg hover:shadow-yellow-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
        type="submit"
        onClick={() => {
          onStart();
          onUnique(selectedValue);
          selectedLength(selectedLength);
        }}
        data-ripple-light="true">
        Start game
      </button>
    </div>
  );
}
