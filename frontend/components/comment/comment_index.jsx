import React from 'react'
import CommentIndexItemContainer from './comment_index_item_container'
class CommentIndex extends React.Component {


    render() {
        
        const commentList = this.props.comments.map(comment=>{
            return <CommentIndexItemContainer key={comment.id} comment={comment}/>
        });
        return (<div className="commentListWrapper">
            {commentList}
        </div>)
    }
}

export default CommentIndex
