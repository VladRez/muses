import React from 'react'
import QuestionIndexContainer from './question_index_container'
import { logout } from '../../util/session_api_util'
import { Redirect } from 'react-router-dom'



const Feed = (props) => {
    return (<div className="feed">
        <div className="contentWRapper">
            <div className="gridPage">
                <div className="layout3ColCenter">
                    <QuestionIndexContainer />
                </div>
            </div>
        </div>
    </div>)
}

export default Feed