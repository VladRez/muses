import React from 'react'
import TopicFormContainer from './topic_form_container'
class TopicIndex extends React.Component {

    render() {
        
        let topics = [];
        if (this.props.questionTopics){
            topics = this.props.questionTopics.map(topic=>{
                return <div key={topic.id} className="questionTopicHeaderListItem">
                    <a href="#">{topic.name}</a>
                </div>
            })
        }
        return (<div className="questionTopicHeaderList">
            {topics}
            <TopicFormContainer availableTopics={this.props.availableTopics}/>
        </div>)
    }
}

export default TopicIndex