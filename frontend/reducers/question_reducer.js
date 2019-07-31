import {
RECEIVE_ALL_QUESTIONS, 
RECEIVE_QUESTION
} from '../actions/question_actions'

const _nullQuestions = Object.freeze({})

const questionReducer = (state = _nullQuestions, action) => {
    Object.freeze(state)
    switch(action.type){
        case RECEIVE_ALL_QUESTIONS:
            return Object.assign({},state, action.questions)
        case RECEIVE_QUESTION:
            let qst = action.question
            return Object.assign({},state, {[qst.id]: qst})
        default:
            return state
    }
}

export default questionReducer