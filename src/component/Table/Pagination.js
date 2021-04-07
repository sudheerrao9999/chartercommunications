import React from "react";

const pageSizes = [10, 20, 30, 40, 50];

const Pagination = ({
  pageNumber,
  pageSize,
  setPageNumber,
  setPageSize,
  totalLength,
}) => {
  return (
    <div className="pagination">
      <div className="page-size">
        Record size :
        <select
          onChange={(e) => {
            setPageSize(e.target.value);
            setPageNumber(1);
          }}
        >
          {pageSizes.map((size) => (
            <option key={`pagesize-${size}`} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="page-number">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((pageNumber) => pageNumber - 1)}
        >
          &lt; Prev
        </button>
        {pageNumber}
        <button
          disabled={totalLength / pageSize <= pageNumber}
          onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
