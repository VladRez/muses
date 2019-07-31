import {connect} from 'react-redux'
import { receiveAllQuestions} from '../../actions/question_actions'
import Feed from './feed'

const mapStateToProps = (state, ownProps) => {
    
    return { 
       
    }
}

const mapDispatchToProps = (disptach) => {

    return {
        fetchQuestions: () => dispatch(receiveAllQuestions())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)