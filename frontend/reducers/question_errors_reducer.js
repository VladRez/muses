import {
    RECEIVE_QUESTION_ERRORS,
    RECEIVE_QUESTION
  } from '../actions/question_actions';
  
  export default (state = [], action) => {
    Object.freeze(state);
    switch (action.type) {
      case RECEIVE_QUESTION_ERRORS:  
            
        return action.errors;
      case RECEIVE_QUESTION:
        return [];
      default:
        return state;
    }
  };
  