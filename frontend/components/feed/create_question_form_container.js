import {connect} from 'react-redux'
import CreateQuestionForm from './create_question_form'
import {createQuestion} from '../../actions/question_actions'

const mapStateToProps = (state, ownProps) => {
    let createdQuestion = undefined;
    
    if (state.entities.questions.id !== undefined){
        state.entities.questions
    }
    return {
        question: {question: '', question_author_id: state.session.id},
        createdQuestion
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        action: (question) => dispatch(createQuestion(question))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestionForm)