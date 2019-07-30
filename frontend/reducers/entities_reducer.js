import { combineReducers } from 'redux';

import users from './session_reducer';

export default combineReducers({
  users: users
});
