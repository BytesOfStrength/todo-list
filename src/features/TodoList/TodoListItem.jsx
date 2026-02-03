import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);

  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo.title]);

  const handleUpdate = (event) => {
    if (!isEditing) {
      return;
    }
    event.preventDefault();
    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    //this will reset to original todo.title
    setIsEditing(false);
  };
  const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
  };
  return (
    <li className={styles.listItem}>
      <form onSubmit={handleUpdate} className={styles.editItemForm}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              labelText="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
              elementId={`edit-${todo.id}`}
            />
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.updateButton}
              onClick={handleUpdate}
            >
              Update
            </button>
          </>
        ) : (
          <>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span
              onClick={() => setIsEditing(true)}
              className={styles.todoTitle}
            >
              {''}
              {todo.title}
              {''}
            </span>
          </>
        )}
      </form>
    </li>
  );
}
export default TodoListItem;
