import { connect } from 'react-redux';
import TopicForm from './topic_form'


const mapStateToProps = (state, ownProps) => {

    return {
        question: Object.values(state.entities.questions)[0]
    }
}

const mapDispatchToProps = (dispatch) => {

    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicForm)

