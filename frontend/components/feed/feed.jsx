import React from 'react'
import QuestionIndexContainer from './question_index_container'
const Feed = (props) => {
    return (<div className="feed">
       <div className="grid">
       <QuestionIndexContainer/>
       </div>
    </div>)
}

export default Feed