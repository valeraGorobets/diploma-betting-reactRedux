const appReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_APP':
      return Object.assign(state, action.config);
    default:
      return state
  }
}

export default appReducer;