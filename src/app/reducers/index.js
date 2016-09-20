import { combineReducers } from 'redux';
import {userReducer} from './user'
import {historyReducer} from './history'

export const initialState = {
  user: {},
  history: {}
};

export const appReducers = (state = initialState, action) => {
  return {
    user: userReducer(state.user, action),
    history: historyReducer(state.history, action)
  }
};