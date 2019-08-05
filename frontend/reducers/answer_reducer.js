import {
    RECEIVE_QUESTION,
    RECEIVE_ALL_QUESTIONS
    } from '../actions/question_actions'
    
    const _nullQuestions = Object.freeze({})
    
    const answerReducer = (state = _nullQuestions, action) => {
        Object.freeze(state)
        switch(action.type){
            case RECEIVE_QUESTION:
                return Object.assign({},action.payload.answers)
            case RECEIVE_ALL_QUESTIONS:
                return _nullQuestions
            default:
                return state
        }
    }
    
    export default answerReducer