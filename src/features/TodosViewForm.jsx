import { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInputWithLabel from '../shared/TextInputWithLabel';

const StyledViewForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  width: 100%;
`;

const StyledControlGroup = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  max-width: 30rem;
`;

const StyledClearButton = styled.button`
  padding: 0.25rem 1rem;
  cursor: pointer;
  background-color: #d6686e;
  color: white;
  border: 0.0625rem solid var(--border);
  border-radius: 0.25rem;
  font-size: 1rem;
  min-height: 2.75rem;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #be555a;
  }
  &:disabled {
    background-color: var(--border);
    color: var(--text-muted);
    font-style: italic;
    cursor: not-allowed;
    opacity: 0.7;
  }
  &:focus {
    outline: 0.1875rem solid var(--focus-ring);
    outline-offset: 0.125rem;
  }
`;
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
    <StyledViewForm onSubmit={preventRefresh}>
      <StyledControlGroup>
        <TextInputWithLabel
          elementId="searchTodos"
          labelText="Search Todos"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />{' '}
        <StyledClearButton
          type="button"
          disabled={!localQueryString}
          onClick={() => {
            setQueryString('');
            setLocalQueryString('');
          }}
        >
          Clear
        </StyledClearButton>
      </StyledControlGroup>
      <StyledControlGroup>
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
      </StyledControlGroup>
    </StyledViewForm>
  );
}

export default TodosViewForm;
