import * as APIUtil from '../util/answer_api_util'
import * as questionActions from '../actions/question_actions'

export const createAnswer = (questionId, answer) => (dispatch=>(
    APIUtil.createQuestionAnswer(questionId, answer).then(question=>(
        dispatch(questionActions.receiveQuestion(question))
    ))
))
