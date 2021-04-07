import React, { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";
import Search from "./Search";
import ColumnFilter from "./ColumnFilter";

import "./index.css";

const sortData = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const Table = () => {
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ genre: "ALL", state: "ALL" });

  useEffect(() => {
    setLoading(true);
    fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: "Api-Key q3MNxtfep8Gt",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) {
          res.sort(sortData);
          setData(res);
        }
        setLoading(false);
      })
      .catch(setLoading(false));
  }, []);

  const columns = [
    { title: "Name", id: "name" },
    { title: "City", id: "city" },
    { title: "State", id: "state" },
    { title: "Phone Number", id: "telephone" },
    { title: "Genre", id: "genre" },
  ];

  const fields = columns.map((data) => data.id);

  const genres = useMemo(() => {
    const values = data.reduce(
      (acc, res) => [...acc, ...res.genre.split(",")],
      []
    );
    return [...new Set(values)];
  }, [data]);

  const states = useMemo(() => {
    const values = data.reduce((acc, res) => [...acc, res.state], []);
    return [...new Set(values)];
  }, [data]);

  const renderColumns = () =>
    columns.map((col) => <th key={col.id}>{col.title}</th>);

  const renderTableData = (row) => {
    return (
      <tr key={row.id}>
        {fields.map((field) => (
          <td key={row[field]}>{row[field]}</td>
        ))}
      </tr>
    );
  };

  const checkEqual = useCallback(
    (str) =>
      String(str).toLowerCase().includes(String(searchText).toLowerCase()),
    [searchText]
  );

  const tableData = useMemo(() => {
    let allData = data;

    // filter data
    allData = allData.filter((res) => {
      const { state, genre } = filters;
      const stateExist = ["ALL", res.state].includes(state);
      const genreExist = ["ALL", ...res.genre.split(",")].includes(genre);
      return stateExist && genreExist;
    });

    // Searching....
    if (searchText) {
      allData = allData.filter(
        (res) =>
          checkEqual(res.name) || checkEqual(res.city) || checkEqual(res.genre)
      );
    }

    // pagination.....
    if (pageNumber > 1) {
      return allData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    } else {
      return allData.slice(0, pageSize);
    }
  }, [checkEqual, data, filters, pageNumber, pageSize, searchText]);

  return (
    <div className="table-container">
      <Search onSearch={setSearchText} />
      <table>
        <thead>
          <tr>{renderColumns()}</tr>
          <tr>
            <th></th>
            <th></th>
            <th>
              <ColumnFilter
                data={states}
                value={filters.state}
                setFilters={(val) =>
                  setFilters((prevFilter) => ({
                    ...prevFilter,
                    state: val,
                  }))
                }
              />
            </th>
            <th></th>
            <th>
              <ColumnFilter
                data={genres}
                value={filters.genre}
                setFilters={(val) =>
                  setFilters((prevFilter) => ({
                    ...prevFilter,
                    genre: val,
                  }))
                }
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td align="center" className="loading" colSpan={columns.length}>
                <div class="loader"></div> Loading data...
              </td>
            </tr>
          ) : tableData.length > 0 ? (
            tableData.map((row) => renderTableData(row))
          ) : (
            <tr>
              <td align="center" colSpan={columns.length}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={columns.length}>
              <Pagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                totalLength={data.length}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
