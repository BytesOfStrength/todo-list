import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import styles from './TodoList.module.css';
import TodoListItem from './TodoListItem';
function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  //WEEK 14 add search params for specific url and pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  );
  //WEEK 14 Calculate number of pages
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const calculateTotalPg = Math.ceil(filteredTodoList.length / itemsPerPage);
  const totalPages = calculateTotalPg > 0 ? calculateTotalPg : 1;

  const currentTodoList = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );
  //Handler for Previous and Next Buttons
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    } else {
      setSearchParams({ page: 1 });
    }
  };
  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setSearchParams({ page: currentPage + 1 });
    } else {
      setSearchParams({ page: totalPages });
    }
  };
  // Deal with if current page is not a number, less than the first page or greater than total pages
  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <>
      {isLoading ? (
        <p>Todo list is loading...</p>
      ) : (
        <>
          <div className={styles.todoListContainer}>
            <ul className={styles.list}>
              {filteredTodoList.length === 0 ? (
                <p>Add Todo above to get started</p>
              ) : (
                /*             {filteredTodoList.map((todo) => ( */
                currentTodoList.map((todo) => (
                  <TodoListItem
                    key={todo.id}
                    todo={todo}
                    onCompleteTodo={onCompleteTodo}
                    onUpdateTodo={onUpdateTodo}
                  />
                ))
              )}
            </ul>
            {/*Pagination for user*/}
            <div className={styles.paginationControls}>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default TodoList;
