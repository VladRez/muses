import React from 'react';

const AnswerIndexItem = (props) => {

    return (
      <div className='card'><h4>
          {props.answer.answer_body}
          </h4></div>
    )
}

export default AnswerIndexItem