import {connect} from 'react-redux';
import {fetchQuestion} from '../../actions/question_actions'
import Question from './question'

const mapStateToProps = (state, ownProps) => {
    
    const id = ownProps.match.params.question_id
    const question = state.entities.questions[id];
    
    return {
        question
    }
}


const mapDispatchToProps = (dispatch) => {
    
    return {
        fetchQuestion: (id) => dispatch(fetchQuestion(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)