import {connect} from 'react-redux'
import { receiveAllQuestions} from '../../actions/question_actions'
import QuestionIndex from './question_index'

const mapStateToProps = (state, ownProps) => {
    
    return { 
     questions: Object.values(state.entities.questions)
    }
}

const mapDispatchToProps = (disptach) => {

    return {
     fetchQuestions: ()=>disptach(receiveAllQuestions()) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionIndex)