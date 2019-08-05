import {connect} from 'react-redux'

import AnswerIndexItem from './answer_index_item'

const mapStateToProps = (state, ownProps) => {
    
    return { 
        user: state.entities.users[ownProps.answer.answer_author_id]
    }
}

const mapDispatchToProps = (disptach) => {

    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerIndexItem)