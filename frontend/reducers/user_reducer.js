import {
  RECEIVE_ALL_QUESTIONS,
  RECEIVE_QUESTION
} from "../actions/question_actions";

const _nullQuestions = Object.freeze({});

const questionReducer = (state = _nullQuestions, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ALL_QUESTIONS:
      let users = {};

      Object.values(action.questions).forEach(question => {
        users[question.question_author_id] = {
          id: question.question_author_id,
          first_name: question.question_author_first_name,
          last_name: question.question_author_last_name
        };
      });
      return Object.assign({}, users);
    case RECEIVE_QUESTION:
      return Object.assign({}, action.payload.users);
    default:
      return state;
  }
};

export default questionReducer;
