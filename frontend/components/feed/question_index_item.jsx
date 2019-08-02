import React from 'react'
import { Link } from 'react-router-dom';

const QuestionIndexItem = ({question}) => {
    
    return (<div className='card'>
        <Link to={`questions/${question.id}/`}>{question.question}</Link>
    </div>)
}

export default QuestionIndexItem