//week 09 Airtable credential setup
import { useState, useEffect } from 'react';
import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

const encodeUrl = ({ sortField, sortDirection }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  return encodeURI(`${url}?${sortQuery}`);
};

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');

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
        const resp = await fetch(
          encodeUrl({ sortDirection, sortField }),
          options
        );
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
  }, [sortDirection, sortField]);

  const addTodo = async (newTodo) => {
    //create payload that is sent to AirTable
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };
    // second set options object but this time for POST
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    //try/catch/finally

    try {
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl({ sortDirection, sortField }),
        options
      );
      if (!resp.ok) {
        throw new Error(
          `Error adding new todo: ${resp.status} ${resp.statusText}`
        );
      }

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return {
          ...editedTodo,
        };
      }
      return todo;
    });
    setTodoList(updatedTodos);
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    //try/catch/finally
    try {
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl({ sortDirection, sortField }),
        options
      );
      if (!resp.ok) {
        throw new Error(
          `Error updating new todo: ${resp.status} ${resp.statusText}`
        );
      }
    } catch (error) {
      console.log(error.message);
      setErrorMessage(`${error.message}.Reverting todo...`);
      const revertedTodos = todoList.map((todo) =>
        todo.id === editedTodo.id ? originalTodo : todo
      );

      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  };
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
    const payload = {
      records: [
        {
          id: id,
          fields: {
            isCompleted: true,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    //try/catch/finally
    try {
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl({ sortDirection, sortField }),
        options
      );
      if (!resp.ok) {
        throw new Error(
          `Could not complete Todo: ${resp.status} ${resp.statusText}`
        );
      }
    } catch (error) {
      console.log(error.message);
      setErrorMessage(`${error.message}.Reverting todo completion...`);
      setTodoList(
        todoList.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      <hr />

      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
      />

      <hr />

      {errorMessage && (
        <div>
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
