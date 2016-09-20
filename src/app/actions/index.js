export const addUser = (user) => {
  return {
    type: 'ADD_USER',
    user
  }
};

export const removeUser = () => {
  return {
    type: 'REMOVE_USER'
  }
};

export const addHistory = (history) => {
  return {
    type: 'ADD_HISTORY',
    history
  }
};
