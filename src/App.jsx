import { Routes, Route, Link, useLocation } from 'react-router';
//npm install react-router
//week 14 added Header import
import Header from './shared/Header.jsx';
import About from  "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useReducer, useState, useEffect, useCallback } from 'react';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodoState,
} from './reducers/todos.reducer';
import './App.css';
import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';
import TextInputWithLabel from './shared/TextInputWithLabel.jsx';
import TodosPage from "./pages/Todospage.jsx";

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodoState);
  /*const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);*/
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');
//WEEK 14- Add location and title;
  const location = useLocation();
  const [title, setTitle] = useState('');


  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

//WEEK 14- useEffect for setting up location of pages
  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('Todo List');
    } else if (location.pathname === '/about') {
      setTitle('About');
    } else {
      setTitle('Not Found');
    }
  }, [location]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      /*setIsLoading(true);
      setErrorMessage('');*/
      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };
      //try/catch/finally
      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(`Error: ${resp.status} ${resp.statusText}`);
        }

        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records: records });
        /*setTodoList(
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
        );*/
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error: error });
      }
    };

    fetchTodos();
  }, [encodeUrl]);

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
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(
          `Error adding new todo: ${resp.status} ${resp.statusText}`
        );
      }

      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records: records });
      /*const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);*/
    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        error: error,
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );
    dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });
    /*const updatedTodos = todoState.todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return {
          ...editedTodo,
        };
      }
      return todo;
    });
    setTodoList(updatedTodos);*/
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
      /*week 13 remove setIsSaving(true);*/
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(
          `Error updating new todo: ${resp.status} ${resp.statusText}`
        );
      }
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo });
      dispatch({ type: todoActions.setLoadError, error: error });
      /*week 13 remove setErrorMessage(`${error.message}.Reverting todo...`);
      const revertedTodos = todoList.map((todo) =>
        todo.id === editedTodo.id ? originalTodo : todo
      );

      setTodoList([...revertedTodos]);*/
    }
  };
  const completeTodo = async (id) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    /*const updatedTodos = todoState.todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });*/
    const editedTodo = {
      ...originalTodo,
      isCompleted: true,
    };

    /*week 13 replace setTodoList(updatedTodos) with dispatch;*/
    dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });
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
      /*week 13 remove setIsSaving(true);*/
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(
          `Could not complete Todo: ${resp.status} ${resp.statusText}`
        );
      }
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo });
      dispatch({ type: todoActions.setLoadError, error: error });
    }
    /*WK 13 remove setErrorMessage(`${error.message}. Reverting todo completion...`);
      setTodoList(
        todoList.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    }  finally {
      setIsSaving(false);}
      */
  };
  return (
    <>
    
    <div className={styles.container}>
      <Header title ={title}/>
      <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                todoState={todoState}
                addTodo={addTodo}
                completeTodo={completeTodo}
                updateTodo={updateTodo}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                queryString={queryString}
                setQueryString={setQueryString}
                dispatch={dispatch}
                todoActions={todoActions}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

{/*<TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <div className={styles.listContainer}>
  <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
        />
      </div>

      <hr />

      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      <hr />

      {todoState.errorMessage && (
        <div className={styles.errorContainer}>
          <p>{todoState.errorMessage}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: todoActions.clearError })}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
   </>
  );
}

export default App;*/}
