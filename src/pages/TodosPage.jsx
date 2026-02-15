import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import styles from '../App.module.css';

//make TodosPage component

function TodosPage({
  todoState,
  addTodo,
  completeTodo,
  updateTodo,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
  dispatch,
  todoActions,
}) {
  return (
    <div className={styles.container}>
      {/* WK 14 removed <h1>My Todos <h1> */}
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
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
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      <hr />

      {todoState.errorMessage && (
        <div className={styles.errorContainer}>
          {/* WEEK 13 inside p element updated dispatch from {errorMessage to */}
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
  );
}
export default TodosPage;
