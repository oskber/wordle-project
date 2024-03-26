import React, { useState } from 'react';

export default function LettersLength({ onSelectLength }) {
  const [selectedValue, setSelectedValue] = useState(3);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onSelectLength(Number(event.target.value));
  };

  return (
    <div className="flex flex-row justify-center items-center gap-1 mb-3">
      <form className="max-w-sm mx-auto">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
          Select length of word
        </label>
        <select
          value={selectedValue}
          onChange={handleChange}
          className="w-20 rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-1 font-sans text-sm font-normal text-blue-gray-700">
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </form>
    </div>
  );
}
