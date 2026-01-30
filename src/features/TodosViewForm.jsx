import { useState, useEffect } from 'react';
function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);
  const preventRefresh = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>Search todos: </label>
        <input
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />{' '}
        <button
          type="button"
          onClick={() => {
            setQueryString('');
            setLocalQueryString('');
          }}
        >
          Clear
        </button>
      </div>
      <div>
        <label>
          Sort by
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time Added</option>
          </select>
        </label>

        <label>
          {' '}
          Direction
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </form>
  );
}

export default TodosViewForm;
