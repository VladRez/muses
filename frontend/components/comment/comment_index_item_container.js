import {connect} from 'react-redux'

import CommentIndexItem from './comment_index_item'

const mapStateToProps = (state, ownProps) => {
    let userId = ownProps.comment.comment_author_id
    let user = state.entities.users[userId]
    return { 
      user
    }
}

const mapDispatchToProps = (disptach) => {

    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentIndexItem)