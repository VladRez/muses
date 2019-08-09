import React from 'react';
import CommentFormContainer from '../comment/comment_form_container'
import CommentIndexContainer from '../comment/comment_index_container'

const AnswerIndexItem = (props) => {
    
    return (
        <div className='pageListItem'>
            <div className='answerBase'>
                <div className="answerHeader answerHeaderContent">
                    <div className="answerHeaderContentProfileAvatar">
                        <img src="https://p.jing.fm/clipimg/small/115-1152777_profile-png-man-user-icon.png" />
                    </div>
                    <div className="answerHeaderContentProfileText">
                        <span className="answerHeaderContentItem">
                            {/* <a href="" className="userDetails">{`${props.user.first_name} ${props.user.last_name}`}</a> */}
                            <span className="userDetails">{`${props.user.first_name} ${props.user.last_name}`}</span> 
                        </span>
                        <span className="answerHeaderContentItem">
                            <div className="userFacts">{`Answered ${props.date}`}</div>
                        </span>
                    </div>
                </div>

                <p className="answerContent">
                    {props.answer.answer_body}
                </p>

                <div className="answerActionBar">
                </div>

                <div className="threadedComments">
                    <CommentFormContainer answerId={props.answer.id} />
                    <CommentIndexContainer answerId={props.answer.id} />
                </div>
            </div>


        </div>
    )
}

export default AnswerIndexItem