import React, { useState } from 'react';

export default function UniqueLetters() {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="flex justify-center items-center gap-1 mb-3">
      <form className="max-w-sm mx-auto">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
          Do you want unique letters?
        </label>
        <select
          value={selectedValue}
          onChange={handleChange}
          className="w-20 rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-1 font-sans text-sm font-normal text-blue-gray-700">
          <option value="Choose" disabled hidden>
            Do you want unique letters?
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </form>
    </div>
  );
}
