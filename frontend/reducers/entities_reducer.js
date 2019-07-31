import { combineReducers } from 'redux';

import users from './session_reducer';
import questions from './question_reducer'
export default combineReducers({
  users: users,
  questions: questions
});
