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
      };

    case actions.loadTodos:
      return {
        ...state,
      };
    case actions.setLoadError:
      return {
        ...state,
      };
    case actions.startRequest:
      return {
        ...state,
      };
    case actions.addTodo:
      return {
        ...state,
      };
    case actions.endRequest:
      return {
        ...state,
      };
    case actions.updateTodo:
      return {
        ...state,
      };
    case actions.completeTodo:
      return {
        ...state,
      };
    case actions.revertTodo:
      return {
        ...state,
      };
    case actions.clearError:
      return {
        ...state,
      };
    default:
      return state;
  }
}
