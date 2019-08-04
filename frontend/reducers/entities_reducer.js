import { combineReducers } from 'redux';

import users from './user_reducer'
import questions from './question_reducer'
import answers from './answer_reducer'
export default combineReducers({
  users,
  questions,
  answers
});
