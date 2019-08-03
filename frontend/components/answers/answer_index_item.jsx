import React from 'react';

const AnswerIndexItem = (props) => {

    return (
        <div className='pageListItem'>
            <div className="answerBase">
                <p className="answerContent">
                    {props.answer.answer_body}
                </p>
            </div>
        </div>
    )
}

export default AnswerIndexItem