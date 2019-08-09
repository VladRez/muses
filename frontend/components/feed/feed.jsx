import React from 'react'
import QuestionIndexContainer from './question_index_container'
import TopicFeedContainer from './topic_feed_container'
import { logout } from '../../util/session_api_util'
import { Redirect } from 'react-router-dom'



const Feed = (props) => {
    return (<div className="feed">
        <div className="contentWrapper">
            <div className="gridPage">
                <TopicFeedContainer discussedTopics={props.discussedTopics}/>
                <QuestionIndexContainer />
            </div>
        </div>
    </div>)
}

export default Feed