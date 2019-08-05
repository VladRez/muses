import {
RECEIVE_ALL_QUESTIONS, 
RECEIVE_QUESTION,
FILTERED_QUESTIONS
} from '../actions/question_actions'

const _nullQuestions = Object.freeze({})

const questionReducer = (state = _nullQuestions, action) => {
    Object.freeze(state)
    switch(action.type){
        case FILTERED_QUESTIONS:
            return ({}, action.question)
        case RECEIVE_ALL_QUESTIONS:
            return Object.assign({}, action.questions)
        case RECEIVE_QUESTION:
            let qst = action.payload.question
            let id = qst.id
            return Object.assign({}, {[id]: qst})
        default:
            return state
    }
}

export default questionReducer