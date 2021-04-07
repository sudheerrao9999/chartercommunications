import React from "react";

const ColumnFilter = ({ value, data, setFilters }) => (
  <select value={value} onChange={(e) => setFilters(e.target.value)}>
    <option value="ALL">ALL</option>
    {data.map((val) => (
      <option key={val} value={val}>
        {val}
      </option>
    ))}
  </select>
);

export default ColumnFilter;
