import {connect} from 'react-redux'
import AnswerQuestionForm from './answer_form'
import {createAnswer} from '../../actions/answer_actions'

const mapStateToProps = (state, ownProps) => {
   
    return {
        answer: {answer_body: '', answer_author_id: state.session.id}
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        action: (questionId, answer) => dispatch(createAnswer(questionId, answer))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerQuestionForm)