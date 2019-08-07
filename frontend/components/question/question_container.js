import {connect} from 'react-redux';
import {fetchQuestion} from '../../actions/question_actions'
import {fetchTopics} from '../../actions/topic_action'
import Question from './question'

const mapStateToProps = (state, ownProps) => {    
    let qId = ownProps.match.params.question_id
    const question = state.entities.questions[qId]
    const answers = Object.values(state.entities.answers)
    const questionTopics = (question !== undefined) && (question.topics !== undefined) ? question.topics.map(t=>state.entities.topics[t]) : []

    return {
        question,
        answers,
        questionTopics
    }
}


const mapDispatchToProps = (dispatch) => {
    
    return {
        fetchQuestion: (id) => dispatch(fetchQuestion(id)),
        fetchTopics: () => dispatch(fetchTopics())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)