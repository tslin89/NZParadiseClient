import React, { useState } from "react";

interface FilterProps {
  onSearch: (query: string, category: string, priceRange: string) => void;
}

const FilterBar: React.FC<FilterProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    onSearch(query, category, priceRange);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-4">
      <input
        type="text"
        placeholder="Search properties..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-1/3"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Category</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
      </select>
      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Price Range</option>
        <option value="low">Below $500</option>
        <option value="medium">$500 - $1500</option>
        <option value="high">Above $1500</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
};

export default FilterBar;
