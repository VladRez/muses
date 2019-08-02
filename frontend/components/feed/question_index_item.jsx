import React from 'react'
import { Link } from 'react-router-dom';

const QuestionIndexItem = ({question}) => {
    
    return (<div className="feedItem">
     
        <Link className='questionText' to={`questions/${question.id}/`}>{question.question}</Link>

    </div>)
}

export default QuestionIndexItem