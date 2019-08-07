import {connect} from 'react-redux';
import {fetchQuestion} from '../../actions/question_actions'
import {fetchTopics} from '../../actions/topic_action'
import Question from './question'

const mapStateToProps = (state, ownProps) => {   
     
    let qId = ownProps.match.params.question_id
    const question = state.entities.questions[qId]
    const answers = Object.values(state.entities.answers)
    const topics = state.entities.topics
    return {
        question,
        answers,
        topics
    }
}


const mapDispatchToProps = (dispatch) => {
    
    return {
        fetchQuestion: (id) => dispatch(fetchQuestion(id)),
        fetchTopics: () => dispatch(fetchTopics())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)