import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import TextInputWithLabel from '../shared/TextInputWithLabel';

const StyledForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 1.25rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 50rem;
  margin: 0 auto;
`;

const StyledButton = styled.button`
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  min-height: 2.75rem;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--primary-hover);
  }

  &:disabled {
    font-style: italic;
    color: #736767;
    background-color: var(--border);
    cursor: not-allowed;
  }

  &:focus {
    outline: 0.1875rem solid var(--focus-ring);
    outline-offset: 0.125rem;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const todoTitleInput = useRef(null);
  const handleAddTodo = (event) => {
    event.preventDefault();
    //pass state variable to parent function
    onAddTodo({ title: workingTodoTitle, isCompleted: false });
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  };
  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      />
      <StyledButton
        type="submit"
        disabled={isSaving || workingTodoTitle.trim() === ''}
      >
        {''}
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}
export default TodoForm;
