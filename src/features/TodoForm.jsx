import React, { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
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
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      />
      <button
        type="submit"
        disabled={isSaving || workingTodoTitle.trim() === ''}
      >
        {''}
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}
export default TodoForm;
