import * as _ from 'lodash';
import {initialState} from './index';

export const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_HISTORY':
      return action.history;
    default:
      return state
  }
};