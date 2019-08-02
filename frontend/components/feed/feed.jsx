import React from 'react'
import QuestionIndexContainer from './question_index_container'
import {logout} from '../../util/session_api_util'
import {Redirect} from 'react-router-dom'



const Feed = (props) => {
    return (<div className="feed">
        <button onClick={()=>{logout(); return <Redirect to='/login'/>}}>Logout</button>
       <div className="grid">
       <QuestionIndexContainer/>
       </div>
    </div>)
}

export default Feed