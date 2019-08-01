import {connect} from 'react-redux';
import {fetchQuestion} from '../../actions/question_actions'
import Question from './question'

const mapStateToProps = (state, ownProps) => {    
    let qId = ownProps.match.params.question_id
    const question = state.entities.questions[qId]
    
    const answers = Object.values(state.entities.answers)

    
    return {
        question,
        answers
    }
}


const mapDispatchToProps = (dispatch) => {
    
    return {
        fetchQuestion: (id) => dispatch(fetchQuestion(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)