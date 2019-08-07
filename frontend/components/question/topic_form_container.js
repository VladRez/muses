import { connect } from 'react-redux';
import TopicForm from './topic_form'
import {updateQuestion} from '../../actions/question_actions'

const mapStateToProps = (state, ownProps) => {

    return {
        question: Object.values(state.entities.questions)[0]
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        action: (question) => dispatch(updateQuestion(question))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicForm)

