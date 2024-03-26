import React, { useState } from 'react';

export default function LettersLength({onSelectLength}) {
  const [selectedValue, setSelectedValue] = useState("Choose word length");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onSelectLength(event.target.value === 'Choose word length' ? 0 : Number(event.target.value));
  };

  return (
    <div className="flex">
      <form className="max-w-sm mx-auto">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select length of word</label>
        <select 
          id="length" 
          value={selectedValue} 
          onChange={handleChange}
          className="w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700"
        >
          <option value="Choose word length">Choose word length</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </form>
    </div>
  )
}