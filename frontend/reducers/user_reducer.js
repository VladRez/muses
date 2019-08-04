import {
    RECEIVE_ALL_QUESTIONS, 
    RECEIVE_QUESTION,
    } from '../actions/question_actions'
    
    const _nullQuestions = Object.freeze({})
    
    const questionReducer = (state = _nullQuestions, action) => {
        Object.freeze(state)
        switch(action.type){
            case RECEIVE_ALL_QUESTIONS:
                let users = {}
                    Object.values(action.questions).forEach(question=>{
                        users[question.question_author_id] = {
                            id: question.question_author_id,
                            full_name: question.question_author_full_name
                        }
                    })
                return Object.assign({}, users)
            case RECEIVE_QUESTION:
                return {}
            default:
                return state
        }
    }
    
    export default questionReducer