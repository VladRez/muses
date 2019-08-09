import React from 'react'
import TopicFormContainer from './topic_form_container'
import { withRouter } from "react-router";

class TopicIndex extends React.Component {
    filterQByTopic(name) {
        // let params = {field: 'topic', value: `${id}`}
        // this.props.history.push('/')
        // // this.forceUpdate()
        // this.props.fetchQuestions(params)
        
        document.getElementById('headerSearchBar').fire
    }
    render() {
        
        let topics = [];
        if (this.props.questionTopics){
            topics = this.props.questionTopics.map(topic=>{
                return <div key={topic.id} className="questionTopicHeaderListItem">
                    <span>{topic.name}</span>
                </div>
            })
        }
        return (<div className="questionTopicHeaderList">
            {topics}
            <TopicFormContainer availableTopics={this.props.availableTopics}/>
        </div>)
    }
}

export default withRouter(TopicIndex)