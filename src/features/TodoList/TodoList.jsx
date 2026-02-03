import React from 'react';
import styles from './TodoList.module.css';
import TodoListItem from './TodoListItem';
function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  );

  return (
    <>
      {isLoading ? (
        <p>Todo list is loading...</p>
      ) : (
        <>
          {filteredTodoList.length === 0 ? (
            <p>Add Todo above to get started</p>
          ) : (
            <ul className={styles.list}>
              {filteredTodoList.map((todo) => (
                <TodoListItem
                  key={todo.id}
                  todo={todo}
                  onCompleteTodo={onCompleteTodo}
                  onUpdateTodo={onUpdateTodo}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
export default TodoList;
