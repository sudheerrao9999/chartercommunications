import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const onUpdateText = (str) => {
    setSearch(str);
    !str && onSearch("");
  };
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Resturant.."
        name="search"
        value={search}
        onChange={(e) => onUpdateText(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onSearch(search)}
      />
      <button type="submit" onClick={() => onSearch(search)}>
        Search
      </button>
    </div>
  );
};
export default Search;
