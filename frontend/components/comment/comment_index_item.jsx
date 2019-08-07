import React from 'react';

const CommentIndexItem = (props) => {
    
    let userFullName = `${props.user.first_name} ${props.user.last_name}`
    let commentBody = props.comment.comment_body
    
    return (
        <div className="comment">
            <div className="commentContents">
                <div className="commentHeader">
                    <div className="commentProfileAvatar">
                        <img src="https://p.jing.fm/clipimg/small/115-1152777_profile-png-man-user-icon.png" />
                    </div>
                    <div className="commentDetails">
                        <span className="commentProfileFullName">{userFullName}</span>
                        <div className="commentMetaData">{`Updated ${props.date}`}</div>
                    </div>
                </div>
            </div>
            <span className="commentBodyText">{commentBody}</span>
        </div>
    )
}

export default CommentIndexItem