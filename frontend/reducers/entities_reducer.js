import { combineReducers } from 'redux';

import users from './user_reducer'
import questions from './question_reducer'
import answers from './answer_reducer'
import comments from './comment_reducer'

export default combineReducers({
  comments,
  users,
  questions,
  answers
});
