import { connect } from 'react-redux';
import TopicIndex from './topic_index'


const mapStateToProps = (state, ownProps) => {
    
let qtopics = ownProps.questionTopics.map(qt=>`${qt.id}`)
let availableTopics = Object.values(state.entities.topics).filter(topic=>!qtopics.includes(`${topic.id}`))
    return {
        availableTopics,
    }
}

const mapDispatchToProps = (dispatch) => {

    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicIndex)

