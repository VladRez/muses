import React from 'react';

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
        </div>
    )
}

export default AnswerIndexItem