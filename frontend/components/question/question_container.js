import {connect} from 'react-redux';
import {fetchQuestion, deleteQuestion} from '../../actions/question_actions'
import {fetchTopics} from '../../actions/topic_action'
import Question from './question'

const mapStateToProps = (state, ownProps) => {   
     
    let qId = ownProps.match.params.question_id
    const question = state.entities.questions[qId]
    const answers = Object.values(state.entities.answers)
    const topics = state.entities.topics
    const currentUserId = state.session['id']
    
    return {
        question,
        answers,
        topics,
        currentUserId
    }
}


const mapDispatchToProps = (dispatch) => {
    
    return {
        fetchQuestion: (id) => dispatch(fetchQuestion(id)),
        fetchTopics: () => dispatch(fetchTopics()),
        deleteQuestion: (id)=>dispatch(deleteQuestion(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)