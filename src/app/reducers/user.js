import * as _ from 'lodash';
import {initialState} from './index';

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return action.user;
    case 'REMOVE_USER':
      return {};
    default:
      return state
  }
};