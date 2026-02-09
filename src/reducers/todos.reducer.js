export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};
export const actions = {
  // actions in useEffect that Loads Todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  //action found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper function
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when request fails
  revertTodo: 'revertTodo',
  //action on dismiss error button
  clearError: 'clearError',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };

    case actions.loadTodos: {
      const mappedTodos = action.records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };
        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });
      return {
        ...state,
        isLoading: false,
        //assign array from variable from this case
        todoList: mappedTodos,
      };
    }
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo: {
      const newRecord = action.records[0];
      const savedTodo = {
        id: newRecord.id,
        ...newRecord.fields,
        isCompleted: newRecord.fields.isCompleted || false,
      };
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };
//by not having revertTodo with it's own return, the action of revertTodo has an action to match updatedTodo.
    case actions.revertTodo:
    case actions.updateTodo: {
      //map through the current list using action.editedTodo

      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.editedTodo.id) {
          return { ...action.editedTodo };
        }
        return todo;
      });
      const updatedState = {
        ...state,
        //todoList will create an array with updatedTodos,
        todoList: updatedTodos,
        isSaving: false,
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }
      return updatedState;
    }
// reducer will take care of knowing if editTodo.id or todo.id is needed to be used
    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, isCompleted:true };
        }
        return todo;
      });
      return {
        ...state,
        todoList: updatedTodos,
        isSaving: false,
      };
    }

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
        isLoading: false,
        isSaving: false,
      };
    default:
      return state;
  }
}

