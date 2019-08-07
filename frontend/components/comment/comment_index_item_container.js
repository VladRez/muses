import {connect} from 'react-redux'
import {timeDate} from '../../util/selector_util'
import CommentIndexItem from './comment_index_item'

const mapStateToProps = (state, ownProps) => {
    let userId = ownProps.comment.comment_author_id
    let user = state.entities.users[userId]
    let date = timeDate(ownProps.comment.created_at)
    return { 
      user,
      date
    }
}

const mapDispatchToProps = (disptach) => {

    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentIndexItem)