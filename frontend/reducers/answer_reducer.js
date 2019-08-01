import {
    RECEIVE_QUESTION
    } from '../actions/question_actions'
    
    const _nullQuestions = Object.freeze({})
    
    const answerReducer = (state = _nullQuestions, action) => {
        Object.freeze(state)
        switch(action.type){
            case RECEIVE_QUESTION:
                return Object.assign({},action.payload.answers)
            default:
                return state
        }
    }
    
    export default answerReducer