import React from 'react';
import CommentFormContainer from '../comment/comment_form_container'
import CommentIndexContainer from '../comment/comment_index_container'

const AnswerIndexItem = (props) => {
    return (
        <div className='pageListItem'>
            <div className="answerBase">
                <div className="answerHeader">
                    <div className="answerHeaderContent">
                        <div className="answerHeaderContentItem">
                            <div className="userName">
                                <a href="">{`${props.user.first_name} ${props.user.last_name}`}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="answerContent">
                    {props.answer.answer_body}
                </p>
            </div>

            <div className="answerActionBar">
            </div>
    
            <div className="threadedComments">
              <CommentFormContainer />
              <CommentIndexContainer answerId={props.answer.id}/>
            </div>

        </div>
    )
}

export default AnswerIndexItem