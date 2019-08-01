import * as APIUtil from '../util/question_api_util';

export const RECEIVE_ALL_QUESTIONS = 'RECEIVE_ALL_QUESTIONS'
export const RECEIVE_QUESTION = 'RECEIVE_QUESTION'
export const RECEIVE_QUESTION_ERRORS = 'RECEIVE_QUESTION_ERRORS'


export const receiveAllQuestions = (questions) =>({
    type: RECEIVE_ALL_QUESTIONS,
    questions: questions
})

export const receiveQuestion = (question) =>({
    type: RECEIVE_QUESTION,
    question
})

export const receiveQuestionErrors = (errors) =>({
    type: RECEIVE_QUESTION_ERRORS,
    errors
})

export const fetchQuestions = () => (dispatch) =>(
    APIUtil.fetchQuestions().then(questions=>(dispatch(receiveAllQuestions(questions))),
         err=>(dispatch(receiveQuestionErrors(err))))
);

export const fetchQuestion = (id) => (dispatch) =>(
    APIUtil.fetchQuestion(id).then(question=>(dispatch(receiveQuestion(question))),
        err=>(dispatch(receiveQuestionErrors(err))))
)

export const createQuestion = (question) => (dispatch =>(
    APIUtil.createQuestion(question).then(question=>(dispatch(receiveQuestion(question)), 
    err=>(dispatch(receiveQuestionErrors(err)))))
))