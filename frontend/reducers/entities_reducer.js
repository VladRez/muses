import { combineReducers } from 'redux';


import questions from './question_reducer'
import answers from './answer_reducer'
export default combineReducers({
  questions,
  answers
});
