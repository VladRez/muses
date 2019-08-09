import * as APIUtil from "../util/comment_api_util";
import * as questionActions from "../actions/question_actions";

export const createComment = (questionId, answerId, comment) => dispatch =>
  APIUtil.createAnswerComment(questionId, answerId, comment).then(question =>
    dispatch(questionActions.receiveQuestion(question))
  );
