//week 09 Airtable credential setup
import { useState, useEffect } from 'react';
import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setErrorMessage('');
      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };
      //try/catch/finally
      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(`Error: ${resp.status} ${resp.statusText}`);
        }

        const { records } = await resp.json();
        setTodoList(
          records.map((record) => {
            const todo = {
              id: record.id,
              ...record.fields,
            };
            if (!todo.isCompleted) {
              todo.isCompleted = false;
            }
            return todo;
          })
        );
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = (title) => {
    const newTodo = {
      title,
      id: Date.now(),
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  };
  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return {
          ...editedTodo,
        };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };
  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button type="button" onClick={() => setErrorMessage('')}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
